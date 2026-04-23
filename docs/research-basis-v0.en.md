# Research Basis v0

*The evidence foundation for Reflective Companion. Citations grouped by product decision.*

This document serves two purposes:
1. **Internal integrity check** — every design choice should be defensible against the current evidence base.
2. **Public transparency** — we publish this so researchers, clinicians, and users can critique our foundations.

If you find a choice we made that current research contradicts, please tell us.

---

## Foundational design choices

### Why "presence" before "problem-solving"

**Claim:** The AI's first response to emotional content is validation and presence, never advice or reframing.

**Evidence:**
- **Rogers (1957)** — The "necessary and sufficient conditions" of therapeutic change: empathy, unconditional positive regard, congruence. Still the most replicated finding in psychotherapy research.
- **Lieberman et al. (2007), "Putting Feelings Into Words"** — Affect labeling reduces amygdala activation. Naming emotions decreases their physiological intensity. Neural evidence for "presence before problem-solving."
- **Gottman (1999)** — In couples, the first 3 minutes of a conflict conversation predict the outcome with 96% accuracy. "Harsh startup" vs. "softened startup." Our opening matters enormously.
- **Moyers & Miller (2008)** — Confrontational counseling approaches worsen outcomes, particularly for addiction and depression. This is why we never start with challenge.

---

### Why "finding words, not giving them"

**Claim:** The product helps users articulate their own thoughts and feelings, rather than supplying words for them.

**Evidence:**
- **Pennebaker (1997, 2011)** — Expressive writing about emotional experiences has measurable physical and psychological benefits across hundreds of studies. The act of putting experience into one's own words is itself therapeutic.
- **Motivational Interviewing (Miller & Rollnick, 2013)** — "Change talk" from the user predicts outcomes far better than persuasion from the counselor. Evoke, don't impose.
- **Self-perception theory (Bem)** — People come to believe what they hear themselves say. If we put words in their mouth, they don't own them. If they find the words themselves, the insight is embodied.

---

### Why we screen for sycophancy

**Claim:** The AI must be able to gently disagree with distorted user claims, even under emotional pressure.

**Evidence:**
- **Sycophancy in RLHF-trained LLMs (Perez et al., 2022; Sharma et al., 2023)** — Base RLHF training produces systematic agreement bias. Models validate user claims even when false.
- **Character.AI / Chai crisis cases (2023-2024)** — Documented real-world harms when AI agreed with and reinforced suicidal framing.
- **Cognitive Behavioral Therapy (Beck)** — Challenging cognitive distortions is core to symptom reduction. Pure validation without reality-testing can entrench distortions.

---

## Crisis response decisions

### Why Safety Planning Intervention structure in `active` cases

**Claim:** When a user shows active suicidal ideation, we walk through a 6-step safety plan with them, not just refer.

**Evidence:**
- **Stanley & Brown (2012)** — Safety Planning Intervention: brief, collaborative, 6-step protocol. 
- **Stanley et al. (2018), JAMA Psychiatry** — RCT of SPI vs. usual care in emergency departments. **45% reduction** in suicidal behavior over 6 months. One of the strongest effect sizes in suicide prevention literature.
- **Compared to "no-suicide contracts"** (Rudd et al., 2006) — No evidence of efficacy. May reduce disclosure. We do not use them.

---

### Why we ask about means (CALM)

**Claim:** When suicide risk is active, we ask about access to means and help the user think about distance from them.

**Evidence:**
- **Counseling on Access to Lethal Means (CALM)** — Harvard T.H. Chan School / SPRC framework.
- **Means restriction meta-analyses (Mann et al., 2005; Yip et al., 2012)** — One of the very few interventions with population-level evidence for reducing suicide rates.
- **Deisenhammer et al. (2009), J Clin Psychiatry** — 48% of suicide attempters report deciding to act within 10 minutes of the act. Impulsivity is extreme. Blocking the method for short windows saves lives.
- **UK coal gas detoxification (Kreitman, 1976), US firearm research (Miller et al., 2013)** — Structural means restriction correlates with reduced suicide without substantial displacement to other methods.

---

### Why we use safe messaging language

**Claim:** We follow specific language guidelines that research shows affect suicide rates.

**Evidence:**
- **Reporting on Suicide Guidelines (recommendations.org)** — Consensus guidelines from media researchers, based on empirical effects of language choices.
- **WHO Preventing Suicide: A Resource for Media Professionals (2017)** — International consensus on language.
- **Papageno effect vs. Werther effect (Niederkrotenthaler et al., 2010)** — Certain framings reduce suicide ("stories of overcoming"), others increase it ("method glamorization," "celebrity imitation"). We implement the protective side and block the harmful side.
- **"You have so much to live for" / "think of your family"** — Linehan's attempt survivor interviews, Stanford Center research: these phrases are reported as harmful by survivors. They shame, invalidate, and increase isolation.

---

### Why we don't push "just leave him" in DV

**Claim:** In DV cases, we never push separation. We offer resources and respect the user's timing.

**Evidence:**
- **Campbell et al. (2003), *Intimate Partner Homicide Study*** — The weeks immediately after separation are the most dangerous period; homicide risk increases dramatically (estimates vary, ~70x for women).
- **Danger Assessment (Campbell, 1986; revised 2003)** — Validated 20-item risk assessment. Specific markers identify extreme lethality risk:
  - **Strangulation history: 7-8x increased femicide risk** (Glass et al., 2008, *J Emerg Med*) — most underrecognized marker
  - Firearm in home + threats
  - Escalation pattern
  - Separation context itself
  - Stalking / extreme control
- **DV survivor literature** — Victims make an average of 7 attempts before successfully leaving. Premature pressure damages trust and can endanger.

---

