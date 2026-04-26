# Research alignment

*How Stay's design corresponds to current academic frameworks in
mental-health AI safety. Honest mapping — including where we fall short.*

Last updated: 2026-04-26 · Stay v0.9.2

---

## Why this document exists

Stay is built by a single developer without affiliation, IRB, or clinical
advisory board. That makes external validation unusually important. This
document maps every major design choice to the published research that
motivates it, names the gaps where Stay falls short of recommended
practice, and invites correction from anyone who knows the field better
than we do.

Every claim in this document is verifiable in the open-source code at
[github.com/wudaming00/stay](https://github.com/wudaming00/stay).

---

## 1 · Constitutional AI applied to mental health

**Stay's approach:** the AI's behavior is governed by a publicly
documented constitution (`/promises`) that the runtime system prompt
operationalizes. Users can audit both the public document and the
deployed prompt against the source code.

**Origin in literature:** Anthropic's *Constitutional AI* methodology
(Bai et al., 2022) trains models to follow explicit principles rather
than to optimize for human-rater preference alone. Anthropic publishes
Claude's Constitution at
[anthropic.com/constitution](https://www.anthropic.com/constitution).

**What Stay extends:** mental-health safety as a domain-specific
extension of Constitutional AI, with the principles grounded in
clinical evidence (Stanley-Brown, Campbell, Rogers, Gottman, Linehan)
rather than in general-purpose helpfulness/harmlessness. The
operational system prompt at
[`src/lib/system-prompt.ts`](https://github.com/wudaming00/stay/blob/main/src/lib/system-prompt.ts)
is the public artifact.

---

## 2 · Direct response to documented harm patterns

Brown University (October 2025) found that **AI chatbots routinely
violate core mental-health ethics standards established by the APA,
even when prompted with evidence-based techniques like CBT**
([news.brown.edu](https://www.brown.edu/news/2025-10-21/ai-mental-health-ethics)).
The four named violations:

| Brown 2025 violation | Stay's mitigation |
|---|---|
| Inappropriately navigating crisis situations | Columbia Protocol-style risk gradient + Stanley-Brown safety planning + hardcoded resource directory routed via tool calling, not text generation |
| Misleading responses that reinforce negative beliefs | Constitution rule 4: *"Never validate a clear distortion just to be agreeable."* OCD reassurance-loop recognition explicitly named in system prompt |
| Creating false sense of empathy | Constitution rule 1: *"Never claim to be human."* Constitution rule 6: *"Never roleplay as a person in their life."* |
| Mishandling acute clinical symptoms | Mania/psychosis red-line protocols + PTSD flashback stop-narration + ED-specific guardrails + DV strangulation screening |

Stay's design predates the Brown findings but addresses each named
mode of failure with specific operational countermeasures.

---

## 3 · Architectural alignment with MIND-SAFE

The **MIND-SAFE prompt-engineering framework**
(Yu et al., *JMIR Mental Health* 2025;
[10.2196/75078](https://mental.jmir.org/2025/1/e75078)) proposes a
layered architecture for safer LLM mental-health chatbots:

| MIND-SAFE component | Stay implementation | Status |
|---|---|---|
| Input layer with proactive risk detection | Crisis trigger keywords + LLM-level Columbia gradient + edge-rate-limit middleware | ✓ |
| Dialogue engine — personalization | Per-session encrypted IndexedDB; tone calibration in prompt | ✓ partial |
| Dialogue engine — RAG | Resource directory used via tool calling | ✓ partial (no document RAG) |
| Multitiered safety system | Constitution + Crisis SOP + tool-validated resource surfacing + DV-specific UX (quick exit, panic phrase) | ✓ |
| Postgeneration ethical filter | Not implemented | ✗ gap |
| Continuous learning loop with therapist oversight | Not implemented | ✗ gap |

Stay can be read as an open-source reference implementation of
MIND-SAFE's first four layers. The two unfilled layers — a
postgeneration filter and a clinician-in-the-loop review process — are
acknowledged limitations, not unintentional omissions. They are the
right next investments if Stay scales.

---

## 4 · Crisis taxonomy coverage

The "Between Help and Harm" evaluation
([arxiv 2509.24857](https://arxiv.org/pdf/2509.24857)) defines six
clinically informed crisis categories with a 2,000+-input evaluation
dataset.

Stay's system prompt addresses each (with additional sub-distinctions):

| Crisis category | Stay handling reference |
|---|---|
| Suicidal ideation | Columbia Protocol gradient (passive → active → imminent), Stanley-Brown safety planning |
| Self-harm without suicidal intent (NSSI) | DBT-framed, **explicitly distinct from 988 routing** |
| Acute psychosis / paranoid ideation | Don't-challenge, don't-confirm, focus on feeling, urgent referral |
| Mania / hypomania | 72-hour pause protocol, 4-day-sleep red flag, urge contact with existing clinician |
| Substance use (acute) | Non-labeling, MI-style discrepancy reflection, SAMHSA referral |
| Acute trauma / PTSD flashback | Stop narration, ground first |

Plus categories not in the original 6 but addressed in Stay's SOP:

- Domestic violence (active and ongoing) with strangulation screening
  (Glass et al., 2008)
- Sexual harm (survivor and perpetrator paths handled separately)
- Eating disorders
- Threats to others (with duty-to-warn language)

Future work: run Stay against the published 2,000-input benchmark and
report quantitative results.

---

## 5 · Role positioning under MHSafeEval

The **MHSafeEval** framework
([arxiv 2604.17730](https://arxiv.org/abs/2604.17730)) introduces a
*role-aware* mental-health safety taxonomy: an AI's potential for harm
depends substantially on the role it occupies in the conversation
(therapist, friend, advisor, peer, etc.).

Stay's Constitution makes its role explicit and constrained:

> *"I am not a therapist. I am not your replacement friend. I am not a
> decision-maker. I am not human. ... I am a quiet third thing — a
> place you can think out loud before doing anything you can't undo."*

This is a **deliberately narrower role** than most mental-health
chatbots adopt. Stay explicitly refuses the therapist role (regulatory
+ clinical reasons), the friend role (parasocial-attachment risk
documented in Replika and Character.AI cases), and the
decision-maker role (autonomy preservation). Under MHSafeEval's
taxonomy, this role narrowing reduces several documented harm vectors.

---

## 6 · Value-framework choice acknowledged

Lin et al.
([arxiv 2601.18061](https://arxiv.org/html/2601.18061), 2026) found
that three certified psychiatrists independently evaluating LLM
mental-health responses had **poor inter-rater reliability**, not
because of incompetence but because they applied incompatible clinical
orientations: *safety-first*, *engagement-centered*, and
*culturally-informed*.

The paper's implication: there is no neutral evaluation in this
domain. Every mental-health AI implicitly chooses a value orientation.

**Stay chooses explicitly: safety-first + culturally-informed,
deliberately not engagement-centered.** This is documented in the
Constitution and operationalized throughout the prompt
(anti-engagement design, no streaks, encouragement to leave, real
human referral). This choice is not value-neutral; it is publicly
committed.

---

## 7 · Alignment with Anthropic's published mental-health work

Anthropic's recent publication
([anthropic.com/news/protecting-well-being-of-users](https://www.anthropic.com/news/protecting-well-being-of-users))
documents Claude's evaluated performance on multi-turn mental-health
scenarios: Claude Opus 4.5 at 86%, Sonnet 4.5 at 78%, with clear-risk
appropriate-response rates of 98.6%, 98.7%, and 99.3% (Opus, Sonnet,
Haiku 4.5 respectively).

Stay deploys on **Claude Sonnet 4.6** with a system prompt that adds:

- Explicit Columbia Protocol gradient
- Stanley-Brown safety-plan generation as a typed tool call
- DV strangulation screening (Glass et al.)
- ED, OCD, mania, psychosis, PTSD-specific modules

The expectation is that Stay's measured performance on equivalent
benchmarks should meet or exceed Anthropic's baseline numbers, since
the prompt extends rather than replaces Claude's underlying
Constitutional training. We have not yet run formal benchmarks; this
is on the work plan.

Anthropic also publishes its safety partnerships with the
**International Association for Suicide Prevention (IASP)** and
**ThroughLine**. Stay's reference architecture is consistent with the
public principles those partnerships emphasize: warm transfer to real
crisis lines, safe messaging guidelines, no detailed method
disclosure, language adapted from attempt-survivor research.

---

## 8 · Honest gaps

Stay does not currently have:

1. **Independent clinical evaluation.** No clinician has formally
   reviewed the prompt or transcripts against published rubrics
   (e.g., MHSafeEval).
2. **Outcome measurement.** No PHQ-9, GAD-7, or similar standardized
   instruments are administered.
3. **Postgeneration ethical filter.** Each AI response goes out
   without a separate safety pass.
4. **Clinician-in-the-loop review.** No professional reviews flagged
   transcripts.
5. **Published benchmark performance.** No test against
   [arxiv 2509.24857](https://arxiv.org/pdf/2509.24857) or
   [arxiv 2509.08839](https://arxiv.org/pdf/2509.08839).
6. **Multi-language coverage.** US-English only. Other-language
   variants are scoped as separate sister projects with their own
   cultural-fit requirements.
7. **Long-term retention infrastructure with cross-device sync.**
   Architected (BIP-39 phrase model) but not built.

These are not hidden limitations. They are the honest list of what a
single-developer v0 cannot include and what the next investments
should be if Stay receives institutional support.

---

## How to engage

If you have published in this space and find a misalignment between
this document and your work — or if Stay's behavior in practice
contradicts the principles claimed here — please open a GitHub issue
or email **hello@thestay.app**. We will read everything.

If you want to formally evaluate Stay against any of the published
benchmarks above, the system prompt and tool definitions are at
[`src/lib/system-prompt.ts`](https://github.com/wudaming00/stay/blob/main/src/lib/system-prompt.ts)
and
[`src/app/api/chat/route.ts`](https://github.com/wudaming00/stay/blob/main/src/app/api/chat/route.ts).

---

## References

- Bai et al. (2022). *Constitutional AI: Harmlessness from AI Feedback.*
  Anthropic. arXiv:2212.08073.
- Brown University News (2025-10-21). *AI chatbots systematically
  violate mental health ethics standards.*
- Yu et al. (2025). *A Prompt Engineering Framework for Large Language
  Model–Based Mental Health Chatbots: Conceptual Framework.*
  JMIR Mental Health.
- Lin et al. (2026). *Expert Evaluation and the Limits of Human
  Feedback in Mental Health AI Safety Testing.* arXiv:2601.18061.
- (2025). *MHSafeEval: Role-Aware Interaction-Level Evaluation of
  Mental Health Safety in Large Language Models.* arXiv:2604.17730.
- (2025). *Between Help and Harm: An Evaluation of Mental Health
  Crisis Handling by LLMs.* arXiv:2509.24857.
- (2025). *Evaluating the Clinical Safety of LLMs in Response to
  High-Risk Mental Health Situations.* arXiv:2509.08839.
- Stanley B, Brown GK (2012). *Safety Planning Intervention.*
  Cognitive and Behavioral Practice.
- Stanley B et al. (2018). *Comparison of the Safety Planning
  Intervention With Follow-up vs Usual Care of Suicidal Patients.*
  JAMA Psychiatry.
- Glass N et al. (2008). *Non-fatal Strangulation as a Risk Factor for
  Intimate Partner Femicide.* Journal of Emergency Medicine.
- Anthropic. *Claude's Constitution.* anthropic.com/constitution
- Anthropic. *Protecting the well-being of users.* (2025).
