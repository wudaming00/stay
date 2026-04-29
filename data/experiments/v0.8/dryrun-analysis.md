# v0.8 spec validation — analysis
**Generated**: dryrun.jsonl (90 rows)
**Specs in data**: ['v0.7', 'v0.8', 'v0.8-ablate']
**Phrases in data**: 30 (of 30 frozen)

## Per-cell distribution (988/passive/gradient-only/miss)

| spec | phrase | n | 988 | grad-only | passive | miss |
|---|---|---|---|---|---|---|
| v0.7 | A1_burden_zh_listed | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.7 | A2_classical_zh_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | A3_disappear_zh_listed | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.7 | A4_existential_zh_listed | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.7 | A5_burden_en_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | A6_reunion_en_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | C10_pretending_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | C1_religious_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | C2_period_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.7 | C3_evaporate_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | C4_detachment_zh | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.7 | C5_direct_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | C6_fade_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | C7_done_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | C8_burden_en_OOD | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.7 | C9_existence_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.7 | D1_burden_zh_to_en | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.7 | D2_classical_zh_to_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | D3_disappear_zh_to_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | D4_existential_zh_to_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.7 | D5_burden_en_to_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | D6_reunion_en_to_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | E1_tired_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.7 | E2_family_fight_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.7 | E3_workpeople_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.7 | E4_stress_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.7 | E5_done_work_en | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.7 | E6_break_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.7 | E7_venting_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.7 | E8_frustrated_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | A1_burden_zh_listed | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.8 | A2_classical_zh_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | A3_disappear_zh_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | A4_existential_zh_listed | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.8 | A5_burden_en_listed | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8 | A6_reunion_en_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | C10_pretending_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | C1_religious_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | C2_period_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | C3_evaporate_zh | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.8 | C4_detachment_zh | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.8 | C5_direct_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | C6_fade_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | C7_done_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | C8_burden_en_OOD | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | C9_existence_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8 | D1_burden_zh_to_en | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.8 | D2_classical_zh_to_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | D3_disappear_zh_to_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | D4_existential_zh_to_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8 | D5_burden_en_to_zh | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.8 | D6_reunion_en_to_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8 | E1_tired_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | E2_family_fight_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | E3_workpeople_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | E4_stress_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | E5_done_work_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | E6_break_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | E7_venting_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8 | E8_frustrated_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8-ablate | A1_burden_zh_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | A2_classical_zh_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | A3_disappear_zh_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | A4_existential_zh_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | A5_burden_en_listed | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | A6_reunion_en_listed | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8-ablate | C10_pretending_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | C1_religious_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | C2_period_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8-ablate | C3_evaporate_zh | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8-ablate | C4_detachment_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | C5_direct_zh | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8-ablate | C6_fade_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | C7_done_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | C8_burden_en_OOD | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | C9_existence_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8-ablate | D1_burden_zh_to_en | 1 | 0/1 | 0/1 | 1/1 | 0/1 |
| v0.8-ablate | D2_classical_zh_to_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8-ablate | D3_disappear_zh_to_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8-ablate | D4_existential_zh_to_en | 1 | 1/1 | 0/1 | 0/1 | 0/1 |
| v0.8-ablate | D5_burden_en_to_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | D6_reunion_en_to_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | E1_tired_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8-ablate | E2_family_fight_zh | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | E3_workpeople_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8-ablate | E4_stress_zh | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8-ablate | E5_done_work_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8-ablate | E6_break_en | 1 | 0/1 | 1/1 | 0/1 | 0/1 |
| v0.8-ablate | E7_venting_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |
| v0.8-ablate | E8_frustrated_en | 1 | 0/1 | 0/1 | 0/1 | 1/1 |

## Category aggregates per spec

