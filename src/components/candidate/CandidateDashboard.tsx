"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/auth/use-account";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function CandidateDashboard() {
  const { account, loading } = useAccount();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!account) return;
    if (account.profile.role !== "candidate") {
      router.replace(account.profile.role === "company" ? "/empresa" : "/admin");
      return;
    }
    const supabase = createSupabaseBrowser();
    void Promise.all([
      supabase.from("candidate_profiles").select("*").eq("user_id", account.profile.id).maybeSingle(),
      supabase.from("job_applications").select("id,status,created_at,jobs(title,slug,company_name)").eq("candidate_id", account.profile.id).order("created_at", { ascending: false }).limit(5),
    ]).then(([profileResult, appResult]) => {
      setProfile(profileResult.data);
      setApplications(appResult.data || []);
    });
  }, [account, router]);

  if (loading) return <div className="account-card"><p>Carregando seu painel...</p></div>;
  if (!account) return <div className="account-card"><h2>Entre para acessar seu painel.</h2><Link className="button button-primary" href="/entrar">Entrar</Link></div>;

  const complete = Boolean(profile?.area && profile?.availability_date);
  return <>
    <div className="dashboard-stats">
      <div className="stat-card"><strong>{applications.length}</strong><span>Candidaturas recentes</span></div>
      <div className="stat-card"><strong>{complete ? "Pronto" : "Pendente"}</strong><span>Perfil profissional</span></div>
      <div className="stat-card"><strong>Local</strong><span>Foco em Angra dos Reis</span></div>
    </div>
    <div className="dashboard-grid">
      <section className="account-card">
        <span className="eyebrow">Seu perfil</span><h2>{complete ? "Perfil preparado para comparar vagas." : "Complete seu perfil profissional."}</h2>
        <p>Área, disponibilidade, experiência e habilidades ajudam você a encontrar vagas mais compatíveis.</p>
        <Link className="button button-primary" href="/candidato/perfil">{complete ? "Editar perfil" : "Completar perfil"}</Link>
      </section>
      <section className="account-card">
        <span className="eyebrow">Candidaturas</span><h2>Acompanhe o que você enviou.</h2>
        {applications.length ? <div className="mini-list">{applications.map((item)=>{
          const job = item.jobs as any;
          return <Link key={item.id} href={job?.slug ? `/vagas/${job.slug}` : "/candidato/candidaturas"}><strong>{job?.title || "Vaga"}</strong><span>{job?.company_name || "Empresa"} · {labelStatus(item.status)}</span></Link>
        })}</div> : <p>Você ainda não enviou nenhuma candidatura.</p>}
        <div className="card-actions"><Link className="button button-secondary" href="/candidato/candidaturas">Ver todas</Link><Link className="button button-primary" href="/vagas">Encontrar vagas</Link></div>
      </section>
    </div>
  </>;
}

function labelStatus(status: string) {
  return ({received:"Recebida",reviewing:"Em análise",interview:"Entrevista",rejected:"Encerrada",hired:"Contratado",withdrawn:"Retirada"} as Record<string,string>)[status] || status;
}
