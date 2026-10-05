import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { JobCard } from "@/components/jobs/JobCard";
import { JobMatchForm } from "@/components/jobs/JobMatchForm";
import { JobsPageTracker } from "@/components/jobs/JobsPageTracker";
import { listPublishedJobs } from "@/features/jobs/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vagas em Angra dos Reis | AngraJobs",
  description: "Encontre vagas publicadas em Angra dos Reis e compare oportunidades com seu perfil profissional.",
};

export default async function JobsPage() {
  const jobs = await listPublishedJobs();

  return (
    <>
      <Header />
      <JobsPageTracker />
      <main className="jobs-page">
        <section className="jobs-hero">
          <div className="container jobs-hero-inner">
            <span className="eyebrow">Vagas em Angra dos Reis</span>
            <h1>Encontre oportunidades locais.</h1>
            <p>Veja as vagas publicadas ou compare os requisitos com suas informações profissionais.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#compatibilidade">Encontrar vagas compatíveis</a>
              <Link className="button button-secondary" href="/#form-candidato">Quero receber novas vagas</Link>
            </div>
          </div>
        </section>

        <div className="container jobs-layout">
          <JobMatchForm />

          <section className="jobs-list-section" aria-labelledby="published-jobs-title">
            <div className="section-heading jobs-list-heading">
              <span className="eyebrow">Todas as oportunidades</span>
              <h2 id="published-jobs-title">Vagas publicadas</h2>
              <p>{jobs.length ? `${jobs.length} ${jobs.length === 1 ? "vaga disponível" : "vagas disponíveis"} agora.` : "A lista será atualizada automaticamente quando publicarmos uma oportunidade."}</p>
            </div>

            {jobs.length ? (
              <div className="jobs-grid">
                {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">AJ</span>
                <h2>Ainda não temos vagas publicadas.</h2>
                <p>Estamos começando a cadastrar as primeiras oportunidades de Angra dos Reis.</p>
                <p>Cadastre seu interesse para ser avisado quando novas vagas forem publicadas.</p>
                <Link className="button button-primary" href="/#form-candidato">Quero receber novas vagas</Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
