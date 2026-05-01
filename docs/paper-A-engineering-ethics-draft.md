# Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems: A Combined License, Deployment-Pause Posture, and Rule-Coverage CI Pattern

*Paper A draft v0.1, split from preprint v0.6.5 (2026-04-30) per independent peer-review recommendation. Target venue: FAccT or AIES technical/governance track. Companion paper B (anti-pattern catalog + VERA-MH measurement-validity reading) is in [paper-B-antipattern-catalog-draft.md](./paper-B-antipattern-catalog-draft.md). The agency-trajectory methodology proposal that previously sat alongside this material is preserved as research-program documentation in [preprint-v0.6-draft.md](./preprint-v0.6-draft.md) pending validation work.*

**Authors**: Daming Wu¹

¹ Independent developer, San Jose, CA. Correspondence: hello@thestay.app

---

## Abstract

Deployed AI mental-health systems reach tens of millions of users (OpenAI's October 2025 disclosure: ~0.15% of weekly active ChatGPT users — over a million per week — show explicit suicidal-planning indicators¹). The regulatory environment is moving fast (FTC 6(b) inquiry September 2025; FDA Digital Health Advisory Committee November 2025; APA Health Advisory November 2025; *Garcia v. Character Technologies*² denied First-Amendment-defense dismissal May 2025, settled January 2026). Yet no governance pattern for *public-good* deployed AI mental-health systems has been published that survives the open-source fork: existing patterns are closed-commercial-with-internal-review (Therabot, Wysa, Limbic) or open-source-without-safety-constraint (most companion / roleplay AIs), and fork-strips-safety has documented harm (NEDA Tessa, 2023).

We propose a three-tool **engineering-ethics governance pattern** with documented prior-art search and one reference implementation: (i) a **restricted-use license on system-prompt text** (`LICENSE-PROMPT.md`) — Hippocratic-License-style use-restriction + OpenRAIL-style behavioral constraint + MPL-style file-level copyleft applied to four named safety-critical sections; (ii) a **self-imposed deployment-pause posture** with auditable trigger conditions, named adjudicators, deadlines, and an author-unavailability dead-man switch; (iii) a **CI-enforced rule-coverage check** mapping registered safety rules to behavioral test assertions. Each component has prior art; the *combination* applied to a deployed public-good AI mental-health system, by our search, is not previously published. Stay (thestay.app) is the reference implementation — two of three components production-active, the third API-validated with operational wiring pending — and is the *forkable artifact*, not the contribution itself.

**Not claimed**: substitute for clinical evaluation, regulatory compliance, or operator liability insurance; that LICENSE-PROMPT has been tested in court; that any external party has forked the package; that the rule-coverage CI catches semantic regressions.

¹ OpenAI, "Strengthening ChatGPT's responses in sensitive conversations," 2025-10-27. The 0.15% / 0.07% rates are from OpenAI; absolute counts are secondary-source extrapolations against ~800M weekly actives (TechCrunch, *Guardian*, *Wired*, BBC, *BMJ* 391:r2290).

² M.D. Fla. 6:24-cv-01903, filed Oct 2024; Conway J. May 20 2025 motion-to-dismiss ruling; settled Jan 7 2026 with terms undisclosed (NYT / CNBC / Guardian / CNN / JURIST).

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

A deployed AI mental-health system's safety behavior is encoded primarily in its system prompt — crisis-trigger logic, forbidden utterances, imminent-risk handling, referral resources. MIT-style permissive release lets forks both improve the prompt *and* strip safety-critical sections. A README note asking forks not to strip is unenforceable; a copyright-license-level constraint is.

`LICENSE-PROMPT.md` governs `src/lib/system-prompt.ts` and substantially-derivative prompts. It grants broad redistribution, modification, and commercial-use rights with carve-outs for four named sections: (§1.a) the imminent-risk SOP — method-driven persuasion + means restriction + companion-during-call; (§1.b) the leverage-prevention rule — no weaponization of named reasons-for-living; (§1.c) the no-third-party-characterization rule — no escalating user's framing of partner/parent/friend; (§1.d) the companion-during-call requirement — designated **preserved-pending-clinical-validation**. A derived deployment modifying any of these must publicly name a clinical reviewer-of-record (active state licensure in a clinical mental-health discipline with crisis-intervention experience), document the modification, and publish the modified text. Derived deployments that *retain* these sections inherit the deploy-pause posture (§2.2).

The fourth section needs different framing: companion-during-call is grounded in crisis-line warm-handoff literature (Gould et al. 2007; Mishara & Daigle on Samaritans) but has not been validated for AI-companion-during-call interactions specifically. Locking an under-evidenced protocol via copyright would be paradoxical if read as "established practice." We read it as **protect against silent stripping; license substitution under transparency**: the reviewer-of-record path in LICENSE-PROMPT §2 is the explicit update channel for substantive modifications. A fork engaging a clinical reviewer-of-record may modify §1.d freely under §2 terms; what the license blocks is silent removal by forks that did no clinical evaluation. The same asymmetric standard applies to the original Stay deployment: the §2.2 clinician-review trigger commits Stay itself to obtaining the same review on a public 2026-06-30 deadline, with deployment-pause consequences if missed. Status (and any post-deadline update) is in `docs/clinician-audit.md` and `docs/deployment-conditions.md` §1.

**Lineage.** LICENSE-PROMPT combines three prior patterns: Hippocratic License v3 (HL3, EthicalSource — use-restriction; ~300+ adopters per firstdonoharm.dev, none in deployed AI mental-health), OpenRAIL-M (BigScience BLOOM, Stable Diffusion v2 — behavioral constraint, applied to model weights not prompts), and Mozilla MPL v2 (file-level copyleft — applied to a different constraint target: named sections within a file rather than the file as a whole). The combination — section-level retention + reviewer-of-record substitution clause + applied to a deployed AI mental-health system's prompt — is, by our search (§4), not previously published.

**Limitations of LICENSE-PROMPT** are in §5: enforceability untested in court, legal quality unreviewed by counsel, reviewer-of-record substitution may be treated as friction rather than feature. A real lawyer's evaluation is the most important external review obligation on the tool.

### 2.2 Deployment-pause posture with auditable triggers

**The problem.** "We will pause the deployment if something goes wrong" is unenforceable as a public commitment because both *something goes wrong* and *we will pause* are operator-discretionary. A monitoring-without-trigger commitment cannot be audited from outside; a trigger-without-adjudicator-or-deadline cannot either. The deployment-pause posture has to be specific enough that an external reviewer can check whether the operator actually paused when they said they would.

**The construction.** Stay commits to four trigger conditions, each with a named adjudicator, a defined adjudication artifact, and a time bound:

- **Clinician-review trigger.** If no licensed clinician has provided written review of at least one of {imminent-risk SOP, companion-during-call protocol, leverage-prevention rule, per-population SOPs} by 2026-06-30, the companion-during-call feature and method-driven imminent persuasion SOP move behind a feature flag (default off), and the deployed system's positioning text changes from product-mode to "research preview, not for use during active distress." Adjudicator: the author, with the clinician sign-off (or its absence) committed to `docs/clinician-audit.md` by 2026-07-07 as the auditable artifact.

- **Sentinel adverse event trigger.** If a *verified credible* report of suspected user death, near-death, or severe iatrogenic harm reaches the project — verified by reporting-party identity (licensed clinician, documented family member, law enforcement, masthead media organization) plus independent circumstance confirmation — the deployment enters referral-only mode within 24 hours of verification, pending external review. The pause is invoked manually by setting the heartbeat-store gate to `expired` (same substrate as the dead-man switch, §2.3); not automated. Adjudicator: the author for the manual pause; an external clinician reviewer (named at the time, drawn from `clinician-audit.md`) for the resume decision. *Receipt-side automation* (a soft-pause-banner on plausibly-credible reports prior to verification, with rate-limiting and de-duplication against griefer-spam) is a v0.9 milestone in `docs/deployment-conditions.md` §2; the current commitment is the manual verified-hard-pause path. Single-author adjudication is the residual exposure; multi-party HMAC threshold signing once a clinician-of-record is engaged is the natural v1 hardening (cross-referenced from §2.3).

- **Rule-coverage trigger.** If `npm run check-rule-coverage` shows critical-rule coverage gaps unresolved for >30 days, deployment is paused until coverage is restored. Adjudicator: the CI check itself (deterministic). *Implementation status*: enforcement is live as merge-blocking branch protection (`.github/workflows/check-rule-coverage.yml`); a runtime kill-switch (`DEPLOY_GATE_OPEN` env var consumed in chat route to immediately enter referral-only mode on CI failure) is a v0.9 milestone documented in `docs/deployment-conditions.md` §3.

- **Legal-demand trigger.** A *verified* credible legal demand — subpoena or regulatory inquiry (FTC / FDA / state AG, verified via PACER / regulator docket / direct phone confirmation), tort complaint (PACER-checkable), or cease-and-desist from counsel-of-record (firm verified in state bar registry) — moves the deployment to referral-only mode within 24 hours of verification, pending counsel review. *Verification window*: 72 hours from receipt; same-day verification by a single uninsured author would frequently produce false-positive pauses on malformed or fraudulent demands. Unverified-pending-72h demands get a soft-pause warning banner without the hard pause. Adjudicator: the author for the post-verification pause; counsel for the resume decision.

Each trigger is committed in `docs/deployment-conditions.md` (trigger conditions, named adjudicators, deadlines, past invocations); a skeptical reviewer can verify operator compliance on any date. **Lineage**: research-trial deployment protocols (Therabot IRB-supervised pause-on-flag; Wysa clinical advisory board) plus the safety-cases tradition in safety-critical software engineering (DO-178C, ARP4761) — where named conditions and adjudicators are required for certification but not ordinary operation. We adapt named-conditions-and-adjudicators from safety-cases to ordinary operator-self-restraint, without the certification scaffolding. **Novelty**: no published deployed AI mental-health system commits to a public, auditable, trigger-and-adjudicator deployment-pause posture of this form, to our knowledge.

### 2.3 Author-unavailability dead-man switch

The deployment-pause posture in §2.2 names the author as the adjudicator on two of the four triggers. This creates a single point of failure: if the author is unavailable (illness, travel, abandonment), the deployed system continues operating without the adjudication mechanism that justifies its operation.

**Why not GitHub-Actions cron.** Our first-pass design used a scheduled GitHub Actions workflow checking last-commit-age. GitHub auto-disables scheduled workflows in public repos after 60 days of inactivity — defeating the trigger precisely when sustained inactivity is the firing condition. We name this pitfall explicitly so other AI mental-health projects do not repeat it.

**Construction (signal-loss-default-deny + calibrated grace window).** An external cron-as-a-service provider (cron-job.org or equivalent) — independent of the project repo and the deployment platform — fires a daily HMAC-SHA256-signed heartbeat (±10-minute drift window for replay protection, `timingSafeEqual` for signature comparison) to `/api/admin/heartbeat`. The deployment computes `now - last_heartbeat` on each request and returns one of `healthy` (≤48h), `warning` (48h–7d, banner added), or `expired` (>7d, request returns referral-only). The 7-day cutoff is calibrated to single-author normal life — weekend illness, family emergency, and international travel routinely produce 48–72h gaps that should not fail-closed a safety-critical service. Beyond 7 days the deployment fails closed regardless of *why* the heartbeat stopped. Implementation: `src/lib/heartbeat-store.ts` (windows + status function), `src/app/api/admin/heartbeat/route.ts` (consumer with replay protection), `src/app/api/chat/route.ts` (gate consumer).

**Honest limits.** *Persistence*: `last_heartbeat_at` is module-level state; Vercel serverless cold-starts reset to "unknown" (treated as healthy by design — see source comments); production-grade persistence (Vercel KV / Edge Config) is a v0.9 milestone. *Independence is partial*: the author configures cron-job.org, holds the HMAC secret, and can disable the cron from the same machine that writes the system prompt — the new design relocates the SPOF from GitHub-Actions infrastructure to cron-job.org infrastructure rather than removing it. The mechanism defends against *unavailability*, not against *adversarial action*; multi-party HMAC threshold signing across author + clinician reviewer + neutral third party is the natural v1 hardening once a clinician-of-record is engaged. *Provider failures, network partitions, secret compromise* — each individually well-mitigated by the 7-day grace + fail-closed semantic; in aggregate, the mechanism is a default-safe state under ordinary unavailability, not a security control. *Fail-closed-during-crisis vs degraded-availability* is the live clinical question: a user in `expired` mode at 3am receives a referral-only response naming 988 / CTL / 911 instead of Stay's companion protocol. The 7-day grace + 48h warning was chosen over a tighter 48h pause precisely to minimize this exposure on the typical case; the right calibration on the boundary case is unsettled pending clinical reviewer-of-record input.

**What is novel.** Deployed-system dead-man switches in AI mental-health, defaulting to referral-only on operator-unavailability, are not standard practice and we have not located prior published examples. The contribution is (a) the "fail closed on signal loss" framing as correct default for safety-critical deployed AI, (b) the GitHub-Actions self-disabling pitfall as transferable engineering knowledge, and (c) integration with §2.2's trigger structure.

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

The §1.2 novelty claim depends on a defensible search. We searched (2026-04-15 to 2026-04-29): arXiv (cs.HC / cs.CY / cs.AI / cs.CL / cs.SE), ACM DL, IEEE Xplore, JMIR archives, PubMed, the Hippocratic License registry (firstdonoharm.dev/companies), the OpenRAIL registry, and GitHub topic searches (`mental-health`, `chatbot`, `safety`, `license`, `deployment-pause`). Search-term combinations: "AI/LLM/chatbot mental health" × "system prompt license / prompt restricted use / Hippocratic License / OpenRAIL / CheckList / deployment pause / dead-man switch / rule coverage / safety."

**What we found.** ~25 deployed AI mental-health systems were reviewed (Therabot, Wysa, Limbic Access, Replika, Character.AI, Woebot, Pi, Earkick, Mindstrong, Tessa-NEDA, MentaLLaMA, SoulChat, EmoLLM, ChatPsychiatrist, Mental-LLM, X2AI Tess, Youper, Yana, Pixel.bot, Talkspace AI, BetterHelp AI, Lasting AI, Sintelly, Sonia, Wysa NHS); ~7 have peer-reviewed evaluation. Of all 25, *zero* publish their full system prompt, *zero* publish trigger-condition + adjudicator commitments, and *zero* publish a rule-coverage CI artifact tied to a registered rule set. HL3 adopters span analytics / infrastructure / developer-tools but none deployed AI mental-health; OpenRAIL is applied to model weights, not prompts; ~5 papers apply CheckList-family methodology to LLM mental-health evaluation (MentaLLaMA eval, PsyEval, MHSafeEval, FAITA-MH, VERA-MH), none with a CI-gated rule-coverage registry. Research-trial protocols (Therabot IRB pause-on-flag) and regulated medical-device safety cases (DO-178C, ARP4761) embody auditable-trigger patterns privately, not as public commitments for ordinary operation.

**Combination claim.** Across all corpora, zero published deployed AI mental-health systems combine all three tools. The novelty claim is made against an empty intersection.

**What we cannot rule out.** Internal governance documents at closed-commercial deployments (Anthropic, OpenAI, Replika, Character.AI) are not public; HIMSS / Becker's-style trade-press venues are not exhaustively searched. We treat the claim as "no published deployed-system equivalent," not "no equivalent exists anywhere," and invite correction.

### 4.2 What we explicitly do not claim is novel

HL3-style use-restriction (since 2020); OpenRAIL behavioral constraint on ML weights (since 2022); MPL file-level copyleft (decades); CheckList behavioral-testing methodology (Ribeiro et al. 2020 ACL Best Paper); bidirectional traceability in safety-critical software; auditable trigger conditions in regulated medical-device development; open-source AI mental-health systems (MentaLLaMA, SoulChat, ChatPsychiatrist, Mental-LLM). What is novel is the *combination* applied to a free, public-good, single-author AI mental-health deployment, with LICENSE-PROMPT targeting safety-critical sections within a system prompt over a vendor base model.

### 4.3 Adjacent work that could be confused with our claim

**Wysa's UKCA Class IIa medical-device status** is a regulatory pathway, not a governance package; closed-source, does not publish prompt / triggers / coverage check. **Therabot's IRB-supervised trial** (Heinz et al. 2025) had internal governance but is not publicly documented in transferable-pattern form; weights and prompt are not public. **Anthropic's well-being interventions** (Anthropic 2025) — sycophancy reduction, self-harm classifier, ThroughLine resource partnership — operate at the model-vendor / substrate level. Stay's three-tool package operates at the application-deployment level above the substrate; the two layers are complementary.

**The Stade et al. (2024) READI framework** for responsible LLM deployment in behavioral healthcare is a vocabulary and stage model, not a tool package. READI provides language for *what* deployment readiness looks like across its proposed stages; our package proposes *how* a public-good deployment can address some of those readiness criteria with concrete artifacts. We position the work as offering tooling that addresses parts of READI's governance vocabulary (specifically: the "responsible deployment", "ongoing monitoring", and "harm response" dimensions) without claiming our work constitutes READI-stage compliance — Stade et al.'s framework is more comprehensive than the slice our three-tool package addresses, and full READI compliance for a clinical-grade deployment would require additional artifacts (formal IRB protocol, pre-registered evaluation protocol, etc.) that Stay does not have. We treat the two as complementary at different layers of abstraction.

---

## 5 · Limitations

The pattern's portability is asserted, not demonstrated — no external party has adopted the three-tool package or its components for an AI mental-health deployment as of 2026-04-30. LICENSE-PROMPT has not been tested in court and the legal text has not been reviewed by counsel; the file-level copyleft mechanism may interact poorly with derivative-work doctrine, and the reviewer-of-record-substitution clause may be challenged as unduly burdensome. Pro-bono review from open-source-license counsel (Software Freedom Conservancy, EFF, university clinics) is being actively sought.

The author is unincorporated and uninsured (no LLC, no E&O / cyber-liability coverage, no prior legal-demand experience). The deploy-pause legal-demand trigger (§2.2) is responsible operator behavior but does not substitute for incorporation and counsel retention; readers considering this pattern as a fork base should not infer that operating without these protections is recommended.

Rule-coverage CI is a v1 partial implementation: all 33 rules in the registry are covered, but five spec items are deliberately omitted from the registry pending test infrastructure (§2.4). The check is one-directional and does not verify semantic adequacy. Adverse-event monitoring is structurally limited by the local-only encrypted memory architecture; defensible substitutes (anonymized rule-compliance telemetry per `src/app/api/chat/route.ts`; opt-in outcome surveys; sentinel-event reporting; IRB-supervised research partnership) are substitutes, not equivalents — the central unsolved problem of the deployment.

Stay deploys to US users in English; the adjudicator names, legal-demand-trigger agencies, and LICENSE-PROMPT copyright-law references are all US-specific. International forks would need to remap each.

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

The author is the sole developer of Stay (free at thestay.app, no revenue, no advertising, funded out of pocket; not incorporated; uninsured). Stay has no commercial-entity backing, for-profit operator, or active accelerator / venture application. The author has unrelated commercial projects in real-estate analytics SaaS and voice-AI tooling (bootstrapped, no VC, no active institutional-investor relationship) — none in mental-health, clinical AI, AI safety governance, or any adjacent domain where this paper's contribution might benefit reputationally. The argument of this paper does not depend on Stay being well-implemented; the package is offered as a pattern to fork or reject. Stay's free, public-good positioning is committed in `LICENSE-PROMPT.md`.

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

*Word count: ~6,500 (FAccT/AIES technical-track range). Figures pending: Figure 1 (three-tool package as composable but not closed-loop); Figure 2 (deployment-pause trigger flowchart with adjudicators and verification windows); Figure 3 (Stay file-level architecture and license boundaries).*
