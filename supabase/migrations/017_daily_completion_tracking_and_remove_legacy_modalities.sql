-- Registo diário da conclusão do treino e das refeições por conta.
alter table public.training_logs
  add column if not exists local_date date;

create index if not exists training_logs_user_local_date_idx
  on public.training_logs(user_id, local_date);

create table if not exists public.daily_nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  local_date date not null,
  plan_day smallint not null default 1 check (plan_day between 1 and 30),
  meal_keys text[] not null default '{}',
  expected_meals smallint not null default 0 check (expected_meals >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, local_date)
);

alter table public.daily_nutrition_logs enable row level security;

drop policy if exists daily_nutrition_logs_own on public.daily_nutrition_logs;
create policy daily_nutrition_logs_own
  on public.daily_nutrition_logs
  for all
  using (user_id = auth.uid() or public.is_staff())
  with check (user_id = auth.uid() or public.is_staff());

create index if not exists daily_nutrition_logs_user_local_date_idx
  on public.daily_nutrition_logs(user_id, local_date);

-- Garante a coluna de modalidade nas instalações mais antigas.
alter table public.exercises add column if not exists modality text;

-- Desativa as modalidades retiradas e os treinos que dependem delas.
update public.modalities
set active = false
where lower(trim(name)) in ('karate', 'karatê', 'futsal', 'natação', 'natacao');

update public.workouts w
set active = false
from public.modalities m
where w.modality_id = m.id
  and lower(trim(m.name)) in ('karate', 'karatê', 'futsal', 'natação', 'natacao');

-- Remove apenas exercícios catalogados nessas modalidades; os registos de treino históricos permanecem.
delete from public.workout_exercises we
using public.exercises e
where we.exercise_id = e.id
  and lower(trim(coalesce(e.modality, ''))) in ('karate', 'karatê', 'futsal', 'natação', 'natacao');

delete from public.exercises
where lower(trim(coalesce(modality, ''))) in ('karate', 'karatê', 'futsal', 'natação', 'natacao');

-- Atualiza preferências antigas para uma modalidade ainda disponível, sem apagar o histórico.
update public.profiles
set
  modality = case
    when lower(trim(coalesce(modality, ''))) in ('karate', 'karatê', 'futsal', 'natação', 'natacao')
      then 'Musculação'
    else modality
  end,
  modalities = array(
    select selected
    from unnest(coalesce(modalities, '{}'::text[])) as selected
    where lower(trim(selected)) not in ('karate', 'karatê', 'futsal', 'natação', 'natacao')
  )
where lower(trim(coalesce(modality, ''))) in ('karate', 'karatê', 'futsal', 'natação', 'natacao')
   or exists (
     select 1
     from unnest(coalesce(modalities, '{}'::text[])) as selected
     where lower(trim(selected)) in ('karate', 'karatê', 'futsal', 'natação', 'natacao')
   );
