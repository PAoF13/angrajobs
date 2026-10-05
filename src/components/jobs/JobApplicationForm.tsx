"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Turnstile } from "@/components/security/Turnstile";
import { getAttribution } from "@/lib/analytics/source";
import { track } from "@/lib/analytics/track";

export function JobApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const started = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    void track("job_application_started", { jobId, jobTitle });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const attribution = getAttribution();

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          name: String(form.get("name") || ""),
          whatsapp: String(form.get("whatsapp") || ""),
          email: String(form.get("email") || ""),
          message: String(form.get("message") || ""),
          privacyConsent: form.get("privacyConsent") === "on",
          website: String(form.get("website") || ""),
          turnstileToken,
          ...attribution,
        }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message || "Não foi possível enviar sua candidatura.");

      setSuccess(true);
      void track("job_application_submitted", { jobId, jobTitle });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível enviar sua candidatura.");
      setTurnstileToken("");
      setChallengeKey((value) => value + 1);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="application-success" role="status">
        <span aria-hidden="true">✓</span>
        <h3>Candidatura recebida.</h3>
        <p>Seus dados foram vinculados à vaga <strong>{jobTitle}</strong>. A candidatura não representa garantia de entrevista ou contratação.</p>
        <Link className="button button-secondary" href="/vagas">Ver outras vagas</Link>
      </div>
    );
  }

  return (
    <form className="lead-form application-form" onSubmit={handleSubmit} onFocus={markStarted}>
      <div className="form-heading">
        <span className="eyebrow">Candidatura</span>
        <h3>Tenho interesse nesta vaga</h3>
        <p>Envie seus dados básicos. Não exigimos conta ou currículo complexo nesta versão.</p>
      </div>

      <label>
        Nome
        <input name="name" autoComplete="name" required minLength={2} maxLength={120} />
      </label>
      <label>
        WhatsApp
        <input name="whatsapp" inputMode="tel" autoComplete="tel" required minLength={10} maxLength={20} placeholder="(24) 99999-9999" />
      </label>
      <label>
        E-mail <small>Opcional</small>
        <input name="email" type="email" autoComplete="email" maxLength={180} />
      </label>
      <label>
        Experiência ou mensagem <small>Opcional</small>
        <textarea name="message" maxLength={1500} rows={5} placeholder="Conte brevemente sua experiência relacionada à vaga." />
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="checkbox-row">
        <input name="privacyConsent" type="checkbox" required />
        <span>Li e aceito a <Link href="/privacidade">Política de Privacidade</Link> para envio desta candidatura.</span>
      </label>

      <Turnstile key={challengeKey} action="job_application" onToken={handleTurnstileToken} />
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button button-primary button-full" type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar candidatura"}</button>
    </form>
  );
}
