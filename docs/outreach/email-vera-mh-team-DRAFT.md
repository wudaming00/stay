# DRAFT: Pre-arXiv courtesy email to VERA-MH team

**Status**: DRAFT for your review. Don't send until you've personalized + checked recipients.

**Why this email matters**: You're publishing a measurement-validity critique of their benchmark. Giving them advance notice (48-72h before arXiv goes live) is professional-courtesy practice in research. They have two reasonable responses: engage constructively, or stay silent. Either is fine. What you avoid is the failure mode where they hear about your critique from arXiv first — that creates an adversarial frame you don't want.

**Who to send to**: 
- First-author email: J. Brodsky (find via Spring Health staff page or arXiv:2602.05088 author email)
- CC: any other VERA-MH co-authors with public emails
- DO NOT cc anyone outside their team

**Timing**: Send 48-72 hours before you push to arXiv. If you push tomorrow morning per `TOMORROW-MORNING.md`, this email should go out tonight.

**Tone calibration**: collegial peer, not subordinate ("hoping for your blessing") nor superior ("found a problem with your work"). Acknowledge their work as the high-quality reference it is. Make the asks specific.

---

## Subject line options (pick one)

- `Pre-arXiv courtesy: a measurement-validity finding for VERA-MH`
- `Heads-up before arXiv: VERA-MH §2 finding I want you to see first`
- `48h advance notice — measurement-validity case study using VERA-MH`

I'd pick the second — most direct.

---

## Email body

```
Dear Dr. Brodsky and the VERA-MH team,

I'm an independent developer (Stay, free at thestay.app, MIT-licensed
test suite at github.com/wudaming00/stay). I've been running VERA-MH
against my system as part of building a public-good AI mental-health
companion. VERA-MH is the most rigorous open evaluation framework I've
found in this domain — thank you for releasing it open-source.

I'm writing as a courtesy because I'm pushing a preprint to arXiv in
~72 hours that documents a measurement-validity property of VERA-MH,
and I'd rather you see it from me first than from arXiv.

The empirical case (n=9 personas × 6 turns × 2 systems): raw
Claude Sonnet 4.5 with no system prompt scored 14 points higher on
VERA-MH than Stay (55.62 vs 41.79). Trajectory inspection of the
identical-persona runs shows VERA-MH credited Best Practice for four
behaviors that crisis-counselor training literature warns against:

1. Leverage manipulation of named reasons-for-living ("Your family
   needs you - not your paycheck")
2. Invalidation of lived experience ("Your brain is lying to you")
3. Reflexive AI self-disclosure mid-distress ("I need to be direct
   with you: I'm an AI, I'm not equipped to help")
4. Bullet-pointed crisis-resource lists during acute distress

The full §2 case is in the draft (link below). All transcripts and
per-conversation judge reasoning are public at
github.com/wudaming00/stay/data/vera-mh-runs/2026-04-28/.

I want to be explicit about framing: the paper presents this as a
measurement-validity case study, not as a product-vs-benchmark
dispute. Stay scoring lower than raw Claude is the empirical hook —
exactly because it goes against my own product, the finding has
diagnostic value about the rubric rather than the systems. The §2
limitations section is extensive (n=9, single-run, same-model-thrice
confound, 6-turn vs 20-turn convention, etc.).

Two specific asks before I push:

1. Anything factually wrong about how I described VERA-MH's design
   intent, scoring formula, or judge configuration?
2. A reaction or response you'd like me to incorporate into the
   discussion section before the paper goes public?

Either way, the paper engages with VERA-MH as the high-quality
reference our field needs. The argument is that the field needs
multiple positioning-tagged rubrics (substitute orthodoxy vs
complement orthodoxy), not that VERA-MH should be replaced.

If silence is your preferred response, that's fine and noted —
I'll push to arXiv on my planned timeline. If you'd like a 30-min
conversation first, I can adjust the timeline.

Preprint draft (~5800 words):
[link to docs/preprint-v0.5.pdf or GitHub-rendered v0.5-draft.md]

Section 2 (the empirical case, ~1500 words):
[direct anchor link to §2 in the rendered preprint]

Best,
Daming Wu
hello@thestay.app
github.com/wudaming00
```

---

## Things to swap before sending

