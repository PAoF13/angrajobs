import { z } from "zod";
import { candidateAreas } from "@/features/leads/schemas";

const optionalMoney = z.union([z.literal(""), z.coerce.number().int().min(0).max(100000000)]);

export const companyJobSchema = z.object({
  title: z.string().trim().min(2).max(180),
  category: z.union([z.enum(candidateAreas), z.literal("")]).optional().default(""),
  neighborhood: z.string().trim().max(120).optional().default(""),
  region: z.string().trim().min(2).max(120).default("Angra dos Reis"),
  contractType: z.string().trim().max(80).optional().default(""),
  workMode: z.string().trim().max(80).optional().default(""),
  salaryMin: optionalMoney.optional().default(""),
  salaryMax: optionalMoney.optional().default(""),
  salaryText: z.string().trim().max(120).optional().default(""),
  description: z.string().trim().min(10).max(12000),
  requirements: z.string().trim().max(5000).optional().default(""),
  benefits: z.string().trim().max(3000).optional().default(""),
  workSchedule: z.string().trim().max(300).optional().default(""),
  scheduleType: z.string().trim().max(80).optional().default(""),
  experienceMinMonths: z.coerce.number().int().min(0).max(600).optional().default(0),
  startDate: z.string().optional().default(""),
  skills: z.string().trim().max(800).optional().default(""),
  status: z.enum(["draft", "published", "paused"]).default("draft"),
  durationDays: z.coerce.number().int().min(1).max(180).default(7),
});

export const applicationStatusSchema = z.object({
  status: z.enum(["received", "reviewing", "interview", "rejected", "hired"]),
});

export const planRequestSchema = z.discriminatedUnion("requestType", [
  z.object({ requestType: z.literal("subscription"), planCode: z.enum(["pro", "business"]) }),
  z.object({ requestType: z.literal("featured_job"), jobId: z.string().uuid(), durationDays: z.coerce.number().int().min(7).max(180) }),
]);
