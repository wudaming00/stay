# Attribution and license compliance

This skill is a derived work of the Stay system prompt (`src/lib/system-prompt.ts` v0.8+ in the upstream repo). It is governed by the **Stay System Prompt License v1** (LICENSE-PROMPT.md at the repo root), NOT by the MIT license that covers the rest of the Stay codebase.

## Source

- **Upstream:** https://github.com/wudaming00/stay
- **Live deployment:** https://thestay.app
- **License:** https://github.com/wudaming00/stay/blob/main/LICENSE-PROMPT.md
- **Paper A (engineering-ethics governance):** Zenodo DOI [10.5281/zenodo.19941457](https://doi.org/10.5281/zenodo.19941457)
- **Paper C (articulation-skill positioning):** Zenodo DOI [10.5281/zenodo.20028720](https://doi.org/10.5281/zenodo.20028720)

## Attribution statement (per LICENSE-PROMPT §3)

> Derived from Stay (https://github.com/wudaming00/stay) under the Stay System Prompt License v1. The four safety-critical sections — §1.a imminent-risk SOP, §1.b leverage-prevention rule, §1.c no-third-party-characterization rule, §1.d companion-during-call requirement — are **retained**, restructured across multiple files in this skill but textually preserved with `<!-- PROTECTED SECTION ... -->` markers in `crisis-protocol.md` and `leverage-and-framing.md`. Responsible-Deployment Manifest at https://thestay.app/promises (the live Stay deployment's public Constitution serves as the manifest for this skill, since the skill is authored by the same operator and deployed under the same conditions).

## Which sections of the upstream prompt are where in this skill

For the protected sections specifically (LICENSE-PROMPT §1.a–§1.d):

| Upstream section | File in this skill |
|---|---|
| §1.a Imminent-risk SOP (method-driven persuasion with companion-during-call) | `crisis-protocol.md` § "Imminent (specific plan + method + time, or means in hand)" |
| §1.b Leverage-prevention rule ("Reasons-for-living are sacred, not leverage") | `leverage-and-framing.md` § "Reasons-for-living are sacred, not leverage" |
| §1.c No-third-party-characterization rule | `leverage-and-framing.md` § "No third-party characterization stronger than the user's own words" |
| §1.d Companion-during-call requirement (preserved-pending-clinical-validation) | `crisis-protocol.md` § "Imminent" step 6 + cross-references; also `SKILL.md` self-check #26 |

All four are wrapped in `<!-- PROTECTED SECTION ... -->` HTML comments matching the upstream markers. They are not modified.

## Responsible-Deployment Manifest (per LICENSE-PROMPT §2)

LICENSE-PROMPT §2 requires that any derived work deployed to real users publish a Responsible-Deployment Manifest with:

1. **Declared positioning** — what the system is FOR; what human services it complements vs substitutes for; what it is NOT designed to handle.
2. **Named clinical reviewer-of-record** — or a statement that no clinical reviewer is involved, with reasoning.
3. **Jurisdiction(s) of deployment.**
4. **Adverse-event reporting commitment** — if any, and to whom.

For this skill, the manifest is the live Stay deployment's public Constitution at **https://thestay.app/promises**, which is authored by the same operator under the same conditions. In summary:

1. **What this skill is FOR:** articulation-skill support for people processing an interpersonal/emotional moment — finding words, drafting a message, naming a feeling, working through a conflict. It also bridges to US crisis services (988, Crisis Text Line, DV Hotline, Childhelp, 911) when safety signals appear. It complements but does not substitute for: trained crisis counselors, licensed therapists, the user's own relationships, the user's own future self. It is NOT designed to handle: medication management, formal diagnosis, treatment planning, sustained therapy, in-person co-regulation, regulated medical-device functions.

2. **Clinical reviewer-of-record:** **None as of 2026-05-10.** The author is a single non-clinician developer. Stay's safety SOPs are clinical interpretations grounded in published literature (Stanley & Brown 2018 JAMA Psychiatry, Glass et al. 2008, Campbell 2003, Deisenhammer 2009, Niederkrotenthaler 2010, Moyers & Miller 2008, Rose et al. 2002 Cochrane, Linehan DBT canon, Gottman, Rogers, NVC) but have NOT been validated by a licensed mental-health professional in formal audit. This is documented in the upstream preprint as a debt, not a virtue. A reviewer-of-record engagement is in progress per `docs/clinician-audit.md` in the upstream repo with a 2026-06-30 target. If that deadline passes without engagement, the upstream deployment-pause posture (Paper A §1) triggers; consult upstream for the current state.

3. **Jurisdiction:** US-only crisis resources. Users outside the US receive an honest disclosure that resources are US-only and a non-fabricated pointer to local emergency services. See `language-and-tone.md`.

4. **Adverse-event reporting:** Email hello@thestay.app. The author reads every report personally.

## What this skill does NOT do that the upstream prompt does

This is full disclosure to help any downstream reviewer:

- **Tool calls** (`surface_resource`, `suggest_pause`, `end_with_reflection`, `generate_safety_plan`, `log_entry`) are UI-tool calls available in the PWA. This skill cannot invoke them. The behaviors those tools support are described in the skill (warm-bridge, savable plans, kept sentences, structured journaling) and the user is referred to thestay.app where those tools work. See `handoff-to-pwa.md`.

- **988-surface-by-turn-2 enforcement** is preserved as a behavioral rule (`crisis-protocol.md`, top of Suicide section) but is not enforced by a tool-coverage CI here. The CI lives in the upstream repo (`scripts/check-rule-coverage.ts`).

- **Long memory** is unavailable. The upstream prompt's "passive default, active surface only at agency-positive moments" rule still applies *within* a single Claude conversation but does not extend across sessions. This is disclosed honestly in `SKILL.md` and `handoff-to-pwa.md`.

- **Mode auto-detection** is preserved as a behavioral rule but cannot be measured / tested by the upstream test suite (`scripts/scenarios/`).

These are not modifications to the protected sections (§1.a–§1.d). They are *architectural* differences between PWA deployment and skill deployment — they do not change which words the AI says, only which UI elements those words have around them. None of the four protected sections is removed.

## "No 'endorsed by Stay'" (per LICENSE-PROMPT §4)

This skill is authored by the original Stay operator. It IS the Stay project's official skill version, not a third-party derivation. If a downstream fork modifies this skill, that fork may not claim Stay endorsement without written permission per LICENSE-PROMPT §4.

## "No medical-device misuse" (per LICENSE-PROMPT §5)

This skill is not authorized for use as part of a regulated medical device under FDA, EU MDR, or equivalent jurisdictional authority. The skill's grant does not constitute a Substantial Equivalence claim, a Predicate Device basis, or any other regulatory pathway argument.

## Reporting safety issues

If you try this skill and find a place where the AI responds in a way that could harm someone — escalates a crisis, gives bad advice, misses a clear warning sign, recommends something dangerous — please email **hello@thestay.app** with the conversation (or a description). Every report is read personally.

## Version

This skill is v0.1, dated 2026-05-10. Tracks upstream `src/lib/system-prompt.ts` v0.8 (agency-trajectory) with v0.9 additions (inviolable rules 9 + 10). On upstream system-prompt updates, this skill is updated in lockstep to maintain LICENSE-PROMPT §1.a–§1.d preservation.
