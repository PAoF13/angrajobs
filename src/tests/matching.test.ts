import { describe, expect, it } from "vitest";
import { scoreJobMatch } from "@/features/jobs/matching";
import type { Job, JobMatchProfile } from "@/features/jobs/types";

const job: Job = {
  id: "11111111-1111-4111-8111-111111111111",
  slug: "atendente-empresa-teste",
  title: "Atendente",
  company_name: "Empresa Teste",
  category: "Atendimento",
  neighborhood: "Centro",
  region: "Angra dos Reis",
  contract_type: "CLT",
  work_mode: "Presencial",
  salary_min: 180000,
  salary_max: 220000,
  salary_text: null,
  description: "Atendimento ao público.",
  requirements: "Boa comunicação.",
  benefits: null,
  work_schedule: "Horário comercial",
  schedule_type: "Comercial",
  experience_min_months: 6,
  start_date: "2026-10-10",
  skills: ["atendimento", "comunicação"],
  status: "published",
  published_at: "2026-10-05T10:00:00.000Z",
  expires_at: null,
  created_at: "2026-10-05T10:00:00.000Z",
  updated_at: "2026-10-05T10:00:00.000Z",
};

const strongProfile: JobMatchProfile = {
  category: "Atendimento",
  neighborhood: "Centro",
  contractType: "CLT",
  workMode: "Presencial",
  experienceMonths: 12,
  availableFrom: "2026-10-05",
  scheduleType: "Comercial",
  skills: ["atendimento", "comunicação"],
};

describe("scoreJobMatch", () => {
  it("gives a high compatibility score when professional requirements align", () => {
    expect(scoreJobMatch(job, strongProfile).score).toBeGreaterThanOrEqual(90);
  });

  it("reduces compatibility when availability is months after the job start", () => {
    const late = scoreJobMatch(job, { ...strongProfile, availableFrom: "2027-04-05" });
    expect(late.score).toBeLessThan(scoreJobMatch(job, strongProfile).score);
  });
});
