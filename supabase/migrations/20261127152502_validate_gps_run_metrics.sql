-- Derive reward-driving run distance and speed from recorded GPS points.
create or replace function public.validate_cardio_run_metrics()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_item jsonb;
  v_lat numeric;
  v_lon numeric;
  v_at numeric;
  v_accuracy numeric;
  v_prev_lat numeric;
  v_prev_lon numeric;
  v_prev_at numeric;
  v_delta_lat numeric;
  v_delta_lon numeric;
  v_h numeric;
  v_segment_m numeric;
  v_delta_seconds numeric;
  v_total_m numeric := 0;
  v_count integer := 0;
  v_wall_seconds numeric;
begin
  if coalesce(new.kind, 'corrida') <> 'corrida' then return new; end if;
  if auth.uid() is not null and new.user_id <> auth.uid() then raise exception 'run_owner_mismatch'; end if;
  if jsonb_typeof(new.route) <> 'array' or jsonb_array_length(new.route) < 2 or jsonb_array_length(new.route) > 5000 then
    raise exception 'invalid_gps_route';
  end if;
  if new.ended_at is null or new.ended_at <= new.started_at then raise exception 'invalid_run_timestamps'; end if;
  v_wall_seconds := extract(epoch from (new.ended_at - new.started_at));
  if coalesce(new.duration_seconds, 0) < 1 or new.duration_seconds > v_wall_seconds + 10 then
    raise exception 'invalid_run_duration';
  end if;

  for v_item in select value from jsonb_array_elements(new.route)
  loop
    begin
      v_lat := (v_item ->> 'lat')::numeric;
      v_lon := (v_item ->> 'lng')::numeric;
      v_at := (v_item ->> 'at')::numeric;
      v_accuracy := coalesce((v_item ->> 'accuracy')::numeric, 0);
    exception when others then
      raise exception 'invalid_gps_point';
    end;
    if v_lat < -90 or v_lat > 90 or v_lon < -180 or v_lon > 180 or v_at <= 0 then
      raise exception 'invalid_gps_point';
    end if;
    if v_accuracy > 45 then continue; end if;
    v_count := v_count + 1;
    if v_prev_at is not null then
      v_delta_seconds := (v_at - v_prev_at) / 1000.0;
      if v_delta_seconds <= 0 then raise exception 'invalid_gps_timestamps'; end if;
      v_delta_lat := radians(v_lat - v_prev_lat);
      v_delta_lon := radians(v_lon - v_prev_lon);
      v_h := sin(v_delta_lat / 2) * sin(v_delta_lat / 2)
        + cos(radians(v_prev_lat)) * cos(radians(v_lat))
        * sin(v_delta_lon / 2) * sin(v_delta_lon / 2);
      v_segment_m := 2 * 6371000 * asin(least(1, sqrt(greatest(0, v_h))));
      if v_segment_m / v_delta_seconds > 12.5 then raise exception 'gps_jump_detected'; end if;
      if v_segment_m >= 2 then v_total_m := v_total_m + v_segment_m; end if;
    end if;
    v_prev_lat := v_lat;
    v_prev_lon := v_lon;
    v_prev_at := v_at;
  end loop;

  if v_count < 2 or v_total_m < 30 then raise exception 'run_route_too_short'; end if;
  new.distance_m := round(v_total_m);
  new.avg_speed_kmh := round((v_total_m / new.duration_seconds) * 3.6, 2);
  return new;
end;
$$;
revoke all on function public.validate_cardio_run_metrics() from public, anon, authenticated;
drop trigger if exists cardio_validate_gps_metrics on public.cardio_sessions;
create trigger cardio_validate_gps_metrics
before insert or update of route, distance_m, duration_seconds, avg_speed_kmh, started_at, ended_at
on public.cardio_sessions
for each row execute function public.validate_cardio_run_metrics();
