-- Integração incremental do cadastro com o plano alimentar e lista de compras.
alter table public.profiles add column if not exists training_frequency smallint default 3;
alter table public.profiles add column if not exists household_size smallint not null default 1;
alter table public.profiles add column if not exists foods_to_avoid text;

comment on column public.profiles.training_frequency is
  'Número habitual de dias de treino por semana.';
comment on column public.profiles.household_size is
  'Número de pessoas para quem a lista de compras deve calcular porções.';
comment on column public.profiles.foods_to_avoid is
  'Alimentos que a pessoa não consome, separado de alergias clínicas.';

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(
    id,full_name,email,age,current_weight,initial_weight,height,sex,
    training_level,goal,training_time,birth_date,daily_activity,
    training_intensity,training_days_count,training_frequency,training_duration,
    training_location,food_budget,food_preferences,available_foods,foods_to_avoid,
    household_size,allergies,supplements,modalities,health_consent,terms_accepted_at
  ) values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name','Cliente'), new.email,
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
    nullif(new.raw_user_meta_data->>'terms_accepted_at','')::timestamptz
  ) on conflict(id) do update set
    full_name=excluded.full_name,
    email=excluded.email,
    training_frequency=coalesce(public.profiles.training_frequency,excluded.training_frequency),
    household_size=coalesce(public.profiles.household_size,excluded.household_size),
    foods_to_avoid=coalesce(public.profiles.foods_to_avoid,excluded.foods_to_avoid);
  return new;
end; $$;
