"use client";

import { track } from "@/lib/analytics/track";

function scrollTo(selector: string) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Empregos locais. Conexões reais.</span>
          <h1>Vagas de Angra em um só lugar.</h1>
          <p className="hero-subtitle">
            Encontre oportunidades de trabalho em Angra dos Reis ou publique sua vaga para alcançar candidatos da região.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                void track("click_find_jobs", { location: "hero" });
                scrollTo("#form-candidato");
              }}
            >
              Encontrar vagas
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                void track("click_company", { location: "hero" });
                scrollTo("#form-empresa");
              }}
            >
              Quero contratar
            </button>
          </div>
          <p className="hero-note">AngraJobs está chegando para conectar empresas e talentos de Angra dos Reis.</p>
        </div>

        <div className="hero-card" aria-label="Resumo da proposta da AngraJobs">
        <img
  src="/logo-angrajobs.png"
  alt="AngraJobs"
  className="hero-logo"
/>
          <p className="hero-card-kicker">Feito para Angra</p>
          <strong>Uma ponte direta entre quem quer trabalhar e quem precisa contratar.</strong>
          <div className="hero-metrics">
            <div><span>01</span><small>Cidade primeiro</small></div>
            <div><span>02</span><small>Cadastro simples</small></div>
            <div><span>03</span><small>Foco em vagas reais</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}
