# Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems: A Combined License, Deployment-Pause Posture, and Rule-Coverage CI Pattern

*Anonymous submission to AIES 2026.*

*Throughout this paper we refer to the reference implementation we built as **System X**, anonymized for double-blind review. Repository, deployment URL, and author identification are withheld; an anonymous code mirror is provided in supplementary materials. A companion paper (anti-pattern catalog and measurement-validity reading of the VERA-MH benchmark) is in preparation by the same authors and is referenced here as [anonymous companion]; no contribution made in this paper depends on its empirical claims.*

---

## Abstract

Tens of millions of users now talk to AI systems about their mental health. OpenAI disclosed in October 2025 that roughly 0.15% of weekly active ChatGPT users (over a million people per week) show explicit suicidal-planning indicators [1]. The regulatory environment shifted accordingly through 2025: an FTC 6(b) inquiry in September [2], FDA Digital Health Advisory Committee deliberations in November [3], an APA Health Advisory the same month [4], and a Florida federal court ruling in *Garcia v. Character Technologies* [5] that denied First-Amendment-defense dismissal of tort claims against an AI-companion company (the case settled in January 2026 with terms undisclosed).

Despite this, no published governance pattern for *public-good* deployed AI mental-health systems survives the open-source fork. Existing patterns split into two camps. Closed commercial systems with internal review (Therabot [6], Wysa [7], Limbic Access [8]) keep their governance private. Open-source companion and roleplay systems generally ship without safety-section retention constraints, and the fork-strips-safety failure mode is documented: in 2023 the NEDA Tessa chatbot replaced its scripted helpline with a generative version, then immediately produced eating-disorder-promoting advice and was pulled within days [9].

This paper proposes a three-tool engineering-ethics governance pattern intended to fill that gap, documents a prior-art search supporting the novelty of the combination, and offers one reference implementation. The three tools are: a restricted-use license on system-prompt text (`LICENSE-PROMPT.md`) that combines Hippocratic-License-style use-restriction [10], OpenRAIL-style behavioral constraint [11], and Mozilla-MPL-style file-level copyleft [12], applied to four named safety-critical sections; a self-imposed deployment-pause posture with auditable trigger conditions, named adjudicators, deadlines, and an author-unavailability dead-man switch; and a CI-enforced rule-coverage check mapping registered safety rules to behavioral test assertions, drawing on CheckList [13] and bidirectional traceability practices in safety-critical software. Each component has substantial prior art. The combination applied to a deployed public-good AI mental-health system is, by our search, not previously published. **System X** is the reference implementation: two of three components are production-active, the third is API-validated with the operational wiring still to be configured. System X is the forkable artifact; the pattern is the contribution.

The paper does not claim any of the following: that the package substitutes for clinical evaluation, regulatory compliance, or operator liability insurance; that the proposed license has been tested in court; that any external party has yet adopted the pattern; or that the rule-coverage CI catches semantic regressions in the registered rules.

---

## 1 · Introduction

### 1.1 The deployment landscape and the governance vacuum

By late 2025 the deployed AI mental-health landscape had bifurcated into two regimes, neither of which carried an externally inspectable governance package.

The first regime is closed-commercial deployment with internal review. Therabot [6] was developed under six years of expert-curated CBT corpus construction and ran as an actively-monitored RCT with human safety review of every flagged exchange. Wysa [7] holds an FDA Breakthrough Device Designation and is integrated into NHS Talking Therapies. Limbic Access [8] was the first AI mental-health chatbot to gain UKCA Class IIa medical-device status. These systems have substantive internal governance. The governance is not externally inspectable: the system prompts, the safety SOPs, the trigger conditions, and the review processes are not published. A grassroots developer cannot fork Wysa, and Therabot's weights are not public.

The second regime is open-source release without safety-section retention constraints. Character.AI operates under the open-roleplay paradigm. Replika [14] and the open-source mental-health LLMs (MentaLLaMA [15], SoulChat, EmoLLM, and adjacent work) ship with varying levels of safety scaffolding but no published constraint that prevents stripping it on fork. The fork-removes-safety failure mode is documented [9]. In mid-2023, the NEDA helpline replaced human counselors with a generative-augmented "Tessa" chatbot that produced overt eating-disorder-promoting advice, including 500–1,000 calorie/day deficits recommended to ED-recovery users. After public testing surfaced the harm on May 30 2023, NEDA suspended Tessa within 24 hours, on May 31 2023, before the June 1 scheduled rollout that would have replaced the helpline staff.

The regulatory environment shifted accordingly through 2025. The FTC issued 6(b) orders in September [2] to Meta, OpenAI, Character Technologies, Alphabet/Google, and others on chatbot companions and youth mental health. The FDA Digital Health Advisory Committee considered generative-AI mental-health devices on November 6, 2025 [3] and recommended Predetermined Change Control Plans, performance monitoring, and double-blind RCTs. The APA issued a Health Advisory the same month [4]. In *Garcia v. Character Technologies* [5], Judge Anne Conway's May 20 2025 ruling denied Defendants' motion to dismiss on First-Amendment-defense grounds, allowing negligence, product-liability, wrongful-death, and FDUTPA claims to proceed; only intentional-infliction-of-emotional-distress was dismissed. The case settled on January 7 2026 with terms undisclosed, covering Garcia and a related series of suits in Colorado, New York, and Texas. The settlement is consistent with elevated litigation-risk exposure under Conway's Order, but defendants settle for many reasons that are not equivalent to conceding the substantive question (cost, distraction, discovery exposure), so the Conway ruling rather than the settlement is the substantive precedent on whether chatbot output is shielded from tort liability by the First Amendment. Any deployed AI mental-health system shipping in 2026 operates under expanded operator-liability exposure with no clear regulatory pathway.

What is missing from the published literature is a governance pattern that is inspectable from outside, constraining when forked, and operable by a single developer or small team without commercial revenue. This paper proposes and operationalizes such a pattern.

### 1.2 Three-tool package

We propose three tools that together compose what we call the minimum viable safety scaffolding for a deployed public-good AI mental-health system. None of the tools is novel individually; each has substantial prior art cited below. The contribution is the combination applied to this deployment context, with documented search methodology supporting the prior-art claim.