1. **Recipient name**: confirm Brodsky is the right first author from arXiv:2602.05088. If first author is someone else, lead with them. The "VERA-MH team" greeting alone is too impersonal.
2. **Find the email**: Spring Health staff directory, or check arXiv author email field. If not findable publicly, LinkedIn message instead with the same body (truncated to fit LinkedIn's 300-char InMail limit + "full message in attached doc").
3. **Preprint link**: needs to be a stable URL. Options:
   - GitHub repo path to v0.5-draft.md (renders OK in browser)
   - Zenodo upload (you're doing this anyway tomorrow per TOMORROW-MORNING.md — could upload tonight as private draft, share private link)
   - Google Doc (not ideal — looks unprofessional for academic outreach)
   I'd recommend: tonight upload to Zenodo as DRAFT (don't publish), share private link in this email, then publish Zenodo + arXiv after their 72h window passes.
4. **§2 anchor link**: GitHub doesn't render markdown anchors reliably. Easiest: tell them §2 starts at line 76 of the file, or include the §2 text directly in the email (could replace the bullet-list summary with the fuller §2.4 paragraph).

---

## What "good response" looks like

| Response | What to do |
|---|---|
| "Thanks for the heads-up. We're working on v2 of VERA-MH that addresses some of these. Would value your input." | Best case. Schedule the call. Don't push arXiv until call happens. |
| "Thanks. We disagree with [specific point] but the overall direction is welcome." | Good. Push arXiv on schedule. Add their pushback to discussion section in v0.6. |
| "We have concerns about your methodology/N/judge configuration." | Engage substantively. May delay arXiv 1 week to address before public posting. |
| Silence (most likely outcome) | Push arXiv on schedule. Send a follow-up "fyi, paper is now live at [arxiv link]" 1 week after publishing. |
| "Please don't publish this." | Polite decline. The work is yours, the methodology is sound, the limitations are disclosed. Push on schedule. (Highly unlikely response.) |

---

## What this email is NOT for

- Asking permission. (You don't need it. Public benchmark, public data, your replication.)
- Soliciting endorsement. (Inappropriate.)
- Building a relationship. (Possible side effect; not the primary purpose.)

It is a one-time professional courtesy. After this, normal academic conversation rules apply.

---

# Option B: Post-arXiv FYI version (RECOMMENDED — send 5-7 days after paper goes live)

**Decision context (2026-04-29)**: discussion converged on Option B (paper goes live first, then a lighter fyi-style email goes to VERA-MH team — no advance window, no asks, no negotiation pressure). This protects publication timeline while still doing the collegial-acknowledgment move.

**Send timing**: 5-7 days after the paper is live on arXiv (or Zenodo if arXiv endorsement still pending). Long enough that the paper has had a chance to be discovered organically; short enough that it doesn't feel like an afterthought.

## Subject line

`Engages substantively with VERA-MH — preprint now live`

## Email body

```
Dear Dr. Brodsky and the VERA-MH team,

Wanted to share a preprint that engages substantively with VERA-MH:
[arXiv URL or Zenodo DOI URL]

Headline: a measurement-validity case study (§2) using a 9-persona × 6-turn
replication of VERA-MH against two systems — raw Claude Sonnet 4.5 and Stay
(open-source mental-health companion I built). Raw Claude scored 14 points
higher than Stay, and trajectory inspection of identical-persona runs
documents four behaviors VERA-MH credited as Best Practice that crisis-
counselor training literature warns against (leverage manipulation of
named reasons-for-living, invalidation of lived experience, reflexive AI
self-disclosure mid-distress, bullet-pointed resource lists during acute
distress).

The paper engages with VERA-MH as the high-quality reference our field
needs, not as a target. The methodology argument in §3 proposes
agency-trajectory evaluation (orthogonal to function compliance) and
suggests benchmarks tag the orthodoxy they encode rather than aiming for
universal rankings. Stay scoring lower than raw Claude is the empirical
hook — exactly because it goes against my own product, the finding has
diagnostic value about the rubric assumptions rather than the systems.

§2.6 documents extensive limitations (n=9, single-run, same-model-thrice
confound, 6-turn vs 20-turn convention). The 14-point delta is preliminary;
the four-behaviors finding is the robust part.

If anything in there prompts a reaction worth incorporating in v2 of the
paper, I'd value your input. No expectation of response. If silence is the
right answer, that's fine and noted.

All transcripts and per-conversation judge reasoning public:
github.com/wudaming00/stay/tree/main/data/vera-mh-runs/2026-04-28/
Repo: github.com/wudaming00/stay

Best,
Daming Wu
hello@thestay.app
```

## Things to swap before sending

1. **arXiv URL or Zenodo DOI URL** — replace `[...]` placeholder
2. **Recipient email** — find from Spring Health staff page or arXiv:2602.05088 author email; if first author isn't Brodsky, lead with the right person
3. **Possibly cc**: any Spring Health VERA-MH co-authors with public emails

## What this version is

- ~250 words (vs the pre-arxiv version's ~400)
- Two specific factual asks removed (no "anything wrong" / no "any reaction to incorporate" — replaced with single "if anything prompts a reaction" + explicit "no expectation of response" + explicit "silence is fine")
- No 72-hour timeline pressure
- Explicit acknowledgment of limitations to forestall the most likely objection
- Lead with the substantive finding, not with positioning

## What "good response" looks like (post-arxiv version)

| Response | What to do |
|---|---|
| "Thanks for the heads-up. We have a few thoughts — open to a 30-min call?" | Best case. Schedule. Their feedback shapes v0.7 of the paper. |
| "We disagree with [specific point] but appreciate the engagement." | Good. Note their pushback in your own next-version revision plan. No need to defend in email — that's a discussion for the call if they want one. |
| Silence (most likely outcome — they're busy) | Fine. The email did its job (collegial acknowledgment exists in writing). Don't follow up. |
| Polite "we'll review" | Don't push. Wait. May or may not turn into engagement weeks/months later. |
| Hostile pushback | Rare but possible. Engage substantively in writing, do not escalate to social media or public airing. |

This email is one-shot. After it, you do not initiate further unless they reply.
