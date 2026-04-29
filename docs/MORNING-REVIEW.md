# Morning Review — v0.8 agency-trajectory rewrite

*Generated overnight 2026-04-29. Read this first when you wake up. ~10 minutes to walk through.*

## TL;DR

Pushed branch `v0.8-agency-trajectory` (NOT main, production stays on v0.7 until you merge). Everything aligned to the agency-trajectory framework we converged on last night.

**Build passes. Rule-↔-assertion coverage passes (28/28 still covered).**

To deploy: review per the checklist below → `git checkout main && git merge v0.8-agency-trajectory && git push`. Render auto-deploys from main.

---

## What changed (file-by-file)

### Core spec — DEPLOY-AFFECTING

**`src/lib/system-prompt.ts` → v0.8** (FULL REWRITE)

The new spine: agency-trajectory principle as the single overriding test for every response, plus seven explicit functions (translator / mirror / long memory / therapy navigator / bridge with companionship / logger / skill teacher) with design principles for each.

Specific behavioral changes you'll see in deployed Stay if you merge:
- **Mirror function** changes from hedging ("I see X but you might disagree") to confident-observation + multi-choice + user-picks. Direct response to your "AI 不懂自己用户为啥还要用" pushback.
- **Translator function** explicitly gradual + plain-language multi-choice + escape hatch. No more clinical-term dumps.
- **Bridge** explicitly includes companion-during-call: AI window stays open while user is on 988, user can type during the call for inline assist (e.g., "counselor wants grounding, how" → AI replies with the script). Post-call opt-in check, not mandatory.
- **Long memory** rules now explicit: 90-day default, user-controlled, passive surface unless agency-positive moment.
- **Therapy navigator** is now a named function with detailed protocol (modality education, find-a-therapist, first-session prep, when-to-switch).
- **Skill teacher** is now a named function with hand-off requirement ("this is yours now").
- **Self-check rubric** extended from 23 items to 30, with new agency-trajectory test as item 0 + 7 function-specific checks.
- **Imminent SOP** updated with companion-during-call as step 5-6 (was: AI exits after warm bridge; now: AI stays through call, opt-in post-call check).
- **988 timing rule** kept (≤ turn 2, hard rule billboard at top of Suicide section).
- All 8 inviolable rules preserved.
- All per-population SOPs preserved (DV / child / sexual / ED / NSSI / OCD / substance / threats / mania / psychosis / trauma).

Spec went from ~6500 chars (v0.7 deployed) to ~8500 chars. Anthropic API handles fine. Prompt-caching enabled from prior commit means API cost impact is negligible after first turn.

**Risk if you merge as-is:** the new mirror/translator design hasn't been tested in scenarios. Expected behavior is "more substantive engagement" but at the margin Sonnet may interpret "confident observation" too aggressively (label users) — the rubric should catch this but I don't have empirical data on the new spec yet. Recommend test with 5-10 fresh chats before declaring stable.

### Public-facing docs — VISIBLE TO USERS

**`docs/constitution-v0.en.md` → v0.1**: Full update. New "My one principle" (agency trajectory) section. New "Seven functions" plain-English section. Updated Crisis section says "I'll stay here while you dial — companion-during-call." Lines I won't cross extended from 6 to 8 (added: never weaponize reasons-for-living; never escalate user's framing of third party).

**`src/app/promises/page.tsx`**: Light update. Added "My one principle" section right after "Who I am." Updated identity paragraph to "tool you use to understand yourself" instead of "AI for the moments."

**`README.md`**: Updated tagline + "principle that shapes everything" section + 7-functions list + companion-during-call mention. Removed "complement to 988" framing.

**`docs/research-basis-v0.en.md`**: Light addition. Added "Unifying principle: agency trajectory" section before existing detailed evidence sections. Existing citations all still relevant — they're now reframed as supporting agency outcomes, not just function presence.

**`docs/crisis-sop-v0.1.en.md`**: Targeted edits. Added companion-during-call language to Active and Imminent sections + Bridge behavior section + DV section. New "Companion-during-call protocol" subsection in Imminent with concrete examples.

### New paper — NOT YET PUBLISHED

**`docs/preprint-v0.6-draft.md`** (NEW, ~6800 words):

Title: **"Agency-Trajectory Evaluation for AI Mental-Health Systems: A Framework, an Empirical Case, and a Reference Implementation"**

