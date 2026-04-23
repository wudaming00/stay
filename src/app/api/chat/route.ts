import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import type { ChatRequest } from "@/lib/types";

export const runtime = "nodejs";

const MAX_MESSAGES = 80;
const MAX_TOTAL_BYTES = 80_000;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const response = await anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          tools: TOOLS,
          messages: body.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        // Track active tool_use block (Anthropic streams input JSON in chunks)
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
