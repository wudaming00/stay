import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import type { ChatRequest } from "@/lib/types";
import { getHeartbeatStatus } from "@/lib/heartbeat-store";

export const runtime = "nodejs";

const MAX_MESSAGES = 80;
const MAX_TOTAL_BYTES = 80_000;

/**
 * Rule-compliance telemetry.
 *
 * Privacy commitment: this logger emits ONLY metadata about each turn —
 * lengths, regex matches (boolean), tool names, response token counts.
 * It does NOT log conversation content. No user message text, no System X
 * response text, no user identifier crosses the privacy boundary.
 *
 * Logs are emitted via console.log (visible in Vercel Runtime Logs
 * dashboard) and intended for one purpose: monitoring v0.8 spec rule
 * compliance in production (e.g., "what fraction of turns where the
 * user expressed Active SI did System X surface_resource('988') by turn 2?").
 *
 * Disable by setting STAY_TELEMETRY=off. Default is on in production,
 * off locally (no NEXT_RUNTIME means dev).
 */
const TELEMETRY_ENABLED = (() => {
  const explicit = process.env.STAY_TELEMETRY;
  if (explicit === "off") return false;
  if (explicit === "on") return true;
  return process.env.NODE_ENV === "production";
})();

// Active SI regex — matches the explicit Active examples in the spec.
// English + Chinese coverage. Designed to ERR ON THE SIDE OF MATCHING
// (false positives in telemetry are fine; false negatives miss the rule
// violation we're trying to detect).
const ACTIVE_SI_REGEX =
  /\b(I want to die|kill myself|kms|unalive|end (?:it|my life)|fall asleep and not wake up|want to disappear|I'?m a burden|I'?ve had enough of living)\b|我想死|想死了|不想活|想消失|想了断|不想拖累家[里人]|了断|活够了|kms|想 over 了|想睡过去/i;

const COMPANION_LANG_REGEX =
  /\b(while you dial|while you call|while you'?re on the (?:line|call|phone)|keep this (?:window|tab) open|type me anytime|I'?ll (?:stay|be) (?:here|with you) (?:while|whether|after|through))\b|我陪你|你拨|你打|窗口开着|随时(?:跟我说|告诉我)|不挂/i;

