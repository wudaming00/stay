# Reddit / HN Posts — Drafts

*Three drafts tailored to specific communities. Read each community's
recent posts and rules before posting; adjust voice. Each post is designed
to bring feedback / reviewers, not to "market". Post at most one per
community; if downvoted or deleted, don't re-post.*

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

## Posting order / cadence

Suggested order:

1. **r/therapists** first — most valuable feedback population, and you're
   least exposed to social-media gamification there. Post on a weekday
   morning.
2. **Hacker News Show HN** next — post on a Monday or Tuesday morning
   Pacific time for best visibility. Don't post on Friday.
3. **r/SideProject** third, after 1 week, once you've absorbed feedback
   from 1 + 2.

Wait ~48 hours between posts to avoid looking like a spam campaign.

Do not post to r/depression, r/anxiety, r/SuicideWatch, r/DomesticViolence,
r/offmychest, or other communities of vulnerable users. Their trust is not
yours to recruit. If they find Stay through a therapist or friend, fine;
direct solicitation there is wrong.
