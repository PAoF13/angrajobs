-- AngraJobs v0.2: public jobs, simple applications and matching metadata.
-- Migrations are additive and immutable after production use.

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null check (char_length(title) between 2 and 180),
  company_name text not null check (char_length(company_name) between 2 and 180),
  category text,
  neighborhood text,
  region text default 'Angra dos Reis',
  contract_type text,
  work_mode text,
  salary_min integer check (salary_min is null or salary_min >= 0),
  salary_max integer check (salary_max is null or salary_max >= 0),
  salary_text text,
  description text not null check (char_length(description) between 10 and 12000),
  requirements text,
  benefits text,
  work_schedule text,
  schedule_type text,
  experience_min_months integer check (experience_min_months is null or experience_min_months between 0 and 600),
  start_date date,
  skills text[] default '{}'::text[],
  status text not null default 'draft' check (status in ('draft','pending_review','published','rejected','paused','expired')),
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (salary_min is null or salary_max is null or salary_max >= salary_min)
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 120),
  whatsapp text not null check (char_length(whatsapp) between 10 and 30),
  email text,
  message text,
  privacy_consent boolean not null default false,
  privacy_version text not null,
  status text not null default 'received' check (status in ('received','reviewing','interview','rejected','hired','withdrawn')),
  source text not null default 'Acesso direto',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now(),
  unique (job_id, whatsapp)
);

create index if not exists jobs_published_created_idx
  on public.jobs (published_at desc, created_at desc)
  where status = 'published';

create index if not exists jobs_category_idx on public.jobs(category);
create index if not exists jobs_neighborhood_idx on public.jobs(neighborhood);
create index if not exists job_applications_job_idx on public.job_applications(job_id);
create index if not exists job_applications_created_idx on public.job_applications(created_at desc);

create or replace function public.angrajobs_slugify(value text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    translate(lower(coalesce(value, '')),
      'áàãâäéèêëíìîïóòõôöúùûüçñ',
      'aaaaaeeeeiiiiooooouuuucn'),
    '[^a-z0-9]+', '-', 'g'
  ));
$$;

create or replace function public.prepare_job_before_write()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  base_slug text;
begin
  new.updated_at := now();

  if new.slug is null or btrim(new.slug) = '' then
    base_slug := public.angrajobs_slugify(new.title || '-' || new.company_name);
    if base_slug = '' then
      base_slug := 'vaga';
    end if;
    new.slug := base_slug || '-' || left(new.id::text, 8);
  else
    new.slug := public.angrajobs_slugify(new.slug);
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists prepare_job_before_write_trigger on public.jobs;
create trigger prepare_job_before_write_trigger
before insert or update on public.jobs
for each row execute function public.prepare_job_before_write();

alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;

-- Public visitors can only read live published vacancies.
drop policy if exists "public_can_read_published_jobs" on public.jobs;
create policy "public_can_read_published_jobs"
on public.jobs
for select
to anon, authenticated
using (
  status = 'published'
  and (expires_at is null or expires_at > now())
);

-- Applications intentionally have no anon/authenticated policies.
-- Inserts and private reads happen only through validated server routes.
revoke insert, update, delete on public.jobs from anon, authenticated;
revoke all on public.job_applications from anon, authenticated;
grant select on public.jobs to anon, authenticated;

comment on table public.jobs is 'Vagas da AngraJobs. Somente status=published e não expiradas são públicas.';
comment on table public.job_applications is 'Candidaturas privadas recebidas pelo backend Next.js. Não expor diretamente ao navegador.';
comment on column public.jobs.salary_min is 'Valor em centavos BRL.';
comment on column public.jobs.salary_max is 'Valor em centavos BRL.';
