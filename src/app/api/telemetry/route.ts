/**
 * Telemetry receiver — minimal, content-free, opt-in only.
 *
 * Current behavior: validate, log to server console, return 204. This goes
 * to Vercel logs which are queryable. No database. No persistence beyond
 * server logs. No client identifier beyond the device-local random anonId.
 *
 * Hard guarantees enforced here:
 *  - Strict event-name allowlist
 *  - No content fields accepted in `meta`
 *  - Request body size cap
 *  - No IP-derived identifier extracted or returned
 */

export const runtime = "edge";

const MAX_BYTES = 1024;

const ALLOWED_EVENTS = new Set([
  "session_started",
  "session_ended_naturally",
  "crisis_resource_surfaced",
  "safety_plan_generated",
  "reflection_card_shown",
  "translation_started",
  "panic_phrase_triggered",
]);

const ALLOWED_RESOURCE_IDS = new Set([
  "988",
  "crisis_text_line",
  "dv_hotline",
  "childhelp",
  "trevor",
  "rainn",
  "samhsa",
  "neda",
  "alzheimers",
  "911",
  "cn_beijing_crisis",
  "cn_hope24",
  "cn_dv_acwf",
  "cn_emergency",
]);

interface IncomingPayload {
  event?: unknown;
  anonId?: unknown;
  ts?: unknown;
  meta?: { resourceId?: unknown; turnCount?: unknown };
}

export async function POST(req: Request) {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return new Response(null, { status: 204 });
  }
  if (raw.length > MAX_BYTES) return new Response(null, { status: 204 });

  let body: IncomingPayload;
  try {
    body = JSON.parse(raw) as IncomingPayload;
  } catch {
    return new Response(null, { status: 204 });
  }

  const event = typeof body.event === "string" ? body.event : null;
  const anonId =
    typeof body.anonId === "string" && /^[0-9a-f]{32}$/.test(body.anonId)
      ? body.anonId
      : null;
  if (!event || !anonId || !ALLOWED_EVENTS.has(event)) {
    return new Response(null, { status: 204 });
  }

  const meta: Record<string, string | number> = {};
  if (typeof body.meta?.resourceId === "string") {
    if (ALLOWED_RESOURCE_IDS.has(body.meta.resourceId)) {
      meta.resourceId = body.meta.resourceId;
    }
  }
  if (
    typeof body.meta?.turnCount === "number" &&
    Number.isFinite(body.meta.turnCount) &&
    body.meta.turnCount >= 0 &&
    body.meta.turnCount < 1000
  ) {
    meta.turnCount = Math.floor(body.meta.turnCount);
  }

  // Log line is intentionally one-line JSON for log-aggregator friendliness.
  // No IP, no UA, no path. Just event + anon + minimal meta.
  console.log(
    JSON.stringify({
      kind: "stay.telemetry",
      event,
      anonId,
      meta,
      serverTs: Date.now(),
    })
  );

  return new Response(null, { status: 204 });
}
