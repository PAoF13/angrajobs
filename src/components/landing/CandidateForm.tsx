"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { candidateAreas } from "@/features/leads/schemas";
import { getAttribution } from "@/lib/analytics/source";
import { track } from "@/lib/analytics/track";
import { Turnstile } from "@/components/security/Turnstile";

export function CandidateForm() {
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
    void track("candidate_form_started");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const attribution = getAttribution();

    const payload = {
      name: String(form.get("name") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
      email: String(form.get("email") || ""),
      interestArea: String(form.get("interestArea") || ""),
      marketingConsent: form.get("marketingConsent") === "on",
      website: String(form.get("website") || ""),
      turnstileToken,
      ...attribution,
    };

    try {
      const response = await fetch("/api/leads/candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message || "Não foi possível concluir seu cadastro.");
      }

      await track("candidate_form_submitted", { interestArea: payload.interestArea });
      router.push("/sucesso/candidato");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível concluir seu cadastro.");
      setLoading(false);
      setTurnstileToken("");
      setChallengeKey((value) => value + 1);
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} onFocus={markStarted}>
      <div className="form-heading">
        <span className="eyebrow">Lista inicial</span>
        <h3>Receba novidades da AngraJobs</h3>
        <p>Cadastre seu interesse e seja avisado quando novas oportunidades forem publicadas.</p>
      </div>

      <label>
        Nome <span aria-hidden="true">*</span>
        <input name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Seu nome" />
      </label>

      <label>
        WhatsApp <span aria-hidden="true">*</span>
        <input name="whatsapp" inputMode="tel" autoComplete="tel" required minLength={10} maxLength={20} placeholder="(24) 99999-9999" />
      </label>

      <label>
        E-mail <small>Opcional</small>
        <input name="email" type="email" autoComplete="email" maxLength={180} placeholder="voce@email.com" />
      </label>

      <label>
        Área de interesse <span aria-hidden="true">*</span>
        <select name="interestArea" required defaultValue="">
          <option value="" disabled>Selecione uma área</option>
          {candidateAreas.map((area) => <option key={area} value={area}>{area}</option>)}
        </select>
      </label>

      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="checkbox-row">
        <input name="marketingConsent" type="checkbox" required />
        <span>Aceito receber comunicações da AngraJobs sobre vagas e novidades da plataforma.</span>
      </label>

      <Turnstile key={challengeKey} action="candidate_lead" onToken={handleTurnstileToken} />

      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <button className="button button-primary button-full" type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Cadastrar meu interesse"}
      </button>
      <p className="form-privacy">
        Seus dados serão usados para contato relacionado à AngraJobs. Consulte nossa <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </form>
  );
}
