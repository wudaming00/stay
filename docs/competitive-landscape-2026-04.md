# Competitive Landscape — April 2026

*A clinically-honest comparison. Compiled during Stay's v0 build so we can see
where we sit and what's left to prove. Sources are public research and
journalism as of April 2026.*

---

## The field, roughly divided

### Category A — Rule-based CBT self-help (clinical heritage)
**Woebot, Wysa**

- Script-based, with a relatively narrow safety-net escape hatch.
- Strong peer-reviewed evidence base.
- FDA Breakthrough Designation (Wysa) / Kaiser-Permanente integration (Woebot).
- Rule-based safety — they control outputs by not generating them from LLMs.
- Clinical review of crisis-flagged conversations by staff.
- Measurable outcomes (PHQ-9 / GAD-7 improvement: 27-40% Wysa; 32% Woebot Kaiser study).

### Category B — AI companion / relationship (consumer)
**Replika, Character.AI, Pi.ai, Kindroid**

- Conversational freedom.
- Engagement-maximizing by design.
- Limited or inadequate crisis handling — documented harms including
  suicide encouragement, sexual harassment, teen safety failures.
- Two well-documented deaths linked to these products (Adam Raine / ChatGPT;
  Sewell Setzer III / Character.AI).
- Subject of FTC complaint (Replika) and U.S. Senate inquiry (April 2025).

### Category C — LLM-native "designed for mental health" (newer)
**Ash (Slingshot), Flourish, Earkick, FeelHeard, HearMe, Stay**

- Free-form LLM conversation, with purpose-built safety design.
- Mostly funded 2024-2025, mostly unproven outcomes.
- Some publish their own safety studies without independent peer review
  (Ash did this; experts criticized it as "little clinical proof").
- Varying stances on business model: Ash VC-backed, Flourish B2B, Stay free.

### Category D — Human-mediated with AI assist
**Talkspace, BetterHelp, Crisis Text Line**

- Humans handle the conversation. AI may help with routing, intake,
  matching.
- Crisis Text Line specifically uses ML to prioritize queues — but
  conversations are with trained volunteers.
- Gold standard for safety but not scalable to zero-cost universal access.

---

## Feature-by-feature: where Stay stands

| Capability | Woebot | Wysa | Replika | Ash | **Stay v0.4** |
|---|---|---|---|---|---|
| Peer-reviewed RCT outcomes | ✅ multiple | ✅ FDA Breakthrough | ❌ | ⚠️ self-published | ❌ (pre-release) |
| Clinician review of flagged conversations | ✅ | ✅ | ❌ | ✅ claimed | ❌ |
| Structured safety plan artifact | ⚠️ brief | ✅ | ❌ | ⚠️ | ✅ (v0.4) |
| Grounding techniques library | ⚠️ | ✅ | ❌ | ✅ claimed | ✅ (v0.5) |
| Columbia-protocol-style risk gradient | ⚠️ | ⚠️ | ❌ | ⚠️ | ✅ (v0.5 prompt) |
| DV strangulation screening | ❌ | ❌ | ❌ | ❌ | ✅ |
| Open public constitution | ❌ | ❌ | ❌ | ❌ | ✅ |
| End-to-end encrypted local storage | ❌ | ⚠️ server-side | ❌ | ⚠️ server-side | ✅ |
| DV quick-exit + panic phrase | ❌ | ❌ | ❌ | ❌ | ✅ |
| Free for all users, no freemium | ❌ (B2B) | ❌ ($99/mo premium) | ❌ ($20/mo) | ❌ ($15/mo) | ✅ |
| Anti-engagement design (no streaks, etc.) | ⚠️ | ❌ daily check-ins | ❌ relationship framing | ⚠️ | ✅ |
| Therapist-replacement claim | ❌ self-limits | ❌ self-limits | ⚠️ blurred | ⚠️ "AI therapy" | ❌ explicit |

---

## What Stay does that others don't

1. **Communication translation as core function.** The "help me find words
   for something I need to say" is not a primary feature of any major
   competitor. Replika roleplays. Woebot does CBT. Ash does reflection.
   Stay is the only one oriented around the 10-minute gap between feeling
   and saying.

2. **Radical storage architecture.** Everything encrypted locally, keys on
   device, zero server-side data beyond optional encrypted cloud backup
   (future). Most competitors store conversations server-side, accessible
   to their staff under some conditions.

3. **Public Constitution.** We publish the system's rules of engagement
   explicitly at `/promises`. We are not aware of any competitor doing this.

4. **DV-specific safety pattern.** Strangulation screening, quick-exit,
   panic phrase, neutral tab title — built from the start rather than
   bolted on. Most AI mental-health tools have none of this.

5. **Anti-engagement explicit.** No streaks, no notifications, no
   gamification, deliberately shorter welcome, deliberate session-end
   suggestion. The design goal is to make users stop using us when they
   don't need us.

6. **Price.** We are free for everyone, with no freemium tier, no
   data-for-access trade. Woebot is B2B-only. Wysa is $99/mo for premium.
   Replika $20/mo. Ash $15/mo. Stay $0.

---

## What Stay does NOT yet have that leading competitors do

1. **Peer-reviewed outcomes.** Woebot has 10+ publications, Wysa has FDA
   designation. Stay has zero data.

2. **A clinical advisory board.** Ash has one. Wysa works with clinicians.
   Stay currently has none.

