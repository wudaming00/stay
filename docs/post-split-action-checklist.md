# Post-Split Action Checklist

Created 2026-04-30 after v0.6.6 commit (paper split into A + B). Items below require human action — legal, financial, relational, or engineering work that the AI assistant cannot do alone.

Time-sensitive items at top. Update this file as you complete each.

---

## 🚨 Tier 1 — This week (legal protection; high cost of delay)

These items reduce operator-liability exposure that the *Garcia v. Character Technologies* ruling (M.D. Fla. 2024 → settled 2026-01-07, rejected First Amendment defense for chatbot output) crystallized. The deployment is currently exposed because the operator is uninsured and unincorporated.

- [ ] **Register an LLC** in California (or Delaware C-corp if you anticipate raising). Use Northwest Registered Agent or LegalZoom for fastest path. ~$100 + ~$800 California franchise tax annually.
  - *Why this week:* personal liability is direct without an LLC; one tort complaint reaches your house, your savings, your future income.
  - *Doesn't require:* lawyer, accountant, complex paperwork. ~1 hour to file online.
  - *Deliverable:* LLC formation document; transfer thestay.app domain ownership and Vercel/Anthropic billing to the LLC.

- [ ] **Add explicit Terms of Use update** at thestay.app/terms naming the LLC as operator, naming the LICENSE-PROMPT for derivative use, naming the deployment-pause posture from §5 of the preprint as the operator's commitment to users.
  - *Why this week:* current /terms is "draft, pending legal review" per README; this is exposure.

- [ ] **Open issues / requests** to two of: Software Freedom Conservancy (sfconservancy.org), Electronic Frontier Foundation (eff.org), Stanford CIS (Center for Internet & Society). Ask for pro-bono review of `LICENSE-PROMPT.md`.
  - *Why this week:* you cannot rely on LICENSE-PROMPT in the §6.2 invitation-to-fork without a real lawyer's eye. The pro-bono pipelines are slow (~6-12 weeks); start now.
  - *Specific contact path:* Stanford CIS's Juelsgaard Clinic does pro-bono work for non-profits and public-interest projects; cyberlaw@law.stanford.edu.

## 🟠 Tier 2 — This month (sustainability + clinician audit)

The §5 of the preprint commits to a clinician-of-record sign-off by **2026-06-30** as the trigger that, if missed, moves companion-during-call and method-driven imminent-risk SOP behind a default-off feature flag. That deadline is two months out.

