# Articulation Skill: A Patient-Navigator Regime for Public-Good Mental-Health AI

*Anonymous submission to AIES 2026.*

*Throughout this paper we refer to the reference implementation we built as **System X**, anonymized for double-blind review. Repository, deployment URL, and author identification are withheld; an anonymous code mirror is provided in supplementary materials. A companion paper (engineering-ethics scaffolding — restricted-use license, deployment-pause posture, rule-coverage CI) by the same authors is referenced as [anonymous companion]; no contribution in this paper depends on its empirical claims.*

---

## Abstract

Between an undifferentiated, distressed user and the professional help they may eventually receive lies a gap of two kinds: *time* (often weeks of waiting, or earlier, the user not yet knowing they need help at all) and *information* (the user not yet knowing what kind of help to ask for). The five existing AI mental-health regimes (closed-clinical, open-companion, crisis line, symptom checker, directory) do not occupy this between-position: each presupposes the user already knows what kind of system they have walked into. This paper proposes a sixth regime sited explicitly in the gap, *articulation skill*: an AI that helps the user translate undifferentiated distress into the vocabulary referral systems index on, without recommending a provider and without rendering a clinical diagnosis. The regime is operationalized by three required properties (patient-owned system-agnostic output; refusal of provider recommendation; bounded non-DSM vocabulary spanning modality, credential, level-of-care, specialty, and phenomenological labels), a scope-recognition constraint for out-of-scope populations, and a deployment-side defense-of-record requirement against base-model-layer failure modes. A 2024–2026 prior-art search across academic literature and ~25 patient-facing AI products finds zero deployments shipping the conjunction.

The paper proposes an *anti-engagement criterion* category as success measure, defined by anti-engagement-under-adversary and welfare-monotone properties; the category is portable to any public-good consumer AI, and the regime is its canonical operationalization within the mental-health AI vertical. *Handoff rate* paired with a phased clinician appropriateness audit is one operationalization, awaiting Phase-1 validation. The primary contribution is the joint construction of the regime and the metric category. **System X** is one open-source partial reference implementation, described here at the architectural level only; behavioral evidence is deferred to IRB-reviewed future work, with an external clinician-of-record audit committed (audit pathway and standing conditions specified in §5 and §8).

The paper does not claim that the regime obviates clinical evaluation, that handoff rate has been validated against clinical outcomes, that any external operator has yet adopted the regime, or that the prior-art finding rules out close-related work the authors missed.

---

## 1. Introduction

### 1.1 The Between-Position and the Five-Regime Bifurcation

The structural position this paper proposes for AI in mental-health care is *between* the undifferentiated distressed user and the professional help they may eventually receive. The two gaps the position fills are familiar to anyone who has tried to find a therapist while distressed: a *time gap* (weeks before an appointment, or earlier, not yet knowing one is needed) and an *information gap* (the user does not yet know what to ask for, what kind of clinician handles what, what modalities exist for what they are experiencing). The five existing AI mental-health regimes (closed-clinical, open-companion, crisis line, symptom checker, directory; §2) each presuppose the user already knows what kind of system they have walked into; none is positioned in the gap.

