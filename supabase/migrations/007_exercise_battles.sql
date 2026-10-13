create table if not exists public.exercise_battles (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, exercise_type text not null check(exercise_type in ('flexoes','agachamentos','prancha')), score integer not null default 0 check(score>=0), duration_seconds integer not null default 0, mode text not null default 'camera_assisted', created_at timestamptz not null default now());
alter table public.exercise_battles enable row level security;
drop policy if exists battle_read on public.exercise_battles;
drop policy if exists battle_insert on public.exercise_battles;
create policy battle_read on public.exercise_battles for select using(true);
create policy battle_insert on public.exercise_battles for insert with check(user_id=auth.uid());
