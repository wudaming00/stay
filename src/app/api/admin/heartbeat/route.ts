import { createHmac, timingSafeEqual } from "node:crypto";
import { setLastHeartbeat, getLastHeartbeat } from "@/lib/heartbeat-store";

export const runtime = "nodejs";

/**
 * Dead-man-switch heartbeat endpoint (Paper A §2.3).
 *
 * Accepts a daily POST from an external scheduler (e.g. cron-job.org)
 * carrying a signed timestamp. The endpoint verifies the HMAC against
 * STAY_HEARTBEAT_SECRET, verifies the timestamp is within ±10 minutes
 * of server clock (preventing replay), and writes to the heartbeat
 * store. The chat route consumer (src/app/api/chat/route.ts) reads
 * the same store and gates new conversations on the heartbeat being
 * within the validity window (7 days; src/lib/heartbeat-store.ts).
 *
 * SECURITY MODEL:
 *   - HMAC-SHA256 with shared secret (STAY_HEARTBEAT_SECRET).
 *   - Timestamp drift window: ±10 minutes (prevents indefinite replay).
 *   - timingSafeEqual on signature comparison (prevents timing oracle).
 *   - The secret is held by the author and the external scheduler.
 *     If both are compromised, the dead-man switch can be defeated;
 *     the paper documents this as a residual limit (§2.3).
 *
 * BODY FORMAT:
 *   { "timestamp": <unix-millis>, "signature": "<hex hmac of timestamp>" }
 *
 * RESPONSES:
 *   200 OK { ok: true, last_heartbeat_at: <ts> }
 *   400 Bad Request { error: "..." } — malformed body
 *   401 Unauthorized { error: "..." } — bad signature
 *   408 Request Timeout { error: "..." } — timestamp outside ±10min window
 *   500 Internal Server Error — secret not configured
 *
 * GET method returns the current heartbeat status (no auth — observability).
 */

const TIMESTAMP_DRIFT_MS = 10 * 60 * 1000;

interface HeartbeatBody {
  timestamp?: number;
  signature?: string;
}

function verifyHmac(timestamp: number, providedSig: string, secret: string): boolean {
  const expected = createHmac("sha256", secret)
    .update(String(timestamp))
    .digest("hex");
  // Both buffers must be same length for timingSafeEqual.
  if (expected.length !== providedSig.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(providedSig, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const secret = process.env.STAY_HEARTBEAT_SECRET;
  if (!secret) {
    return Response.json(
      { error: "Heartbeat secret not configured on server." },
      { status: 500 }
    );
  }

  let body: HeartbeatBody;
  try {
    body = (await req.json()) as HeartbeatBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const ts = body.timestamp;
  const sig = body.signature;
  if (typeof ts !== "number" || !Number.isFinite(ts) || typeof sig !== "string") {
    return Response.json(
      { error: "Body must include finite numeric `timestamp` and string `signature`." },
      { status: 400 }
    );
  }

  const now = Date.now();
  const drift = Math.abs(now - ts);
  if (drift > TIMESTAMP_DRIFT_MS) {
    return Response.json(
      {
        error: `Timestamp drift ${drift}ms exceeds allowed ±${TIMESTAMP_DRIFT_MS}ms. Check scheduler clock.`,
      },
      { status: 408 }
    );
  }

  if (!verifyHmac(ts, sig, secret)) {
    return Response.json({ error: "Signature verification failed." }, { status: 401 });
  }

  setLastHeartbeat(ts);
  return Response.json({ ok: true, last_heartbeat_at: ts });
}

export async function GET() {
  const last = getLastHeartbeat();
  const now = Date.now();
  return Response.json({
    last_heartbeat_at: last,
    now,
    age_ms: last === null ? null : now - last,
    note: "See Paper A §2.3 for the dead-man-switch design and src/lib/heartbeat-store.ts for the validity / warning windows.",
  });
}
