"use client";

import type { AnalyticsEventName } from "@/features/leads/schemas";
import { getAttribution } from "./source";

const SESSION_KEY = "angrajobs_session_id";

function getSessionId() {
  if (typeof window === "undefined") return "server";

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const value = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, value);
  return value;
}

export async function track(
  eventName: AnalyticsEventName,
  metadata: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;

  const attribution = getAttribution();

  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        sessionId: getSessionId(),
        ...attribution,
        path: window.location.pathname,
        metadata,
      }),
    });
  } catch {
    // Analytics must never block the user flow.
  }
}
