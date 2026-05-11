# Stay — Claude Skill

The portable version of [Stay](https://thestay.app). Same agency-trajectory principle, same crisis SOPs, same warmth. Runs as a Claude Skill inside any Claude Code, Claude Desktop, or Claude.ai conversation.

## What it is

A Skill that brings Stay's articulation-skill methodology into any Claude conversation. Auto-activates when the user brings interpersonal/emotional difficulty (relationship conflict, drafting a charged message, naming a feeling, processing a hard day, working through a crisis) and stays out of the way for technical/factual conversations.

Includes US crisis bridging — 988 / Crisis Text Line / DV Hotline / Childhelp / 911 — with safety override priority.

For long memory, structured DBT-style logging, savable safety plans, quick-exit UI, and device-local encrypted storage, the skill hands off to the full PWA at [thestay.app](https://thestay.app).

## Install

### Option A — global personal install (use across all your projects)

```bash
git clone https://github.com/wudaming00/stay.git ~/projects/reflective-companion
ln -s ~/projects/reflective-companion/skills/stay ~/.claude/skills/stay
```

### Option B — project install (use only when working inside the Stay repo)

The repo already has `.claude/skills/stay` symlinked to `skills/stay`. Cloning + running Claude Code from inside the repo auto-discovers it.

### Option C — copy into another repo's skill folder

```bash
cp -R skills/stay /path/to/other-repo/.claude/skills/
```

The skill is self-contained — SKILL.md plus 5 supporting markdown files.

## Verify install

Inside a Claude Code session:

```
/stay
```

Should list as an available skill. If it doesn't appear, restart Claude Code (the harness loads skills at session start; live-edit reload is for changes to existing skills, not for newly-created ones).

## Test prompts

The skill should **auto-activate** on prompts like:

- "I just had a fight with my sister and I can't stop crying"
- "How do I tell my mom to stop coming over without texting first?"
- "I don't know what I'm feeling. It's like everything is far away."
- "My partner said something really hurtful and I want to text him but I don't know how"
- "活着没意思了" / "I don't want to be here anymore"
- "He grabbed me last night"

It should **NOT** auto-activate on:

- "How do I implement OAuth in Next.js?"
- "What's the difference between async and await?"
- "Write me a poem about autumn"
- "Summarize this article"

Always invocable explicitly via `/stay`.

## What the skill does NOT do (handoff to PWA)

- Long memory across sessions
- DBT-style structured logger
- Savable Stanley-Brown safety plan
- End-of-session reflection card
- Quick-exit button + panic phrase (DV safety architecture)
- Insights collection (kept sentences across sessions)
- Therapist export

For all of the above, the skill hands the user warmly to [thestay.app](https://thestay.app). See `stay/handoff-to-pwa.md`.

## Privacy honesty

This skill runs inside your existing Claude conversation. **It does NOT inherit Stay's PWA privacy guarantees** — conversation storage / retention is governed by whatever platform you're running Claude Code on, not by Stay's device-local encryption. The skill discloses this honestly to users when relevant; see `stay/handoff-to-pwa.md` § "Honesty about this skill's privacy model."

For end-to-end encrypted, device-local, no-account conversations, use [thestay.app](https://thestay.app).

## License

The skill is a derived work of `src/lib/system-prompt.ts` under the **Stay System Prompt License v1** (see `LICENSE-PROMPT.md` at the repo root, NOT the MIT license).

The four safety-critical sections — §1.a imminent-risk SOP, §1.b leverage-prevention rule, §1.c no-third-party-characterization rule, §1.d companion-during-call requirement — are preserved with `<!-- PROTECTED SECTION ... -->` markers in `stay/crisis-protocol.md` and `stay/leverage-and-framing.md`.

Per LICENSE-PROMPT §2, the Responsible-Deployment Manifest is at [thestay.app/promises](https://thestay.app/promises). Per LICENSE-PROMPT §3, full attribution and section-by-section preservation map is in `stay/ATTRIBUTION.md`.

## Reporting safety issues

If you try the skill and find a place where it responds in a way that could harm someone — escalates a crisis, gives bad advice, misses a clear warning sign, recommends something dangerous — email **hello@thestay.app**. Every report is read personally.

## Structure

```
skills/stay/
├── SKILL.md                  Entry point — frontmatter, agency-trajectory principle,
│                             10 inviolable rules, mode detection (daily/depth/crisis),
│                             handoff triggers, 31-item self-check
├── crisis-protocol.md        Full crisis SOPs (suicide gradient, Stanley-Brown safety
│                             planning, imminent SOP §1.a, DV with Danger Assessment,
│                             child/sexual harm, ED, NSSI, OCD, substance, threats,
│                             mania, psychosis, trauma, caregiver mode, goodbye after
│                             crisis). Contains §1.a + §1.d PROTECTED sections.
├── leverage-and-framing.md   §1.b reasons-for-living-not-leverage + §1.c no-third-
│                             party-characterization + rule 9 no-specific-provider +
│                             rule 10 no-DSM-categories-about-user. Contains §1.b
│                             + §1.c PROTECTED sections.
├── translator-and-mirror.md  Functions 1-2 (translator, mirror) + grounding +
│                             stuck-at-blank-page + helping draft a message + skill
│                             teaching + light therapy navigation + rupture/repair
├── language-and-tone.md      Phrases-to-avoid, tone calibration, listening,
│                             parasocial-attachment reground, post-crisis goodbye
├── handoff-to-pwa.md         When/how to recommend thestay.app for sustained use,
│                             with explicit phrasings for soft and hard handoffs
└── ATTRIBUTION.md            LICENSE-PROMPT §3 attribution, Responsible-Deployment
                              Manifest (§2) pointer, section preservation map,
                              version tracking, adverse-event reporting contact
```
