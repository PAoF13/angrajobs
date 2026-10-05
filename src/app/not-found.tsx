import Link from "next/link";
import { Brand } from "@/components/landing/Brand";

export default function NotFound() {
  return (
    <main className="success-shell">
      <div className="success-top"><Brand /></div>
      <section className="success-card">
        <span className="eyebrow">404</span>
        <h1>Página não encontrada.</h1>
        <p>O endereço acessado não existe ou foi alterado.</p>
        <Link className="button button-primary" href="/">Voltar para a AngraJobs</Link>
      </section>
    </main>
  );
}
