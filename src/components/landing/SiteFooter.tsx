"use client";

import Link from "next/link";
import { Brand } from "./Brand";
import { track } from "@/lib/analytics/track";

export function SiteFooter() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || "#";
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "#";

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Brand href="/" />
          <p>Vagas e empregos em Angra dos Reis.</p>
          <a className="footer-contact" href="mailto:contato.angrajobs@gmail.com">contato.angrajobs@gmail.com</a>
          <p className="footer-domain">angrajobs.com.br</p>
        </div>
        <div className="footer-links">
          <Link href="/vagas">Vagas</Link>
          <Link href="/#empresas">Para Empresas</Link>
          <a href={instagramUrl} target={instagramUrl === "#" ? undefined : "_blank"} rel="noreferrer" onClick={() => void track("click_instagram", { location: "footer" })}>Instagram</a>
          <a href={tiktokUrl} target={tiktokUrl === "#" ? undefined : "_blank"} rel="noreferrer">TikTok</a>
          <a href={whatsappUrl} target={whatsappUrl === "#" ? undefined : "_blank"} rel="noreferrer" onClick={() => void track("click_whatsapp", { location: "footer" })}>WhatsApp</a>
          <a href="mailto:contato.angrajobs@gmail.com">Contato</a>
          <Link href="/privacidade">Política de Privacidade</Link>
          <Link href="/termos">Termos de Uso</Link>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 AngraJobs. Todos os direitos reservados.</div>
    </footer>
  );
}
