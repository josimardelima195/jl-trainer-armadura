-- JL Trainer: modalidades canônicas, desafios diários e ranking comunitário.
update public.profiles set modality='Bulking (ganho de massa)' where lower(coalesce(modality,'')) in ('bulking','ganho de massa');
update public.profiles set modality='Definição (cuting)' where lower(coalesce(modality,'')) in ('definição','definicao');
update public.profiles set modality='Musculação' where lower(coalesce(modality,''))='musculação';
update public.modalities set active=false where lower(name) in ('ganho de massa','bulking','definição','treino em casa','ginásio','ginasio');
insert into public.modalities(name,description,sort_order) values
 ('Bulking (ganho de massa)','Mais volume e progressão para ganho de massa',2),
 ('Definição (cuting)','Definição com força e condicionamento',3)
on conflict(name) do update set description=excluded.description,active=true;

create table if not exists public.daily_challenges (
  id text primary key,
  title text not null,
  description text not null,
  points int not null default 10 check(points > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.challenge_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id text not null references public.daily_challenges(id) on delete cascade,
  completed_on date not null default current_date,
  points int not null default 10,
  created_at timestamptz not null default now(),
  unique(user_id,challenge_id,completed_on)
);
insert into public.daily_challenges(id,title,description,points) values
 ('move','Movimente-se hoje','Complete o treino planejado do dia.',25),
 ('water','Hidratação em dia','Registre sua hidratação e mantenha a rotina.',10),
 ('progress','Registre sua evolução','Adicione uma medida ou uma foto privada de progresso.',15),
 ('consistency','Volte amanhã','Mantenha a sequência por mais um dia.',20),
 ('stretch','Mobilidade consciente','Faça 8 minutos de mobilidade sem dor.',10)
on conflict(id) do update set title=excluded.title,description=excluded.description,points=excluded.points,active=true;

alter table public.daily_challenges enable row level security;
alter table public.challenge_completions enable row level security;
drop policy if exists daily_challenges_read on public.daily_challenges;
create policy daily_challenges_read on public.daily_challenges for select using(active=true or public.is_staff());
drop policy if exists own_challenge_completions on public.challenge_completions;
create policy own_challenge_completions on public.challenge_completions for all using(user_id=auth.uid() or public.is_staff()) with check(user_id=auth.uid() or public.is_staff());

create or replace view public.community_leaderboard as
select p.id,
       p.full_name,
       p.avatar_url,
       p.sex,
       coalesce(logs.workout_points,0)+coalesce(ch.points,0) as points,
       coalesce(logs.workouts,0) as workouts,
       coalesce(ch.challenges,0) as challenges
from public.profiles p
left join (
  select user_id,count(*)::int as workouts,(count(*)*10)::int as workout_points
  from public.training_logs group by user_id
) logs on logs.user_id=p.id
left join (
  select user_id,count(*)::int as challenges,sum(points)::int as points
  from public.challenge_completions group by user_id
) ch on ch.user_id=p.id
where p.role='client';
grant select on public.community_leaderboard to authenticated;
grant select on public.daily_challenges to authenticated;
