-- Consultas manuais para o Supabase SQL Editor. Não exponha estas consultas no navegador.

-- Leads por tipo
select 'candidate' as kind, count(*) as total from public.candidate_leads
union all
select 'company', count(*) from public.company_leads;

-- Áreas mais procuradas
select interest_area, count(*) as total
from public.candidate_leads
group by interest_area
order by total desc;

-- Segmentos de empresas
select segment, count(*) as total
from public.company_leads
group by segment
order by total desc;

-- Empresas por urgência de contratação
select hiring_timeline, count(*) as total
from public.company_leads
group by hiring_timeline
order by total desc;

-- Cadastros por origem
select source, count(*) as total
from (
  select source from public.candidate_leads
  union all
  select source from public.company_leads
) x
group by source
order by total desc;

-- Funil aproximado por evento
select event_name, count(*) as events, count(distinct session_id) as sessions
from public.analytics_events
group by event_name
order by event_name;

-- Conversão candidato, por sessões únicas
with e as (
  select
    count(distinct session_id) filter (where event_name = 'page_view') as visitors,
    count(distinct session_id) filter (where event_name = 'candidate_form_started') as started,
    count(distinct session_id) filter (where event_name = 'candidate_form_submitted') as submitted
  from public.analytics_events
)
select *,
  round(100.0 * started / nullif(visitors, 0), 2) as start_rate_pct,
  round(100.0 * submitted / nullif(visitors, 0), 2) as submit_rate_pct
from e;
