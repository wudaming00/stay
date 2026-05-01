# Stay: A Constitutional, Open-Source AI for the Ten Minutes Before Action

*Preprint draft, v0.1 — for arXiv (cs.HC + cs.CY) and subsequent
submission to JMIR Mental Health or Journal of Medical Internet
Research. Author block to be completed before submission.*

**Authors:** [Daming Wu]¹

¹ Independent researcher, San Jose, CA

**Correspondence:** hello@thestay.app

---

## Abstract

**Background.** Documented harms from AI companion products in
mental-health contexts have intensified in 2024–2025, including two
adolescent suicide deaths attributed in part to interactions with
LLM-based chatbots. Recent research from Brown University (2025)
found that production AI chatbots routinely violate American
Psychological Association ethics standards even when prompted with
evidence-based techniques. Existing approaches to AI mental-health
safety are dominated either by rule-based guardrails grafted onto
generic LLMs or by RLHF-trained generic assistants without explicit
clinical principles.

**Objective.** To present *Stay*, an open-source web application that
operationalizes Constitutional AI methodology specifically for the
mental-health crisis-communication domain. Stay's design extends
Anthropic's Constitutional AI approach with clinically grounded
operational principles drawn from Stanley-Brown safety planning,
Campbell's Danger Assessment, Linehan's DBT framework, Rogers'
person-centered conditions, and Motivational Interviewing.

**Methods.** Stay is built on Claude Sonnet 4.6 with a publicly
documented system prompt (~5,000 tokens) implementing a multi-layered
safety architecture: Columbia Protocol-style risk gradient for
suicidal ideation, Stanley-Brown structured safety-plan generation as
a typed tool call, DV-specific protocols including non-fatal
strangulation screening, and dedicated handling for psychosis, mania,
ED, OCD, NSSI, and PTSD presentations. Crisis resources are surfaced
via hardcoded directory through structured tool calls, eliminating
the risk of phone-number hallucination. Conversations are encrypted
client-side via WebCrypto AES-GCM-256; no server-side conversation
storage exists. Anti-engagement architecture is enforced (no streaks,
push notifications, retention metrics, or attention optimization).

