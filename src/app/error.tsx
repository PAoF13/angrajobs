"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="success-shell">
          <section className="success-card">
            <span className="eyebrow">Erro</span>
            <h1>Algo não carregou como esperado.</h1>
            <p>Tente novamente. Se o problema continuar, entre em contato com a AngraJobs.</p>
            <button className="button button-primary" type="button" onClick={reset}>Tentar novamente</button>
          </section>
        </main>
      </body>
    </html>
  );
}
