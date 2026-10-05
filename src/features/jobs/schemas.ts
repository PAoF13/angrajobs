import { z } from "zod";
import { candidateAreas } from "@/features/leads/schemas";

export const contractTypes = [
  "Qualquer",
  "CLT",
  "PJ",
  "Temporário",
  "Estágio",
  "Jovem Aprendiz",
  "Freelancer",
  "Outro",
] as const;

export const workModes = ["Qualquer", "Presencial", "Híbrido", "Remoto"] as const;
export const scheduleTypes = ["Qualquer", "Comercial", "Escala", "Noturno", "Flexível"] as const;

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

export const jobApplicationSchema = z.object({
  jobId: z.string().uuid("Vaga inválida."),
  name: z.string().trim().min(2, "Informe seu nome.").max(120),
  whatsapp: phone,
  email: optionalEmail,
  message: z.string().trim().max(1500).optional().default(""),
  privacyConsent: z.literal(true, { message: "Você precisa aceitar a Política de Privacidade." }),
  website: z.string().max(0).optional().default(""),
  turnstileToken: z.string().max(2048).optional().default(""),
  source: z.string().trim().max(60).optional().default("Acesso direto"),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(160).optional().default(""),
});

export const jobMatchSchema = z.object({
  category: z.enum(candidateAreas, { message: "Escolha sua área principal." }),
  neighborhood: z.string().trim().max(120).optional().default(""),
  contractType: z.enum(contractTypes).default("Qualquer"),
  workMode: z.enum(workModes).default("Qualquer"),
  experienceMonths: z.coerce.number().int().min(0).max(600),
  availableFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida."),
  scheduleType: z.enum(scheduleTypes).default("Qualquer"),
  skills: z.string().trim().max(500).optional().default(""),
});

export type JobMatchInput = z.infer<typeof jobMatchSchema>;