- [ ] **Apply to Anthropic Era grant** (econometrica.foundation/era or Anthropic Fellows program — if you haven't already). Stay's positioning aligns directly with Anthropic's stated well-being mission.
  - *Deliverable:* completed application + receipt confirmation; commit application metadata (not full text) to `docs/grant-applications-log.md`.

- [ ] **Apply to Manifund regrantor pool** (manifund.org). $5K target; multiple regrantors fund mental-health / AI-safety adjacent projects.

- [ ] **Apply to Mozilla Technology Fund** (foundation.mozilla.org/en/what-we-fund/awards/technology-fund/) if cycle is open; aligns with open-source + public-interest positioning.

- [ ] **Outreach to one academic PI** for institutional partnership. Specific candidates and rationale:
  - **Nick Jacobson (Dartmouth)** — Therabot lead author. Rationale: closest published analogue; Therabot trial used continuous psychologist supervision; Stay's deployment-pause posture is in the same family of governance pattern.
  - **Munmun De Choudhury (Georgia Tech / now FAccT-MH community)** — co-author of Pendse on "Therapeutic Alignment" and *The Typing Cure* (CSCW 2025). Rationale: methodological alignment.
  - **Adam Miner (Stanford)** — Stanford Psychiatry + AI; long history of LLM mental-health work.
  - **Sherry Pagoto (UConn)** — digital health intervention research; less LLM-focused but high-quality methodology.
  - *Deliverable:* one outreach email sent; commit to `docs/outreach/` directory with redacted log.

- [ ] **Identify and contact one clinical reviewer-of-record candidate** specifically for the v0.8 spec audit. Specific candidate types:
  - Suicide-prevention researchers (SPRC, Columbia Lighthouse, AFSP research grantees)
  - DBT-trained clinicians (Linehan Institute network)
  - 988 operations leaders (988 Lifeline staff, Crisis Text Line clinical leadership)
  - DV-specific clinicians (Strangulation Training Institute, NCDV Hotline clinical staff)
  - *Note:* clinical-reviewer-of-record is a meaningful commitment for the reviewer (their name on the deployment); offer modest honorarium ($500–1K from grants) if budget allows.
  - *Deliverable:* one written request sent; tracked in `docs/clinician-audit.md`.

## 🟡 Tier 3 — Next 1-2 weeks (Paper B experiments)

These unblock Paper B submission to NeurIPS Safe & Trustworthy AI workshop. Total cost: ~$50–100, ~1 evening of work.

- [ ] **Multi-judge × multi-model VERA-MH replication** (~$30-50). Run §3.2 plan in [paper-B-antipattern-catalog-draft.md](./paper-B-antipattern-catalog-draft.md):
  - 9 personas × 6 turns × 2 SUTs (Raw Claude, Stay v0.8) × 3 judge models (Sonnet 4.5, GPT-5, Gemini 2.5)
  - Existing `scripts/scenarios/runner.ts` supports `--provider=` flag via OpenRouter
  - *Deliverable:* `data/vera-mh-runs/2026-MM-DD-multijudge/` directory committed; §4.3 of Paper B populated.

- [ ] **Utterance-ablation experiment** (~$10-20). Run §3.3 plan:
  - For each of 4 utterance classes, surgically remove from Raw Claude's Omar turn-3 response
  - Re-judge each modified response with each of the 3 judge models
  - 4 ablations × 3 judges = 12 single-response judgments + control comparisons
  - *Deliverable:* `data/utterance-ablation-2026-MM-DD/` committed; §4.4 of Paper B populated.

- [ ] **Cross-persona recurrence check** (free; existing transcripts). Code presence/absence of each of 4 utterance classes in raw-Claude turn-3 responses across all 9 personas.
  - *Deliverable:* §4.5 of Paper B table populated.

After all three: Paper B is submission-ready. Pass to Paper A revision next.

## 🟢 Tier 4 — Next 4-8 weeks (Paper A + B revision passes)

- [ ] **Paper A v0.2 revision pass** (no experiments needed):
  - Add Figure 1 (three-tool package as closed-loop diagram)
  - Add Figure 2 (deployment-pause trigger flowchart)
  - Add Figure 3 (Stay file-level architecture and license boundaries)
  - Tighten §4 prior-art search description with specific paper-counts at each search step
  - Add appendix: complete LICENSE-PROMPT text reproduced
  - Target final word count: ~6,500-7,000 (FAccT/AIES range)

- [ ] **Paper B v0.2** with experiments populated.

- [ ] **Submit Paper A** to nearest-deadline FAccT or AIES track. Check both venues' 2026 / 2027 calls; FAccT generally has July deadline for following year, AIES varies.

- [ ] **Submit Paper B** to NeurIPS Safe & Trustworthy AI workshop (typical timing: late summer / early fall).

## 🔵 Tier 5 — Ongoing (operational hygiene)

- [ ] **Wire up `DEPLOY_GATE_OPEN` env var consumer** in `src/app/api/chat/route.ts` if not already. Returns referral-only response when false.

- [ ] **Implement dead-man-switch GitHub Actions workflow** at `.github/workflows/dead-man.yml` per §2.3 of Paper A. Daily cron checking last-commit-age via GitHub API; sets Vercel env var via Vercel API if conditions trigger.

- [ ] **Create `docs/deployment-conditions.md`** as the auditable artifact for §5 trigger conditions and any past invocations. Public-readable.

- [ ] **Bentley (VERA-MH first author) advance-courtesy email**: send when Paper B has experiments completed, before submission. Subject: "FYI — Paper B uses VERA-MH commit f4a0c2e as test bed." Brief, professional. Avoid surprise.

- [ ] **Update `docs/clinician-audit.md`** monthly with status of clinical-reviewer-of-record outreach, even if no progress. Auditable artifact.

- [ ] **Quarterly `docs/sustainability-status.md`** entry: current funding runway, grant pipeline, partnership status. Visible commitment to operating responsibly under the funding model.

---

## What's NOT on this list (deliberately)

- **Cultural multiplicity in the system prompt** (intra-US Latino, Asian-American, Black, immigrant agency frames). This is product-side work that doesn't gate paper submission. Park as a v0.9 or v1.0 spec design item; don't let it block the paper submissions.

- **Agency-trajectory methodology Paper C.** Defer until validation pilot is run with WEMWBS concurrent anchor + IRB protocol + clinician co-author. Realistic timeline: 2027 Q1+.

- **Replacing Sonnet 4.5 substrate.** Even if Anthropic releases 4.6 / 5.0, Stay's design is substrate-version-agnostic; substrate updates do not need to gate paper submissions.

- **Self-host enablement / one-click deploy.** Currently README warns against this. Open this only after LICENSE-PROMPT is legally reviewed and a clinician-of-record process is ramped up.

---

*Last updated: 2026-04-30. Edit this file as items complete.*
