-- Running community, private run photos and 100 km Premium reward.
create table if not exists public.run_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cardio_session_id uuid not null unique references public.cardio_sessions(id) on delete cascade,
  display_name text not null default 'Atleta',
  avatar_url text,
  caption text not null default '',
  photo_path text,
  route_shape jsonb not null default '[]'::jsonb,
  distance_m numeric not null default 0,
  duration_seconds integer not null default 0,
  avg_speed_kmh numeric not null default 0,
  pace_seconds_per_km integer not null default 0,
  created_at timestamptz not null default now(),
  constraint run_posts_caption_length check (char_length(caption) <= 280),
  constraint run_posts_route_shape_array check (jsonb_typeof(route_shape) = 'array')
);
create index if not exists run_posts_created_at_idx on public.run_posts(created_at desc);
create index if not exists run_posts_user_created_idx on public.run_posts(user_id, created_at desc);
alter table public.run_posts enable row level security;
grant select, insert, update, delete on public.run_posts to authenticated;
drop policy if exists run_posts_read_community on public.run_posts;
create policy run_posts_read_community on public.run_posts for select to authenticated using ((select auth.uid()) is not null);
drop policy if exists run_posts_insert_own on public.run_posts;
create policy run_posts_insert_own on public.run_posts for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists run_posts_update_own on public.run_posts;
create policy run_posts_update_own on public.run_posts for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists run_posts_delete_own on public.run_posts;
create policy run_posts_delete_own on public.run_posts for delete to authenticated using (user_id = (select auth.uid()));

create or replace function public.set_run_post_snapshot()
returns trigger language plpgsql security definer set search_path = public
as $$
declare v_session public.cardio_sessions%rowtype; v_profile public.profiles%rowtype;
begin
  if auth.uid() is null or new.user_id <> auth.uid() then raise exception 'run_post_owner_mismatch'; end if;
  select * into v_session from public.cardio_sessions
    where id = new.cardio_session_id and user_id = auth.uid() and ended_at is not null;
  if not found then raise exception 'completed_run_not_found'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  new.display_name := coalesce(nullif(trim(v_profile.full_name), ''), 'Atleta');
  new.avatar_url := v_profile.avatar_url;
  new.distance_m := v_session.distance_m;
  new.duration_seconds := v_session.duration_seconds;
  new.avg_speed_kmh := v_session.avg_speed_kmh;
  new.pace_seconds_per_km := case when v_session.distance_m > 0 then round(v_session.duration_seconds * 1000.0 / v_session.distance_m)::integer else 0 end;
  if new.photo_path is not null and split_part(new.photo_path, '/', 1) <> auth.uid()::text then raise exception 'run_photo_owner_mismatch'; end if;
  if jsonb_typeof(new.route_shape) <> 'array' then new.route_shape := '[]'::jsonb; end if;
  return new;
end;
$$;
revoke all on function public.set_run_post_snapshot() from public, anon, authenticated;
drop trigger if exists run_posts_snapshot_before_write on public.run_posts;
create trigger run_posts_snapshot_before_write before insert or update of user_id, cardio_session_id, photo_path, route_shape on public.run_posts for each row execute function public.set_run_post_snapshot();

