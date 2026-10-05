import { NextResponse } from "next/server";
import { jobMatchSchema } from "@/features/jobs/schemas";
import { listPublishedJobs } from "@/features/jobs/queries";
import { scoreJobMatch } from "@/features/jobs/matching";
import { consumeRateLimit } from "@/lib/security/rate-limit";

function splitSkills(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const allowed = await consumeRateLimit(request, "job_match", {
      maxHits: 30,
      windowSeconds: 600,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Muitas comparações em pouco tempo. Tente novamente mais tarde.", requestId } },
        { status: 429, headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = jobMatchSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json(
        { error: { code: "INVALID_MATCH_PROFILE", message: "Revise os dados usados para comparar as vagas.", requestId, fields: payload.error.flatten().fieldErrors } },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const jobs = await listPublishedJobs();
    const profile = {
      category: payload.data.category,
      neighborhood: payload.data.neighborhood,
      contractType: payload.data.contractType,
      workMode: payload.data.workMode,
      experienceMonths: payload.data.experienceMonths,
      availableFrom: payload.data.availableFrom,
      scheduleType: payload.data.scheduleType,
      skills: splitSkills(payload.data.skills),
    };

    const results = jobs
      .map((job) => scoreJobMatch(job, profile))
      .sort((a, b) => b.score - a.score || Date.parse(b.job.published_at || b.job.created_at) - Date.parse(a.job.published_at || a.job.created_at));

    return NextResponse.json(
      { ok: true, requestId, results },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("job_match_failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown_error",
    });

    return NextResponse.json(
      { error: { code: "JOB_MATCH_FAILED", message: "Não foi possível comparar as vagas agora.", requestId } },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
