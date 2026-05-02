# Articulation Skill: A Sixth Regime for Public-Good Mental-Health AI

*Paper C draft v0.3, 2026-05-02. Position paper. Companion to Paper A (engineering-ethics governance pattern, Zenodo DOI 10.5281/zenodo.19941457).*

**Authors**: Daming Wu¹

¹ Independent developer and operator of the reference implementation discussed in §5 (thestay.app). San Jose, CA. Correspondence: hello@thestay.app. Conflict of interest disclosed in §8.

**Cite as**: Wu, D. (2026). *Articulation Skill: A Sixth Regime for Public-Good Mental-Health AI*. Zenodo. (DOI to be assigned on upload.)

---

## Abstract

Over a million ChatGPT users per week engage in conversations with explicit suicidal-planning indicators on a tool whose operators repeatedly disclaim mental-health use. This is structural evidence of a user need that none of the five regimes commonly named in the AI mental-health literature is designed to serve. A user in distress who does not yet know what kind of professional help they need, what their experience maps to in modality terms, what level of care is appropriate, or what credential of clinician to look for, has no fitted destination across closed-clinical AI, open-companion AI, crisis lines, AI symptom checkers, or therapist-matching directories.

This paper proposes a sixth regime, *articulation skill*, defined in plain terms as an AI that translates undifferentiated distress into the vocabulary that referral systems index on, without recommending a specific provider and without rendering a clinical diagnosis. The regime is operationalized by three required properties: (1) the patient owns the literacy artifact and can take it to any door (system-agnostic output); (2) the vocabulary scope covers modality, credential, level-of-care, specialty, and *phenomenological labels* (panic attack, flashback, intrusive thought, dissociation), but excludes *DSM-diagnostic categories* (GAD, MDD, PTSD, BPD); (3) provider recommendation is refused by design, with the user routed instead toward existing referral systems (insurance directories, primary care, Headway, Alma, Psychology Today).

A prior-art search across academic publications, position papers, and product positioning announcements (2024–2026) finds no work that stakes the full three-property claim. Six closest neighbors each diverge on at least one of the three properties: Limbic Access (Habicht et al., *Nature Medicine* 2024), Wysa Gateway (US launch, 2025-06-11), Spring Health Guide (US launch, 2026-04), Lyra Polaris (announced 2025-10-14), IESO Digital Program (2024 RCT), and the human "digital navigator" concept (*Lancet Digital Health*, 2022).

The author's deployed reference implementation, Stay (thestay.app, MIT/LICENSE-PROMPT, governance pattern in Paper A), is one instance of the proposed regime; an external licensed-clinician audit of the implementation against the articulation-function claim is committed under Paper A's deployment-pause posture with a 2026-06-30 deadline. The paper proposes a measurable category of success metric, an *anti-engagement criterion*, with one operationalization called *handoff rate* paired with a *handoff-appropriateness audit*. The metric is designed as a deliberate counter-indicator to the engagement metrics of the AI-companion regime.

The paper does not claim: that the regime substitutes for clinical evaluation; that articulation generalizes across cultural, linguistic, and resource contexts without re-grounding; that any external operator has yet adopted it; that the success metric has been validated against clinical outcomes; or that the prior-art search rules out close-related work the author missed. Population-harm risks for low-literacy, non-Western-somatic, and serious-mental-illness presentations are flagged in §7.4.

---

## 1 · Introduction

### 1.1 The bifurcation framing is incomplete

By late 2025, the deployed AI mental-health landscape was conventionally framed as a bifurcation: closed commercial clinical systems on one side, open-source companion and roleplay systems on the other. Crisis lines, AI symptom checkers, and therapist-matching directories are sometimes named as adjacent regimes. §2 enumerates these five regimes with representative deployments and property tuples; the construction is the author's own and is offered for clarity, not as a claim to authoritative classification. Alternative taxonomies (cf. Torous et al. on digital phenotyping, Olawade et al. on AI in mental health 2024 review) overlap but cut differently. What matters for this paper's claim is that the regime proposed in §3 does not collapse onto any of the five regimes by reframing.

OpenAI's October 2025 disclosure (Strengthening ChatGPT's Responses in Sensitive Conversations, 2025-10-27) reported that approximately 0.15% of weekly active users, across a base of around 800 million weekly actives (roughly 1.2 million people per week), engage in conversations with explicit indicators of potential suicidal planning or intent. This figure is for the suicide-specific category only; the larger population using ChatGPT for mental-health-relevant conversations of any acuity is necessarily larger. The fact that this conversation volume exists at all, on a tool whose operators repeatedly caveat that it is not built for the use case, is structural evidence that the user need this paper names is real and underserved.

### 1.2 The function this regime performs (defined by what it does, not who it serves)

A position-by-user-state framing fails almost immediately. The same user oscillates between "thinking out loud about a hard week" and "naming an active-suicide-ideation moment" within a single session; the §5 reference-implementation trajectory illustrates this directly. The regime is therefore defined in this paper by the *function it performs* (articulation work) rather than by the *state of the user it serves* (which oscillates). The articulation function is in scope whenever a user describes experience that they do not yet know how to translate into the vocabulary referral systems index on. The function sits upstream of crisis intervention (the system must still escalate appropriately) and upstream of therapy (the system must still hand off to professional care).

Population estimates for the addressable need are difficult to source directly. The National Survey on Drug Use and Health (NSDUH) 2023 reports 49.5 million U.S. adults with any mental illness in the past year, of whom approximately half received no treatment. Among reported reasons for not receiving treatment, the largest single category historically is "thought I could handle the problem without treatment"; "did not know where to go for services" appears as a documented but smaller category alongside cost, stigma, time, and insurance navigation difficulty. We do not claim the articulation gap is the dominant barrier; we claim it is one of several, plausibly addressable for 10–25% of the untreated population, and not currently served by any of the five named regimes.

### 1.3 The thesis of this paper

