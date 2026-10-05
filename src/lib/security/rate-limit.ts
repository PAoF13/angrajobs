import { createHmac } from "node:crypto";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function consumeRateLimit(
  request: Request,
  action: string,
  options: { maxHits: number; windowSeconds: number },
): Promise<boolean> {
  const salt = process.env.RATE_LIMIT_HASH_SALT;

  // Local/staging can run before the rate-limit secret is configured.
  // Production should always configure it.
  if (!salt) return true;

  const ip = getClientIp(request);
  const keyHash = createHmac("sha256", salt).update(ip).digest("hex");
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_key_hash: keyHash,
    p_action: action,
    p_window_seconds: options.windowSeconds,
    p_max_hits: options.maxHits,
  });

  if (error) throw error;
  return data === true;
}
