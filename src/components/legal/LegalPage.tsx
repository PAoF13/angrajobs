import Link from "next/link";
import { Brand } from "@/components/landing/Brand";

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <main className="legal-shell">
      <header className="legal-top">
        <Brand />
        <Link className="text-link" href="/">Voltar para o início</Link>
      </header>
      <article className="legal-card">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="legal-updated">Última atualização: {updatedAt}</p>
        <div className="legal-content">{children}</div>
      </article>
    </main>
  );
}
