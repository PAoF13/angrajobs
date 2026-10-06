-- AngraJobs v0.3: accounts, company ownership, candidate profiles, reports,
-- commercial entitlements and secure dashboards.
-- Additive migration. Do not edit older production migrations.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'candidate' check (role in ('candidate','company','admin','moderator')),
  display_name text not null default '',
  whatsapp text,
  city text not null default 'Angra dos Reis',
  theme_preference text not null default 'light' check (theme_preference in ('light','mono')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidate_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  area text,
  neighborhood text,
  experience_months integer not null default 0 check (experience_months between 0 and 600),
  availability_date date,
  schedule_type text,
  contract_preference text,
  work_mode_preference text,
  skills text[] not null default '{}'::text[],
  visibility boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text,
  trade_name text not null check (char_length(trade_name) between 2 and 180),
  slug text not null unique,
  cnpj text,
  phone text,
  email text,
  neighborhood text,
  city text not null default 'Angra dos Reis',
  status text not null default 'active' check (status in ('active','pending','suspended','closed')),
  verification_level smallint not null default 0 check (verification_level between 0 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_members (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','recruiter','member')),
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  plan_code text not null default 'free' check (plan_code in ('free','pro','business')),
  status text not null default 'active' check (status in ('pending','trialing','active','past_due','canceled','expired')),
  period_start timestamptz not null default now(),
  period_end timestamptz,
  provider text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plan_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  request_type text not null check (request_type in ('subscription','featured_job')),
  plan_code text check (plan_code is null or plan_code in ('pro','business')),
  job_id uuid references public.jobs(id) on delete set null,
  duration_days integer check (duration_days is null or duration_days between 7 and 180),
  price_cents integer not null default 0 check (price_cents between 0 and 10000000),
  status text not null default 'pending' check (status in ('pending','approved','rejected','canceled')),
  admin_note text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists public.promotion_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  content_type text not null check (content_type in ('video','live','collab')),
  platform text not null check (platform in ('instagram','tiktok','instagram_tiktok')),
  duration_seconds integer not null check (duration_seconds between 10 and 7200),
  estimated_price_cents integer not null check (estimated_price_cents between 0 and 5000),
  notes text,
  status text not null default 'pending' check (status in ('pending','quoted','approved','done','rejected','canceled')),
  final_price_cents integer check (final_price_cents is null or final_price_cents between 0 and 1000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  job_id uuid not null references public.jobs(id) on delete cascade,
  reason text not null check (reason in ('fraud','fee','misleading','discrimination','expired','duplicate','other')),
  details text,
  contact_email text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  dedupe_key text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null unique,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.jobs add column if not exists company_id uuid references public.companies(id) on delete restrict;
alter table public.jobs add column if not exists created_by uuid references public.profiles(id) on delete set null;
alter table public.jobs add column if not exists duration_days integer not null default 7 check (duration_days between 1 and 180);
alter table public.jobs add column if not exists is_featured boolean not null default false;
alter table public.jobs add column if not exists featured_until timestamptz;

alter table public.job_applications add column if not exists candidate_id uuid references public.profiles(id) on delete set null;
create unique index if not exists one_application_per_candidate_job
  on public.job_applications(job_id, candidate_id)
  where candidate_id is not null;

create index if not exists jobs_company_idx on public.jobs(company_id);
create index if not exists jobs_expiry_idx on public.jobs(expires_at) where status = 'published';
create index if not exists company_members_user_idx on public.company_members(user_id);
create index if not exists applications_candidate_idx on public.job_applications(candidate_id);
create index if not exists reports_job_idx on public.reports(job_id);
create index if not exists reports_status_idx on public.reports(status, created_at desc);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);
create index if not exists plan_requests_company_idx on public.plan_requests(company_id, created_at desc);
create index if not exists promotion_requests_company_idx on public.promotion_requests(company_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','moderator'));
$$;

create or replace function public.is_company_member(target_company uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.company_members m where m.company_id = target_company and m.user_id = auth.uid());
$$;

create or replace function public.is_company_recruiter(target_company uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.company_members m
    where m.company_id = target_company and m.user_id = auth.uid() and m.role in ('owner','recruiter')
  );
$$;

create or replace function public.is_company_owner(target_company uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.company_members m
    where m.company_id = target_company and m.user_id = auth.uid() and m.role = 'owner'
  );
$$;


create or replace function public.candidate_has_application(target_job uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.job_applications a where a.job_id = target_job and a.candidate_id = auth.uid());
$$;

create or replace function public.company_plan(target_company uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select s.plan_code
    from public.subscriptions s
    where s.company_id = target_company
      and s.status in ('active','trialing')
      and (s.period_end is null or s.period_end > now())
    limit 1
  ), 'free');
$$;

create or replace function public.company_active_job_limit(target_company uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select case public.company_plan(target_company)
    when 'business' then 10
    when 'pro' then 3
    else 1
  end;
$$;

create or replace function public.company_max_job_duration(target_company uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select case public.company_plan(target_company)
    when 'business' then 180
    when 'pro' then 180
    else 7
  end;
$$;

create or replace function public.prepare_job_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  max_days integer := 7;
  requested_days integer := 7;
begin
  new.updated_at := now();

  if new.slug is null or btrim(new.slug) = '' then
    base_slug := public.angrajobs_slugify(new.title || '-' || new.company_name);
    if base_slug = '' then base_slug := 'vaga'; end if;
    new.slug := base_slug || '-' || left(new.id::text, 8);
  else
    new.slug := public.angrajobs_slugify(new.slug);
  end if;

  if new.status = 'published' and (case when tg_op = 'INSERT' then true else old.status is distinct from 'published' or new.expires_at is null end) then
    new.published_at := coalesce(new.published_at, now());
    requested_days := greatest(1, least(coalesce(new.duration_days, 7), 180));
    if new.company_id is not null then
      max_days := public.company_max_job_duration(new.company_id);
    elsif new.is_featured then
      max_days := 180;
    else
      max_days := 7;
    end if;
    if new.is_featured then max_days := greatest(max_days, 180); end if;
    new.duration_days := least(requested_days, max_days);
    new.expires_at := now() + make_interval(days => new.duration_days);
  end if;

  return new;
end;
$$;

create or replace function public.expire_jobs()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update public.jobs
  set is_featured = false, updated_at = now()
  where is_featured = true and featured_until is not null and featured_until <= now();

  update public.jobs
  set status = 'expired', is_featured = false, updated_at = now()
  where status = 'published' and expires_at is not null and expires_at <= now();
  get diagnostics affected = row_count;
  return affected;
end;
$$;


create or replace function public.expire_subscriptions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update public.subscriptions
  set status = 'expired', updated_at = now()
  where status in ('active','trialing') and period_end is not null and period_end <= now();
  get diagnostics affected = row_count;
  return affected;
end;
$$;

create or replace function public.create_expiry_notifications()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  insert into public.notifications(user_id, kind, title, body, href, dedupe_key)
  select
    m.user_id,
    'job_expiring',
    'Sua vaga está perto de expirar',
    j.title || ' expira em até 72 horas.',
    '/empresa/vagas/' || j.id::text,
    'job-expiring-' || j.id::text || '-' || m.user_id::text
  from public.jobs j
  join public.company_members m on m.company_id = j.company_id
  where j.status = 'published'
    and j.expires_at > now()
    and j.expires_at <= now() + interval '72 hours'
  on conflict (dedupe_key) do nothing;
  get diagnostics affected = row_count;
  return affected;
end;
$$;

create or replace function public.notify_company_on_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications(user_id, kind, title, body, href, dedupe_key)
  select
    m.user_id,
    'application_received',
    'Nova candidatura recebida',
    new.name || ' se candidatou à vaga ' || j.title || '.',
    '/empresa/vagas/' || j.id::text || '/candidaturas',
    'application-' || new.id::text || '-' || m.user_id::text
  from public.jobs j
  join public.company_members m on m.company_id = j.company_id
  where j.id = new.job_id;
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  account_role text;
  company_uuid uuid;
  company_name text;
  display_name text;
begin
  account_role := coalesce(new.raw_user_meta_data->>'role', 'candidate');
  if account_role not in ('candidate','company') then account_role := 'candidate'; end if;
  display_name := coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email, '@', 1), 'Usuário');

  insert into public.profiles(id, role, display_name, whatsapp)
  values(new.id, account_role, display_name, nullif(new.raw_user_meta_data->>'whatsapp',''))
  on conflict (id) do nothing;

  if account_role = 'company' then
    company_name := coalesce(nullif(new.raw_user_meta_data->>'company_name',''), display_name);
    insert into public.companies(trade_name, slug, phone, email)
    values(
      company_name,
      public.angrajobs_slugify(company_name) || '-' || left(new.id::text, 8),
      nullif(new.raw_user_meta_data->>'whatsapp',''),
      new.email
    ) returning id into company_uuid;

    insert into public.company_members(company_id, user_id, role)
    values(company_uuid, new.id, 'owner');

    insert into public.subscriptions(company_id, plan_code, status)
    values(company_uuid, 'free', 'active');
  else
    insert into public.candidate_profiles(user_id)
    values(new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

-- Replace the existing job trigger with the v0.3 version above.
drop trigger if exists prepare_job_before_write_trigger on public.jobs;
create trigger prepare_job_before_write_trigger
before insert or update on public.jobs
for each row execute function public.prepare_job_before_write();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists candidate_profiles_updated_at on public.candidate_profiles;
create trigger candidate_profiles_updated_at before update on public.candidate_profiles for each row execute function public.set_updated_at();
drop trigger if exists companies_updated_at on public.companies;
create trigger companies_updated_at before update on public.companies for each row execute function public.set_updated_at();
drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
drop trigger if exists promotion_requests_updated_at on public.promotion_requests;
create trigger promotion_requests_updated_at before update on public.promotion_requests for each row execute function public.set_updated_at();

drop trigger if exists notify_company_on_application_trigger on public.job_applications;
create trigger notify_company_on_application_trigger
after insert on public.job_applications
for each row execute function public.notify_company_on_application();

drop trigger if exists angrajobs_on_auth_user_created on auth.users;
create trigger angrajobs_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Backfill accounts that may already exist before this migration.
insert into public.profiles(id, role, display_name, whatsapp)
select
  u.id,
  case when coalesce(u.raw_user_meta_data->>'role','candidate') in ('candidate','company') then coalesce(u.raw_user_meta_data->>'role','candidate') else 'candidate' end,
  coalesce(nullif(u.raw_user_meta_data->>'display_name',''), split_part(u.email,'@',1), 'Usuário'),
  nullif(u.raw_user_meta_data->>'whatsapp','')
from auth.users u
on conflict (id) do nothing;

insert into public.candidate_profiles(user_id)
select p.id from public.profiles p
where p.role = 'candidate'
on conflict (user_id) do nothing;

-- Existing published jobs without expiry become 7-day vacancies.
update public.jobs
set duration_days = 7,
    expires_at = coalesce(published_at, created_at, now()) + interval '7 days'
where status = 'published' and expires_at is null;

-- RLS
alter table public.profiles enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plan_requests enable row level security;
alter table public.promotion_requests enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.payment_events enable row level security;

-- Profiles
drop policy if exists "users_read_own_profile" on public.profiles;
create policy "users_read_own_profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "users_update_own_profile" on public.profiles;
create policy "users_update_own_profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Candidate profiles
drop policy if exists "candidates_manage_own_profile" on public.candidate_profiles;
create policy "candidates_manage_own_profile" on public.candidate_profiles for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

-- Companies and memberships
drop policy if exists "members_read_company" on public.companies;
create policy "members_read_company" on public.companies for select to authenticated using (public.is_company_member(id) or public.is_admin());
drop policy if exists "owners_update_company" on public.companies;
create policy "owners_update_company" on public.companies for update to authenticated using (public.is_company_owner(id) or public.is_admin()) with check (public.is_company_owner(id) or public.is_admin());

drop policy if exists "members_read_memberships" on public.company_members;
create policy "members_read_memberships" on public.company_members for select to authenticated using (user_id = auth.uid() or public.is_company_owner(company_id) or public.is_admin());

-- Jobs: keep public policy from v0.2 and add company access.
drop policy if exists "company_members_read_own_jobs" on public.jobs;
create policy "company_members_read_own_jobs" on public.jobs for select to authenticated using (company_id is not null and (public.is_company_member(company_id) or public.is_admin()));


drop policy if exists "candidates_read_applied_jobs" on public.jobs;
create policy "candidates_read_applied_jobs" on public.jobs for select to authenticated using (public.candidate_has_application(id));

-- Applications
drop policy if exists "candidate_reads_own_applications" on public.job_applications;
create policy "candidate_reads_own_applications" on public.job_applications for select to authenticated using (candidate_id = auth.uid() or public.is_admin());
drop policy if exists "company_reads_own_applications" on public.job_applications;
create policy "company_reads_own_applications" on public.job_applications for select to authenticated using (
  public.is_admin() or exists(select 1 from public.jobs j where j.id = job_id and j.company_id is not null and public.is_company_member(j.company_id))
);

-- Commercial data
drop policy if exists "members_read_subscription" on public.subscriptions;
create policy "members_read_subscription" on public.subscriptions for select to authenticated using (public.is_company_member(company_id) or public.is_admin());
drop policy if exists "members_read_plan_requests" on public.plan_requests;
create policy "members_read_plan_requests" on public.plan_requests for select to authenticated using (public.is_company_member(company_id) or public.is_admin());
drop policy if exists "members_read_promotion_requests" on public.promotion_requests;
create policy "members_read_promotion_requests" on public.promotion_requests for select to authenticated using (public.is_company_member(company_id) or public.is_admin());

-- Reports, notifications, audit
drop policy if exists "reporters_read_own_reports" on public.reports;
create policy "reporters_read_own_reports" on public.reports for select to authenticated using (reporter_id = auth.uid() or public.is_admin());
drop policy if exists "users_read_notifications" on public.notifications;
create policy "users_read_notifications" on public.notifications for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "users_update_notifications" on public.notifications;
create policy "users_update_notifications" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "admins_read_audit" on public.audit_logs;
create policy "admins_read_audit" on public.audit_logs for select to authenticated using (public.is_admin());

-- No browser writes for critical business tables. Next.js server routes validate and authorize writes.
revoke insert, update, delete on public.subscriptions from anon, authenticated;
revoke insert, update, delete on public.plan_requests from anon, authenticated;
revoke insert, update, delete on public.promotion_requests from anon, authenticated;
revoke insert, update, delete on public.reports from anon, authenticated;
revoke insert, update, delete on public.audit_logs from anon, authenticated;
revoke all on public.payment_events from anon, authenticated;

grant select on public.profiles, public.candidate_profiles, public.companies, public.company_members,
  public.subscriptions, public.plan_requests, public.promotion_requests, public.reports,
  public.notifications, public.audit_logs to authenticated;
grant update(theme_preference, display_name, whatsapp, city) on public.profiles to authenticated;
grant select on public.job_applications to authenticated;

-- Internal automation functions mutate business state and must not be callable from browsers.
revoke execute on function public.expire_jobs() from public, anon, authenticated;
revoke execute on function public.expire_subscriptions() from public, anon, authenticated;
revoke execute on function public.create_expiry_notifications() from public, anon, authenticated;
grant execute on function public.expire_jobs() to service_role;
grant execute on function public.expire_subscriptions() to service_role;
grant execute on function public.create_expiry_notifications() to service_role;

comment on table public.subscriptions is 'Entitlement comercial. Planos pagos só devem ser ativados por operação administrativa ou webhook autenticado do provedor de pagamentos.';
comment on table public.plan_requests is 'Solicitações comerciais. Não concede plano automaticamente sem aprovação/pagamento validado.';
comment on column public.jobs.duration_days is 'Duração solicitada. FREE é limitada a 7 dias; planos pagos ativos permitem até 180 dias.';
