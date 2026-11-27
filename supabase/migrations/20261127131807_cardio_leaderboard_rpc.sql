-- Legacy running leaderboard RPC. The later running_community_rewards migration revokes client execution.
create or replace function public.get_cardio_leaderboard()
returns table (
  rank_position bigint,
  user_id uuid,
  full_name text,
  avatar_url text,
  total_runs bigint,
  total_distance_m numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with totals as (
    select
      cs.user_id,
      count(*)::bigint as total_runs,
      coalesce(sum(cs.distance_m), 0)::numeric as total_distance_m
    from public.cardio_sessions cs
    where cs.ended_at is not null and cs.distance_m > 0
    group by cs.user_id
  )
  select
    row_number() over (
      order by totals.total_runs desc, totals.total_distance_m desc, totals.user_id
    )::bigint,
    p.id,
    coalesce(nullif(trim(p.full_name), ''), 'Atleta'),
    p.avatar_url,
    totals.total_runs,
    totals.total_distance_m
  from totals
  join public.profiles p on p.id = totals.user_id
  order by totals.total_runs desc, totals.total_distance_m desc
  limit 100;
$$;
revoke all on function public.get_cardio_leaderboard() from public, anon;
grant execute on function public.get_cardio_leaderboard() to authenticated;
