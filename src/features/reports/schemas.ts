import { z } from "zod";

export const reportJobSchema = z.object({
  jobId: z.string().uuid(),
  reason: z.enum(["fraud","fee","misleading","discrimination","expired","duplicate","other"]),
  details: z.string().trim().max(2000).optional().default(""),
  contactEmail: z.union([z.literal(""), z.string().trim().email().max(180)]).optional().default(""),
  turnstileToken: z.string().max(2048).optional().default(""),
});