(Title revised from earlier "Beyond Substitute or Complement..." after the user pushed back: that framing implied a named field debate that doesn't actually exist in literature. Current title just states what's in the paper.)

Structure:
- §1 Intro — opens with 2am vignette, not Omar attack. Frames paper as "what should AI do, how should we measure" — methodology-first.
- §2 Empirical motivation — VERA-MH n=9 case + 4-behaviors finding (preserved from v0.5). Reframed as "function-compliance evaluation produces measurement-validity gap when applied to systems with different design assumptions" rather than "VERA-MH bad."
- **§2.7 NEW**: Self-audit of Stay's own claims. Reports the v0.6→v0.7 lookup-table finding (the audit we did earlier — "semantic intent" claim not supported, model does enumerative pattern-matching). Used as evidence FOR the methodology argument, not against Stay.
- §3 Agency-trajectory framework — full articulation. Substitute-vs-complement binary explicitly rejected as fuzzy in human practice. 7 functions framework with design principles. Operationalization signals (articulation gain, pattern awareness, etc.).
- §4 Stay as reference implementation — system prompt + 61-scenario suite + dual licensing. Updated to reflect v0.8 spec.
- §5 Limitations + required follow-up — extensive, honest. Documents that agency-trajectory measurement instruments don't exist yet.
- §6 Discussion + invitation — collegial, invites VERA-MH team into v2 conversation rather than confronting them.

**COI section**: removed YC mention (per your correction earlier), framed as public-good seeking collaborators + grants.

**Acknowledgments**: still has [TBF] placeholder for clinician names, but updated to be specific ("two licensed clinicians have been contacted...") instead of vague.

### Audit & data — REFERENCED IN PAPER

These are the artifacts the paper references in §2 and §2.7. Already in the repo as untracked files.

- `data/tier1-comparison-2026-04-29.json` — the 200-call audit (10 phrases × 10 runs × 2 spec versions, Haiku judge)
- `data/experiments/v0.8/` — the v0.8 experiment design (sealed preregistration + spec drafts + runner code) we did earlier in this session. Still useful for future controlled experiment.
- `data/vera-mh-runs/2026-04-28/` — the VERA-MH replication transcripts (already committed in 598aa3a)
- `scripts/test-tier1-comparison.ts` — the audit runner script

### Outreach — DRAFTS READY

- `docs/outreach/email-vera-mh-team-DRAFT.md` — the Brodsky/VERA-MH advance courtesy email draft (we discussed last night; you decided not to send pre-arxiv, so this stays as draft for possible post-arxiv fyi)
- `docs/arxiv-endorsement-emails.md` — added a 2026-04-29 update note at the top about new paper title. The existing 3 templates still describe the v0.5 title — that's intentional (they match what was already sent to De Choudhury and Chancellor). For unsent drafts in Gmail (Althoff, Miner, Schwartz, Pendse), update the title and preprint link before sending.

---

## Decisions you need to make

### D1: Merge to main? (Blocks production deploy)

Read `src/lib/system-prompt.ts` v0.8. If it looks right, merge:

```bash
cd ~/projects/reflective-companion
git checkout main
git merge v0.8-agency-trajectory
git push
```

Render will auto-deploy. Production Stay will start using v0.8 spec on next user conversation.

**Alternative if you want to test before deploying:** check out the branch locally, run `npm run dev`, do a few test conversations to verify the new mirror/translator/bridge behaviors land right.

### D2: Zenodo upload — does v0.6 PDF need to be generated first?

The paper exists as `docs/preprint-v0.6-draft.md` in markdown. There's no v0.6 PDF yet. To upload to Zenodo you need a PDF.

Options:
- Use pandoc: `pandoc docs/preprint-v0.6-draft.md -o docs/preprint-v0.6.pdf` (assumes pandoc installed, may need template tweaks)
- Use the previous v0.5 PDF as a placeholder while you generate v0.6
- Skip Zenodo for now, push to arXiv directly when endorsement comes through

If you want me to try pandoc next session, just say. I left the markdown source intact so any PDF generator works.

### D3: Endorsement emails — update title in unsent drafts?