create table if not exists public.run_post_likes (
  post_id uuid not null references public.run_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists run_post_likes_post_idx on public.run_post_likes(post_id);
alter table public.run_post_likes enable row level security;
grant select, insert, delete on public.run_post_likes to authenticated;
drop policy if exists run_post_likes_read on public.run_post_likes;
create policy run_post_likes_read on public.run_post_likes for select to authenticated using ((select auth.uid()) is not null);
drop policy if exists run_post_likes_insert_own on public.run_post_likes;
create policy run_post_likes_insert_own on public.run_post_likes for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists run_post_likes_delete_own on public.run_post_likes;
create policy run_post_likes_delete_own on public.run_post_likes for delete to authenticated using (user_id = (select auth.uid()));

create table if not exists public.run_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.run_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null default 'Atleta',
  avatar_url text,
  body text not null check (char_length(trim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists run_post_comments_post_created_idx on public.run_post_comments(post_id, created_at desc);
alter table public.run_post_comments enable row level security;
grant select, insert, delete on public.run_post_comments to authenticated;
drop policy if exists run_post_comments_read on public.run_post_comments;
create policy run_post_comments_read on public.run_post_comments for select to authenticated using ((select auth.uid()) is not null);
drop policy if exists run_post_comments_insert_own on public.run_post_comments;
create policy run_post_comments_insert_own on public.run_post_comments for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists run_post_comments_delete_own on public.run_post_comments;
create policy run_post_comments_delete_own on public.run_post_comments for delete to authenticated using (user_id = (select auth.uid()));

create or replace function public.set_run_comment_snapshot()
returns trigger language plpgsql security definer set search_path = public
as $$
declare v_profile public.profiles%rowtype;
begin
  if auth.uid() is null or new.user_id <> auth.uid() then raise exception 'run_comment_owner_mismatch'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  new.display_name := coalesce(nullif(trim(v_profile.full_name), ''), 'Atleta');
  new.avatar_url := v_profile.avatar_url;
  return new;
end;
$$;
revoke all on function public.set_run_comment_snapshot() from public, anon, authenticated;
drop trigger if exists run_comments_snapshot_before_write on public.run_post_comments;
create trigger run_comments_snapshot_before_write before insert or update of user_id on public.run_post_comments for each row execute function public.set_run_comment_snapshot();

create table if not exists public.run_reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  reward_type text not null default 'premium_30_days',
  distance_spent_m numeric not null default 100000 check (distance_spent_m = 100000),
  created_at timestamptz not null default now()
);
create index if not exists run_reward_redemptions_user_idx on public.run_reward_redemptions(user_id, created_at desc);
alter table public.run_reward_redemptions enable row level security;
grant select on public.run_reward_redemptions to authenticated;
drop policy if exists run_reward_redemptions_read_own on public.run_reward_redemptions;
create policy run_reward_redemptions_read_own on public.run_reward_redemptions for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.redeem_running_premium()
returns jsonb language plpgsql security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid(); v_total_m numeric := 0; v_spent_m numeric := 0;
  v_plan_id uuid; v_subscription_id uuid; v_current_expiry date; v_new_expiry date;
begin
  if v_user_id is null then raise exception 'authentication_required'; end if;
  perform 1 from public.profiles where id = v_user_id for update;
  if not found then raise exception 'profile_not_found'; end if;
  select id into v_plan_id from public.plans
    where active = true and tier = 3 and upper(name) = 'PREMIUM' order by created_at desc limit 1;
  if v_plan_id is null then raise exception 'premium_plan_not_configured'; end if;
  select coalesce(sum(distance_m), 0) into v_total_m from public.cardio_sessions
    where user_id = v_user_id and ended_at is not null and distance_m > 0;
  select coalesce(sum(distance_spent_m), 0) into v_spent_m from public.run_reward_redemptions where user_id = v_user_id;
  if v_total_m - v_spent_m < 100000 then raise exception 'not_enough_kilometers'; end if;
  select id, expires_at into v_subscription_id, v_current_expiry from public.subscriptions
    where user_id = v_user_id and status = 'active' and expires_at >= current_date
    order by expires_at desc limit 1 for update;
  if v_subscription_id is not null then
    v_new_expiry := greatest(coalesce(v_current_expiry, current_date), current_date) + 30;
    update public.subscriptions set plan_id = v_plan_id, expires_at = v_new_expiry,
      payment_status = 'confirmed', payment_reference = 'RUN_REWARD_100KM' where id = v_subscription_id;
  else
    v_new_expiry := current_date + 30;
    insert into public.subscriptions(user_id, plan_id, status, started_at, expires_at, payment_status, payment_reference)
      values(v_user_id, v_plan_id, 'active', current_date, v_new_expiry, 'confirmed', 'RUN_REWARD_100KM')
      returning id into v_subscription_id;
  end if;
  insert into public.run_reward_redemptions(user_id, subscription_id, reward_type, distance_spent_m)
    values(v_user_id, v_subscription_id, 'premium_30_days', 100000);
  return jsonb_build_object('success', true, 'expires_at', v_new_expiry, 'redeemed_km', 100);
end;
$$;
revoke all on function public.redeem_running_premium() from public, anon;
grant execute on function public.redeem_running_premium() to authenticated;

-- The old RPC exposed private profile data; the new ranking uses explicitly shared run posts.
revoke all on function public.get_cardio_leaderboard() from public, anon, authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('run-photos','run-photos',false,10485760,array['image/jpeg','image/png','image/webp']::text[])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists run_photos_insert_own on storage.objects;
create policy run_photos_insert_own on storage.objects for insert to authenticated
with check(bucket_id='run-photos' and (select auth.uid())::text=(storage.foldername(name))[1]);
drop policy if exists run_photos_read_shared on storage.objects;
create policy run_photos_read_shared on storage.objects for select to authenticated
using(bucket_id='run-photos' and exists(select 1 from public.run_posts rp where rp.photo_path=storage.objects.name));
drop policy if exists run_photos_delete_own on storage.objects;
create policy run_photos_delete_own on storage.objects for delete to authenticated
using(bucket_id='run-photos' and (select auth.uid())::text=(storage.foldername(name))[1]);
