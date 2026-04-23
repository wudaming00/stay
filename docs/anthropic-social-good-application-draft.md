# Anthropic Social Good — Application Draft

*For Claude for Public Good / Anthropic's AI for Mental Health Initiative or
equivalent program. This is a draft — submit at
https://www.anthropic.com/research/ai-for-public-good (or whichever intake
form is current).*

---

## Project name

**Stay — An AI for the moments you can't be alone**

https://thestay.app

Repo: https://github.com/wudaming00/stay

## One-sentence description

A free, private, anti-engagement AI conversation tool designed for the
10-minute gap between feeling something and doing something about it —
built specifically for crisis-moment communication support and domestic-
violence safety.

## Who is building this

One developer, self-funded, 2026. Not incorporated, no employees, no
investors. San Francisco Bay Area.

## What problem are you solving

Most decisions people regret — the hot reply, the 2am text, the
confrontation at a family dinner — are made in the ten minutes between
feeling something and saying it. Existing resources for that ten-minute
gap are inadequate:

- Crisis hotlines (988, Crisis Text Line) exist for the worst end of the
  spectrum, but have wait times and cover only a subset of situations.
- Therapists are weekly, expensive, and inaccessible to most of the world.
- Existing AI companion products (Replika, Character.AI) are
  engagement-maximizing and have been implicated in documented user
  harms, including teen suicide.
- Woebot and Wysa are rule-based CBT scripts, constrained by design.

Stay exists for that gap. It is designed specifically around:

1. **Finding words** for what you feel and what you need to say.
2. **Slowing down** before irreversible action.
3. **Bridging** to real human resources when the user needs more than AI.

## Why Claude specifically

Stay depends on Claude for one core reason: **Claude's character training
includes genuine pushback capability**. Most LLM products fail at
mental-health use cases because they reflexively agree with the user. A
user who says "my husband is a narcissist, tell me I'm right to leave"
needs a model that can hold the feeling without validating the
conclusion. Claude does this better than any other production LLM we've
tested.

Stay's system prompt (public at https://github.com/wudaming00/stay/blob/
main/src/lib/system-prompt.ts) is a detailed operational extension of
Anthropic's Constitutional AI research — implementing specific principles
from Rogers, Gottman, attachment theory, NVC, motivational interviewing,
Stanley-Brown safety planning, and trauma-informed care.

We also use Claude's native tool-calling to safely surface crisis
resources without the model hallucinating phone numbers — a real risk in
this domain.

## Impact — who Stay serves

Stay is built for, specifically:

- **People in the 10-minute gap before doing something they can't undo** —
  composing a regrettable message, about to confront a partner, spiraling
  on a decision at 2am. This is the largest user segment.
- **People in domestic violence situations** — quick-exit button, panic
  phrase, neutral browser tab title, DV-specific crisis response including
  strangulation risk screening.
- **People who cannot afford therapy or who have been traumatized by prior
  attempts to find help** — especially those in mental-health deserts,
  without insurance, or from communities underserved by mainstream care.
- **People working through interpersonal conflict who aren't in crisis**,
  but need a thinking partner for difficult conversations.

Stay is not targeted at — and actively discourages use by — people who
need real therapy. We route to therapist directories (Psychology Today,
OpenPath Collective, Inclusive Therapists, Therapy for Black Girls, Latinx
Therapy, AMHC) and to crisis lines for acute situations.

## Safety approach

A detailed crisis-handling SOP lives at
https://github.com/wudaming00/stay/blob/main/docs/crisis-sop-v0.1.en.md —
research-grounded, implementing:

- Columbia Protocol-style risk gradient for suicidal ideation
- Past-attempt screening (strongest suicide-death predictor)
- Stanley-Brown Safety Planning Intervention (JAMA Psychiatry 2018, 45%
  reduction in suicidal behavior vs treatment-as-usual)
- Glass et al. (2008) non-fatal strangulation femicide-risk protocol for DV
- Grounding-first for dissociation/flooding
- OCD reassurance-loop recognition
- Mania / psychosis red-lines
- PTSD flashback stop-narration protocol
- Duty-to-warn language for specific third-party threats

Architectural safety:

- Client-side encryption (WebCrypto AES-GCM-256); conversations never
  leave the user's device unless they explicitly choose to share.
- No server-side conversation database. We physically cannot read user
  conversations.
- Anonymous by default; no accounts, no email, no tracking.
- 90-day default retention with auto-delete; opt-in long-term.
- Edge rate-limiting on the Claude API to prevent runaway cost or abuse.
- Quick-exit button + Escape key + panic-phrase for DV safety.

## What we are asking for

API credits / grant support to cover Anthropic API costs for the Stay
public service during our closed-beta and initial open-beta period.

Target scale: 100-500 closed-beta users, growing to 1,000-5,000 in first
year. Estimated API cost at that scale: $500-3,000/month. At current
self-funding, this is painful but possible; with support from Anthropic,
we can focus entirely on clinical safety and transparency work rather
than cost-cutting.

## What we are not asking for

We are not asking for equity, technical partnership, marketing support,
or anything other than API credits. Stay is a public-good project and is
committed to remaining free for users forever. We have no revenue model
today and will not extract revenue from users.

If Anthropic would like to be publicly acknowledged on /about, we'd be
honored to do so. If Anthropic prefers silence on sponsorship, we'll
respect that.

## Commitment

- We will publish our system prompt, our safety SOP, and our design
  rationale openly (already done; see the repo).
- We will honor Anthropic's usage policies in letter and in spirit. Stay
  is specifically designed against the pattern of AI products that
  Anthropic has publicly cautioned against.
- We will publish a v1 post-mortem after 6 months of real-user operation
  — what worked, what didn't, where Stay caused harm or missed a sign.
  The field needs more honest post-mortems, and we'll contribute one.
- We will promptly disable or substantially redesign Stay if we discover
  it is causing harm we cannot mitigate.

## Contact

**hello@thestay.app**

## Closing

Much of the funded AI-mental-health space is optimizing for engagement,
scale, and revenue. The gap Stay is trying to fill is in the opposite
direction — a tool that is free, private, deliberately small, designed to
help people stop using it. We'd be grateful for Anthropic's support in
keeping it alive, and honored to be held to the standards Anthropic holds
itself to.
