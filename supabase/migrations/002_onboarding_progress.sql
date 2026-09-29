-- JL Trainer Armadura: perfil personalizado e pontuação inicial.
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists water_goal_ml integer;
alter table public.profiles add column if not exists bmi numeric;
alter table public.profiles add column if not exists points integer not null default 0;
create index if not exists profiles_points_idx on public.profiles(points desc);
