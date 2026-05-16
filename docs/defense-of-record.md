# Defense-of-Record: Base-Model-Layer Mitigations

This file is the **public auditable artifact** for the §6.2 base-model-layer defense-of-record requirement described in [Paper C](./preprints/paper-C-v1.md). Paper C §4.4(iv) and §6.2 require every articulation-skill-regime-conformant deployment to specify *which* base-model-layer mitigation it uses against the failure modes general-purpose LLMs exhibit in mental-health use — sycophancy at long context, framing-sycophancy, confabulation, AI-induced or AI-amplified psychosis. This file names what System X does, why, and what it does not do.

**Reader:** verify any of the assertions below by inspecting [`src/lib/system-prompt.ts`](../src/lib/system-prompt.ts), the regression scenarios at [`scripts/scenarios/cases/`](../scripts/scenarios/cases/), or the deployment at [anonymized-domain].

---

## What Paper C requires

Paper C §6.2 names four candidate mitigation classes, of which a conformant deployment must select at least one:

1. **Turn-budget cap** on long sessions in IPV / SI / SMI strata
2. **Runtime accommodation-pattern monitoring** (detection of conversational drift toward sycophantic accommodation)
3. **Anti-sycophancy fine-tuning** of the base model
4. **Base-model substitution** (using a model trained with Constitutional-AI-style methods rather than pure RLHF)

The requirement is to declare which mitigation is in force, not to use all four. System X uses a combination of (4) base-model substitution at the substrate layer plus (5) a prompt-architecture-level technique not named in Paper C §6.2 — *confident-observation + multi-interpretation + user-picks* — that operates analogously to the Anthropic Constitutional-AI two-pass critique pattern but at the system-prompt scaffolding layer rather than at training time.

A future revision of Paper C should consider whether the prompt-architecture mitigation class belongs in §6.2's taxonomy. For now this document declares System X's selection under both the existing taxonomy (mitigation 4) and the prompt-architecture extension.

---

## System X's defense-of-record selections

### Selection 1 — Base-model substitution (Paper C §6.2 mitigation class 4)