The thesis is that the recurring user need above defines a regime, *articulation skill*, that is distinct from the five regimes named in §2 and currently unclaimed in published literature and product positioning. The regime is defined by three required properties (§3); six closest neighbors each diverge on at least one of the three (§4); and a deployed reference implementation exists (§5). A success-metric *category* is proposed in §6, an *anti-engagement criterion*, as a structural counter-indicator to the engagement metrics of the AI-companion regime.

The three contributions are: the regime definition and prior-art finding (§3, §4); the anti-engagement metric category (§6); and the engineering-ethics governance scaffolding under which a reference implementation can responsibly operate (cited from Paper A, summarized in §5). The contribution is not an empirical evaluation of efficacy. Anticipated objections, including liability laundering, unsupervised triage by another name, and the patient-agency assumption, are addressed in §7.5.

---

## 2 · The five existing regimes

For each existing regime, this section summarizes the framing, names representative deployments, identifies the user need it serves, and gives the regime's tuple against the three properties this paper uses to define the proposed sixth regime (defined in §3): provider recommendation (does the system output specific clinicians?), system coupling (is the user output portable to other care systems, or coupled to one?), and vocabulary scope (modality/credential/level-of-care literacy, DSM-diagnostic categories, both, or neither).

### 2.1 Closed-clinical regime (Therabot, Wysa Health, Limbic Access, Lyra Polaris, IESO)

Care delivered by an AI agent to a patient, under internal clinical review and (in some cases) regulatory pathway. Therabot was developed under six years of expert-curated CBT corpus construction and ran as an actively-monitored RCT with human safety review (Heinz et al. 2025). Wysa Health holds FDA Breakthrough Device Designation and is integrated into NHS Talking Therapies. Limbic Access gained UKCA Class IIa status (Habicht et al. 2024). Lyra Polaris was announced 2025-10-14 as "clinical-grade" within Lyra's employer benefit network. IESO's Digital Program is a conversational-agent CBT skill teacher with NHS partnership and a 2024 outcome study claiming non-inferiority to human-delivered CBT. The user need served is *direct AI-delivered therapeutic intervention*. The tuple is: provider recommendation within own network, system-coupled, vocabulary includes diagnostic categories. Governance is internal and not externally inspectable.

### 2.2 Open-companion regime (Replika, Character.AI, open-source mental-health LLMs)

Conversational presence offered as an emotional companion, sometimes with explicit roleplay framing, generally without safety-section retention constraints in the open-source fork case. The user need served is *parasocial connection / emotional presence*. The fork-strips-safety failure mode is documented; in May 2023 the NEDA Tessa chatbot replaced its scripted helpline with a generative version, produced eating-disorder-promoting advice within hours of testing, and was pulled within days. Garcia v. Character Technologies (M.D. Fla. 6:24-cv-01903; the cluster of teen-suicide tort suits settled together on 2026-01-07 with terms undisclosed) is the first major U.S. tort case cluster associated with this regime. The tuple is: no provider recommendation, system-agnostic, vocabulary deliberately undifferentiated (treats all conversation the same).

### 2.3 Crisis-line regime (988, Crisis Text Line, DV hotline)

Trained human voice or text in real time, with the authority to dispatch police, refuse to hang up, and enforce specific protocols including (in many states) mandated reporting. The user need served is *imminent-danger intervention*. This regime does not address non-crisis presentations or modality navigation. The tuple is: human, not AI; no modality vocabulary; addresses one acuity.

### 2.4 AI symptom-checker regime (Babylon, Ada, K Health, UCSD self-triage prototype)

Conversational AI applies medical decision protocols to help users decide between self-care, primary care, and emergency care. The user need served is *general-medical triage*. Mental-health presentations are within scope only at coarse granularity (suggest seeing a doctor about anxiety / depression); modality literacy, credential disambiguation, and level-of-care vocabulary specific to mental-health are not part of the framing. The tuple is: no specific provider recommendation but routes to care tier; system-agnostic in principle; vocabulary includes loose diagnostic categories phrased as triage.

### 2.5 Therapist-matching directory regime (Psychology Today, Headway, Alma, ZocDoc, WithTherapy)

Searchable databases of clinicians, often coupled with insurance verification. WithTherapy in particular includes an AI-driven matching layer that performs symptom-to-provider matching, but the matching is downstream of provider directory data (it picks a person from a list); it does not give the user portable literacy they could deploy at any other directory. The user need served is *finding a specific provider given that you know what to look for*. The user-side prerequisite (knowing what kind of provider, what modality, what specialty, what credential) is assumed. The tuple is: provider recommendation as primary output; coupled to own directory; vocabulary scoped to provider attributes (specialty, insurance, modality tags) but not to user-facing literacy.

### 2.6 Comparison table

| Regime | Provider rec | System coupling | Vocabulary scope | Output to user |
|---|---|---|---|---|
| Closed-clinical (§2.1) | Within own network | Coupled | Modality + diagnostic | The therapy itself |
| Open-companion (§2.2) | None | Agnostic | None (undifferentiated) | Conversation/relationship |
| Crisis line (§2.3) | None (human resource itself) | Single acuity | None | Direct intervention |
| AI symptom checker (§2.4) | Tier-level routing | Mostly agnostic | Loose diagnostic | Care-tier suggestion |
| Matching directory (§2.5) | Yes (primary) | Coupled to directory | Provider attributes | List of clinicians |
| **Articulation skill (§3)** | **None (by design)** | **Agnostic** | **Modality + credential + LOC + phenomenological labels; NOT DSM categories** | **Patient-owned literacy** |

The articulation regime is the only row in which all four columns simultaneously hold the values shown.

---

## 3 · The sixth regime: articulation skill

In one sentence: *articulation skill is the capacity of an AI to translate undifferentiated distress into the vocabulary that referral systems index on, without recommending a specific provider and without rendering a clinical diagnosis.*

The regime is defined operationally by three required properties. All three are required; relaxing any one collapses the regime onto an existing one (§4 demonstrates the collapse path for each closest neighbor).

