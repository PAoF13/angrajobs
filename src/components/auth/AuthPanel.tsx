"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function LoginPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowser();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") || "").trim(),
      password: String(form.get("password") || ""),
    });
    if (authError || !data.user) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
    if (profile?.role === "company") router.push("/empresa");
    else if (profile?.role === "admin" || profile?.role === "moderator") router.push("/admin");
    else router.push("/candidato");
    router.refresh();
  }

  return (
    <form className="account-card auth-form" onSubmit={submit}>
      <span className="eyebrow">Acessar conta</span>
      <h1>Entrar na AngraJobs</h1>
      <p>Use seu e-mail e senha para acessar seu painel.</p>
      <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
      <label>Senha<input name="password" type="password" autoComplete="current-password" required minLength={8} /></label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button button-primary button-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      <div className="auth-links">
        <Link href="/recuperar-senha">Esqueci minha senha</Link>
        <Link href="/cadastro">Criar conta</Link>
      </div>
    </form>
  );
}

export function SignupPanel() {
  const router = useRouter();
  const [role, setRole] = useState<"candidate" | "company">("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tipo") === "empresa") setRole("company");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password.length < 8) {
      setError("Use uma senha com pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }
    const supabase = createSupabaseBrowser();
    const origin = window.location.origin;
    const { data, error: authError } = await supabase.auth.signUp({
      email: String(form.get("email") || "").trim(),
      password,
      options: {
        emailRedirectTo: `${origin}/entrar?confirmado=1`,
        data: {
          role,
          display_name: String(form.get("displayName") || "").trim(),
          company_name: role === "company" ? String(form.get("companyName") || "").trim() : "",
          whatsapp: String(form.get("whatsapp") || "").trim(),
        },
      },
    });

    if (authError) {
      setError(authError.message.includes("registered") ? "Este e-mail já possui uma conta." : "Não foi possível criar sua conta agora.");
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push(role === "company" ? "/empresa" : "/candidato");
      router.refresh();
      return;
    }

    setMessage("Conta criada. Verifique seu e-mail para confirmar o cadastro e depois faça login.");
    setLoading(false);
  }

  return (
    <form className="account-card auth-form" onSubmit={submit}>
      <span className="eyebrow">Criar conta</span>
      <h1>Como você vai usar a AngraJobs?</h1>
      <p>Escolha o tipo correto. Isso define seu painel e suas permissões.</p>
      <div className="role-picker" role="group" aria-label="Tipo de conta">
        <button type="button" className={role === "candidate" ? "role-option active" : "role-option"} onClick={() => setRole("candidate")}>Sou candidato</button>
        <button type="button" className={role === "company" ? "role-option active" : "role-option"} onClick={() => setRole("company")}>Sou empresa</button>
      </div>
      <label>{role === "company" ? "Nome do responsável" : "Seu nome"}<input name="displayName" autoComplete="name" required minLength={2} maxLength={120} /></label>
      {role === "company" ? <label>Nome da empresa<input name="companyName" required minLength={2} maxLength={180} /></label> : null}
      <label>WhatsApp<input name="whatsapp" inputMode="tel" autoComplete="tel" required minLength={10} maxLength={20} /></label>
      <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
      <label>Senha<input name="password" type="password" autoComplete="new-password" required minLength={8} /></label>
      <label className="checkbox-row"><input name="privacy" type="checkbox" required /><span>Li e aceito a <Link href="/privacidade">Política de Privacidade</Link> e os <Link href="/termos">Termos de Uso</Link>.</span></label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {message ? <p className="form-success" role="status">{message}</p> : null}
      <button className="button button-primary button-full" disabled={loading}>{loading ? "Criando conta..." : "Criar minha conta"}</button>
      <div className="auth-links"><Link href="/entrar">Já tenho conta</Link></div>
    </form>
  );
}
