# arXiv endorser outreach

**Purpose**: arXiv requires every first-time submitter to be **endorsed** by someone already credentialed in the relevant subject category. This document drafts the email and lists the candidate endorsers.

**Categories Stay's paper targets**: `cs.HC` (Human-Computer Interaction) primarily, `cs.CY` (Computers & Society) cross-listed.

**Time investment**: writing the email = 30 min; finding 5 candidates = 1 hour; sending = 5 min. Replies usually come within 1-3 days. Once endorsed, you don't need another endorser ever again for the same category.

---

## How endorsement works

1. You start submitting to arXiv. They tell you you need an endorser.
2. You email a candidate endorser. They visit a link arXiv generates and click "endorse." Takes them ~30 seconds.
3. You can submit immediately after.

**You only need ONE endorsement per category.** Not five. Send to your best candidate first; if they say no or don't reply in 5 days, try the next.

---

## Candidate endorsers (in priority order)

Aim for: someone who has published in `cs.HC` or `cs.CY` recently (so they have endorsement privilege), and whose work intersects with AI safety / mental health / HCI evaluation. People who get cold-emailed for endorsement constantly — not great. People who occasionally do open-source / public-good adjacent work — better.

**Best fit (priority 1):**
- **Munmun De Choudhury** (Georgia Tech) — published extensively on AI mental health (incl. `arXiv:2311.14693` "Benefits and Harms of LLMs in Digital Mental Health"). Cross-listed in `cs.HC` and `cs.CY`. Active in open-source community. Likely to be supportive of an indie researcher tackling this domain.
- **Sachin Pendse** — co-author with De Choudhury, often on the digital-mental-health / AI safety intersection. Same lit ecosystem.

**Strong second-tier:**
- **Stevie Chancellor** (UMN) — AI mental health, NLP for mental health. Has published in `cs.CY`.
- **Tim Althoff** (UW) — Crisis Text Line research, computational mental health. Published in `cs.HC` regularly.
- **The VERA-MH authors** (Brodsky et al., Spring Health) — they could see this paper as building on their work in a friendly way. Risk: they may decline since you're directly extending their framework. Reward: if they endorse, that's also a soft endorsement of the paper's framing.

**Tactical second-tier:**
- **Marco Tulio Ribeiro** (Microsoft Research) — author of CheckList. Your paper's intellectual ancestor. He's well-known and gets a lot of email, but the framing "your paper inspired me" tends to land.
- **Anthropic Safety Team contacts** — if you have any informal connection through Anthropic Social Good or developer advocates, that's a path. They publish in `cs.CL` and `cs.AI` more than `cs.HC`, so check.

**Anyone you have warm intro to** beats anyone above. If a friend-of-friend has any of these connections, ask them first.

---

## Email template (priority 1: De Choudhury)

```
Subject: Quick request: arXiv endorsement (cs.HC) for an indie crisis-AI paper

Dear Prof. De Choudhury,

I'm an independent developer (no academic affiliation) who built a free,
open-source AI for the mental health crisis-communication domain
(thestay.app, github.com/wudaming00/stay) and a 54-scenario behavioral
test suite. I'm preparing to submit a preprint to arXiv (cs.HC + cs.CY)
and need an endorsement to do so for the first time.

The paper presents (a) the test suite as a runnable open-source artifact
extending the CheckList paradigm (Ribeiro 2020) into AI crisis
intervention, and (b) an empirical observation: running VERA-MH (Brodsky
et al. 2025) against my system AND against raw Claude shows the raw
default model scoring 14 points higher than the carefully-designed
system, in ways that reveal measurement-validity issues in the rubric's
encoded clinical orthodoxy. I cite your "Benefits and Harms of LLMs in
Digital Mental Health" centrally as the field's framing.

The endorsement takes about 30 seconds via a link arXiv generates. You
don't need to read or vouch for the paper itself — only that I'm
plausibly working on something in the field, which the GitHub repo and
draft (link below) make easy to verify.

Draft preprint: https://github.com/wudaming00/stay/blob/main/docs/preprint-v0.2-draft.md
Test suite: https://github.com/wudaming00/stay/tree/main/scripts/scenarios

I would be grateful for your time, and equally grateful if you'd point
me to a colleague better positioned to endorse cs.HC submissions in
this area.

Thank you for considering,
Daming Wu
hello@thestay.app
```

