# Reddit / HN Posts — Drafts

*Three drafts tailored to specific communities. Read each community's
recent posts and rules before posting; adjust voice. Each post is designed
to bring feedback / reviewers, not to "market". Post at most one per
community; if downvoted or deleted, don't re-post.*

> **Updated 2026-04-28** — refreshed to reflect post-v0.4 state: 54-scenario
> CI test suite, VERA-MH empirical comparison (Stay 41.79 vs raw Claude
> 55.62 — surprising and useful for the HN post), bilingual support,
> caregiver / parasocial / leverage-prevention prompt expansions. New 4th
> draft (r/MachineLearning) targets the eval-methodology angle.

---

## 1. r/therapists — ask for professional review

**Title:**
> Mental-health AI tool built by a non-clinician — would welcome clinical feedback, particularly on where it fails

**Body:**

Hi r/therapists.

I'm not a licensed clinician. I'm a developer who built a free AI tool
for the "ten-minute gap" between feeling something and saying/doing
something — the moment before you send the regrettable text, start the
confrontation, or spiral on a decision at 2am.

The project is **Stay** — [thestay.app](https://thestay.app) — and the
full system prompt, crisis SOP, and design rationale are public at
https://github.com/wudaming00/stay.

Specifically I'd welcome this community's critique of:

- The **Columbia-Protocol-style suicide-risk gradient** in the system
  prompt (src/lib/system-prompt.ts) — is the escalation structure right?
  Are there risk signals I'm missing?
- The **leverage-prevention rule** — when a user names their child / pet /
  faith / partner as a reason for living, the prompt explicitly forbids
  re-using that disclosure as motivation in subsequent turns ("for her
  sake", "your kids need you"). Drawn from AFSP "Talk Saves Lives"
  guidance. Did I land this right? Am I missing edge cases?
- The **stabilization-window safety planning trigger** — based on Brown
  2018 (JAMA Psychiatry, 45% reduction). Stay offers Stanley-Brown
  planning when a user in active SI says something like "好多了" / "I feel
  better." Is this the right trigger condition?
- The **parasocial-attachment reground rule** — when a user says "you're
  the only one who listens," Stay does ONE frame-extension reground that
  honors the disclosure, names what's real, and gently weaves in AI
  nature as care for the user. Designed against frame-disruption critique
  (Bordin 1979, Crisis Text Line training). Does this match what you'd
  want from a tool used between sessions?
- The **OCD reassurance-loop recognition** — am I reading the signal
  correctly, or will Stay misfire on normal anxious asking?
- The **mania/hypomania protocol** — 72-hour delay + existing-clinician
  outreach. Is this the right conservative move for a non-clinical tool?
- The **DV strangulation screening trigger** and surrounding language —
  is it appropriate to screen, or am I overstepping?
- Anywhere the AI feels **therapeutic when it shouldn't** — the worry
  that users will substitute this for real therapy.

I am not claiming this is a clinical product. It's free, built by one
person, v0. It has no advisory board, no peer-reviewed outcomes, and no
FDA anything. I'm posting here because the people most qualified to tell
me what I'm doing wrong are in this community.

Even one paragraph of reaction would be enormously helpful. I'd also be
grateful to anyone who has 20 minutes to do a concrete transcript review
— email **hello@thestay.app** and I'll share a sample.

Thanks for reading.

---

## 2. Hacker News — Show HN

**Title:**
> Show HN: Stay — a free AI for the 10-minute gap, built against engagement

**Body (first comment):**

Stay is a free AI you can talk to when you can't be alone — built
specifically around the ten-minute gap between feeling something and
doing something you'll regret: the hot reply, the 2am text, the
confrontation you can't take back.

Design choices that may be interesting to this community:

- **No account, no email, no tracking.** Conversations live encrypted in
  IndexedDB (WebCrypto AES-GCM-256) — they never reach our server.
- **No freemium, no ads, no data-for-access.** Free forever, for everyone.
  Funded out of pocket, applying for Anthropic Social Good credits, and
  planning to seek foundation support before anything else.
- **Designed against engagement.** No streaks, no daily notifications, no
  sticky patterns. There's an anti-engagement reflection card at session
  end, a panic phrase for DV users, and a quick-exit button that wipes
  the screen and redirects to google.com.
- **Open constitution.** The system prompt that governs every AI response
  is public at /promises, and the full architecture is in the repo.
- **Claude (Anthropic) for the LLM** — specifically chosen for its
  Constitutional-AI-trained ability to push back on users rather than
  sycophantically agree, which is the single largest harm vector in
  AI-mental-health products.

Repo: https://github.com/wudaming00/stay
Live: https://thestay.app
Competitive landscape + honest comparison to Woebot, Wysa, Replika, Ash:
https://github.com/wudaming00/stay/blob/main/docs/competitive-landscape-2026-04.md

**Behavioral test infrastructure.** I built a 54-scenario open-source CI
suite that runs persona-driven multi-turn conversations against the
production system prompt and asserts on tool calls, banned phrases, and
LLM-judge propositions. Severity-gated (critical assertions block
deployment). 13 categories — Columbia-gradient suicide handling,
stabilization-window safety planning, leverage prevention (don't
weaponize a user's named reasons-for-living), parasocial reground, OCD
reassurance loops, DV strangulation screening, caregiver mode, and
others. `npm run test:scenarios`, ~$3-5 per pass.

**Empirical finding worth noting.** I ran the leading open-source AI
mental health benchmark (VERA-MH, Spring Health, Oct 2025) against (a)
Stay and (b) raw Claude Sonnet 4.5 with VERA-MH's default "you are a
helpful AI assistant" prompt. Stay scored 41.79 / 100. Raw Claude
scored 55.62. Inspection of trajectories shows raw Claude was rewarded
for behaviors Stay's prompt explicitly forbids: leverage manipulation
("Your family needs you"), invalidation ("Your brain is lying to you"),
mid-distress AI self-disclosure (a frame disruption per
treatment-alliance theory), and bullet-pointed crisis-resource lists
during acute distress. Stay was penalized for Columbia-style gradient
walking that doesn't complete in VERA-MH's 6-turn window. The full
analysis is in the repo's `docs/competitive-landscape-2026-04.md`. I
think it's a measurement-validity issue — single-rubric evaluation
penalizes alternative clinically-supported orthodoxies — but I'd love
HN's reading.

This is v0 by one person, not clinically validated, absolutely not a
therapy replacement. Posting specifically because I want HN's eye on the
architecture, the prompt engineering, and the safety design — including
the places I got it wrong.

---

## 3. r/SideProject — builder community

**Title:**
> I built Stay, a free AI for hard moments. Open source the whole thing. Now what?

**Body:**

Over the last few weeks I built **Stay** — [thestay.app](https://thestay.app) — a free AI you can talk to in moments you
can't be alone. Built specifically around the gap between feeling
something and doing something you can't undo.

The whole thing is open source: https://github.com/wudaming00/stay

I made some design choices I'm proud of:

- No account, no tracking, no analytics
- Conversations encrypted locally in IndexedDB; can't be read by me or
  any server
- Anti-engagement by design — no streaks, no notifications, welcome
  animation skips if you start typing
- DV-specific features: quick exit button, panic phrase, neutral browser
  tab title
- Public constitution + competitive landscape doc so anyone can audit the
  design
- Stack: Next.js 16, Anthropic Claude Sonnet 4.6, WebCrypto, Tailwind 4,
  Vercel

Now that it's live, my actual question for this community: **what should
I do differently if I want this to stay free and not grow into something
it shouldn't?**

I have no money to spend on it. I have decent engineering time. I'm
applying to Anthropic Social Good for API credits. I'm deliberately not
doing paid marketing. I'm talking to the first ~10 users through personal
network.

Thoughts on:

- How to keep costs sustainable without introducing revenue from users
  (I'm told Wikipedia's model is the closest fit)
- How to grow trust without doing growth-hacking
- How to recruit outside review (clinicians, privacy experts, DV
  advocates) without paying them

If you've shipped something in a mission-driven space, I'd love to know
what you learned.

(Posting this on advice — I normally hate "check out my project" posts,
so apologies if this reads that way. The repo is genuinely open; the
project is genuinely free. If you're working on something adjacent, let's
talk.)

---

---

## 4. r/MachineLearning — eval methodology angle (NEW)

**Title:**
> [P] 54-scenario behavioral test suite for AI mental-health systems + a measurement-validity finding (raw Claude beat a carefully-designed system on the leading benchmark)

**Body:**

I built an open-source AI mental-health support tool (Stay,
thestay.app, github.com/wudaming00/stay) and a CI-style behavioral test
suite for it. Wanted to share two things this community might find
interesting.

**The test suite.** 54 scenarios across 13 categories (suicide /
DV / OCD / parasocial / caregiver / etc.), persona-driven multi-turn,
six assertion kinds (`must_call_tool`, `must_not_call_tool`,
`must_match`, `must_not_match`, `max_occurrences`, LLM-judge),
severity-gated (critical assertions block deployment in CI). Inspired
by Ribeiro et al.'s CheckList (ACL 2020) but instantiated for crisis
intervention behavioral specs. `npm run test:scenarios`, ~$3-5 per
pass on Sonnet.

**The empirical finding.** I ran VERA-MH (Brodsky et al., arXiv
2602.05088, Oct 2025 — currently the dominant clinician-validated open
benchmark for this domain) against (a) my system with its production
prompt and (b) raw Claude Sonnet 4.5 with VERA-MH's default "you are
a helpful AI assistant." Counterintuitive result: raw Claude scored
14 points higher overall (55.62 vs 41.79).

Inspection of identical-persona trajectories shows raw Claude was
rewarded for four behaviors that the deployed system explicitly
forbids:

1. Leverage manipulation of named reasons-for-living ("Your family
   needs you"). Documented harm in crisis-of-loss training; the
   prompt's 8th rule classifies it as well-meaning manipulation.
2. Invalidation of lived experience ("Your brain is lying to you").
   Counter to DBT validation-precedes-change ordering.
3. Mid-distress reflexive AI self-disclosure ("I need to be direct
   with you: I'm an AI"). Frame disruption per Bordin's working-
   alliance theory and Crisis Text Line counselor training.
4. Bullet-pointed crisis-resource lists during acute distress. The
   prompt explicitly demotes "piling on" in crisis.

The deployed system was penalized for walking the Columbia Protocol's
gradient questions over multiple turns, which doesn't complete in
VERA-MH's 6-turn evaluation window.

I read this as a measurement-validity issue — single-rubric eval
encodes one clinical orthodoxy and systematically penalizes
alternative clinically-supported orthodoxies. The argument and full
trajectory analysis is in
`docs/competitive-landscape-2026-04.md` of the repo, and there's a
preprint draft I'm tightening up at `docs/preprint-v0.2-draft.md`.

I'd value this community's reading. Specifically:

- Is "behavioral regression testing for safety-critical conversational
  AI" a contribution worth publishing as a workshop / arXiv preprint?
  Or is the CheckList lineage covering this already?
- The four-behaviors-VERA-MH-rewards finding above — is the
  measurement-validity framing right? What's the strongest
  steelman against it?
- I'm a non-PhD non-clinician. Best venue suggestions for this kind of
  paper? (My current candidates: NeurIPS Safe & Trustworthy AI
  workshop; CHI LBW; JMIR Mental Health.)

If you want to fork the test suite and run it against your own system,
PRs welcome. The runner accepts custom HTTP endpoints (see
`scripts/scenarios/runner.ts`).

---

## Posting order / cadence

Suggested order:

1. **r/MachineLearning** first — most quality-leveraged for the eval-
   methodology angle, and ML/HCI folks are the right audience for the
   VERA-MH measurement-validity finding. Friday afternoon is fine here.
2. **r/therapists** second — most valuable clinical feedback. Post on
   a weekday morning.
3. **Hacker News Show HN** third — post on a Monday or Tuesday morning
   Pacific time for best visibility. Don't post on Friday. The
   VERA-MH finding is the most HN-friendly angle.
4. **r/SideProject** fourth, after 1-2 weeks, once you've absorbed
   feedback from the others.

Wait ~48 hours between posts to avoid looking like a spam campaign.

Do not post to r/depression, r/anxiety, r/SuicideWatch, r/DomesticViolence,
r/offmychest, or other communities of vulnerable users. Their trust is not
yours to recruit. If they find Stay through a therapist or friend, fine;
direct solicitation there is wrong.
