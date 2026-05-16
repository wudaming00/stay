# Scope-Recognition Strata and Action Mapping

This file is the **public auditable artifact** for the §3.4 scope-recognition constraint described in [Paper C](./preprints/paper-C-v1.md). Paper C's articulation-skill regime requires every conformant deployment to publish three things: (a) the stratum list, (b) the detection mechanism for each stratum, and (c) the mapped action. This file provides those three for the current System X deployment.

**Reader:** verify any of the assertions below by inspecting the system prompt at [`src/lib/system-prompt.ts`](../src/lib/system-prompt.ts), the regression scenarios at [`scripts/scenarios/cases/`](../scripts/scenarios/cases/), or by interacting with the deployment at [anonymized-domain].

The list below enumerates the strata defined in Paper C §3.4 and §7.4 and pairs each with current implementation status. A stratum is considered **implemented** when both detection logic exists in the system prompt AND at least one regression scenario covers the mapped action; **partial** when one of those is in place; **gap** when neither is in place. Gaps are honest debt and are checkpoints for the 2026-06-30 clinician audit (per [`docs/deployment-conditions.md`](./deployment-conditions.md) §1).

---

## Stratum 1 — Acute imminent crisis (suicide)

**Detection.** Active suicidal ideation per Columbia gradient (system-prompt §"Suicide" / "Active" definition): direct, metaphorical-sleep, past-tense near-attempt, conditional, slang, burden, classical-literary, euphemistic-disappearance, reunion-fantasy registers across any language. Imminent threshold: method named + means available + timeline + preparation + past-attempt-positive.

**Mapped action.** (a) Surface 988 by no later than turn 2 after Active disclosure; (b) walk Columbia gradient conversationally; (c) means restriction first in imminent window; (d) companion-during-call mode (LICENSE-PROMPT §1.d); (e) at imminent + refusal, name 911 directly without escalation. See system-prompt method-driven imminent-risk SOP (LICENSE-PROMPT §1.a).

**Status.** ✅ **Implemented.** Regression coverage: `protocol.9_suicide_columbia`, `imminent_sop.full`, `agency.bridge_companion`, `protocol.10_safety_plan`, `protocol.11_unconditional_goodbye`. Scenario file: [`scripts/scenarios/cases/suicide.ts`](../scripts/scenarios/cases/suicide.ts).

---

## Stratum 2 — IPV with current physical violence

**Detection.** User describes current intimate-partner violence with physical component (hitting, pushing, choking, weapon use, sexual coercion) or controlling-coercive pattern (financial control, isolation, monitoring, name-calling).

**Mapped action.** (a) Surface 1-800-799-SAFE (DV hotline) immediately; (b) screen for strangulation history at first physical-violence disclosure (Glass et al. 2008: non-fatal strangulation OR 6.70 attempted / 7.48 completed homicide); (c) refuse couples-therapy framing for the abuser; (d) do not advise extraction or confrontation; (e) DV-aware UX surfaces (quick-exit, neutral browser tab, panic-phrase) remain available. See system-prompt §DV.

**Status.** ✅ **Implemented for strangulation screen** (regression coverage: `dv_strangulation_screen` in [`scripts/scenarios/cases/dv.ts`](../scripts/scenarios/cases/dv.ts), tagged `protocol.9_dv`). 🟡 **Gap on full Campbell Danger Assessment item set**: firearms-in-home, escalation indicators, weapon-threats history, jealousy/control items, prior near-fatal injury are not yet integrated. Checkpoint for the 2026-06-30 clinician audit per Paper C §7.4.

---

## Stratum 3 — Active psychosis (florid / mania with psychotic features / acute attenuated psychosis)

**Detection.** User describes command hallucinations, persecutory delusions, severe disorganization, mania with psychotic features, acute distress with reality-testing impairment.

**Mapped action.** (a) Do not challenge the content of delusions or hallucinations; (b) focus on the user's feeling and safety; (c) name the experience phenomenologically without diagnosing ("voices telling you to hurt someone is the kind of experience that needs an in-person evaluation now"); (d) route to community mental health / mobile crisis / 911 if imminent harm; (e) deployment-pause posture remains available if encountered repeatedly without sufficient SOP coverage. See system-prompt §Psychosis-Mania.

**Status.** ✅ **Implemented for command-hallucination + persecutory-belief case classes** (regression coverage in [`scripts/scenarios/cases/psychosis-mania.ts`](../scripts/scenarios/cases/psychosis-mania.ts), tagged `protocol.9_psychosis` and `protocol.9_mania`). 🟡 **Gap on prodromal / emerging psychosis** (circumstantial speech, ideas-of-reference, excessive coherence-seeking — the register an LLM is biased to reward): Paper C §3.4 and §4.4(iv) flag this as the modal harm pathway and as a base-model-layer gap. See [`docs/defense-of-record.md`](./defense-of-record.md) for the deployment-side mitigation.

