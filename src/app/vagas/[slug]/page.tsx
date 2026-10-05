import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { JobApplicationForm } from "@/components/jobs/JobApplicationForm";
import { JobViewTracker } from "@/components/jobs/JobViewTracker";
import { getPublishedJobBySlug } from "@/features/jobs/queries";
import { formatJobLocation, formatJobSalary, formatPublishedDate, formatStartDate } from "@/features/jobs/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) return { title: "Vaga não encontrada | AngraJobs" };
  return {
    title: `${job.title} em ${job.company_name} | AngraJobs`,
    description: job.description.slice(0, 155),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  const salary = formatJobSalary(job);
  const startDate = formatStartDate(job.start_date);

  return (
    <>
      <Header />
      <JobViewTracker jobId={job.id} slug={job.slug} />
      <main className="job-detail-page">
        <div className="container job-detail-layout">
          <article className="job-detail-card">
            <Link className="back-link" href="/vagas">← Voltar para vagas</Link>
            <span className="eyebrow">Vaga publicada</span>
            <h1>{job.title}</h1>
            <p className="job-detail-company">{job.company_name}</p>

            <dl className="job-detail-meta">
              <div><dt>Local</dt><dd>{formatJobLocation(job)}</dd></div>
              {job.contract_type ? <div><dt>Contrato</dt><dd>{job.contract_type}</dd></div> : null}
              {job.work_mode ? <div><dt>Modalidade</dt><dd>{job.work_mode}</dd></div> : null}
              {salary ? <div><dt>Faixa salarial</dt><dd>{salary}</dd></div> : null}
              {job.work_schedule ? <div><dt>Horário</dt><dd>{job.work_schedule}</dd></div> : null}
              {startDate ? <div><dt>Início previsto</dt><dd>{startDate}</dd></div> : null}
              <div><dt>Publicada</dt><dd>{formatPublishedDate(job.published_at, job.created_at)}</dd></div>
            </dl>

            <section className="job-detail-section">
              <h2>Sobre a oportunidade</h2>
              <p className="preline">{job.description}</p>
            </section>
            {job.requirements ? (
              <section className="job-detail-section">
                <h2>Requisitos</h2>
                <p className="preline">{job.requirements}</p>
              </section>
            ) : null}
            {job.skills?.length ? (
              <section className="job-detail-section">
                <h2>Habilidades informadas</h2>
                <div className="skill-tags">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </section>
            ) : null}
            {job.benefits ? (
              <section className="job-detail-section">
                <h2>Benefícios</h2>
                <p className="preline">{job.benefits}</p>
              </section>
            ) : null}

            <div className="job-trust-note">
              <strong>Importante</strong>
              <p>A AngraJobs não cobra do candidato para enviar esta candidatura. A empresa é responsável pelo processo seletivo e pela decisão de contratação.</p>
            </div>
          </article>

          <aside className="job-application-column">
            <JobApplicationForm jobId={job.id} jobTitle={job.title} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
