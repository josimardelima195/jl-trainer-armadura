-- Preferências de local/equipamento usadas para gerar o programa inicial.
-- A escolha é informativa e pode ser alterada pelo cliente no Perfil.
alter table public.profiles
  add column if not exists training_location text not null default 'casa'
  check (training_location in ('casa','ginasio','ambos'));

comment on column public.profiles.training_location is
  'Local principal preferido para treino: casa, ginasio ou ambos.';

-- Mantém a preferência escolhida durante o cadastro via Supabase Auth.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(
    id,full_name,email,age,current_weight,initial_weight,height,sex,
    training_level,goal,training_time,birth_date,daily_activity,
    training_intensity,training_days_count,training_duration,training_location,
    food_budget,food_preferences,allergies,supplements,modalities,
    health_consent,terms_accepted_at
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
    coalesce(nullif(new.raw_user_meta_data->>'training_duration','')::int,45),
    coalesce(nullif(new.raw_user_meta_data->>'training_location',''),'casa'),
    coalesce(nullif(new.raw_user_meta_data->>'food_budget',''),'medium'),
    nullif(new.raw_user_meta_data->>'food_preferences',''),
    nullif(new.raw_user_meta_data->>'allergies',''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'supplements','[]'::jsonb))), '{}'),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'modalities','[]'::jsonb))), '{}'),
    coalesce((new.raw_user_meta_data->>'health_consent')::boolean,false),
    nullif(new.raw_user_meta_data->>'terms_accepted_at','')::timestamptz
  ) on conflict(id) do update set
    full_name=excluded.full_name,
    email=excluded.email,
    training_location=coalesce(public.profiles.training_location,excluded.training_location);
  return new;
end; $$;

