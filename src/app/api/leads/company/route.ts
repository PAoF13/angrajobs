import { NextResponse } from "next/server";
import { companyLeadSchema } from "@/features/leads/schemas";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";

const PRIVACY_VERSION = "2026-10-04-v1";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const allowed = await consumeRateLimit(request, "company_lead", {
      maxHits: 6,
      windowSeconds: 600,
    });

    if (!allowed) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Muitas tentativas em pouco tempo. Tente novamente mais tarde.",
            requestId,
          },
        },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = companyLeadSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_COMPANY_LEAD",
            message: "Revise os campos do formulário.",
            requestId,
            fields: payload.error.flatten().fieldErrors,
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const data = payload.data;
    const antiBotValid = await verifyTurnstile(data.turnstileToken);

    if (!antiBotValid) {
      return NextResponse.json(
        {
          error: {
            code: "ANTI_BOT_FAILED",
            message: "Não foi possível validar a verificação de segurança. Tente novamente.",
            requestId,
          },
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const supabase = createSupabaseAdmin();

    const { error } = await supabase.from("company_leads").insert({
      company_name: data.companyName,
      responsible_name: data.responsibleName,
      whatsapp: data.whatsapp,
      email: data.email || null,
      segment: data.segment,
      hiring_timeline: data.hiringTimeline,
      hiring_role: data.hiringRole || null,
      contact_consent: data.contactConsent,
      privacy_version: PRIVACY_VERSION,
      source: data.source,
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
    });

    if (error) throw error;

    return NextResponse.json(
      { ok: true, requestId },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("company_lead_failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown_error",
    });

    return NextResponse.json(
      {
        error: {
          code: "COMPANY_LEAD_FAILED",
          message: "Não foi possível concluir o cadastro agora.",
          requestId,
        },
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
