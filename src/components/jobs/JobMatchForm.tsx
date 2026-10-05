"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { candidateAreas } from "@/features/leads/schemas";
import { contractTypes, scheduleTypes, workModes } from "@/features/jobs/schemas";
import type { JobMatchResult } from "@/features/jobs/types";
import { JobCard } from "./JobCard";
import { track } from "@/lib/analytics/track";

export function JobMatchForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<JobMatchResult[] | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const skills = String(form.get("skills") || "");

    try {
      const response = await fetch("/api/jobs/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: String(form.get("category") || ""),
          neighborhood: String(form.get("neighborhood") || ""),
          contractType: String(form.get("contractType") || "Qualquer"),
          workMode: String(form.get("workMode") || "Qualquer"),
          experienceMonths: Number(form.get("experienceMonths") || 0),
          availableFrom: String(form.get("availableFrom") || ""),
          scheduleType: String(form.get("scheduleType") || "Qualquer"),
          skills,
        }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message || "Não foi possível calcular as compatibilidades.");

      setResults(body.results ?? []);
      void track("job_match_completed", { resultCount: body.results?.length ?? 0 });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível calcular as compatibilidades.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="match-panel" id="compatibilidade">
      <div className="match-intro">
        <span className="eyebrow">Compatibilidade de vagas</span>
        <h2>Encontre oportunidades que combinam com o que você informou.</h2>
        <p>
          A pontuação compara somente critérios profissionais da vaga, como área, experiência, disponibilidade e horário.
          Ela <strong>não é uma probabilidade de contratação</strong> e não é usada para rejeitar candidatos.
          A AngraJobs compara o que foi informado, mas não consegue confirmar automaticamente se uma resposta é verdadeira.
        </p>
      </div>

      <form className="match-form" onSubmit={handleSubmit}>
        <label>
          Área principal
          <select name="category" required defaultValue="">
            <option value="" disabled>Selecione</option>
            {candidateAreas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
        </label>

        <label>
          Bairro preferido <small>Opcional</small>
          <input name="neighborhood" maxLength={120} placeholder="Ex.: Centro, Japuíba ou qualquer bairro" />
        </label>

        <div className="match-form-grid">
          <label>
            Tipo de contrato
            <select name="contractType" defaultValue="Qualquer">
              {contractTypes.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Modalidade
            <select name="workMode" defaultValue="Qualquer">
              {workModes.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>

        <div className="match-form-grid">
          <label>
            Experiência na área, em meses
            <input name="experienceMonths" type="number" min="0" max="600" defaultValue="0" required />
          </label>
          <label>
            Disponível a partir de
            <input name="availableFrom" type="date" required />
          </label>
        </div>

        <label>
          Horário
          <select name="scheduleType" defaultValue="Qualquer">
            {scheduleTypes.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>

        <label>
          Habilidades principais <small>Opcional, separadas por vírgula</small>
          <input name="skills" maxLength={500} placeholder="Ex.: atendimento, Excel, vendas" />
        </label>

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <button className="button button-primary button-full" type="submit" disabled={loading}>
          {loading ? "Comparando vagas..." : "Encontrar vagas compatíveis"}
        </button>
        <p className="match-note">Nenhum dado sensível é usado nessa pontuação. Suas respostas de compatibilidade não são salvas nesta versão.</p>
      </form>

      {results ? (
        <div className="match-results" aria-live="polite">
          <div className="section-heading">
            <span className="eyebrow">Resultado</span>
            <h2>{results.length ? "Vagas ordenadas por compatibilidade" : "Nenhuma vaga publicada para comparar"}</h2>
          </div>
          {results.length ? (
            <div className="jobs-grid">
              {results.map((result) => (
                <JobCard key={result.job.id} job={result.job} match={result} />
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <p>Cadastre seu interesse para ser avisado quando novas vagas forem publicadas.</p>
              <Link className="button button-secondary" href="/#form-candidato">Quero receber novas vagas</Link>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
