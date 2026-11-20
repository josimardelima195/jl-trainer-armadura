-- Preserve all existing signup metadata while saving the language selected before account creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  insert into public.profiles(
    id, full_name, email, age, current_weight, initial_weight, height, sex,
    training_level, goal, training_time, birth_date, daily_activity,
    training_intensity, training_days_count, training_frequency,
    training_duration, training_location, food_budget, food_preferences,
    available_foods, foods_to_avoid, household_size, allergies, supplements,
    modalities, health_consent, terms_accepted_at, language, cuisine_preference
  )
  values(
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'Cliente'),
    new.email,
    nullif(new.raw_user_meta_data->>'age','')::numeric,
    nullif(new.raw_user_meta_data->>'current_weight','')::numeric,
    nullif(new.raw_user_meta_data->>'initial_weight','')::numeric,
    nullif(new.raw_user_meta_data->>'height','')::numeric,
    nullif(new.raw_user_meta_data->>'sex',''),
    coalesce(nullif(new.raw_user_meta_data->>'training_level',''),'beginner'),
    nullif(new.raw_user_meta_data->>'goal',''),
    nullif(new.raw_user_meta_data->>'training_time','')::time,
    nullif(new.raw_user_meta_data->>'birth_date','')::date,
    coalesce(nullif(new.raw_user_meta_data->>'daily_activity',''),'moderate'),
    coalesce(nullif(new.raw_user_meta_data->>'training_intensity',''),'moderate'),
    coalesce(nullif(new.raw_user_meta_data->>'training_days_count','')::int,3),
    coalesce(nullif(new.raw_user_meta_data->>'training_frequency','')::int,3),
    coalesce(nullif(new.raw_user_meta_data->>'training_duration','')::int,45),
    coalesce(nullif(new.raw_user_meta_data->>'training_location',''),'casa'),
    coalesce(nullif(new.raw_user_meta_data->>'food_budget',''),'medium'),
    nullif(new.raw_user_meta_data->>'food_preferences',''),
    nullif(new.raw_user_meta_data->>'available_foods',''),
    nullif(new.raw_user_meta_data->>'foods_to_avoid',''),
    coalesce(nullif(new.raw_user_meta_data->>'household_size','')::int,1),
    nullif(new.raw_user_meta_data->>'allergies',''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'supplements','[]'::jsonb))), '{}'),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'modalities','[]'::jsonb))), '{}'),
    coalesce((new.raw_user_meta_data->>'health_consent')::boolean,false),
    nullif(new.raw_user_meta_data->>'terms_accepted_at','')::timestamptz,
    case
      when new.raw_user_meta_data->>'language' in ('pt','en','fr','es','zh','hi')
        then new.raw_user_meta_data->>'language'
      else 'pt'
    end,
    case
      when new.raw_user_meta_data->>'cuisine_preference' in ('mozambican','international','mixed')
        then new.raw_user_meta_data->>'cuisine_preference'
      else 'mixed'
    end
  )
  on conflict(id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    training_frequency = coalesce(public.profiles.training_frequency, excluded.training_frequency),
    household_size = coalesce(public.profiles.household_size, excluded.household_size),
    foods_to_avoid = coalesce(public.profiles.foods_to_avoid, excluded.foods_to_avoid),
    language = case
      when public.profiles.language is null or public.profiles.language = 'pt'
        then excluded.language
      else public.profiles.language
    end,
    cuisine_preference = coalesce(public.profiles.cuisine_preference, excluded.cuisine_preference);

  return new;
end;
$function$;

-- Enforce the Day 30 photo lock in the database as well as in the interface.
create or replace function public.guard_progress_photo_day30()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
declare
  account_created_at timestamptz;
begin
  if coalesce(new.note, '') ~* '(dia[[:space:]]*30|foto[[:space:]]*final)' then
    select p.created_at
      into account_created_at
      from public.profiles p
     where p.id = new.user_id;

    if account_created_at is not null
       and now() < account_created_at + interval '30 days' then
      raise exception using
        errcode = '42501',
        message = 'progress_photo_day_30_locked';
    end if;
  end if;

  return new;
end;
$function$;

drop trigger if exists progress_photo_day30_guard on public.progress_photos;
create trigger progress_photo_day30_guard
before insert or update of user_id, note
on public.progress_photos
for each row
execute function public.guard_progress_photo_day30();