This paper cuts the landscape on three product-level dimensions — provider recommendation, system coupling, and vocabulary scope — chosen as the minimum dimension set under which the articulation function becomes visible as a separate slot. Existing analytic frameworks cut on different dimensions (Torous et al. on passive-vs-active data collection in digital phenotyping [1]; Olawade et al. 2024's AI-in-mental-health review on deployment context [2]; the NICE EVA framework on funnel role for one care system [3]; the stepped-care literature on patient-state intensity tier), under each of which articulation-skill systems land in the same bucket as one or more of the regimes named here. The five-regime construction that follows is a consequence of the dimension choice and is offered for clarity, not as a claim to authoritative classification. The methodological hazard — a taxonomy designed to surface a function tends to surface that function — is mitigated by independence at the product level: §3.1–§3.3 give per-product checks that do not require accepting the five-regime cut, and §4's prior-art finding survives reframing under any taxonomy whose dimensions admit the same checks.

That this user need surfaces on general-purpose LLMs in non-trivial volume is supported by OpenAI's October 2025 disclosure [4] of suicidal-planning-indicator flag rates among weekly active users. The figure is industry-self-reported, classifier-confounded, and counted at message-event level rather than enrolled-user level; we cite it as a directional signal that mental-health-relevant conversation volume on general LLMs is non-zero on a tool whose operators caveat that it is not built for the use case, not as a quantified population estimate.

### 1.2 Function, Not User-State; Roles, Not Just Constraints

A position-by-user-state framing fails almost immediately. The same user can oscillate between "thinking out loud about a hard week" and "naming an active-suicide-ideation moment" within a single session. We define the regime by the function it performs (articulation work), not by the state of the user it serves. The articulation function is in scope whenever a user describes experience that they do not yet know how to translate into the vocabulary referral systems index on. The function sits upstream of crisis intervention (the system must still escalate appropriately) and upstream of therapy (the system must still hand off to professional care).

Operationally, occupying this between-position requires the AI to perform several roles simultaneously: knowing the user (listening with attention to phenomenological detail), teaching the user (about themselves and about the psychology vocabulary that referral systems index on), providing information when needed (modality, credential, level-of-care), making situation-dependent judgments about whether and what kind of professional help to direct toward, and recognizing crisis moments and routing accordingly. The regime defined in §3 is the structural specification of these roles; §5's reference implementation operationalizes them via system-prompt agency functions.

Population estimates for the addressable need are difficult to source directly. NSDUH 2023 [5] reports 49.5 million U.S. adults with any mental illness in the past year, of whom approximately half received no treatment. Among reasons for not receiving treatment, the largest historical category is "thought I could handle the problem without treatment"; "did not know where to go for services" appears as a documented but smaller category alongside cost, stigma, time, and insurance navigation. We do not claim the articulation gap is the dominant barrier; we claim it is one of several, plausibly addressable for 10–25% of the untreated population, and not currently served by any of the five named regimes.

### 1.3 Thesis

The thesis is that the between-position named in §1.1 defines a regime in its own right: *articulation skill*. The regime is distinct from the five regimes named in §2 and operationalized by three required properties (§3.1–§3.3), a scope-recognition constraint (§3.4), and a deployment-side defense-of-record requirement (§6.2). Seven closest neighbors each diverge on at least one of the three properties (§4); a partial reference implementation exists, described at the architectural level (§5).

The primary contribution is the joint construction of two coupled elements: the articulation skill regime in mental-health AI (§3), and an *anti-engagement criterion* category as success measure (§6, defined by anti-engagement-under-adversary and welfare-monotone properties) that the regime requires to be coherent. The category is portable to any public-good consumer AI; the regime is its canonical operationalization within the mental-health AI vertical, and the regime cannot be measured with engagement metrics without violating its own constraints. The §4 prior-art finding (no current production system ships the three-property conjunction) is a supporting empirical observation; §7.5 reads it as a structural prediction about commercial incentive, not a calendar-fact gap-claim. *Handoff rate* is offered as one operationalization of the category, awaiting Phase-1 validation, not as a validated metric. The paper does not present empirical evaluation of efficacy. Anticipated objections are engaged in §7.5.

### 1.4 Lineage in One Paragraph

The regime draws on five literatures whose canonical claims partially support and partially cut against the design choices in §3. Star (1991) [6] on category-work and the CSCW articulation-work tradition (Strauss [7], Schmidt and Bannon [8]): the §3.3 vocabulary-bounding move places the regime on the *standardization* side, while Star's tradition predicts the §7.4 population-harm list as the structural output. Mishler (1984) [9] voice-of-medicine and Kleinman explanatory models [10]: the regime performs upstream the biomedical standardization Mishler critiques and Kleinman asks the clinician to resist; the cost is non-trivial, and the comparator below addresses but does not erase it. Nutbeam 2000 health literacy [11] and Hibbard et al. 2004 PAM [12]: the regime operates in Nutbeam's interactive-literacy band; PAM is a longitudinal trait-level scale, not a session-level state. Elwyn et al. 2012 shared-decision-making [13] and the patient-decision-aids tradition (Stacey et al. 2024 Cochrane CD001431 [14]; IPDAS): the regime is kin to but not a sub-type of decision aids; three structural differences (no presupposed decision, no presupposed diagnosis, unfiltered front-door context) hold the distinction. AI safety / specification-gaming canon (Krakovna et al. 2020 [15]; Goodhart [16] and Manheim and Garrabrant 2018 [17]; Hubinger et al. 2019 [18]; Sharma et al. 2023 [19]; Casper et al. 2023 [20]; Shah et al. 2022 [21]; Perez et al. 2022 [22]): engaged in §6.

---

## 2. The Five Existing Regimes

For each existing regime, we summarize the framing, name representative deployments, and give the regime's tuple against three properties this paper uses to define the proposed sixth regime: provider recommendation, system coupling, and vocabulary scope.

**Closed-clinical regime** (Therabot [23], Wysa Health, Limbic Access [24], Lyra Polaris, IESO [25]): care delivered by an AI agent under internal clinical review (and, for some, regulatory pathway). Need served: *direct AI-delivered therapeutic intervention*.

**Open-companion regime** (Replika, Character.AI, open-source mental-health LLMs): conversational presence offered as emotional companion, sometimes with roleplay framing; safety sections often strippable on open-source fork. Need served: *parasocial connection / emotional presence*. The fork-strips-safety failure mode is documented (NEDA Tessa, May 2023 [26]). *Garcia v. Character Technologies* [27] is the first major U.S. tort case cluster associated with this regime.

**Crisis-line regime** (988, Crisis Text Line, DV hotline): trained human voice or text in real time; authority to dispatch police and enforce protocols. Need served: *imminent-danger intervention*.

**AI symptom-checker regime** (Babylon, Ada, K Health): conversational AI applying medical decision protocols to triage between self-care, primary care, and emergency care. Mental-health presentations addressed at coarse granularity only.

**Therapist-matching directory regime** (Psychology Today, Headway, Alma, ZocDoc, WithTherapy): searchable clinician databases, often with insurance verification. The user-side prerequisite (knowing what kind of provider, modality, specialty, credential) is assumed.

| Regime | Provider rec | System coupling | Vocabulary scope | Output |
|---|---|---|---|---|
| Closed-clinical | Within own network | Coupled | Modality + diagnostic | The therapy itself |
| Open-companion | None | Agnostic | None (undifferentiated) | Conversation/relationship |
| Crisis line | None (human resource) | Single acuity | None | Direct intervention |
| AI symptom checker | Tier-level routing | Mostly agnostic | Loose diagnostic | Care-tier suggestion |
| Matching directory | Yes (primary) | Coupled to directory | Provider attributes | List of clinicians |
| **Articulation skill (§3)** | **None (by design)** | **Agnostic** | **Modality + credential + LOC + phenomenological labels; NOT DSM** | **Patient-owned literacy** |

The articulation regime is the only row in which all four columns simultaneously hold the values shown.

---

## 3. The Sixth Regime: Articulation Skill

*Articulation skill* is the capacity of an AI to translate undifferentiated distress into the vocabulary that referral systems index on, without recommending a specific provider and without rendering a clinical diagnosis.

The regime is defined operationally by three required properties (§3.1–§3.3), a scope-recognition constraint (§3.4), and a deployment-side defense-of-record requirement against base-model-layer failure modes (§6.2). These three properties are the three product-level dimensions named in §1.1 as the minimum set under which the articulation function surfaces as a separate slot; §4.5's collapse mapping is supplementary evidence that each property does load-bearing work in the conjunction. Whether "currently unclaimed" is a calendar fact or a structural property is engaged in §7.5: closest-neighbor players have business arrangements that create substantial switching cost from system-coupled to patient-portable output, so the unclaim is best read as a structural prediction about commercial incentive, not a temporal accident.

### 3.1 Property 1 — Patient-Owned, System-Agnostic Output

The artifact the user takes away is literacy in a specific bounded vocabulary (defined in §3.3): a paraphrase of their experience in modality terms, a level-of-care suggestion phrased as a question the user can ask, named credential categories, named phenomenological labels for what the user described. The artifact lives with the user and is portable. Nothing about it presupposes the user will go to a particular network, app, directory, or care system. The user can take their articulated need to their primary care physician, to their existing therapist, to Psychology Today, to Headway, to their insurance member-services line, to their EAP, or to a friend who works in the field.

In the reference implementation the literacy persists in three places: within the conversation transcript (exportable from local storage), in user-marked "kept insights" (persisted in IndexedDB), and optionally in a DBT-diary-card-style structured log if the user opts in. There is no single "articulation-summary PDF" the system generates as a single output object. The deliberate non-design choice is part of property 1: the system does not prescribe the form the patient's literacy takes.

This property distinguishes the regime from Limbic Access (which feeds NHS Talking Therapies as a single specific service), from Wysa Gateway (which feeds a partner provider's EHR), from Spring Health Guide (which routes within the Spring Health network), from Lyra Polaris (which routes within the Lyra network), from any matching directory, and from the human "digital navigator" role [28], which by definition operates inside one health system. The patient's epistemic outcome — leaving the conversation knowing what kind of help to ask for, at any door — is the reason the property is regime-defining.

### 3.2 Property 2 — Provider Recommendation Refused by Design

The system does not output specific clinician names, does not interface with directory APIs, does not make appointment offers, does not maintain awareness of the user's insurance network, and does not recommend a specific care system or program by name. The reasoning, downstream from property 1, is that the moment an AI begins outputting specific provider recommendations, the artifact stops being patient-owned literacy and becomes a referral the user is implicitly asked to act on, with two consequences: the user's downstream verification of fit, credential, insurance, and availability is short-circuited by an AI's recommendation that did not include any of those checks; and the operator absorbs liability and curation responsibility for the directory it is in effect maintaining. The articulation regime hands off "what to look for" to the user and lets the user perform "who to see" in whichever existing referral system they prefer.

Refusal is not free. A user who asks "I think I need a trauma specialist, who should I see?" and receives a refusal may experience the response as rebuff and route to a general-purpose LLM, which will sometimes confabulate a name (§4.4(ii)). The forgone-benefit cost is real, and the regime accepts it on the grounds that the existing referral systems are the right venue for the "who to see" step and that an AI's confabulation rate is a worse failure mode than the friction of pointing to a directory.

### 3.3 Property 3 — Vocabulary Scope: A Three-Tier Distinction

The vocabulary the system uses is bounded by a three-tier distinction.

**Tier (a) is in scope**: phenomenological labels and care-navigation vocabulary. The system may name experiences using common phenomenological vocabulary clinicians use at intake (descriptive labels for what happened, not diagnostic categories), and may name modality, credential, level-of-care, and specialty. The vocabulary spans five sub-categories (phenomenological labels; modality across CBT-family / trauma / relational-dynamic / mindfulness / format axes; credential; level-of-care across MH and SUD continua; specialty); the full table with representative items, the per-term U.S. inclusion criterion (gates: U.S. patient-facing referral directories, recognized credentialing or training organizations, CMS HCPCS/CPT or ASAM Criteria), and the country-agnostic form of the criterion are in supplementary materials. The three-gate choice is regime-coherent: directories, credentialing organizations, and payor billing taxonomies are the three institutional surfaces a *patient* encounters when navigating to care. Alternative gates (DSM categories, clinical-practice guidelines, treatment manuals) operate behind the patient-facing layer and would re-introduce the tier-(b) line under a different name.

**Tier (b) is out of scope**: DSM diagnostic categories. The system does not say "this sounds like generalized anxiety disorder," "you may have PTSD," or "you have ADHD." Diagnostic statements are clinical acts with downstream consequences (insurance coding, treatment planning, self-concept, credentialing impacts) that an AI without the patient's history, formal examination, and clinical context is not positioned to perform without harm. The literature on diagnostic-disclosure effects on self-concept (Yanos, Roe, and Lysaker 2010 [29]; Lally 1989 [30]) is consistent with this design choice. Naming a phenomenological label (panic attack, tier a) and naming a diagnostic category (panic disorder, tier b) are different clinical acts; the regime allows the first and refuses the second.

The productive move when a user asks a tier-(b) question (e.g., "am I bipolar?") defines the regime by what it *does* in addition to what it refuses: the system declines to give a yes/no diagnostic answer, names that the question is one a clinical evaluation can answer, describes what such an evaluation would assess (sleep architecture changes, episode duration, family history, functional change), names which credentials perform such evaluations (psychiatrist, PMHNP, psychologist with diagnostic-assessment training), and offers phenomenological vocabulary the user can deploy in describing the experience to that evaluator. The user leaves with literacy enabling them to *get* the diagnostic question answered, not with the diagnostic answer itself.

**Tier (c) is in scope as triage signal but out of scope as diagnosis**: acuity recognition. When a user presentation crosses a threshold for acute risk (suicidal ideation with method or plan or intent per C-SSRS levels 3–5 [31]; reports of voices commanding harm to self or others; active substance impairment; current intimate-partner violence with physical harm or strangulation history [32]), the system must recognize the threshold and surface appropriate human resources. The system describes the risk indicator phenomenologically and does not name the diagnostic-grade subtype whose forensic implications require formal assessment.

### 3.4 Scope-Recognition Constraint

The three properties describe what the regime does. A scope-recognition constraint, derived from the population-harm analysis in §7.4, defines what the regime must not attempt: presentations for which articulation by the AI is the wrong intervention. The relevant strata: psychotic-spectrum presentations (florid out of scope; stabilized partially in scope; prodromal — circumstantial speech, ideas-of-reference, excessive coherence-seeking — is the failure-mode shape the regime is structurally bad at recognizing, since LLMs are biased to reward articulate, coherence-seeking interlocutors); severe cognitive impairment, advanced dementia, TBI; low-literacy and non-English-first users; non-Western somatized presentations; minors under unsupervised conditions (the reference implementation has an 18+ self-attest age gate); suicide presentations stratified by C-SSRS level and prior-attempt status; eating-disorder presentations with medical instability; acute substance impairment; acute imminent crisis (988 and emergency services, not articulation).

For these strata a confidently articulated wrong modality recommendation is worse than no articulation, because the user arrives at the wrong door with conviction. The regime requires the system to recognize when an interaction is out of scope and to signal toward human navigation instead of attempting the work. A regime instance must publish (a) the stratum list, (b) the detection mechanism for each, and (c) the mapped action (route-to-988, route-to-DV-hotline, route-to-PCP, route-to-emergency-services, deployment-pause-on-stratum-X); gates without published action policy do not satisfy the constraint.

The reference implementation operationalizes this via the imminent-risk SOP for the acute-crisis stratum and via stratum-specific protocols for other strata where implemented; SMI scope-recognition, low-literacy, and cross-cultural cases remain documented gaps per §7.4. The §5 clinician-of-record audit is the next checkpoint at which these gaps either close or trigger deployment-pause.

---

## 4. Distinguishing from Closest Neighbors

The closest neighbors were identified by a structured search across academic literature, position papers, and product positioning announcements (2024–2026). Inclusion criterion for "closest neighbor": a deployment that satisfies at least one of P1–P3 unambiguously while diverging on at least one of the remaining two. The remainder of the inventory either diverges on all three (treated at regime level in §2) or has a property tuple unverifiable from public positioning. We address seven closest neighbors and a generalized eighth (general-purpose LLMs).

### 4.1 Seven Closest Neighbors

| Neighbor | Source | P1 (patient-owned output) | P2 (refuses provider rec) | P3 (bounded non-DSM) |
|---|---|---|---|---|
| Limbic Access | [24]; [33] | ✗ NHS Talking Therapies coupled | ✗ recommends Talking Therapies tier | ✗ classifies across 8 conditions |
| Wysa Gateway (US) | press release 2025-06-11 | ✗ inside provider's funnel | ✗ routes to integrated provider | partial |
| Spring Health Guide | US launch 2026-04 | ✗ network-coupled | likely ✗ | unclear |
| Lyra Polaris | announced 2025-10-14 | ✗ in Lyra network | partial | ✗ delivers care |
| IESO Digital Program | [25] | ✗ NHS partnership | ✓ | ✗ delivers CBT |
| WithTherapy + similar | by definition | partial | ✗ recommends providers | ✓ |
| Digital navigator concept | [28] | (human role, not AI) | (human) | (human) |

Limbic Access is the closest published neighbor with peer-reviewed evidence. Spring Health Guide is the most prominent 2026 launch; if Guide's user output turns out portable and provider-rec-refusing, the regime distinction would collapse to network-coupling alone — §7.5 engages this class of refutation. IESO's "literacy plus skills" sits adjacent to the §5 *skill teacher* agency function but differs on P3 (delivers therapy vs names candidate modalities). The digital-navigator concept is the closest conceptual precedent and differs on agency: the navigator is a human team role; the regime is the AI direct-to-patient.

### 4.2 Headspace Ebb (Most Material Defensibility Risk)

Ebb launched October 2024 as a motivational-interviewing companion in the Headspace app, with a January 2026 stratified-care upgrade adding smart triage, care plans, and provider matching across 15,000+ providers. Ebb differs on all three properties (in-app + system-coupled to Headspace network; explicit personalized provider matching post-Jan-2026; motivational-interviewing-plus-symptom-evaluation blends care delivery with navigation). Where it is closest is *reach*, at consumer scale within the closed-network stratified-care pattern. As with Spring Health Guide, a future decoupling would collapse the regime distinction to system-coupling alone; §7.5 engages this falsifier class.

### 4.3 Industry and Regulatory Sweep

A 2024–2026 sweep of ~25 patient-facing AI products (additional names: SonderMind AI Care Concierge, Lyra AI Care Search, Talkspace TALK, Jimini Health Sage, UnitedHealthcare Avery, ChatGPT Health). Structural finding: roughly 12 are closed-clinical, ~8 are stratified-care network-coupled navigators, ~3 are general-medical, and **zero ship the three-property combination as their design center**. NICE Early Value Assessment HTG756 (2024) on "digital front door technologies for NHS Talking Therapies" is the closest active UK regulatory vocabulary; it formally assesses Limbic Access (UKCA Class IIa) and Wysa Digital Referral Assistant (UKCA Class I). The disambiguation: a *digital front door* funnels users into one care system; *articulation skill* produces patient-portable literacy for any door. Selfapy and deprexis (German DiGAs, prescription-pathway) and Mon Sherpa (France, reportedly no longer in service) are EU closed-clinical-with-prescription-pathway neighbors confirming the dominant European deployment shape.

### 4.4 ChatGPT, Claude, and General-Purpose LLMs

General-purpose LLMs are the de facto venue for the user this regime serves; operator disclaimers notwithstanding, users go there because there is nowhere else to go. Four concrete failure modes distinguish what general-purpose LLMs do in this use from what an articulation-regime system does by design.

**(i) Sycophancy at long context**: general LLMs are trained to agree with the user's framing, reinforcing wrong paths when the framing is wrong. Sharma et al. [19] document the mechanism across five frontier model families: sycophancy is *trained in* by RLHF preference signals, increases with model scale, and persists despite explicit instructions otherwise. *Diagnostic-claim sycophancy* ("you may have GAD") is addressed by Property 3's diagnostic refusal. *Framing sycophancy* ("you're right, this sounds like a flashback") is *not* addressed by Property 3: phenomenological labeling is permitted, and a sycophantic base model under Property 3 will produce labels agreeing with the user's framing rather than probing it. The Raine v. OpenAI complaint [34] alleges 377 OpenAI-moderation-flagged messages prior to the decedent's April 2025 suicide; in November 2025 a coalition of plaintiffs' firms filed seven additional California state-court suits (four for decedents' families, three for AI-psychosis injury survivors). These are unadjudicated; population-scale evidence rests on Sharma et al. and OpenAI's October 2025 operator-disclosed flag rate.

**(ii) Confabulated provider names**: general LLMs in long mental-health threads occasionally produce specific therapist names, contact information, and "I called and confirmed" claims that are entirely fabricated. The articulation regime forecloses this failure mode by design (Property 2).

**(iii) No safety-section retention on derivative wrappers**: system prompts wrapping general LLMs for mental-health use can be silently stripped on fork (NEDA Tessa case [26]). The articulation regime addresses this through the governance pattern in [anonymous companion] (LICENSE-PROMPT, deployment-pause posture, rule-coverage CI).

**(iv) AI-induced or AI-amplified psychosis**: documented in 2024–2025 case-series literature [35]; OpenAI's October 2025 disclosure noted ~0.07% weekly-active-users showing psychosis/mania indicators. *Deployment-layer mechanisms* (confirmatory engagement with delusional content; coherent phenomenological labeling that entrenches a delusion with clinical-sounding language) are partially defended by Property 3 plus §3.4 scope-recognition. *Base-model-layer mechanisms* (long-context coherence reinforcement that the user mistakes for confirmation-of-reality; sycophantic validation of user-presented framing) are not addressable by Property 3 / §3.4 alone; the regime therefore requires every conformant deployment to specify a deployment-side defense-of-record (per §6.2: turn-budget cap, runtime accommodation-pattern monitoring, anti-sycophancy fine-tuning, or base-model substitution).

### 4.5 Collapse Paths

Relaxing any one of the three properties collapses the regime onto an existing one:

| Property relaxed | Collapse target |
|---|---|
| P1 → system-coupled | Closed-clinical or stratified-care navigator |
| P2 → recommendation produced | Therapist-matching directory |
| P3 → diagnostic categories produced | AI symptom-checker or closed-clinical |
| P3 → undifferentiated conversation | Open-companion |

Two of three relaxed simultaneously typically collapses to a single existing regime; all three relaxed is a generic mental-health AI without distinguishing posture.

---

## 5. Reference Implementation — System X

**System X** is one open-source partial reference implementation, cited as architectural existence proof for the §3 three-property conjunction; behavioral evidence is deferred to a planned articulation-quality study under prospective IRB review. System X implements §3.1–§3.3 and partially implements the §3.4 scope-recognition constraint (acute-crisis case covered via an imminent-risk SOP; SMI, low-literacy, and cross-cultural cases remain documented gaps per §7.4). Six system-prompt agency functions perform the articulation work: *translator* (paraphrasing user experience into modality / credential / level-of-care vocabulary); *mirror* (reflecting back what the user said with phenomenological precision); *navigator* (situation-dependent direction toward appropriate human resources, including the explicit judgment that no professional help is needed when that is the right answer); *bridge-with-companion-during-call* (supporting the user before, during, and after a crisis-line call); *skill teacher* (teaching psychology vocabulary and self-understanding the user can re-deploy); *logger* (DBT-diary-card-style structured recording, opt-in; single-line entries for skills tried, mood / urge ratings, what the user noticed afterward).

System X runs under the engineering-ethics governance pattern documented in [anonymous companion]: a restricted-use system-prompt license requiring named-section retention, a self-imposed deployment-pause posture with auditable trigger conditions, and a rule-coverage CI mapping safety rules to behavioral test assertions. Property 2 (provider-recommendation refusal) and Property 3 (DSM-categories refusal) are enforced as inviolable rules in the system prompt with rule-coverage CI assertions; the §3.4 scope-recognition stratum-to-action mapping and the §6.2 base-model defense-of-record selection are published in the anonymous code mirror. Session storage is local-only, end-to-end encrypted with a browser-held key, 90-day default retention; telemetry is metadata-only. An external clinician-of-record audit is committed; until it completes, the deployment runs under the standing conditions in §8.4 (Data Ethics and Deployment Posture), including risk-band restriction at the IPV / active-SI tiers and incident-log review against the §4.4(iv) failure-mode shape.

---

## 6. An Anti-Engagement Criterion as Success Metric

The conceptual contribution of this section is a *category* of success metric: an *anti-engagement criterion*. A regime defined in opposition to the engagement-optimized AI-companion industry must propose a success metric whose increase corresponds to less user engagement with the AI itself. This contradicts the structure of the metrics that dominate the AI-companion industry (DAU, session length, retention, return rate, messages-per-day) and is the contribution the articulation regime makes to the broader question of how to measure success in public-good consumer AI.

Two necessary properties define the category. **Property C1 (anti-engagement under adversary)**: a perfect-AI-companion deployment (one that maximizes session length, retention, and user dependency) should *minimize* the metric, not maximize it. This excludes engagement metrics that have been relabeled. **Property C2 (welfare-monotone)**: the metric must be empirically anchored to a downstream user-welfare outcome (clinical handoff received, articulation-quality rating by clinician, etc.), so that pathological maximizers ("user does not return for 30 days because the experience was harmful" trivially satisfies C1 but is welfare-negative) are excluded by failing C2. C1 alone is a sign-flip on a one-dimensional metric and admits known-harmful counterexamples; C1 paired with C2 defines the category. C1 and C2 are necessary but not sufficient: distinguishing welfare-aligned disengagement (the user leaves because they got what they came for) from frustrated exit (the user leaves because the experience failed) is operationalization-layer work, addressed by §6.1's tri-valued outcome rather than tightened at the category level.

This section proposes one operationalization, *handoff rate*, paired with a *handoff-appropriateness audit* without which the metric cannot serve as a primary outcome. The category is the citable contribution; the operationalization is offered as a research-program proposal awaiting Phase-1 validation.

### 6.1 Handoff Rate (Operationalization)

A session is counted as a *handoff* if the system surfaced one or more named human resources during the session and the user's behavior in the session's later half moves toward that resource via an unprompted intention statement ("I'll call them," "I'll text my sister," "I'll bring this to my therapist Thursday"). A no-conversion outcome is tracked separately: sessions in which the user reaches an articulation outcome (named a modality, named a level of care, named a specialty to ask about) without a within-session handoff intention. The tri-valued session outcome is therefore: handoff / served-without-handoff / disengaged-frustrated.

A population-bias caveat: handoff rate is self-report-anchored, so a user who cannot safely emit a handoff intention (most importantly the coercive-control IPV user on a monitored device) is structurally invisible to the metric and is recorded as *served-without-handoff* or *disengaged-frustrated*. Until a non-handoff audit pathway operates, the metric is structurally blind to the IPV stratum.

Denominator: handoff rate is computed over *handoff-eligible* sessions, defined as sessions where either (a) the presentation crossed an acuity threshold under the imminent-risk SOP, or (b) the user explicitly asked about a human resource. Sessions ineligible (low-acuity articulation work that resolves without handoff appropriately) are excluded. This closes a denominator-inflation gaming mode: a system optimizing handoff rate over *all* sessions would have incentive to push low-acuity work toward acuity-threshold framings, converting served sessions into handoff sessions inappropriately.

Three construct-validity limits qualify the metric: it is a process indicator rather than an outcome (it does not measure downstream contact or clinical benefit, which the §3.1 patient-portable architecture deliberately does not measure); it is not an articulation-quality measure (two systems with the same handoff rate can produce articulation outputs of different fidelity); intent statements under distress are weak behavioral predictors (Stanley and Brown 2012 [36]; Drew 2001 [37]; Jobes 2016 [38]). The metric tracks a process state, not behavior.

### 6.2 Handoff-Appropriateness Audit and Defense-of-Record

Handoff rate is gameable in three ways. Denominator inflation is addressed above. The other two operate on the numerator side.

The first numerator-side gaming mode is **premature surfacing**. A handoff-maximizing system can surface 988 / DV hotline / "call your therapist" inappropriately early in a session. Clinical concerns: iatrogenic alarm response and dissociation in trauma populations (the trauma-informed-care framework's primary concern with unsolicited resource-surfacing); IPV-specific endangerment if the device is monitored (premature surfacing of DV hotlines, escape-plan vocabulary, or shelter information on a surveilled device can directly increase risk); erosion of calibration trust; help-seeking-stigma pathway (Henderson et al. 2013 [39]; Schomerus et al. 2012 [40]; Clement et al. 2015 [41]).

The second is **intention-elicitation**. A system prompt could be tuned to elicit verbal "I'll call them" intentions cheaply ("would you call them?" exploits yes-bias).

The defense across these is a handoff-appropriateness sub-metric, computed as a clinician-rated audit on a sample of handoff sessions, scoring whether the resource was correctly fitted and whether the elicitation was unprompted. Raw handoff rate without an appropriateness audit cannot serve as a primary outcome. The pair must be reported together or neither should be reported.

The §6.2 gaming-mode analysis is *adversarial reward-shaping* rather than *reward-gaming on observed deployed metrics* (Krakovna et al. 2020 [15]). Goodhart [16] applies, and the gaming modes are *adversarial Goodhart* variants (Manheim and Garrabrant 2018 [17]). The audit creates a recursive Goodhart risk (once the rubric is published, it becomes the new optimization target); periodic rubric revision, blind raters across deployments, and stratified red-teaming (Perez et al. 2022 [22]) are research programs the regime needs to specify, not treat as solved. Shah et al. 2022 [21] predicts that systems optimized against handoff rate develop the misgeneralized goal of "elicit handoff intentions" rather than "produce articulation that helps users"; the gaming defenses address symptoms rather than cause. The only durable address is direct articulation-quality measurement (§10, item 3). The metric is proposed as an outer-alignment *evaluation target* for system-prompt-level optimization against a frozen base model; using handoff rate as an RLHF reward signal would face inner-alignment risks (Hubinger et al. 2019 [18]: mesa-objective divergence in deployment).

**Defense-of-record requirement**. The deployment inherits its base model's RLHF-induced behaviors (Casper et al. 2023 [20]). The base-model-layer gap (§4.4(iv)) is the regime's open requirement: a regime-conformant deployment must specify at least one deployment-side mitigation as a defense-of-record (turn-budget cap on long sessions in IPV/SI/SMI tiers; runtime accommodation-pattern monitoring; anti-sycophancy fine-tuning; or base-model substitution). The reference implementation's specific defense-of-record selection and adequacy are reviewed at the §5 clinician audit.

### 6.3 Phased Audit Specification

The audit is a two-phase commitment: a formative phase that stabilizes the rubric on a small unstratified sample with two licensed raters and no κ target, and a stratified phase that achieves a power-adequate κ confidence interval through deliberate over-sampling of low-base-rate, high-stakes strata (IPV, acute SI, mania, psychosis). Reporting rule: handoff rate and appropriateness scores are released as a pair, never separately, and Phase 1 is never reported as if it were Phase 2. A regime whose success metric requires clinician-rated audit cannot be evaluated by a single operator alone, and the cost of getting evaluation right is part of the regime specification, not an implementation detail.

### 6.4 Relation to Existing Instruments

The handoff-rate / appropriateness-audit pair is upstream of and orthogonal to two existing measurement traditions. VERA-MH [42] evaluates suicide-risk-detection performance in mental-health LLMs; handoff rate evaluates whether the system effectively bridges to a human resource. Both measure different things and a regime-compliant deployment should report both. Stacey et al.'s 2024 Cochrane review [14] provides validated outcome instruments for related constructs (knowledge gain, decisional conflict, value-congruence) that future articulation-quality studies could adapt. PAM [12] is a longitudinal trait-level scale; the relationship between within-session handoff and PAM trait change is at most a longitudinal-design hypothesis.

---

## 7. Limitations, Anticipated Objections, and Population-Harm Risks

### 7.1 What This Paper Does Not Claim

The paper does not claim that the regime obviates clinical evaluation; that articulation reliably generalizes across cultural, linguistic, and resource contexts without re-grounding; that handoff rate has been validated against clinical outcomes; that any external operator has yet adopted the regime; or that the prior-art finding rules out close-related work the authors missed.

### 7.2 Single-Deployment and Single-Author Limitations

The reference implementation is the authors', and the analysis of the implementation is by the authors. A second-source clinician audit is committed as specified in §5 and §8.4. Trajectory-level evidence is deferred to future work conducted under prospective IRB review.

### 7.3 Geographic, Linguistic, and Care-System Scope

The reference implementation operates in U.S. English (with partial coverage in another language in safety-critical paths) and against the U.S. mental-health resource landscape. Modality vocabulary, credential structure (LCSW / LMFT / LPC etc. are U.S.-specific), level-of-care names (PHP / IOP / ASAM levels are U.S.-specific), and crisis-line numbers are U.S.-specific. Re-implementations against the NHS, Canadian provincial systems, EU national systems, or other Asian mental-health resources would test whether the regime generalizes.

### 7.4 Population-Harm Risks and Structural Limits

The §3.4 strata enumerate where articulation is contraindicated; this section names harm pathways at the *category* level. The acute case is covered by the deployment-pause posture and the imminent-risk SOP; SMI, low-literacy, and cross-cultural cases are documented gaps.

**IPV lethality vocabulary integration is partial.** The reference implementation includes a strangulation screen at first physical-violence disclosure and names strangulation as a homicide predictor when the user confirms (Glass et al. 2008 [32]: OR 6.70 attempted, 7.48 completed; non-fatal strangulation is the strongest single predictor of subsequent IPV homicide), with regression coverage in the rule-coverage CI suite. The implementation does *not* yet integrate the remaining Campbell Danger Assessment 2009 items (firearms-in-home, escalation indicators, weapon-threats history, jealousy/control items, prior near-fatal injury). Full DA integration is a checkpoint for the §5 audit and corresponding SOP update.

**Vocabulary-bounding produces structural exclusion, not edge-case oversight.** §3.3 gates vocabulary on three institutional structures (referral directories, credentialing bodies, payor billing). Star (1991) [6] predicts that any closed institutional vocabulary reproduces the IPV-class gap for populations whose distress register is not in the institutional lexicon. The §3.4 risk list is the structural output of the §3.3 choice, not a list to fix one item at a time.

**A clinician-side externality.** When a user arrives at intake having been articulated by the system, the clinician engages AI-mediated medical vocabulary in place of the lifeworld report. Mishler [9] reads this as voice-of-medicine suppression performed *upstream* of the clinical encounter. Articulation-quality measurement should engage clinician-side outcomes (alliance, intake friction, diagnostic accuracy of subsequent assessment) alongside patient-side ones.

**Cultural fit beyond Western individualism.** Property 3 presupposes individual patient agency in help-seeking. In Confucian-influenced and other collectivist contexts, family-mediated articulation (a parent, spouse, or eldest sibling holding help-seeking authority) is the modal pattern; the regime category travels less cleanly than the U.S. operationalization implies.

**Re-traumatization through phenomenological labeling.** For a trauma survivor for whom "flashback" is novel and clinical, the labeling moment can be re-traumatizing or destabilizing. A regime instance should pace labeling against signaled familiarity and treat first-introduction of a trauma label as a TIC-style choice-and-predictability moment.

**Mandatory-reporting-equivalent obligations.** Articulation surfaces (child abuse, elder/dependent-adult abuse, IPV with a child in home, human-trafficking) that licensed clinicians have reporting obligations on. An AI is not a mandated reporter, but a deployment that surfaces these and does nothing structurally is operating in a moral grey area. The regime should specify reporter-pathway-explicit framing.

### 7.5 Anticipated Objections

**7.5.1 Liability laundering.** "By design-refusing provider recommendation you push the failure mode onto the user." The regime accepts liability for the quality of the articulation (whether the modality, credential, level-of-care vocabulary supplied is correct and appropriate to the presentation); this is what the §6 appropriateness audit is for. The regime does not absorb responsibility for the quality of providers the user subsequently selects, because that work is performed by existing referral systems with their own quality-control infrastructure.

**7.5.2 Unsupervised triage by another name.** "Telling a user 'this sounds like the kind of thing CBT is built for' is implicit symptom-to-diagnosis triage." The §3.3 three-tier distinction draws the line at fit-claims about the user's condition versus naming candidate frames. "DBT was developed for emotion-regulation difficulty" is a statement about DBT, not about the user. "You have BPD" is a statement about the user. The line is operationally fuzzy at the margin and the appropriateness audit (§6.2) is the empirical check that the line is being walked.

**7.5.3 The "unclaimed regime" framing is convenient.** Limbic Access with a fork-and-decouple change becomes the sixth regime, so "currently unclaimed" is a calendar fact, not a regime-defining property. This is the strongest form of the objection. Closest-neighbor players have publicly-positioned business arrangements that make adopting the three-property conjunction non-trivial: switching cost from system-coupled to patient-portable output, NHS / payer audit-trail expectations that pull toward closed pipelines, brand and clinical-validation positioning that does not advertise unfiltered front-door entry, revenue-model fit (the regime is not engagement-monetizable). The non-alignment argument is itself defeasible: a closest-neighbor with a strategic shift toward patient-owned literacy would falsify the prediction, and we would treat that as confirmation that the regime is real and adoptable, not as refutation. A non-commercial deployment under donor or grant funding is the deployment shape best-positioned to ship it first because it is the shape least exposed to the commercial-alignment pressures above.

**7.5.4 In-scope population is not the §1.1 volume population.** §7.4 excludes low-literacy, non-Western-somatic, SMI, severely cognitively impaired, minors, and acute-crisis users. The intersection (adults with internet, literacy, English fluency, distress sufficient to seek help, no current clinician, in a region where human navigators are scarce) is a narrow subset of the population the §1.1 OpenAI flag-rate figure spans. Acknowledged. The §1.1 figure is a directional signal that mental-health-relevant conversations on general LLMs are non-zero; the regime addresses a sub-population of that demand. Sizing the in-scope subset directly is future work; pending that, the claim is that the subset exists and is materially served by no current deployment.

### 7.6 Regulatory Fit

Five 2025–2026 U.S. state statutes (Illinois HB 1806, Nevada AB 406, Utah HB 452, California SB 243, New York's AI companion safeguards) restrict AI mental-health deployment along axes the regime's three properties prima facie respect more naturally than the closed-clinical or open-companion alternatives, because the regime explicitly refuses provider recommendation and refuses fit-claims about the user's condition. Statutory carve-out for "patient-side literacy AI" would clarify deployability for the regime as a category. Detailed statute-by-statute analysis is deferred to legal review.

---

## 8. Ethics and Broader Impact

### 8.1 Conflict of Interest

Front-loaded per AIES 2026 position-track norms: the authors developed and operate the reference implementation discussed in §5, which is free to users and not a source of commercial revenue (open-source under permissive license for code, restricted-use license for safety-critical prompt sections per [anonymous companion]). The authors have no employment relationship with any named comparator system or model provider and seek non-commercial donor and grant funding for continued operation. No institutional, foundation, or commercial funding for this paper or the reference implementation as of submission.

### 8.2 Broader Impact

If the regime is adopted, the most likely positive impact is that some fraction of users currently routing mental-health-relevant conversations to general-purpose LLMs route instead to a system *designed* for the use case, with safety-section retention on fork, explicit refusal to substitute for clinical care, and the success metric of handoff rather than retention. The most likely negative impact is that the regime is implemented poorly by an actor without the governance scaffolding of [anonymous companion]; the failure mode is the NEDA Tessa case repeated. The combined publication of the regime definition and the governance pattern under restricted-use license is intended to mitigate this.

### 8.3 Equity Considerations

The articulation regime presupposes a baseline of literacy, language fluency, and cognitive engagement that is not universal. Populations excluded by these assumptions (§7.4) are exactly the populations that human navigators in well-funded systems serve well; in a population where human navigation is scarce and AI articulation is the only option, the regime's deployment must include explicit fallback to "this conversation should be with a human" with the appropriate human resource named.

### 8.4 Data Ethics and Deployment Posture

Session storage is local-only, end-to-end encrypted with a browser-held key, and not transmitted off the user's device; telemetry is metadata-only. The deployment operates as a public adult-self-attest (18+) preview under standing conditions while named gaps remain open: risk-band restriction (the deployment does not advertise itself as ready for users at the IPV-acuity tier or the active-SI-with-plan tier; when acuity-recognition fires for these tiers, it routes to the relevant hotline at the first signal rather than performing extended articulation); incident-log review (any incident matching the §4.4(iv) base-model-layer failure-mode shape triggers immediate pause pending clinical review). The substantive pause-trigger is the §5 clinician audit.

### 8.5 Funding and Sustainability

The articulation regime is structurally incompatible with engagement-monetized consumer-AI funding. The intended posture is donor-and-grant-supported operation under a U.S. 501(c)(3) structure (formation in progress). The Crisis Text Line / Loris.ai episode [43] is binding cautionary precedent: conversation data from a mental-health service cannot be commercialized without breaking the trust that makes the service usable.

---

## 9. Conclusion

The bifurcation of the AI mental-health landscape into closed-clinical and open-companion has been the field's organizing framing through the early 2020s. The framing is incomplete. A user who is distressed enough to recognize that something is wrong, who does not yet know what kind of help they need, and who currently routes to a general-purpose LLM or to nothing, defines a need that the five existing regimes do not collectively serve.

*Articulation skill* names this gap as a regime, defines it by three required properties plus a scope-recognition constraint plus a deployment-side defense-of-record requirement, distinguishes it from seven closest neighbors, and points at one open-source partial reference implementation at the architectural level only. The primary contribution is the joint construction of two coupled elements: the §3 three-property regime, testable against any candidate mental-health AI system; and the §6 anti-engagement criterion category, portable to any public-good consumer AI and operationalized within the mental-health AI vertical via the regime. *Handoff rate* is offered as one operationalization of the category, awaiting Phase-1 validation.

The regime *definition* stands independent of the §5 clinician audit and the Phase-1 audit. What is contingent on those events is whether the *reference implementation* counts as a regime instance once the SMI / low-literacy / cross-cultural scope-recognition gaps are or are not closed. The position-paper contribution does not stand or fall on the audit; the reference-implementation-as-regime-instance claim does.

---

## 10. Future Work

Three directions are deferred. (1) **Clinical adoption study**: the handoff-rate / handoff-appropriateness pair, audited per §5, would give a per-session clinical validity check that articulation outputs are in fact actionable by the user's downstream clinician. (2) **Cross-cultural and cross-system grounding**: re-implementing the regime against NHS, Canadian provincial systems, EU national systems, and other Asian mental-health resources would test whether it generalizes. (3) **Articulation-quality measurement**: a small-N clinician-rated quality study against deidentified transcripts (with consent and prospective IRB review) would be a feasible first step toward direct measurement of articulation quality beyond the handoff-rate proxy. Minimum design parameters: n ≈ 30 deidentified transcripts; two licensed-clinician raters per transcript with crisis-intervention experience; rubric dimensions covering modality-fit, credential-fit, level-of-care-fit, vocabulary appropriateness, and downstream-actionability for a hypothetical receiving clinician; success criterion at the rubric level (Cohen's κ ≥ 0.6 on each dimension as a feasibility floor). Triangulation against the Cochrane CD001431 instrument family (Decisional Conflict Scale, SURE, Preparation for Decision Making) and PAM longitudinal design are research-positioning items for revision.

---

## Acknowledgments

The authors thank one psychiatrist and one clinical psychologist who independently reviewed the framing developed in this paper and endorsed the deployment-illustration positioning of §5. The reviewers' names are withheld for double-blind review and will be acknowledged by name in the camera-ready version with their permission. Their review does not constitute the §5 clinician-of-record audit, which remains an outstanding commitment under the standing conditions in §8.4.

---

## References

[1] Torous, J. et al. (2018) *Digital phenotyping in psychiatry*. JMIR Mental Health.

[2] Olawade, D.B., Wada, O.Z., Odetayo, A., David-Olawade, A.C., Asaolu, F., Eberhardt, J. (2024) "Enhancing Mental Health with Artificial Intelligence: Current Trends and Future Prospects." *Journal of Medicine, Surgery, and Public Health* 3:100099. DOI: 10.1016/j.glmedi.2024.100099.

[3] National Institute for Health and Care Excellence (2024) Early Value Assessment HTG756: Digital front door technologies for NHS Talking Therapies.

[4] OpenAI (2025) *Strengthening ChatGPT's Responses in Sensitive Conversations*. 2025-10-27.

[5] U.S. Substance Abuse and Mental Health Services Administration (2024) *2023 National Survey on Drug Use and Health*.

[6] Star, S.L. (1991) "Power, technology and the phenomenology of conventions: On being allergic to onions." In J. Law (ed.), *A Sociology of Monsters*, Routledge. Also Star, S.L. (1991) "The sociology of the invisible: The primacy of work in the writings of Anselm Strauss." In D. Maines (ed.), *Social Organization and Social Process*, Aldine de Gruyter.

[7] Strauss, A. (1985, 1988, 1993) Articulation work papers; collected in *Continual Permutations of Action* (1993).

[8] Schmidt, K., Bannon, L. (1992) "Taking CSCW seriously: supporting articulation work." *CSCW: An International Journal* 1.

[9] Mishler, E.G. (1984) *The Discourse of Medicine: Dialectics of Medical Interviews*.

[10] Kleinman, A. (1978, 1980, 1988 *The Illness Narratives*, 1995 *Writing at the Margin*).

[11] Nutbeam, D. (2000) "Health literacy as a public health goal." *Health Promotion International* 15(3).

[12] Hibbard, J.H. et al. (2004) "Development of the Patient Activation Measure (PAM)." *Health Services Research* 39.

[13] Elwyn, G. et al. (2012) "Shared decision making: a model for clinical practice." *J Gen Intern Med* 27(10).

[14] Stacey, D. et al. (2024) "Decision aids for people facing health treatment or screening decisions." Cochrane Database Syst Rev CD001431, sixth update.

[15] Krakovna, V. et al. (2020) "Specification gaming: the flip side of AI ingenuity." DeepMind blog and curated examples list.

[16] Goodhart, C.A.E. (1975) "Problems of monetary management: the U.K. experience."

[17] Manheim, D., Garrabrant, S. (2018) "Categorizing variants of Goodhart's Law." arXiv:1803.04585.

[18] Hubinger, E. et al. (2019) "Risks from learned optimization in advanced machine learning systems." arXiv:1906.01820.

[19] Sharma, M. et al. (2023) "Towards understanding sycophancy in language models." arXiv:2310.13548.

[20] Casper, S. et al. (2023) "Open problems and fundamental limitations of reinforcement learning from human feedback." arXiv:2307.15217.

[21] Shah, R. et al. (2022) "Goal misgeneralization: why correct specifications aren't enough for correct goals." arXiv:2210.01790.

[22] Perez, E. et al. (2022) "Discovering language model behaviors with model-written evaluations." arXiv:2212.09251.

[23] Heinz, M. et al. (2025) Therabot RCT, *NEJM AI*.

[24] Habicht, J. et al. (2024) "Closing the accessibility gap to mental health treatment with a personalized self-referral chatbot." *Nature Medicine*.

[25] IESO Digital Health (2024) Non-inferiority study, NHS partnership.

[26] AI Incident Database (2023) Incident on NEDA Tessa chatbot.

[27] *Garcia v. Character Technologies, Inc.*, M.D. Fla. 6:24-cv-01903; tort cluster settled 2026-01-07.

[28] Wisniewski, H. et al. (2022) "The role of digital navigators in promoting clinical care and technology integration." *Lancet Digital Health*.

[29] Yanos, P.T., Roe, D., Lysaker, P.H. (2010) "The impact of illness identity on recovery from severe mental illness." *American Journal of Psychiatric Rehabilitation* 13(2).

[30] Lally, S.J. (1989) "'Does being in here mean there is something wrong with me?'" *Schizophrenia Bulletin* 15(2).

[31] Posner, K. et al. (2011) "The Columbia–Suicide Severity Rating Scale: initial validity and internal consistency findings from three multisite studies." *American Journal of Psychiatry* 168(12):1266–1277. Scale © 2008 Research Foundation for Mental Hygiene.

[32] Glass, N. et al. (2008) "Non-fatal strangulation is an important risk factor for homicide of women." *Journal of Emergency Medicine* 35:329–335.

[33] Rollwage, M. et al. (2023) Limbic Access user-experience study, *JMIR AI*.

[34] *Raine v. OpenAI*, San Francisco Superior Court, filed 2025-08-26; coalition filings 2025-11-06.

[35] Sakata, et al. (2025) AI-induced delusional state case series, *Psychiatric News*; *JMIR Mental Health* AI-delusional-state case reports 2025.

[36] Stanley, B., Brown, G.K. (2012; 2018 JAMA Psychiatry) Safety Planning Intervention.

[37] Drew, B.L. (2001) "Self-harm behavior and no-suicide contracting in psychiatric inpatient settings." *Archives of Psychiatric Nursing* 15(3).

[38] Jobes, D.A. (2016) *Managing Suicidal Risk: A Collaborative Approach* (CAMS).

[39] Henderson, C., Evans-Lacko, S., Thornicroft, G. (2013) "Mental illness stigma, help seeking, and public health programs." *American Journal of Public Health* 103(5).

[40] Schomerus, G. et al. (2012) "Evolution of public attitudes about mental illness." *Acta Psychiatrica Scandinavica* 125.

[41] Clement, S. et al. (2015) "What is the impact of mental health-related stigma on help-seeking?" *Psychological Medicine* 45.

[42] Belli, L., Bentley, K. et al. (2025) VERA-MH benchmark, arXiv 2510.15297.

[43] Politico (2022); JMIR (2025) reporting on Crisis Text Line / Loris.ai.
