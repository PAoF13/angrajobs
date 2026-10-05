import Link from "next/link";
import type { Job, JobMatchResult } from "@/features/jobs/types";
import { formatJobLocation, formatJobSalary, formatPublishedDate } from "@/features/jobs/format";

export function JobCard({ job, match }: { job: Job; match?: JobMatchResult }) {
  const salary = formatJobSalary(job);

  return (
    <article className="job-card">
      <div className="job-card-topline">
        <span className="job-status-dot" aria-hidden="true" />
        <span>Vaga publicada</span>
        {match ? <strong className="match-badge">{match.score}% compatível</strong> : null}
      </div>
      <h2>{job.title}</h2>
      <p className="job-company">{job.company_name}</p>
      <dl className="job-meta">
        <div><dt>Local</dt><dd>{formatJobLocation(job)}</dd></div>
        {job.contract_type ? <div><dt>Contrato</dt><dd>{job.contract_type}</dd></div> : null}
        {job.work_mode ? <div><dt>Modalidade</dt><dd>{job.work_mode}</dd></div> : null}
        {salary ? <div><dt>Salário</dt><dd>{salary}</dd></div> : null}
        <div><dt>Publicada</dt><dd>{formatPublishedDate(job.published_at, job.created_at)}</dd></div>
      </dl>
      {match ? (
        <div className="match-summary">
          <strong>{match.label}</strong>
          <ul>
            {match.reasons.slice(0, 3).map((reason) => <li key={`${reason.label}-${reason.text}`} data-result={reason.result}>{reason.text}</li>)}
          </ul>
          <small>Compatibilidade não garante contratação.</small>
        </div>
      ) : null}
      <Link className="button button-secondary button-full" href={`/vagas/${job.slug}`}>Ver detalhes</Link>
    </article>
  );
}
