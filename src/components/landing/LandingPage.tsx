"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { CandidateForm } from "./CandidateForm";
import { CompanyForm } from "./CompanyForm";
import { track } from "@/lib/analytics/track";
import { SiteFooter } from "./SiteFooter";

const candidateBenefits = [
  "Vagas focadas em Angra dos Reis.",
  "Oportunidades organizadas por área.",
  "Informações claras e atualizadas.",
  "Candidatura simples.",
  "Alertas de novas oportunidades futuramente.",
];

const companyBenefits = [
  "Alcance candidatos da região.",
  "Divulgue vagas em poucos minutos.",
  "Centralize suas oportunidades.",
  "Acompanhe o interesse dos candidatos.",
  "Receba suporte próximo durante o lançamento.",
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}><span aria-hidden="true">✓</span>{item}</li>
      ))}
    </ul>
  );
}

function scrollTo(selector: string) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingPage() {
  useEffect(() => {
    void track("page_view");
  }, []);


  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="section" id="candidatos">
          <div className="container split-grid">
            <div className="section-copy">
              <span className="eyebrow">Para candidatos</span>
              <h2>Procurando emprego em Angra?</h2>
              <p className="lead">Pare de procurar vagas em vários lugares.</p>
              <p>A AngraJobs reúne oportunidades locais para você encontrar vagas de forma simples, rápida e pelo celular.</p>
              <CheckList items={candidateBenefits} />
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  void track("click_find_jobs", { location: "candidate_section" });
                  scrollTo("#form-candidato");
                }}
              >
                Quero receber novas vagas
              </button>
            </div>
            <div id="form-candidato" className="form-anchor"><CandidateForm /></div>
          </div>
        </section>

        <section className="section section-tinted" id="empresas">
          <div className="container split-grid split-reverse">
            <div className="section-copy">
              <span className="eyebrow">Para empresas</span>
              <h2>Sua empresa está contratando?</h2>
              <p className="lead">Publique oportunidades e alcance profissionais da região.</p>
              <p>A AngraJobs foi criada para facilitar a contratação local em Angra dos Reis.</p>
              <CheckList items={companyBenefits} />
              <div className="launch-highlight">
                <strong>Lançamento AngraJobs</strong>
                <p>Empresas participantes do lançamento poderão testar a plataforma antes da abertura dos planos comerciais.</p>
              </div>
              <div className="hero-actions">
                <Link className="button button-primary" href="/cadastro?tipo=empresa" onClick={() => void track("click_company", { location: "company_account" })}>Criar conta empresarial</Link>
                <button type="button" className="button button-secondary" onClick={() => { void track("click_company", { location: "company_section" }); scrollTo("#form-empresa"); }}>Quero falar com a AngraJobs</button>
              </div>
            </div>
            <div id="form-empresa" className="form-anchor"><CompanyForm /></div>
          </div>
        </section>

        <section className="section" id="como-funciona">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">Como funciona</span>
              <h2>Simples para quem procura. Simples para quem contrata.</h2>
            </div>
            <div className="process-grid">
              <article className="process-card">
                <span className="process-label">Para candidatos</span>
                <ol>
                  <li><b>Encontre uma oportunidade</b><p>Veja vagas locais organizadas em um só lugar.</p></li>
                  <li><b>Confira os detalhes</b><p>Entenda função, empresa, localização, requisitos e demais informações disponíveis.</p></li>
                  <li><b>Candidate-se</b><p>Envie sua candidatura de forma simples.</p></li>
                </ol>
              </article>
              <article className="process-card process-card-dark">
                <span className="process-label">Para empresas</span>
                <ol>
                  <li><b>Publique a vaga</b><p>Informe os principais dados da oportunidade.</p></li>
                  <li><b>Alcance candidatos locais</b><p>Sua vaga entra na distribuição da AngraJobs.</p></li>
                  <li><b>Encontre pessoas para o processo seletivo</b><p>Receba candidaturas e avance com os candidatos adequados.</p></li>
                </ol>
              </article>
            </div>
          </div>
        </section>

        <section className="section trust-section">
          <div className="container trust-card">
            <div>
              <span className="eyebrow">Confiança</span>
              <h2>Vagas locais precisam ser confiáveis.</h2>
              <p>A AngraJobs pretende trabalhar com verificação, atualização das oportunidades e um canal claro para denúncias.</p>
              <p><strong>Não cobramos do candidato para se candidatar às oportunidades básicas da plataforma.</strong></p>
            </div>
            <Link className="text-link" href="/vagas">Abrir vagas e denunciar</Link>
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <span className="eyebrow eyebrow-light">AngraJobs</span>
            <h2>Angra merece uma forma melhor de encontrar trabalho e contratar.</h2>
            <p>Se você procura uma oportunidade, veja as vagas publicadas. Se quiser alertas, cadastre seu interesse. Se sua empresa contrata, entre para o lançamento da AngraJobs.</p>
            <div className="hero-actions final-actions">
              <Link
                className="button button-light"
                href="/vagas"
                onClick={() => void track("click_find_jobs", { location: "final_cta" })}
              >Encontrar oportunidades</Link>
              <Link className="button button-outline-light" href="/cadastro?tipo=empresa" onClick={() => void track("click_company", { location: "final_cta" })}>Criar conta empresarial</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
