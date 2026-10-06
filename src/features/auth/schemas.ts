import { z } from "zod";

const whatsapp = z
  .string()
  .trim()
  .min(10, "Informe um WhatsApp válido.")
  .max(20, "Informe um WhatsApp válido.")
  .regex(/^[+()\-\s\d]+$/, "Use apenas números e símbolos de telefone.");

export const signupSchema = z.object({
  role: z.enum(["candidate", "company"]),
  displayName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().max(180).optional().default(""),
  whatsapp,
  email: z.string().trim().email().max(180),
  password: z.string().min(8, "Use pelo menos 8 caracteres.").max(128),
  privacyConsent: z.literal(true),
}).superRefine((value, context) => {
  if (value.role === "company" && value.companyName.trim().length < 2) {
    context.addIssue({ code: "custom", path: ["companyName"], message: "Informe o nome da empresa." });
  }
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  whatsapp,
  city: z.string().trim().min(2).max(120),
  themePreference: z.enum(["light", "mono"]).optional(),
  headline: z.string().trim().max(180).optional().default(""),
  area: z.string().trim().max(120).optional().default(""),
  neighborhood: z.string().trim().max(120).optional().default(""),
  experienceMonths: z.coerce.number().int().min(0).max(600).optional().default(0),
  availabilityDate: z.string().optional().default(""),
  scheduleType: z.string().trim().max(80).optional().default(""),
  contractPreference: z.string().trim().max(80).optional().default(""),
  workModePreference: z.string().trim().max(80).optional().default(""),
  skills: z.string().trim().max(800).optional().default(""),
});
