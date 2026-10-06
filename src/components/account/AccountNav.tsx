"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "@/lib/auth/use-account";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function AccountNav({ onNavigate }: { onNavigate?: () => void }) {
  const { account, loading } = useAccount();
  const router = useRouter();

  async function signOut() {
    await createSupabaseBrowser().auth.signOut();
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  if (loading) return <span className="account-nav-placeholder" aria-hidden="true" />;
  if (!account) {
    return <div className="nav-actions"><Link className="button button-secondary button-small" href="/entrar" onClick={onNavigate}>Entrar</Link><Link className="button button-primary button-small" href="/cadastro" onClick={onNavigate}>Criar conta</Link></div>;
  }

  const dashboard = account.profile.role === "company" ? "/empresa" : account.profile.role === "admin" || account.profile.role === "moderator" ? "/admin" : "/candidato";
  return <div className="account-nav">
    <Link className="nav-link" href={dashboard} onClick={onNavigate}>Minha conta</Link>
    <Link className="nav-link" href="/configuracoes" onClick={onNavigate}>Configurações</Link>
    <button className="nav-link nav-button" type="button" onClick={signOut}>Sair</button>
  </div>;
}