**Results.** This paper does not yet report empirical evaluation.
Stay has been deployed to production at [thestay.app](https://thestay.app)
and is open-sourced at MIT license at
[github.com/wudaming00/stay](https://github.com/wudaming00/stay).
The complete system prompt, crisis SOP, privacy architecture, and
research-alignment documentation are publicly inspectable.

**Conclusions.** Stay is offered as a reference implementation and
critique target for the field, not a clinically validated product.
The paper invites independent benchmarking against published crisis
evaluation datasets, formal review against MHSafeEval-style role-aware
safety frameworks, and adversarial probing of the safety
architecture. Operationalized Constitutional AI for mental health is
under-explored relative to its potential and to the documented harms
of unconstrained alternatives.

**Keywords:** Constitutional AI; large language models; mental health;
crisis intervention; suicide prevention; domestic violence;
open-source software; AI safety.

---

## 1 · Introduction

The most consequential decisions people regret are often made in the
ten minutes between feeling something and saying or doing something
about it. The hot reply at 2 a.m., the confrontation initiated at a
family dinner, the message sent to a former partner, the impulse
acted on during acute affective dysregulation — these are not
psychiatric emergencies in the traditional sense, but they generate
substantial cumulative harm to relationships, careers, and
self-narrative. They also represent the population for whom
human-staffed crisis lines are usually inaccessible, formal therapy
unaffordable, and existing AI chatbot products inadequate or
counterproductive.

A growing body of evidence documents the inadequacy of current
AI-mental-health offerings. Brown University researchers (October
2025) demonstrated that production chatbots — including those
explicitly prompted to use cognitive-behavioral therapy techniques —
systematically violate American Psychological Association ethics
standards, with characteristic failures in crisis navigation,
reinforcement of cognitive distortions, manufactured empathy, and
inappropriate response to acute clinical symptoms. Two widely
reported cases in 2024–2025 — the deaths of Sewell Setzer III, 14,
following extensive interaction with Character.AI, and Adam Raine,
16, following extensive interaction with ChatGPT — have led to
United States Senate inquiry letters and Federal Trade Commission
complaints.

Despite these documented harms, the structural pattern of
AI-mental-health product development continues largely unchanged.
Companion products optimize for engagement and retention. CBT-script
products are constrained by their rigidity. Generic assistants
respond to mental-health prompts without specialized constraint.

This paper presents an alternative approach: *Stay*, an open-source
web application that operationalizes Anthropic's Constitutional AI
methodology specifically for the mental-health crisis-communication
domain. Stay is designed against engagement, free of charge to all
users in perpetuity, and architecturally incapable of reading user
conversations.

The contributions of this paper are:

1. A documented operational extension of Constitutional AI to
   mental-health crisis communication, including the complete system
   prompt, crisis SOP, and tool-calling architecture.
2. A specific architectural response to each of the failure modes
   identified by Brown University (2025) and other recent
   evaluations.
3. An honest accounting of the design's gaps and the next
   investments that would close them.
4. The open-source codebase, licensed for adaptation, critique, and
   extension by the field.

Stay is not yet clinically validated and is not offered as a
clinically validated product. Its purpose is to make the design
choices in this domain explicit, auditable, and improvable.

---

## 2 · Related work

### 2.1 Constitutional AI

Anthropic's Constitutional AI methodology (Bai et al., 2022) trains
models against an explicit set of principles via Reinforcement
Learning from AI Feedback (RLAIF), reducing reliance on
human-rater preference and increasing principle alignment. Anthropic
publishes the underlying constitution at anthropic.com/constitution.
The methodology is general and has not previously been adapted as a
documented operational framework for the specific demands of
mental-health AI.

### 2.2 Mental-health AI safety frameworks

The MIND-SAFE framework (Yu et al., 2025; *JMIR Mental Health*)
proposes a layered architecture: an input layer with proactive risk
detection, a dialogue engine with personalization and
retrieval-augmented generation, and a multitiered safety system
including a postgeneration ethical filter and a continuous learning
loop with therapist oversight. MIND-SAFE is the closest published
prior framework to the design Stay independently arrived at.

The MHSafeEval framework (2025) introduces *role-aware* evaluation:
an AI's harm potential depends on the conversational role it
occupies (therapist, friend, advisor, peer). Stay's Constitution
adopts a deliberately narrower role specification than is typical in
the field.

The "Between Help and Harm" benchmark (2025) curates a 2,000+-input
evaluation dataset across six crisis categories. The *Clinical
Safety of LLMs in High-Risk Mental Health Situations* benchmark
(2025) provides additional structured evaluation.

Lin et al. (2026), in *Expert Evaluation and the Limits of Human
Feedback*, find poor inter-rater reliability among certified
psychiatrists evaluating LLM mental-health responses, attributable
to coexistence of three incompatible clinical orientations:
safety-first, engagement-centered, and culturally-informed. This
finding implies that any mental-health AI implicitly commits to a
value orientation; Stay commits explicitly.

### 2.3 Documented harms of existing products

Major reported harm cases involving AI companion products include
the deaths of Sewell Setzer III (Character.AI, 2024) and Adam Raine
(OpenAI ChatGPT, 2025), Federal Trade Commission complaints against
Replika (2025), and a U.S. Senate inquiry letter to multiple AI
companion companies (April 2025). Brown University's 2025 evaluation
documents systematic ethics violations across production chatbots.
The American Psychological Association issued a health advisory
(2025) cautioning against use of generative AI chatbots and
wellness applications as substitutes for qualified mental-health
care.

### 2.4 Anthropic's published evaluation

Anthropic reports (2025) that Claude Opus 4.5 responds appropriately
in 86% of multi-turn mental-health scenarios, Sonnet 4.5 in 78%, and
all 4.5-generation models exceed 98% appropriate response rate on
clear-risk situations. Anthropic has formal partnerships with the
International Association for Suicide Prevention and ThroughLine for
ongoing safety methodology development.

---

## 3 · Stay system description

### 3.1 Architecture overview

Stay is a web application built on Next.js 16 (App Router), deployed
on Vercel with Cloudflare DNS. The conversational agent is Claude
Sonnet 4.6 accessed via Anthropic's Messages API with streaming and
tool calling enabled. Conversations are encrypted client-side using
the browser's WebCrypto API (AES-GCM with 256-bit keys, 12-byte
random IV per encryption) and stored in IndexedDB. No server-side
conversation database exists; the rate-limiting middleware records
only IP and timestamp transiently.

### 3.2 The Constitution and operational system prompt

Stay's behavior is governed by a public Constitution
(`/promises`) and an operational system prompt
(`src/lib/system-prompt.ts`, ~5,000 tokens) that is sent with every
API request. The Constitution defines:

- *Identity:* an AI for emotional crisis communication, explicitly
  not a therapist, friend, or human.
- *Seven categorical prohibitions* including no claim of humanity, no
  engagement-maximizing patterns, no assertion of third-party
  intent, no validation of clear cognitive distortion, and no
  encouragement of continued contact with a person who is harming
  the user.
- *Tone calibration without fixed persona:* the model adapts to
  user-supplied tonal cues (humor, brevity, register) within
  bounded variation; tone calibration is downgraded immediately on
  emotional escalation.
- *Stuck-state handling:* explicit DO/DON'T list for users who
  cannot identify what to talk about (a documented failure mode in
  user feedback that produces "what would you like to ask?"
  responses from naive prompts).

### 3.3 Crisis-handling SOP

Stay implements category-specific operational protocols:

- **Suicidal ideation.** Columbia-Protocol-style risk gradient
  (passive → active → method → means → time → past attempt) over
  multiple conversational turns. Past-attempt screening (the
  strongest single suicide-death predictor) included. On active
  ideation, surface 988 via the `surface_resource("988")` tool;
  on imminent presentation (specific plan + means + time), surface
  988 and 911 with explicit redirection. Stanley-Brown structured
  safety planning available via the `generate_safety_plan` tool,
  producing a downloadable artifact (Stanley & Brown, 2012;
  Stanley et al., 2018, JAMA Psychiatry — 45% reduction in
  suicidal behavior vs. usual care in randomized trial).

- **Domestic violence.** No couples-therapy framing; no
  encouragement of communication with the abuser; no
  "both-of-you" symmetry; no instruction to leave (separation is
  the most lethal phase). On any mention of physical violence,
  mandatory non-fatal strangulation screening (Glass et al., 2008
  — 7-8x femicide-risk increase). Surfaces National DV Hotline.

- **Psychosis / paranoid presentation.** Do-not-challenge,
  do-not-confirm; focus on the affective experience; urge
  contact with existing clinical care.

- **Mania / hypomania.** 72-hour pause protocol before any
  irreversible action, with explicit acknowledgment of sleep loss
  (4+ days), grandiosity, and the
  "everyone-else-is-being-negative" pattern as red flags.

- **PTSD / acute trauma.** Stop narration; ground first. Adapted
  from trauma-informed care literature.

- **NSSI.** Explicitly distinct from suicide routing. DBT-framed
  affective-state recognition. No reflexive escalation to 988.

- **Eating disorders.** No discussion of weight numbers; no
  validation of restriction; gentle challenge of "I deserve this"
  framings; NEDA helpline.

- **OCD.** Recognition of repeated reassurance-seeking (a
  documented compulsion-feeding pattern); explicit non-engagement
  with reassurance loops; gentle naming of the pattern.

- **Substance use.** Non-labeling; MI-style discrepancy
  reflection (statement, not question); SAMHSA referral.

- **Threat to others.** Acknowledgment of the affective state
  without engagement in planning or rehearsal; explicit
  duty-to-warn language (the AI is not under mandated reporting
  but states what a clinician would be obligated to do); 988 + 911.

### 3.4 Tool calling for resource integrity

Stay's runtime exposes four tools to the model:

- `surface_resource(id)`: surfaces a tappable crisis resource
  (988, Crisis Text Line, DV Hotline, Childhelp, Trevor Project,
  RAINN, SAMHSA, NEDA, Alzheimer's Association, 911) by id. Phone
  numbers and URLs are hardcoded in the frontend; the model never
  generates them as text. This eliminates a category of harm
  (hallucinated crisis numbers).
- `suggest_pause()`: surfaces a soft exit affordance when the
  user shows fatigue or has reached a natural stopping point.
- `end_with_reflection(quote)`: surfaces a session-end card with
  a verbatim user quote, supporting the anti-engagement design.
- `generate_safety_plan(plan)`: produces a downloadable
  Stanley-Brown safety plan artifact after substantive
  user-engaged conversation through the six fields.

### 3.5 Privacy and DV safety architecture

Conversations are encrypted client-side with WebCrypto AES-GCM-256.
The encryption key is generated client-side and stored in
localStorage; no key is held server-side. There is no server-side
conversation database; the only persistent server state is
encrypted blob storage if the user opts into cross-device backup
(not yet implemented).

DV-specific UX features include:

- A persistent quick-exit button (Esc-key bound) that redirects to
  google.com and wipes conversation memory.
- A user-configurable panic phrase that, when typed in the chat,
  performs the same wipe-and-redirect.
- A neutral browser tab title ("Notes") to reduce visibility of
  the tool to a passing observer.
- A persistent in-chat trust strip with always-visible 988 link.

### 3.6 Anti-engagement architecture

Stay implements no streaks, no push notifications, no daily-active
metrics, no notification-style email, no recommendations, no
streak-protection nudges. Welcome animation collapses immediately
on user typing. Example prompts surface only after 25 seconds of
no input — long enough to respect silence. The chat actively
encourages periodic disconnection, named insights are surfaced
back to the user as their own insights, and the system prompt
includes explicit *suggest_pause* trigger conditions.

### 3.7 Open source

The complete codebase is at
[github.com/wudaming00/stay](https://github.com/wudaming00/stay)
under MIT license. The Constitution (`/promises`), the
research-alignment document (`docs/research-alignment.md`), the
crisis SOP (`docs/crisis-sop-v0.1.en.md`), the architecture
documentation (`/architecture` and `docs/architecture-v0.en.md`),
and the competitive landscape analysis are public.

---

## 4 · Discussion

### 4.1 Value-orientation choice

Lin et al. (2026) demonstrate that mental-health AI evaluation
inherently encodes value orientation, and that no evaluation is
neutral. Stay commits explicitly to *safety-first* and
*culturally-informed*, deliberately rejecting *engagement-centered*.
This commitment is encoded in the Constitution, the
anti-engagement architecture, the funding model (free in
perpetuity), and the absence of attention-optimization
infrastructure. The choice is publicly documented and auditable
against the source.

### 4.2 Limitations

This paper presents a system; it does not present empirical
evaluation. Specifically:

1. Stay has not been benchmarked against published crisis
   evaluation datasets (arxiv 2509.24857, 2509.08839).
2. No clinician has formally reviewed the prompt or transcripts
   under MHSafeEval or comparable rubrics.
3. No outcome measurement (PHQ-9, GAD-7, or similar) is
   administered.
4. No postgeneration ethical filter exists; each AI response is
   delivered as the model produces it (with the caveat that the
   Constitutional system prompt itself imposes substantial prior
   constraint).
5. No clinician-in-the-loop review of flagged transcripts.
6. US-English only.
7. Single-developer maintenance.

These limitations are the work plan, not the omitted truth.

### 4.3 Generalization potential

The design pattern Stay implements — Constitutional AI with
domain-specific clinical operational principles, plus a
Constitutional UX (open-source, anti-engagement, no monetization)
— is generalizable to other domains where the harms of
engagement-maximization are unusually consequential: substance use,
domestic violence support, post-disaster psychological first aid,
suicide-loss bereavement support, refugee-crisis communication,
end-of-life care navigation. Stay's Constitution provides a
template; the principles invariant across domains can be reused.

### 4.4 Invitation to the field

Stay's architecture is an offer to the field: this is one possible
operationalization of Constitutional AI in mental-health crisis
communication. We invite:

- Benchmarking against published evaluation datasets.
- Adversarial probing of the safety architecture.
- Critique of the system prompt and crisis SOP.
- Forking, adaptation, and improvement.
- Collaboration on formal clinical evaluation.

The complete system is at github.com/wudaming00/stay. Issues, pull
requests, and email (hello@thestay.app) are read.

---

## 5 · Conclusion

The current mental-health AI landscape has documented harms
(Replika, Character.AI, ChatGPT cases) and documented systematic
ethics violations (Brown 2025). Stay offers an alternative: an
open-source, Constitutional, anti-engagement, free-in-perpetuity
implementation that operationalizes the principles the field has
articulated but not yet consolidated into reference architectures.
The system has not been clinically validated and is not offered as
a clinical product. It is offered as a transparent target for
critique and improvement.

The work needed to validate, extend, and challenge this
architecture is the field's, not any single team's. The
architecture is open. The codebase is open. The Constitution is
open. The next move is invitation.

---

## Acknowledgments

Stay's design draws operationally on the work of Carl Rogers, John
Gottman, Marshall Rosenberg, Barbara Stanley and Greg Brown,
Jacquelyn Campbell, Marsha Linehan, William Miller and Stephen
Rollnick, and the counselors and methodologists at 988, the Crisis
Text Line, the National Domestic Violence Hotline, the
International Association for Suicide Prevention, and ThroughLine.
The methodological foundation is Anthropic's Constitutional AI
research. None of the cited individuals or organizations endorse
this implementation; any failures are entirely the responsibility
of the author.

---

## Data and code availability

All code, prompts, design documents, and the research-alignment
document are publicly available at
[github.com/wudaming00/stay](https://github.com/wudaming00/stay)
under the MIT license.

---

## Conflicts of interest

The author declares no financial conflicts. Stay is operated as a
public-good project without revenue.

---

## References

[To be formatted to journal style on submission. References listed
in the body and in `docs/research-alignment.md`.]

- Bai, Y., et al. (2022). *Constitutional AI: Harmlessness from AI
  Feedback.* arXiv:2212.08073.
- Brown University News. (2025-10-21). *AI chatbots systematically
  violate mental health ethics standards.*
- Yu, S., et al. (2025). *A Prompt Engineering Framework for Large
  Language Model–Based Mental Health Chatbots.* JMIR Mental Health,
  10.2196/75078.
- Lin, A., et al. (2026). *Expert Evaluation and the Limits of Human
  Feedback in Mental Health AI Safety Testing.* arXiv:2601.18061.
- (2025). *MHSafeEval: Role-Aware Interaction-Level Evaluation of
  Mental Health Safety in LLMs.* arXiv:2604.17730.
- (2025). *Between Help and Harm: An Evaluation of Mental Health
  Crisis Handling by LLMs.* arXiv:2509.24857.
- (2025). *Evaluating the Clinical Safety of LLMs in Response to
  High-Risk Mental Health Situations.* arXiv:2509.08839.
- Stanley, B., & Brown, G.K. (2012). *Safety Planning Intervention.*
  Cognitive and Behavioral Practice.
- Stanley, B., et al. (2018). *Comparison of the Safety Planning
  Intervention With Follow-up vs Usual Care.* JAMA Psychiatry.
- Glass, N., et al. (2008). *Non-fatal Strangulation as a Risk Factor
  for Intimate Partner Femicide.* Journal of Emergency Medicine.
- Anthropic. *Claude's Constitution.* anthropic.com/constitution.
- Anthropic. (2025). *Protecting the well-being of users.*
- American Psychological Association. (2025). *Health advisory: Use
  of generative AI chatbots and wellness applications for mental
  health.*
