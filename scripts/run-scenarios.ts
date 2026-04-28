#!/usr/bin/env -S npx tsx
/**
 * CLI runner for the Stay scenario CI suite — multi-provider.
 *
 *   npm run test:scenarios                                  # all, default Anthropic
 *   npm run test:scenarios -- --filter=ocd                  # category or id substring
 *   npm run test:scenarios -- --concurrency=2
 *   npm run test:scenarios -- --save=runs/baseline.json
 *   npm run test:scenarios -- --no-judge                    # skip LLM-judge
 *
 * Multi-provider testing:
 *   npm run test:scenarios -- --provider=openrouter:openai/gpt-5
 *   npm run test:scenarios -- --provider=openrouter:google/gemini-2.5-pro
 *   npm run test:scenarios -- --provider=openrouter:x-ai/grok-3
 *   npm run test:scenarios -- --provider=openrouter:deepseek/deepseek-r2
 *
 * Modes for the system-under-test:
 *   --no-stay-prompt    Run with generic "helpful assistant" prompt (raw model
 *                       behavior baseline). Default: inject Stay's prompt.
 *   --no-stay-tools     Don't send Stay's tool definitions. Default: send
 *                       tools when prompt is on.
 *
 * Exits non-zero if any critical assertion fails.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { ALL_SCENARIOS } from "./scenarios/index.js";
import { Runner } from "./scenarios/runner.js";
import type { ScenarioRun } from "./scenarios/types.js";

interface Args {
  filter?: string;
  concurrency: number;
  save?: string;
  noJudge: boolean;
  list: boolean;
  provider?: string;
  userSim?: string;
  noStayPrompt: boolean;
  noStayTools: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    concurrency: 3,
    noJudge: false,
    list: false,
    noStayPrompt: false,
    noStayTools: false,
  };
  for (const a of argv) {
    if (a === "--list") args.list = true;
    else if (a === "--no-judge") args.noJudge = true;
    else if (a === "--no-stay-prompt") args.noStayPrompt = true;
    else if (a === "--no-stay-tools") args.noStayTools = true;
    else if (a.startsWith("--filter=")) args.filter = a.slice("--filter=".length);
    else if (a.startsWith("--concurrency="))
      args.concurrency = Math.max(1, parseInt(a.slice("--concurrency=".length), 10));
    else if (a.startsWith("--save=")) args.save = a.slice("--save=".length);
    else if (a.startsWith("--provider=")) args.provider = a.slice("--provider=".length);
    else if (a.startsWith("--user-sim=")) args.userSim = a.slice("--user-sim=".length);
  }
  return args;
}

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function fmtSummary(runs: ScenarioRun[]) {
  const total = runs.length;
  const passed = runs.filter((r) => r.passed).length;
  const failed = total - passed;
  const errors = runs.filter((r) => r.error).length;
  const totalDurMs = runs.reduce((s, r) => s + r.durationMs, 0);
  return { total, passed, failed, errors, totalDurMs };
}

async function pool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i]);
    }
  }
  await Promise.all(new Array(Math.min(concurrency, items.length)).fill(0).map(() => next()));
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Anthropic key required for the judge (always Anthropic for IRR consistency)
  // unless --no-judge is set.
  if (!args.noJudge && !process.env.ANTHROPIC_API_KEY) {
    console.error(
      `${C.red}error${C.reset}: ANTHROPIC_API_KEY is required for the LLM judge. Set it or use --no-judge.`
    );
    process.exit(2);
  }
  // OpenRouter key required if any provider routes through openrouter.
  const usesOpenRouter =
    (args.provider ?? "").startsWith("openrouter:") ||
    (args.userSim ?? "").startsWith("openrouter:");
  if (usesOpenRouter && !process.env.OPENROUTER_API_KEY) {
    console.error(
      `${C.red}error${C.reset}: OPENROUTER_API_KEY is required for openrouter:* providers. Get one at https://openrouter.ai.`
    );
    process.exit(2);
  }

  let scenarios = ALL_SCENARIOS;
  if (args.filter) {
    scenarios = scenarios.filter(
      (s) => s.id.includes(args.filter!) || s.category.includes(args.filter!)
    );
  }
  if (args.noJudge) {
    scenarios = scenarios.map((s) => ({
      ...s,
      assertions: s.assertions.filter((a) => a.kind !== "judge"),
    }));
  }

  if (args.list) {
    for (const s of scenarios) {
      console.log(`${C.cyan}${s.id}${C.reset}  ${C.dim}[${s.category}]${C.reset}  ${s.description}`);
    }
    return;
  }

  const runner = new Runner({
    providerModel: args.provider,
    userSimModel: args.userSim,
    useStayPrompt: !args.noStayPrompt,
    useStayTools: !args.noStayPrompt && !args.noStayTools,
  });

  console.log(
    `${C.bold}stay scenario CI${C.reset} — ${scenarios.length} scenario(s), concurrency ${args.concurrency}`
  );
  console.log(
    `${C.dim}provider: ${args.provider ?? process.env.STAY_MODEL ?? "claude-sonnet-4-5-20250929"}${C.reset}`
  );
  console.log(
    `${C.dim}user-sim: ${args.userSim ?? process.env.STAY_USER_SIM_MODEL ?? "claude-sonnet-4-5-20250929"}${C.reset}`
  );
  console.log(
    `${C.dim}judge:    ${process.env.STAY_JUDGE_MODEL ?? "claude-haiku-4-5-20251001"}${C.reset}`
  );
  console.log(
    `${C.dim}stay-prompt: ${args.noStayPrompt ? "off (raw model baseline)" : "on"}, stay-tools: ${
      args.noStayPrompt || args.noStayTools ? "off" : "on"
    }${C.reset}\n`
  );

  const start = Date.now();
  const runs = await pool(scenarios, args.concurrency, async (s) => {
    process.stdout.write(`${C.dim}→ ${s.id}${C.reset}\n`);
    const run = await runner.run(s);
    const status = run.error
      ? `${C.red}ERROR${C.reset}`
      : run.passed
        ? `${C.green}PASS${C.reset}`
        : `${C.red}FAIL${C.reset}`;
    process.stdout.write(
      `  ${status} ${C.cyan}${s.id}${C.reset} ${C.dim}(${run.durationMs}ms)${C.reset}\n`
    );
    if (!run.passed && !run.error) {
      for (const r of run.results) {
        if (!r.result.passed) {
          const sev =
            r.assertion.severity === "critical"
              ? `${C.red}[critical]${C.reset}`
              : r.assertion.severity === "major"
                ? `${C.yellow}[major]${C.reset}`
                : `${C.dim}[minor]${C.reset}`;
          process.stdout.write(
            `    ${sev} ${r.assertion.description}\n      ${C.dim}${r.result.diagnostic}${C.reset}\n`
          );
        }
      }
    }
    if (run.error) {
      process.stdout.write(`    ${C.red}${run.error}${C.reset}\n`);
    }
    return run;
  });
  const wall = Date.now() - start;

  const sum = fmtSummary(runs);
  console.log("");
  console.log(`${C.bold}summary${C.reset}`);
  console.log(`  total:   ${sum.total}`);
  console.log(`  ${C.green}passed:  ${sum.passed}${C.reset}`);
  console.log(
    `  ${sum.failed > 0 ? C.red : C.dim}failed:  ${sum.failed}${C.reset}`
  );
  if (sum.errors > 0) console.log(`  ${C.red}errors:  ${sum.errors}${C.reset}`);
  console.log(`  ${C.dim}wall:    ${(wall / 1000).toFixed(1)}s${C.reset}`);

  if (args.save) {
    await mkdir(dirname(args.save), { recursive: true });
    const payload = {
      ranAt: new Date().toISOString(),
      summary: sum,
      runs: runs.map((r) => ({
        id: r.scenario.id,
        category: r.scenario.category,
        passed: r.passed,
        error: r.error,
        durationMs: r.durationMs,
        results: r.results.map((res) => ({
          description: res.assertion.description,
          severity: res.assertion.severity,
          kind: res.assertion.kind,
          passed: res.result.passed,
          diagnostic: res.result.diagnostic,
        })),
        transcript: r.transcript,
      })),
    };
    await writeFile(args.save, JSON.stringify(payload, null, 2));
    console.log(`  ${C.dim}saved transcripts → ${args.save}${C.reset}`);
  }

  process.exit(sum.failed === 0 && sum.errors === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(`${C.red}fatal${C.reset}: ${err instanceof Error ? err.stack : String(err)}`);
  process.exit(2);
});
