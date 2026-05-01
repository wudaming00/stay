/**
 * Opt-in, anonymous, content-free telemetry.
 *
 * Privacy stance:
 *  - Disabled by default. Requires explicit user opt-in via Settings.
 *  - Sends event NAMES only — no message content, no insights, no transcripts,
 *    no IP-derived identifiers from the client side.
 *  - Each enrolled device gets a random anon id. The id can be regenerated or
 *    deleted at any time from Settings. The id is NOT linkable to a user
 *    account because there are no accounts.
 *  - The receiving endpoint (/api/telemetry) currently only logs to the
 *    server log (Vercel) — no database, no storage. Future: KV-backed
 *    counters, NEVER per-event records with content.
 *  - Failure modes are silent. Telemetry never blocks the user.
 */

const OPT_IN_KEY = "stay:telemetry-opt-in-v1";
const ANON_ID_KEY = "stay:telemetry-anon-id-v1";

export type TelemetryEvent =
  | "session_started"
  | "session_ended_naturally"
  | "crisis_resource_surfaced"
  | "safety_plan_generated"
  | "reflection_card_shown"
  | "translation_started"
  | "panic_phrase_triggered"
  | "diary_entry_logged";

export function isTelemetryOptedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(OPT_IN_KEY) === "1";
}

export function setTelemetryOptIn(optIn: boolean): void {
  if (typeof window === "undefined") return;
  if (optIn) {
    localStorage.setItem(OPT_IN_KEY, "1");
    if (!localStorage.getItem(ANON_ID_KEY)) {
      localStorage.setItem(ANON_ID_KEY, randomAnonId());
    }
  } else {
    localStorage.setItem(OPT_IN_KEY, "0");
  }
}

export function clearTelemetry(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OPT_IN_KEY);
  localStorage.removeItem(ANON_ID_KEY);
}

function randomAnonId(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getAnonId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ANON_ID_KEY);
}

/** Fire-and-forget event. Silently no-ops if telemetry isn't opted in. */
export function track(
  event: TelemetryEvent,
  meta?: { resourceId?: string; turnCount?: number }
): void {
  if (!isTelemetryOptedIn()) return;
  const anonId = getAnonId();
  if (!anonId) return;
  const payload = JSON.stringify({
    event,
    anonId,
    meta: meta ?? {},
    ts: Date.now(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/telemetry",
        new Blob([payload], { type: "application/json" })
      );
      return;
    }
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // never throw from telemetry
  }
}
