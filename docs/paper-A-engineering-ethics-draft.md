# Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems: A Combined License, Deployment-Pause Posture, and Rule-Coverage CI Pattern

*Paper A draft v0.1, split from preprint v0.6.5 (2026-04-30) per independent peer-review recommendation. Target venue: FAccT or AIES technical/governance track. Companion paper B (anti-pattern catalog + VERA-MH measurement-validity reading) is in [paper-B-antipattern-catalog-draft.md](./paper-B-antipattern-catalog-draft.md). The agency-trajectory methodology proposal that previously sat alongside this material is preserved as research-program documentation in [preprint-v0.6-draft.md](./preprint-v0.6-draft.md) pending validation work.*

**Authors**: Daming Wu¹

¹ Independent developer, San Jose, CA. Correspondence: hello@thestay.app

---

## Abstract

Deployed AI mental-health systems are reaching tens of millions of users (OpenAI's October 2025 disclosure: ~1.2M weekly ChatGPT users showing suicidal-plan signals; ~560K psychosis/mania signals). The regulatory environment is changing rapidly (FTC 6(b) inquiry of September 2025; FDA Digital Health Advisory Committee deliberations of November 2025; APA Health Advisory of November 2025; *Garcia v. Character Technologies*, M.D. Fla. 2024 → settled 2026-01-07, rejecting First Amendment protection for chatbot output). Despite this, no governance pattern for deployed public-good AI mental-health systems has been published that survives the open-source fork: existing patterns are either closed-commercial-with-internal-review (Therabot, Wysa, Limbic Access) or open-source-without-safety-constraint (most companion / roleplay AIs), and the fork from a constrained closed system to an unconstrained open one has produced documented harm (NEDA Tessa, June 2023).

We propose a three-tool engineering-ethics package: (i) a **restricted-use license on system-prompt text** (`LICENSE-PROMPT.md`) requiring named-section retention and reviewer-of-record substitution for derived deployments — combining Hippocratic-License-style use-restriction, OpenRAIL-style behavioral constraint, and Mozilla-MPL-style file-level copyleft applied to AI prompt sections; (ii) a **self-imposed deployment-pause posture** with externally-auditable trigger conditions, named adjudicators per trigger, and an author-unavailability dead-man switch; (iii) a **CI-enforced rule-coverage check** mapping registered safety rules to behavioral test assertions — a v1 partial implementation of bidirectional traceability borrowed loosely from safety-critical software engineering. Each component has prior art; the contribution is the unified package applied to a deployed public-good AI mental-health system.

We document a search methodology against arXiv, Google Scholar, ACM DL, JMIR archives, and the GitHub open-source license registry through April 2026, finding no published combination of these three tools applied to a deployed AI mental-health system. We offer Stay (free, open-source, deployed at thestay.app) as one operational instance, with concrete code references for each component. We invite forks, criticism, legal review, and clinical adoption.

**What we are NOT claiming**: that the package is a substitute for clinical-grade evaluation, regulatory compliance, or operator liability insurance; that the LICENSE-PROMPT has been tested in court (it has not); that any external party has yet adopted this package as a fork (none has); or that the rule-coverage CI catches semantic regressions (it does not — coverage is one-directional and partial).

---

## 1 · Introduction

### 1.1 The deployment landscape and the governance vacuum

By late 2025 the deployed AI mental-health landscape has bifurcated into two regimes neither of which carries an inspectable governance package.

**Closed-commercial-with-internal-review.** Therabot (Heinz et al. 2025, *NEJM AI*) was developed under six years of expert-curated CBT corpus construction and ran as an actively-monitored RCT with human safety review of every flagged exchange. Wysa (Inkster et al. 2018) holds an FDA Breakthrough Device Designation and is integrated into NHS Talking Therapies. Limbic Access (Habicht et al. 2024, *Nature Medicine*) is the first AI mental-health chatbot to gain UKCA Class IIa medical-device status. These systems have substantive internal governance, but the governance is not externally inspectable: the system prompts, the safety SOPs, the trigger conditions, and the review processes are not published. A grassroots developer cannot fork Wysa; Therabot's weights are not public.

**Open-source-without-safety-constraint.** Character.AI (closed but operating under the open-roleplay paradigm), Replika (Maples et al. 2024), the various MentaLLaMA / SoulChat / EmoLLM open-source mental-health LLMs (Yang et al. 2024 and adjacent work) ship with varying levels of safety scaffolding but no published constraint that prevents stripping it on fork. The fork-removes-safety failure mode is documented: in June 2023 the NEDA helpline replaced human counselors with a generative-augmented "Tessa" chatbot that subsequently produced overt eating-disorder-promoting advice (recommending 500–1,000 calorie/day deficits to ED-recovery users) and was pulled offline within 30 days.

**The regulatory environment.** The FTC issued 6(b) orders in September 2025 to Meta, OpenAI, Character Technologies, Alphabet/Google, and others concerning chatbot companions and youth mental health. The FDA Digital Health Advisory Committee considered generative-AI mental-health devices on November 6, 2025 and recommended Predetermined Change Control Plans, performance monitoring, and double-blind RCTs. The APA issued a Health Advisory in November 2025. The U.S. Middle District of Florida ruled in May 2025 that chatbot output is not protected speech under the First Amendment (the Setzer / Character.AI case settled January 2026). These are not abstract pressures: any deployed AI mental-health system shipping in 2026 is doing so under expanded operator-liability exposure with no clear regulatory pathway.

**The gap.** What is missing in the published deployed-system literature is a governance pattern that is (a) inspectable from outside, (b) constraining when forked, and (c) operable by a single developer or small team without commercial revenue. This paper proposes and operationalizes such a pattern.

### 1.2 Three-tool package

We propose three tools that together compose what we call the *minimum viable safety scaffolding for a deployed public-good AI mental-health system*. We do not claim each tool is novel individually — each has substantial prior art that we cite below. The contribution is the **combination** applied to this **deployment context**, with **search methodology documented** to support the prior-art claim.

1. **A restricted-use license on system-prompt text** (`LICENSE-PROMPT.md`) that requires named-section retention and reviewer-of-record substitution for derived deployments. Section 2.1.
2. **A self-imposed deployment-pause posture** with auditable trigger conditions, named adjudicators per trigger, and an author-unavailability dead-man switch. Section 2.2.
3. **A CI-enforced rule-coverage check** mapping registered safety rules to behavioral test assertions. Section 2.3.

The package's *effective interaction* — not the components in isolation — is what we offer for fork. License without deploy-pause has no enforcement against the deployed instance itself; deploy-pause without license has no enforcement against derived deployments; rule-coverage CI without either is software hygiene, not governance. The three together create a closed loop: license constrains forks; deploy-pause constrains the original; rule-coverage CI feeds both with auditable signal.

### 1.3 What this paper is and is not

This paper is a governance-pattern proposal with one operational instance and a documented prior-art search. It is **not** a clinical-evaluation paper (Stay has no published RCT and is not FDA-cleared), **not** a regulatory-compliance pathway (we are positioned outside regulated medical-device categories deliberately, and §5 lists this as a limitation), and **not** legal advice (the LICENSE-PROMPT has not been tested in court).

The companion paper B contains the empirical work this paper deliberately defers, including the §2 reading of the VERA-MH benchmark, the four-utterance-class anti-pattern catalog, and the §2.7 self-audit on lookup-table effects in the Stay specification. Citations to those findings appear in this paper as motivation but the empirical claims are made there.

---

## 2 · The three-tool package

### 2.1 LICENSE-PROMPT: use-restricted system prompt sections

**The problem.** A deployed AI mental-health system's safety behavior is encoded primarily in its system prompt: which conversational turns trigger crisis SOPs, which utterances are forbidden, how the system behaves under method-driven imminent risk, and what referral resources it surfaces. An open-source release of the system prompt under MIT or similar permissive license enables forks to inspect, learn from, and improve the prompt — but also enables forks to *strip* the safety-critical sections and ship the rest. The polite-request-not-to-strip approach (a README note saying "please don't remove the safety sections") is unenforceable. A copyright-license-level constraint is.

**The construction.** `LICENSE-PROMPT.md` (committed to the public repo at the path implied by the filename) governs the file `src/lib/system-prompt.ts` and any derivative thereof. It grants broad rights — redistribution, modification, commercial use — but restricts modification of four named sections without an externally-documented substitute reviewer:

- **The imminent-risk SOP** (method-driven persuasion + means restriction + companion-during-call).
- **The leverage-prevention rule** (no weaponization of named reasons-for-living).
- **The no-third-party-characterization rule** (no escalating user's frame about partner / parent / friend / etc.).
- **The companion-during-call requirement** (AI stays open while user is on a crisis line).

A derived deployment that modifies any of these sections must publicly name a clinical reviewer-of-record (defined: holding active state licensure in a clinical mental-health discipline with crisis-intervention experience) for the derived deployment, document the modification, and publish the modified text. A derived deployment that *retains* these sections operates under the original LICENSE-PROMPT terms and inherits the deploy-pause posture obligations described in §2.2.

**Lineage.** The license combines three prior patterns:

- **Hippocratic License v3 (HL3, EthicalSource)** — a use-restricted open-source license that prohibits use against vulnerable populations. HL3 has been adopted by various non-mental-health open-source projects (Hippocratic License registry; cited at firstdonoharm.dev). To our knowledge, no deployed AI mental-health system has shipped under HL3 directly, but the pattern of embedding ethical use-restrictions in a software license is the immediate ancestor of LICENSE-PROMPT.
- **OpenRAIL-M family** (BigScience BLOOM 2022; Stable Diffusion v2 2022; OpenRAIL-M licenses for ML weights). OpenRAIL applies behavioral-use constraints to ML model weights. LICENSE-PROMPT extends the constraint target from weights to the *system-prompt-level scaffolding* over a vendor base model — a target OpenRAIL does not address.
- **Mozilla Public License v2 (MPL)** — file-level copyleft. MPL allows mixing MPL-licensed files with other-licensed files as long as the MPL files remain MPL on modification. LICENSE-PROMPT applies the same file-level intuition (the system prompt is one file; the rest of the codebase is MIT) to a different constraint target (named sections within the file, not the file as a whole).

**What is novel in LICENSE-PROMPT versus these ancestors.** None of HL3, OpenRAIL, or MPL has been applied to constrain modification of safety-critical sections within a deployed AI mental-health system's system prompt specifically. The combination is what we claim. Section 4.2 documents the search methodology supporting this novelty claim.

**Limitations of LICENSE-PROMPT** are stated in §5: enforceability has not been tested in court, the legal-instrument quality has not been evaluated by counsel, and the reviewer-of-record-substitution mechanism creates a gating step that some adopters may treat as friction rather than feature. We treat this as the most important external review obligation on the tool — a real lawyer's evaluation is required before LICENSE-PROMPT can be confidently fork-recommended.

### 2.2 Deployment-pause posture with auditable triggers

**The problem.** "We will pause the deployment if something goes wrong" is unenforceable as a public commitment because both *something goes wrong* and *we will pause* are operator-discretionary. A monitoring-without-trigger commitment cannot be audited from outside; a trigger-without-adjudicator-or-deadline cannot either. The deployment-pause posture has to be specific enough that an external reviewer can check whether the operator actually paused when they said they would.

**The construction.** Stay commits to four trigger conditions, each with a named adjudicator, a defined adjudication artifact, and a time bound:

- **Clinician-review trigger.** If no licensed clinician has provided written review of at least one of {imminent-risk SOP, companion-during-call protocol, leverage-prevention rule, per-population SOPs} by 2026-06-30, the companion-during-call feature and method-driven imminent persuasion SOP move behind a feature flag (default off), and the deployed system's positioning text changes from product-mode to "research preview, not for use during active distress." Adjudicator: the author, with the clinician sign-off (or its absence) committed to `docs/clinician-audit.md` by 2026-07-07 as the auditable artifact.

- **Sentinel adverse event trigger.** If a credible report of suspected user death, near-death, or severe iatrogenic harm reaches the project (defined: report from a verifiable identity — clinician, family member with documentation, law enforcement, or media organization — naming a specific date and circumstance), the deployed system enters referral-only mode within 24 hours of receipt, pending external review. Adjudicator: the author for the within-24h pause; an external clinician reviewer (named at the time of pause) for the resume decision.

- **Rule-coverage trigger.** If `npm run check-rule-coverage` shows critical-rule coverage gaps that remain unresolved for >30 days from first failing CI run, deployment is paused until coverage is restored. Adjudicator: the CI check itself (deterministic), with deployment-pause enforcement via a kill-switch in `src/app/api/chat/route.ts` that reads a `DEPLOY_GATE_OPEN` env var set by the CI workflow.

- **Legal-demand trigger.** If the deployment receives a credible legal demand related to user safety — defined: a subpoena, regulatory inquiry (FTC, FDA, state AG), tort complaint, or formal cease-and-desist from a recognized authority concerning Stay's operation or output — the deployed system enters referral-only mode within 48 hours of receipt of legible service, pending counsel review. Adjudicator: the author for the within-48h pause; counsel for the resume decision.

**Why public.** Each trigger is committed to the project's public repo (`docs/deployment-conditions.md`, with the trigger conditions, the named adjudicators, the deadlines, and any past invocations recorded). A trigger that has fired is documented; a trigger that has not fired is documented as not having fired. A skeptical reviewer can check the repo on any date and verify whether the operator is in compliance with their own commitments.

**Lineage.** The closest published precedents are research-trial deployment protocols (Therabot's IRB-supervised deployment paused enrollment in response to flagged exchanges; Wysa's clinical advisory board reviews safety incidents privately) and the safety-cases tradition in safety-critical software engineering (DO-178C, ARP4761), where named conditions and adjudicators are required for certification but not for ordinary operation. We adapt the named-conditions-and-adjudicators pattern from safety-cases to ordinary operator-self-restraint, without the certification scaffolding that DO-178C presupposes.

**What is novel.** No published deployed AI mental-health system has committed to a public, auditable, trigger-and-adjudicator deployment-pause posture of this form, to our knowledge. The closest analogue is the Wysa / Limbic clinical advisory board, which is a governance body but does not publish trigger conditions or pause decisions externally.

### 2.3 Author-unavailability dead-man switch

The deployment-pause posture in §2.2 names the author as the adjudicator on two of the four triggers. This creates a single point of failure: if the author is unavailable (illness, travel, abandonment), the deployed system continues operating without the adjudication mechanism that justifies its operation.

**The construction.** A scheduled CI job (cron at midnight UTC) checks the last-commit-age of the project repo and the last-message-date of the project's incident-response inbox (`hello@thestay.app`). If both exceed 30 consecutive days, the CI job sets `DEPLOY_GATE_OPEN=false` (the same env var consumed by §2.2's rule-coverage trigger). The deployed instance reads this var on each request and, if false, enters referral-only mode for the duration. The author can manually reset the var on return, or a documented successor maintainer can take over the project repo and reset it.

**Honest limits.** This is a soft mechanism. A determined adversary or compromised account could bypass it (set the cron to skip, hard-code the env var, etc.). The mechanism is not a security control; it is a default-safe state under ordinary author-unavailability. We name this as a limit explicitly because the mechanism reads as more robust than it is; readers should not assume it survives adversarial scenarios.

**What is novel.** Open-source projects routinely have abandonment paths (last-commit timestamps, archived-repo statuses, fork-takeover patterns). Deployed-system dead-man switches in the AI mental-health context, defaulting to referral-only mode under operator-unavailability, are not standard practice and we have not located prior published examples. The mechanism is small but the *combination with §2.2's trigger structure* is the contribution.

### 2.4 Rule-coverage CI

**The problem.** Behavioral testing of LLM systems with templated assertions (CheckList; Ribeiro et al. 2020) catches regressions on assertions that were written, but does not catch the case where a safety rule was added to the system prompt but no test was written for it. The rule-test mismatch is the main maintenance hazard in deployed safety-critical conversational systems: a rule that nominally exists in the prompt but has no test will silently regress on prompt-update or model-update.

**The construction.** A hand-maintained `REQUIRED_RULES` registry enumerates the safety rules that must have at least one critical-severity behavioral assertion testing them. Each scenario in the test suite (61 scenarios as of v0.8) contains assertions; each critical-severity assertion carries a `rule:` field naming which `REQUIRED_RULES` entry it tests. The `npm run check-rule-coverage` script enforces: for every entry in `REQUIRED_RULES`, at least one critical assertion references it. The check runs in CI and fails the build if coverage drops to zero on any rule.

**What this catches.** Adding a new rule to `REQUIRED_RULES` without writing an assertion fails CI immediately. Removing all assertions for a rule fails CI immediately. Renaming an assertion's `rule:` field without updating the registry fails CI immediately.

**What this does NOT catch.** Adding a new rule to the system prompt without registering it in `REQUIRED_RULES` is silent — the registry is hand-maintained, and there is no automated check that rules-in-prompt is a subset of rules-in-registry. Three rules in the v0.8 registry (`inviolable.3`, `inviolable.7`, `protocol.8`) are documented as TODO with no critical assertion coverage at the time of writing; the partial coverage is openly admitted in the script's output. Semantic adequacy — whether the assertion actually tests what the rule means — is not checked; an assertion can pass while the rule is misimplemented.

**Lineage.** CheckList's MFT/INV/DIR three-test-type taxonomy is the methodology root. Bidirectional traceability in safety-critical software (DO-178C, ISO 26262, FDA SaMD Premarket Submissions guidance) is the conceptual root for rule-↔-test mapping. We borrow loosely from both: from CheckList, the use of templated behavioral assertions; from safety-critical traceability, the registry-driven coverage check. We are explicit that this is a v1 partial implementation — we do not approach the verification depth those standards demand.

**What is novel.** CheckList has been applied to many domains; we have not located a published application to clinical safety rules in deployed AI mental-health systems with registry-driven coverage gating in CI. Adjacent work (MentaLLaMA, PsyEval) tests classifier accuracy or QA quality; rule-coverage as a deployment-gating CI check is, to our knowledge, new in this domain.

---

## 3 · Stay as one operational instance

### 3.1 Architecture summary

Stay is a Next.js 15 web application backed by `claude-sonnet-4-5-20250929` via Anthropic's API. The system prompt (`src/lib/system-prompt.ts`, ~6,500 tokens at v0.8) is injected on every conversation. User conversations are stored in IndexedDB, encrypted with AES-GCM-256 using a key the browser holds; the server cannot read conversation content. Default retention is 90 days, user-configurable. Crisis tooling, panic-phrase quick-exit, and Stanley-Brown stabilization-window safety planning are implemented in client-side React components.

Concrete file references for this paper's contributions are in the next three subsections.

### 3.2 LICENSE-PROMPT in practice

The system prompt file (`src/lib/system-prompt.ts`) opens with a license header referencing `LICENSE-PROMPT.md`. The four named protected sections are explicitly delimited by comments (`// PROTECTED SECTION: imminent-risk SOP — see LICENSE-PROMPT`). A derived fork that removes these comments removes the indication of which sections are protected, but the license still applies.

The reviewer-of-record substitution clause has not been invoked at the time of writing — no fork has been documented to the project. The clause's first test will be when one occurs.

### 3.3 Deploy-pause triggers wired up

The `DEPLOY_GATE_OPEN` env var is consumed in `src/app/api/chat/route.ts` (the chat-completion API route). When false, the route returns a referral-only response: a brief message acknowledging the user, naming 988 / Crisis Text Line / 911 as appropriate, and explaining that Stay is currently paused for safety review. No conversation is initiated.

The CI cron for the dead-man switch is in `.github/workflows/dead-man.yml` (a GitHub Actions workflow that runs daily, checks repo-last-commit-age via the GitHub API, and sets a Vercel env var via the Vercel API if conditions trigger). The workflow is committed to the public repo.

The clinician-review and sentinel-event triggers are operator-discretionary at the moment of trigger and committed-to-repo as auditable artifacts after.

### 3.4 The 61-scenario test suite + rule-coverage check

The test suite (`scripts/scenarios/`) contains 61 scenarios across 13 categories (suicide, DV, leverage, trauma, psychosis-mania, OCD, ED, substance, threats, caregiver, daily, calibration, parasocial). Each scenario contains a sequence of user turns and a list of behavioral assertions. Six assertion kinds are supported: `must_call_tool`, `must_not_call_tool`, `must_match` (regex pattern present), `must_not_match` (pattern absent), `max_occurrences` (pattern bounded), `judge` (LLM-as-judge evaluates yes/no proposition).

`scripts/check-rule-coverage.ts` enforces the rule-↔-assertion coverage. The current `REQUIRED_RULES` registry contains 33 rules; 30 have critical-assertion coverage; 3 are open TODO and the script's output documents which.

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

**What we found.** Many adjacent works (cited throughout this paper): Therabot's IRB-supervised research deployment, Wysa's clinical-advisory-board governance, Limbic's UKCA Class IIa pathway, MentaLLaMA's open-source fine-tuned classifier with no deployment governance, FAITA-MH's evaluation rubric (Golden & Aboujaoude 2024) without deployment-governance pattern. We found no published combination of the three tools described in §2 applied to a deployed AI mental-health system.

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

**The Stade et al. (2024) READI framework** for responsible LLM deployment in behavioral healthcare is a vocabulary and stage model, not a tool package. READI provides language for what deployment readiness looks like; our package is one concrete realization of some of READI's stage-2 / stage-3 readiness criteria. We position our work as *one operational pattern instantiating* parts of the READI framework, not as a competitor to it.

---

## 5 · Limitations

**The package has not been forked.** As of 2026-04-30, no external party has adopted the three-tool package or any of its components for an AI mental-health deployment of their own. The pattern's portability is asserted, not demonstrated. Forks may surface design defects (license ambiguities, trigger-condition gaps, rule-coverage check brittleness) that the original author cannot see from the inside. We list this as the most important external-validation debt.

**LICENSE-PROMPT has not been legally tested.** A real lawyer has not reviewed the license text, and no enforcement action has been taken under it. The combinational legal status — using HL3 / OpenRAIL / MPL inspirations within a custom-drafted document — is not certain. The license may be unenforceable in some jurisdictions; the file-level copyleft mechanism may interact poorly with derivative-work doctrine; the reviewer-of-record-substitution clause may be challenged as unduly burdensome. We are actively seeking pro-bono review from open-source-license counsel (Software Freedom Conservancy, Electronic Frontier Foundation, university clinics).

**The author is uninsured and unincorporated.** Stay is operated by a single individual without an LLC, without errors-and-omissions or cyber-liability insurance, and without prior legal-demand experience. The deploy-pause posture's legal-demand trigger (§2.2) is responsible operator behavior but does not substitute for incorporation and counsel retention. Any reader considering this pattern as a fork-base should not infer that operating without these protections is recommended; it reflects the author's current resource constraints, not the pattern's design.

**Rule-coverage CI is partial.** Three rules in the v0.8 registry have no critical-assertion coverage. The check is one-directional (registry → assertion), not the reverse. Semantic adequacy of assertions is not verified. We claim the check as v1 partial implementation, not as full bidirectional traceability.

**Adverse-event monitoring is structurally limited.** The local-only encrypted memory architecture forecloses centralized adverse-event monitoring as a privacy-architecture matter. Defensible substitutes (anonymized rule-compliance telemetry per `src/app/api/chat/route.ts` v0.8.1; opt-in outcome surveys; sentinel-event reporting protocol; IRB-supervised research partnership) are listed as substitutes rather than equivalents. The deployment is operating without a feedback loop on harm in the way commercial server-side-storage deployments have one. We treat this as the central unsolved problem of the deployment, not a virtue.

**Single deployment, single operator, single jurisdiction.** Stay deploys to U.S. users in English. The deployment-pause-posture's adjudicator names map to U.S. clinical-license categories; the legal-demand trigger names U.S. federal and state agencies; the LICENSE-PROMPT references U.S. copyright law as the enforcement substrate. International forks would need to remap each of these. The package's design has not yet survived a non-U.S. fork.

---

## 6 · Discussion and invitation

### 6.1 What we are claiming

The three-tool package — LICENSE-PROMPT + auditable deployment-pause posture (with dead-man switch) + rule-coverage CI — is offered as *one realization of one possible governance pattern* for deployed public-good AI mental-health systems. We claim its components have prior art and the combination applied to this deployment context is, by our search, not previously published. We do not claim it is the only possible pattern, that it is optimal, or that adopting it suffices for clinical-grade safety.

The pattern is the contribution; Stay is an instance.

### 6.2 What we want others to do

**Fork or improve the LICENSE-PROMPT.** The drafting was done without legal counsel and the reviewer-of-record-substitution clause was designed without enforcement testing. A second draft from someone with open-source license expertise would strengthen the pattern significantly. We will not treat such a fork as competition — the closer the field gets to a *standard* use-restricted prompt license for safety-critical sections, the better for everyone deploying.

**Fork or improve the deploy-pause posture trigger taxonomy.** Our four triggers (clinician review deadline, sentinel adverse event, rule-coverage failure, legal demand) reflect the threats we currently see; they are not exhaustive. Specific gaps that might warrant additional triggers: data-breach disclosure obligation, model-vendor change of terms (Anthropic policy update affecting Stay's substrate), funding-runway exhaustion (a real condition for a public-good deployment without commercial revenue — see Woebot's June 2025 D2C shutdown for the precedent). Builders deploying under different threat models will need different triggers.

**Adopt or improve rule-coverage CI.** The check is small (~150 lines of TypeScript). Bidirectional checking (verify all rules-in-prompt have entries in `REQUIRED_RULES`) is a natural v2 extension that would close the silent-addition gap §2.4 acknowledged. Semantic-adequacy verification (does the assertion actually test what the rule means) is a much harder open problem and likely requires LLM-as-judge over rule-text + assertion-text pairs.

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
- Dead-man-switch workflow: `.github/workflows/dead-man.yml`.
- Deployment-conditions registry (auditable): `docs/deployment-conditions.md`.

## Conflicts of interest

The author is the sole developer of Stay (free at thestay.app, no revenue, no advertising, funded out of pocket; not incorporated; uninsured). No commercial deployment, for-profit entity, or accelerator/venture application is associated with this paper or with Stay's deployment. The argument of this paper does not depend on Stay being well-implemented; the package is offered as a pattern for other public-good deployments to fork or reject.

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
17. Garcia v. Character Technologies, Inc., M.D. Fla. 6:24-cv-01903, filed October 22, 2024 (settled 2026-01-07).
18. Regulation (EU) 2024/1689 (EU AI Act), Article 14 (Human Oversight).
19. NEDA Tessa eating-disorder chatbot incident, AI Incident Database #545, June 2023.

---

*Word count: ~5,400 (target 5,000–6,000 for FAccT/AIES technical track). Figures pending: Figure 1 (the three-tool package as a closed-loop diagram); Figure 2 (deployment-pause trigger flowchart); Figure 3 (Stay file-level architecture and license boundaries).*
