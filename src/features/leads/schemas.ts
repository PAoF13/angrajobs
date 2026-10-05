import { z } from "zod";

export const candidateAreas = [
  "Atendimento",
  "Administrativo",
  "Alimentação e restaurantes",
  "Comércio e vendas",
  "Construção e manutenção",
  "Hotelaria e turismo",
  "Logística",
  "Náutica",
  "Saúde",
  "Serviços gerais",
  "Tecnologia",
  "Outros",
] as const;

export const companySegments = [
  "Restaurante ou alimentação",
  "Hotel ou pousada",
  "Comércio ou varejo",
  "Mercado",
  "Construção ou manutenção",
  "Turismo",
  "Náutica",
  "Farmácia ou saúde",
  "Serviços",
  "Indústria",
  "Outro",
] as const;

export const hiringTimelines = [
  "Agora",
  "Nos próximos 30 dias",
  "Nos próximos 3 meses",
  "Sem previsão no momento",
] as const;

const phone = z
  .string()
  .trim()
  .min(10, "Informe um WhatsApp válido.")
  .max(20, "Informe um WhatsApp válido.")
  .regex(/^[+()\-\s\d]+$/, "Use apenas números e símbolos de telefone.");

const optionalEmail = z.union([
  z.literal(""),
  z.string().trim().email("Informe um e-mail válido.").max(180),
]);

const attributionSchema = z.object({
  source: z.string().trim().max(60).optional().default("Acesso direto"),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(160).optional().default(""),
});

const antiBotSchema = z.object({
  website: z.string().max(0).optional().default(""),
  turnstileToken: z.string().max(2048).optional().default(""),
});

export const candidateLeadSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome.").max(120),
    whatsapp: phone,
    email: optionalEmail,
    interestArea: z.enum(candidateAreas, {
      message: "Escolha uma área de interesse.",
    }),
    marketingConsent: z.literal(true, {
      message: "Você precisa autorizar as comunicações para entrar na lista.",
    }),
  })
  .and(attributionSchema)
  .and(antiBotSchema);

export const companyLeadSchema = z
  .object({
    companyName: z.string().trim().min(2, "Informe o nome da empresa.").max(160),
    responsibleName: z.string().trim().min(2, "Informe o responsável.").max(120),
    whatsapp: phone,
    email: optionalEmail,
    segment: z.enum(companySegments, { message: "Escolha o segmento." }),
    hiringTimeline: z.enum(hiringTimelines, {
      message: "Informe quando pretende contratar.",
    }),
    hiringRole: z.string().trim().max(160).optional().default(""),
    contactConsent: z.literal(true, {
      message: "Você precisa autorizar o contato da AngraJobs.",
    }),
  })
  .and(attributionSchema)
  .and(antiBotSchema);

export const analyticsEventNames = [
  "page_view",
  "click_find_jobs",
  "click_company",
  "candidate_form_started",
  "candidate_form_submitted",
  "company_form_started",
  "company_form_submitted",
  "click_instagram",
  "click_whatsapp",
] as const;

export const analyticsEventSchema = z.object({
  eventName: z.enum(analyticsEventNames),
  sessionId: z.string().trim().min(8).max(100),
  source: z.string().trim().max(60).optional().default("Acesso direto"),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(160).optional().default(""),
  path: z.string().trim().max(300).optional().default("/"),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export type CandidateLeadInput = z.infer<typeof candidateLeadSchema>;
export type CompanyLeadInput = z.infer<typeof companyLeadSchema>;
export type AnalyticsEventName = (typeof analyticsEventNames)[number];
