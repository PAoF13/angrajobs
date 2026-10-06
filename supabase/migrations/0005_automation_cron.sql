-- AngraJobs v0.3 automation: expire jobs and create 72h expiry notifications.
-- Supabase Cron uses pg_cron. If your project already has Cron enabled, this is idempotent.

create extension if not exists pg_cron;

do $$
begin
  perform cron.unschedule('angrajobs-expire-jobs');
exception when others then null;
end $$;

select cron.schedule(
  'angrajobs-expire-jobs',
  '*/15 * * * *',
  $$select public.expire_subscriptions(); select public.expire_jobs(); select public.create_expiry_notifications();$$
);
