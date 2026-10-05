"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

export function JobsPageTracker() {
  useEffect(() => {
    void track("page_view", { pageType: "jobs_list" });
  }, []);

  return null;
}
