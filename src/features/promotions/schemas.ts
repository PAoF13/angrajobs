import { z } from "zod";

export const promotionRequestSchema = z.object({
  contentType: z.enum(["video","live","collab"]),
  platform: z.enum(["instagram","tiktok","instagram_tiktok"]),
  durationSeconds: z.coerce.number().int().min(10).max(7200),
  notes: z.string().trim().max(2000).optional().default(""),
});
