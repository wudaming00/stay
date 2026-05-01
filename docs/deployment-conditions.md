# Deployment Conditions and Pause Triggers

This file is the **public auditable artifact** for the deployment-pause posture described in [Paper A §2.2 / §2.3](./paper-A-engineering-ethics-draft.md). It enumerates the conditions under which the Stay deployment at thestay.app enters referral-only mode, names the adjudicator per condition, and records any past invocations.

**Reader:** verify any of the assertions below by inspecting the project repo, the GitHub Actions logs (where applicable), or the `/api/admin/heartbeat` GET endpoint at the deployment.

---

## Trigger conditions

### 1. Clinician-review trigger

**Condition.** No licensed clinician (defined: holding active US state licensure as LCSW / LMFT / LPC / clinical psychologist or equivalent jurisdictional license, with crisis-intervention or suicidology experience) has provided written review of at least one of {imminent-risk SOP, companion-during-call protocol, leverage-prevention rule, per-population SOPs} by **2026-06-30**.

**Effect when triggered.** The companion-during-call feature and the method-driven imminent-persuasion SOP move behind a feature flag (default off). The deployed system's positioning text changes from product-mode to "research preview, not for use during active distress."

**Adjudicator.** The author, with the clinician sign-off (or its absence) committed to [`docs/clinician-audit.md`](./clinician-audit.md) by **2026-07-07** as the auditable artifact.

**Status as of 2026-04-30.** `clinician-audit.md` documents zero formal clinician audits of the v0.8 specification. Outreach to candidate reviewers is in progress. Trigger has not yet fired (deadline is 2026-06-30).

### 2. Sentinel adverse event trigger

This trigger has two stages, of which **Stage-2 (verified-hard-pause) is live as a manual operator commitment** and **Stage-1 (automated soft-pause-banner-on-receipt) is design-stage as a v0.9 milestone**. See Paper A §2.2 for the full design rationale.

**Stage-2 (live, manual) — Condition.** A *verified credible* report of suspected user death, near-death, or severe iatrogenic harm reaches the project. Verification requires both (a) a reporting party with a verifiable identity (clinician with state-license-registry confirmation, family member with documentation including death certificate or hospital admission record, law enforcement with badge / agency confirmation, or media organization with masthead and named reporter), AND (b) a specific date and circumstance that can be independently confirmed.

**Stage-2 effect when triggered.** The deployed system enters referral-only mode within 24 hours of *verification* (not initial receipt), pending external review. The pause is invoked manually by the author setting the deployment's heartbeat-store gate to `expired` (the same kill-switch substrate the dead-man-switch uses; see §5 below and Paper A §2.3 / §3.3); this is not an automated pipeline but a documented operator commitment, and the invocation is logged in this file.

**False-report defense (current, manual).** If a report cannot be verified within 24 hours of receipt, it is documented in this file as `received-but-unverified` and no pause is triggered. Reports that fail verification but raise generalized concern (e.g., a credible source naming a pattern without specifics) prompt a review of recent telemetry but do not trigger the deployment pause. Until Stage-1 is automated, the operator's manual judgment is the only mechanism for receipt-side response.

**Stage-1 (design-stage, v0.9) — automated soft-pause-banner-on-receipt.** A future addition would automate receipt-side response: any plausibly-credible report (identified individual, specific date and circumstance) would within 4 hours add a high-visibility safety banner to all chat sessions ("Stay is reviewing a reported safety incident; if you are in crisis please reach 988 / text HOME to 741741 / 911") without triggering the hard pause. Three open design questions block immediate implementation: (a) rate-limiting and de-duplication to prevent griefer-fueled banner-spam, (b) operator-side workflow (intake form, verification queue, dashboard), and (c) banner-removal criteria. Until these are designed and reviewed by a clinical reviewer-of-record, the deployment relies on the manual Stage-2 path.

**Verification-stalled handling.** If verification cannot be completed within 14 days of initial receipt, the report is moved to `verification-stalled` status. Until Stage-1 is automated, the operator does not take public action in this state beyond the documentation; the question of whether to banner-warn at this point is one of the open Stage-1 design questions.

**Adjudicator.** The author for both the documentation and the manual hard-pause invocation; an external clinician reviewer (named at the time of hard pause, drawn from the `clinician-audit.md` roster) for the resume decision.

**Status as of 2026-04-30.** No reports received. Stage-1 automation: not implemented (design-stage). Stage-2 manual hard-pause: live commitment, untested in practice.

### 3. Rule-coverage trigger

**Condition.** `npm run check-rule-coverage` shows critical-rule coverage gaps that remain unresolved for **>30 days** from first failing CI run.

**Effect when triggered.** Deployment is paused until coverage is restored.

**Adjudicator.** The CI check itself (deterministic) at [`.github/workflows/check-rule-coverage.yml`](../.github/workflows/check-rule-coverage.yml). The check runs on every push and pull request to main and fails the build on coverage gap.

**Enforcement mechanism.** Currently the rule-coverage CI failure blocks merge to main via branch protection. Hard deployment-pause enforcement (kill-switch) is not yet wired through the CI gate; this is a v0.9 milestone. The current enforcement is "merge to main fails" rather than "deployment immediately pauses on CI failure"; see [Paper A §5 limitations].

