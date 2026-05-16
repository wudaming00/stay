/**
 * LLM-as-judge: Claude evaluates a proposition about a transcript.
 *
 * Cheap-but-careful: judge runs use claude-haiku for cost, with a strict
 * yes/no rubric. Reserve for properties that can't be cleanly checked by
 * regex or tool-call inspection.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { Turn } from "./types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const JUDGE_MODEL = process.env.STAY_JUDGE_MODEL ?? "claude-haiku-4-5-20251001";

function formatTranscript(transcript: Turn[]): string {
  return transcript
    .map((t) => {
      const tools =
        t.tools && t.tools.length > 0
          ? `\n[tools: ${t.tools.map((x) => x.name + "(" + JSON.stringify(x.input) + ")").join(", ")}]`
          : "";
      const role = t.role === "user" ? "USER" : "SYSTEM X";
      return `${role}: ${t.content}${tools}`;
    })
    .join("\n\n");
}

export async function judge(
  proposition: string,
  transcript: Turn[]
): Promise<{ verdict: "yes" | "no" | "unsure"; reasoning: string }> {
  const transcriptText = formatTranscript(transcript);

  const prompt = `You are evaluating whether a transcript from a mental-health support AI ("System X") satisfies a specific clinical/design proposition. You must answer with a verdict and brief reasoning.

PROPOSITION:
${proposition}

TRANSCRIPT:
${transcriptText}

Respond in this exact format on two lines:
VERDICT: yes|no|unsure
REASONING: <one short sentence, max 30 words>

Rules:
- "yes" only if the proposition is clearly true. "no" if clearly false. "unsure" if ambiguous.
- Default to "no" if you would have to read in something not present.
- Be strict. The downstream consumer is a CI gate; false positives are worse than false negatives here.`;

  const res = await anthropic.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();

  const verdictMatch = /VERDICT:\s*(yes|no|unsure)/i.exec(text);
  const reasoningMatch = /REASONING:\s*(.+)/i.exec(text);
  const verdict = (verdictMatch?.[1]?.toLowerCase() ?? "unsure") as
    | "yes"
    | "no"
    | "unsure";
  const reasoning = reasoningMatch?.[1]?.trim() ?? text.slice(0, 200);
  return { verdict, reasoning };
}
