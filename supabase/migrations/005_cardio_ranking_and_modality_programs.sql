-- JL Trainer Armadura: corrida GPS, pontos e programas distintos por modalidade.
create table if not exists public.cardio_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, kind text not null default 'corrida', started_at timestamptz not null, ended_at timestamptz, duration_seconds integer not null default 0, distance_m numeric not null default 0, avg_speed_kmh numeric not null default 0, route jsonb not null default '[]', created_at timestamptz not null default now());
alter table public.cardio_sessions enable row level security;
drop policy if exists cardio_own on public.cardio_sessions;
create policy cardio_own on public.cardio_sessions for all using(user_id=auth.uid() or public.is_staff()) with check(user_id=auth.uid() or public.is_staff());
create or replace function public.add_training_points() returns trigger language plpgsql security definer set search_path=public as $$ begin update public.profiles set points=coalesce(points,0)+10, updated_at=now() where id=new.user_id; return new; end; $$;
drop trigger if exists training_points_after_insert on public.training_logs;
create trigger training_points_after_insert after insert on public.training_logs for each row execute procedure public.add_training_points();
update public.plans set features='["Exercícios básicos","Registro de peso e progresso","Calendário e metas gerais","Ranking global"]' where tier=0;
update public.plans set features='["Tudo do FREE","Programa de treino organizado por modalidade","Plano de 30 dias","Imagens e instruções","Assistente guiado"]' where tier=1;
update public.plans set features='["Tudo do START","Vídeos e aulas","Plano alimentar educativo","2 mentorias por mês","Corrida e estatísticas GPS"]' where tier=2;
update public.plans set features='["Tudo do PRO","Treino personalizado por objetivo","Chat com coach","Grupo VIP privado","Certificados","Prioridade no suporte"]' where tier=3;
