# Reproducing §2 of the preprint

The §2 case in the preprint runs VERA-MH (Bentley et al., 2026; arXiv:2602.05088) against two configurations of `claude-sonnet-4-5-20250929`:

1. **Stay**: with Stay's production system prompt (the version at the time of the run was v0.3.x — the run pre-dates v0.8 agency-trajectory framework)
2. **Raw Claude**: with VERA-MH's default `"You are a helpful AI assistant"` prompt

Output: 9 personas × 6 turns × 2 systems = 18 conversation transcripts + per-conversation rubric judge ratings.

## Public artifacts (no API spend needed to inspect)

The complete output of the original run is committed to this repo at:

```
data/vera-mh-runs/2026-04-28/
  README.md
  baseline-claude-conversations/   ← the 9 raw-Claude transcripts (one .txt per persona)
  baseline-claude-evaluations/     ← results.csv + scores.json (judge ratings)
  stay-conversations/              ← the 9 Stay transcripts
  stay-evaluations/                ← results.csv + scores.json
```

If you want to verify §2 claims (the four-behaviors finding, the 14-point overall delta, the Omar-conversation-specific judge ratings), every word is in those directories. No API cost; no setup.

## Reproducing from scratch

If you want to actually re-run the evaluation (e.g., to test a different model, a different judge, or a newer version of Stay's spec), the high-level steps are:

```bash
# 1. Clone VERA-MH
git clone https://github.com/SpringCare/VERA-MH
cd VERA-MH
git checkout f4a0c2e   # the commit pinned in §2 of the preprint

# 2. Set up env
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-...

# 3. Run baseline (raw Claude) and Stay (with Stay's system prompt)
#    — VERA-MH's CLI takes a --provider flag and --system-prompt path.
python -m vera_mh.run \
  --personas data/personas.tsv \
  --turns 6 \
  --runs 1 \
  --provider anthropic:claude-sonnet-4-5-20250929 \
  --output runs/baseline

python -m vera_mh.run \
  --personas data/personas.tsv \
  --turns 6 \
  --runs 1 \
  --provider anthropic:claude-sonnet-4-5-20250929 \
  --system-prompt /path/to/stay/src/lib/system-prompt.ts \
  --output runs/stay
```

(The flag names above are illustrative — check `python -m vera_mh.run --help` against the commit you cloned. VERA-MH's CLI conventions evolve.)

Approximate cost: ~$60 in Anthropic API spend. Approximate wall-clock: ~30 minutes with default concurrency.

## Reproducing with multi-judge robustness

The preprint's §2.6 documents the same-model confound (persona simulator + judge + system-under-test all using Sonnet 4.5). To address it, run with multiple judge models:

```bash
# Multi-judge sweep (one judge model at a time; merge results downstream)
for JUDGE in \
    openai:gpt-5 \
    google:gemini-2.5-pro \
    anthropic:claude-sonnet-4-5-20250929 ; do
  python -m vera_mh.run \
    --personas data/personas.tsv \
    --turns 6 --runs 3 \
    --provider anthropic:claude-sonnet-4-5-20250929 \
    --system-prompt /path/to/stay/src/lib/system-prompt.ts \
    --judge-provider "$JUDGE" \
    --output "runs/stay_judge_${JUDGE//[:\/]/_}"
done
```

Compute inter-judge κ on the resulting rubric ratings. Cohen's κ < 0.75 means the §2 delta is sensitive to judge choice and should be presented with the κ as a caveat.

## Reproducing with Stay v0.8 (the version after this paper's run)

The original §2 run used Stay's v0.3.x specification. v0.8 adds the agency-trajectory framework, the "988 by turn 2" billboard, and companion-during-call language — all of which would change the judge ratings on dimensions like "Guides to Human Support".

To re-run with v0.8: replace `--system-prompt` path with the current `src/lib/system-prompt.ts` (which is v0.8 as of commit `da95727`+). Expected effect: improved scoring on "Guides to Human Support" via 988-by-turn-2; the four-behaviors finding (§2.4 — about what raw Claude did) is independent of Stay's spec version.

## What this is NOT

- It is not a packaged turn-key script in this repo. The cost of writing and maintaining a generic VERA-MH wrapper here was higher than the cost of pointing readers to VERA-MH's own CLI plus our public transcript output.
- It is not necessary if you only want to verify our specific claims. The transcripts at `data/vera-mh-runs/2026-04-28/` are the empirical record. They are stable; no API call required.

If a maintained script would help your replication and you can't get VERA-MH's CLI to do what you need, please open an issue at github.com/wudaming00/stay describing the use case.
