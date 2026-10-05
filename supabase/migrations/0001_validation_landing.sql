-- AngraJobs validation landing v0.1
-- Public browsers never receive the service-role key.
-- Inserts happen through Next.js server routes after server-side validation.

create extension if not exists pgcrypto;

create table if not exists public.candidate_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  whatsapp text not null check (char_length(whatsapp) between 10 and 20),
  email text,
  interest_area text not null,
  marketing_consent boolean not null default false check (marketing_consent = true),
  source text not null default 'Acesso direto',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

create table if not exists public.company_leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null check (char_length(company_name) between 2 and 160),
  responsible_name text not null check (char_length(responsible_name) between 2 and 120),
  whatsapp text not null check (char_length(whatsapp) between 10 and 20),
  email text,
  segment text not null,
  hiring_timeline text not null,
  hiring_role text,
  contact_consent boolean not null default false check (contact_consent = true),
  source text not null default 'Acesso direto',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  session_id text not null,
  source text not null default 'Acesso direto',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  path text not null default '/',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists candidate_leads_created_at_idx on public.candidate_leads (created_at desc);
create index if not exists candidate_leads_interest_area_idx on public.candidate_leads (interest_area);
create index if not exists candidate_leads_source_idx on public.candidate_leads (source);
create index if not exists company_leads_created_at_idx on public.company_leads (created_at desc);
create index if not exists company_leads_segment_idx on public.company_leads (segment);
create index if not exists company_leads_hiring_timeline_idx on public.company_leads (hiring_timeline);
create index if not exists company_leads_source_idx on public.company_leads (source);
create index if not exists analytics_events_name_created_at_idx on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_source_idx on public.analytics_events (source);

alter table public.candidate_leads enable row level security;
alter table public.company_leads enable row level security;
alter table public.analytics_events enable row level security;

-- Intentionally no anon/authenticated policies in v0.1.
-- This makes these tables default-deny to browser roles.
-- The server route uses SUPABASE_SERVICE_ROLE_KEY to write after validation.

comment on table public.candidate_leads is 'Validation leads from people looking for work in Angra dos Reis.';
comment on table public.company_leads is 'Validation leads from employers interested in hiring through AngraJobs.';
comment on table public.analytics_events is 'First-party funnel events for validation landing v0.1.';
