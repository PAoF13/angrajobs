"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

export function JobViewTracker({ jobId, slug }: { jobId: string; slug: string }) {
  useEffect(() => {
    void track("job_view", { jobId, slug });
  }, [jobId, slug]);

  return null;
}
