"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/auth/use-account";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function CompanyDashboard() {
  const { account, loading } = useAccount();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!account) return;
    if (account.profile.role !== "company") { router.replace(account.profile.role === "candidate" ? "/candidato" : "/admin"); return; }
    if (!account.company) return;
    const supabase = createSupabaseBrowser();
    void Promise.all([
      supabase.from("jobs").select("id,title,status,expires_at,created_at,is_featured").eq("company_id", account.company.company_id).order("created_at", {ascending:false}),
      supabase.from("job_applications").select("id,status,created_at,job_id").order("created_at", {ascending:false}).limit(100),
      supabase.from("subscriptions").select("plan_code,status,period_end").eq("company_id", account.company.company_id).maybeSingle(),
      supabase.from("notifications").select("id,title,body,href,read_at,created_at").order("created_at", {ascending:false}).limit(5),
    ]).then(([jobResult,appResult,subResult,noteResult])=>{setJobs(jobResult.data||[]);setApplications(appResult.data||[]);setSubscription(subResult.data);setNotifications(noteResult.data||[])});
  }, [account,router]);

  if (loading) return <div className="account-card"><p>Carregando painel...</p></div>;
  if (!account) return <div className="account-card"><h2>Entre para acessar o painel empresarial.</h2><Link className="button button-primary" href="/entrar">Entrar</Link></div>;

  const active = jobs.filter(j=>j.status==="published" && (!j.expires_at || new Date(j.expires_at)>new Date())).length;
  return <>
    <div className="dashboard-stats">
      <div className="stat-card"><strong>{active}</strong><span>Vagas ativas</span></div>
      <div className="stat-card"><strong>{applications.length}</strong><span>Candidaturas</span></div>
      <div className="stat-card"><strong>{String(subscription?.plan_code||"free").toUpperCase()}</strong><span>Plano atual</span></div>
    </div>
    <div className="dashboard-grid">
      <section className="account-card">
        <span className="eyebrow">Vagas</span><h2>Publique e gerencie oportunidades.</h2><p>O plano gratuito permite 1 vaga ativa por 7 dias. Planos pagos ativos permitem duração de até 6 meses.</p>
        <div className="card-actions"><Link className="button button-primary" href="/empresa/vagas/nova">Nova vaga</Link><Link className="button button-secondary" href="/empresa/vagas">Minhas vagas</Link></div>
      </section>
      <section className="account-card">
        <span className="eyebrow">Candidaturas</span><h2>Veja quem demonstrou interesse.</h2><p>Somente sua empresa consegue acessar as candidaturas das próprias vagas.</p>
        <Link className="button button-secondary" href="/empresa/vagas">Abrir vagas e candidatos</Link>
      </section>
      <section className="account-card">
        <span className="eyebrow">Comercial</span><h2>Planos, destaque e divulgação.</h2><p>Solicite um upgrade, destaque uma vaga ou peça divulgação em Instagram/TikTok.</p>
        <div className="card-actions"><Link className="button button-primary" href="/empresa/plano">Ver planos</Link><Link className="button button-secondary" href="/empresa/divulgacao">Divulgação</Link></div>
      </section>
      <section className="account-card">
        <span className="eyebrow">Notificações</span><h2>Últimas atualizações</h2>
        {notifications.length?<div className="mini-list">{notifications.map(n=><Link key={n.id} href={n.href||"/empresa"}><strong>{n.title}</strong><span>{n.body||""}</span></Link>)}</div>:<p>Nenhuma notificação ainda.</p>}
      </section>
    </div>
  </>;
}
