/**
 * Provider abstraction for the scenario runner.
 *
 * Two backends:
 *   - "anthropic"   — direct via @anthropic-ai/sdk (used for Stay-prompt
 *                     and Stay-judge runs; supports tool calling)
 *   - "openrouter"  — via OpenRouter's OpenAI-compatible API; one API key
 *                     covers GPT-5.x, Gemini, Grok, DeepSeek, and more
 *
 * Why OpenRouter and not native SDKs:
 *   - One API key, one wire format (OpenAI-compatible) for ~100 models
 *   - The paper needs comparable evaluation across providers; native SDK
 *     differences (tool-call shape, message format) introduce variance
 *     unrelated to the model's actual behavior
 *   - Pricing is ~at-cost passthrough; cost overhead is small relative to
 *     the engineering simplification
 *
 * Tool calling: OpenRouter supports OpenAI-style function calling for
 * providers that have it (GPT-4o/5, Claude via OR, Gemini). Grok and
 * DeepSeek have inconsistent or absent tool support — for those we run
 * prompt-only, which is fine because our path-Y assertions are now all
 * text-pattern based.
 *
 * Model naming convention:
 *   - "anthropic:claude-sonnet-4-6"        → direct Anthropic SDK
 *   - "openrouter:openai/gpt-5"            → OpenRouter route
 *   - "openrouter:google/gemini-2.5-pro"   → OpenRouter route
 *   - "openrouter:x-ai/grok-3"             → OpenRouter route
 *   - "openrouter:deepseek/deepseek-r2"    → OpenRouter route
 *   - bare "claude-sonnet-4-5-20250929"    → defaults to anthropic
 */

import Anthropic from "@anthropic-ai/sdk";

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMToolCall {
  name: string;
  input: Record<string, unknown>;
}

export interface LLMResponse {
  text: string;
  toolCalls: LLMToolCall[];
}

export interface ChatOptions {
  systemPrompt?: string;
  /** Tools (Anthropic-format). Forwarded to Anthropic; converted to
   *  OpenAI-format for OpenRouter. Other providers may ignore unsupported
   *  tool calling — text remains primary signal. */
  tools?: Anthropic.Tool[];
  maxTokens?: number;
  /** Temperature override. Default 1 for free-form, 0 for judge. */
  temperature?: number;
}

export interface LLMClient {
  /** Provider id, e.g., "anthropic" or "openrouter:openai/gpt-5". */
  readonly id: string;
  chat(messages: LLMMessage[], opts?: ChatOptions): Promise<LLMResponse>;
}

const ANTHROPIC_DEFAULT_MODEL =
  process.env.STAY_ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";

function parseProvider(model: string): { provider: "anthropic" | "openrouter"; model: string } {
  if (model.startsWith("anthropic:")) {
    return { provider: "anthropic", model: model.slice("anthropic:".length) };
  }
  if (model.startsWith("openrouter:")) {
    return { provider: "openrouter", model: model.slice("openrouter:".length) };
  }
  // Bare model id assumed to be Anthropic for back-compat
  return { provider: "anthropic", model };
}

export function makeClient(modelSpec: string): LLMClient {
  const { provider, model } = parseProvider(modelSpec);
  if (provider === "anthropic") return new AnthropicClient(model);
  return new OpenRouterClient(model);
}

// ─────────────────────────── Anthropic ──────────────────────────────────

class AnthropicClient implements LLMClient {
  readonly id: string;
  private client: Anthropic;
  private model: string;

  constructor(model: string) {
    this.model = model || ANTHROPIC_DEFAULT_MODEL;
    this.id = `anthropic:${this.model}`;
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is required for Anthropic provider");
    }
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async chat(messages: LLMMessage[], opts: ChatOptions = {}): Promise<LLMResponse> {
    const apiMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
    const systemFromMessages = messages.find((m) => m.role === "system")?.content;
    const system = opts.systemPrompt ?? systemFromMessages;

    const res = await this.client.messages.create({
      model: this.model,
      max_tokens: opts.maxTokens ?? 1024,
      ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
      ...(system ? { system: [{ type: "text" as const, text: system }] } : {}),
      ...(opts.tools ? { tools: opts.tools } : {}),
      messages: apiMessages,
    });

    let text = "";
    const toolCalls: LLMToolCall[] = [];
    for (const block of res.content) {
      if (block.type === "text") text += block.text;
      else if (block.type === "tool_use")
        toolCalls.push({
          name: block.name,
          input: (block.input ?? {}) as Record<string, unknown>,
        });
    }
    return { text, toolCalls };
  }
}

// ─────────────────────────── OpenRouter ─────────────────────────────────

interface OpenRouterMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string | null;
  tool_calls?: OpenRouterToolCall[];
  tool_call_id?: string;
}

interface OpenRouterToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface OpenRouterCompletion {
  id: string;
  choices: Array<{
    message: {
      content: string | null;
      tool_calls?: OpenRouterToolCall[];
    };
    finish_reason: string;
  }>;
  error?: { message: string; code?: number };
}

class OpenRouterClient implements LLMClient {
  readonly id: string;
  private model: string;
  private apiKey: string;
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor(model: string) {
    this.model = model;
    this.id = `openrouter:${model}`;
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error(
        "OPENROUTER_API_KEY is required for non-Anthropic providers. " +
          "Get one at https://openrouter.ai. Then export OPENROUTER_API_KEY=..."
      );
    }
    this.apiKey = process.env.OPENROUTER_API_KEY;
  }

  async chat(messages: LLMMessage[], opts: ChatOptions = {}): Promise<LLMResponse> {
    const orMessages: OpenRouterMessage[] = [];
    const system = opts.systemPrompt ?? messages.find((m) => m.role === "system")?.content;
    if (system) orMessages.push({ role: "system", content: system });
    for (const m of messages) {
      if (m.role === "system") continue;
      orMessages.push({ role: m.role, content: m.content });
    }

    const tools = opts.tools ? opts.tools.map(anthropicToolToOpenAI) : undefined;

    const body: Record<string, unknown> = {
      model: this.model,
      messages: orMessages,
      max_tokens: opts.maxTokens ?? 1024,
    };
    if (opts.temperature !== undefined) body.temperature = opts.temperature;
    if (tools && tools.length > 0) body.tools = tools;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thestay.app",
        "X-Title": "Stay scenario CI",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter ${this.model} ${res.status}: ${errText.slice(0, 500)}`);
    }
    const data = (await res.json()) as OpenRouterCompletion;
    if (data.error) throw new Error(`OpenRouter ${this.model} error: ${data.error.message}`);

    const choice = data.choices?.[0];
    const text = choice?.message?.content ?? "";
    const toolCalls: LLMToolCall[] = [];
    for (const tc of choice?.message?.tool_calls ?? []) {
      try {
        const input =
          tc.function.arguments && tc.function.arguments.length > 0
            ? (JSON.parse(tc.function.arguments) as Record<string, unknown>)
            : {};
        toolCalls.push({ name: tc.function.name, input });
      } catch {
        // malformed tool call args — skip silently
      }
    }
    return { text, toolCalls };
  }
}

function anthropicToolToOpenAI(t: Anthropic.Tool): {
  type: "function";
  function: { name: string; description: string; parameters: unknown };
} {
  return {
    type: "function",
    function: {
      name: t.name,
      description: t.description ?? "",
      parameters: t.input_schema,
    },
  };
}
