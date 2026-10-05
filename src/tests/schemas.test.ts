import { describe, expect, it } from "vitest";
import { candidateLeadSchema, companyLeadSchema } from "@/features/leads/schemas";

describe("candidateLeadSchema", () => {
  it("accepts a valid candidate lead", () => {
    const result = candidateLeadSchema.safeParse({
      name: "Vitor Silva",
      whatsapp: "(24) 99999-9999",
      email: "",
      interestArea: "Tecnologia",
      marketingConsent: true,
      website: "",
      source: "Instagram",
      utmSource: "instagram",
      utmMedium: "social",
      utmCampaign: "lancamento",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a lead without consent", () => {
    const result = candidateLeadSchema.safeParse({
      name: "Vitor Silva",
      whatsapp: "(24) 99999-9999",
      email: "",
      interestArea: "Tecnologia",
      marketingConsent: false,
      website: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("companyLeadSchema", () => {
  it("accepts a valid company lead", () => {
    const result = companyLeadSchema.safeParse({
      companyName: "Empresa Teste",
      responsibleName: "Responsável Teste",
      whatsapp: "(24) 99999-9999",
      email: "contato@empresa.com.br",
      segment: "Serviços",
      hiringTimeline: "Agora",
      hiringRole: "Atendente",
      contactConsent: true,
      website: "",
      source: "Acesso direto",
    });

    expect(result.success).toBe(true);
  });
});
