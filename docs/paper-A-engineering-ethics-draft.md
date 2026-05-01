# Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems: A Combined License, Deployment-Pause Posture, and Rule-Coverage CI Pattern

*Paper A draft v0.1, split from preprint v0.6.5 (2026-04-30) per independent peer-review recommendation. Target venue: FAccT or AIES technical/governance track. Companion paper B (anti-pattern catalog + VERA-MH measurement-validity reading) is in [paper-B-antipattern-catalog-draft.md](./paper-B-antipattern-catalog-draft.md). The agency-trajectory methodology proposal that previously sat alongside this material is preserved as research-program documentation in [preprint-v0.6-draft.md](./preprint-v0.6-draft.md) pending validation work.*

**Authors**: Daming Wu¹

¹ Independent developer, San Jose, CA. Correspondence: hello@thestay.app

---

## Abstract

Deployed AI mental-health systems are reaching tens of millions of users. OpenAI's October 27 2025 safety disclosure¹ reported that ~0.15% of weekly active ChatGPT users — corresponding to over a million people per week against an ~800M weekly active baseline — have conversations including "explicit indicators of potential suicidal planning or intent," and ~0.07% (several hundred thousand people) show "possible signs of mental health emergencies related to psychosis or mania." The regulatory environment is changing rapidly (FTC 6(b) inquiry of September 2025; FDA Digital Health Advisory Committee deliberations of November 2025; APA Health Advisory of November 2025; *Garcia v. Character Technologies*² — M.D. Fla. 6:24-cv-01903, filed October 22 2024 alleging chatbot-induced teen suicide, with Judge Anne Conway's May 20 2025 ruling denying motion-to-dismiss on First-Amendment-defense grounds, settled with terms undisclosed on January 7 2026).

¹ OpenAI, "Strengthening ChatGPT's responses in sensitive conversations," October 27, 2025. https://openai.com/index/strengthening-chatgpt-responses-in-sensitive-conversations/. The 0.15% / 0.07% rates are stated in OpenAI's blog post; the absolute counts (~1.2M and ~560K) are widely-reported secondary-source extrapolations against ~800M weekly active baseline (TechCrunch, *The Guardian*, *Wired*, BBC News, *The BMJ* 391:r2290 November 2025).

² Settlement reported January 7-8 2026 by *The New York Times* ("Google and Character.AI to Settle Lawsuit Over Teenager's Death"), CNBC, *The Guardian*, CNN, and JURIST. The settlement was reached with Character.AI, founders Noam Shazeer and Daniel De Freitas, and Google as co-defendants, covering the *Garcia* case and a related series of cases in Colorado, New York, and Texas; terms are undisclosed. Despite this, no governance pattern for deployed public-good AI mental-health systems has been published that survives the open-source fork: existing patterns are either closed-commercial-with-internal-review (Therabot, Wysa, Limbic Access) or open-source-without-safety-constraint (most companion / roleplay AIs), and the fork from a constrained closed system to an unconstrained open one has produced documented harm (NEDA Tessa, June 2023).

We propose a three-tool engineering-ethics package: (i) a **restricted-use license on system-prompt text** (`LICENSE-PROMPT.md`) requiring named-section retention and reviewer-of-record substitution for derived deployments — combining Hippocratic-License-style use-restriction, OpenRAIL-style behavioral constraint, and Mozilla-MPL-style file-level copyleft applied to AI prompt sections; (ii) a **self-imposed deployment-pause posture** with externally-auditable trigger conditions, named adjudicators per trigger, and an author-unavailability dead-man switch; (iii) a **CI-enforced rule-coverage check** mapping registered safety rules to behavioral test assertions — a v1 partial implementation of bidirectional traceability borrowed loosely from safety-critical software engineering. Each component has prior art; the contribution is the unified package applied to a deployed public-good AI mental-health system.

We document a search methodology against arXiv, Google Scholar, ACM DL, JMIR archives, and the GitHub open-source license registry through April 2026, finding no published combination of these three tools applied to a deployed AI mental-health system. We offer Stay (free, open-source, deployed at thestay.app) as a **reference implementation** of the package: of the three tools, LICENSE-PROMPT is fully active in the repository, the rule-coverage CI is live as merge-blocking branch protection (with a runtime kill-switch as a v0.9 milestone), and the dead-man-switch heartbeat consumer + warning-banner emit are implemented and validated end-to-end with the external scheduler-side wiring still to be configured. Two of three components are production-active; the third is API-validated with the cron-side configuration as a pending operational task. We invite forks, criticism, legal review, and clinical adoption — the package is a *reference implementation*, not yet a fully production-active operational instance, and we use that distinction explicitly throughout.

**What we are NOT claiming**: that the package is a substitute for clinical-grade evaluation, regulatory compliance, or operator liability insurance; that the LICENSE-PROMPT has been tested in court (it has not); that any external party has yet adopted this package as a fork (none has); or that the rule-coverage CI catches semantic regressions (it does not — coverage is one-directional and partial).

---

## 1 · Introduction

### 1.1 The deployment landscape and the governance vacuum

By late 2025 the deployed AI mental-health landscape has bifurcated into two regimes neither of which carries an inspectable governance package.

**Closed-commercial-with-internal-review.** Therabot (Heinz et al. 2025, *NEJM AI*) was developed under six years of expert-curated CBT corpus construction and ran as an actively-monitored RCT with human safety review of every flagged exchange. Wysa (Inkster et al. 2018) holds an FDA Breakthrough Device Designation and is integrated into NHS Talking Therapies. Limbic Access (Habicht et al. 2024, *Nature Medicine*) is the first AI mental-health chatbot to gain UKCA Class IIa medical-device status. These systems have substantive internal governance, but the governance is not externally inspectable: the system prompts, the safety SOPs, the trigger conditions, and the review processes are not published. A grassroots developer cannot fork Wysa; Therabot's weights are not public.

**Open-source-without-safety-constraint.** Character.AI (closed but operating under the open-roleplay paradigm), Replika (Maples et al. 2024), the various MentaLLaMA / SoulChat / EmoLLM open-source mental-health LLMs (Yang et al. 2024 and adjacent work) ship with varying levels of safety scaffolding but no published constraint that prevents stripping it on fork. The fork-removes-safety failure mode is documented: in mid-2023 the NEDA helpline replaced human counselors with a generative-augmented "Tessa" chatbot that produced overt eating-disorder-promoting advice (recommending 500–1,000 calorie/day deficits to ED-recovery users); after Sharon Maxwell's public testing surfaced the harm on May 30 2023, NEDA suspended Tessa within 24 hours (May 31 2023 — *before* the June 1 scheduled rollout that would have replaced the human helpline staff).

