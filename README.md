# System X — Anonymous Code Mirror for AIES 2026

This repository is an anonymous code mirror provided as supplementary
material for two double-blind AIES 2026 submissions that share the same
deployed reference implementation (referred to as **System X** in both
papers).

It is **not the full project repository**. It contains only the files
the papers explicitly reference, plus the minimum supporting code
required to read the rule-coverage CI claim independently. Project
identifiers (name, domain, author, GitHub username, published preprint
DOIs) have been substituted or removed throughout.

## Layout

```
LICENSE                     MIT, for non-prompt files
LICENSE-PROMPT.md           Restricted-use license for src/lib/system-prompt.ts
package.json                Minimal devDependencies for the rule-coverage check
tsconfig.json
.github/workflows/
  check-rule-coverage.yml   CI workflow that gates merge on rule-coverage
src/
  lib/
    system-prompt.ts        The ~6.5k-token system prompt with named protected sections
    heartbeat-store.ts      Dead-man-switch heartbeat store + getHeartbeatStatus()
  app/api/
    admin/heartbeat/
      route.ts              HMAC-SHA256 heartbeat ingest endpoint
    chat/
      route.ts              Chat route consumer of the heartbeat gate
scripts/
  check-rule-coverage.ts    Registry-driven rule-coverage check (REQUIRED_RULES)
  scenarios/
    index.ts                Aggregates 61 scenarios across 13 categories
    types.ts, judge.ts, llm-client.ts, runner.ts, resource-patterns.ts
    cases/                  Per-category scenario files (suicide, dv, leverage, trauma, ...)
docs/
  scope-recognition-strata.md     Stratum → action mapping (Paper C §3.4)
  defense-of-record.md            Base-model-layer defense-of-record selection (Paper C §6.2)
  deployment-conditions.md        Public deployment-conditions registry (Paper A §sec:pause)
```

## Mapping to paper sections

| Paper claim | File(s) in this mirror |
| --- | --- |
| Paper A §sec:license — LICENSE-PROMPT structure | `LICENSE-PROMPT.md`, `src/lib/system-prompt.ts` (HTML-comment section markers) |
| Paper A §sec:pause — auditable trigger registry | `docs/deployment-conditions.md` |
| Paper A §sec:deadman — heartbeat dead-man switch | `src/lib/heartbeat-store.ts`, `src/app/api/admin/heartbeat/route.ts`, `src/app/api/chat/route.ts` |
| Paper A §sec:ci — rule-coverage CI | `scripts/check-rule-coverage.ts`, `.github/workflows/check-rule-coverage.yml`, `scripts/scenarios/` |
| Paper A §sec:systemx — 61-scenario test suite, 33 covered rules | `scripts/scenarios/cases/` (per-category), `scripts/check-rule-coverage.ts` (REQUIRED_RULES) |
| Paper C §3.4 — scope-recognition stratum-to-action mapping | `docs/scope-recognition-strata.md` |
| Paper C §6.2 — deployment-side defense-of-record | `docs/defense-of-record.md` |
| Paper C §5 — agency functions (translator / mirror / navigator / bridge / skill teacher / logger) | `src/lib/system-prompt.ts` |

## Verifying the rule-coverage CI claim

The claim in Paper A §sec:ci ("33 covered, 0 uncovered at the time of
writing") can be checked locally:

```bash
npm install
npm run check-rule-coverage
```

The script reads `scripts/scenarios/cases/*.ts` and computes the
intersection of `REQUIRED_RULES` (declared in `check-rule-coverage.ts`)
with `rule:` fields on critical-severity assertions in the scenario
files. It exits non-zero if any required rule has zero covering
assertions.

## What is intentionally omitted

- The Next.js application UI components (out of scope for the papers'
  claims; would also re-introduce identifying branding).
- The deployed system's published preprints, blog posts, and project-
  identity-bearing documentation.
- Git history. This mirror is an orphan branch; commit author email and
  history of the original repository are not reachable from here.
- The full 61 test scenarios' `judge`-mode prompts (preserved in the
  `cases/` files but the LLM-as-judge runner connects to a model API
  that requires credentials not included in this mirror).

## License

- `src/lib/system-prompt.ts` is governed by `LICENSE-PROMPT.md`.
- All other files are MIT-licensed (see `LICENSE`).
