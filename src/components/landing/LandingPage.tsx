"use client";

import { useEffect } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { CandidateForm } from "./CandidateForm";
import { CompanyForm } from "./CompanyForm";
import { Brand } from "./Brand";
import { track } from "@/lib/analytics/track";

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

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || "#";

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
                Quero receber oportunidades
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
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  void track("click_company", { location: "company_section" });
                  scrollTo("#form-empresa");
                }}
              >
                Quero publicar uma vaga
              </button>
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
            <a className="text-link disabled-link" href="#" aria-disabled="true" onClick={(event) => event.preventDefault()}>Denunciar uma vaga <small>em breve</small></a>
          </div>
        </section>

        <section className="final-cta">
          <div className="container final-cta-inner">
            <span className="eyebrow eyebrow-light">AngraJobs</span>
            <h2>Angra merece uma forma melhor de encontrar trabalho e contratar.</h2>
            <p>Se você procura uma oportunidade, cadastre seu interesse. Se sua empresa contrata, entre para o lançamento da AngraJobs.</p>
            <div className="hero-actions final-actions">
              <button
                type="button"
                className="button button-light"
                onClick={() => {
                  void track("click_find_jobs", { location: "final_cta" });
                  scrollTo("#form-candidato");
                }}
              >Encontrar oportunidades</button>
              <button
                type="button"
                className="button button-outline-light"
                onClick={() => {
                  void track("click_company", { location: "final_cta" });
                  scrollTo("#form-empresa");
                }}
              >Cadastrar minha empresa</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Brand href="#top" />
            <p>Vagas e empregos em Angra dos Reis.</p>
            <a className="footer-contact" href="mailto:contato.angrajobs@gmail.com">contato.angrajobs@gmail.com</a>
            <p className="footer-domain">angrajobs.com.br</p>
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => scrollTo("#candidatos")}>Vagas</button>
            <button type="button" onClick={() => scrollTo("#empresas")}>Para Empresas</button>
            <a href={instagramUrl} target={instagramUrl === "#" ? undefined : "_blank"} rel="noreferrer" onClick={() => void track("click_instagram", { location: "footer" })}>Instagram</a>
            <a href={tiktokUrl} target={tiktokUrl === "#" ? undefined : "_blank"} rel="noreferrer">TikTok</a>
            <a href="mailto:contato.angrajobs@gmail.com">Contato</a>
            <a href="/privacidade">Política de Privacidade</a>
            <a href="/termos">Termos de Uso</a>
          </div>
        </div>
        <div className="container footer-bottom">© 2026 AngraJobs. Todos os direitos reservados.</div>
      </footer>
    </>
  );
}