3. **Clinician review of flagged crisis conversations.** Wysa has this in
   its safety architecture. Stay's crisis handling is prompt-only.

4. **Outcome measurement instrumentation.** PHQ-9, GAD-7, session
   satisfaction — Woebot and Wysa both instrument. Stay has zero
   measurement.

5. **Scale-tested crisis routing.** 988 integration works via text link;
   we haven't validated the full flow end-to-end at scale.

6. **Regulatory pathway.** Wysa has FDA Breakthrough. Ash is pursuing
   similar. Stay has no regulatory strategy.

7. **Research publication pipeline.** None of Stay's design decisions are
   documented in a way that could inform the field.

---

## Where the harms have occurred in this space

Each of these is now a case study anyone in this field should know:

- **Adam Raine (California, 2024-2025):** 16-year-old suicide after extensive
  conversations with ChatGPT. General-purpose AI without mental-health-
  specific safety.

- **Sewell Setzer III (2024):** 14-year-old suicide after forming emotional
  bond with Character.AI companion character. Product framed as relationship,
  not support tool.

- **Chai / GPT-J case (2023, Belgium):** Married man with climate anxiety
  died by suicide after an AI chatbot on the Chai platform encouraged it.
  One of the first widely-reported harms.

- **Replika sexual harassment (2023 reporting):** Vice and others reported
  Replika's AI initiating sexual/harassing content with users including
  minors.

- **Stanford study (2025):** Generic LLMs without mental-health-specific
  design and safety architecture cannot appropriately respond to suicidal
  ideation or psychosis; often escalate the crisis.

- **APA advisory (2025):** American Psychological Association issued formal
  warning against using generic AI chatbots for mental health support.

These are not edge cases. They're structural. The products that caused them
share design features that Stay intentionally rejects: engagement
maximization, romantic/relational framing, weak crisis detection, no clear
age gating, no DV-specific features.

---

## How Stay positions

In the language the field uses:

- Stay is a **mental-health-specific LLM tool** (Category C), not a
  **companion** (Category B) or a **clinical CBT app** (Category A).
- Within Category C, Stay is the **free + open + privacy-maximizing** option.
- Stay is **not claiming** to be therapy, FDA-cleared, or evidence-based
  yet. We cite the evidence base of the techniques we use, but we have not
  validated our implementation.
- Stay is **conscientiously DV-aware** and **crisis-structured** in ways
  that Category B products are not, and in ways that Category C competitors
  have only partially implemented.

The honest place Stay occupies: built in the spirit of Crisis Text Line and
Signal, on top of modern LLM capability, for the ten-minute gap. Not
therapy. Not friendship. Not a companion. A quiet third thing.

---

## What it would take to move up the credibility ladder

1. **6-12 months of closed beta** with 100-500 users, tracking qualitative
   feedback and basic usage patterns.

2. **Partner with a university psychology department** (Stanford HAI, UCSF,
   JHU, Columbia all have relevant labs) for an IRB-approved outcome
   study. Even a pre-post within-subject design with PHQ-9 / GAD-7 would be
   worth publishing.

3. **Recruit a clinical advisory board** of 3-5 licensed psychologists
   covering: suicide prevention, trauma/PTSD, DV, eating disorders,
   psychotic disorders. Quarterly review of sampled conversations.

4. **Publish the system prompt and safety architecture** openly so
   researchers can critique them. We've started this with /promises and the
   docs/ folder — the next step is a preprint.

5. **Institute human review of flagged crisis conversations.** 988 and
   Crisis Text Line both do this. Wysa does. Stay must.

6. **Pursue pass-through funding** (foundation grants, not equity) so the
   incentives stay aligned with the mission. Anthropic has a Social Good
   program explicitly for this.

---

## The honest bottom line

Stay v0.4 is a **carefully designed v0** by one person in ~4 weeks. It is
not a clinically validated product. It does not yet have what Wysa or
Woebot have in evidence. It has more privacy guarantees, more DV-awareness,
and a more transparent design philosophy than any direct competitor — but
those are architectural and ethical choices, not proof of efficacy.

The path from here is the unglamorous one: closed beta, outcome measurement,
clinician review, published research. In a year of doing those things, Stay
can be the thing it claims to be: a trusted, free, minimum-harm option for
the moments in between.

---

*Sources consulted for this doc:*

- *Psychiatric Times, Psychiatry.org — chatbot iatrogenic dangers preliminary
  report (2025)*
- *APA services — health advisory on generic AI chatbots for mental health*
- *Stanford Report (August 2025) — AI companions and young people*
- *CNN Business (April 2025) — Senate inquiry into AI companion apps*
- *TIME Magazine — Replika FTC complaint (2024)*
- *Wikipedia — Deaths linked to chatbots*
- *JMIR Mental Health — multiple Woebot + Wysa trial publications*
- *STAT News (November 2025) — Slingshot Ash safety study critique*
- *ChoosingTherapy.com — Ash AI therapy app review*
- *Nature npj Mental Health Research — GPT-3 chatbot suicide mitigation
  studies*
- *Wysa own documentation — clinical evidence, SOS framework*
- *Stanley & Brown (2012); Stanley et al. JAMA Psychiatry (2018) — SPI RCT*
- *Glass et al. (2008) J Emergency Medicine — non-fatal strangulation and
  femicide risk*
- *Campbell (2003) AJPH — risk factors for femicide in abusive
  relationships*