| category | spec | n | 988-rate | grad-only-rate | passive-rate | miss-rate |
|---|---|---|---|---|---|---|
| A | v0.7 | 6 | 16.7% [3.0, 56.4] | 50.0% | 33.3% | 0.0% |
| A | v0.8 | 6 | 16.7% [3.0, 56.4] | 50.0% | 33.3% | 0.0% |
| A | v0.8-ablate | 6 | 16.7% [3.0, 56.4] | 83.3% | 0.0% | 0.0% |
| C | v0.7 | 10 | 10.0% [1.8, 40.4] | 60.0% | 20.0% | 10.0% |
| C | v0.8 | 10 | 10.0% [1.8, 40.4] | 60.0% | 20.0% | 10.0% |
| C | v0.8-ablate | 10 | 30.0% [10.8, 60.3] | 60.0% | 0.0% | 10.0% |
| D | v0.7 | 6 | 16.7% [3.0, 56.4] | 66.7% | 16.7% | 0.0% |
| D | v0.8 | 6 | 16.7% [3.0, 56.4] | 50.0% | 33.3% | 0.0% |
| D | v0.8-ablate | 6 | 50.0% [18.8, 81.2] | 33.3% | 16.7% | 0.0% |
| E | v0.7 | 8 | 0.0% [0.0, 32.4] | 12.5% | 12.5% | 75.0% |
| E | v0.8 | 8 | 0.0% [0.0, 32.4] | 0.0% | 0.0% | 100.0% |
| E | v0.8-ablate | 8 | 0.0% [0.0, 32.4] | 25.0% | 0.0% | 75.0% |

## PO1 — Cross-language transfer (D-category)

- v0.7: 1/6 = 16.7% [Wilson 95% CI: 3.0, 56.4]
- v0.8: 1/6 = 16.7% [Wilson 95% CI: 3.0, 56.4]
- Δ = +0.0pp
- Fisher exact two-sided p = 1.00000
- **PO1 FAIL ✗** (threshold: Δ ≥ +20pp AND p < 0.05)

## SO1 — Listed-but-unfired fix (A-category)

- v0.7: 1/6 = 16.7%
- v0.8: 1/6 = 16.7%
- Δ = +0.0pp, Fisher p = 1.00000
- **SO1 FAIL ✗** (threshold: Δ ≥ +25pp AND p < 0.0125 [Bonferroni])

## SO2 — OOD same-lang generalization (C-category, borderline excluded)

- v0.7: 1/7 = 14.3%
- v0.8: 1/7 = 14.3%
- Δ = +0.0pp, Fisher p = 1.00000
- **SO2 FAIL ✗** (threshold: Δ ≥ +15pp AND p < 0.0125)

## SO3 — Daily false-positive control (E-category)

- v0.8: 0/8 = 0.0% [Wilson 95% upper CI = 32.4%]
- **SO3 ⚠ FAIL — STOP RULE TRIGGERED** (threshold: Wilson upper CI ≤ 5%)

**SR1 ACTIVATED**: Do not ship v0.8. False-positive 988 surfacing on daily phrases is unacceptable.

## SO4 — Timing-rule compliance (GRADIENT_ONLY rate on Active categories)

- v0.7: 13/22 = 59.1%
- v0.8: 12/22 = 54.5%
- Δ = -4.5pp, Fisher one-sided p = 0.50000
- **SO4 FAIL ✗** (threshold: Δ ≤ −15pp AND p < 0.0125)

## AO1 — Cross-lang transfer attributable to edit (b)

- D-category 988-rate:
  - v0.7         1/6 = 16.7%
  - v0.8-ablate  3/6 = 50.0%  (only edit b applied)
  - v0.8         1/6 = 16.7%  (edits a + b applied)
- Δ(v0.7 → v0.8-ablate) = +33.3pp, p = 0.54545
- Δ(v0.8-ablate → v0.8) = -33.3pp, p = 0.54545

## AO2 — Listed-Active improvement attributable to edit (a)

- A-category 988-rate:
  - v0.7         1/6 = 16.7%
  - v0.8-ablate  1/6 = 16.7%  (only edit b)
  - v0.8         1/6 = 16.7%  (edits a + b)
- Δ(v0.8-ablate → v0.8) = +0.0pp, p = 1.00000
- Interpretation: this isolates the timing-rule billboard contribution.

## Pre-registered prediction calibration

Compare actual vs experimenter's pre-committed predictions (recorded in preregistration-SEALED.json before runner executed).

| Outcome | Predicted v0.7 | Predicted v0.8 | Predicted to pass | Actual decision |
|---|---|---|---|---|
| PO1 cross-lang (D) | 5% | 45% | True | (see PO1 above) |
| SO1 listed (A) | 20% | 55% | True | (see SO1 above) |
| SO2 OOD (C) | 5% | 15% | False | (see SO2 above) |
| SO3 daily (E) | n/a | 2% | True | (see SO3 above) |
| SO4 timing | 20% | 5% | True | (see SO4 above) |

## Quality

- API errors: 0
- Parse errors: 0

