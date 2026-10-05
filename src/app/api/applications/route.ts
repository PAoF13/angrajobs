import { NextResponse } from "next/server";
import { jobApplicationSchema } from "@/features/jobs/schemas";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstile } from "@/lib/security/turnstile";

const PRIVACY_VERSION = "2026-10-05-v2";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const allowed = await consumeRateLimit(request, "job_application", {
      maxHits: 8,
      windowSeconds: 600,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Muitas tentativas em pouco tempo. Tente novamente mais tarde.", requestId } },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = jobApplicationSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json(
        { error: { code: "INVALID_APPLICATION", message: "Revise os campos da candidatura.", requestId, fields: payload.error.flatten().fieldErrors } },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const data = payload.data;
    const antiBotValid = await verifyTurnstile(data.turnstileToken);
    if (!antiBotValid) {
      return NextResponse.json(
        { error: { code: "ANTI_BOT_FAILED", message: "Não foi possível validar a verificação de segurança. Tente novamente.", requestId } },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const supabase = createSupabaseAdmin();
    const now = new Date().toISOString();
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id,status,expires_at")
      .eq("id", data.jobId)
      .maybeSingle();

    if (jobError) throw jobError;
    if (!job || job.status !== "published" || (job.expires_at && job.expires_at <= now)) {
      return NextResponse.json(
        { error: { code: "JOB_NOT_AVAILABLE", message: "Esta vaga não está disponível para candidatura.", requestId } },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const normalizedWhatsapp = data.whatsapp.replace(/\D/g, "");

    const { error } = await supabase.from("job_applications").insert({
      job_id: data.jobId,
      name: data.name,
      whatsapp: normalizedWhatsapp,
      email: data.email || null,
      message: data.message || null,
      privacy_consent: data.privacyConsent,
      privacy_version: PRIVACY_VERSION,
      source: data.source,
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: { code: "DUPLICATE_APPLICATION", message: "Já existe uma candidatura com este WhatsApp para esta vaga.", requestId } },
          { status: 409, headers: { "Cache-Control": "no-store" } },
        );
      }
      throw error;
    }

    return NextResponse.json(
      { ok: true, requestId },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("job_application_failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown_error",
    });

    return NextResponse.json(
      { error: { code: "JOB_APPLICATION_FAILED", message: "Não foi possível enviar sua candidatura agora.", requestId } },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