**Status as of 2026-04-30.** `npm run check-rule-coverage` reports `33 covered, 0 uncovered`. The CI check passes. There is, however, a related registry-omission gap that is openly documented in `scripts/check-rule-coverage.ts` source comments: three spec rules (`inviolable.3` "never assert another's intent," `inviolable.7` "no comparison to others," `protocol.8` "rupture/repair check-in") and two v0.8 agency-trajectory functions (`agency.memory`, `agency.logger`; the registry source uses `_TODO` suffix to flag them as future-work) are *deliberately omitted* from `REQUIRED_RULES` because they require test infrastructure not yet built (long-conversation scenarios for protocol.8, multi-session harness for the agency functions). The rule-coverage trigger checks the registered rules and is in healthy state; the *registry-omission* gap is documented in [Paper A §2.4 / §5 limitations] as a v0.9 milestone, not a deployment-pause condition.

### 4. Legal-demand trigger

**Condition.** The deployment receives a *verified* credible legal demand related to user safety. Definition includes:
- A subpoena or regulatory inquiry (FTC, FDA, state AG) verified through the issuing authority's public docket (e.g., PACER, state regulator filings registry) or direct phone confirmation to the issuing office;
- A tort complaint filed in court (PACER-checkable);
- A cease-and-desist from counsel-of-record (firm verifiable in the relevant state bar registry).

**Verification window.** **72 hours from receipt.** This window is calibrated to a single-author operator without retained counsel; counsel-verified verification is the longer path and a 24h window would frequently produce false-positive pauses on demand letters that turn out to be malformed, mis-targeted, or fraudulent. If verification cannot be completed within 72 hours, the demand is documented here as `received-pending-verification` and a soft-pause warning banner is added to the deployment (informing users that an unverified legal demand is in the verification pipeline) without triggering a hard pause.

**Effect when triggered.** The deployed system enters referral-only mode within 24 hours of *verification* (not receipt), pending counsel review.

**Adjudicator.** The author for the within-24h-of-verification pause; counsel for the resume decision (counsel to be named in this file at the time of pause).

**Status as of 2026-04-30.** No legal demands received.

### 5. Author-unavailability dead-man-switch trigger

**Condition.** The deployment receives no valid heartbeat from the external scheduler for **>7 days** (validity window) — see [`src/lib/heartbeat-store.ts`](../src/lib/heartbeat-store.ts) for the validity / warning windows. Valid heartbeats are HMAC-signed timestamps verified by [`src/app/api/admin/heartbeat/route.ts`](../src/app/api/admin/heartbeat/route.ts).

**Warning mode.** Between 48 hours and 7 days of heartbeat silence, the deployment continues serving but adds a banner to the chat response informing users that the operator may be unavailable and naming 988 / Crisis Text Line / 911 as appropriate channels for active distress. The warning mode is a softer-than-pause posture calibrated to single-author normal life (weekend illness, family emergency, international travel with bad cell service all routinely produce 48-72h heartbeat gaps).

**Effect when triggered (after 7 days).** The deployed system enters referral-only mode. Recovery requires the author (or a documented successor maintainer) to fire a fresh valid heartbeat.

**Adjudicator.** The deployment itself (deterministic check on every request).

**Persistence limitation.** The current heartbeat store is module-level memory, which does not survive Vercel cold-starts. See [`src/lib/heartbeat-store.ts`](../src/lib/heartbeat-store.ts) for the rationale and [Paper A §5 limitations] for the production-grade-persistence v0.9 milestone.

**Status as of 2026-04-30.** External scheduler not yet configured. The endpoint is implemented and the gate logic is in place; the daily heartbeat from cron-job.org is a v0.9 wiring task. Until configured, the deployment runs in `unknown` heartbeat status which is treated as healthy (cold-start semantic). This means the dead-man switch mechanism is currently in *demo / API-validated* state, not in *production-active* state.

---

## Past invocations

(None as of 2026-04-30.)

When a trigger fires, an entry is added here with:
- Date / time of trigger firing (UTC)
- Trigger condition that fired
- Verification path (where applicable)
- Adjudicator decision
- Resume date / time (when resumed)

---

## Where to verify

- **Rule-coverage CI status**: [`.github/workflows/check-rule-coverage.yml`](../.github/workflows/check-rule-coverage.yml) and the GitHub Actions tab of the public repo.
- **Heartbeat status (real-time)**: GET https://thestay.app/api/admin/heartbeat (no auth — observability endpoint).
- **Rule-coverage script (run locally)**: `npm run check-rule-coverage` from the project root.
- **System-prompt protected sections**: [`src/lib/system-prompt.ts`](../src/lib/system-prompt.ts), search for `PROTECTED SECTION` markers.
- **Clinician audit roster**: [`docs/clinician-audit.md`](./clinician-audit.md).
- **License**: [`LICENSE-PROMPT.md`](../LICENSE-PROMPT.md).

---

*Last updated: 2026-04-30. This file is committed to the public repo and is intended to be auditable from outside the project. Readers identifying inaccuracies or missing trigger conditions are invited to open an issue.*