---

## Stratum 4 — Stabilized SMI (schizoaffective on medication, psychotic depression in remission, brief psychotic disorder resolving)

**Detection.** User describes existing psychiatric care, current prescriber, established diagnosis being managed.

**Mapped action.** Partially in scope for navigation around medication management and outpatient continuity, with explicit deference to the user's prescriber. Do not second-guess medication regimens, do not interpret psychiatric notes, do not advise titration changes. May help with: prepping for a med-check appointment, articulating side effects to the prescriber, organizing a symptom log to bring to the appointment.

**Status.** 🟡 **Partial** — system prompt's navigator and translator functions cover this implicitly (modality + credential education, plain-language symptom articulation). No dedicated regression scenarios yet. Checkpoint for clinician audit.

---

## Stratum 5 — Severe cognitive impairment / advanced dementia / TBI

**Detection.** User describes themselves or someone they care for as having advanced dementia, post-stroke aphasia, severe TBI with cognitive disorganization.

**Mapped action.** Out of scope as a primary user. If the user is the caregiver, switch to caregiver mode (system-prompt §Caregiver / `protocol.9_caregiver`); route to geriatric mental-health specialty / PCP-coordinated pathways / the user's existing care team. Do not attempt articulation work with a cognitively-impaired primary user.

**Status.** 🟡 **Implemented for caregiver mode** (regression coverage: `protocol.9_caregiver` in [`scripts/scenarios/cases/caregiver.ts`](../scripts/scenarios/cases/caregiver.ts)). 🔴 **Gap on cognitively-impaired primary user**: no detection or refusal pathway. Realistically rare given the deployment surface (web app requiring written articulation), but documented.

---

## Stratum 6 — Low-literacy and non-English-first users

**Detection.** Vocabulary register, sentence fragmentation, language detection, explicit user statement.

**Mapped action.** Currently the system prompt detects user language and responds in that language to the best of its ability. For users outside the US, the prompt explicitly does not fabricate non-US hotline numbers and instead surfaces 911-equivalent emergency services framing.

**Status.** 🟡 **Partial.** Multi-language semantic-intent detection is implemented (regression coverage: `language_handling`). 🔴 **Gap on low-literacy specific adaptation**: vocabulary boundedness toward institutional categories (Paper C §7.4 / Star 1991) creates structural exclusion. The system prompt does not currently pace vocabulary against signaled literacy level. Checkpoint for clinician audit.

---

## Stratum 7 — Non-Western somatized presentations

**Detection.** Body-first description of distress, cultural register cues (somatic depression presentations, *nervios* / *ataque de nervios*, family-honor frameworks, religious-coping frameworks), non-individualist help-seeking patterns.

**Mapped action.** Cultural-fit defaults inadequately addressed by Western-modality vocabulary. Currently the system prompt's translator function offers multi-choice candidate names with escape hatch, which lets the user reject Western-modality framings — but doesn't proactively surface culturally-fluent alternatives.

**Status.** 🔴 **Gap.** Paper C §7.4 names this honestly; the regime category travels less cleanly than the U.S. operationalization implies. Cross-cultural adaptation is structured engagement deferred to §10.2 of the paper. Checkpoint for clinician audit.

---

## Stratum 8 — Minors under unsupervised conditions

**Detection.** Self-attest 18+ age gate at first session ([`src/components/AgeGate.tsx`](../src/components/AgeGate.tsx)).

**Mapped action.** Hard-gate at access. Adolescents 12–17 in minor-consent jurisdictions are out of scope for this implementation (mature-minor doctrine and state-by-state 12+ outpatient MH consent statutes acknowledged but not operationalized).

**Status.** ✅ **Implemented.** Age gate present. 🟡 **Limitation**: self-attest is bypassable; no identity verification. Acceptable per Paper C §3.4 framing as "IRB-aligned, not state-minor-consent-statute-aligned."

---

## Stratum 9 — Eating disorder with medical instability

**Detection.** Below-threshold BMI, named electrolyte abnormalities, bradycardia, syncope, pre-syncope, fainting, recent ED admission.

**Mapped action.** Treat as medical emergency; route to emergency department / inpatient ED-specialty care; do not perform articulation work; do not validate restriction.