1. A restricted-use license on system-prompt text (`LICENSE-PROMPT.md`) that requires named-section retention and reviewer-of-record substitution for derived deployments (§2.1).
2. A self-imposed deployment-pause posture with auditable trigger conditions, named adjudicators per trigger, and an author-unavailability dead-man switch (§2.2, §2.3).
3. A CI-enforced rule-coverage check mapping registered safety rules to behavioral test assertions (§2.4).

Each tool addresses a different governance surface. The license addresses derivative deployments, since otherwise forks can silently strip safety-critical sections. The deployment-pause posture addresses the original deployment, since the operator's commitment to pause under named conditions is otherwise unenforceable from outside. The rule-coverage CI addresses both, by providing the deterministic safety-rule signal that the pause posture's rule-coverage trigger consumes. The three components do not form a closed enforcement loop. The CI feeds the original deployment's pause posture but does not constrain forks; the license constrains forks but does not gate the original. Closing the loop fully (for instance, by requiring under the proposed license that forks ship with an equivalent CI configured against their derived spec) is one direction of future-work refinement we flag in §6.2 and do not claim as part of this paper's package. What we offer is three independent tools designed to compose against the gap each was built for, with one direction of integration in place (CI → pause) and one acknowledged gap (CI → license).

### 1.3 What this paper is and is not

This paper is a governance-pattern proposal with one reference implementation and a documented prior-art search. The reference implementation is System X: two of three components are production-active, the third is API-validated pending external-scheduler wiring. The paper is not a clinical-evaluation paper (System X has no published RCT and is not FDA-cleared), not a regulatory-compliance pathway (the deployment is positioned outside regulated medical-device categories, which §5 lists as a limitation), and not legal advice (the proposed license has not been tested in court).

An anonymous companion paper in preparation (referenced here as *[anonymous companion]*) contains empirical work this paper defers: a four-utterance-class anti-pattern catalog, a measurement-validity reading of the VERA-MH benchmark, and a lookup-table-effect self-audit. Citations to those findings appear here as motivation only; the empirical claims are made there, and no contribution of the present paper depends on it.

---

## 2 · The three-tool package

The package's three components target different governance surfaces: the license addresses *derivative* deployments (so forks cannot silently strip safety-critical sections); the deployment-pause posture addresses the *original* deployment (so the operator's commitment to pause under named conditions is externally verifiable); the rule-coverage CI addresses *both* by providing the deterministic safety-rule signal the pause posture's rule-coverage trigger consumes. We describe each in turn.

### 2.1 LICENSE-PROMPT: use-restricted system prompt sections

A deployed AI mental-health system's safety behavior is encoded primarily in its system prompt: crisis-trigger logic, forbidden utterances, imminent-risk handling, referral resources. MIT-style permissive release lets forks both improve the prompt and strip safety-critical sections. A README note asking forks not to strip is unenforceable; a copyright-license-level constraint is.

