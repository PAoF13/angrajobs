"use client";

import { Brand } from "./Brand";
import { track } from "@/lib/analytics/track";

export function SuccessPage({ type }: { type: "candidate" | "company" }) {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "/";
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "/";
  const candidate = type === "candidate";
  const destination = candidate ? instagramUrl : whatsappUrl;
  const isExternal = destination.startsWith("http");

  return (
    <main className="success-shell">
      <div className="success-top"><Brand /></div>
      <section className="success-card">
        <div className="success-check" aria-hidden="true">✓</div>
        <span className="eyebrow">Cadastro recebido</span>
        <h1>{candidate ? "Você entrou para a base inicial da AngraJobs." : "Sua empresa entrou para nossa lista de lançamento."}</h1>
        <p>
          {candidate
            ? "Estamos preparando uma plataforma focada em oportunidades de Angra dos Reis. Acompanhe nossas redes para receber as primeiras vagas."
            : "Entraremos em contato quando houver oportunidade de publicar ou testar a plataforma."}
        </p>
        <a
          className="button button-primary"
          href={destination}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          onClick={() => void track(candidate ? "click_instagram" : "click_whatsapp", { location: "success_page" })}
        >
          {candidate ? "Seguir a AngraJobs" : "Falar com a AngraJobs"}
        </a>
        <a className="text-link" href="/">Voltar para angrajobs.com.br</a>
      </section>
    </main>
  );
}