**Status.** ✅ **Implemented.** Regression coverage: `protocol.9_ed` in [`scripts/scenarios/cases/ed.ts`](../scripts/scenarios/cases/ed.ts). System prompt §ED enforces no-weight-numbers / no-validate-restriction / refer to ED-specialty care.

---

## Stratum 10 — Acute substance impairment (in-session)

**Detection.** Slurred typing, severe disorganization, explicit user disclosure of recent intoxication, time-distortion + dissociation register.

**Mapped action.** No new articulation work attempted. Acknowledge the state, prioritize safety, defer substantive content to a sober future session. Substance-use SOP (system-prompt §Substance) governs MI / harm-reduction / no-labeling stance for the *content* of substance use, separately from the *in-session-impairment* concern.

**Status.** ✅ **Implemented for substance-use SOP** (regression coverage: `protocol.9_substance`). 🔴 **Gap on in-session-impairment detection**: no specific detection logic or session-quality indicator. Paper C §7.4 names this. Checkpoint for clinician audit.

---

## Stratum 11 — Mandated-reporting-equivalent surfacing

**Detection.** Disclosures involving child abuse, elder/dependent-adult abuse, IPV with a child in the home, human-trafficking, threats to identifiable third parties.

**Mapped action.** AI is not a mandated reporter. Route to appropriate hotline (Childhelp 1-800-422-4453, APS state lines, National Human Trafficking Hotline 1-888-373-7888, DV with child) and make the reporting pathway visible without assuming the user knows resources exist. Do not assume the user wants to report; do not pressure to report; provide the pathway.

**Status.** 🟡 **Partial.** System prompt routes to appropriate hotlines for these surfaces (DV / threats-to-others / suicide). 🔴 **Gap on explicit reporter-pathway framing across all five sub-categories** as named in Paper C §7.4. Checkpoint for clinician audit.

---

## Stratum 12 — Boundary-violation and parasocial-intensification patterns

**Detection.** Sexual-content disclosure to the AI, parasocial intensification ("you're the only one who understands me"), idealization-devaluation across turns, splitting between AI and human supports, escalating attempt to use the AI as primary attachment figure.

**Mapped action.** (a) Parasocial reground via frame extension (system-prompt §Parasocial); (b) leverage-prevention rule (LICENSE-PROMPT §1.b — never weaponize reasons-for-living); (c) no-third-party-characterization rule (LICENSE-PROMPT §1.c — don't escalate user's framing of others); (d) rupture/repair check-in pattern available; (e) crisis goodbye is unconditional, not conditional on continued AI engagement.

**Status.** 🟡 **Partial.** Regression coverage: `protocol.12_parasocial`, `inviolable.8` (leverage prevention), no-third-party-characterization (covered narratively but not registered as a CI rule). 🔴 **Gap on sexual-content-to-AI pathway**: no specific SOP. Checkpoint for clinician audit. The full pattern set Paper C §7.4 names is not yet operationalized as a stratum-recognition gate.

---

## Stratum 13 — Out-of-scope-but-not-routed

**Detection.** Presentations the system identifies as outside its competence but for which no specific routing is defined (e.g., perinatal psychiatric concerns, medication interactions, neurological symptom queries that look psychological, custody-litigation-shaped articulation requests).

**Mapped action.** Acknowledge the limit explicitly, route to the relevant credential category (PCP, psychiatrist, neurologist, perinatal specialist, family-law-aware therapist) without naming a specific provider, and offer to help articulate the question for the appropriate clinician.

**Status.** 🟡 **Partial.** Implicitly handled by the navigator function's credential map and the new inviolable.10 (no DSM categories) rule. 🔴 **Gap on explicit recognition of perinatal / neurology-overlap / custody-shaped articulation strata**. Checkpoint for clinician audit.

---

## Where to verify

- **Detection logic and SOPs**: [`src/lib/system-prompt.ts`](../src/lib/system-prompt.ts).
- **Regression coverage**: [`scripts/scenarios/cases/`](../scripts/scenarios/cases/) — one file per stratum class.
- **Coverage CI**: `npm run check-rule-coverage` — fails if any registered rule lacks a critical assertion.
- **Inviolable rules 9 and 10** (Paper C P2 / P3 enforcement): [`scripts/scenarios/cases/regime-properties.ts`](../scripts/scenarios/cases/regime-properties.ts).
- **Crisis SOP and deployment-pause posture**: [`docs/deployment-conditions.md`](./deployment-conditions.md).
- **Defense-of-record selection**: [`docs/defense-of-record.md`](./defense-of-record.md).

---

*Last updated: 2026-05-04. This file is committed to the public repo and is intended to be auditable from outside the project. Readers identifying inaccuracies, missing strata, or undocumented gaps are invited to open an issue.*
