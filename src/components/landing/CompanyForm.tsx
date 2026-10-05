"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { companySegments, hiringTimelines } from "@/features/leads/schemas";
import { getAttribution } from "@/lib/analytics/source";
import { track } from "@/lib/analytics/track";
import { Turnstile } from "@/components/security/Turnstile";

export function CompanyForm() {
  const router = useRouter();
  const started = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    void track("company_form_started");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const attribution = getAttribution();

    const payload = {
      companyName: String(form.get("companyName") || ""),
      responsibleName: String(form.get("responsibleName") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
      email: String(form.get("email") || ""),
      segment: String(form.get("segment") || ""),
      hiringTimeline: String(form.get("hiringTimeline") || ""),
      hiringRole: String(form.get("hiringRole") || ""),
      contactConsent: form.get("contactConsent") === "on",
      website: String(form.get("website") || ""),
      turnstileToken,
      ...attribution,
    };

    try {
      const response = await fetch("/api/leads/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message || "Não foi possível concluir o cadastro.");
      }

      await track("company_form_submitted", {
        segment: payload.segment,
        hiringTimeline: payload.hiringTimeline,
      });
      router.push("/sucesso/empresa");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível concluir o cadastro.");
      setLoading(false);
      setTurnstileToken("");
      setChallengeKey((value) => value + 1);
    }
  }

  return (
    <form className="lead-form company-form" onSubmit={handleSubmit} onFocus={markStarted}>
      <div className="form-heading">
        <span className="eyebrow">Empresas de Angra</span>
        <h3>Cadastre sua empresa</h3>
        <p>Queremos conhecer empresas de Angra que contratam.</p>
      </div>

      <label>
        Nome da empresa <span aria-hidden="true">*</span>
        <input name="companyName" required minLength={2} maxLength={160} placeholder="Nome da empresa" />
      </label>

      <label>
        Nome do responsável <span aria-hidden="true">*</span>
        <input name="responsibleName" autoComplete="name" required minLength={2} maxLength={120} placeholder="Seu nome" />
      </label>

      <label>
        WhatsApp <span aria-hidden="true">*</span>
        <input name="whatsapp" inputMode="tel" autoComplete="tel" required minLength={10} maxLength={20} placeholder="(24) 99999-9999" />
      </label>

      <label>
        E-mail profissional <small>Opcional</small>
        <input name="email" type="email" autoComplete="email" maxLength={180} placeholder="contato@empresa.com.br" />
      </label>

      <label>
        Segmento <span aria-hidden="true">*</span>
        <select name="segment" required defaultValue="">
          <option value="" disabled>Selecione um segmento</option>
          {companySegments.map((segment) => <option key={segment} value={segment}>{segment}</option>)}
        </select>
      </label>

      <fieldset>
        <legend>Sua empresa pretende contratar? <span aria-hidden="true">*</span></legend>
        <div className="radio-grid">
          {hiringTimelines.map((timeline) => (
            <label className="radio-card" key={timeline}>
              <input type="radio" name="hiringTimeline" value={timeline} required />
              <span>{timeline}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Qual função pretende contratar? <small>Opcional</small>
        <input name="hiringRole" maxLength={160} placeholder="Ex.: Garçom, recepcionista, vendedor" />
      </label>

      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="checkbox-row">
        <input name="contactConsent" type="checkbox" required />
        <span>Autorizo a AngraJobs a entrar em contato sobre publicação de vagas e uso da plataforma.</span>
      </label>

      <Turnstile key={challengeKey} action="company_lead" onToken={handleTurnstileToken} />

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <button className="button button-primary button-full" type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Cadastrar empresa"}
      </button>
      <p className="form-privacy">Ao enviar, você confirma que leu nossa <Link href="/privacidade">Política de Privacidade</Link>.</p>
    </form>
  );
}
