"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Turnstile } from "@/components/security/Turnstile";
import { getAttribution } from "@/lib/analytics/source";
import { track } from "@/lib/analytics/track";
import { useAccount } from "@/lib/auth/use-account";

export function JobApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const { account, loading: accountLoading } = useAccount();
  const started = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const [name,setName]=useState(""); const[whatsapp,setWhatsapp]=useState("");
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  useEffect(()=>{if(account){setName(account.profile.display_name||"");setWhatsapp(account.profile.whatsapp||"")}},[account]);

  function markStarted() { if (started.current) return; started.current = true; void track("job_application_started", { jobId, jobTitle }); }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(!account) return;
    setLoading(true); setError(""); const form = new FormData(event.currentTarget); const attribution = getAttribution();
    try {
      const response = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json", Authorization:`Bearer ${account.session.access_token}` }, body: JSON.stringify({ jobId, name, whatsapp, email: String(form.get("email") || ""), message: String(form.get("message") || ""), privacyConsent: form.get("privacyConsent") === "on", website: String(form.get("website") || ""), turnstileToken, ...attribution }) });
      const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.error?.message || "Não foi possível enviar sua candidatura.");
      setSuccess(true); void track("job_application_submitted", { jobId, jobTitle });
    } catch (submissionError) { setError(submissionError instanceof Error ? submissionError.message : "Não foi possível enviar sua candidatura."); setTurnstileToken(""); setChallengeKey((value) => value + 1); } finally { setLoading(false); }
  }

  if(accountLoading) return <div className="account-card"><p>Verificando sua conta...</p></div>;
  if(!account) return <div className="application-login"><span className="eyebrow">Candidatura</span><h3>Entre para se candidatar</h3><p>Seu cadastro permite acompanhar candidaturas e receber atualizações de status.</p><Link className="button button-primary button-full" href={`/entrar`}>Entrar</Link><Link className="button button-secondary button-full" href="/cadastro">Criar conta de candidato</Link></div>;
  if(account.profile.role!=="candidate") return <div className="application-login"><h3>Conta empresarial</h3><p>Contas de empresa não podem se candidatar a vagas. Use uma conta de candidato.</p></div>;

  if (success) return <div className="application-success" role="status"><span aria-hidden="true">✓</span><h3>Candidatura recebida.</h3><p>Seus dados foram vinculados à vaga <strong>{jobTitle}</strong>. A candidatura não representa garantia de entrevista ou contratação.</p><Link className="button button-secondary" href="/candidato/candidaturas">Acompanhar candidatura</Link></div>;

  return <form className="lead-form application-form" onSubmit={handleSubmit} onFocus={markStarted}>
    <div className="form-heading"><span className="eyebrow">Candidatura</span><h3>Tenho interesse nesta vaga</h3><p>Usamos sua conta para vincular a candidatura e proteger seus dados.</p></div>
    <label>Nome<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required minLength={2} maxLength={120} /></label>
    <label>WhatsApp<input value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} inputMode="tel" autoComplete="tel" required minLength={10} maxLength={20} /></label>
    <label>E-mail <small>Opcional</small><input name="email" type="email" autoComplete="email" maxLength={180} defaultValue={account.session.user.email||""}/></label>
    <label>Experiência ou mensagem <small>Opcional</small><textarea name="message" maxLength={1500} rows={5} placeholder="Conte brevemente sua experiência relacionada à vaga." /></label>
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="checkbox-row"><input name="privacyConsent" type="checkbox" required /><span>Li e aceito a <Link href="/privacidade">Política de Privacidade</Link> para envio desta candidatura.</span></label>
    <Turnstile key={challengeKey} action="job_application" onToken={handleTurnstileToken} />
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <button className="button button-primary button-full" type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar candidatura"}</button>
  </form>;
}