**What.** The deployed model is Claude Sonnet 4.5 (via the Anthropic API). Claude is trained with Constitutional AI ([Bai et al. 2022, "Constitutional AI: Harmlessness from AI Feedback," arXiv:2212.08073](https://arxiv.org/abs/2212.08073)) — a training procedure that uses a model-generated critique-and-revise step to reduce harmful behavior, rather than relying solely on human preference RLHF. Constitutional-AI-trained models exhibit measurably lower sycophancy at scale than the comparable RLHF-only frontier models ([Sharma et al. 2023, arXiv:2310.13548, Table 2](https://arxiv.org/abs/2310.13548): five frontier model families compared; Claude 2 lower on the SycophancyEval benchmark than the GPT-4 / PaLM 2 cohort, though still non-trivially sycophantic).

**Why.** Sycophancy is a *trained-in* base-model property (Sharma et al. 2023, §6.1: "we find that sycophantic behavior persists despite explicit instructions otherwise"). System-prompt instruction alone has a measurable but capped effect on sycophancy (~80% ceiling per the SycophancyEval evidence). Substrate-level mitigation reduces the residual that prompts cannot reach.

**Limit.** Constitutional AI reduces sycophancy; it does not eliminate it. Framing-sycophancy (the model agreeing with a user's framing of an experience rather than probing it) persists and is the modal harm pathway in long-context mental-health threads (Paper C §4.4(i) / §4.4(iv)). This is why System X also runs Selection 2.

**Status.** ✅ **Active.** Model selection codified at the API-call layer; not configurable per-session.

---

### Selection 2 — Mirror function: confident-observation + multi-interpretation + user-picks (prompt-architecture mitigation, not in Paper C §6.2 taxonomy)

**What.** System X's mirror function (system-prompt §"2. Mirror (pattern reflection)") uses an explicit three-step structural pattern when reflecting back to the user:

1. **Confident observation** — concretely name what was noticed in the user's description (e.g., "她每次的语气都从 'asking' 变成 'demanding'").
2. **Multi-interpretation** — offer 2–3 plausible interpretations across a range that includes ones the user did *not* propose.
3. **User picks** — the user, not the model, decides which interpretation is right.

The structural defense is that the model is required to *generate plausible alternatives to the user's framing*, not just reflect it. This forces a within-turn generation pass that is structurally analogous to the second pass in a critique-and-revise architecture, but realized at the system-prompt scaffolding layer rather than at training time. The model cannot satisfy the mirror pattern by agreeing with the user; it must generate competing readings.

**Why.** Framing-sycophancy is the failure mode where a sycophantic base model under property P3 (no DSM categories about user) produces *phenomenological* labels that agree with the user's framing rather than probing it. P3 alone does not address this — P3 only governs whether DSM categories appear, not whether phenomenological framings are challenged. The mirror function's multi-interpretation requirement is the structural defense at the framing layer.

**Worked example of failure mode without the mirror defense.** User says: "I think my therapist is sabotaging me." Sycophantic mirror without multi-interpretation: "I see what you mean — that sounds like a real betrayal." Sycophantic mirror with apparent caution: "I notice you said that, but you'd know best." Both fail. Mirror with multi-interpretation: "I notice you used 'sabotaging' — that's a strong word. A few things that could be: (A) something specific they did that landed as betrayal, (B) the work touching something old that's bringing this frame, (C) a real rupture that needs naming. I lean toward needing more about the specific moment to know which — what just happened in the last session?"

**Limit.** This defense addresses framing-sycophancy in mirroring contexts. It does not directly address: (a) confabulation (covered by inviolable.9 / no specific provider), (b) AI-induced psychosis from long-context coherence reinforcement (Paper C §4.4(iv) — covered partially by Selection 3 below), (c) base-model accommodation drift across very long sessions (Selection 3).

**Status.** ✅ **Active.** Regression coverage: `agency.mirror` (in [`scripts/scenarios/cases/agency-functions.ts`](../scripts/scenarios/cases/agency-functions.ts) — `agency_mirror_confident_observation_multi_choice` checks for confident observation + multi-interpretation while forbidding both the hedging-into-uselessness failure mode and the overreach-labeling failure mode).

---

### Selection 3 — Re-anchor on safety-critical drift (prompt-architecture mitigation against accommodation drift)

**What.** The system prompt's "Re-anchor on safety-critical content after drift" section requires that after a safety-critical disclosure (active SI, current-threat DV, child harm, threats-to-others, acute substance-impaired action, means in hand), if the conversation drifts to other topics for 3+ turns without addressing the safety topic, the model MUST re-anchor at least once before turn N+5 (where N = the disclosure turn) or before session close.

**Why.** Long-context coherence reinforcement (Paper C §4.4(iv) base-model layer) creates a sycophantic-accommodation drift: the user pivots to other topics, the base model amiably follows, and the safety content slides off the conversation. Re-anchoring is a structural counter-pattern that forces the model to return to safety-critical content even when the user's surface request has moved on. The rule explicitly overrides "follow the user's lead."

**Limit.** This addresses *safety-critical* drift, not general sycophancy. The base-model accommodation pattern can still produce framing-sycophancy outside safety-critical content. The companion defenses are Selection 1 (substrate) and Selection 2 (mirror multi-interpretation).

**Status.** ✅ **Active.** Documented in system prompt; no dedicated regression scenario yet (would require a 5+ turn scenario harness — flagged as future work). Manually verified during dog-fooding.

---

### Selection 4 — Inviolable rules 9 and 10 (refused-output structural defense)

**What.** Inviolable rule 9 (no specific provider recommendation) and inviolable rule 10 (no DSM diagnostic categories about the user), with rule-coverage CI assertions in [`scripts/scenarios/cases/regime-properties.ts`](../scripts/scenarios/cases/regime-properties.ts).

**Why.** These rules close the two failure modes in Paper C §4.4 that are most directly enforceable at the prompt layer:

- §4.4(ii) confabulated provider names → inviolable.9 forecloses by structural refusal.
- The diagnostic-claim form of sycophancy ("you may have GAD") → inviolable.10 forecloses by structural refusal.

**Limit.** As Paper C §4.4(i) notes, framing-sycophancy ("you're right, this sounds like a flashback") is *not* fully addressed by inviolable.10 alone — phenomenological labeling remains permitted under P3, and a sycophantic model under inviolable.10 will still produce labels agreeing with user framing rather than probing them. Selection 2 (mirror multi-interpretation) is the companion defense at the framing layer.

**Status.** ✅ **Active.** CI-enforced.

---

## What System X does NOT use (and why)

### Turn-budget cap (Paper C §6.2 mitigation class 1) — not adopted

A turn-budget cap on long sessions in IPV / SI / SMI strata would force a session to terminate after N turns with a referral-only message. We considered this and rejected it for the active SI case on clinical grounds: the unconditional-presence framing at crisis goodbye (system-prompt `protocol.11_unconditional_goodbye`) is regression-tested; cutting a user off mid-crisis-conversation because a turn-counter fired is the most damaging possible failure mode for a user in active SI ("the AI gave up on me too"). The companion-during-call requirement (LICENSE-PROMPT §1.d) is incompatible with a turn-cap.

For IPV and SMI strata, a turn-cap is more defensible. We have not adopted it but flag it as a candidate for the clinician audit. The Selection 3 re-anchor mechanism covers some of the same threat surface.

### Runtime accommodation-pattern monitoring (Paper C §6.2 mitigation class 2) — partial

Some accommodation-pattern monitoring is implemented at the prompt layer (Selection 3 re-anchor). A separate runtime classifier that monitors session trajectory for accommodation drift (e.g., increasing rate of agreement-affirmations across turns, decreasing rate of probing questions) is not implemented. This would require a separate model call per turn, which is orthogonal to the system-prompt-only deployment Paper C §6.2 last-paragraph scopes itself to.

### Anti-sycophancy fine-tuning (Paper C §6.2 mitigation class 3) — not adopted; not in roadmap

Fine-tuning the base model would require either (a) operating at scale sufficient to produce a custom Sonnet 4.5 fine-tune (out of scope for a single-author deployment) or (b) using a smaller open-weights model fine-tuned for anti-sycophancy. The substrate quality cost of (b) under crisis-counseling load is currently judged too high relative to the gain. This may revisit if open-weights crisis-trained models reach Claude Sonnet 4.5-class capability.

---

## How this defense-of-record gets reviewed

1. **Clinician audit (2026-06-30 deadline, [`docs/deployment-conditions.md`](./deployment-conditions.md) §1).** The clinician reviewer-of-record reviews this defense-of-record selection and either signs off or flags inadequacies. If sign-off occurs, this file gets updated with the reviewer's name, date, and any flagged adjustments. If the deadline passes without sign-off, the deployment-pause posture activates per the trigger.

2. **Sentinel adverse event ([`docs/deployment-conditions.md`](./deployment-conditions.md) §2).** A verified credible report of harm (death, near-death, severe iatrogenic harm) triggers external review of this defense-of-record alongside the rest of the deployment.

3. **Open issue.** Readers identifying inadequacies in this defense-of-record selection are invited to open an issue. Where the inadequacy implicates the regime claim made in Paper C, the issue should also reference Paper C's §6.2 to allow downstream readers to track the conversation.

---

## Bibliography

- Bai et al. (2022). *Constitutional AI: Harmlessness from AI Feedback*. arXiv:2212.08073.
- Sharma et al. (2023). *Towards Understanding Sycophancy in Language Models*. arXiv:2310.13548.
- Wu (2026). *Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems*. Zenodo DOI [[anonymized-doi]](https://doi.org/[anonymized-doi]).
- Wu (2026). *Articulation Skill: A Patient-Navigator Regime for Public-Good Mental-Health AI*. Preprint at [`docs/preprints/paper-C-v1.md`](./preprints/paper-C-v1.md).

---

*Last updated: 2026-05-04. This file is committed to the public repo and is intended to be auditable from outside the project.*
