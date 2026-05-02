# Articulation Skill: A Patient-Navigator Regime for Public-Good Mental-Health AI

**Daming Wu¹** — Independent developer, San Jose, CA. Correspondence: hello@thestay.app. Preprint v1, 2026-05-02. License: CC BY 4.0. Companion paper: *Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems* (Paper A), Zenodo DOI [10.5281/zenodo.19941457](https://doi.org/10.5281/zenodo.19941457). Code and reference implementation: https://github.com/wudaming00/stay.

¹ The author developed and operates the reference implementation Stay (thestay.app) discussed in §5.

**Conflict of interest** (front-loaded per AIES 2026 position-track norms): the author developed and operates the reference implementation discussed in §5 and has no commercial revenue from it (the code is MIT-licensed, the safety-critical prompt sections are restricted-use-licensed per Paper A, and the deployment is operated free of charge to users). No employment relationship with any named comparator system or model provider. The author intends to seek non-commercial donor and grant funding for continued operation. Full disclosure in §8.1.

**Cite as**: Wu, D. (2026). *Articulation Skill: A Patient-Navigator Regime for Public-Good Mental-Health AI*. Zenodo. (DOI assigned on upload.)

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

### 1.4 Note on terminology and intellectual lineage

We use "articulation" in a sense informed by but distinct from established usage in three literatures, and we ground the regime in adjacent canons that the v0.3 draft of this paper did not adequately engage. Reviewers from sociology of work, CSCW, and medical anthropology will read §3 and assume continuity that is not direct; the disambiguation below is necessary.

(i) *Strauss and the CSCW articulation-work tradition.* Strauss (1985, 1988, 1993) defined "articulation work" as the coordination labor of meshing tasks, task sequences, and lines of work to hold fragmented care delivery together; Schmidt and Bannon (1992) and Suchman (1996) extended the concept in CSCW as the work needed to reconcile incommensurate assumptions across distributed actors absent enforceable standards. Our "articulation skill" names a specific patient-side capability (translating undifferentiated experience into the vocabulary that referral systems index on) rather than the broader coordination labor Strauss describes. The patient-owned literacy artifact in §3.1 is plausibly a *boundary object* in the sense of Star and Bowker (1999, *Sorting Things Out*), an artifact that allows patient and downstream referral systems to coordinate without sharing one care system. The regime is the AI implementation of articulation work performed direct-to-patient, with three operational properties.

(ii) *The clinical-discourse and explanatory-model tradition.* Mishler (1984, *The Discourse of Medicine*) frames the lay/expert gap as one between voice-of-lifeworld and voice-of-medicine; Kleinman (1978, 1980) frames it as the gap between patient and clinician explanatory models of illness. Articulation skill is operationally an AI mediator across these gaps. The §7.4 cross-cultural limitation of the regime is precisely the limit of Kleinman's framework, where non-Western somatic explanatory models do not map cleanly onto Western diagnostic categories.

(iii) *The health-literacy and patient-activation tradition.* Nutbeam (2000) defined a three-tier health-literacy framework (functional / interactive / critical); the §3.3 vocabulary tiers in this paper are a parallel, mental-health-care-navigation-specific specification operating within Nutbeam's interactive-literacy band. Hibbard et al. (2004) developed the Patient Activation Measure (PAM), now adopted into CMS MIPS quality reporting (2024); the regime's claim that the patient leaves with portable literacy is operationally a Nutbeam-interactive + Hibbard-stage-2-activation claim. Elwyn et al.'s shared-decision-making framework (2012) overlaps in spirit but operates inside the clinical encounter with a clinician present, presupposing a treatment decision; articulation skill operates *upstream* of any clinical encounter, providing the vocabulary the user will use *to enter* one.

(iv) *The patient-navigator tradition in oncology and CMS reimbursement.* CMS established Principal Illness Navigation billing codes (G0023, G0024) effective 2024-01-01, formalizing the patient-navigator role for serious-illness patients (cancer first, extensible to others; Cancer Today Fall 2024; JONS December 2024). The September 2025 *Journal of Oncology Navigation & Survivorship* devoted an issue to AI patient navigators; Montefiore Einstein deployed MyEleanor, an AI virtual patient navigator achieving a 33% rescheduling rate among 2,400 nonadherent colonoscopy patients (ASCO Daily News). The articulation regime as defined here is the mental-health AI sibling of the patient-navigator function that CMS, oncology, and the Lancet Digital Health "digital navigator" concept have already named, with three additional operational constraints (no provider recommendation, system-agnostic patient-owned output, vocabulary scope deliberately bounded). Our claim is the application and operationalization in the mental-health AI context, not the discovery of articulation as a phenomenon.

With this lineage, the contribution claim sharpens: *applying articulation-work theory and the health-literacy / patient-navigator tradition to deployed patient-facing AI in mental health, under three required operational properties and an anti-engagement success-metric category.* This is a narrower, more defensible claim than "we propose a sixth regime" alone, and it pre-empts the strongest predictable reviewer objection that the paper has reinvented health-literacy or shared-decision-making without acknowledgment.

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

**Tier (a) — IN scope: Phenomenological labels and care-navigation vocabulary.** The system may name *experiences the user described* using common phenomenological vocabulary clinicians use in intake ("panic attack," "intrusive thought," "flashback," "dissociation," "rumination," "hypomanic episode," "command hallucination") when the description fits. These are *descriptive* labels for what happened, not diagnostic categories. Naming them gives the user vocabulary to articulate to a clinician what occurred. The system may also name modality (CBT, DBT, ACT, EMDR, CPT, PE, TF-CBT, IPT, ERP, IFS, MBSR, MBCT, somatic experiencing, psychodynamic, group / individual / couples-family, medication management); credential (psychologist PhD/PsyD, psychiatrist MD/DO, LCSW/LICSW, LMFT, LPC/LMHC/LPCC the largest U.S. master's-level outpatient license category outside LCSW, PMHNP, peer support specialist); level-of-care for mental health (outpatient, IOP, PHP, RTC, inpatient, crisis stabilization, ACT for SMI) and separately for substance use (ASAM levels 0.5–4, detox, residential, sober living, MAT; the SUD continuum does not map onto MH, and an articulation system knowing only MH will mis-route SUD); and specialty (trauma, eating disorders, perinatal, OCD, addiction, child/adolescent, geriatric, neurodevelopmental assessment, SMI, LGBTQ-affirming, culturally-matched). Full vocabulary inventory in supplementary material on Zenodo.

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

### 4.7a Headspace Ebb (launched October 2024; stratified-care upgrade January 2026)

Headspace Ebb is the most prominent recent neighbor and the most material defensibility risk to v0.4. Ebb launched in October 2024 as a motivational-interviewing companion within the Headspace app and was substantially upgraded in January 2026 with stratified-care features: smart triage, care plans, and provider matching across Headspace's network of 15,000+ providers. Reported scale: 7M+ messages, 4 countries (Headspace press release 2025-05-21; medcitynews 2024-10). Ebb differs on property 1 (in-app, system-coupled to the Headspace network), on property 2 (explicit personalized provider matching post-January-2026), and on property 3 (motivational-interviewing companion plus symptom evaluation, blending care delivery with navigation). The dimension on which Ebb is closest is reach: it operates at consumer scale within the closed-network stratified-care pattern.

If a future Ebb release decoupled from the Headspace network and let users export portable literacy, the regime distinction would collapse to system-coupling alone (the same collapse condition flagged for Spring Health Guide in §4.3). Given Headspace's 2025 investor positioning (consumer + employer benefit), this collapse is not on the announced product roadmap but is technically straightforward.

### 4.7b Other recent industry neighbors

A 2024-2026 sweep identified additional patient-facing AI products in or near this space (full inventory and property-tuple analysis in supplementary material): SonderMind AI Care Concierge (October 2025), Lyra AI Care Search (2025-2026), Talkspace TALK (beta 2025), Jimini Health Sage (November 2024), UnitedHealthcare Avery (March 2026), ChatGPT Health (January 2026). Each fails at least one of the three properties. The structural finding from the sweep matters more than the individual entries: of approximately 25 patient-facing AI mental-health products inspected, roughly 12 are closed-clinical care delivery, roughly 8 are stratified-care network-coupled navigators, roughly 3 are general-medical, and zero ship the three-property combination as their design center.

### 4.7c NICE "digital front door" terminology (UK regulatory framing)

NICE Early Value Assessment HTG756 (2024) on "digital front door technologies to gather service user information for NHS Talking Therapies" is the closest active UK regulatory vocabulary to "articulation skill." The category formally assesses Limbic Access (UKCA Class IIa) and Wysa Digital Referral Assistant (UKCA Class I, deployed in approximately 40% of NHS Talking Therapies services as of the assessment). The disambiguation: a *digital front door* funnels users into one care system (NHS Talking Therapies); *articulation skill* produces patient-portable literacy the user can take to any door. The terms are not interchangeable. v0.4 names the NICE framing here so that NICE-aware reviewers do not collapse the two; the patient-portable property (§3.1) is the load-bearing distinction.

The Wysa Digital Referral Assistant, distinct from Wysa Gateway in the U.S. (§4.2), is a separate neighbor that shares the digital-front-door pattern: NHS-coupled, recommends within the NHS Talking Therapies tier system. Selfapy and deprexis (German DiGAs, prescription pathway, deliver guided self-help / CBT) and Mon Sherpa (Qare, France, reportedly no longer in service) are additional EU patient-facing neighbors that occupy the closed-clinical regime but are noted here as evidence the closed-clinical-with-prescription-pathway pattern is the dominant European deployment shape.

### 4.8 ChatGPT, Claude, and general-purpose LLMs

General-purpose LLMs are the de facto venue for the user this regime serves; operator disclaimers notwithstanding, users go there because there is nowhere else to go. Four concrete failure modes distinguish what general-purpose LLMs do in this use from what an articulation-regime system does by design.

(i) Sycophancy at long context: general LLMs are trained to agree with the user's framing, which when the framing is wrong (e.g., "I think I just need to try harder") produces reinforcement of the wrong path. The Raine v. OpenAI complaint (San Francisco Superior Court, filed 2025-08-26) records 377 messages flagged by OpenAI moderation in the conversation history of Adam Raine (16, California) prior to his April 2025 suicide; the amended complaint alleges that prior model iterations had stronger safeguards weakened before the relevant exchanges occurred. On 2025-11-06 a coalition of plaintiffs' firms (Social Media Victims Law Center plus Tech Justice Law Project) filed seven additional ChatGPT-related suits in California state courts on behalf of Shamblin, Lacey, Enneking, and Ceccanti families (deaths) and Irwin and Madden (AI-psychosis injury survivors). The Raine cluster operationalizes failure mode (i) at population scale.

(ii) Confabulated provider names and contacts: general LLMs in long mental-health threads occasionally produce specific therapist names, contact information, and "I called and confirmed" claims that are entirely fabricated, with high downstream-harm potential. The articulation regime forecloses this failure mode by design (Property 2: provider recommendation refused).

(iii) No safety-section retention on derivative wrappers: system prompts wrapping general LLMs for mental-health use can be silently stripped on fork, the failure mode the NEDA Tessa case made vivid in 2023. The articulation regime addresses this through the governance pattern in Paper A (LICENSE-PROMPT, deployment-pause posture, rule-coverage CI).

(iv) AI-induced or AI-amplified psychosis: documented in 2024-2025 case-series literature (UCSF psychiatrist Sakata reported a 12-patient series in Psychiatric News 2025-10; JMIR Mental Health published case reports of AI-induced delusional states in 2025). OpenAI's October 2025 disclosure noted approximately 0.07% of weekly active users showing indicators of psychosis or mania, distinct from the 0.15% suicidal-planning figure. The articulation regime's Property 3 (no diagnostic claims, vocabulary scope explicitly bounded) and §3.4 (recognition of out-of-scope presentations including psychosis) address this failure mode by refusing the engagement pattern that produces it.

A structural caveat: ChatGPT volume is evidence both of demand and of harm. This paper cites the volume figure as evidence of unmet demand and does not argue that the conversations occurring on general LLMs are net beneficial.

---

## 5 · Reference implementation — Stay

Stay (thestay.app) is the author's deployed reference implementation of the proposed regime. The companion paper (Paper A, Zenodo DOI 10.5281/zenodo.19941457) describes the engineering-ethics governance pattern (restricted-use license, deployment-pause posture, rule-coverage CI) under which Stay is operated. This section describes the articulation function as it is realized in Stay, and presents one observed multi-issue session as an *illustrative existence proof* that the articulation function executes coherently through a complex presentation. The session is not presented as efficacy evidence; the deployment does not yet have the user volume to support efficacy claims.

Stay's system prompt enumerates *agency functions* (translator, mirror, navigator, bridge-with-companion-during-call, skill teacher, logger) that together perform the articulation work the regime describes. Translator handles symptom-to-modality framing (naming candidate modalities the user could ask about, never as a fit-claim); navigator handles modality-to-credential mapping; skill teacher hands off concrete tools the user can use without Stay; logger writes a structured DBT-style diary the user can export for their clinician (default-off, opt-in). Bridge-with-companion-during-call covers the moment when the user does need to call a crisis line and Stay stays present while they dial; this is articulation in the imminent-acuity case.

### 5.1 Illustrative session: multi-issue presentation, articulation function across acuities

The session described here was conducted on 2026-05-01 with the operator's wife. Verbal consent was obtained for the specific use of citing the trajectory in this paper, with two boundary conditions: structural description only (no verbatim user turns reproduced), and identifying clinical detail elided or generalized. No IRB review was sought; the session is described as a deployment-illustration drawn from one consensual interaction, not as research data, on the basis of n=1 case-study reporting standards (Riley et al. 2017) and explicit consent. Future work using observational session data at any scale will require IRB review. The reader should weight the trajectory accordingly: this is reported for *function illustration* (does the articulation function execute coherently across acuities?), not for *outcome demonstration*; the user is in a relationship of dependency with the operator, the operator chose the session for description after the fact, and selection bias toward "the session that worked" is structurally unavoidable. The illustration is supportive, not evidentiary.

The session opened with a low-acuity articulation move (a phenomenological label for fatigue) and over approximately 25 turns moved through four disclosure escalations: intimate-partner violence (Stay surfaced the National Domestic Violence Hotline with the text-line option foregrounded after the user signaled preference for non-voice channels, and provided an articulation script naming the violence concretely, naming the user's actual goal of stopping the violence while preserving the family, and including the presence of a young child as a triage signal; lethality-risk language including firearms-in-home, prior strangulation history, and escalation pattern was *not* surfaced and represents a known implementation gap the clinician-of-record review (Paper A §2.2) is expected to flag); active suicidal ideation without plan (Stay surfaced 988 with companion-during-call language and a parallel articulation script for opening the call); substance use as coping (Stay performed a means-restriction request per Paper A §1.a, which the user complied with, and continued conversation while the substance was out of reach); and a parasocial close in which the user expressed that Stay "understands me" in a way other people in her life do not (Stay acknowledged the experience, named itself as AI, and redirected the user's capacity back toward her existing friend network without confirming the parasocial frame). The presence of a young child was reflected once and explicitly not weaponized as a survival argument (per Paper A §1.b leverage-prevention SOP). The user identified a friend network as a place she could go and Stay coached the bridge to that human resource.

The clinical prioritization (means-restriction first, then acute-risk surface, then chronic safety planning, then social handoff) ordered the work; the articulation function appeared at every escalation, providing the user specific *language* she could use to ask for help from a human at each ordered step rather than abstract advice about the existence of help.

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

### 6.3 Relation to existing evaluation instruments

The handoff-rate / appropriateness-audit pair is upstream of and orthogonal to two existing measurement traditions. VERA-MH (Bentley et al., arXiv 2510.15297, October 2025; Spring Health) evaluates suicide-risk-detection performance in mental-health LLMs; handoff rate evaluates whether the system effectively bridges the user to a human resource. Both measure different things and a regime-compliant deployment should report both. Stacey et al.'s 2024 Cochrane review of patient decision aids (CD001431, sixth update) provides validated outcome instruments for related constructs (knowledge gain, decisional conflict, value-congruence) that future articulation-quality studies (§10.3) could adapt. The Patient Activation Measure (Hibbard 2004; CMS MIPS 2024) is the closest established patient-side activation instrument; handoff rate is a behavioral proxy that should eventually be triangulated against PAM scores.

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

### 7.6 Regulatory fit (US state-law landscape 2025-2026)

Five 2025 state statutes affect the regime directly: Illinois HB 1806 (signed 2025-08-04) bans AI "independent therapeutic decisions" and "direct therapeutic communication"; Nevada AB 406 forbids AI from "providing or claiming to provide mental or behavioral healthcare"; Utah HB 452 requires disclosure for "mental health chatbots"; California SB 243 (effective 2026-01-01) introduces companion-chatbot disclosure, three-hour break notices for minors, and mandatory crisis-resource protocols; New York's AI companion safeguards (effective 2025-11-05) impose comparable obligations. The articulation regime's three-property posture is unusually well-fit for compliance with the strictest of these (IL, NV) because it explicitly refuses "therapeutic decisions," "treatment plans," and "claiming to provide mental or behavioral healthcare," but is not yet a recognized statutory category in any of them. Statutory carve-out for "patient-side literacy AI" would clarify deployability. The §5 deployment-pause posture (Paper A §2.2) operationalizes voluntary compliance ahead of explicit carve-out.

## 8 · Ethics, broader impact, and conflict-of-interest disclosure

### 8.1 Conflict of interest

The author developed and operates the reference implementation discussed in §5 (thestay.app). The author has no commercial revenue from the implementation (it is free, MIT-licensed for code, restricted-use-licensed for the system prompt's safety-critical sections per Paper A) and no employment relationship with any named comparator system (Limbic, Wysa, Spring Health, Lyra, IESO, WithTherapy, Headway, Alma) or with any model-provider operating systems cited as venues of the unmet need (Anthropic, OpenAI, Google). The author intends to seek non-commercial donor and grant funding for continued operation of the implementation.

### 8.2 Broader impact

If the regime is adopted, the most likely positive impact is that some fraction of users currently routing mental-health-relevant conversations to ChatGPT/Claude/general-purpose-LLMs route instead to a system *designed* for the use case, with safety-section retention on fork (Paper A), explicit refusal to substitute for clinical care, and the success metric of handoff rather than retention. The most likely negative impact is that the regime is implemented poorly by an actor without the governance scaffolding of Paper A; the failure mode is the NEDA Tessa case repeated. The mitigation the author proposes is the combined publication of the regime definition (this paper) and the governance pattern (Paper A) under restricted-use license such that derived implementations cannot strip the safety-critical sections without explicitly naming a clinical reviewer-of-record.

### 8.3 Equity considerations

The articulation regime presupposes a baseline of literacy, language fluency, and cognitive engagement that is not universal. Populations excluded by these assumptions (§7.4) are exactly the populations that human navigators in well-funded systems serve well; in a population where human navigation is scarce and AI articulation is the only option, the regime's deployment must include explicit fallback to "this conversation should be with a human" with the appropriate human resource named.

### 8.4 Data ethics

The reference implementation's session storage is local-only, end-to-end encrypted with a per-device key, and not transmitted off the user's device. The diary log function is default-off and opt-in. Telemetry is metadata-only (event names and boolean flags), opt-in beyond the default-on operational logging documented in Paper A §3. The §5 illustrative session was conducted with explicit consent for the specific use of citing the trajectory in this paper.

### 8.5 Funding model and sustainability

The articulation regime is structurally incompatible with the engagement-monetized consumer-AI funding model: a system whose success metric is handoff (§6) cannot be funded by ad inventory, subscription retention, or session-time monetization. The intended posture for the reference implementation is donor-and-grant-supported operation under a U.S. 501(c)(3) structure (formation in progress, not yet established at submission). The Crisis Text Line / Loris.ai episode (Politico 2022; JMIR 2025) is treated as binding cautionary precedent: conversation data from a mental-health service cannot be commercialized, including via abstracted derivative products, without breaking the trust that makes the service usable.

Sustained-donor consumer-service precedents exist (Wikimedia, Khan Academy) but the closest structural analog by deployment shape, Signal Foundation, spends approximately $25M annually against approximately $2M in user-donation revenue and remains dependent on a 2018 founding gift. Signal's underfunding is a real warning. Cost economics for the reference implementation, using Claude Sonnet 4.5 with prompt caching and approximately 25-turn sessions, place per-session inference around $0.06-$0.10; a 10,000 DAU deployment carries operating cost on the order of $400K-$600K annually, plus approximately $200K fixed for clinician audit, legal, and governance overhead. This envelope is reachable from a single mid-size foundation grant. No foundation has yet published a named funding program for patient-facing mental-health AI, though Humanity AI ($500M / 5yr, MacArthur-led consortium, announced October 2025), RWJF Behavioral Health Integration, and Anthropic's Claude for Nonprofits (December 2025) are plausible pathways. We do not claim the funding model is solved.

---

## 9 · Conclusion

The bifurcation of the AI mental-health landscape into closed-clinical and open-companion has been the field's organizing framing through the early 2020s. The framing is incomplete. A user who is distressed enough to recognize that something is wrong, who does not yet know what kind of help they need, and who currently routes to ChatGPT or to nothing, defines a need that the five existing regimes (clinical, companion, crisis-line, symptom-checker, directory) do not collectively serve. *Articulation skill* names this gap as a regime, defines it by three required properties, distinguishes it from six closest neighbors, and offers one reference implementation as illustrative existence proof.

Paper A's governance pattern provides forkable safety scaffolding for any team building in the regime. The §3 three-property definition is testable against any candidate system, and the §6 anti-engagement criterion provides a structural counter to the AI-companion regime's engagement metrics, with a handoff-appropriateness audit as the gameability defense. The regime is positioned to feed users into existing referral systems rather than substitute for or compete with them. *Articulation skill is a regime worth building.*

A note on venue framing. This paper belongs in the position track, not the technical track or a workshop. Position papers exist to name regimes and propose normative correctives *before* widespread adoption, when the field still has design degrees of freedom; the §1.4 lineage shows the constituent ideas are well-established, and the contribution is the operational synthesis applied to deployed mental-health AI under three constraints, with one published reference implementation under explicit governance scaffolding (Paper A) and immediate regulatory relevance (§7.6). The contribution is the named regime, not a deployment; external adoption (by definition not yet present for a regime newly named) is not the criterion the position track applies.

---

## 10 · Future work

Three directions deferred from this paper to future work:

10.1 Clinical adoption study. The handoff-rate / handoff-appropriateness pair, audited by a clinician-reviewer-of-record under Paper A §2.2 (deadline 2026-06-30 in the current deployment), would give a per-session clinical validity check that articulation outputs are in fact actionable by the user's downstream clinician.

10.2 Cross-cultural and cross-system grounding. Re-implementing the articulation regime against NHS, Canadian provincial systems, EU national systems, and Mainland Chinese mental-health resources would test whether the regime generalizes or whether its current scope is U.S.-specific.

10.3 Articulation-quality measurement. A small-N clinician-rated quality study against deidentified transcripts (with appropriate consent and IRB review) would be a feasible first step toward direct measurement of articulation quality beyond the handoff-rate proxy.

---

## Appendix A · Methods

### A.1 Reference-implementation provenance

Stay (thestay.app) was developed by the author beginning in early 2026. The system prompt, governance pattern, behavioral test suite, and reference implementation are open-source at github.com/wudaming00/stay. The engineering-ethics governance pattern is documented in Paper A (Zenodo DOI 10.5281/zenodo.19941457). The §5 session-illustration provenance, consent process, and reporting-standard basis are documented in §5.1.

### A.2 Reproducibility — prior-art search log

The prior-art search referenced throughout §4 was conducted on 2026-05-02 across Google Scholar, Semantic Scholar, arXiv, PubMed, ACM Digital Library (CHI, CSCW, IUI, FAccT), and product positioning announcements. v0.4 added a 7-researcher parallel sweep covering HCI/CSCW venues, EU/UK regulatory frameworks, exhaustive industry scan, adjacent-field patient-navigator canon, theoretical foundations, expanded failure-mode and regulatory landscape, and donor-funded sustainability precedents. The 14 base search queries: "AI mental health triage," "chatbot mental health navigation," "AI mental health pathway," "AI care navigator mental health," "digital mental health stepped care," "AI symptom-to-modality matching," "AI mental health literacy," "chatbot mental health intake," "AI psychoeducation," "patient navigation AI mental health," "mental health treatment matching AI," "self-referral mental health AI," "AI patient empowerment health literacy," "AI care navigation patient-side." Top 20 results per query inspected; products named (Limbic Access, Wysa Gateway/DRA, Spring Health Guide, Lyra Polaris, IESO, WithTherapy, Headway, Alma, Therabot, Babylon, Ada, K Health, Headspace Ebb, SonderMind, Talkspace, Jimini, UHC Avery, ChatGPT Health) had most recent positioning retrieved. Raw search log will be deposited as supplementary material on Zenodo. Known limitations: search did not extend to non-English literature systematically; commercial product positioning is a moving target and the verdict is current as of 2026-05-02; the closest neighbor (Headspace Ebb post-Jan-2026 stratified-care upgrade) is at consumer scale and the v0.4 distinguishing claim depends on Ebb retaining network coupling.

---

*End of Paper C draft v0.5.*
