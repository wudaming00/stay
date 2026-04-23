# Stay

**An AI for the moments you can't be alone.**

Live at [thestay.app](https://thestay.app).

Stay is a free AI you can talk to in moments where you can't — or
shouldn't — be alone. It listens. It helps you find the words for what you
actually feel and what you actually need to say. Then it lets you go.

It is **not therapy**. It is not a friend. It is a quiet third thing — a
place to think out loud before doing anything you can't undo.

---

## What this repo is

The complete source for Stay — the web app, the system prompt, the crisis
SOPs, the safety architecture, and the design documents that explain every
design choice.

Publishing this is deliberate. For a product that asks people to trust it
with their worst hour, the rules of engagement shouldn't be a black box.
If you see something wrong, I want to hear about it.

## What makes Stay different

- **Free forever, for everyone.** No account required, no freemium, no
  ads, no data sold. Users don't pay. Ever.
- **Encrypted on your device.** Conversations live in IndexedDB,
  encrypted with a key your browser holds. We have no server-side
  database of your conversation content. We cannot read what you write.
- **Designed against engagement.** No streaks. No notifications. No
  guilt for the gap. The goal is for you to feel better and leave.
- **DV-aware from day one.** Quick exit button + Escape key, panic
  phrase, neutral tab title, DV-specific crisis response.
- **Open constitution.** See [/promises](https://thestay.app/promises).
  The AI's rules of engagement are public.

## What's inside

```
docs/
  constitution-v0.en.md           Public values and non-negotiables
  crisis-sop-v0.1.en.md           Research-grounded crisis response SOPs
  research-basis-v0.en.md         Citations for every design choice
  system-prompt-v0.2.en.md        Full runtime spec
  architecture-v0.en.md           Privacy + storage + identity architecture
  competitive-landscape-2026-04.md Where Stay sits vs Woebot / Wysa / Ash / etc.

src/
  lib/system-prompt.ts            The operational prompt (compressed from docs)
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
  proxy.ts                        Per-IP rate limiting (Edge)
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

MIT. See [LICENSE](./LICENSE).

Using this code to build a mental-health product that does the opposite
of what Stay stands for — engagement maximization, data monetization,
freemium-gating of crisis support — is permitted by the license. It is
not permitted by decency.

## Credits

Built by one person in 2026. The philosophy draws on the work of many —
Carl Rogers, John Gottman, Marshall Rosenberg, Stanley & Brown, Jacquelyn
Campbell, William Miller & Stephen Rollnick, and the counselors at 988,
Crisis Text Line, and the National DV Hotline whose actual labor this
software can only hope to support — never replace.
