"use client";

import { FormEvent, useEffect, useState } from "react";
import { PromotionRequestDialog } from "@/components/company/PromotionRequestDialog";
import { plans, featuredJob } from "@/features/billing/plans";
import { useAccount } from "@/lib/auth/use-account";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function CompanyPlans() {
  const { account, loading } = useAccount();
  const [current,setCurrent]=useState("free"); const[jobs,setJobs]=useState<any[]>([]); const[message,setMessage]=useState("");const[error,setError]=useState("");
  useEffect(()=>{if(!account?.company)return;const s=createSupabaseBrowser();void Promise.all([s.from("subscriptions").select("plan_code,status").eq("company_id",account.company.company_id).maybeSingle(),s.from("jobs").select("id,title,status").eq("company_id",account.company.company_id).order("created_at",{ascending:false})]).then(([sub,j])=>{setCurrent(sub.data?.plan_code||"free");setJobs(j.data||[])})},[account]);
  async function requestPlan(code:"pro"|"business"){if(!account)return;setMessage("");setError("");const r=await fetch("/api/company/plan-requests",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${account.session.access_token}`},body:JSON.stringify({requestType:"subscription",planCode:code})});if(!r.ok){setError("Não foi possível enviar a solicitação.");return}setMessage("Solicitação enviada. O plano só será ativado após aprovação/pagamento validado.")}
  async function requestFeatured(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!account)return;const f=new FormData(event.currentTarget);const r=await fetch("/api/company/plan-requests",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${account.session.access_token}`},body:JSON.stringify({requestType:"featured_job",jobId:String(f.get("jobId")||""),durationDays:Number(f.get("durationDays")||30)})});if(!r.ok){setError("Não foi possível solicitar o destaque.");return}setMessage("Destaque solicitado. Ele não é ativado antes da validação comercial.")}
  if(loading)return<div className="account-card">Carregando planos...</div>;if(!account?.company)return<div className="account-card">Entre com uma conta empresarial.</div>;
  return <><div className="billing-note"><strong>Preços em validação.</strong><p>Os valores abaixo são hipóteses comerciais iniciais. A AngraJobs não concede plano pago apenas porque o usuário clicou em um botão. Até conectarmos um provedor de pagamento com webhook autenticado, upgrades ficam pendentes para aprovação administrativa.</p></div>
  <div className="plan-grid">
    <PlanCard title={plans.free.name} price={plans.free.priceLabel} features={plans.free.features} active={current==="free"}/>
    <PlanCard title="Vaga destacada" price={featuredJob.priceLabel} features={featuredJob.features}><form className="mini-form" onSubmit={requestFeatured}><select name="jobId" required defaultValue=""><option value="" disabled>Escolha a vaga</option>{jobs.map(j=><option key={j.id} value={j.id}>{j.title}</option>)}</select><select name="durationDays" defaultValue="30"><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option><option value="180">180 dias</option></select><button className="button button-secondary">Solicitar destaque</button></form></PlanCard>
    <PlanCard title={plans.pro.name} price={plans.pro.priceLabel} features={plans.pro.features} active={current==="pro"}><button className="button button-primary" onClick={()=>void requestPlan("pro")}>Solicitar Pro</button></PlanCard>
    <PlanCard title={plans.business.name} price={plans.business.priceLabel} features={plans.business.features} active={current==="business"}><button className="button button-primary" onClick={()=>void requestPlan("business")}>Solicitar Business</button></PlanCard>
    <PlanCard title="Serviço de divulgação" price="Sob orçamento" features={["Vídeo, live ou collab", "Instagram, TikTok ou ambos", "Estimativa preliminar entre R$ 0 e R$ 50", "Valor final confirmado antes da execução"]}><PromotionRequestDialog /></PlanCard>
  </div>{error?<p className="form-error">{error}</p>:null}{message?<p className="form-success">{message}</p>:null}</>;
}
function PlanCard({title,price,features,active,children}:{title:string;price:string;features:string[];active?:boolean;children?:React.ReactNode}){return <article className={active?"plan-card active":"plan-card"}><div><span className="eyebrow">{active?"Plano atual":"Plano"}</span><h2>{title}</h2><strong className="plan-price">{price}</strong></div><ul>{features.map(x=><li key={x}>{x}</li>)}</ul>{children}</article>}
