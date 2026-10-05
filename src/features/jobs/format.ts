import type { Job } from "./types";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function moneyFromCents(value: number) {
  return money.format(value / 100);
}

export function formatJobLocation(job: Pick<Job, "neighborhood" | "region">) {
  return [job.neighborhood, job.region].filter(Boolean).join(", ") || "Angra dos Reis";
}

export function formatJobSalary(job: Pick<Job, "salary_min" | "salary_max" | "salary_text">) {
  if (job.salary_text) return job.salary_text;
  if (job.salary_min != null && job.salary_max != null) return `${moneyFromCents(job.salary_min)} a ${moneyFromCents(job.salary_max)}`;
  if (job.salary_min != null) return `A partir de ${moneyFromCents(job.salary_min)}`;
  if (job.salary_max != null) return `Até ${moneyFromCents(job.salary_max)}`;
  return null;
}

export function formatPublishedDate(value: string | null, fallback: string) {
  const date = new Date(value || fallback);
  if (Number.isNaN(date.getTime())) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatStartDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
