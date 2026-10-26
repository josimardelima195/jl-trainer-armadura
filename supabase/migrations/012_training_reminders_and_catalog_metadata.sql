-- Preferências de horário para treinos e lembretes.
alter table public.profiles add column if not exists training_time time;
alter table public.profiles add column if not exists training_days text[] default array['Seg','Qua','Sex'];
alter table public.profiles add column if not exists reminders_enabled boolean not null default false;
alter table public.profiles add column if not exists reminder_types text[] default array['treino','agua'];
alter table public.exercises add column if not exists primary_muscles text[] default '{}';
alter table public.exercises add column if not exists secondary_muscles text[] default '{}';
alter table public.exercises add column if not exists level text default 'beginner';
alter table public.exercises add column if not exists goal_tags text[] default '{}';
alter table public.exercises add column if not exists media_license text;

comment on column public.exercises.media_license is 'Origem/licença da mídia; nunca usar mídia sem licença compatível.';
comment on column public.profiles.training_time is 'Horário local escolhido pelo utilizador para o treino.';
comment on column public.profiles.training_days is 'Dias locais escolhidos pelo utilizador, por exemplo Seg, Qua e Sex.';
