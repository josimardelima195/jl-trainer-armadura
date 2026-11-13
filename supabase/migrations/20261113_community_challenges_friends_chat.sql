alter table public.challenge_completions
  add column if not exists proof_path text,
  add column if not exists proof_mime_type text,
  add column if not exists caption text;

create index if not exists challenge_completions_feed_idx
  on public.challenge_completions (created_at desc);

alter table public.challenge_completions enable row level security;
drop policy if exists challenge_completions_community_read on public.challenge_completions;
create policy challenge_completions_community_read
  on public.challenge_completions for select to authenticated
  using (auth.uid() is not null);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friendships_no_self check (requester_id <> addressee_id),
  constraint friendships_unique_direction unique (requester_id, addressee_id)
);
create unique index if not exists friendships_unique_pair
  on public.friendships (least(requester_id, addressee_id), greatest(requester_id, addressee_id));
create index if not exists friendships_requester_idx on public.friendships (requester_id, status);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id, status);
alter table public.friendships enable row level security;
drop policy if exists friendships_read_participant on public.friendships;
create policy friendships_read_participant
  on public.friendships for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
drop policy if exists friendships_insert_requester on public.friendships;
create policy friendships_insert_requester
  on public.friendships for insert to authenticated
  with check (auth.uid() = requester_id and status = 'pending' and requester_id <> addressee_id);
drop policy if exists friendships_update_recipient on public.friendships;
create policy friendships_update_recipient
  on public.friendships for update to authenticated
  using (auth.uid() = addressee_id and status = 'pending')
  with check (auth.uid() = addressee_id and status in ('accepted','rejected'));
drop policy if exists friendships_delete_participant on public.friendships;
create policy friendships_delete_participant
  on public.friendships for delete to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint community_messages_no_self check (sender_id <> recipient_id)
);
create index if not exists community_messages_thread_idx
  on public.community_messages (sender_id, recipient_id, created_at);
alter table public.community_messages enable row level security;
drop policy if exists community_messages_read_friends on public.community_messages;
create policy community_messages_read_friends
  on public.community_messages for select to authenticated
  using (
    (auth.uid() = sender_id or auth.uid() = recipient_id)
    and exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = community_messages.sender_id and f.addressee_id = community_messages.recipient_id)
          or (f.requester_id = community_messages.recipient_id and f.addressee_id = community_messages.sender_id)
        )
    )
  );
drop policy if exists community_messages_insert_friends on public.community_messages;
create policy community_messages_insert_friends
  on public.community_messages for insert to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = community_messages.sender_id and f.addressee_id = community_messages.recipient_id)
          or (f.requester_id = community_messages.recipient_id and f.addressee_id = community_messages.sender_id)
        )
    )
  );
drop policy if exists community_messages_update_recipient on public.community_messages;
create policy community_messages_update_recipient
  on public.community_messages for update to authenticated
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);
drop policy if exists community_messages_delete_sender on public.community_messages;
create policy community_messages_delete_sender
  on public.community_messages for delete to authenticated
  using (auth.uid() = sender_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('challenge-proofs','challenge-proofs',false,104857600,array['video/mp4','video/webm','video/quicktime']::text[])
on conflict (id) do update
set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists challenge_proofs_insert_own on storage.objects;
create policy challenge_proofs_insert_own
  on storage.objects for insert to authenticated
  with check (bucket_id = 'challenge-proofs' and (auth.uid())::text = (storage.foldername(name))[1]);
drop policy if exists challenge_proofs_read_community on storage.objects;
create policy challenge_proofs_read_community
  on storage.objects for select to authenticated
  using (bucket_id = 'challenge-proofs' and auth.uid() is not null);
drop policy if exists challenge_proofs_delete_own on storage.objects;
create policy challenge_proofs_delete_own
  on storage.objects for delete to authenticated
  using (bucket_id = 'challenge-proofs' and (auth.uid())::text = (storage.foldername(name))[1]);

drop policy if exists profile_photos_community_read on storage.objects;
create policy profile_photos_community_read
  on storage.objects for select to authenticated
  using (bucket_id = 'profile-photos' and auth.uid() is not null);