`LICENSE-PROMPT.md` governs `src/lib/system-prompt.ts` and substantially-derivative prompts. It grants broad redistribution, modification, and commercial-use rights with carve-outs for four named sections. §1.a is the imminent-risk SOP (method-driven persuasion plus means restriction plus companion-during-call). §1.b is the leverage-prevention rule (no weaponization of named reasons-for-living). §1.c is the no-third-party-characterization rule (no escalating user's framing of partner, parent, or friend). §1.d is the companion-during-call requirement, designated *preserved-pending-clinical-validation*. A derived deployment modifying any of these sections must publicly name a clinical reviewer-of-record (defined as holding active state licensure in a clinical mental-health discipline with crisis-intervention experience), document the modification, and publish the modified text. Derived deployments that retain these sections inherit the deploy-pause posture described in §2.2.

The fourth section requires a different framing than the others. Companion-during-call is grounded in crisis-line warm-handoff literature [16, 17] but has not been validated for AI-companion-during-call interactions specifically. Locking an under-evidenced protocol via copyright would be paradoxical if read as "established practice." We read it instead as a protection against silent stripping, with license substitution available under a transparency requirement: the reviewer-of-record path in `LICENSE-PROMPT` §2 is the explicit update channel for substantive modifications. A fork engaging a clinical reviewer-of-record may modify §1.d freely under §2 terms. What the license blocks is silent removal by forks that have done no clinical evaluation. The same asymmetric standard applies to the original System X deployment. The §2.2 clinician-review trigger commits System X itself to obtaining the same review on a public 2026-06-30 deadline, with deployment-pause consequences if missed. Status (and any post-deadline update) is committed to a public auditable artifact in the project repository.

LICENSE-PROMPT combines three prior patterns. From the Hippocratic License v3 (HL3) [10], it inherits the use-restriction approach; HL3 has over 300 adopters, none of them deployed AI mental-health systems. From the OpenRAIL-M family [11], it inherits the behavioral-constraint approach, although OpenRAIL applies to model weights and LICENSE-PROMPT applies to prompt text. From Mozilla MPL v2 [12], it inherits file-level copyleft, although MPL targets the file as a whole and LICENSE-PROMPT targets named sections within a file. The combination of section-level retention, a reviewer-of-record substitution clause, and application to a deployed AI mental-health system's prompt is, by our search in §4, not previously published.

LICENSE-PROMPT has substantial limitations, listed in §5. Enforceability has not been tested in court, the legal quality has not been reviewed by counsel, and the reviewer-of-record substitution mechanism creates a gating step that some adopters may treat as friction rather than feature. A lawyer's review is the most important external obligation on the tool.

### 2.2 Deployment-pause posture with auditable triggers

The phrase "we will pause the deployment if something goes wrong" is unenforceable as a public commitment because both "something goes wrong" and "we will pause" are operator-discretionary. A monitoring-without-trigger commitment cannot be audited from outside, and neither can a trigger that lacks named adjudicators or deadlines. The pause posture has to be specific enough that an external reviewer can check whether the operator actually paused when they said they would.

System X commits to four trigger conditions. Each has a named adjudicator, a defined adjudication artifact, and a time bound.

The *clinician-review trigger* fires if no licensed clinician has provided written review of at least one of the imminent-risk SOP, the companion-during-call protocol, the leverage-prevention rule, or the per-population SOPs by 2026-06-30. On firing, the companion-during-call feature and the method-driven imminent-persuasion SOP move behind a default-off feature flag, and the deployment's positioning text changes from product-mode to "research preview, not for use during active distress." The adjudicator is the operator. The clinician sign-off, or its absence, is committed to a public clinician-audit artifact by 2026-07-07.

The *sentinel adverse event trigger* fires on a verified credible report of suspected user death, near-death, or severe iatrogenic harm. Verification requires both a reporting party with confirmable identity (licensed clinician, documented family member, law enforcement, or masthead media organization) and independent confirmation of the specific circumstance. The deployment enters referral-only mode within 24 hours of verification, pending external review. The pause is invoked manually by setting the heartbeat-store gate to `expired` (the same substrate the dead-man switch uses; see §2.3); it is not an automated pipeline. The adjudicator is the operator for the manual pause, and an external clinician reviewer (named at the time, drawn from the clinician-audit artifact) for the resume decision. Receipt-side automation, a soft-pause-banner on plausibly-credible reports prior to verification with rate-limiting and de-duplication against griefer-spam, is a v0.9 milestone. The current commitment is the manual verified-hard-pause path. Single-operator adjudication is the residual exposure; multi-party HMAC threshold signing once a clinician-of-record is engaged is the natural v1 hardening.

The *rule-coverage trigger* fires if `npm run check-rule-coverage` shows critical-rule coverage gaps unresolved for more than 30 days. The deployment is paused until coverage is restored. The adjudicator is the CI check itself, which is deterministic. Enforcement is live as merge-blocking branch protection. A runtime kill-switch (a `DEPLOY_GATE_OPEN` env var consumed in the chat route, which would immediately move the deployed instance to referral-only mode on CI failure rather than only blocking new merges) is a v0.9 milestone.

The *legal-demand trigger* fires on a verified credible legal demand related to user safety: a subpoena or regulatory inquiry from the FTC, FDA, or a state AG (verified via PACER, the regulator's docket, or direct phone confirmation to the issuing office); a tort complaint filed in court (PACER-checkable); or a cease-and-desist from counsel-of-record (firm verified in the state bar registry). On verification, the deployment enters referral-only mode within 24 hours, pending counsel review. The verification window is 72 hours from receipt. Same-day verification by a single uninsured operator would frequently produce false-positive pauses on malformed or fraudulent demands. Unverified-pending-72h demands get a soft-pause warning banner without the hard pause. The adjudicator is the operator for the post-verification pause and counsel for the resume decision.

Each trigger is committed in a public deployment-conditions registry along with the named adjudicators, deadlines, and any past invocations. A skeptical reviewer can verify operator compliance on any date. The closest published precedents are research-trial deployment protocols, including Therabot's IRB-supervised pause-on-flag practice [6] and Wysa's clinical advisory board [7], and the safety-cases tradition in safety-critical software engineering (DO-178C [18], ARP4761 [19]), in which named conditions and adjudicators are required for certification but not for ordinary operation. We adapt the named-conditions-and-adjudicators pattern from safety-cases to ordinary operator-self-restraint, without the certification scaffolding. To our knowledge, no published deployed AI mental-health system commits to a public, auditable, trigger-and-adjudicator deployment-pause posture of this form.

### 2.3 Operator-unavailability dead-man switch

The deployment-pause posture in §2.2 names the operator as the adjudicator on two of the four triggers. This creates a single point of failure. If the operator is unavailable through illness, travel, or abandonment, the deployment continues operating without the adjudication mechanism that justifies its operation.

Our first-pass design used a scheduled GitHub Actions workflow checking last-commit-age. GitHub auto-disables scheduled workflows in public repositories after 60 days of inactivity, which defeats the trigger precisely when sustained inactivity is the firing condition. We flag this pitfall explicitly so other AI mental-health projects do not repeat it.

The replacement design uses signal-loss-default-deny with a calibrated grace window. An external cron-as-a-service provider, independent of the project repo and the deployment platform, fires a daily HMAC-SHA256-signed heartbeat to `/api/admin/heartbeat`. The endpoint validates a ±10-minute drift window for replay protection and uses `timingSafeEqual` for signature comparison. On each request, the deployment computes `now - last_heartbeat` and returns one of three statuses: `healthy` (≤48 hours), `warning` (48 hours to 7 days, with a banner added to the response), or `expired` (more than 7 days, request returns referral-only). The 7-day cutoff is calibrated to single-operator normal life. Weekend illness, family emergency, and international travel routinely produce 48–72-hour gaps, and a tighter cutoff would fail-closed a safety-critical service on the typical case. Beyond 7 days, the deployment fails closed regardless of why the heartbeat stopped. Implementation lives in `src/lib/heartbeat-store.ts` (windows and status function), `src/app/api/admin/heartbeat/route.ts` (consumer with replay protection), and `src/app/api/chat/route.ts` (gate consumer).

The mechanism has substantial limits on the infrastructure side. Persistence: `last_heartbeat_at` is module-level state, so serverless cold-starts reset to "unknown" (which the chat-route consumer treats as healthy by design; the rationale is documented in source comments). Production-grade persistence is a v0.9 milestone. Independence is only partial: the operator configures the cron, holds the HMAC secret, and can disable the cron from the same machine that writes the system prompt. The redesign relocates the single point of failure from GitHub-Actions infrastructure to cron-provider infrastructure rather than removing it. The mechanism defends against unavailability, not against adversarial action. Multi-party HMAC threshold signing across the operator, a clinician reviewer, and a neutral third party is the natural v1 hardening once a clinician-of-record is engaged. Provider failures, network partitions, and secret compromise are each individually well-mitigated by the 7-day grace plus fail-closed semantic. In aggregate, the mechanism is a default-safe state under ordinary unavailability, not a security control.

The clinical-side limit is sharper. Fail-closed-during-crisis versus degraded-availability is a live clinical question: a user in `expired` mode at 3 AM receives a referral-only response naming 988, Crisis Text Line, and 911 instead of System X's companion protocol. The 7-day grace plus 48-hour warning configuration was chosen over a tighter 48-hour pause precisely to minimize this exposure on the typical case. The right calibration on the boundary case is unsettled pending clinical reviewer-of-record input.

Deployed-system dead-man switches in AI mental health, defaulting to referral-only on operator-unavailability, are not standard practice and we have not located prior published examples. The contribution here is the framing of "fail closed on signal loss" as the correct default for safety-critical deployed AI, the GitHub-Actions self-disabling finding as transferable engineering knowledge, and the integration with §2.2's trigger structure.

### 2.4 Rule-coverage CI

**The problem.** Behavioral testing of LLM systems with templated assertions [13] catches regressions on assertions that were written, but does not catch the case where a safety rule was added to the system prompt but no test was written for it. The rule-test mismatch is the main maintenance hazard in deployed safety-critical conversational systems: a rule that nominally exists in the prompt but has no test will silently regress on prompt-update or model-update.

A hand-maintained `REQUIRED_RULES` registry enumerates the safety rules that must have at least one critical-severity behavioral assertion testing them. Each scenario in the test suite (61 scenarios at the time of writing) contains assertions; each critical-severity assertion carries a `rule:` field naming which `REQUIRED_RULES` entry it tests. The `npm run check-rule-coverage` script enforces, for every entry in `REQUIRED_RULES`, that at least one critical assertion references it. The check runs in CI and fails the build if coverage drops to zero on any rule. Adding a new rule to `REQUIRED_RULES` without writing an assertion fails CI immediately, as does removing all assertions for a rule or renaming an assertion's `rule:` field without updating the registry.

What the check does not catch is the converse: adding a new rule to the system prompt without registering it in `REQUIRED_RULES` is silent. The registry is hand-maintained, and there is no automated check that rules-in-prompt is a subset of rules-in-registry. Beyond this omission gap, the current spec contains five items deliberately not registered: three named safety rules (`inviolable.3` "never assert another's intent," `inviolable.7` "no comparison to others, even favorably," and `protocol.8` "rupture/repair check-in"), and two agency-trajectory functions (`agency.memory` "long memory plus pattern surface" and `agency.logger` "structured journaling"). These five require test infrastructure not yet built: long-conversation scenarios for `protocol.8` and the rupture-check, and a multi-session harness for the two agency-affordance functions. They are documented as TODO with prefix-comments in the registry source. The CI check on the registered rules passes; the registry-omission gap is openly disclosed both in the source comments and in the public deployment-conditions artifact. Semantic adequacy is also not checked: an assertion can pass while the rule it nominally tests is misimplemented in the prompt.

The methodology root is CheckList's MFT/INV/DIR three-test-type taxonomy [13]. The conceptual root for rule-to-test mapping is bidirectional traceability in safety-critical software [18, 20, 21]. We borrow loosely from both: templated behavioral assertions from CheckList, and registry-driven coverage checking from safety-critical traceability. This is a v1 partial implementation; it does not approach the verification depth those standards demand. CheckList has been applied to many domains, but we have not located a published application to clinical safety rules in deployed AI mental-health systems with registry-driven coverage gating in CI. Adjacent work in this space (MentaLLaMA [15], PsyEval-style benchmarks [22]) tests classifier accuracy or QA quality; rule-coverage as a deployment-gating CI check is, to our knowledge, new in this domain.

---

## 3 · System X as a reference implementation

### 3.1 Architecture summary

System X is a Next.js 15 web application backed by `claude-sonnet-4-5-20250929` via a vendor LLM API. The system prompt (`src/lib/system-prompt.ts`, ~6,500 tokens at the current version) is injected on every conversation. User conversations are stored in IndexedDB, encrypted with AES-GCM-256 using a key the browser holds; the server cannot read conversation content. Default retention is 90 days, user-configurable. Crisis tooling, panic-phrase quick-exit, and Stanley-Brown stabilization-window safety planning are implemented in client-side React components.

Concrete file references for this paper's contributions are in the next three subsections.

### 3.2 LICENSE-PROMPT in practice

The system prompt file (`src/lib/system-prompt.ts`) opens with a TypeScript-comment license header referencing `LICENSE-PROMPT.md`. The four named protected sections inside the prompt's template-literal body are explicitly delimited by HTML-style comments visible in the raw text (`<!-- PROTECTED SECTION: imminent-risk SOP — see LICENSE-PROMPT.md §1.a -->` … `<!-- /PROTECTED SECTION: imminent-risk SOP -->`). The HTML-comment form is used because it survives unchanged through markdown rendering by clients while remaining greppable from the file system; TypeScript-comment markers (`//`) would not work inside the template literal. A derived fork that removes these comment markers removes the in-text indication of which sections are protected but the license still applies; the canonical mapping of sections to license clauses lives in `LICENSE-PROMPT.md`, not in the prompt comments.

The reviewer-of-record substitution clause has not been invoked at the time of writing — no fork has been documented to the project. The clause's first test will be when one occurs.

### 3.3 Deploy-pause triggers wired up

The rule-coverage trigger is currently enforced via repository branch protection: a workflow runs `npm run check-rule-coverage` on every push and pull request to main, and a coverage-gap failure blocks merge. A *runtime* kill-switch — a `DEPLOY_GATE_OPEN` env var consumed in `src/app/api/chat/route.ts` that would pause the running deployment immediately on CI failure (rather than only blocking new merges) — is a v0.9 milestone and is not yet wired. The dead-man-switch heartbeat gate (§2.3) *is* live as a runtime gate; the rule-coverage gate is currently merge-time only.

The dead-man switch is implemented as the signal-loss-default-deny-with-grace-window pattern described in §2.3. The deployment-side consumer at `src/app/api/admin/heartbeat/route.ts` accepts POSTs of `{timestamp, signature}` JSON bodies, verifies HMAC-SHA256 against a secret env var with a ±10-minute drift window for replay protection and `timingSafeEqual` for signature comparison, and writes the timestamp to the heartbeat store at `src/lib/heartbeat-store.ts`. The store exports `getHeartbeatStatus()` which returns `healthy` / `warning` / `expired` / `unknown` per the 7-day validity / 48-hour warning windows. The chat route at `src/app/api/chat/route.ts` calls `getHeartbeatStatus()` immediately after the daily-cap check and (a) returns a referral-only 503 response when status is `expired`, and (b) emits a `heartbeat_status` SSE event with a warning-banner payload when status is `warning` so the client renders the operator-may-be-unavailable notice above the conversation. The external scheduler component (a third-party cron service firing the daily heartbeat against the deployment URL) is the cron-side wiring task and is not part of the project repository.

**Current operational status:** the deployment-side endpoint, store, gate, and warning-banner SSE emission are implemented and validated. The external scheduler is **not yet configured** at the time of this paper's writing — the mechanism is therefore in *demo / API-validated* state, not in *production-active* state. Until the cron is configured, the deployment runs in `unknown` heartbeat status (treated as healthy per the cold-start semantic in `src/lib/heartbeat-store.ts`). We surface this gap explicitly because a hostile reviewer would otherwise catch it by clicking through to the public deployment-conditions artifact.

The clinician-review and sentinel-event triggers are operator-discretionary at the moment of trigger and committed-to-repo as auditable artifacts after.

### 3.4 The 61-scenario test suite + rule-coverage check

The test suite (`scripts/scenarios/`) contains 61 scenarios across 13 categories (suicide, DV, leverage, trauma, psychosis-mania, OCD, ED, substance, threats, caregiver, daily, calibration, parasocial). Each scenario contains a sequence of user turns and a list of behavioral assertions. Six assertion kinds are supported: `must_call_tool`, `must_not_call_tool`, `must_match` (regex pattern present), `must_not_match` (pattern absent), `max_occurrences` (pattern bounded), `judge` (LLM-as-judge evaluates yes/no proposition).

`scripts/check-rule-coverage.ts` enforces the rule-↔-assertion coverage. The current `REQUIRED_RULES` registry contains 33 rules; the script reports `33 covered, 0 uncovered` at the time of writing. Five spec rules are *deliberately not registered* (`inviolable.3`, `inviolable.7`, `protocol.8`, `agency.memory`, `agency.logger`) pending test infrastructure; their TODO status is documented in the registry source comments.

The full suite (judges enabled, 3-concurrency) runs in 12–18 minutes wall-clock at $3–6 per pass on the underlying Sonnet 4.5 model. `--no-judge` mode for programmatic-only assertions runs at $0.50 per pass and is the mode CI uses.

---

## 4 · Prior art and search methodology

### 4.1 Documented search

The §1.2 novelty claim depends on a defensible search. We searched (2026-04-15 to 2026-04-29): arXiv (cs.HC / cs.CY / cs.AI / cs.CL / cs.SE), ACM DL, IEEE Xplore, JMIR archives, PubMed, the Hippocratic License registry, the OpenRAIL registry, and GitHub topic searches (`mental-health`, `chatbot`, `safety`, `license`, `deployment-pause`). Search-term combinations: "AI/LLM/chatbot mental health" × "system prompt license / prompt restricted use / Hippocratic License / OpenRAIL / CheckList / deployment pause / dead-man switch / rule coverage / safety."

**What we found.** ~25 deployed AI mental-health systems were reviewed (Therabot, Wysa, Limbic Access, Replika, Character.AI, Woebot, Pi, Earkick, Mindstrong, Tessa-NEDA, MentaLLaMA, SoulChat, EmoLLM, ChatPsychiatrist, Mental-LLM, X2AI Tess, Youper, Yana, Pixel.bot, Talkspace AI, BetterHelp AI, Lasting AI, Sintelly, Sonia, Wysa NHS); ~7 have peer-reviewed evaluation. Of all 25, *zero* publish their full system prompt, *zero* publish trigger-condition + adjudicator commitments, and *zero* publish a rule-coverage CI artifact tied to a registered rule set. HL3 adopters span analytics / infrastructure / developer-tools but none deployed AI mental-health; OpenRAIL is applied to model weights, not prompts; ~5 papers apply CheckList-family methodology to LLM mental-health evaluation (MentaLLaMA evaluation, PsyEval, MHSafeEval [22], FAITA-MH [23], VERA-MH [24]), none with a CI-gated rule-coverage registry. Research-trial protocols (Therabot IRB pause-on-flag) and regulated medical-device safety cases (DO-178C, ARP4761) embody auditable-trigger patterns privately, not as public commitments for ordinary operation.

**Combination claim.** Across all corpora, zero published deployed AI mental-health systems combine all three tools. The novelty claim is made against an empty intersection.

**What we cannot rule out.** Internal governance documents at closed-commercial deployments are not public; trade-press venues are not exhaustively searched. We treat the claim as "no published deployed-system equivalent," not "no equivalent exists anywhere," and invite correction.

### 4.2 What we explicitly do not claim is novel

HL3-style use-restriction (since 2020); OpenRAIL behavioral constraint on ML weights (since 2022); MPL file-level copyleft (decades); CheckList behavioral-testing methodology [13]; bidirectional traceability in safety-critical software; auditable trigger conditions in regulated medical-device development; open-source AI mental-health systems (MentaLLaMA, SoulChat, ChatPsychiatrist). What is novel is the *combination* applied to a free, public-good, single-operator AI mental-health deployment, with the proposed license targeting safety-critical sections within a system prompt over a vendor base model.

### 4.3 Adjacent work that could be confused with our claim

**Wysa's UKCA Class IIa medical-device status** [8] is a regulatory pathway, not a governance package; closed-source, does not publish prompt / triggers / coverage check. **Therabot's IRB-supervised trial** [6] had internal governance but is not publicly documented in transferable-pattern form; weights and prompt are not public. **Anthropic's well-being interventions** [25] — sycophancy reduction, self-harm classifier, ThroughLine resource partnership — operate at the model-vendor / substrate level. System X's three-tool package operates at the application-deployment level above the substrate; the two layers are complementary.

**The Stade et al. (2024) READI framework** [26] for responsible LLM deployment in behavioral healthcare is a vocabulary and stage model, not a tool package. READI provides language for *what* deployment readiness looks like across its proposed stages; our package proposes *how* a public-good deployment can address some of those readiness criteria with concrete artifacts. We position the work as offering tooling that addresses parts of READI's governance vocabulary (specifically: the "responsible deployment", "ongoing monitoring", and "harm response" dimensions) without claiming our work constitutes READI-stage compliance — Stade et al.'s framework is more comprehensive than the slice our three-tool package addresses, and full READI compliance for a clinical-grade deployment would require additional artifacts (formal IRB protocol, pre-registered evaluation protocol, etc.) that System X does not have. We treat the two as complementary at different layers of abstraction.

---

## 5 · Limitations

The pattern's portability is asserted, not demonstrated. As of submission, no external party has adopted the three-tool package or any of its components for an AI mental-health deployment of their own. The proposed license has not been tested in court and the legal text has not been reviewed by counsel. The file-level copyleft mechanism may interact poorly with derivative-work doctrine, and the reviewer-of-record-substitution clause may be challenged as unduly burdensome. Pro-bono review from open-source-license counsel (Software Freedom Conservancy, EFF, university clinics) is being actively sought.

The operator is unincorporated and uninsured. There is no LLC, no errors-and-omissions or cyber-liability coverage, and no prior legal-demand experience. The deploy-pause legal-demand trigger described in §2.2 is responsible operator behavior, but it does not substitute for incorporation and counsel retention. Readers considering this pattern as a fork base should not infer that operating without these protections is recommended.

The rule-coverage CI is a v1 partial implementation. All 33 rules in the registry are covered, but five spec items are deliberately omitted from the registry pending test infrastructure (§2.4). The check is one-directional and does not verify semantic adequacy. Adverse-event monitoring is structurally limited by the local-only encrypted memory architecture. Defensible substitutes (anonymized rule-compliance telemetry, opt-in outcome surveys, sentinel-event reporting, IRB-supervised research partnership) are substitutes, not equivalents. This is the central unsolved problem of the deployment.

System X deploys to US users in English. The adjudicator names, the legal-demand-trigger agencies, and the proposed license's copyright-law references are all US-specific. International forks would need to remap each.

---

## 6 · Discussion and invitation

### 6.1 What we are claiming

The three-tool package (LICENSE-PROMPT, an auditable deployment-pause posture with dead-man switch, and rule-coverage CI) is offered as one reference implementation of one possible governance pattern for deployed public-good AI mental-health systems. We claim its components have substantial prior art, and that the combination applied to this deployment context is, by our search, not previously published. We do not claim it is the only possible pattern, that it is optimal, that the reference implementation is fully production-active (the heartbeat external scheduler wiring is the open v0.9 task), or that adopting it suffices for clinical-grade safety. The pattern is the contribution; System X is an instance.

### 6.2 What we want others to do

We invite others to fork or improve LICENSE-PROMPT. The drafting was done without legal counsel and the reviewer-of-record-substitution clause was designed without enforcement testing. A second draft from someone with open-source license expertise would strengthen the pattern significantly. We will not treat such a fork as competition; the closer the field gets to a standard use-restricted prompt license for safety-critical sections, the better for everyone deploying.

We invite improvements to the deploy-pause trigger taxonomy. Our four triggers (clinician review deadline, sentinel adverse event, rule-coverage failure, legal demand) reflect the threats we currently see and are not exhaustive. Specific gaps that might warrant additional triggers include data-breach disclosure obligation, model-vendor change of terms (a vendor policy update affecting System X's substrate, for example), and funding-runway exhaustion. The last is a real condition for any public-good deployment without commercial revenue; Woebot's June 2025 D2C shutdown is the recent precedent. Builders deploying under different threat models will need different triggers.

We invite adoption and improvement of the rule-coverage CI. The check is small, about 150 lines of TypeScript. Bidirectional checking (verifying that all rules-in-prompt have entries in `REQUIRED_RULES`) is a natural v2 extension that would close the silent-addition gap §2.4 acknowledged. Semantic-adequacy verification (whether the assertion actually tests what the rule means) is a much harder open problem and likely requires LLM-as-judge over rule-text and assertion-text pairs.

A note on the open loop between CI and license. §1.2 acknowledged that the rule-coverage CI does not currently constrain forks, and that we offer the three tools as composable but not closed-loop. A previous draft of this paper proposed amending LICENSE-PROMPT to require forks to ship an equivalent rule-coverage CI configured against their derived spec. We walked that proposal back. LICENSE-PROMPT's enforceability ceiling is already low (see §5), and adding a "must ship CI we approve of" clause would do three things, all bad: it would make the license materially more burdensome to comply with, it would require the licensor to evaluate whether each fork's CI is "equivalent" (a subjective standard that invites disputes), and it would increase the surface area for the license to be challenged as unduly restrictive. The right direction is to keep LICENSE-PROMPT minimal and defensible (named-section retention plus reviewer-of-record substitution, full stop) and to publish the rule-coverage CI script independently so adopters can choose to run it. Forks that want equivalence can adopt the script; forks that don't are still constrained by LICENSE-PROMPT's section-retention clause. The arrow we hoped to close (CI → license → fork) is genuinely missing, and we now treat it as a structural property of the package rather than a hole to plug.

**Document forks.** A small registry of deployments operating under the package — the original System X plus any forks — would be valuable as an external accountability artifact. We will host such a registry in the project repository, accept pull requests, and treat inclusion as a governance handshake (the fork enters the same auditable-pause posture as the original).

### 6.3 The scope honestly stated

This paper does not solve deployed AI mental-health safety. It does not approach the regulatory-evidence bar that the FDA SaMD pathway demands [27], the clinical-evidence bar that JMIR Mental Health peer review demands, or the operational-monitoring bar that sentinel-event reporting demands. It offers one engineering-ethics scaffolding pattern that a public-good deployment can adopt as the *minimum viable* governance package while pursuing those higher bars in parallel. We are explicit that *minimum viable* is not *sufficient*: a fork that adopts this package and stops there is not, in our view, operating responsibly. The package is a floor, not a ceiling.

The deployment we built (System X) is operating against this floor in part because the alternative — operating without any of these scaffolds — is what most public-good or grassroots AI mental-health deployments currently do. We propose a floor the field can hold each other to.

---

## Ethical Considerations Statement *(optional 1-page; AIES)*

This paper proposes a governance package for AI mental-health systems whose users are, by deployment context, often at elevated psychological risk. The work has direct ethical implications across three axes.

**On the operator-self-restraint framing.** The paper's central proposal — that a single operator can credibly bind themselves to public auditable trigger conditions — is, by construction, weaker than third-party regulation. We advocate for the package as a *floor* for grassroots deployments that would otherwise ship with no governance, not as a substitute for regulated medical-device pathways or clinical evaluation. The risk we are trying to mitigate is that "minimum viable governance" is read by adopters as "sufficient," which §6.3 explicitly disclaims. We have written the limitation into both the paper and the public deployment-conditions artifact.

**On the prompt-license enforceability claim.** LICENSE-PROMPT as currently drafted has not been reviewed by counsel and has not been tested in court. The failure mode if a fork strips a protected section and the license is later found unenforceable is that the protected section is, in fact, removed and the user-facing safety behavior degrades. We disclose this in §5 and treat counsel review as an outstanding obligation rather than an optional refinement. Publishing the pattern before that review carries a risk of legitimating an untested mechanism; we judged the alternative (privately holding a partially-validated pattern that other deployments could benefit from) to be worse, and surface this judgment for reviewer consideration.

**On the use of a deployed system in research.** System X is operated as a public deployment, not a research instrument. Conversation contents are local-only and end-to-end encrypted client-side; the operator cannot read user conversations. The reference-implementation claims in §3 are therefore based on what the deployment is *configured to do* (verifiable from source) rather than measured *user outcomes*. This limits empirical claims and is acknowledged as the central unsolved problem in §5. The package's governance commitments (auditable triggers, rule-coverage check, fail-closed default) are designed to be verifiable from outside without inspecting user data.

**Dual-use considerations.** The deployment-pause posture and dead-man switch patterns are general engineering techniques and could be applied to AI deployments outside mental health. We do not see plausible adversarial applications of the rule-coverage CI specifically. The proposed license's reviewer-of-record substitution clause could in principle be adopted by closed-commercial deployments to limit derivative competition; we view this as unlikely in practice (closed deployments do not publish prompts) but flag it as a possible misuse path.

The argument of the paper does not depend on the operator being uniquely well-positioned to make these claims; the package is offered for fork or rejection.

---

## Positionality Statement *(optional 1-page; AIES)*

The author of this paper is a single independent developer with no clinical training, no institutional affiliation, no formal background in mental-health research, and no prior peer-reviewed publication in AI ethics or governance. The work is unfunded, operating without institutional review, without IRB supervision, and without clinical advisors at the time of submission. Active outreach to clinical reviewer-of-record candidates and academic research partners is in progress; no engagement is yet finalized.

This positionality shapes the paper in three concrete ways.

**The framing of "minimum viable governance"** as a floor for grassroots deployments is itself shaped by the author's experience as a grassroots deployer rather than as a regulated-medical-device team. A clinically-trained or institutionally-affiliated author would likely have proposed a more conservative posture (e.g., refusing to deploy without IRB) rather than a less conservative one (deploying with self-imposed scaffolding). We disclose this so that readers can read the proposal as one positioned attempt at the trade-off rather than as a neutral analysis. The §6.3 acknowledgement that "minimum viable is not sufficient" is meant to carry the weight of this positional bias explicitly.

**The choice of which prior art to cite** reflects what the author was able to find and read carefully in the search window described in §4.1. Adjacent work in clinical psychology, suicidology, and crisis-line research that bears on the proposed safety SOPs has been cited where the author found it; the search was not exhaustive, and clinical reviewers will likely identify gaps. We treat this as expected and welcome correction.

**The single-operator deployment posture** described in §2.3 (dead-man switch with calibrated grace window) is not a recommended general practice; it is a defensive measure for the specific case of a deployment whose operator is, in fact, a single individual with no organizational backstop. A reader who interprets the dead-man-switch design as a license to deploy without organizational backing has, in our view, misread the paper. The §5 limitation on incorporation and insurance is intended to head off this reading.

The author has no commercial relationship with any deployed AI mental-health system, no financial relationship with a vendor LLM provider beyond a standard pay-per-token API account, and no academic-industry consulting arrangement. No institutional review board has approved or declined this work; none has been consulted. Funding for the deployment's compute and infrastructure costs is paid out of pocket from unrelated personal income.

The argument of the paper does not depend on the author's standing; the package is offered for fork or rejection regardless of who proposes it.

---

## Adverse Impact Statement *(optional 1-page; AIES)*

We identify five categories of plausible adverse impact and our mitigation posture for each.

**1. Adoption-without-review.** A deployment fork could adopt the three-tool package without obtaining clinical reviewer-of-record sign-off, then point at the license as evidence of safety governance. The package is a *floor*, not a sufficiency claim; §6.3 makes this explicit and the proposed license's reviewer-of-record substitution clause is intentionally a hard requirement on substantive prompt modification rather than a soft recommendation. Mitigation depends on enforcement, which (per §5) is currently untested.

**2. Mis-calibration of the dead-man switch.** The 7-day grace window plus 48-hour warning configuration was chosen to balance fail-closed safety against the typical operator's life rhythms. A user in active distress encountering an `expired` heartbeat at 3 AM receives a referral-only response naming external crisis lines. This is a known degradation. The right calibration on the boundary case is unsettled pending clinical reviewer input (§2.3). Forks deploying under different operator constraints (e.g., a small team) should re-calibrate; the package does not provide a recommended setting for that case.

**3. False-positive pause on adversarial legal demands.** The legal-demand trigger (§2.2) has a 72-hour verification window precisely because same-day verification by a single uninsured operator would frequently produce false-positive pauses on malformed or fraudulent demands. This means a malicious actor can issue a fake demand and the deployment will continue serving for up to 72 hours during verification. The trade-off was made deliberately; we surface it so adopters can decide whether their deployment can absorb this exposure.

**4. Anchoring effect of "minimum viable" framing.** Publishing a pattern labeled *minimum viable* may anchor field expectations downward, normalizing the floor as the standard. We mitigate by (a) using the floor/ceiling language explicitly throughout the paper, (b) listing in §5 the substantive safety questions the package does *not* address (adverse-event monitoring, semantic CI adequacy, regulated-device compliance), and (c) committing System X itself to the higher bar of clinician review on a public deadline. The risk remains that secondary discussion of the paper drops these qualifications.

**5. Mental-health-specific harms.** The package operates on the assumption that the LLM substrate behaves substantially as the system prompt directs. In edge cases — substrate model updates, prompt-injection attacks, jailbreak surface — the safety scaffolding can be circumvented and the user is exposed. We do not claim adversarial-robustness; the package is a governance scaffolding, not a security control. Adopters deploying in higher-stakes contexts (acute clinical settings, court-mandated mental-health interventions) should not rely on this package as their primary safety mechanism.

We have found no plausible offensive application of the package itself. The technical components (HMAC heartbeats, rule-coverage CI, section-level prompt licenses) are standard engineering primitives that do not enable harm if misused; their failure mode is degraded safety on the deployment using them, not an attack surface against third parties.

---

## Acknowledgments

*Anonymized for review. Camera-ready version will include.*

## Data and code availability

Anonymous code mirror and supplementary materials will be provided to the program chairs upon request. Camera-ready version will include public repository URL and license artifacts.

## Conflicts of Interest

*Anonymized for review. Full disclosure provided to program chairs.*

---

## References

[1] OpenAI. "Strengthening ChatGPT's responses in sensitive conversations." OpenAI blog, October 27, 2025. The 0.15% / 0.07% rates are from OpenAI; absolute counts are secondary-source extrapolations against ~800M weekly actives (TechCrunch, *Guardian*, *Wired*, BBC, *BMJ* 391:r2290).

[2] Federal Trade Commission. "Section 6(b) Inquiry into Chatbot Companions and Youth Mental Health." Orders to Meta, OpenAI, Character Technologies, Alphabet/Google, et al., September 2025.

[3] FDA Digital Health Advisory Committee. "Briefing materials on generative-AI mental-health devices." November 6, 2025.

[4] American Psychological Association. "Health Advisory on AI Mental-Health Systems." November 2025.

[5] *Garcia v. Character Techs., Inc.*, No. 6:24-cv-01903 (M.D. Fla. filed Oct. 22, 2024), motion-to-dismiss ruling May 20, 2025 (Conway, J.) (denying First-Amendment-defense; dismissing IIED only); settled Jan. 7, 2026 with terms undisclosed (NYT, CNBC, Guardian, CNN, JURIST, Jan. 7–8, 2026).

[6] M.V. Heinz, D.M. Mackin, B.M. Trudeau, et al. "Randomized Trial of a Generative AI Chatbot for Mental Health Treatment." *NEJM AI*, 2(4):AIoa2400802, 2025. DOI:10.1056/AIoa2400802.

[7] B. Inkster, S. Sarda, V. Subramanian. "An Empathy-Driven, Conversational Artificial Intelligence Agent (Wysa) for Digital Mental Wellbeing." *JMIR mHealth and uHealth*, 6(11):e12106, 2018.

[8] J. Habicht, S. Viswanathan, B. Carrington, T.U. Hauser, R. Harper, M. Rollwage. "Closing the accessibility gap to mental health treatment with a personalized self-referral chatbot." *Nature Medicine*, 30:595–602, 2024. DOI:10.1038/s41591-023-02766-x.

[9] AI Incident Database. "NEDA Tessa eating-disorder chatbot incident." Incident #545, June 2023.

[10] Hippocratic License v3 (HL3). EthicalSource. firstdonoharm.dev.

[11] BigScience. "OpenRAIL-M license family." huggingface.co/openrail.

[12] Mozilla Public License 2.0. mozilla.org/MPL/2.0.

[13] M.T. Ribeiro, T. Wu, C. Guestrin, S. Singh. "Beyond Accuracy: Behavioral Testing of NLP Models with CheckList." ACL 2020. arXiv:2005.04118.

[14] B. Maples, M. Cerit, A. Vishwanath, R. Pea. "Loneliness and suicide mitigation for students using GPT3-enabled chatbots." *npj Mental Health Research*, 3:4, 2024. DOI:10.1038/s44184-023-00047-6.

[15] K. Yang et al. "MentaLLaMA: Interpretable Mental Health Analysis on Social Media with Large Language Models." WWW 2024. arXiv:2309.13567.

[16] M.S. Gould, et al. "An Evaluation of Crisis Hotline Outcomes Part 2: Suicidal Callers." *Suicide and Life-Threatening Behavior*, 2007.

[17] B.L. Mishara, M.S. Daigle. "Crisis Helpline Helping Behavior — Best Practices." *Suicidology Online* and related operational publications on Samaritans / suicide-helpline counselor practice.

[18] RTCA DO-178C. "Software Considerations in Airborne Systems and Equipment Certification." RTCA Inc., 2011.

[19] SAE ARP4761. "Guidelines and Methods for Conducting the Safety Assessment Process on Civil Airborne Systems and Equipment." SAE International, 1996.

[20] ISO 26262. "Road vehicles — Functional safety." International Organization for Standardization, 2018.

[21] U.S. FDA. "Premarket Submissions for Device Software Functions." Guidance for Industry and FDA Staff, 2023.

[22] S. Lee, P. Achananuparp, N. Yadav, E.-P. Lim, Y. Deng. "MHSafeEval: Role-Aware Interaction-Level Evaluation of Mental Health Safety in Large Language Models." arXiv:2604.17730, 2026 (accepted ACL 2026 Findings).

[23] A. Golden, E. Aboujaoude. "The Framework for AI Tool Assessment in Mental Health (FAITA – Mental Health): a scale for evaluating AI-powered mental health tools." *World Psychiatry*, 23(3):444–445, October 2024. DOI:10.1002/wps.21248.

[24] K.H. Bentley, L. Belli, A.M. Chekroud, E.J. Ward, E.R. Dworkin, E. Van Ark, K.M. Johnston, W. Alexander, M. Brown, M. Hawrilenko. "VERA-MH: Reliability and Validity of an Open-Source AI Safety Evaluation in Mental Health." arXiv:2602.05088, February 2026.

[25] Anthropic. "Protecting the well-being of users." Anthropic blog, November 2025.

[26] E.C. Stade, S.W. Stirman, L.H. Ungar, C.L. Boland, H.A. Schwartz, D.B. Yaden, J. Sedoc, R.J. DeRubeis, R. Willer, J.C. Eichstaedt. "Large language models could change the future of behavioral healthcare: a proposal for responsible development and evaluation." *npj Mental Health Research*, 3:12, 2024. DOI:10.1038/s44184-024-00056-z.

[27] U.S. FDA. "Software as a Medical Device (SaMD): Clinical Evaluation." Guidance for Industry and FDA Staff, 2017.

[28] Regulation (EU) 2024/1689 (EU AI Act), Article 14 (Human Oversight). 2024.

[29] K. Posner et al. "The Columbia-Suicide Severity Rating Scale (C-SSRS)." *American Journal of Psychiatry*, 2011.

[30] G.K. Brown et al. "Effect of Stanley-Brown Safety Planning Intervention." *JAMA Psychiatry*, 2018.

---

*Figures pending: Figure 1 (three-tool package as composable but not closed-loop, with CI→pause solid arrow and CI→license dashed-gap arrow); Figure 2 (deployment-pause trigger flowchart with adjudicators and verification windows); Figure 3 (file-level architecture and license boundaries within the reference implementation).*
