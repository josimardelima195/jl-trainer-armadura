-- Dados essenciais para personalização e uma conclusão única por dia/programa.
alter table public.profiles add column if not exists training_level text default 'beginner';
alter table public.profiles add column if not exists health_consent boolean not null default false;
alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.training_logs add column if not exists program_day int;
alter table public.training_logs add column if not exists program_modality text;
alter table public.training_logs add column if not exists equipment_mode text;

create unique index if not exists training_logs_one_program_day
on public.training_logs(user_id, program_modality, program_day, equipment_mode)
where program_day is not null and program_modality is not null;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(
    id,full_name,email,age,current_weight,initial_weight,height,sex,
    training_level,goal,training_time,health_consent,terms_accepted_at
  ) values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name','Cliente'),
    new.email,
    nullif(new.raw_user_meta_data->>'age','')::numeric,
    nullif(new.raw_user_meta_data->>'current_weight','')::numeric,
    nullif(new.raw_user_meta_data->>'initial_weight','')::numeric,
    nullif(new.raw_user_meta_data->>'height','')::numeric,
    nullif(new.raw_user_meta_data->>'sex',''),
    coalesce(nullif(new.raw_user_meta_data->>'training_level',''),'beginner'),
    nullif(new.raw_user_meta_data->>'goal',''),
    nullif(new.raw_user_meta_data->>'training_time','')::time,
    coalesce((new.raw_user_meta_data->>'health_consent')::boolean,false),
    nullif(new.raw_user_meta_data->>'terms_accepted_at','')::timestamptz
  ) on conflict(id) do update set
    full_name=excluded.full_name,
    age=coalesce(public.profiles.age,excluded.age),
    current_weight=coalesce(public.profiles.current_weight,excluded.current_weight),
    initial_weight=coalesce(public.profiles.initial_weight,excluded.initial_weight),
    height=coalesce(public.profiles.height,excluded.height),
    sex=coalesce(public.profiles.sex,excluded.sex),
    training_level=coalesce(public.profiles.training_level,excluded.training_level),
    goal=coalesce(public.profiles.goal,excluded.goal),
    training_time=coalesce(public.profiles.training_time,excluded.training_time),
    health_consent=excluded.health_consent,
    terms_accepted_at=coalesce(public.profiles.terms_accepted_at,excluded.terms_accepted_at);
  return new;
end; $$;
