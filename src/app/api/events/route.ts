import { NextResponse } from "next/server";
import { analyticsEventSchema } from "@/features/leads/schemas";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { consumeRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const allowed = await consumeRateLimit(request, "analytics_event", {
      maxHits: 240,
      windowSeconds: 600,
    });

    if (!allowed) {
      return NextResponse.json(
        { ok: false },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = analyticsEventSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json(
        { ok: false },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const data = payload.data;
    const supabase = createSupabaseAdmin();

    const { error } = await supabase.from("analytics_events").insert({
      event_name: data.eventName,
      session_id: data.sessionId,
      source: data.source,
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
      path: data.path,
      metadata: data.metadata,
    });

    if (error) throw error;
    return NextResponse.json(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("analytics_event_failed", {
      error: error instanceof Error ? error.message : "unknown_error",
    });
    return NextResponse.json(
      { ok: false },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
