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

The framework is described in the public Constitution at
[docs/constitution-v0.en.md](./docs/constitution-v0.en.md) and in the
preprint at [docs/preprint-v0.6-draft.md](./docs/preprint-v0.6-draft.md).

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
  constitution-v0.en.md           Public Constitution (v0.1 — agency-trajectory)
  crisis-sop-v0.1.en.md           Research-grounded crisis response SOPs (incl. companion-during-call)
  research-basis-v0.en.md         Citations for every design choice
  preprint-v0.6-draft.md          Latest preprint (agency-trajectory framework)
  architecture-v0.en.md           Privacy + storage + identity architecture
  competitive-landscape-2026-04.md Where Stay sits vs Woebot / Wysa / Ash / etc.

src/
  lib/system-prompt.ts            The operational prompt (v0.8 — agency-trajectory)
  lib/resources.ts                Hardcoded crisis + professional referrals
  lib/storage.ts                  IndexedDB + retention
  lib/crypto.ts                   WebCrypto AES-GCM-256
  lib/panic.ts                    Panic phrase
  lib/insights.ts                 Starred user sentences
  app/api/chat/route.ts           Anthropic API integration with tool calling
  app/promises/                   Public Constitution page
  app/privacy/                    Privacy details
  app/resources/                  Crisis and therapist referral directory
  app/terms/                      Terms of Use (draft, pending legal review)
  app/faq/                        Common questions
  app/settings/                   Data controls, panic phrase, kept insights
  app/about/                      Why Stay exists
  components/Chat.tsx             The main conversation UI
  components/SafetyPlanCard.tsx   Stanley-Brown safety plan generator
  components/QuickExit.tsx        DV-shelter emergency exit button
  components/AgeGate.tsx          18+ self-attest

scripts/
  scenarios/                      61-scenario behavioral test suite
  test-tier1-comparison.ts        v0.6 vs v0.7 paraphrase robustness
  check-rule-coverage.ts          Rule-↔-assertion invariant CI check
```

## What this repo is NOT

- Not a clinically validated product. There are no published outcomes.
- Not FDA-cleared (see [Wysa](https://www.wysa.com) if you need that).
- Not a therapy replacement.
- Not a finished product. v0. Expect rough edges.

## If you want to run it locally

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

## For therapists and researchers

If you are a licensed mental-health professional or a researcher in this
field and want to review Stay, I'd welcome it. The repo is public
specifically so you can audit the system prompt, the crisis SOP, the
safety architecture. Email **hello@thestay.app** if you'd like to talk.

## License

Test suite, runner, and methodology infrastructure: **MIT**. See
[LICENSE](./LICENSE).

The system prompt itself (`src/lib/system-prompt.ts`): **restricted-use
license** — see [LICENSE-PROMPT.md](./LICENSE-PROMPT.md). Derived works
may not remove the imminent-risk SOP, the leverage-prevention rule, or
the companion-during-call requirement without naming a clinical
reviewer-of-record for the derived deployment.

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
