"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "@/lib/auth/use-account";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function SettingsPanel() {
  const { account, loading } = useAccount();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("Angra dos Reis");
  const [companyData,setCompanyData]=useState<any>(null);

  useEffect(() => {
    if (!account) return;
    setName(account.profile.display_name || "");
    setWhatsapp(account.profile.whatsapp || "");
    setCity(account.profile.city || "Angra dos Reis");
    if (account.company) {
      void createSupabaseBrowser().from("companies").select("trade_name,phone,neighborhood,city").eq("id", account.company.company_id).maybeSingle().then(({data})=>setCompanyData(data));
    }
  }, [account]);

  if (loading) return <div className="account-card"><p>Carregando configurações...</p></div>;
  if (!account) return <div className="account-card"><h1>Entre para acessar as configurações.</h1><Link className="button button-primary" href="/entrar">Entrar</Link></div>;

  async function save() {
    setMessage(""); setError("");
    const token = account?.session.access_token;
    if (!token) return;
    const response = await fetch("/api/account/profile", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ displayName: name, whatsapp, city }) });
    if (!response.ok) { setError("Não foi possível salvar agora."); return; }
    setMessage("Configurações salvas.");
  }

  async function saveCompany() {
    if (!account?.company || !companyData) return;
    setMessage(""); setError("");
    const response = await fetch("/api/company/profile", { method:"PATCH", headers:{"Content-Type":"application/json",Authorization:`Bearer ${account.session.access_token}`}, body:JSON.stringify({tradeName:companyData.trade_name||"",phone:companyData.phone||"",neighborhood:companyData.neighborhood||"",city:companyData.city||"Angra dos Reis"}) });
    if (!response.ok) setError("Não foi possível salvar os dados da empresa."); else setMessage("Dados da empresa salvos.");
  }

  return <div className="settings-grid">
    <section className="account-card">
      <span className="eyebrow">Aparência</span><h2>Como você quer ver a AngraJobs?</h2><p>A preferência fica salva neste navegador.</p><ThemeToggle />
    </section>
    <section className="account-card">
      <span className="eyebrow">Conta</span><h2>Dados básicos</h2>
      <label>Nome<input value={name} onChange={(e)=>setName(e.target.value)} maxLength={120}/></label>
      <label>WhatsApp<input value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} maxLength={20}/></label>
      <label>Cidade<input value={city} onChange={(e)=>setCity(e.target.value)} maxLength={120}/></label>
      {error ? <p className="form-error">{error}</p> : null}{message ? <p className="form-success">{message}</p> : null}
      <button className="button button-primary" onClick={save}>Salvar dados</button>
    </section>
    <section className="account-card">
      <span className="eyebrow">Segurança</span><h2>Senha e acesso</h2><p>Você pode redefinir sua senha a qualquer momento pelo e-mail cadastrado.</p><Link className="button button-secondary" href="/recuperar-senha">Redefinir senha</Link>
    </section>
    {account.profile.role === "company" && companyData ? <section className="account-card"><span className="eyebrow">Empresa</span><h2>Dados da empresa</h2><label>Nome comercial<input value={companyData.trade_name||""} onChange={e=>setCompanyData({...companyData,trade_name:e.target.value})}/></label><label>Telefone<input value={companyData.phone||""} onChange={e=>setCompanyData({...companyData,phone:e.target.value})}/></label><label>Bairro<input value={companyData.neighborhood||""} onChange={e=>setCompanyData({...companyData,neighborhood:e.target.value})}/></label><label>Cidade<input value={companyData.city||"Angra dos Reis"} onChange={e=>setCompanyData({...companyData,city:e.target.value})}/></label><button className="button button-secondary" onClick={saveCompany}>Salvar empresa</button></section> : null}
    {account.profile.role === "company" ? <section className="account-card"><span className="eyebrow">Empresa</span><h2>Plano e recursos</h2><p>Veja limites de vagas, solicitações de destaque e planos comerciais.</p><Link className="button button-primary" href="/empresa/plano">Ver planos</Link></section> : null}
  </div>;
}
