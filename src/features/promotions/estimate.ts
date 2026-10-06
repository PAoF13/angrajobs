export type PromotionFormat = "video" | "live" | "collab";
export type PromotionPlatform = "instagram" | "tiktok" | "instagram_tiktok";

export function estimatePromotionPrice(format: PromotionFormat, platform: PromotionPlatform, durationSeconds: number) {
  let cents = format === "live" ? 3000 : format === "collab" ? 2000 : 1000;
  if (platform === "instagram_tiktok") cents += 1000;
  if (durationSeconds > 30) cents += 500;
  if (durationSeconds > 60) cents += 500;
  if (durationSeconds > 300) cents += 500;
  return Math.min(5000, Math.max(0, cents));
}

export function formatPromotionPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
