# VERA-MH evaluation transcripts (2026-04-28)

This directory contains the §2 evaluation data referenced in the preprint
(`docs/preprint-v0.5-draft.md`). It is the raw artifact for measurement-
validity replication.

## What was run

VERA-MH commit (Spring Health) at github.com/SpringCare/VERA-MH, 2026-04-28.

- 9 personas (the full standard VERA-MH persona set)
- 6 turns per conversation
- 1 run per persona
- Persona simulator: `claude-sonnet-4-5-20250929`
- Judge model: `claude-sonnet-4-5-20250929` (single-judge — see preprint §2.6
  on the same-model-thrice limitation)

Two provider configurations:

- **stay-conversations/**: `claude-sonnet-4-5-20250929` with Stay's
  production system prompt (specification version v0.3.x; method-driven
  imminent SOP introduced in v0.4 was NOT yet present at time of run —
  see preprint §2.6). Tools off — system prompt only.
- **baseline-claude-conversations/**: `claude-sonnet-4-5-20250929` with
  VERA-MH's default "You are a helpful AI assistant" prompt. No tools.

## Headline results

| Dimension | Raw Claude | Stay |
|-----------|------------|------|
| Detects Risk | 100 | 68 |
| Clarifies Risk | 100 | 68 |
| Guides to Human Support | 4 | 0 |
| Collaborates and Validates Appropriately | 71 | 93 |
| Maintains Safe Boundaries | 57 | 50 |
| **Overall VERA Score** | **55.62** | **41.79** |

Full per-conversation, per-dimension judge reasoning in `stay-evaluations/results.csv` and `baseline-claude-evaluations/results.csv`.

## Files

```
2026-04-28/
├── README.md                           # this file
├── stay-conversations/                 # 9 .txt files, one per persona
├── stay-evaluations/
│   ├── scores.json                     # aggregate VERA-MH v1 score
│   └── results.csv                     # per-conversation per-dimension verdicts + judge reasoning
├── baseline-claude-conversations/      # 9 .txt files, one per persona
└── baseline-claude-evaluations/
    ├── scores.json
    └── results.csv
```

## Reproduce

```bash
# Clone + setup VERA-MH
git clone https://github.com/SpringCare/VERA-MH
cd VERA-MH
uv sync
cp .env.example .env  # add ANTHROPIC_API_KEY

# Stay run (using Stay's system prompt)
# A wrapper that injects the Stay prompt is at:
#   https://github.com/wudaming00/stay/blob/main/scripts/run_vera_mh_with_stay.py
# Cost: ~$2-3, ~5 min wall-clock
python3 run_vera_mh_with_stay.py --turns 6 --runs 1 --max-personas 9

# Baseline run (no system prompt)
python3 generate.py -u claude-sonnet-4-5-20250929 -p claude-sonnet-4-5-20250929 -t 6 -r 1 -mp 9 -c 3 -f conversations/baseline-claude
# Cost: ~$2-3
```

## Limitations of this data

See preprint §2.6. Briefly: n=9 single-run, same model as persona/judge/SUT,
asymmetric tool config, single comparator, 6-turn quick-test convention,
specification version mismatch (v0.3.x not v0.4). Future work: multi-judge
robustness (GPT-5 + Gemini 2.5), k≥3 per persona with bootstrap CIs,
ablation runs, larger persona counts.
