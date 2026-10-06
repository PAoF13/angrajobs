"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { candidateAreas } from "@/features/leads/schemas";
import { contractTypes, scheduleTypes, workModes } from "@/features/jobs/schemas";
import { useAccount } from "@/lib/auth/use-account";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function CandidateProfileForm() {
  const { account, loading } = useAccount();
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!account) return;
    if (account.profile.role !== "candidate") { router.replace("/"); return; }
    void createSupabaseBrowser().from("candidate_profiles").select("*").eq("user_id", account.profile.id).maybeSingle().then(({data})=>setData(data || {}));
  }, [account, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!account) return;
    setSaving(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/candidate/profile", { method:"PATCH", headers:{"Content-Type":"application/json",Authorization:`Bearer ${account.session.access_token}`}, body:JSON.stringify({
      displayName: account.profile.display_name,
      whatsapp: account.profile.whatsapp || "",
      city: account.profile.city,
      headline:String(form.get("headline")||""), area:String(form.get("area")||""), neighborhood:String(form.get("neighborhood")||""),
      experienceMonths:Number(form.get("experienceMonths")||0), availabilityDate:String(form.get("availabilityDate")||""), scheduleType:String(form.get("scheduleType")||""),
      contractPreference:String(form.get("contractPreference")||""), workModePreference:String(form.get("workModePreference")||""), skills:String(form.get("skills")||"")
    })});
    if (!response.ok) setError("Não foi possível salvar seu perfil."); else setMessage("Perfil profissional salvo.");
    setSaving(false);
  }

  if (loading || !account) return <div className="account-card"><p>Carregando...</p></div>;
  return <form className="account-card dashboard-form" onSubmit={submit}>
    <span className="eyebrow">Perfil profissional</span><h2>Dados usados para ajudar você a encontrar vagas.</h2><p>Essas informações não representam garantia de contratação.</p>
    <label>Título profissional <small>Opcional</small><input name="headline" defaultValue={data.headline || ""} maxLength={180} placeholder="Ex.: Recepcionista com experiência em hotelaria" /></label>
    <label>Área principal<select name="area" defaultValue={data.area || ""}><option value="">Selecione</option>{candidateAreas.map(a=><option key={a}>{a}</option>)}</select></label>
    <label>Bairro preferido<input name="neighborhood" defaultValue={data.neighborhood || ""} maxLength={120}/></label>
    <div className="form-grid-2"><label>Experiência em meses<input name="experienceMonths" type="number" min="0" max="600" defaultValue={data.experience_months ?? 0}/></label><label>Disponível a partir de<input name="availabilityDate" type="date" defaultValue={data.availability_date || ""}/></label></div>
    <div className="form-grid-2"><label>Contrato<select name="contractPreference" defaultValue={data.contract_preference || "Qualquer"}>{contractTypes.map(x=><option key={x}>{x}</option>)}</select></label><label>Modalidade<select name="workModePreference" defaultValue={data.work_mode_preference || "Qualquer"}>{workModes.map(x=><option key={x}>{x}</option>)}</select></label></div>
    <label>Horário<select name="scheduleType" defaultValue={data.schedule_type || "Qualquer"}>{scheduleTypes.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Habilidades <small>Separadas por vírgula</small><input name="skills" defaultValue={(data.skills || []).join(", ")} maxLength={800}/></label>
    {error ? <p className="form-error">{error}</p>:null}{message?<p className="form-success">{message}</p>:null}
    <button className="button button-primary" disabled={saving}>{saving?"Salvando...":"Salvar perfil"}</button>
  </form>;
}