---

## Variations

**For Marco Ribeiro (CheckList author):**

```
Subject: Quick request: arXiv endorsement (cs.HC), and a paper your CheckList work inspired

Dear Marco,

I'm an indie developer (non-academic) who built a 54-scenario
behavioral test suite for AI crisis intervention and a corresponding
deployed system (github.com/wudaming00/stay). The test suite design is
self-consciously CheckList-inspired — six assertion kinds, severity
gating, persona-driven — instantiated into the safety-critical mental
health domain.

I'm preparing an arXiv submission (cs.HC + cs.CY) and need an
endorsement for first-time submission. The endorsement takes ~30
seconds via a link arXiv generates; you don't need to read or vouch
for the paper itself.

The paper cites CheckList as the methodological ancestor. Specifically
I argue for transposing the "behavioral testing as software-engineering
infrastructure" framing into AI crisis intervention, and present an
empirical observation: running the leading clinician-validated open
benchmark (VERA-MH) against my system AND against raw Claude shows the
raw default scoring 14 points higher than the carefully-designed
system, which I read as a measurement-validity issue your framing
helped me see clearly.

Draft: https://github.com/wudaming00/stay/blob/main/docs/preprint-v0.2-draft.md

Equally happy if you'd point me to a colleague better positioned.

Thanks for considering,
Daming
```

**For VERA-MH authors (Brodsky et al., Spring Health):**

```
Subject: arXiv endorsement (cs.HC) for a paper extending VERA-MH

Hi Spring Health VERA-MH team,

I'm an indie developer (non-academic) who built a deployed AI crisis
intervention system (thestay.app) and a 54-scenario behavioral test
suite. I'm preparing an arXiv submission (cs.HC + cs.CY) and need an
endorsement for first-time submission.

The paper builds explicitly on VERA-MH and positions our work as a
COMPLEMENTARY EXTENSION — adding programmatic-assertion types
(tool-call, regex, max-occurrence) where VERA-MH uses LLM-judge alone,
extending scenario taxonomy beyond suicide-risk-only, and adding CI
severity-gating. It also includes an empirical case study: running
VERA-MH against my system and against raw Claude, which surfaced an
interesting measurement-validity observation that I think will be
useful for VERA-MH v2 design considerations.

I'd value your endorsement (~30 seconds via arXiv link). I'd
ALSO value any feedback you have on the framing — if there's a
mischaracterization of VERA-MH in the draft, I want to fix it before
submission, not after.

Draft: https://github.com/wudaming00/stay/blob/main/docs/preprint-v0.2-draft.md

Thanks,
Daming
hello@thestay.app
```

---

## What to do if no one responds in 5 days

1. Don't take it personally — these emails are easy to lose.
2. Send a single soft follow-up to your top choice: "Hi, just bumping this in case it slipped past — no rush, easy to skip."
3. If still no response in another 5 days, move to next candidate.
4. If 3 candidates have not responded in 3 weeks total, post on the arXiv mailing list / r/MachineLearning asking if anyone in cs.HC would be willing to endorse a non-academic submitter. Less elegant but it works.

---

## After endorsement

Submit immediately. The endorsement is one-time per category — you don't need to re-ask for future submissions in cs.HC.

Send the endorser:
- A copy of the final submitted abstract
- The arXiv URL once it's live
- A one-line thank you ("if there's any comment you'd want to add as the paper develops, I'd value it")

This is how you turn one cold-email request into a long-term professional relationship. Don't disappear after they help.
