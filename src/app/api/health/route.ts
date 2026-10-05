import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "angrajobs-web",
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