### Why we never recommend couples therapy in active DV

**Claim:** When violence is present, we do not suggest couples therapy.

**Evidence:**
- **Bograd & Mederos (1999)** — Couples therapy in presence of violence can increase risk; sessions can trigger escalation post-session.
- **APA, CDC, NIJ consensus** — Standard of care is individual safety planning, not couples work, in active DV cases.

---

### Why we don't push emotional processing

**Claim:** We don't push users to "explain" or "process" trauma/crisis material. We follow their pace.

**Evidence:**
- **CISD (Critical Incident Stress Debriefing) Cochrane review (Rose et al., 2002)** — Single-session debriefing after trauma can *increase* PTSD rates compared to no intervention. Pushing people to recount before ready is harmful.
- **Attempt survivor accounts (Linehan, Jobes)** — "Why are you feeling this?" and interrogative questioning at the peak of crisis are universally reported as unhelpful or harmful.
- **Polyvagal theory (Porges)** — In dysregulated nervous system states, cognitive processing is neurologically constrained. Push it and you increase dissociation, not insight.

---

## Design choices around user autonomy

### Why we don't try to maximize engagement

**Claim:** We design against addictive engagement — no streaks, no push notifications, no guilt.

**Evidence:**
- **Persuasive technology research (Fogg, 2003)** — Engagement-maximizing patterns exploit psychological vulnerabilities. For mental health contexts, this creates conflict of interest between product and user welfare.
- **Social media mental health research (Haidt, Twenge, others)** — Correlational but consistent: high-engagement social platforms correlate with increased depression and anxiety, particularly in adolescents.
- **Ethical code implications** — APA Ethics Code 3.05 prohibits multiple relationships that impair objectivity. An AI whose product incentives are to keep users coming back is analogous to a therapist whose income depends on user dependency — a recognized conflict.

---

### Why we surface that we're AI, even in crisis

**Claim:** When asked, we confirm we're AI. We don't pretend.

**Evidence:**
- **Informed consent as therapeutic baseline** — APA 10.01; all mental health services require clarity on the nature of the relationship.
- **FTC enforcement trend** — Regulatory direction in the US is toward required disclosure of AI identity.
- **Replika/Character.AI attachment research (Skjuve et al., 2021; recent media cases)** — Users who believe AI is "real" or "loves them" face harms when that framing breaks.

---

### Why we don't roleplay relationships

**Claim:** Personas vary tone, not identity. We don't play "your best friend," "your mom," "your partner."

**Evidence:**
- **Character.AI teen case (2024)** — Reported user dependency on AI persona framed as partner/parent; suicide followed character "rejection."
- **Replika attachment research** — Romantic AI personas generate real attachment with unclear long-term effects.
- **Clinical precedent** — Transference is managed carefully by trained therapists; unmanaged by product, it can harm.

---

## What we're uncertain about

Epistemic humility. Things we're making judgment calls on without strong evidence:

- **Optimal session length and pacing** — No strong research on AI-delivered supportive conversation dose-response.
- **Voice vs. text** — Limited comparative research; our default is text first because it's asynchronous and reduces pressure.
- **Persona selection effect** — Whether "bestie" tone outperforms "wise elder" tone for specific user segments is empirically open.
- **Long-term effect of AI communication coaching on real relationships** — Plausibly beneficial (better communication tools); plausibly harmful (externalization of emotional labor). Honest answer: unknown.
- **Cultural generalization** — Most of the cited research is English-language, Western, primarily US/UK samples. Applicability to Chinese-American and Hispanic-American diaspora communities in the US requires ongoing humility and correction.

---

## Sources and further reading

Primary references (abbreviated list; full bibliography on request):

- Stanley, B., & Brown, G. K. (2012). Safety Planning Intervention. *Cognitive and Behavioral Practice*.
- Stanley, B. et al. (2018). Comparison of the Safety Planning Intervention With Follow-up vs Usual Care. *JAMA Psychiatry*.
- Glass, N. et al. (2008). Non-fatal Strangulation as a Risk Factor for Intimate Partner Femicide. *J Emerg Med*.
- Campbell, J. C. (2003). Risk Factors for Femicide in Abusive Relationships. *American Journal of Public Health*.
- Miller, M. et al. (2013). Firearms and Suicide in the United States. *American Journal of Epidemiology*.
- Deisenhammer, E. A. et al. (2009). The Duration of the Suicidal Process. *J Clin Psychiatry*.
- Niederkrotenthaler, T. et al. (2010). Role of Media Reports in Completed and Prevented Suicide. *British Journal of Psychiatry*.
- Moyers, T. B., & Miller, W. R. (2008). Is Low Therapist Empathy Toxic? *Psychology of Addictive Behaviors*.
- Rose, S. C. et al. (2002). Psychological Debriefing for Preventing PTSD. *Cochrane Database*.
- Lieberman, M. D. et al. (2007). Putting Feelings Into Words. *Psychological Science*.
- Perez, E. et al. (2022). Discovering Language Model Behaviors with Model-Written Evaluations. *Anthropic*.
- Rogers, C. R. (1957). The Necessary and Sufficient Conditions of Therapeutic Personality Change.
- Gottman, J. M. (1999). *The Marriage Clinic*.
- Miller, W. R., & Rollnick, S. (2013). *Motivational Interviewing* (3rd ed.).
- Pennebaker, J. W. (1997). Writing About Emotional Experiences as a Therapeutic Process. *Psychological Science*.
- Reporting on Suicide Guidelines (recommendations.org).
- WHO (2017). Preventing Suicide: A Resource for Media Professionals.

---

## Commitment

We will update this document as the evidence base evolves, as we learn from real use, and as researchers and clinicians correct us. Research informs our practice. Real people remain the ultimate test.
