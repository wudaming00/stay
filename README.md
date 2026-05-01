# Stay

**A tool you use to understand yourself more clearly — and reach the rest of your mental health ecosystem more effectively.**

Live at [thestay.app](https://thestay.app).

Stay is a free, open-source AI you can talk to in moments where you can't —
or shouldn't — be alone. It listens. It helps you find the words for what
you actually feel and what you actually need to say. It surfaces patterns
across your conversations. It helps you navigate to the right professional
help when you need it. Then it lets you go.

It is **not therapy**. It is not a friend. It is not a replacement for
988 or any human crisis line. It is a translation layer between distress
and the resources you already have — your own thinking, your relationships,
your therapist, your future self, the trained humans who pick up the phone
when ten minutes is what's left.

---

## What this repo is

The complete source for Stay — the web app, the system prompt, the crisis
SOPs, the safety architecture, and the design documents that explain every
design choice.

Publishing this is deliberate. For a product that asks people to trust it
with their worst hour, the rules of engagement shouldn't be a black box.
If you see something wrong, I want to hear about it.

## The principle that shapes everything

Every interaction with Stay should leave the user more able to navigate
their own life — more able to articulate what they're feeling, more clear
on what they need, more aware of their own patterns, more confident about
which human resource to reach when. Not more dependent on Stay.

This is the test for every response Stay generates. We call it the
**agency-trajectory test**: did this turn make the user more capable, or
less? It is the unifying frame for the seven functions Stay performs and
the bounds on what Stay won't do.

The framework's user-facing summary is at the deployed
[/promises](https://thestay.app/promises) page. The academic articulation
is split across two papers:
[docs/paper-A-engineering-ethics-draft.md](./docs/paper-A-engineering-ethics-draft.md)
(engineering-ethics scaffolding — license, deployment-pause posture,
rule-coverage CI) and
[docs/paper-B-antipattern-catalog-draft.md](./docs/paper-B-antipattern-catalog-draft.md)
(four-utterance-class anti-pattern catalog + measurement-validity reading
of the leading benchmark). The pre-split unified preprint is preserved at
[docs/preprint-v0.6-draft.md](./docs/preprint-v0.6-draft.md) for citation
continuity. The earlier "Constitution v0" framing document and earlier
preprint versions are at [docs/archive/](./docs/archive/) (no longer the
authoritative versions; see `docs/archive/README.md`).

## What Stay does

Seven functions. Each one ends when the user has internalized the skill
or insight enough to do it without Stay. None of them is something Stay
does for the user indefinitely.

1. **Translator** — finding words for what you can't yet articulate
2. **Mirror** — surfacing patterns you might not see in yourself
3. **Long memory** — remembering across sessions, on your device, you
   own the data, 90-day default retention
4. **Therapy navigator** — modality education, find-a-therapist, first
   session prep, when-to-switch indicators
5. **Bridge with companionship** — to 988, Crisis Text Line, DV hotline,
   friends — Stay stays open while you call, you can type during the
   call, post-call check-in is opt-in
6. **Logger** — DBT-style structured journaling, conversational input,
   trends are yours, exportable to therapist
7. **Skill teacher** — DBT skills, breathing, grounding, NVC translation
   — taught fully, then handed off ("this is yours now")

## What makes Stay different

- **Free forever, for everyone.** No account required, no freemium, no
  ads, no data sold. Users don't pay. Ever.
- **Encrypted on your device.** Conversations live in IndexedDB,
  encrypted with a key your browser holds. We have no server-side
  database of your conversation content. We cannot read what you write.
- **Designed against engagement.** No streaks. No notifications. No
  guilt for the gap. The goal is for you to feel better and leave.
- **Companion-during-call.** When you reach for 988 or any crisis line,
  Stay does not exit. The window stays open. You can type during the call.
  Stay's job is to be the bridge to the human voice and the scaffolding
  through it — not to substitute for it.
- **DV-aware from day one.** Quick exit button + Escape key, panic
  phrase, neutral tab title, DV-specific crisis response.
- **Open constitution.** See [/promises](https://thestay.app/promises).
  The AI's rules of engagement are public.

## What's inside

```
docs/
  paper-A-engineering-ethics-draft.md   Primary paper: governance package
                                        (LICENSE-PROMPT + deployment-pause
                                        posture + rule-coverage CI)
  paper-B-antipattern-catalog-draft.md  Companion paper: four-utterance-class
                                        anti-pattern catalog + measurement-
                                        validity reading of VERA-MH
                                        (position-paper, NeurIPS workshop track)
  preprint-v0.6-draft.md                Pre-split unified preprint, preserved
                                        for citation continuity
  deployment-conditions.md              Public-auditable trigger registry for
                                        the deployment-pause posture
  clinician-audit.md                    Public log of clinical reviewer-of-record
                                        outreach + audit progress
  clinician-meeting-memo-template.md    Template for post-audit memos
  research-basis-v0.en.md               Citations for every design choice
  research-alignment.md                 Where Stay aligns with adjacent research
  competitive-landscape-2026-04.md      Where Stay sits vs Woebot / Wysa / etc.
  red-team-prompts.md                   90-min friend-test scenario pack
  about-blog-post-draft.md              User-facing intro draft
  zenodo-submission-metadata.md         Paste-ready metadata for Zenodo submission
  archive/                              Superseded design / preprint versions
                                        (see archive/README.md for old → new map)

LICENSE-PROMPT.md                       Restricted-use license on system-prompt.ts
                                        — see §1.a–§1.d for the four protected
                                        sections (imminent-risk SOP, leverage-
                                        prevention rule, no-third-party-
                                        characterization rule, companion-during-
                                        call requirement)

src/
  lib/system-prompt.ts                  The operational prompt (v0.8 — agency-
                                        trajectory). Has <!-- PROTECTED SECTION
                                        --> HTML markers around the four
                                        LICENSE-PROMPT §1.a–§1.d sections.
  lib/heartbeat-store.ts                Dead-man-switch heartbeat persistence
                                        (7-day validity / 48h warning windows)
  lib/resources.ts                      Hardcoded crisis + professional referrals
  lib/storage.ts                        IndexedDB + retention
  lib/crypto.ts                         WebCrypto AES-GCM-256
  lib/panic.ts                          Panic phrase
  lib/insights.ts                       Starred user sentences
  app/api/chat/route.ts                 Anthropic API integration with tool
                                        calling + heartbeat-status gate +
                                        warning-banner SSE emission
  app/api/admin/heartbeat/route.ts      HMAC-SHA256 verified heartbeat endpoint
                                        (replay-protection drift window)
  app/api/telemetry/route.ts            Anonymous rule-compliance telemetry
                                        (no conversation content)
  app/promises/                         Public Constitution / Promises page
  app/privacy/                          Privacy details
  app/resources/                        Crisis and therapist referral directory
  app/terms/                            Terms of Use (draft, pending legal review)
  app/faq/                              Common questions
  app/settings/                         Data controls, panic phrase, kept insights
  app/about/                            Why Stay exists
  app/architecture/                     Architecture page (privacy + storage +
                                        identity model, user-facing version)
  app/insights/                         User's starred / kept sentences across
                                        sessions (the "Long memory" function)
  app/draft-message/                    Standalone "help me draft what to say to
                                        someone" page (the "Translator" function)
  app/help-someone/                     Standalone "I'm worried about someone
                                        else" page (the "Caregiver" mode)
  components/Chat.tsx                   The main conversation UI
  components/SafetyPlanCard.tsx         Stanley-Brown safety plan generator
  components/QuickExit.tsx              DV-shelter emergency exit button
  components/AgeGate.tsx                18+ self-attest

scripts/
  scenarios/                            61-scenario behavioral test suite
  run-scenarios.ts                      Test-suite runner (provider-agnostic
                                        via OpenRouter)
  test-tier1-comparison.ts              v0.6 vs v0.7 paraphrase-robustness
                                        self-audit (Paper B §4.6)
  check-rule-coverage.ts                Rule-↔-assertion CI invariant check
                                        (33 rules, 0 uncovered at v0.8)
  reproduce-section-2.md                Reproduction instructions for the
                                        VERA-MH §2 illustrative case

.github/workflows/
  check-rule-coverage.yml               CI workflow: runs npm run check-rule-
                                        coverage on push + PR to main, blocks
                                        merge on coverage failure

data/
  vera-mh-runs/2026-04-28/              Full transcripts for the §2 illustrative
                                        case (9 personas × 2 systems × 6 turns)
  experiments/v0.8/                     Pre-registered v0.8 experiment artifacts
                                        (frozen specs, hypotheses, rubric)
  tier1-comparison-2026-04-29.json      Raw data for the §4.6 self-audit
```

## What this repo is NOT

- Not a clinically validated product. There are no published outcomes.
- Not FDA-cleared (see [Wysa](https://www.wysa.com) if you need that).
- Not a therapy replacement.
- Not a finished product. v0. Expect rough edges.

## If you want to run it locally (development / inspection)

```bash
# Requirements: Node 20+, an Anthropic API key (console.anthropic.com)
git clone https://github.com/wudaming00/stay.git
cd stay
npm install
cp .env.local.example .env.local
# edit .env.local, add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## ⚠️ If you want to deploy a fork to real users — read this first

This repo is the source of an authored deployment at thestay.app, not a
turnkey template for shipping a mental-health AI to real users. Running
this code unmodified or modified to serve real users in distress carries
specific obligations that go beyond the MIT license:

1. **The system prompt is under [LICENSE-PROMPT.md](./LICENSE-PROMPT.md),
   not MIT.** Derived deployments may not remove or weaken any of the
   four named protected sections (LICENSE-PROMPT §1.a–§1.d): the
   imminent-risk SOP, the leverage-prevention rule, the no-third-party-
   characterization rule, or the companion-during-call requirement
   (designated *preserved-pending-clinical-validation*) without (a)
   naming a clinical reviewer-of-record for the derived deployment
   publicly per LICENSE-PROMPT §2, and (b) documenting which sections
   were modified and why. This is a copyright-license-level constraint,
   not a suggestion.

2. **Operator liability is real.** In *Garcia v. Character Technologies*
   (M.D. Fla. 6:24-cv-01903), Judge Anne Conway's May 20 2025 ruling
   denied Defendants' motion to dismiss on First-Amendment-defense
   grounds, allowing tort claims (negligence, product liability,
   wrongful death, FDUTPA) to proceed; the case settled on
   January 7 2026 with terms undisclosed (NYT, CNBC, Guardian, CNN,
   JURIST). The Conway ruling remains the substantive precedent on
   AI-chatbot tort exposure regardless of the settlement. Whoever
   deploys an AI mental-health system to real users carries tort
   liability for the harm that system causes — open-source status does
   not transfer that liability, and operators cannot rely on the
   author of this repo for indemnification.

3. **No clinician-of-record audit has been completed on this deployment.**
   The author is a single non-clinician developer. Stay's safety SOPs
   are clinical interpretations grounded in published literature but
   have not been validated by a licensed mental-health professional in
   formal audit (this is documented in the preprint as a debt, not a
   virtue). A fork that ships to real users without commissioning that
   audit independently is shipping clinical content under non-clinical
   review.

4. **No FDA / UKCA / CE pathway.** Stay is positioned outside regulated
   medical-device categories. A fork that markets itself as a treatment
   tool, makes outcome claims, or serves clinical populations may
   trigger regulatory obligations the original author has not navigated.

5. **Adverse-event monitoring is structurally limited** by the
   local-only encrypted storage architecture. A production deployment
   to a vulnerable population without an opt-in monitoring substitute
   (sentinel-event protocol, IRB-supervised research partnership,
   anonymized telemetry) is operating without a feedback loop on harm.

If you intend to deploy a fork to real users, please open an issue or
email **hello@thestay.app** to coordinate. The license-prompt
reviewer-of-record process exists specifically to make this safer.

For research or inspection use (running the code locally to study the
prompt, audit the safety architecture, or reproduce experiments in the
preprint) none of the above applies; that's exactly what the open repo
is for.

## Reporting safety issues

If you try Stay and find a place where the AI responds in a way that
could harm someone — escalates a crisis, gives bad advice, misses a clear
warning sign, recommends something dangerous — please email
**hello@thestay.app** with the conversation (or a description). I read
every one personally.

If you would like to share a conversation (good or bad) to help improve
Stay, use **Settings → Download** to export it, then email it. Everything
is anonymous; I never see your identity.

## Reporting security issues

Please email **hello@thestay.app** rather than opening a public issue for
anything that could expose users' data. I will respond quickly.

## For therapists and researchers — graduated first-contact options

If you are a licensed mental-health professional or a researcher in this
field, three first-contact paths exist, in increasing order of commitment.
Pick whichever fits — none assumes you'll do more than the next step.

1. **Informal feedback (15 min, free).** Email
   **hello@thestay.app** with a paragraph of impressions after browsing
   the repo or trying [thestay.app](https://thestay.app). I'll read every
   one personally; I will not pressure you for more.

2. **Paid 90-min consult (one session) — currently in development.** If you'd
   like to spend a focused hour and a half walking through specific SOPs
   (recommended: the imminent-risk SOP, the leverage-prevention rule, and
   one per-population SOP of your choice — DV / NSSI / OCD / ED / mania /
   psychosis / trauma / substance), against transcripts you bring from
   your own crisis-intervention work, the *intent* is to offer paid
   consultation bookings; this path is **not yet operational** because
   the supporting infrastructure (LLC formation per
   [`docs/deployment-conditions.md`](./docs/deployment-conditions.md);
   published rate sheet; intake template with confidentiality terms
   appropriate to clinician-brought transcripts; `docs/clinician-audits/`
   directory for the deliverable memo) has not yet been built. We name
   the path in this README because a senior-clinician reviewer
   specifically suggested it as the right first-contact format and we
   want it on the roadmap publicly. Until it is operational, please use
   path (1) above — informal feedback by email — and we will reply with
   rate, intake, and scheduling details if you indicate interest in
   converting that into a paid consult. Honest expectation: this path
   becomes operational in the v0.9 milestone parallel to LLC formation
   and the dead-man-switch external-scheduler wiring.

3. **Reviewer-of-record on the deployment.** This is a months-of-volunteer
   commitment (Stay's `LICENSE-PROMPT.md` reviewer-of-record requires
   active state licensure in a clinical mental-health discipline with
   crisis-intervention experience, willingness to have your name
   published as the deployment's clinical reviewer, and standing
   availability for adverse-event consultation). Stay's
   [`docs/clinician-audit.md`](./docs/clinician-audit.md) has the full
   audit worksheet, and [`docs/deployment-conditions.md`](./docs/deployment-conditions.md)
   §1 describes the role and the 2026-06-30 deadline. Email
   **hello@thestay.app** with "reviewer-of-record interest" if you'd like
   to discuss the commitment in detail. **Note: as of 2026-04-30, no
   reviewer-of-record has been engaged**, so a candidate engaging now is
   the first; this is a different commitment than joining an existing
   roster, and a 30-min conversation about scope is the right first step
   even before a paid consult.

Path (2) is the recommended starting point for senior clinicians who
want to engage substantively but have not yet decided whether to take on
(3). It also generates concrete useful output (the consult memo)
regardless of whether the engagement progresses to (3).

## License

Test suite, runner, and methodology infrastructure: **MIT**. See
[LICENSE](./LICENSE).

The system prompt itself (`src/lib/system-prompt.ts`): **restricted-use
license** — see [LICENSE-PROMPT.md](./LICENSE-PROMPT.md). Derived works
may not remove four named protected sections — §1.a the imminent-risk
SOP, §1.b the leverage-prevention rule, §1.c the no-third-party-
characterization rule, or §1.d the companion-during-call requirement
(designated *preserved-pending-clinical-validation*) — without naming
a clinical reviewer-of-record for the derived deployment per
LICENSE-PROMPT §2 reviewer-of-record disclosure terms.

Using this code to build a mental-health product that does the opposite
of what Stay stands for — engagement maximization, data monetization,
freemium-gating of crisis support — is permitted by the MIT-covered
parts of the license. It is not permitted by decency, and the prompt
license forbids stripping the safety-critical rules.

## Credits

Built by one person in 2026. The philosophy draws on the work of many —
Carl Rogers, John Gottman, Marshall Rosenberg, Stanley & Brown, Jacquelyn
Campbell, Marsha Linehan, William Miller & Stephen Rollnick, Cathy
Barber + Means Matter, and the counselors at 988, Crisis Text Line, and
the National DV Hotline whose actual labor this software can only hope
to support — never replace.