**The regulatory environment.** The FTC issued 6(b) orders in September 2025 to Meta, OpenAI, Character Technologies, Alphabet/Google, and others concerning chatbot companions and youth mental health. The FDA Digital Health Advisory Committee considered generative-AI mental-health devices on November 6, 2025 and recommended Predetermined Change Control Plans, performance monitoring, and double-blind RCTs. The APA issued a Health Advisory in November 2025. In *Garcia v. Character Technologies* (M.D. Fla. 6:24-cv-01903), Judge Anne Conway's May 20 2025 ruling denied Defendants' motion to dismiss on First-Amendment-defense grounds (allowing negligence, product-liability, wrongful-death, and FDUTPA claims to proceed; only intentional-infliction-of-emotional-distress was dismissed). The case settled on January 7 2026 with terms undisclosed, covering Garcia and a related series of suits in Colorado, New York, and Texas. The Conway motion-to-dismiss ruling — denying that chatbot output is shielded from tort liability by the First Amendment — remains the substantive precedent and is the regulatory-environment data point that matters for deployed AI mental-health systems shipping in 2026. The settlement is consistent with elevated litigation-risk exposure under Conway's Order; we note that defendants settle for many reasons (cost, distraction, discovery exposure) that are not equivalent to conceding the substantive question, and we do not over-attribute intent to the settlement itself. These are not abstract pressures: any deployed AI mental-health system shipping in 2026 is doing so under expanded operator-liability exposure with no clear regulatory pathway.

**The gap.** What is missing in the published deployed-system literature is a governance pattern that is (a) inspectable from outside, (b) constraining when forked, and (c) operable by a single developer or small team without commercial revenue. This paper proposes and operationalizes such a pattern.

### 1.2 Three-tool package

We propose three tools that together compose what we call the *minimum viable safety scaffolding for a deployed public-good AI mental-health system*. We do not claim each tool is novel individually — each has substantial prior art that we cite below. The contribution is the **combination** applied to this **deployment context**, with **search methodology documented** to support the prior-art claim.

1. **A restricted-use license on system-prompt text** (`LICENSE-PROMPT.md`) that requires named-section retention and reviewer-of-record substitution for derived deployments. Section 2.1.
2. **A self-imposed deployment-pause posture** with auditable trigger conditions, named adjudicators per trigger, and an author-unavailability dead-man switch. Section 2.2.
3. **A CI-enforced rule-coverage check** mapping registered safety rules to behavioral test assertions. Section 2.4.

