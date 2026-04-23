import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import type { ChatRequest } from "@/lib/types";

export const runtime = "nodejs";

const MAX_MESSAGES = 80;
const MAX_TOTAL_BYTES = 80_000;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const totalBytes = body.messages.reduce(
    (acc, m) => acc + (m.content?.length ?? 0),
    0
  );
  if (totalBytes > MAX_TOTAL_BYTES) {
    return new Response(
      JSON.stringify({ error: "Message payload too large." }),
      {
        status: 413,
        headers: { "Content-Type": "application/json" },
      }
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
          messages: body.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown model error.";
        controller.enqueue(
          encoder.encode(
            `\n\n[The model is having trouble. If this is urgent, please reach 988, 1-800-799-7233, or 911. — ${message}]`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
