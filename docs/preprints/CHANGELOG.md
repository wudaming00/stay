# Preprint changelog

This file records material changes to preprints in this directory across versions.

## Paper C — *Articulation Skill: A Patient-Navigator Regime for Public-Good Mental-Health AI*

### 2026-05-04 (post-v1.1 working-draft edits, ahead of clinician-of-record audit)

- §5: clarified the system-prompt-vs-paper function-count discrepancy. The deployed prompt enumerates seven agency functions; this paper's regime claim counts the six that have rule-coverage CI assertions (translator, mirror, navigator, bridge-with-companion, skill teacher, logger). The seventh — long memory + pattern surface — is honestly omitted because it lacks the multi-session test harness; an `agency.memory` rule is registered as future work in the rule-coverage script. The §3 three-property conjunction does not depend on the seventh function.
- §5: added forward-references to the new conformance artifacts: `inviolable.9` (provider-recommendation refusal, P2 enforcement) and `inviolable.10` (DSM-categories refusal, P3 enforcement) in `src/lib/system-prompt.ts`; `docs/scope-recognition-strata.md` (the §3.4 stratum-to-action mapping); `docs/defense-of-record.md` (the §6.2 base-model-layer defense selection).
- §7.4 IPV paragraph: corrected the "below standard of care" framing to reflect what is actually shipped. The strangulation screen is implemented with regression coverage in the CI suite (`dv_strangulation_screen` in `scripts/scenarios/cases/dv.ts`); only the remaining Campbell Danger Assessment 2009 items (firearms-in-home, escalation indicators, weapon-threats history, jealousy/control items, prior near-fatal injury) are not yet integrated. The clinician audit checkpoint becomes "complete the DA item-set," not "build IPV lethality vocabulary from zero."
- §8 closing summary: gap list updated to reflect the §7.4 correction (full Campbell DA item-set integration; SMI scope-recognition; handoff-rate telemetry; no clinician audit yet).

### Between commit 17b6113 (v1 frozen) and the current working draft

**Withdrawn material.** Earlier public commits (8857c4d v0.3, 849a546 v0.5, 17b6113 v1 frozen) included a §5.1 within-session trajectory describing one observed deployment session and a §5.2 follow-on analysis. That material was withdrawn on consent and IRB-pathway grounds. Trajectory-level evidence is deferred to future work conducted under IRB review (current §10.3). The current §5 describes the reference implementation at the architectural and agency-function level only.

**Other material changes.**
- §1.4 lineage discussion moved to Appendix B (B.1–B.6) for full disambiguation.
- §6 contribution language clarified: anti-engagement *category* is the citable contribution; handoff rate is one operationalization awaiting Phase-1 validation, not a validated metric.
- §6.3 phased-audit specification (Phase 1 formative, Phase 2 stratified) added.
- §7.5 reorganized: nine subsections of objection-response collapsed to four (the remaining short concessions absorbed into §7.4 population-harm risks and §B.1/B.2 lineage disambiguation rather than retained as standalone subsections).
- Citation corrections across rounds: Perez 2309.13836 (confabulated arXiv ID) → Shah et al. arXiv:2210.01790 (Goal Misgeneralization); Star 1991 mis-titled paper → Star 1991 "Power, technology and the phenomenology of conventions: On being allergic to onions" (in Law's *A Sociology of Monsters*) plus Star 1991 "The sociology of the invisible" (in Maines's volume); McNiel/Eisner/Binder 1998 *JAAPL* (incorrect attribution) → Hersh & Borum 1998 *JAAPL* 26(3):353–359 plus McNiel/Eisner/Binder 2000 *Psychiatric Services* 51(10):1288–1292; Posner 2008 C-SSRS (no peer-reviewed paper at that year) → C-SSRS scale © 2008 with validation in Posner et al. 2011 *Am J Psychiatry* 168(12):1266–1277.
- §8.4a deployment-pause posture: prior 60-day deadline language removed; the substantive trigger remains the 2026-06-30 clinician-of-record audit (Paper A §2.2).
