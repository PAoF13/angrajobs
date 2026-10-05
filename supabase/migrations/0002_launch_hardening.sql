-- AngraJobs validation landing v0.1 hardening
-- Consent/version metadata and a database-backed rate limit bucket.

alter table public.candidate_leads
  add column if not exists privacy_version text not null default '2026-10-04-v1',
  add column if not exists consent_at timestamptz not null default now();

alter table public.company_leads
  add column if not exists privacy_version text not null default '2026-10-04-v1',
  add column if not exists consent_at timestamptz not null default now();

create table if not exists public.rate_limit_buckets (
  key_hash text not null,
  action text not null,
  window_start timestamptz not null,
  hits integer not null default 1 check (hits > 0),
  updated_at timestamptz not null default now(),
  primary key (key_hash, action, window_start)
);

alter table public.rate_limit_buckets enable row level security;

create index if not exists rate_limit_buckets_updated_at_idx
  on public.rate_limit_buckets (updated_at);

create or replace function public.consume_rate_limit(
  p_key_hash text,
  p_action text,
  p_window_seconds integer,
  p_max_hits integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_hits integer;
begin
  if p_window_seconds < 1 or p_max_hits < 1 then
    raise exception 'invalid rate limit configuration';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );

  insert into public.rate_limit_buckets (key_hash, action, window_start, hits, updated_at)
  values (p_key_hash, p_action, v_window_start, 1, now())
  on conflict (key_hash, action, window_start)
  do update set
    hits = public.rate_limit_buckets.hits + 1,
    updated_at = now()
  returning hits into v_hits;

  return v_hits <= p_max_hits;
end;
$$;

revoke all on function public.consume_rate_limit(text, text, integer, integer) from public;
revoke all on function public.consume_rate_limit(text, text, integer, integer) from anon;
revoke all on function public.consume_rate_limit(text, text, integer, integer) from authenticated;
grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;

comment on table public.rate_limit_buckets is 'Hashed network identifiers used only for abuse throttling. No raw IP address is stored.';
