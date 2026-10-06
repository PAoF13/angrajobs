export type PlanCode = "free" | "pro" | "business";

export const plans = {
  free: {
    code: "free" as const,
    name: "Básico",
    priceLabel: "Grátis",
    priceCents: 0,
    activeJobs: 1,
    maxDurationDays: 7,
    highlightsPerMonth: 0,
    features: ["1 vaga ativa", "Publicação por 7 dias", "Painel simples", "Candidaturas básicas"],
  },
  pro: {
    code: "pro" as const,
    name: "Pro",
    priceLabel: "R$ 89/mês",
    priceCents: 8900,
    activeJobs: 3,
    maxDurationDays: 180,
    highlightsPerMonth: 2,
    features: ["Até 3 vagas ativas", "Publicação por até 6 meses", "2 destaques mensais", "Histórico e métricas básicas", "Suporte prioritário"],
  },
  business: {
    code: "business" as const,
    name: "Business",
    priceLabel: "R$ 199/mês",
    priceCents: 19900,
    activeJobs: 10,
    maxDurationDays: 180,
    highlightsPerMonth: 5,
    features: ["Até 10 vagas ativas", "Publicação por até 6 meses", "5 destaques mensais", "Estrutura para múltiplos usuários", "Relatórios e suporte prioritário"],
  },
};

export const featuredJob = {
  name: "Vaga destacada",
  priceLabel: "R$ 29 por vaga",
  priceCents: 2900,
  featuredDays: 7,
  maxDurationDays: 180,
  features: ["Prioridade visual por 7 dias", "Maior distribuição", "Publicação pode durar até 6 meses após aprovação do adicional"],
};

export function planFor(code: string | null | undefined) {
  if (code === "pro") return plans.pro;
  if (code === "business") return plans.business;
  return plans.free;
}
