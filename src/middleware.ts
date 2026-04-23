import { NextResponse, type NextRequest } from "next/server";

/**
 * Soft per-IP rate limit on /api/chat.
 *
 * In-memory token bucket — works per Edge instance, resets on cold start.
 * This is NOT robust against distributed abuse but stops single-IP runaway.
 * For real protection, swap with @upstash/ratelimit + Upstash Redis.
 */

const WINDOW_MS = 60 * 1000;
const MAX_REQ = 30; // requests per minute per IP

interface Bucket {
  tokens: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function checkRate(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const existing = buckets.get(ip);
  if (!existing || existing.resetAt < now) {
    buckets.set(ip, { tokens: MAX_REQ - 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (existing.tokens <= 0) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }
  existing.tokens -= 1;
  return { ok: true, retryAfter: 0 };
}

export const config = {
  matcher: ["/api/chat"],
};

export function middleware(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.next();

  const ip = getIp(req);
  const { ok, retryAfter } = checkRate(ip);

  if (!ok) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Slow down a moment.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  return NextResponse.next();
}
