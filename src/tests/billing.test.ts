import { describe, expect, it } from "vitest";
import { plans, featuredJob } from "@/features/billing/plans";
import { estimatePromotionPrice } from "@/features/promotions/estimate";

describe("commercial rules", () => {
  it("keeps free jobs at seven days", () => {
    expect(plans.free.maxDurationDays).toBe(7);
    expect(plans.free.activeJobs).toBe(1);
  });

  it("allows paid plans up to six months", () => {
    expect(plans.pro.maxDurationDays).toBe(180);
    expect(plans.business.maxDurationDays).toBe(180);
    expect(featuredJob.maxDurationDays).toBe(180);
  });

  it("caps promotion estimates at R$50", () => {
    expect(estimatePromotionPrice("live", "instagram_tiktok", 7200)).toBeLessThanOrEqual(5000);
    expect(estimatePromotionPrice("video", "instagram", 15)).toBeGreaterThanOrEqual(0);
  });
});
