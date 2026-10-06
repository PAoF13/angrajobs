"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { candidateAreas } from "@/features/leads/schemas";
import { contractTypes, scheduleTypes, workModes } from "@/features/jobs/schemas";
import { useAccount } from "@/lib/auth/use-account";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function CompanyJobForm({ jobId }: { jobId?: string }) {
  const { account, loading } = useAccount(); const router=useRouter();
  const [job,setJob]=useState<any>(null);const[saving,setSaving]=useState(false);const[error,setError]=useState("");
  useEffect(()=>{if(!jobId||!account?.company)return;void createSupabaseBrowser().from("jobs").select("*").eq("id",jobId).eq("company_id",account.company.company_id).maybeSingle().then(({data})=>setJob(data));},[jobId,account]);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!account)return;setSaving(true);setError("");const form=new FormData(event.currentTarget);const payload={title:String(form.get("title")||""),category:String(form.get("category")||""),neighborhood:String(form.get("neighborhood")||""),region:String(form.get("region")||"Angra dos Reis"),contractType:String(form.get("contractType")||""),workMode:String(form.get("workMode")||""),salaryMin:String(form.get("salaryMin")||""),salaryMax:String(form.get("salaryMax")||""),salaryText:String(form.get("salaryText")||""),description:String(form.get("description")||""),requirements:String(form.get("requirements")||""),benefits:String(form.get("benefits")||""),workSchedule:String(form.get("workSchedule")||""),scheduleType:String(form.get("scheduleType")||""),experienceMinMonths:Number(form.get("experienceMinMonths")||0),startDate:String(form.get("startDate")||""),skills:String(form.get("skills")||""),status:String(form.get("status")||"draft"),durationDays:Number(form.get("durationDays")||7)};const response=await fetch(jobId?`/api/company/jobs/${jobId}`:"/api/company/jobs",{method:jobId?"PATCH":"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${account.session.access_token}`},body:JSON.stringify(payload)});const body=await response.json().catch(()=>null);if(!response.ok){setError(body?.error?.message||"Não foi possível salvar a vaga.");setSaving(false);return}router.push("/empresa/vagas");router.refresh();}
  if(loading)return <div className="account-card">Carregando...</div>;if(!account?.company)return <div className="account-card">Entre com uma conta empresarial.</div>;
  return <form className="account-card dashboard-form" onSubmit={submit}><span className="eyebrow">{jobId?"Editar vaga":"Nova vaga"}</span><h2>{jobId?"Atualize a oportunidade":"Cadastre uma oportunidade"}</h2>
  <label>Cargo<input name="title" defaultValue={job?.title||""} required maxLength={180}/></label>
  <div className="form-grid-2"><label>Área<select name="category" defaultValue={job?.category||""}><option value="">Selecione</option>{candidateAreas.map(a=><option key={a}>{a}</option>)}</select></label><label>Bairro<input name="neighborhood" defaultValue={job?.neighborhood||""} maxLength={120}/></label></div>
  <div className="form-grid-2"><label>Região<input name="region" defaultValue={job?.region||"Angra dos Reis"}/></label><label>Contrato<select name="contractType" defaultValue={job?.contract_type||""}><option value="">Selecione</option>{contractTypes.filter(x=>x!=="Qualquer").map(x=><option key={x}>{x}</option>)}</select></label></div>
  <div className="form-grid-2"><label>Modalidade<select name="workMode" defaultValue={job?.work_mode||""}><option value="">Selecione</option>{workModes.filter(x=>x!=="Qualquer").map(x=><option key={x}>{x}</option>)}</select></label><label>Horário<select name="scheduleType" defaultValue={job?.schedule_type||""}><option value="">Selecione</option>{scheduleTypes.filter(x=>x!=="Qualquer").map(x=><option key={x}>{x}</option>)}</select></label></div>
  <div className="form-grid-2"><label>Salário mínimo em centavos <small>Ex.: 180000 = R$ 1.800</small><input name="salaryMin" type="number" min="0" defaultValue={job?.salary_min??""}/></label><label>Salário máximo em centavos<input name="salaryMax" type="number" min="0" defaultValue={job?.salary_max??""}/></label></div>
  <label>Faixa salarial em texto <small>Opcional</small><input name="salaryText" defaultValue={job?.salary_text||""} placeholder="R$ 1.800 a R$ 2.200"/></label>
  <label>Descrição<textarea name="description" required minLength={10} maxLength={12000} rows={7} defaultValue={job?.description||""}/></label>
  <label>Requisitos<textarea name="requirements" rows={4} maxLength={5000} defaultValue={job?.requirements||""}/></label>
  <label>Benefícios<textarea name="benefits" rows={3} maxLength={3000} defaultValue={job?.benefits||""}/></label>
  <div className="form-grid-2"><label>Escala/horário<input name="workSchedule" defaultValue={job?.work_schedule||""} placeholder="Ex.: 6x1, 08h às 17h"/></label><label>Experiência mínima em meses<input name="experienceMinMonths" type="number" min="0" max="600" defaultValue={job?.experience_min_months??0}/></label></div>
  <div className="form-grid-2"><label>Data prevista de início<input name="startDate" type="date" defaultValue={job?.start_date||""}/></label><label>Duração desejada em dias<input name="durationDays" type="number" min="1" max="180" defaultValue={job?.duration_days??7}/><small>Grátis: máximo 7 dias. Pro/Business: até 180 dias.</small></label></div>
  <label>Habilidades <small>Separadas por vírgula</small><input name="skills" defaultValue={(job?.skills||[]).join(", ")}/></label>
  <label>Status<select name="status" defaultValue={job?.status||"draft"}><option value="draft">Salvar rascunho</option><option value="published">Publicar</option><option value="paused">Pausar</option></select></label>
  {error?<p className="form-error">{error}</p>:null}<button className="button button-primary" disabled={saving}>{saving?"Salvando...":jobId?"Salvar alterações":"Criar vaga"}</button></form>;
}
