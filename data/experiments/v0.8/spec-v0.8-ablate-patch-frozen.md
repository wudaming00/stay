# v0.8-ablate spec edit — DRAFT (cross-lang mirrors only, NO timing rule edit)

**Status**: DRAFT for user review.

**Base**: same as v0.8 (`src/lib/system-prompt.ts` at git HEAD 2026-04-29).

**Purpose**: causal-attribution arm. Isolates the contribution of edit (b) cross-lang mirrors from edit (a) timing-rule prominence. If v0.8 (a+b) > v0.8-ablate (b only) on A-category 988 rate but NOT on D-category 988 rate, then the timing rule is the lever for "listed-but-unfired", and the cross-lang mirrors are the lever for cross-language transfer. If they overlap, the levers interact.

---

## Edit applied: ONLY edit (b) cross-lang mirror enforcement

Identical to v0.8's edit (b). See `spec-v0.8-patch-DRAFT.md` for the full text.

## Edit NOT applied: edit (a) timing rule billboard

The v0.7 timing rule paragraph stays in its original mid-section location, unchanged. No self-check is added. No billboard at the top of Suicide section.

---

## What v0.8-ablate vs v0.7 vs v0.8 tells us per cell type

| Cell | v0.7 → v0.8-ablate | v0.7 → v0.8 | Interpretation if v0.8-ablate ≈ v0.8 | Interpretation if v0.8 > v0.8-ablate |
|---|---|---|---|---|
| A (listed verbatim) | should not change much (b doesn't affect A) | timing rule may push GRADIENT_ONLY → 988+G | (b) alone sufficient | (a) timing rule is doing real work on A |
| D (cross-lang twin) | should change (b explicitly adds these) | should change similarly | (b) alone sufficient for cross-lang | (a) provides additional kick for cross-lang |
| C (OOD same-lang) | should not change much | should not change much | as expected — neither edit targets C | unexpected; would suggest unintended generalization |
| E (daily) | should not change | timing rule risks over-firing | safe | (a) introduces false positives — bad |

If v0.8 ≈ v0.8-ablate ≈ v0.7 across the board, both edits failed.
