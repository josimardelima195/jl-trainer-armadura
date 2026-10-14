-- Salas temporárias para batalhas WebRTC. O vídeo não é guardado; o Supabase apenas coordena a sala.
create table if not exists public.battle_rooms (
 id uuid primary key default gen_random_uuid(),
 code text unique not null check(code ~ '^[A-Z0-9]{6}$'),
 host_user_id uuid not null references public.profiles(id) on delete cascade,
 exercise_type text not null check(exercise_type in ('flexoes','agachamentos','prancha')),
 status text not null default 'open' check(status in ('open','active','closed')),
 created_at timestamptz not null default now()
);
alter table public.battle_rooms enable row level security;
drop policy if exists battle_rooms_read on public.battle_rooms;
drop policy if exists battle_rooms_insert on public.battle_rooms;
drop policy if exists battle_rooms_update on public.battle_rooms;
create policy battle_rooms_read on public.battle_rooms for select using(status='open' or host_user_id=auth.uid() or public.is_staff());
create policy battle_rooms_insert on public.battle_rooms for insert with check(host_user_id=auth.uid());
create policy battle_rooms_update on public.battle_rooms for update using(host_user_id=auth.uid() or public.is_staff()) with check(host_user_id=auth.uid() or public.is_staff());
create index if not exists battle_rooms_open_code_idx on public.battle_rooms(code) where status='open';
-- Limpa salas abandonadas depois de um dia, sem tocar nos resultados históricos.
delete from public.battle_rooms where created_at < now() - interval '1 day' and status='open';
