"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function RecoveryRequestForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const supabase = createSupabaseBrowser();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (resetError) setError("Não foi possível enviar o e-mail agora.");
    else setMessage("Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.");
    setLoading(false);
  }

  return <form className="account-card auth-form" onSubmit={submit}>
    <span className="eyebrow">Recuperação</span><h1>Recuperar conta</h1><p>Enviaremos um link de redefinição para seu e-mail.</p>
    <label>E-mail<input name="email" type="email" required autoComplete="email" /></label>
    {error ? <p className="form-error">{error}</p> : null}{message ? <p className="form-success">{message}</p> : null}
    <button className="button button-primary button-full" disabled={loading}>{loading ? "Enviando..." : "Enviar link"}</button>
    <div className="auth-links"><Link href="/entrar">Voltar para entrar</Link></div>
  </form>;
}

export function PasswordResetForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");
    if (password.length < 8 || password !== confirmation) {
      setError(password !== confirmation ? "As senhas não coincidem." : "Use pelo menos 8 caracteres."); setLoading(false); return;
    }
    const supabase = createSupabaseBrowser();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError("Abra novamente o link de recuperação enviado por e-mail e tente outra vez.");
    else setMessage("Senha atualizada. Você já pode entrar normalmente.");
    setLoading(false);
  }

  return <form className="account-card auth-form" onSubmit={submit}>
    <span className="eyebrow">Nova senha</span><h1>Redefinir senha</h1><p>Escolha uma nova senha para sua conta.</p>
    <label>Nova senha<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
    <label>Confirmar senha<input name="confirmation" type="password" autoComplete="new-password" minLength={8} required /></label>
    {error ? <p className="form-error">{error}</p> : null}{message ? <p className="form-success">{message}</p> : null}
    <button className="button button-primary button-full" disabled={loading}>{loading ? "Salvando..." : "Salvar nova senha"}</button>
    <div className="auth-links"><Link href="/entrar">Ir para login</Link></div>
  </form>;
}