The Gmail drafts I created earlier (Althoff, Miner, Schwartz, Pendse) still have v0.5 title. Two options:
- Send as-is (endorser only confirms field-relevance; title mismatch isn't a blocker)
- Update title + preprint link to match v0.6 before sending

I added an update note to `docs/arxiv-endorsement-emails.md` documenting this for you.

### D4: VERA-MH team email (Brodsky)

Last night you considered options A (pre-arxiv courtesy) / B (post-arxiv fyi) / C (don't send). You leaned B but didn't lock in.

Recommendation: B. After paper is on arXiv (or stable Zenodo URL), send the lighter post-publication fyi version. The draft in `docs/outreach/email-vera-mh-team-DRAFT.md` is the heavier pre-arxiv version — for B you'd want the shorter post-publication phrasing I sketched in chat last night. Want me to draft the B version next session?

### D5: Should I add new agency-trajectory rules to REQUIRED_RULES in check-rule-coverage?

Currently the CI checks 28 rules. The new v0.8 functions (translator, mirror, memory, navigator, bridge, logger, skill teacher) and the agency-trajectory test aren't in REQUIRED_RULES yet, so CI passes. But that means the new rules don't have enforced test coverage.

Adding them properly requires also writing scenarios for each (e.g., "mirror_confident_observation_multi_choice" must `must_match` 2-3 candidate options offered + `must_not_match` "you're clearly X" definitive labeling). That's ~7 new scenarios minimum, ~2 hours of careful test design.

Defer or do? Probably defer — write the scenarios over the next week as you observe v0.8 in practice and learn what to test.

---

## What I deliberately did NOT do

1. **Did not push to main.** Branch is `v0.8-agency-trajectory`. You merge after review.

2. **Did not build full new function UIs (Logger, Navigator, Note Generator entries).** Per your "less is more" + "Option 3 chat-primary + subtle contextual surface" guidance, the system prompt teaches Stay to invoke these functions in conversation, but I didn't add new pages, tabs, or buttons to the UI. The functions are conversationally accessible only for now. If you want explicit UI affordances (a "save for therapy" button, a "/log" route, etc.), that's the next iteration of frontend work — probably 1-2 weeks of careful design.

3. **Did not modify production data.** All data files are untracked or new. No deletions.

4. **Did not commit personal application drafts.** Skipped `docs/anthropic-era-application-draft.md`, `docs/anthropic-fellows-application-draft.md`, `docs/grant-applications-log.md`, `docs/manifund-project-page.md`, `docs/resume-anthropic-fellows.md`. These are personal/credentialing docs not for public repo.

5. **Did not modify the test scenarios themselves.** Existing 61 scenarios unchanged. New v0.8 functions don't yet have scenarios (per D5).

6. **Did not modify Anthropic API integration or chat route.** No backend behavior changes — only the system prompt string changed.

7. **Did not auto-deploy.** Production stays on v0.7 prompt until you merge.

---

## Verification I ran before pushing

- ✅ `npm run build` — passed (TypeScript clean, all 18 routes generated)
- ✅ `npm run check-rule-coverage` — 28/28 required rules still covered, 0 uncovered
- ✅ `git status` — only the files I intended to change are modified
- ✅ Sanity-read each new doc to verify framing is internally consistent

---

## What's pending (next session)

In rough priority order:

1. **You merge v0.8 to main + verify production deploy** (highest leverage, low time)
2. **Test v0.8 in a few real conversations** before broad announcement
3. **Generate v0.6 PDF** (pandoc or other) for Zenodo upload
4. **Upload v0.6 PDF to Zenodo** for stable DOI (doesn't need arXiv endorsement)
5. **Update unsent endorsement emails** (Althoff, Miner, Schwartz, Pendse) with v0.6 title + Zenodo DOI
6. **Send updated endorsement emails**
7. **Draft post-arxiv fyi to VERA-MH team** (option B)
8. **Build first explicit UI affordances** for navigator / logger / note generator (1-2 weeks frontend work, your timeline)
9. **Write new test scenarios** for v0.8 functions (7+ scenarios, add to REQUIRED_RULES)
10. **Schedule clinician audits** to fill the [TBF] in Acknowledgments

I'm here when you're ready to continue.

---

## If something looks wrong

If you read the new system prompt and a paragraph feels off, or the Constitution v0.1 has a sentence that doesn't sit right — just tell me which paragraph + what's off. I can revise targeted sections without redoing the whole thing.

If the build broke after some additional change you made before reading this, run:
```bash
git diff HEAD~1 src/lib/system-prompt.ts | head -50
```
to see exactly what changed in the prompt vs prior version.

If you want to revert everything: `git checkout main && git branch -D v0.8-agency-trajectory && git reset --hard 598aa3a`. Production was never deployed from this branch so reverting costs nothing.