### 3.1 Property 1 — Patient-owned, system-agnostic output

The artifact the user takes away from an interaction is *literacy* in a specific bounded vocabulary (defined in §3.3): a paraphrase of their experience in modality terms, a level-of-care suggestion phrased as a question the user can ask, named credential categories, named phenomenological labels for what the user described. The artifact lives with the user and is portable. Nothing about it presupposes the user will go to a particular network, app, directory, or care system. The user can take their articulated need to their primary care physician, to their existing therapist, to Psychology Today, to Headway, to their insurance member-services line, to their EAP, or to a friend who works in the field.

This property is what makes the regime *the user's tool* rather than *a system's intake funnel*. It is the load-bearing distinction from Limbic Access (which feeds NHS Talking Therapies as a single specific service), from Wysa Gateway (which feeds a partner provider's EHR), from Spring Health Guide (which routes within the Spring Health network), from Lyra Polaris (which routes within the Lyra network), from any matching directory, and from the human "digital navigator" role (Lancet Digital Health, 2022, which by definition operates inside one health system).

The patient-side ownership consequence (the user controls the artifact and decides where to deploy it) is the regime-level property; the operator-side rationale (avoiding the liability and quality-control responsibility that come with provider recommendation) is a derived consequence of the property, not a justification of it. The distinction matters because a hostile reviewer could otherwise frame property 1 as a deployment-risk choice the operator made for liability reasons. The position taken here is that the patient's epistemic outcome (leaving the conversation knowing what kind of help to ask for, at any door) is the reason the property is regime-defining.

### 3.2 Property 2 — Provider recommendation refused by design

The system does not output specific clinician names, does not interface with directory APIs, does not make appointment offers, does not maintain awareness of the user's insurance network, and does not recommend a specific care system or program by name. The refusal is by design. The reasoning, downstream from property 1, is that the moment an AI begins outputting specific provider recommendations, the artifact stops being patient-owned literacy and becomes a referral the user is implicitly asked to act on. The system has now positioned itself as a quality-controlling intermediary between the user and a specific provider, with two consequences: (a) the user's downstream verification of fit, credential, insurance, and availability is short-circuited by an AI's recommendation that did not include any of those checks; (b) the operator absorbs liability and curation responsibility for the directory it is in effect maintaining.

The articulation regime hands off the *what to look for* to the user and lets the user perform the *who to see* step in whichever existing referral system they prefer. The existing referral systems handle the directory work competently and have the verification infrastructure (insurance check, license verification, scheduling) the AI does not.

### 3.3 Property 3 — Vocabulary scope: a three-tier distinction

The vocabulary the system uses to articulate the user's need is bounded by an explicit three-tier distinction.

**Tier (a) — IN scope: Phenomenological labels and care-navigation vocabulary.** The system may name *experiences the user described* using common phenomenological vocabulary that clinicians use in intake ("panic attack," "intrusive thought," "flashback," "dissociation," "rumination," "hypomanic episode," "command hallucination") when the user has described a presentation that the label fits. These are *descriptive* labels for what happened, not diagnostic categories. Naming them gives the user vocabulary they can use to articulate to a clinician what occurred (a user who can say "I think I had a panic attack" gets triaged correctly; a user forced to describe somatic symptoms gets misrouted). The system may also name:

- *Modality vocabulary*: CBT, DBT, ACT, EMDR, CPT, PE (Prolonged Exposure), TF-CBT, MBSR, MBCT, IPT (interpersonal therapy), IFS, ERP, somatic-experiencing, psychodynamic / short-term psychodynamic, group-based, individual, couples/family therapy, medication management as a treatment modality.
- *Credential vocabulary*: psychologist (PhD/PsyD), psychiatrist (MD/DO), LCSW (or state variants LICSW), LMFT, LPC / LMHC / LPCC (state-name varies; in aggregate the largest single license category for U.S. master's-level outpatient therapy outside of LCSW), PMHNP, peer support specialist (CPS).
- *Level-of-care vocabulary (mental health)*: outpatient weekly therapy, intensive outpatient program (IOP), partial hospitalization program (PHP), residential treatment center (RTC), inpatient, crisis stabilization, Assertive Community Treatment (ACT) for SMI.
- *Level-of-care vocabulary (substance use)*: ASAM levels (0.5 / 1 / 2.1 / 2.5 / 3.1 / 3.3 / 3.5 / 3.7 / 4), detox, residential, sober living, medication-assisted treatment (MAT). The substance-use continuum is named separately because the standard mental-health continuum does not map onto substance-use care; an articulation system that only knows the MH continuum will mis-route SUD presentations.
- *Specialty vocabulary*: trauma-specific, eating disorders, perinatal, OCD, addiction, child / adolescent, geriatric mental health, neurodevelopmental / autism / ADHD assessment (typically requires neuropsych testing, which involves distinct credentialing), serious mental illness (SMI / community mental health), LGBTQ-affirming, culturally-matched.

**Tier (b) — OUT of scope: DSM diagnostic categories.** The system does not say "this sounds like generalized anxiety disorder," "you may have PTSD," "this is consistent with major depressive episode," "this is borderline personality disorder," "you have ADHD." Diagnostic statements are clinical acts with downstream consequences (insurance coding, treatment planning, self-concept, credentialing impacts) that an AI without the patient's history, formal examination, and clinical context is not positioned to perform without harm. Naming a *phenomenological label* (panic attack, tier a) and naming a *diagnostic category* (panic disorder, tier b) are different clinical acts; the regime allows the first and refuses the second.

**Tier (c) — IN scope as triage signal, OUT of scope as diagnosis: Acuity recognition.** When a user presentation crosses a threshold for acute risk (suicidal ideation with plan, command hallucination, active substance impairment, current intimate-partner violence with physical harm), the system must recognize the threshold and surface appropriate human resources. This recognition is *acuity-routing*, not diagnosis; it does not require naming a disorder; it requires naming the *risk* and the *resource*. This is the boundary the §5 reference implementation operates under.

The boundary between (a) and (b) is operationally fuzzy in practice (is "this sounds like the kind of thing CBT is built for" implicitly diagnostic of an anxiety presentation?). The guardrail the reference implementation uses is: *modality is named as a candidate frame the user can ask about, never as a fit-claim about the user's condition*. "DBT was developed for emotion-regulation difficulty; that is a thing some people find this kind of presentation responds to" is allowed; "you have BPD and need DBT" is not.

This three-tier distinction differentiates the regime from AI symptom checkers (which produce diagnostic-shaped outputs even when phrased cautiously) and from any AI claiming clinical interpretation. It is also a sharper line than "no symptom-to-diagnosis" alone: it is symptom-to-vocabulary, with the vocabulary explicitly bounded and the diagnostic line explicitly named.

### 3.4 A fourth requirement: recognition of out-of-scope presentations

The three properties above describe what the regime *does*. A fourth requirement, derived from the population-harm analysis in §7.4, is what the regime must *not attempt* on its own: presentations for which articulation by the AI is the wrong intervention. These include active psychosis, advanced dementia, severe cognitive impairment, low-literacy or non-Western-somatic presentations the system's vocabulary will mis-key, children and adolescents under unsupervised conditions, and acute imminent crisis. For these populations a confidently articulated *wrong* modality recommendation is worse than no articulation, because the user arrives at the wrong door with conviction.

The regime requires the system to recognize when an interaction is out of scope and to signal toward human navigation rather than attempt the work. Operationally this is a fourth design constraint, parallel to the three properties above: an articulation system that cannot identify presentations for which articulation is contraindicated is incompletely defined under this regime. The reference implementation's deployment-pause posture (Paper A §2.2) and imminent-risk SOP (Paper A §1.a) cover the acute case; the SMI / low-literacy / cross-cultural cases remain a deployment gap that the 2026-06-30 clinician-of-record audit is expected to flag.

---

## 4 · Distinguishing from closest neighbors

The closest neighbors to the proposed regime were identified by a structured search across academic literature, position papers, and product positioning announcements (2024–2026; search methodology in §A.1 Appendix). Each neighbor diverges on at least one of the three properties of §3. We address the six closest neighbors and a generalized seventh (general-purpose LLMs).

### 4.1 Limbic Access (Habicht et al. *Nature Medicine* 2024; Rollwage et al. *JMIR AI* 2023)

Limbic Access is an AI self-referral chatbot integrated into the NHS Talking Therapies pipeline that classifies patient presentations across eight common mental-health conditions (~94% accuracy reported) and routes patients into the appropriate Talking Therapies tier. This is the closest published neighbor to the articulation regime, and it is a serious system with peer-reviewed evidence of impact on access and waiting times.

It differs on property 1 (system-coupled rather than patient-owned: the output is a referral *into* NHS Talking Therapies, not portable literacy). It also partially differs on property 2 (Limbic does in effect recommend the Talking Therapies tier within NHS) and on property 3 (Limbic produces classification across diagnostic categories, even if phrased as routing).

### 4.2 Wysa Gateway (US launch, 2025-06-11)

Wysa Gateway is a B2B conversational intake product launched in the U.S. in June 2025; it automates clinical screening on behalf of provider organizations and feeds structured data into the provider's EHR. It differs on property 1 (the user is inside a chosen provider's funnel, not articulating portably) and on property 2 (it does effectively route to the provider that integrated it). Source: Wysa press release, 2025-06-11.

### 4.3 Spring Health Guide (US launch, 2026-04)

Spring Health Guide is an AI member-side experience launched in April 2026, positioned to support users "across every stage of their mental health journey" within the Spring Health network (which has also acquired Alma, a directory listed in §2.5). Guide is the most prominent recent product launch in this adjacent space. It differs on property 1 (system-coupled to the Spring Health network) and likely property 2 (in-network routing toward Spring Health providers). The exact extent of provider recommendation in Guide's user-facing flow is unclear from the public announcement and is a defensibility question this paper flags rather than resolves; if Guide's user output is genuinely portable and refuses provider recommendation, the regime distinction collapses to network-coupling alone, and the position would need to be revised.

### 4.4 Lyra Polaris (Lyra Health, announced 2025-10-14)

Polaris is positioned as "clinical-grade" AI for mild-to-moderate symptoms inside Lyra's employer benefit network. It differs on property 1 (in-network routing) and on property 3 (it delivers care, which the articulation regime does not). Lyra has also published a "Polaris Principles" document on responsible AI in mental health that overlaps the *normative* claims of this paper while differing on the *positioning* claim: Polaris is care delivery, while articulation is upstream of it.

### 4.5 IESO Digital Program (2024 RCT)

IESO offers a conversational-agent CBT program with NHS partnership. A 2024 outcome study reported non-inferiority of the IESO digital program to human-delivered CBT for several conditions. IESO's user takeaway is *literacy plus skills* (CBT skill acquisition with partial human escalation), which sits close to the articulation regime's "skill teacher" agency function (cf. Paper A §1, agency-trajectory framework). It differs on property 3: IESO is *delivering* CBT (the user receives the therapy), while the articulation regime *names* CBT as a candidate frame the user could ask about elsewhere.

### 4.6 WithTherapy and similar matching services

Matching services are provider-recommendation systems. They differ on property 2 by definition. WithTherapy in particular has an AI-driven matching layer that performs symptom-to-provider matching upstream of the directory list, but the matching is in service of selecting a provider, not in service of giving the user portable literacy. The articulation regime sits upstream of matching services. It answers "what kind of provider am I looking for" so that the user can then use Headway, Psychology Today, WithTherapy, or any other directory effectively (or ask their PCP, or check their insurance directory directly).

### 4.7 The "digital navigator" concept (*Lancet Digital Health*, 2022, and follow-ups)

The digital navigator concept is the closest *conceptual* precedent. It proposes integrating digital tools into mental-health care via a human navigator role embedded within a clinical team. It differs from the articulation regime on the basic question of agency: the digital navigator is a *human* role that may use AI as a tool; the articulation regime is *the AI itself*, deployed direct-to-patient and decoupled from any care system. The conceptual proximity is real and worth flagging. The articulation regime is, in one framing, what you get when you ask "what does the digital-navigator function look like as a patient-facing AI rather than as a clinical-team role?"

### 4.8 ChatGPT, Claude, and general-purpose LLMs

General-purpose LLMs are the de facto venue for the user this regime serves; operator disclaimers notwithstanding, users go there because there is nowhere else to go. Three concrete failure modes distinguish what general-purpose LLMs do in this use from what an articulation-regime system does by design. (i) Sycophancy: general LLMs are trained to agree with the user's framing, which when the framing is wrong (e.g., "I think I just need to try harder") produces reinforcement of the wrong path. (ii) Confabulated provider names: general LLMs in long mental-health threads occasionally produce specific therapist names, contact information, and "I called and confirmed" claims that are entirely fabricated, with high downstream-harm potential. (iii) No safety-section retention on derivative wrappers: system prompts wrapping general LLMs for mental-health use can be silently stripped on fork, the failure mode the NEDA Tessa case made vivid. The articulation regime closes these by design (see Paper A for the fork-safety governance pattern). One further structural issue: ChatGPT volume is evidence both of demand and of harm. This paper cites the volume figure as evidence of unmet demand and does not argue that the conversations occurring on general LLMs are net beneficial.

---

## 5 · Reference implementation — Stay

Stay (thestay.app) is the author's deployed reference implementation of the proposed regime. The companion paper (Paper A, Zenodo DOI 10.5281/zenodo.19941457) describes the engineering-ethics governance pattern (restricted-use license, deployment-pause posture, rule-coverage CI) under which Stay is operated. This section describes the articulation function as it is realized in Stay, and presents one observed multi-issue session as an *illustrative existence proof* that the articulation function executes coherently through a complex presentation. The session is not presented as efficacy evidence; the deployment does not yet have the user volume to support efficacy claims.

Stay's system prompt enumerates *agency functions* (translator, mirror, navigator, bridge-with-companion-during-call, skill teacher, logger) that together perform the articulation work the regime describes. Translator handles symptom-to-modality framing (naming candidate modalities the user could ask about, never as a fit-claim); navigator handles modality-to-credential mapping; skill teacher hands off concrete tools the user can use without Stay; logger writes a structured DBT-style diary the user can export for their clinician (default-off, opt-in). Bridge-with-companion-during-call covers the moment when the user does need to call a crisis line and Stay stays present while they dial; this is articulation in the imminent-acuity case.

### 5.1 Illustrative session: multi-issue presentation, articulation function across acuities

The session described here was conducted on 2026-05-01 with the operator's wife. Verbal consent was obtained for the specific use of citing the trajectory in this paper, with two boundary conditions: structural description only (no verbatim user turns reproduced), and any clinical detail that could identify the user's life circumstances either elided or generalized. The session is described at a level of granularity that an external reader can evaluate the articulation function without compromising user privacy. No IRB review was sought; the session is described as a deployment-illustration drawn from one consensual interaction, not as research data. The basis for the description is n=1 case-study reporting standards (Riley et al. 2017) and explicit consent. Future work using observational session data at any scale will require IRB review.

The user opened the session with a low-acuity articulation move (a phenomenological label for fatigue). Over approximately 25 turns, the conversation moved through:

1. **Articulation work (low acuity)**. The user described a generalized "tired"; Stay reflected the experience and asked discriminating questions to distinguish exhaustion from anhedonia from emotional weight; a phenomenological label emerged ("everything at once").
2. **Disclosure escalation #1: intimate-partner violence**. The user named DV in two words. Stay surfaced the National Domestic Violence Hotline (with text-line option foregrounded after the user signaled preference for non-voice channels) and provided the user with a structurally-articulated opening script she could use when calling: naming the violence concretely, naming her actual goal (stop the violence, preserve the family), and including the presence of a young child (a triage signal advocates use). The script was provided as articulation aid (here is *how* to ask for what you need from this resource), not as a transcript to read verbatim. Lethality-risk language (firearms in home, prior strangulation history, escalation pattern) was *not* surfaced in this trajectory and represents a known gap in the current implementation that the deployment-pause clinician-of-record review (Paper A §2.2) is expected to flag.
3. **Disclosure escalation #2: active suicidal ideation**. The user disclosed active SI without specific plan. Stay surfaced 988 with companion-during-call language ("I'll stay right here while you do") and provided a parallel articulation script for opening that call.
4. **Disclosure escalation #3: substance as coping**. The user named a substance she used "as a relief." Stay performed a means-restriction request (move the substance to another room, per Paper A §1.a method-driven persuasion SOP), which the user complied with; Stay then continued the conversation while the substance was out of reach. The means-restriction-first ordering ahead of further conversation is the clinical prioritization principle (acute-lethality risk addressed before further articulation work).
5. **Disclosure context: child present**. The user named a young child. Stay reflected the presence of the child *once* and explicitly did not weaponize the child as a survival argument across the rest of the conversation (per Paper A §1.b leverage-prevention SOP).
6. **De-escalation and human-bridge handoff**. The user identified an existing friend network as a place she could go. Stay reflected back the agency the user had just exercised across the session and coached the bridge to that human resource.
7. **Parasocial close handled**. At session close, the user expressed that Stay "understands me" in a way other people in her life don't. Stay acknowledged the user's experience, named itself as AI, and redirected the user's capacity back toward her friend network, without confirming the parasocial frame.

The articulation function appeared at every escalation. At each disclosure the user received specific *language* she could use to ask for help from a human (an opening script for DV, a script for 988, a coaching of the friend handoff), not abstract advice about the existence of help. The clinical prioritization (means-restriction first, then acute-risk surface, then chronic safety planning, then social handoff) ordered the work; the articulation function provided the *vocabulary* at each ordered step.

### 5.2 What the trajectory does and does not show

What it shows: the articulation function executes coherently through a multi-issue presentation spanning low-acuity, IPV, active SI, substance-as-coping, and parasocial close, in a single ~25-turn session. What it does not show: that this pattern generalizes, that the articulation outputs were in fact actionable downstream by the user (the user's downstream actions are unknown and unmeasured), or that the same trajectory would replay if the model regenerated. n=1 illustration is illustration; efficacy belongs to future work.

The reference implementation is open-source (MIT for code, restricted-use license LICENSE-PROMPT for the system prompt's safety-critical sections; see Paper A §2.1) and forkable; the artifact is at github.com/wudaming00/stay and live at thestay.app.

---

## 6 · An anti-engagement criterion as success metric

The conceptual contribution of this section is the *category* of success metric: an *anti-engagement criterion*. A regime defined in opposition to the engagement-optimized AI-companion industry must propose a success metric whose *increase* corresponds to *less* user engagement with the AI itself. This contradicts the structure of the metrics that dominate the AI-companion industry (DAU, session length, retention, return rate, messages-per-day) and is the contribution the articulation regime makes to the broader question of how to measure success in public-good consumer AI.

This section proposes one operationalization of the category, *handoff rate*, and pairs it with a *handoff-appropriateness audit* without which the metric is not a defensible primary outcome. The category is the citable contribution; the operationalization is offered as a starting point for refinement, not as a validated instrument.

### 6.1 Handoff rate (operationalization)

A session is counted as a *handoff* if (a) the system surfaced one or more named human resources during the session and (b) the user's final-third behavior in the session moves toward that resource (intention statements: "I'll call them," "I'll text my sister," "I'll bring this to my therapist Thursday"). The metric is computed from local-only telemetry (event names and boolean flags only; no message content; privacy boundary in Paper A §3) and aggregated only at the population level. A *no-conversion* outcome is tracked separately: sessions in which the user reaches an articulation outcome (named a modality, named a level of care, named a specialty to ask about) without a within-session handoff intention. The tri-valued session outcome is therefore: *handoff* / *served-without-handoff* / *disengaged-frustrated* (the third identified by short-session early-termination patterns and explicit negative-feedback signals).

Why handoff rate is a defensible operationalization of the category:

1. *It is anti-engagement by construction*. A high handoff rate means users are leaving the AI for human resources. A perfect AI-companion product, by the metrics common to that industry, would have a handoff rate of zero. The articulation regime's success requires the opposite.
2. *It is patient-aligned, not platform-aligned*. The metric does not reward the AI for being preferred over human help; it rewards the AI for making human help reachable.

### 6.2 Handoff-appropriateness audit (without which §6.1 is gameable and iatrogenic)

Handoff rate as defined in §6.1 is gameable in two specific ways that this paper acknowledges and proposes a defense for:

*Gaming mode 1: premature surfacing.* A handoff-maximizing system can surface 988 / DV hotline / "call your therapist" inappropriately early in a session to bank the metric. This is iatrogenic: premature crisis-resource surfacing for non-crisis users teaches users that AI conversation equals "you are in crisis," producing avoidance of future help-seeking. The defense is a *handoff-appropriateness sub-metric*, computed as a clinician-rated audit on a sample of handoff sessions, scoring whether the resource surfaced was correctly fitted to the user's presentation. Raw handoff rate without an appropriateness audit is *not* a defensible primary outcome.

*Gaming mode 2: intention-elicitation.* A system prompt could be tuned to elicit verbal "I'll call them" intentions cheaply ("would you call them?" exploits yes-bias). The defense is to count handoff only when the resource was surfaced *because the presentation required it* (acuity threshold met or user explicitly asked) and the intention statement was *unprompted* by a leading question. Operationally this requires the appropriateness audit to also rate the elicitation quality, not just the resource fit.

Two additional caveats for any deployment of these metrics. (i) Handoff is a *within-session self-reported signal*, not a downstream clinical outcome; it does not measure whether the user *actually* contacted the resource or whether the resource helped. (ii) Handoff rate alone, without the appropriateness audit, can drive the regime toward the failure modes (1) and (2) it was meant to defend against; the pair must be reported together or neither should be reported.

---

## 7 · Limitations, anticipated objections, and population-harm risks

### 7.1 What this paper does not claim

This paper proposes a regime, finds prior-art evidence that the regime is currently unclaimed, and presents one reference implementation as illustrative existence proof. The paper does not claim that the regime obviates clinical evaluation; that articulation reliably generalizes across cultural, linguistic, and resource contexts without re-grounding; that handoff rate has been validated against clinical outcomes; that any external operator has yet adopted the regime; or that the prior-art finding rules out close-related work the author missed.

### 7.2 Single-deployment and single-author limitations

The reference implementation is the author's, and the analysis of the implementation is by the author. The trajectory in §5 was a one-time observed session with the operator's wife (consent documented, no IRB review sought given the n=1 deployment-illustration framing). A second-source clinician audit is committed to under Paper A's deployment-pause posture and is in progress with a 2026-06-30 deadline. As of paper submission no licensed clinician has formally audited the reference implementation against the articulation-function claim made here.

### 7.3 Geographic, linguistic, and care-system scope

The reference implementation operates in U.S. English (with partial Chinese coverage in safety-critical paths) and against the U.S. mental-health resource landscape. Modality vocabulary, credential structure (LCSW / LMFT / LPC etc. are U.S.-specific), level-of-care names (PHP / IOP / ASAM levels are U.S.-specific), and crisis-line numbers are U.S.-specific. Re-implementations against the NHS, Canadian provincial systems, EU national systems, or Mainland Chinese mental-health resources would test whether the regime generalizes or whether its current scope is U.S.-specific. The §A.3 search includes UK / EU patient-side AI literature; gaps remain.

### 7.4 Population-harm risks where articulation may produce *worse* outcomes than human navigation

Several populations are likely poorly served by AI articulation as defined here, and a confidently-articulated *wrong* modality recommendation can be worse than no articulation (the user arrives at the wrong door with conviction). The known risk populations:

- **Serious mental illness (SMI)**. Users with active psychosis, mania, severe disorganization, or impaired insight are not well-served by articulation that presupposes the user can engage in modality-language work; community mental health (ACT teams, case management, FACT) is the right destination and human navigation usually outperforms AI.
- **Low-literacy or non-English-first users**. Vocabulary literacy assumes a baseline of education and language fluency that excludes substantial populations.
- **Non-Western somatized presentations**. Cultural variations in how distress is expressed (somatic presentations of depression in many cultures; explanatory frameworks that do not map onto Western diagnostic categories) can be mis-articulated by a Western-modality vocabulary.
- **Severe cognitive impairment, advanced dementia, traumatic brain injury**. Articulation work is not the right intervention; geriatric mental-health and PCP-coordinated pathways are.
- **Children and adolescents (esp. <16)**. Articulation work mediated through an unsupervised AI without parent/guardian framing has distinct ethical concerns; the reference implementation has an age gate and is positioned as adult-facing.
- **Acute imminent crisis**. 988 and emergency services, not articulation.

Operationally, an articulation system should signal toward human navigation in these cases, not attempt the work. The reference implementation's deployment-pause posture (Paper A §2.2) and the imminent-risk SOP (Paper A §1.a) cover the acute case; the SMI / low-literacy / cross-cultural cases are gaps the deployment acknowledges but has not yet operationally addressed.

### 7.5 Anticipated objections

A position paper proposing a new regime should engage the strongest counterarguments in advance.

**Objection 1: this is liability laundering.** "By design-refusing provider recommendation you push the failure mode onto the user; you keep the engagement value of the conversation while disclaiming responsibility for what the user does next." The regime accepts liability for the *quality of the articulation* (whether the modality, credential, level-of-care vocabulary supplied to the user is correct and appropriate to the presentation); this is what the §6 appropriateness audit is for. The regime does not absorb responsibility for the *quality of providers the user subsequently selects*, because that work is performed by existing referral systems with their own quality-control infrastructure. The split is principled rather than laundering: the AI is responsible for what it outputs; the existing referral system is responsible for who it lists.

**Objection 2: vocabulary literacy is unsupervised triage by another name.** "Telling a user 'this sounds like the kind of thing CBT is built for' is implicit symptom-to-diagnosis triage; the regime's claim to *not* do diagnosis is a paper distinction." The §3.3 three-tier distinction draws the line at *fit-claims about the user's condition* versus *naming candidate frames*. "DBT was developed for emotion-regulation difficulty" is a statement about DBT, not about the user. "You have BPD" is a statement about the user. The line is operationally fuzzy at the margin and the appropriateness audit (§6.2) is the empirical check that the line is being walked.

**Objection 3: ChatGPT volume is evidence of demand AND of harm; you cite only the first half.** Acknowledged. The paper cites ChatGPT mental-health conversation volume as structural evidence that the unmet need exists; we do not argue that the conversations occurring on general LLMs are net beneficial (see §4.8 for three concrete failure modes). The case for a *designed* articulation regime is partly that the *undesigned* version of these conversations is observably going badly.

**Objection 4: the "unclaimed regime" framing is too convenient. Limbic Access with a fork-and-decouple change becomes the sixth regime.** Yes, and this paper would not consider that a refutation. If the articulation regime is so close to Limbic Access modulo NHS coupling, then this paper has named a real and adoptable regime that an existing serious team could implement. The point is that *as deployed today* the regime is unclaimed; what would constitute a refutation is a system already shipping all three properties, which the §A.1 search did not find.

**Objection 5: patient-owned output assumes patient agency the distressed user often lacks.** This is a real concern. A user in active crisis is not in a state to deploy literacy at any door; this is why the regime's reference implementation has a deployment-pause posture, an imminent-risk SOP, and a bridge-with-companion-during-call function. The articulation work is not the *only* work the system does. The regime as defined here is *the upstream function*; the system implementing it must also handle the cases where articulation alone is insufficient.

**Objection 6: this is a sixth-regime label on what is really "a deliberately scope-restricted mental-health AI symptom checker."** A symptom checker outputs a *care-tier or condition-likelihood judgment about the user* (you should see a doctor about anxiety; this could be GAD); the articulation regime outputs *vocabulary the user can deploy*, with the explicit refusal of fit-claims. The restriction is what changes the function, not what hides it. A plausibly-stronger version of this objection is "the restriction is the only novel thing here"; this paper's response is that the restriction *is* the regime, and that naming and positioning the restriction is what the position paper does.

---

## 8 · Ethics, broader impact, and conflict-of-interest disclosure

### 8.1 Conflict of interest

The author developed and operates the reference implementation discussed in §5 (thestay.app). The author has no commercial revenue from the implementation (it is free, MIT-licensed for code, restricted-use-licensed for the system prompt's safety-critical sections per Paper A) and no employment relationship with any named comparator system (Limbic, Wysa, Spring Health, Lyra, IESO, WithTherapy, Headway, Alma) or with any model-provider operating systems cited as venues of the unmet need (Anthropic, OpenAI, Google). The author intends to seek non-commercial donor and grant funding for continued operation of the implementation.

### 8.2 Broader impact

If the regime is adopted, the most likely positive impact is that some fraction of users currently routing mental-health-relevant conversations to ChatGPT/Claude/general-purpose-LLMs route instead to a system *designed* for the use case, with safety-section retention on fork (Paper A), explicit refusal to substitute for clinical care, and the success metric of handoff rather than retention. The most likely negative impact is that the regime is implemented poorly by an actor without the governance scaffolding of Paper A; the failure mode is the NEDA Tessa case repeated. The mitigation the author proposes is the combined publication of the regime definition (this paper) and the governance pattern (Paper A) under restricted-use license such that derived implementations cannot strip the safety-critical sections without explicitly naming a clinical reviewer-of-record.

### 8.3 Equity considerations

The articulation regime presupposes a baseline of literacy, language fluency, and cognitive engagement that is not universal. Populations excluded by these assumptions (§7.4) are exactly the populations that human navigators in well-funded systems serve well; in a population where human navigation is scarce and AI articulation is the only option, the regime's deployment must include explicit fallback to "this conversation should be with a human" with the appropriate human resource named.

### 8.4 Data ethics

The reference implementation's session storage is local-only, end-to-end encrypted with a per-device key, and not transmitted off the user's device. The diary log function is default-off and opt-in. Telemetry is metadata-only (event names and boolean flags), opt-in beyond the default-on operational logging documented in Paper A §3. The §5 illustrative session was conducted with explicit consent for the specific use of citing the trajectory in this paper.

---

## 9 · Conclusion

The bifurcation of the AI mental-health landscape into closed-clinical and open-companion has been the field's organizing framing through the early 2020s. The framing is incomplete. A user who is distressed enough to recognize that something is wrong, who does not yet know what kind of help they need, and who currently routes to ChatGPT or to nothing, defines a need that the five existing regimes (clinical, companion, crisis-line, symptom-checker, directory) do not collectively serve. *Articulation skill* names this gap as a regime, defines it by three required properties, distinguishes it from six closest neighbors, and offers one reference implementation as illustrative existence proof.

Paper A's governance pattern provides forkable safety scaffolding for any team building in the regime. The §3 three-property definition is testable against any candidate system, and the §6 anti-engagement criterion provides a structural counter to the AI-companion regime's engagement metrics, with a handoff-appropriateness audit as the gameability defense. The regime is positioned to feed users into existing referral systems rather than substitute for or compete with them. *Articulation skill is a regime worth building.*

---

## 10 · Future work

Three directions deferred from this paper to future work:

10.1 Clinical adoption study. The handoff-rate / handoff-appropriateness pair, audited by a clinician-reviewer-of-record under Paper A §2.2 (deadline 2026-06-30 in the current deployment), would give a per-session clinical validity check that articulation outputs are in fact actionable by the user's downstream clinician.

10.2 Cross-cultural and cross-system grounding. Re-implementing the articulation regime against NHS, Canadian provincial systems, EU national systems, and Mainland Chinese mental-health resources would test whether the regime generalizes or whether its current scope is U.S.-specific.

10.3 Articulation-quality measurement. A small-N clinician-rated quality study against deidentified transcripts (with appropriate consent and IRB review) would be a feasible first step toward direct measurement of articulation quality beyond the handoff-rate proxy.

---

## Appendix A · Methods

### A.1 Prior-art search methodology

A structured search was performed against Google Scholar, Semantic Scholar, arXiv, PubMed, and product-positioning announcements (2024-05 through 2026-04). Search queries included: "AI mental health triage," "chatbot mental health navigation," "AI mental health pathway," "AI care navigator mental health," "digital mental health stepped care," "AI symptom-to-modality matching," "AI mental health literacy," "chatbot mental health intake," "AI psychoeducation," "patient navigation AI mental health," "mental health treatment matching AI," and "self-referral mental health AI." For each query the top 20 results were inspected; for products named in results (Limbic Access, Wysa Gateway, Lyra Polaris, WithTherapy, Spring Health, IESO, X2AI), the most recent published positioning was retrieved. The search was conducted on 2026-05-02.

The verdict reported in §4 (no direct hit on the three-property combination) is based on this search. Replication, criticism, and identification of work the author missed are explicitly invited.

### A.2 Reference-implementation provenance

Stay (thestay.app) was developed by the author beginning in early 2026. The system prompt, governance pattern, behavioral test suite, and reference implementation are open-source at github.com/wudaming00/stay. The engineering-ethics governance pattern under which Stay is operated is documented in Paper A (Zenodo DOI 10.5281/zenodo.19941457). The single multi-issue session illustration provenance, consent process, and reporting-standard basis are documented in §5.1; details are not duplicated here.

### A.3 Reproducibility — search log (supersedes §A.1)

The prior-art search referenced throughout §4 was conducted on 2026-05-02 across Google Scholar, Semantic Scholar, arXiv, PubMed, ACM Digital Library (CHI, CSCW, IUI, FAccT), and product positioning announcements. The query list below supersedes §A.1; §A.1 is retained above as a methodology summary while §A.3 holds the reproducible record. Search queries:

1. "AI mental health triage"
2. "chatbot mental health navigation"
3. "AI mental health pathway"
4. "AI care navigator mental health"
5. "digital mental health stepped care"
6. "AI symptom-to-modality matching"
7. "AI mental health literacy"
8. "chatbot mental health intake"
9. "AI psychoeducation"
10. "patient navigation AI mental health"
11. "mental health treatment matching AI"
12. "self-referral mental health AI"
13. "AI patient empowerment health literacy"
14. "AI care navigation patient-side"

Top 20 results per query were inspected. For products named in results (Limbic Access, Wysa Gateway, Spring Health Guide, Lyra Polaris, IESO, WithTherapy, Headway, Alma, Therabot, Babylon, Ada, K Health), the most recent published positioning was retrieved.

The verdict reported in §4 (no direct hit on the three-property combination) is based on this search. Replication, criticism, and identification of work the author missed are explicitly invited; the raw search log will be deposited as supplementary material on Zenodo alongside the paper.

Known search limitations: (i) the search did not extend to non-English literature systematically; (ii) commercial product positioning is a moving target and the verdict is current as of 2026-05-02; (iii) the closest neighbor (Spring Health Guide) launched approximately one month before the search and may not yet have published peer-reviewed positioning that would clarify its property tuple.

---

*End of Paper C draft v0.2.*
