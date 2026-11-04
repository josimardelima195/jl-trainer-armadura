-- Perfil nutricional opcional, mantido separado para preservar instalações existentes.
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists daily_activity text default 'moderate';
alter table public.profiles add column if not exists training_intensity text default 'moderate';
alter table public.profiles add column if not exists training_days_count int default 3;
alter table public.profiles add column if not exists training_duration int default 45;
alter table public.profiles add column if not exists food_budget text default 'medium';
alter table public.profiles add column if not exists food_preferences text;
alter table public.profiles add column if not exists food_dislikes text;
alter table public.profiles add column if not exists allergies text;
alter table public.profiles add column if not exists dietary_restrictions text;
alter table public.profiles add column if not exists available_foods text;
alter table public.profiles add column if not exists supplements text[] default '{}';
alter table public.profiles add column if not exists modalities text[] default '{}';

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name,email,age,current_weight,initial_weight,height,sex,training_level,goal,training_time,birth_date,daily_activity,training_intensity,training_days_count,training_duration,food_budget,food_preferences,allergies,supplements,modalities,health_consent,terms_accepted_at)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name','Cliente'),new.email,nullif(new.raw_user_meta_data->>'age','')::numeric,nullif(new.raw_user_meta_data->>'current_weight','')::numeric,nullif(new.raw_user_meta_data->>'initial_weight','')::numeric,nullif(new.raw_user_meta_data->>'height','')::numeric,nullif(new.raw_user_meta_data->>'sex',''),coalesce(nullif(new.raw_user_meta_data->>'training_level',''),'beginner'),nullif(new.raw_user_meta_data->>'goal',''),nullif(new.raw_user_meta_data->>'training_time','')::time,nullif(new.raw_user_meta_data->>'birth_date','')::date,coalesce(nullif(new.raw_user_meta_data->>'daily_activity',''),'moderate'),coalesce(nullif(new.raw_user_meta_data->>'training_intensity',''),'moderate'),coalesce(nullif(new.raw_user_meta_data->>'training_days_count','')::int,3),coalesce(nullif(new.raw_user_meta_data->>'training_duration','')::int,45),coalesce(nullif(new.raw_user_meta_data->>'food_budget',''),'medium'),nullif(new.raw_user_meta_data->>'food_preferences',''),nullif(new.raw_user_meta_data->>'allergies',''),coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'supplements','[]'::jsonb))), '{}'),coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'modalities','[]'::jsonb))), '{}'),coalesce((new.raw_user_meta_data->>'health_consent')::boolean,false),nullif(new.raw_user_meta_data->>'terms_accepted_at','')::timestamptz)
  on conflict(id) do update set full_name=excluded.full_name,email=excluded.email;
  return new;
end; $$;