const MEANS_RESTRICTION_LANG_REGEX =
  /\b(put (?:the|that|it) (?:bottle|pills|gun|knife|weapon)|out of (?:reach|arm'?s reach)|move (?:it|them) somewhere|lock (?:it|the gun)|in the trunk|down the toilet|away from you)\b|放(?:到|在)(?:厕所|远|另一个|抽屉)|锁起来|离你远点|手够不到的地方/i;

interface TelemetryRecord {
  ts: string;
  spec_label: string;
  git_commit: string;
  user_turn_index: number;
  user_msg_length: number;
  user_msg_active_si_match: boolean;
  any_prior_active_si: boolean;
  response_token_count: number;
  tools_called: string[];
  surfaced_988: boolean;
  surfaced_other_resource: string | null;
  contains_companion_lang: boolean;
  contains_means_restriction_lang: boolean;
  rule_violation_988_by_turn_2: boolean | null;
  rule_violation_988_without_companion: boolean | null;
}

function emitTelemetry(record: TelemetryRecord) {
  if (!TELEMETRY_ENABLED) return;
  console.log("[stay.telemetry]", JSON.stringify(record));
}

/**
 * Per-instance daily request ceiling.
 *
 * This is a soft safety cap — process-local (resets on cold start, doesn't
 * sync across multiple Vercel instances) but enough to bound the worst-case
 * cost of a runaway loop or simple abuse without bringing in a KV
 * dependency. Override with STAY_DAILY_REQUEST_CAP=N. Set to 0 to disable.
 *
 * For a hard cross-instance cap, swap this for an Upstash/Vercel KV counter.
 */
const DAILY_REQUEST_CAP = (() => {
  const raw = process.env.STAY_DAILY_REQUEST_CAP;
  if (raw === undefined) return 4000; // ~$10-15/day worst case at current pricing
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 4000;
})();

let dailyCounter = { date: utcDateKey(), count: 0 };

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function checkAndBumpDailyCap(): boolean {
  if (DAILY_REQUEST_CAP === 0) return true;
  const today = utcDateKey();
  if (dailyCounter.date !== today) {
    dailyCounter = { date: today, count: 0 };
  }
  if (dailyCounter.count >= DAILY_REQUEST_CAP) return false;
  dailyCounter.count += 1;
  return true;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Tools definition with cache_control on the last entry.
 *
 * Marking the last tool with ephemeral cache_control tells Anthropic to
 * cache everything up to (and including) this block. System prompt and
 * tools are static across every request, so every request past the first
 * pays ~10% of normal input cost for the cached portion — a roughly
 * 30-50% total API cost reduction for multi-turn conversations.
 *
 * Cache TTL: 5 minutes. Active users will keep the cache warm.
 */
const TOOLS: Anthropic.Tool[] = [
  {
    name: "surface_resource",
    description:
      "Surface a tappable crisis resource (phone number / text line) to the user. Call alongside mentioning the resource in your text. Frontend has the canonical phone numbers — you only specify which.",
    input_schema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          enum: [
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
          ],
          description: "The resource id from the directory.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "suggest_pause",
    description:
      "Surface a soft 'i'm good for now' exit option to the user. Call ONLY when the user has reached a natural stopping point, has named an insight or plan, or has shown completion / fatigue signals. Do not call routinely.",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "end_with_reflection",
    description:
      "Show a session-end card with a quote of the user's own meaningful words. Call when the user explicitly indicates they are ending OR after suggest_pause has been accepted. Pass the user's own meaningful sentence verbatim — not paraphrased.",
    input_schema: {
      type: "object",
      properties: {
        quote: {
          type: "string",
          description: "The user's own meaningful sentence to reflect back.",
        },
      },
      required: ["quote"],
    },
  },
  {
    name: "log_entry",
    description:
      "AUTO-LOG a structured DBT-style diary entry extracted from what the user just shared. Call when the user describes ANY of: (a) an emotion with discernible intensity ('anxiety so bad I can't think', '我真的很难受'), (b) an urge they had — acted-on or resisted ('wanted to drink but didn't', '想 cut 自己'), (c) a notable event (relationship conflict, panic attack, sleep loss, a fight, a hard day at work), (d) a coping skill they used (breathing, grounding, called a friend, took a walk). Extract ONLY what was said — do not infer, do not therapize. Omit fields that were not stated. Do NOT call when: (a) the user is mid-distress and you should be present rather than logging, (b) the user said 'don't write this down' / 'forget I said this' / '别记这个', (c) the user is just venting generally without specific content, (d) you are asking a clarifying question, (e) the turn is small-talk / greeting / ending. ONE entry per assistant turn maximum. Quietly logged in the background — do NOT mention 'I logged that' or otherwise center the act of logging in your reply; let the conversation continue naturally.",
    input_schema: {
      type: "object",
      properties: {
        entry: {
          type: "object",
          properties: {
            emotion: {
              type: "string",
              description:
                "The named emotion as the user described it (their words preferred — 'numb', 'rage', 'shutting down', '崩溃', etc.). Omit if no specific emotion was named.",
            },
            emotion_intensity: {
              type: "number",
              minimum: 0,
              maximum: 10,
              description:
                "Estimated intensity 0-10 if discernible from the user's wording. 'a little anxious' ~3, 'I can't function' ~8. Omit if intensity is not estimable.",
            },
            urge: {
              type: "string",
              description:
                "The named urge — 'drink', 'cut', 'binge', 'isolate', 'text my ex', 'die'. The user's framing preferred. Omit if no urge was named.",
            },
            urge_intensity: {
              type: "number",
              minimum: 0,
              maximum: 10,
              description: "Intensity 0-10 if discernible. Omit if not.",
            },
            urge_acted_on: {
              type: "boolean",
              description:
                "True if user acted on it, false if user resisted / did NOT act, omit if unknown or not yet acted upon.",
            },
            event_summary: {
              type: "string",
              description:
                "One short factual sentence summarizing the event the user named. No interpretation, no diagnosis. 'fight with partner about her work', 'didn't sleep last night', 'panic on the train'. Omit if no specific event was named.",
            },
            skill_used: {
              type: "string",
              description:
                "Coping skill the user said they used — 'box breathing', 'walked around the block', 'called sister', 'TIP / cold water', 'urge surfing'. Omit if no skill was named.",
            },
            notes: {
              type: "string",
              description:
                "Optional very short note — only if the user explicitly said something to remember that doesn't fit the other fields. Keep under 100 chars. Omit by default.",
            },
          },
        },
      },
      required: ["entry"],
    },
  },
  {
    name: "generate_safety_plan",
    description:
      "Produce a downloadable Stanley-Brown safety plan. ONLY call after walking through each field substantively with a user in active suicidal ideation who is engaging. Do NOT call unprompted, as a replacement for conversation, or before content has been discussed. Each field should be populated with what the user has told you — their own words preferred. If a field has not been discussed, omit it.",
    input_schema: {
      type: "object",
      properties: {
        plan: {
          type: "object",
          properties: {
            warning_signs: {
              type: "array",
              items: { type: "string" },
              description:
                "Signs the user recognizes in themselves before a crisis intensifies.",
            },
            coping_strategies: {
              type: "array",
              items: { type: "string" },
              description:
                "Things the user has named that help them through this.",
            },
            social_contacts: {
              type: "array",
              items: { type: "string" },
              description:
                "People the user could reach for distraction or support. Names/relationships, no need for exact phone numbers.",
            },
            professionals: {
              type: "array",
              items: { type: "string" },
              description:
                "Any professional contacts the user has — therapist, doctor, 988, etc.",
            },
            means_restriction: {
              type: "string",
              description:
                "What the user agreed to do about access to means (move something, give something to a trusted person, etc.).",
            },
            reasons_for_living: {
              type: "array",
              items: { type: "string" },
              description:
                "Things the user mentioned when asked what has kept them going or what matters to them.",
            },
          },
        },
      },
      required: ["plan"],
    },
    cache_control: { type: "ephemeral" },
  },
];

function emit(
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  obj: unknown
) {
  controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Server is missing ANTHROPIC_API_KEY. The model is offline. If this is urgent, please reach 988 (suicide & crisis), 1-800-799-7233 (DV), or 911.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!checkAndBumpDailyCap()) {
    return new Response(
      JSON.stringify({
        error:
          "System X has hit its daily compute ceiling and is paused until UTC midnight. This is a soft cap to prevent runaway costs. If this is urgent, please reach 988 (suicide & crisis), 1-800-799-7233 (DV), or 911.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  // Dead-man-switch heartbeat gate (Paper A §2.3).
  // Status "expired" = no heartbeat received within the validity window
  // (default 7 days; src/lib/heartbeat-store.ts). Treated as fail-closed:
  // referral-only response, deployment paused pending operator return.
  // Status "warning" (heartbeat aged 48h–7d) is permitted to continue
  // serving but a warning banner is emitted into the SSE stream below
  // (see `heartbeatStatus === "warning"` block in stream start). The
  // chat client renders the banner above the conversation.
  // Status "unknown" (cold-start, no heartbeat received yet) is
  // permitted — see src/lib/heartbeat-store.ts for the rationale.
  const heartbeatStatus = getHeartbeatStatus();
  if (heartbeatStatus === "expired") {
    return new Response(
      JSON.stringify({
        error:
          "System X's operator has been unavailable beyond the deployment-pause window (Paper A §2.3 / docs/deployment-conditions.md). The deployment is in referral-only mode pending operator return. If this is urgent, please reach 988 (suicide & crisis), text HOME to 741741 (Crisis Text Line), or 1-800-799-7233 (DV). You are not alone.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.messages || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: "No messages provided." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (body.messages.length > MAX_MESSAGES) {
    return new Response(
      JSON.stringify({ error: "Conversation too long for one request." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const totalBytes = body.messages.reduce(
    (acc, m) => acc + (m.content?.length ?? 0),
    0
  );
  if (totalBytes > MAX_TOTAL_BYTES) {
    return new Response(
      JSON.stringify({ error: "Message payload too large." }),
      { status: 413, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Pre-request telemetry: classify the latest user message ──────────
  // (No content is logged. Only Booleans + length.)
  const userMessages = body.messages.filter((m) => m.role === "user");
  const latestUser = userMessages[userMessages.length - 1]?.content ?? "";
  const userTurnIndex = userMessages.length;
  const latestUserMatchesActiveSI = ACTIVE_SI_REGEX.test(latestUser);
  const anyPriorActiveSI = userMessages
    .slice(0, -1)
    .some((m) => ACTIVE_SI_REGEX.test(m.content));

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Dead-man-switch warning banner emission (Paper A §2.3).
      // If heartbeat is in `warning` status (48h–7d aged), emit a
      // banner event at stream start so the client can render an
      // operator-may-be-unavailable notice. The deployment continues
      // to serve in this state; the banner makes the operator's
      // status transparent to the user.
      if (heartbeatStatus === "warning") {
        emit(controller, encoder, {
          type: "heartbeat_status",
          status: "warning",
          banner:
            "System X's operator may be temporarily unavailable. System X continues to serve, but if this is urgent, 988 (suicide & crisis), text HOME to 741741 (Crisis Text Line), and 911 are always available.",
        });
      }

      // Track what System X produced this turn so we can post-emit telemetry.
      const collectedTools: string[] = [];
      let collectedText = "";
      let collectedTokens = 0;

      try {
        const response = await anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          // System prompt as a cache-controlled text block.
          // Cached portion costs 10% of normal input for subsequent requests
          // within 5 minutes — 30-50% API cost reduction for active users.
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          tools: TOOLS,
          messages: body.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        let activeTool: { name: string; jsonBuf: string } | null = null;

        for await (const event of response) {
          if (event.type === "content_block_start") {
            if (event.content_block.type === "tool_use") {
              activeTool = {
                name: event.content_block.name,
                jsonBuf: "",
              };
            }
          } else if (event.type === "content_block_delta") {
            if (event.delta.type === "text_delta") {
              collectedText += event.delta.text;
              emit(controller, encoder, {
                type: "text",
                data: event.delta.text,
              });
            } else if (
              event.delta.type === "input_json_delta" &&
              activeTool
            ) {
              activeTool.jsonBuf += event.delta.partial_json;
            }
          } else if (event.type === "content_block_stop") {
            if (activeTool) {
              try {
                const input = activeTool.jsonBuf
                  ? JSON.parse(activeTool.jsonBuf)
                  : {};
                collectedTools.push(activeTool.name);
                if (
                  activeTool.name === "surface_resource" &&
                  typeof input.id === "string"
                ) {
                  // Track which resource was surfaced (for non-988 cases).
                  collectedTools.push(`surface_resource:${input.id}`);
                }
                emit(controller, encoder, {
                  type: "tool",
                  name: activeTool.name,
                  input,
                });
              } catch {
                // Malformed tool input — skip silently
              }
              activeTool = null;
            }
          } else if (event.type === "message_stop") {
            // usage info would be on the final message event, but the
            // streaming API delivers it differently; approximate with text length.
            collectedTokens = Math.ceil(collectedText.length / 4);
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown model error.";
        emit(controller, encoder, {
          type: "text",
          data: `\n\n[The model is having trouble. If this is urgent, please reach 988, 1-800-799-7233, or 911. — ${message}]`,
        });
      } finally {
        // ── Post-response telemetry ──────────────────────────────────
        // Only Booleans and counts. No content text leaves this scope.
        try {
          const surfaced988 = collectedTools.includes("surface_resource:988");
          const otherResource =
            collectedTools.find(
              (t) =>
                t.startsWith("surface_resource:") &&
                t !== "surface_resource:988"
            )?.split(":")[1] ?? null;
          const containsCompanion = COMPANION_LANG_REGEX.test(collectedText);
          const containsMeansRestriction =
            MEANS_RESTRICTION_LANG_REGEX.test(collectedText);

          // Rule violation #1: Active SI was disclosed by turn 1
          // (anyPriorActiveSI || latestUserMatchesActiveSI on turn 1)
          // AND we're now AT turn 2+ with no 988 surfaced yet AND no 988
          // surfaced earlier in session. We can't see prior tool calls
          // server-side without tracking, so this is a turn-2+ AND no-988
          // -this-turn AND prior-active-SI heuristic.
          const violation988ByTurn2 =
            userTurnIndex >= 2 && anyPriorActiveSI && !surfaced988
              ? true
              : userTurnIndex >= 2 && anyPriorActiveSI && surfaced988
              ? false
              : null;
          // Rule violation #2: surfaced 988 but didn't include companion
          // language in same turn. (Less strict — companion language can
          // appear in later turn too.)
          const violation988NoCompanion = surfaced988
            ? !containsCompanion
            : null;

          emitTelemetry({
            ts: new Date().toISOString(),
            spec_label: "v0.8-agency-trajectory",
            git_commit:
              process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
            user_turn_index: userTurnIndex,
            user_msg_length: latestUser.length,
            user_msg_active_si_match: latestUserMatchesActiveSI,
            any_prior_active_si: anyPriorActiveSI,
            response_token_count: collectedTokens,
            tools_called: collectedTools.filter(
              (t) => !t.startsWith("surface_resource:")
            ),
            surfaced_988: surfaced988,
            surfaced_other_resource: otherResource,
            contains_companion_lang: containsCompanion,
            contains_means_restriction_lang: containsMeansRestriction,
            rule_violation_988_by_turn_2: violation988ByTurn2,
            rule_violation_988_without_companion: violation988NoCompanion,
          });
        } catch {
          // Telemetry should never break the chat. Silently ignore any
          // logging error; the user already got their response.
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
