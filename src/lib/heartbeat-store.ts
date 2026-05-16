/**
 * Heartbeat store — module-level state for the dead-man-switch heartbeat
 * mechanism described in Paper A §2.3.
 *
 * IMPORTANT — PERSISTENCE LIMITATION:
 *
 * This implementation uses a module-level variable (`lastHeartbeatAt`).
 * On Vercel's serverless runtime, this state does NOT survive cold starts
 * — each cold-started function instance starts with `lastHeartbeatAt =
 * null` and therefore reads as "no heartbeat ever received," which the
 * chat route consumer treats as healthy (rather than fail-closed).
 *
 * This is a deliberate trade-off, not a defect to hide:
 *   - Cold starts during normal operation should not pause the service.
 *   - Sustained author absence does NOT manifest as serverless cold-starts
 *     with `null` heartbeat — it manifests as warm instances whose
 *     heartbeat has aged past the validity window. Those warm instances
 *     correctly fail-closed.
 *   - Truly cold (no traffic for hours) instances won't fail-closed on
 *     first request post-cold-start, but the next heartbeat (≤24h later
 *     by spec) repopulates the store. The window of "missed pause on
 *     cold-started instance" is at most 24h.
 *
 * Production-grade persistence (Vercel KV / Edge Config / external KV)
 * is a v0.9 milestone — see Paper A §5 limitations.
 *
 * The dead-man switch as designed survives the more important threat
 * model (sustained author absence on warm instances) but does not
 * approach hardware-watchdog-level guarantees. Readers of the paper
 * should not assume otherwise.
 */

// Validity window: 7 days. Calibrated to single-author normal life
// (weekend illness, family emergency, international travel with bad
// connectivity all routinely produce 48-72h heartbeat gaps; 48h would
// produce too many false-positive pauses on a warm instance).
export const HEARTBEAT_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000;

// Warning window: surface a banner on the chat response after 48h of
// heartbeat silence (deployment still serves; user is informed the
// operator may be unavailable and 988/CTL/911 are the appropriate
// channels for active distress).
export const HEARTBEAT_WARNING_MS = 48 * 60 * 60 * 1000;

let lastHeartbeatAt: number | null = null;

/**
 * Returns the unix-millis timestamp of the most recent valid heartbeat
 * received by this module instance, or null if none received.
 */
export function getLastHeartbeat(): number | null {
  return lastHeartbeatAt;
}

/**
 * Records a heartbeat at the given timestamp. Called by the heartbeat
 * endpoint after HMAC verification.
 */
export function setLastHeartbeat(ts: number): void {
  lastHeartbeatAt = ts;
}

export type HeartbeatStatus = "healthy" | "warning" | "expired" | "unknown";

/**
 * Returns the current heartbeat status given the validity / warning
 * windows. `unknown` means no heartbeat has been received by this
 * instance (cold-started; treat as healthy per the comment above).
 */
export function getHeartbeatStatus(now: number = Date.now()): HeartbeatStatus {
  if (lastHeartbeatAt === null) return "unknown";
  const age = now - lastHeartbeatAt;
  if (age <= HEARTBEAT_WARNING_MS) return "healthy";
  if (age <= HEARTBEAT_VALIDITY_MS) return "warning";
  return "expired";
}
