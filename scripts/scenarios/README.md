# System X scenario CI

Regression tests for the system prompt. Each scenario is a named, reproducible conversation between a simulated user (driven by a persona-prompted LLM) and System X (or any other model under test). Assertions describe must-pass criteria for the resulting transcript.

## Philosophy

- Scenarios are REGRESSION tests, not training data.
- They check that prompt edits do not break behavior we have agreed (with clinicians) is correct.
- They are **never** used to auto-evolve the prompt.
- Add scenarios; never delete a passing one without clinician sign-off.
- Every critical assertion carries a `rule:` field tagging the specification rule it tests. `npm run check-rule-coverage` enforces that every rule listed in `scripts/check-rule-coverage.ts` has at least one critical assertion. This is the rule-↔-assertion invariant operationalized as CI.

## Layout

```
scripts/
  run-scenarios.ts             # CLI entry — runs the suite (multi-provider)
  check-rule-coverage.ts       # enforces rule-↔-assertion invariant
  scenarios/
    types.ts                   # scenario + assertion types
    runner.ts                  # one-shot runner: opener → loop → assert
    judge.ts                   # LLM-as-judge for soft assertions
    llm-client.ts              # provider abstraction (Anthropic / OpenRouter)
    resource-patterns.ts       # canonical regex patterns for crisis resources
    cases/
      suicide.ts               # 12 — Columbia gradient, imminent method-driven SOP, stop-988, stabilization, NSSI, combos
      dv.ts                    # 5  — physical, strangulation, couples-therapy ask, leave?, child witness
      leverage.ts              # 4  — baby / pet / faith / kids must NOT be weaponized
      trauma.ts                # 3  — flashback grounding, dissociation, childhood disclosure
      psychosis-mania.ts       # 4  — voices, persecution, no-sleep grandiosity, irreversible decisions
      ocd.ts                   # 3  — reassurance loop, certainty-seeking, magical thinking
      ed.ts                    # 3  — restriction, weight numbers, "I deserve"
      substance.ts             # 3  — drink-and-drive, no labeling, premature SAMHSA
      threats.ts               # 2  — duty-to-warn, vague rage
      caregiver.ts             # 3  — friend / partner / kid in distress
      daily.ts                 # 5  — bad day, couple debrief, draft msg, blank page, returning user
      calibration.ts           # 3  — humor, demote-on-escalation, banned phrases
      parasocial.ts            # 4  — frame-extension reground, no-repeated, no-reflexive, disclose-on-direct-question
      refusal.ts               # 6  — over-refusal, jailbreak, sycophancy spiral, sycophancy-distortion, roleplay refusal, engagement-tricks-absent, non-English no-fabricated
```

**61 scenarios. 14 case files** mapped to 12 distinct `Scenario.category` values (parasocial and refusal scenarios self-tag as `"calibration"` for filtering convenience).

## Running

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm install
npm run test:scenarios

# filter by id substring or category
npm run test:scenarios -- --filter=ocd
npm run test:scenarios -- --filter=suicide_

# faster: skip LLM-as-judge, only regex/tool checks (free / very cheap)
npm run test:scenarios -- --no-judge

# tune concurrency (default 3)
npm run test:scenarios -- --concurrency=5

# save full transcripts + per-assertion results
npm run test:scenarios -- --save=runs/2026-04-27.json

# list scenarios
npm run test:scenarios -- --list
```

## Cost expectations

Per full run (50 scenarios, judges on, default concurrency):
- System X turns: ~50 × 6 turns × ~1.5K tokens ≈ 450K input / 50K output (Sonnet)
- User-sim turns: ~50 × 5 turns × ~2K tokens ≈ 500K input / 50K output (Sonnet)
- Judge calls: ~50 scenarios × ~2 judge assertions × ~3K tokens ≈ 300K input / 5K output (Haiku)

Rough cost: ~$3-5 per full run on current pricing. Run on prompt changes, not on every commit.

## Assertion types

| kind | what it checks |
|------|---------------|
| `must_call_tool` | A specific tool was invoked, optionally with input subset match |
| `must_not_call_tool` | A specific tool was NOT invoked |
| `must_match` | Pattern appears in scope (any/first/final response) |
| `must_not_match` | Forbidden pattern is absent |
| `max_occurrences` | Pattern appears at most N times (e.g., 988 not repeated) |
| `judge` | LLM-as-judge evaluates a yes/no proposition |

Severity: `critical` (blocks deployment), `major` (warns), `minor` (info).

A run passes only if all `critical` assertions pass.

## Adding a scenario

1. Pick a category file under `cases/`.
2. Write a persona that constrains user behavior tightly: what they will and will not say, when they end, what they react to. Vague personas produce noisy scenarios.
3. Pick assertions sparingly. 2-4 per scenario is normal. Over-asserting bloats the failure surface without improving signal.
4. Prefer regex / tool checks over judge calls when possible.
5. Run the scenario once locally, inspect the saved transcript, and confirm assertions match what should be enforced.

## What this suite does NOT do

- It does not benchmark System X against other systems.
- It does not produce a summary score.
- It does not auto-suggest prompt fixes when scenarios fail.
- It does not replace real-user feedback or clinician review.

It is one piece of a larger evaluation pipeline: synthetic regression here, anonymized real transcripts (with consent) reviewed by humans elsewhere, clinician sign-off on every prompt change.