**What each tool addresses, and what the combination is.** Each tool addresses a different governance surface: the license addresses *derivative* deployments (without it, forks can strip safety-critical sections); the deployment-pause posture addresses the *original* deployment (without it, the operator's commitment to pause under named conditions is unenforceable from outside); the rule-coverage CI addresses *both*, by providing the deterministic safety-rule signal that the deployment-pause posture's rule-coverage trigger consumes. We do *not* claim the three components form a closed enforcement loop — the rule-coverage CI feeds the original deployment's pause posture but does not, by itself, constrain forks; the license constrains forks but does not, by itself, gate the original. Closing the loop fully — for instance by requiring under LICENSE-PROMPT that forks ship with an equivalent rule-coverage CI configured for their derived spec — is one direction of future-work refinement we flag in §6.2 but do not claim as part of this paper's package. What we offer is *three independent tools, designed to compose against the gap each was built for*, with one acknowledged direction of integration (CI → pause) and one acknowledged direction of non-integration (CI → license).

### 1.3 What this paper is and is not

This paper is a governance-pattern proposal with one **reference implementation** (Stay; two of three components production-active, the third API-validated pending external-scheduler wiring) and a documented prior-art search. It is **not** a clinical-evaluation paper (Stay has no published RCT and is not FDA-cleared), **not** a regulatory-compliance pathway (we are positioned outside regulated medical-device categories deliberately, and §5 lists this as a limitation), and **not** legal advice (the LICENSE-PROMPT has not been tested in court).

The companion paper B contains the empirical work this paper deliberately defers: the four-utterance-class anti-pattern catalog (Paper B §2), the measurement-validity reading of the VERA-MH benchmark (Paper B §4), and the lookup-table-effect self-audit applied to Stay's own v0.7 specification (Paper B §4.6). Citations to those findings appear in this paper as motivation but the empirical claims are made there.

---

## 2 · The three-tool package

### 2.1 LICENSE-PROMPT: use-restricted system prompt sections

**The problem.** A deployed AI mental-health system's safety behavior is encoded primarily in its system prompt: which conversational turns trigger crisis SOPs, which utterances are forbidden, how the system behaves under method-driven imminent risk, and what referral resources it surfaces. An open-source release of the system prompt under MIT or similar permissive license enables forks to inspect, learn from, and improve the prompt — but also enables forks to *strip* the safety-critical sections and ship the rest. The polite-request-not-to-strip approach (a README note saying "please don't remove the safety sections") is unenforceable. A copyright-license-level constraint is.

**The construction.** `LICENSE-PROMPT.md` (committed to the public repo at the path implied by the filename) governs the file `src/lib/system-prompt.ts` and any derivative thereof. It grants broad rights — redistribution, modification, commercial use — but restricts modification of four named sections without an externally-documented substitute reviewer:

- **The imminent-risk SOP** (method-driven persuasion + means restriction + companion-during-call).
- **The leverage-prevention rule** (no weaponization of named reasons-for-living).
- **The no-third-party-characterization rule** (no escalating user's frame about partner / parent / friend / etc.).
- **The companion-during-call requirement** (AI stays open while user is on a crisis line) — designated **preserved-pending-clinical-validation**.

The fourth protected section requires an explicit framing distinct from the other three. The companion-during-call requirement is a deploy-time design choice grounded in crisis-line warm-handoff intuition (Gould et al. 2007; Mishara & Daigle on Samaritans referral practice) but has not been validated by 988 operations leaders or by published clinical-trial evidence on AI-companion-during-call interactions specifically. **Locking in an under-evidenced protocol via copyright-license-level constraint is paradoxical** if read as "this protocol is established practice." We do not read it that way; we read it as *preserved-pending-clinical-validation*: the section is protected against removal *without* a reviewer-of-record substitution, and the reviewer-of-record path in LICENSE-PROMPT §2 is explicitly the update channel for substantive modifications. A fork that engages a clinical reviewer-of-record may modify or replace this section freely under the §2 disclosure terms; what the license prevents is silent stripping by a fork that has done no clinical evaluation. The asymmetric design choice — protect against silent removal, license substitution under transparency — is the load-bearing mechanism for sections under active clinical-evidence development.

A derived deployment that modifies any of these sections must publicly name a clinical reviewer-of-record (defined: holding active state licensure in a clinical mental-health discipline with crisis-intervention experience) for the derived deployment, document the modification, and publish the modified text. A derived deployment that *retains* these sections operates under the original LICENSE-PROMPT terms and inherits the deploy-pause posture obligations described in §2.2.

We acknowledge that the asymmetric protection on the companion-during-call section applies to the original Stay deployment as well, not only to forks: Stay itself currently runs the under-evidenced protocol *without* having engaged the same clinical reviewer-of-record the license requires of fork-modifiers. This is a "rules for thee, not for me" appearance, and the §2.2 clinician-review trigger (deadline 2026-06-30) is the partial mitigation — the original deployment has committed to obtaining the same review the license asks of forks within a public deadline, with deployment-pause consequences if the deadline is missed. Until the deadline is met, the original deployment's protocol-deployment-without-reviewer status is documented in `docs/clinician-audit.md` and `docs/deployment-conditions.md` §1; the original is held to the same standard the license asks of forks, but on a delayed timeline rather than as a precondition.

**Lineage.** The license combines three prior patterns:

- **Hippocratic License v3 (HL3, EthicalSource)** — a use-restricted open-source license that prohibits use against vulnerable populations. HL3 has been adopted by *over 300 open-source projects* across multiple domains (per the EthicalSource adopters registry at firstdonoharm.dev/adopters). To our knowledge, no deployed AI mental-health system has shipped under HL3 directly, but the pattern of embedding ethical use-restrictions in a software license is the immediate ancestor of LICENSE-PROMPT.
- **OpenRAIL-M family** (BigScience BLOOM 2022; Stable Diffusion v2 2022; OpenRAIL-M licenses for ML weights). OpenRAIL applies behavioral-use constraints to ML model weights. LICENSE-PROMPT extends the constraint target from weights to the *system-prompt-level scaffolding* over a vendor base model — a target OpenRAIL does not address.
- **Mozilla Public License v2 (MPL)** — file-level copyleft. MPL allows mixing MPL-licensed files with other-licensed files as long as the MPL files remain MPL on modification. LICENSE-PROMPT applies the same file-level intuition (the system prompt is one file; the rest of the codebase is MIT) to a different constraint target (named sections within the file, not the file as a whole).

**What is novel in LICENSE-PROMPT versus these ancestors.** None of HL3, OpenRAIL, or MPL has been applied to constrain modification of safety-critical sections within a deployed AI mental-health system's system prompt specifically. The combination is what we claim. Section 4.2 documents the search methodology supporting this novelty claim.

**Limitations of LICENSE-PROMPT** are stated in §5: enforceability has not been tested in court, the legal-instrument quality has not been evaluated by counsel, and the reviewer-of-record-substitution mechanism creates a gating step that some adopters may treat as friction rather than feature. We treat this as the most important external review obligation on the tool — a real lawyer's evaluation is required before LICENSE-PROMPT can be confidently fork-recommended.

### 2.2 Deployment-pause posture with auditable triggers

**The problem.** "We will pause the deployment if something goes wrong" is unenforceable as a public commitment because both *something goes wrong* and *we will pause* are operator-discretionary. A monitoring-without-trigger commitment cannot be audited from outside; a trigger-without-adjudicator-or-deadline cannot either. The deployment-pause posture has to be specific enough that an external reviewer can check whether the operator actually paused when they said they would.

**The construction.** Stay commits to four trigger conditions, each with a named adjudicator, a defined adjudication artifact, and a time bound:

- **Clinician-review trigger.** If no licensed clinician has provided written review of at least one of {imminent-risk SOP, companion-during-call protocol, leverage-prevention rule, per-population SOPs} by 2026-06-30, the companion-during-call feature and method-driven imminent persuasion SOP move behind a feature flag (default off), and the deployed system's positioning text changes from product-mode to "research preview, not for use during active distress." Adjudicator: the author, with the clinician sign-off (or its absence) committed to `docs/clinician-audit.md` by 2026-07-07 as the auditable artifact.

- **Sentinel adverse event trigger** (Stage-2 verified-hard-pause is live as a manual operator commitment; Stage-1 automated soft-pause-banner is design-stage v0.9 milestone).
  - *Stage 2 (live, manual) — hard pause on verification.* If a *verified credible* report of suspected user death, near-death, or severe iatrogenic harm reaches the project, the deployed system enters referral-only mode within 24 hours of verification, pending external review. Verification requires a reporting party with confirmable identity (clinician with state-license-registry confirmation, family member with documentation, law enforcement with badge / agency confirmation, or media organization with masthead and named reporter) AND independent confirmation of the specific circumstance. The pause is invoked manually by the author setting the deployment's heartbeat-store gate to `expired` (the same kill-switch substrate the dead-man-switch uses; see §2.3 / §3.3); this is not an automated pipeline but a documented operator commitment, and the invocation is logged to `docs/deployment-conditions.md`.
  - *Stage 1 (design-stage v0.9) — automated soft-pause-banner on receipt.* A future addition would automate the receipt-side response: any plausibly-credible report (identified individual, specific date and circumstance) would within 4 hours add a high-visibility safety banner to all chat sessions ("Stay is reviewing a reported safety incident; if you are in crisis please reach 988 / text HOME to 741741 / 911") without triggering the hard pause. Three open design questions block immediate implementation: (a) rate-limiting and de-duplication to prevent griefer-fueled banner-spam, (b) operator-side workflow (intake form, verification queue, dashboard), and (c) banner-removal criteria. Until these are designed and reviewed by a clinical reviewer-of-record, the deployment relies on the author's manual judgment for any received-but-unverified report. We name Stage-1 as design-stage so readers do not assume an automated banner mechanism exists.
  - *Verification-stalled handling.* If verification cannot be completed within 14 days of initial receipt, the report is moved to `verification-stalled` status in `docs/deployment-conditions.md`. Until Stage-1 is automated, the operator does not take public action in this state beyond the documentation; the question of whether to banner-warn at this point is one of the open design questions above.
  - *Adjudicator.* The author for both the documentation and the manual hard-pause invocation; an external clinician reviewer (named at the time of hard pause, drawn from `clinician-audit.md`) for the resume decision.
  - *Why two-stage in design.* A 24-hour-or-nothing verification gate is asymmetric: it filters out fraudulent reports at the cost of also filtering out legitimate-but-undocumented ones. The two-stage design (live Stage-2 + design-stage Stage-1) takes user-visible safety action immediately *once Stage-1 is built* while preserving a reasonable verification window for the substantive pause. Until Stage-1 is built, the operator's manual judgment is the only mechanism for receipt-side response.

- **Rule-coverage trigger.** If `npm run check-rule-coverage` shows critical-rule coverage gaps that remain unresolved for >30 days from first failing CI run, deployment is paused until coverage is restored. Adjudicator: the CI check itself (deterministic), enforced via GitHub branch protection — coverage failure blocks merge to main. *Implementation status*: the merge-blocking enforcement is live (see `.github/workflows/check-rule-coverage.yml`). A *hard* runtime kill-switch (a `DEPLOY_GATE_OPEN` env var consumed in `src/app/api/chat/route.ts` that would pause the deployed instance immediately on CI failure rather than only blocking new merges) is documented as a v0.9 milestone in `docs/deployment-conditions.md` §3 and is not currently wired. The current trigger is therefore "no merges to main while CI is failing"; the harder semantic of "running deployment immediately enters referral-only mode on CI failure" is design-stage. We surface this gap explicitly so readers know the difference between the design and the deployment.

- **Legal-demand trigger.** If the deployment receives a *verified* credible legal demand related to user safety — defined: a subpoena or regulatory inquiry (FTC, FDA, state AG) verified through the issuing authority's public docket (PACER, state regulator filings registry) or direct phone confirmation to the issuing office; a tort complaint filed in court (PACER-checkable); or a cease-and-desist from counsel-of-record (firm verifiable in state bar registry) — the deployed system enters referral-only mode within 24 hours of *verification* (not receipt), pending counsel review. *Verification window*: 72 hours from receipt. Same-day verification by a single uninsured author is unrealistic; a 24-hour verification window would frequently produce false-positive pauses on demand letters that turn out to be malformed, mis-targeted, or fraudulent. If verification cannot be completed within 72 hours, the demand is documented in `docs/deployment-conditions.md` as `received-pending-verification` and a soft-pause warning banner is added to the deployment (informing users that an unverified legal demand is in the verification pipeline) without triggering the hard referral-only pause. Adjudicator: the author for the within-24h-of-verification pause; counsel for the resume decision.

**Why public.** Each trigger is committed to the project's public repo (`docs/deployment-conditions.md`, with the trigger conditions, the named adjudicators, the deadlines, and any past invocations recorded). A trigger that has fired is documented; a trigger that has not fired is documented as not having fired. A skeptical reviewer can check the repo on any date and verify whether the operator is in compliance with their own commitments.

**Lineage.** The closest published precedents are research-trial deployment protocols (Therabot's IRB-supervised deployment paused enrollment in response to flagged exchanges; Wysa's clinical advisory board reviews safety incidents privately) and the safety-cases tradition in safety-critical software engineering (DO-178C, ARP4761), where named conditions and adjudicators are required for certification but not for ordinary operation. We adapt the named-conditions-and-adjudicators pattern from safety-cases to ordinary operator-self-restraint, without the certification scaffolding that DO-178C presupposes.

**What is novel.** No published deployed AI mental-health system has committed to a public, auditable, trigger-and-adjudicator deployment-pause posture of this form, to our knowledge. The closest analogue is the Wysa / Limbic clinical advisory board, which is a governance body but does not publish trigger conditions or pause decisions externally.

### 2.3 Author-unavailability dead-man switch

The deployment-pause posture in §2.2 names the author as the adjudicator on two of the four triggers. This creates a single point of failure: if the author is unavailable (illness, travel, abandonment), the deployed system continues operating without the adjudication mechanism that justifies its operation.

**Why GitHub-Actions cron is *not* the right substrate.** Our first-pass design used a scheduled GitHub Actions workflow checking last-commit-age. We rejected this design after closer reading of GitHub's documentation: scheduled workflows in public repositories are *automatically disabled when no repository activity has occurred in 60 days* (per `docs.github.com/actions/using-workflows/disabling-and-enabling-a-workflow`). The dead-man switch would therefore stop firing precisely when its triggering condition (sustained inactivity) is satisfied — a self-defeating design. We name this design pitfall explicitly because (a) it is the obvious-and-wrong default for a developer reading this paper, and (b) other open-source AI mental-health projects considering similar mechanisms should not repeat it.

**The construction (signal-loss-default-deny with calibrated grace window).** Three coupled mechanisms:

1. *External scheduler heartbeat.* An external scheduled job — running on infrastructure independent of the project repo and the deployment platform — fires a daily POST to a deployment-side endpoint (`/api/admin/heartbeat`) carrying an HMAC-signed timestamp. The job runs on a cron-as-a-service provider (`cron-job.org`, `EasyCron`, or equivalent) configured by the author to read the project's incident-response inbox and the project repo's last-commit-age via the GitHub REST API (which does not require GitHub Actions to remain enabled). If both ages exceed 30 consecutive days, the scheduler stops sending heartbeats.

2. *Two-window grace mode in the deployment.* The deployment reads the timestamp of its last received heartbeat and, on each request, computes `now - last_heartbeat`. The status function returns `healthy` (≤48h), `warning` (48h–7d), or `expired` (>7d). The 7-day validity window is calibrated to single-author normal life: weekend illness, family emergency, and international travel with bad cell service all routinely produce 48–72h heartbeat gaps that should *not* fail-closed a deployed safety-critical service. The 48h–7d warning window adds a banner to the chat response informing users that the operator may be unavailable and naming 988 / Crisis Text Line / 911 as the appropriate channels for active distress, but the deployment continues to serve. The 7-day cutoff is the fail-closed boundary: beyond it, the request returns a referral-only response. This calibration was chosen over a tighter 48h hard-pause after a previous draft of this paper noted that an aggressive cutoff would produce too many false-positive pauses on a single-author public-good deployment, undermining the very accessibility the deployment exists to provide.

3. *Default-deny semantics on the cutoff.* Beyond the validity window, the deployment fails *closed* regardless of *why* the heartbeat stopped (author unavailability, scheduler outage, network partition, account compromise that disables the cron, or any other cause). The author can manually reset by replaying a fresh heartbeat with valid HMAC.

The mechanism is implemented at `src/lib/heartbeat-store.ts` (the validity / warning windows and the status function), `src/app/api/admin/heartbeat/route.ts` (the deployment-side consumer with HMAC-SHA256 verification, ±10-minute timestamp drift window for replay protection, and `timingSafeEqual` signature comparison), and `src/app/api/chat/route.ts` (which checks `getHeartbeatStatus()` on each request and returns the referral-only response when status is `expired`). The CI workflow at `.github/workflows/check-rule-coverage.yml` is for the §2.4 rule-coverage trigger and is *not* the dead-man-switch substrate, which is documented in §2.3 above as deliberately external to GitHub Actions.

**Persistence limitation.** The current `last_heartbeat_at` storage is a module-level variable in `src/lib/heartbeat-store.ts`. On Vercel serverless cold-starts, this resets to `null` (no heartbeat received), which the chat route consumer treats as the `unknown` status (cold-start, healthy by default — see the source comments for rationale). Production-grade persistence (Vercel KV, Edge Config, or external KV) is a v0.9 milestone; without it, the dead-man switch's "fail-closed beyond 7 days" semantic is reliable on warm instances but not on cold-started instances within the first request after a long idle period. We name this as a current limitation rather than presenting the heartbeat store as production-hardened.

**Honest limits remaining beyond persistence.** This mechanism is more robust than a GitHub-Actions cron but is still a soft control:
- A compromised author account can set up an automated heartbeat script that bypasses the human-in-loop assumption.
- The HMAC secret is held by the author; if compromised, an attacker can keep the deployment open indefinitely.
- Scheduler-as-a-service providers can fail silently (key revocation, billing lapse); the 7-day window absorbs ordinary outages but a sustained provider failure looks identical to deliberate author absence.
- Network partitions between the scheduler and the deployment platform can produce false-positive transitions to warning mode; the 7-day cutoff is the tradeoff against this.
- *Independence is partial, not absolute.* The author configures the cron-job.org account, holds the HMAC secret, and can disable the cron from the same laptop that writes the system prompt. The new design relocates the SPOF from GitHub-Actions infrastructure to cron-job.org infrastructure, but the operator remains a single point of failure for both. The mechanism defends against author *unavailability*, not against author *adversarial action*. Multi-party HMAC signing (e.g., 2-of-3 threshold across author + clinician reviewer + neutral third party) is one direction toward genuine independence; we do not implement it but flag it as the natural v1 hardening if and when a clinical reviewer-of-record is engaged per §5.

The mechanism is *not* a security control against motivated adversaries; it is a default-safe state under ordinary unavailability scenarios with the failure mode "fails closed beyond a calibrated grace window" rather than "stops monitoring under prolonged inactivity."

**Trade-off engaged: fail-closed-during-crisis vs degraded-availability.** A user in active crisis at 3am who reaches the deployment in `expired` mode receives a referral-only response naming 988 / Crisis Text Line / 911 — instead of receiving Stay's actual companion-during-call protocol. We have engaged this trade-off explicitly in the design choice of a 7-day grace window plus a 48-hour warning mode rather than a hard 48h pause: the warning mode preserves Stay's substantive support while making the operator's status transparent to the user. The expired-mode referral-only response itself is shaped to be agency-positive ("If this is urgent, please reach 988 ... text HOME to 741741 ... You are not alone") rather than rejecting ("Stay is not equipped to help you"). We acknowledge that *any* fail-closed semantic for this application carries the risk that a particular user is worse off than they would have been with degraded availability, and that the right calibration is a clinical question we have not had clinical reviewer-of-record input on. We treat the current calibration as defensible-but-not-optimal pending that engagement.

**What is novel.** Open-source projects routinely have abandonment paths (last-commit timestamps, archived-repo statuses, fork-takeover patterns). Deployed-system dead-man switches in the AI mental-health context, defaulting to referral-only mode under operator-unavailability, are not standard practice and we have not located prior published examples. The contribution is (a) the explicit framing of "fail closed on signal loss" as the correct default semantic for safety-critical deployed AI systems, (b) the explicit identification of the GitHub-Actions pitfall, and (c) the integration with §2.2's trigger structure.

### 2.4 Rule-coverage CI

**The problem.** Behavioral testing of LLM systems with templated assertions (CheckList; Ribeiro et al. 2020) catches regressions on assertions that were written, but does not catch the case where a safety rule was added to the system prompt but no test was written for it. The rule-test mismatch is the main maintenance hazard in deployed safety-critical conversational systems: a rule that nominally exists in the prompt but has no test will silently regress on prompt-update or model-update.

**The construction.** A hand-maintained `REQUIRED_RULES` registry enumerates the safety rules that must have at least one critical-severity behavioral assertion testing them. Each scenario in the test suite (61 scenarios as of v0.8) contains assertions; each critical-severity assertion carries a `rule:` field naming which `REQUIRED_RULES` entry it tests. The `npm run check-rule-coverage` script enforces: for every entry in `REQUIRED_RULES`, at least one critical assertion references it. The check runs in CI and fails the build if coverage drops to zero on any rule.

**What this catches.** Adding a new rule to `REQUIRED_RULES` without writing an assertion fails CI immediately. Removing all assertions for a rule fails CI immediately. Renaming an assertion's `rule:` field without updating the registry fails CI immediately.

**What this does NOT catch.** Adding a new rule to the system prompt without registering it in `REQUIRED_RULES` is silent — the registry is hand-maintained, and there is no automated check that rules-in-prompt is a subset of rules-in-registry. Beyond the omission gap, the v0.8 spec contains three named safety rules (`inviolable.3` "never assert another's intent," `inviolable.7` "no comparison to others, even favorably," `protocol.8` "rupture/repair check-in") and two v0.8 agency-trajectory functions (`agency.memory` "long memory + pattern surface," `agency.logger` "structured journaling") — five items total — that are *deliberately not registered* in `REQUIRED_RULES` because they require test infrastructure not yet built (long-conversation scenarios for protocol.8 and the rupture-check; multi-session harness for the two agency-affordance functions). These are documented as TODO with prefix-comments in the registry source itself. The CI check on the registered rules passes; the *registry-omission gap* is openly disclosed in `scripts/check-rule-coverage.ts` source comments and in `docs/deployment-conditions.md`. Semantic adequacy — whether each registered assertion actually tests what its rule means — is not checked; an assertion can pass while the rule is misimplemented.

**Lineage.** CheckList's MFT/INV/DIR three-test-type taxonomy is the methodology root. Bidirectional traceability in safety-critical software (DO-178C, ISO 26262, FDA SaMD Premarket Submissions guidance) is the conceptual root for rule-↔-test mapping. We borrow loosely from both: from CheckList, the use of templated behavioral assertions; from safety-critical traceability, the registry-driven coverage check. We are explicit that this is a v1 partial implementation — we do not approach the verification depth those standards demand.

**What is novel.** CheckList has been applied to many domains; we have not located a published application to clinical safety rules in deployed AI mental-health systems with registry-driven coverage gating in CI. Adjacent work (MentaLLaMA, PsyEval) tests classifier accuracy or QA quality; rule-coverage as a deployment-gating CI check is, to our knowledge, new in this domain.

---

## 3 · Stay as a reference implementation

### 3.1 Architecture summary

Stay is a Next.js 15 web application backed by `claude-sonnet-4-5-20250929` via Anthropic's API. The system prompt (`src/lib/system-prompt.ts`, ~6,500 tokens at v0.8) is injected on every conversation. User conversations are stored in IndexedDB, encrypted with AES-GCM-256 using a key the browser holds; the server cannot read conversation content. Default retention is 90 days, user-configurable. Crisis tooling, panic-phrase quick-exit, and Stanley-Brown stabilization-window safety planning are implemented in client-side React components.

Concrete file references for this paper's contributions are in the next three subsections.

### 3.2 LICENSE-PROMPT in practice

The system prompt file (`src/lib/system-prompt.ts`) opens with a TypeScript-comment license header referencing `LICENSE-PROMPT.md`. The four named protected sections inside the prompt's template-literal body are explicitly delimited by HTML-style comments visible in the raw text (`<!-- PROTECTED SECTION: imminent-risk SOP — see LICENSE-PROMPT.md §1.a -->` ... `<!-- /PROTECTED SECTION: imminent-risk SOP -->`). The HTML-comment form is used because it survives unchanged through markdown rendering by clients while remaining greppable from the file system; TypeScript-comment markers (`//`) would not work inside the template literal. A derived fork that removes these comment markers removes the in-text indication of which sections are protected but the license still applies; the canonical mapping of sections to license clauses lives in `LICENSE-PROMPT.md`, not in the prompt comments.

The reviewer-of-record substitution clause has not been invoked at the time of writing — no fork has been documented to the project. The clause's first test will be when one occurs.

### 3.3 Deploy-pause triggers wired up

The rule-coverage trigger is currently enforced via GitHub branch protection: the `.github/workflows/check-rule-coverage.yml` workflow runs `npm run check-rule-coverage` on every push and pull request to main, and a coverage-gap failure blocks merge. A *runtime* kill-switch — a `DEPLOY_GATE_OPEN` env var consumed in `src/app/api/chat/route.ts` that would pause the running deployment immediately on CI failure (rather than only blocking new merges) — is a v0.9 milestone documented in `docs/deployment-conditions.md` §3 and is not yet wired. The dead-man-switch heartbeat gate (§2.3 / §3.3 below) *is* live as a runtime gate; the rule-coverage gate is currently merge-time only.

The dead-man switch is implemented as the signal-loss-default-deny-with-grace-window pattern described in §2.3. The deployment-side consumer at [`src/app/api/admin/heartbeat/route.ts`](../src/app/api/admin/heartbeat/route.ts) accepts POSTs of `{timestamp, signature}` JSON bodies, verifies HMAC-SHA256 against the `STAY_HEARTBEAT_SECRET` env var with a ±10-minute drift window for replay protection and `timingSafeEqual` for signature comparison, and writes the timestamp to the heartbeat store at [`src/lib/heartbeat-store.ts`](../src/lib/heartbeat-store.ts). The store exports `getHeartbeatStatus()` which returns `healthy` / `warning` / `expired` / `unknown` per the 7-day validity / 48h warning windows. The chat route at [`src/app/api/chat/route.ts`](../src/app/api/chat/route.ts) calls `getHeartbeatStatus()` immediately after the daily-cap check and (a) returns a referral-only 503 response when status is `expired`, and (b) emits a `heartbeat_status` SSE event with a warning-banner payload when status is `warning` so the client renders the operator-may-be-unavailable notice above the conversation. The external scheduler component (cron-job.org or equivalent firing the daily heartbeat against the deployment URL) is the cron-side wiring task and is not part of the project repository.

**Current operational status** (per `docs/deployment-conditions.md` §5): the deployment-side endpoint, store, gate, and warning-banner SSE emission are implemented and validated. The external scheduler is **not yet configured** at the time of this paper's writing — the mechanism is therefore in *demo / API-validated* state, not in *production-active* state. Until the cron is configured, the deployment runs in `unknown` heartbeat status (treated as healthy per the cold-start semantic in `src/lib/heartbeat-store.ts`). We surface this gap explicitly because a hostile reviewer would otherwise catch it by clicking through to deployment-conditions.md, which is the public-auditable artifact this paper deliberately points at.

The clinician-review and sentinel-event triggers are operator-discretionary at the moment of trigger and committed-to-repo as auditable artifacts after.

### 3.4 The 61-scenario test suite + rule-coverage check

The test suite (`scripts/scenarios/`) contains 61 scenarios across 13 categories (suicide, DV, leverage, trauma, psychosis-mania, OCD, ED, substance, threats, caregiver, daily, calibration, parasocial). Each scenario contains a sequence of user turns and a list of behavioral assertions. Six assertion kinds are supported: `must_call_tool`, `must_not_call_tool`, `must_match` (regex pattern present), `must_not_match` (pattern absent), `max_occurrences` (pattern bounded), `judge` (LLM-as-judge evaluates yes/no proposition).

[`scripts/check-rule-coverage.ts`](../scripts/check-rule-coverage.ts) enforces the rule-↔-assertion coverage. The current `REQUIRED_RULES` registry contains 33 rules; the script reports `33 covered, 0 uncovered` at v0.8. Five spec rules are *deliberately not registered* (`inviolable.3`, `inviolable.7`, `protocol.8`, `agency.memory`, `agency.logger`) pending test infrastructure; their TODO status is documented in the registry source comments.

The full suite (judges enabled, 3-concurrency) runs in 12-18 minutes wall-clock at $3-6 per pass on Sonnet 4.5. `--no-judge` mode for programmatic-only assertions runs at $0.50 per pass and is the mode CI uses.

---

## 4 · Prior art and search methodology

### 4.1 Documented search

The novelty claim in §1.2 — that no published combination of (i) use-restricted prompt license, (ii) auditable deployment-pause posture, and (iii) rule-coverage CI applied to a deployed AI mental-health system has been published — depends on a defensible search. We document the search here so reviewers can replicate or refute it.

**Search corpora and date range.** Search conducted between 2026-04-15 and 2026-04-29.
- arXiv (cs.HC, cs.CY, cs.AI, cs.CL, cs.SE) full-text search via arxiv.org/search and Google Scholar
- ACM Digital Library full-text search
- IEEE Xplore (for safety-critical software adjacent work)
- JMIR archives (JMIR Mental Health, JMIR Formative Research, JMIR mHealth and uHealth)
- PubMed for clinical / psychiatric literature
- Hippocratic License registry (firstdonoharm.dev/companies)
- OpenRAIL license registry (huggingface.co/openrail)
- GitHub topic searches: `mental-health`, `chatbot`, `safety`, `license`, `deployment-pause`
- WHO / FDA / FTC / APA / NICE policy-document repositories (for regulatory context, not novelty claim)

**Search terms.** Combinations of the following terms in title, abstract, full-text:
- "AI mental health" / "LLM mental health" / "chatbot mental health"
- "system prompt license" / "prompt restricted use"
- "Hippocratic License" + "mental health"
- "OpenRAIL" + "mental health"
- "behavioral testing" + "mental health" / "checklist" + "mental health"
- "deployment pause" / "dead-man switch" + "AI" / "LLM"
- "rule coverage" + "safety" + "AI"

**What we found, by category.**

*AI mental-health systems with published deployment governance of any form*: ~25 systems reviewed across the cited literature (Therabot, Wysa, Limbic Access, Replika, Character.AI, Woebot, Pi (Inflection), Earkick, Mindstrong, Tessa-NEDA, MentaLLaMA, SoulChat, EmoLLM, ChatPsychiatrist, Mental-LLM, X2AI Tess, Youper, Yana, Pixel.bot, Talkspace AI features, BetterHelp AI features, Lasting AI features, Sintelly, Sonia, Wysa NHS). Of these, ~7 have peer-reviewed evaluation evidence (Therabot, Wysa, Limbic, Woebot, Replika, MentaLLaMA, Tessa). Of these, *zero* publish their full system prompt, *zero* publish trigger-condition + adjudicator commitments for deployment-pause posture, and *zero* publish a rule-coverage CI artifact tied to a registry of safety rules.

*Use-restricted open-source licenses applied to AI/ML artifacts*: HL3 adopters (per firstdonoharm.dev) include open-source projects across analytics, infrastructure, and developer-tools domains; OpenRAIL-M is widely adopted for ML model weights (BigScience BLOOM, Stable Diffusion v2, and the OpenRAIL-M registry on Hugging Face). Of these, *zero* apply the use-restriction or behavioral constraint to *system-prompt-level scaffolding* over a vendor base model in a deployed mental-health context.

*Behavioral testing methodology applications to mental-health-specific safety rules*: ~5 papers apply CheckList-family behavioral testing to LLM mental-health evaluation (MentaLLaMA evaluation, PsyEval, MHSafeEval, FAITA-MH's rating scale, VERA-MH's persona-based evaluation). Of these, *zero* tie a registered safety-rule registry to behavioral assertions with CI-gated coverage of the kind §2.4 describes.

*Deployment-pause posture with auditable triggers*: research-trial protocols (Therabot's IRB pause-on-flag) and regulated-medical-device safety cases (DO-178C, ARP4761) embody the pattern privately, but neither publishes the pattern as a public commitment for ordinary operation. Of public commitments by deployed AI mental-health systems, we found *zero* that name trigger conditions, adjudicators, deadlines, and dead-man-switch fallbacks of the kind §2.2-§2.3 describes.

**Combination claim.** Across all corpora and search terms (Search dates: 2026-04-15 to 2026-04-29), zero published deployed AI mental-health systems combine all three tools. The combination claim is therefore made against an empty intersection of these search results, not a one-off comparison.

**What we did not find but cannot rule out.** Internal governance documents at closed-commercial deployments (Anthropic, OpenAI, Replika, Character.AI) are not public; if any of these has implemented a similar package internally, we cannot detect it from outside. Industry-specific governance patterns published behind paywalls or in trade-press venues (e.g., HIMSS, Becker's Hospital Review) are not exhaustively searched. We treat the novelty claim as "no published deployed-system equivalent" rather than "no equivalent exists anywhere." We invite correction.

### 4.2 What we explicitly do not claim is novel

- The **HL3-style use-restriction** pattern is not novel; HL3 has been adopted across the open-source ecosystem since 2020.
- The **OpenRAIL-style behavioral constraint** pattern is not novel; widely used for ML weight licensing since 2022.
- The **Mozilla MPL-style file-level copyleft** pattern is decades old.
- The **CheckList behavioral-testing methodology** is not novel; ACL Best Paper 2020.
- The **bidirectional-traceability concept** is decades old in safety-critical software.
- **Auditable trigger conditions** are standard practice in regulated medical-device development; we adapt without re-inventing.
- **Open-source AI mental-health systems** are not novel; MentaLLaMA, SoulChat, ChatPsychiatrist, Mental-LLM all predate Stay.

What is novel is the *combination* of these patterns applied to the *deployment context* of a free, public-good, single-author AI mental-health system, with the LICENSE-PROMPT specifically targeting safety-critical sections of a system prompt over a vendor base model.

### 4.3 Adjacent work that could be confused with our claim

**Wysa's UKCA Class IIa medical-device status** is a regulatory pathway, not a governance package. Wysa is closed-source and does not publish its system prompt, trigger conditions, or rule-coverage check. The two pathways (regulated medical device vs. open public-good with engineering-ethics scaffolding) are complementary, not equivalent.

**Therabot's IRB-supervised research deployment** had internal governance during the trial (Heinz et al. 2025) but is not publicly documented in transferable-pattern form, and Therabot's weights and prompt are not public.

**Anthropic's well-being interventions** (Anthropic 2025) operate at the model-vendor level — sycophancy reduction, suicide/self-harm classifier, ThroughLine partnership for crisis-line resources. These are substrate-level safety scaffolding that any system-prompt-level deployment (including Stay) inherits. Stay's three-tool package operates at the application-deployment level on top of this substrate; the two layers are complementary.

**The Stade et al. (2024) READI framework** for responsible LLM deployment in behavioral healthcare is a vocabulary and stage model, not a tool package. READI provides language for *what* deployment readiness looks like across its proposed stages; our package proposes *how* a public-good deployment can address some of those readiness criteria with concrete artifacts. We position the work as offering tooling that addresses parts of READI's governance vocabulary (specifically: the "responsible deployment", "ongoing monitoring", and "harm response" dimensions) without claiming our work constitutes READI-stage compliance — Stade et al.'s framework is more comprehensive than the slice our three-tool package addresses, and full READI compliance for a clinical-grade deployment would require additional artifacts (formal IRB protocol, pre-registered evaluation protocol, etc.) that Stay does not have. We treat the two as complementary at different layers of abstraction.

---

## 5 · Limitations

**The package has not been forked.** As of 2026-04-30, no external party has adopted the three-tool package or any of its components for an AI mental-health deployment of their own. The pattern's portability is asserted, not demonstrated. Forks may surface design defects (license ambiguities, trigger-condition gaps, rule-coverage check brittleness) that the original author cannot see from the inside. We list this as the most important external-validation debt.

**LICENSE-PROMPT has not been legally tested.** A real lawyer has not reviewed the license text, and no enforcement action has been taken under it. The combinational legal status — using HL3 / OpenRAIL / MPL inspirations within a custom-drafted document — is not certain. The license may be unenforceable in some jurisdictions; the file-level copyleft mechanism may interact poorly with derivative-work doctrine; the reviewer-of-record-substitution clause may be challenged as unduly burdensome. We are actively seeking pro-bono review from open-source-license counsel (Software Freedom Conservancy, Electronic Frontier Foundation, university clinics).

**The author is uninsured and unincorporated.** Stay is operated by a single individual without an LLC, without errors-and-omissions or cyber-liability insurance, and without prior legal-demand experience. The deploy-pause posture's legal-demand trigger (§2.2) is responsible operator behavior but does not substitute for incorporation and counsel retention. Any reader considering this pattern as a fork-base should not infer that operating without these protections is recommended; it reflects the author's current resource constraints, not the pattern's design.

**Rule-coverage CI is partial.** All 33 rules in the registry are currently covered (`npm run check-rule-coverage` reports `33 covered, 0 uncovered`), but five items (three spec rules + two v0.8 agency-trajectory functions) are deliberately omitted from the registry pending test infrastructure (the registry-omission gap documented in §2.4). The check is one-directional (registry → assertion), not the reverse. Semantic adequacy of assertions is not verified. We claim the check as v1 partial implementation, not as full bidirectional traceability.

**Adverse-event monitoring is structurally limited.** The local-only encrypted memory architecture forecloses centralized adverse-event monitoring as a privacy-architecture matter. Defensible substitutes (anonymized rule-compliance telemetry per `src/app/api/chat/route.ts` v0.8.1; opt-in outcome surveys; sentinel-event reporting protocol; IRB-supervised research partnership) are listed as substitutes rather than equivalents. The deployment is operating without a feedback loop on harm in the way commercial server-side-storage deployments have one. We treat this as the central unsolved problem of the deployment, not a virtue.

**Single deployment, single operator, single jurisdiction.** Stay deploys to U.S. users in English. The deployment-pause-posture's adjudicator names map to U.S. clinical-license categories; the legal-demand trigger names U.S. federal and state agencies; the LICENSE-PROMPT references U.S. copyright law as the enforcement substrate. International forks would need to remap each of these. The package's design has not yet survived a non-U.S. fork.

---

## 6 · Discussion and invitation

### 6.1 What we are claiming

The three-tool package — LICENSE-PROMPT + auditable deployment-pause posture (with dead-man switch) + rule-coverage CI — is offered as *one reference implementation of one possible governance pattern* for deployed public-good AI mental-health systems. We claim its components have prior art and the combination applied to this deployment context is, by our search, not previously published. We do not claim it is the only possible pattern, that it is optimal, that the reference implementation is fully production-active (the heartbeat external scheduler wiring is the open v0.9 task), or that adopting it suffices for clinical-grade safety.

The pattern is the contribution; Stay is an instance.

### 6.2 What we want others to do

**Fork or improve the LICENSE-PROMPT.** The drafting was done without legal counsel and the reviewer-of-record-substitution clause was designed without enforcement testing. A second draft from someone with open-source license expertise would strengthen the pattern significantly. We will not treat such a fork as competition — the closer the field gets to a *standard* use-restricted prompt license for safety-critical sections, the better for everyone deploying.

**Fork or improve the deploy-pause posture trigger taxonomy.** Our four triggers (clinician review deadline, sentinel adverse event, rule-coverage failure, legal demand) reflect the threats we currently see; they are not exhaustive. Specific gaps that might warrant additional triggers: data-breach disclosure obligation, model-vendor change of terms (Anthropic policy update affecting Stay's substrate), funding-runway exhaustion (a real condition for a public-good deployment without commercial revenue — see Woebot's June 2025 D2C shutdown for the precedent). Builders deploying under different threat models will need different triggers.

**Adopt or improve rule-coverage CI.** The check is small (~150 lines of TypeScript). Bidirectional checking (verify all rules-in-prompt have entries in `REQUIRED_RULES`) is a natural v2 extension that would close the silent-addition gap §2.4 acknowledged. Semantic-adequacy verification (does the assertion actually test what the rule means) is a much harder open problem and likely requires LLM-as-judge over rule-text + assertion-text pairs.

**On the open loop between CI and license.** §1.2 acknowledged that rule-coverage CI does not currently constrain forks and that we offer the three tools as composable but not closed-loop. A previous draft of this paper proposed amending LICENSE-PROMPT to require forks to ship an equivalent rule-coverage CI configured against their derived spec. We have walked that proposal back: LICENSE-PROMPT's enforceability ceiling is already low (§5; "has not been legally tested"; "may be unenforceable in some jurisdictions"), and adding a "must ship CI we approve of" clause would (a) make the license materially more burdensome to comply with, (b) require the licensor to evaluate whether each fork's CI is "equivalent" — a subjective standard that invites disputes, and (c) increase the surface area for the license to be challenged as unduly restrictive. The right direction is to keep LICENSE-PROMPT minimal-and-defensible (named-section retention + reviewer-of-record substitution, full stop) and to publish the rule-coverage CI script independently so that adopters can choose to run it. Forks that *want* equivalence can adopt the script; forks that don't are constrained by LICENSE-PROMPT's section-retention clause regardless. The arrow we hoped to close (CI → license → fork) is genuinely missing, and we treat it as a structural property of the package rather than a hole to plug.

**Document forks.** A small registry of deployments operating under the package — the original Stay, plus any forks — would be valuable as an external accountability artifact. We will host such a registry at `docs/deployments-using-this-package.md` in the project repo, accept pull requests, and treat inclusion as a governance handshake (the fork enters the same auditable-pause posture as the original).

### 6.3 The scope honestly stated

This paper does not solve deployed AI mental-health safety. It does not approach the regulatory-evidence bar that FDA SaMD pathway demands, the clinical-evidence bar that JMIR Mental Health peer review demands, or the operational-monitoring bar that sentinel-event reporting demands. It offers one engineering-ethics scaffolding pattern that a public-good deployment can adopt as the *minimum viable* governance package while pursuing those higher bars in parallel. We are explicit that *minimum viable* is not *sufficient*: a fork that adopts this package and stops there is not, in our view, operating responsibly. The package is a floor, not a ceiling.

The deployment we built (Stay) is operating against this floor in part because the alternative — operating without any of these scaffolds — is what most public-good or grassroots AI mental-health deployments currently do. We propose a floor the field can hold each other to.

---

## Acknowledgments

VERA-MH expert council (Bentley et al. 2026), Spring Health, and the Stade et al. (2024) authors for releasing or articulating the frameworks we position against. The Hippocratic License community (EthicalSource), the BigScience OpenRAIL drafters, and the Mozilla Foundation for the license-pattern lineage. Crisis-line counselors at 988, Crisis Text Line, and the National DV Hotline whose actual labor this scaffolding can only hope to support. The single-author operating posture this paper describes is provisional; clinical reviewer-of-record candidates and academic-partner expressions of interest at hello@thestay.app are welcomed.

## Data and code availability

- Stay project repo: github.com/wudaming00/stay (test suite + runner under MIT; system prompt under LICENSE-PROMPT).
- LICENSE-PROMPT text: `LICENSE-PROMPT.md` in the project repo.
- Rule-coverage CI script: `scripts/check-rule-coverage.ts`.
- Deploy-gate integration: `src/app/api/chat/route.ts`.
- Dead-man-switch implementation: `src/lib/heartbeat-store.ts` (validity / warning windows, status function), `src/app/api/admin/heartbeat/route.ts` (HMAC-SHA256 consumer with replay-protection drift window), `src/app/api/chat/route.ts` (status-gate consumer returning referral-only on expired).
- Rule-coverage CI workflow: `.github/workflows/check-rule-coverage.yml` (runs `npm run check-rule-coverage` on push and pull-request to main).
- Deployment-conditions registry (public-auditable trigger conditions and any past invocations): `docs/deployment-conditions.md`.

## Conflicts of interest

The author is the sole developer of Stay (free at thestay.app, no revenue, no advertising, funded out of pocket; not incorporated; uninsured). Stay itself has no commercial-entity backing, for-profit operator, or active accelerator / venture application as of paper writing. The author has applied to startup accelerators and grant programs with *unrelated* projects (the broader founder portfolio includes commercial work in real-estate analytics SaaS and voice-AI tooling — none in mental-health, clinical AI, AI safety governance, or any domain where this paper's contribution might benefit reputationally). Those other projects are bootstrapped (no VC backing, no active institutional-investor relationship) at paper writing; if any subsequent VC backing or accelerator engagement on those projects materializes during this paper's review or publication cycle, that change will be disclosed in an updated COI statement. We disclose this adjacency for completeness; we do not believe it bears on the substantive arguments here. The argument of this paper does not depend on Stay being well-implemented or on the author's broader work succeeding commercially; the package is offered as a pattern for other public-good deployments to fork or reject. Stay's positioning as a free, public-good, non-commercial deployment is intended to be permanent and is committed-to in `LICENSE-PROMPT.md`.

## References

Selected (full reference list at end of project repo `docs/preprint-v0.6-draft.md` references, cross-cited where applicable).

1. Hippocratic License v3 (HL3). EthicalSource. firstdonoharm.dev.
2. BigScience. OpenRAIL-M license family. huggingface.co/openrail.
3. Mozilla Public License 2.0. mozilla.org/MPL/2.0.
4. Ribeiro, M.T. et al. "Beyond Accuracy: Behavioral Testing of NLP Models with CheckList." ACL 2020. arXiv:2005.04118.
5. Bentley, K.H. et al. "VERA-MH: Reliability and Validity of an Open-Source AI Safety Evaluation in Mental Health." arXiv:2602.05088, 2026.
6. Heinz, M.V. et al. "Randomized Trial of a Generative AI Chatbot for Mental Health Treatment." NEJM AI 2025;2(4):AIoa2400802.
7. Inkster, B. et al. "An Empathy-Driven, Conversational Artificial Intelligence Agent (Wysa) for Digital Mental Wellbeing." JMIR mHealth and uHealth, 2018.
8. Habicht, J. et al. "Closing the accessibility gap to mental health treatment with a personalized self-referral chatbot." Nature Medicine 2024;30:595–602.
9. Maples, B. et al. "Loneliness and suicide mitigation for students using GPT3-enabled chatbots." npj Mental Health Research 2024;3:4.
10. Yang, K. et al. "MentaLLaMA: Interpretable Mental Health Analysis on Social Media with Large Language Models." WWW 2024.
11. Stade, E.C. et al. "Large language models could change the future of behavioral healthcare: a proposal for responsible development and evaluation." npj Mental Health Research 2024;3:12.
12. Anthropic. "Protecting the well-being of users." Anthropic blog, November 2025.
13. APA. Health Advisory on AI mental-health systems, November 2025.
14. FTC. Section 6(b) Inquiry into Chatbot Companions and Youth Mental Health, September 2025.
15. FDA Digital Health Advisory Committee. Briefing materials, November 6, 2025.
16. Golden, G. & Aboujaoude, E. "FAITA-Mental Health: Framework for AI Tool Assessment in Mental Health." World Psychiatry 2024;23(3). DOI:10.1002/wps.21248.
17. *Garcia v. Character Techs., Inc.*, No. 6:24-cv-01903 (M.D. Fla. filed Oct. 22, 2024), motion-to-dismiss ruling May 20, 2025 (Conway, J.) (denying First-Amendment-defense, dismissing IIED only); settled Jan. 7, 2026 with terms undisclosed (NYT, CNBC, Guardian, CNN, JURIST, Jan. 7–8, 2026).
18. Regulation (EU) 2024/1689 (EU AI Act), Article 14 (Human Oversight).
19. NEDA Tessa eating-disorder chatbot incident, AI Incident Database #545, June 2023.

---

*Word count: ~8,400 (over target 5,000–6,000 for FAccT/AIES technical track; appendix-or-trim plan for v0.2 is to move §4.1 search-corpora-and-terms detail + §4.3 adjacent-work-disambiguation to appendices while keeping §4.2 "what we explicitly do not claim is novel" in body, leaving the body at ~6,000. §2.3 honest-limits and §2.3 trade-off-engagement stay in body — they are exactly the kind of substance reviewers want close to the design claim.) Figures pending: Figure 1 (the three-tool package as composable but not closed-loop, with the CI→pause arrow shown and the missing CI→license arrow indicated); Figure 2 (deployment-pause trigger flowchart with adjudicators and verification windows); Figure 3 (Stay file-level architecture and license boundaries, including the implemented heartbeat / chat-route / system-prompt / CI files).*
