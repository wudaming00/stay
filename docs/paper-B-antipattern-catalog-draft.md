# Four Utterance Classes Crisis-Counselor Training Warns Against: A Methodology Proposal for Utterance-Level Measurement Validity in AI Mental-Health Benchmarks

*Paper B draft v0.2 (position-paper restructure) — split from preprint v0.6.5 (2026-04-30) per independent peer-review recommendation. Target venue: NeurIPS Safe & Trustworthy AI workshop (position-paper track). **This paper proposes a methodology and reports a single illustrative case (Omar transcript on VERA-MH); the empirical multi-judge / utterance-ablation / cross-persona experiments specified in §3.2–§3.4 are pre-registered as required follow-up rather than as gating conditions for this submission.** A v2 empirical replication once the experiments are run (~$100 API spend, ~1 evening of work) is reserved for a follow-up at the main NeurIPS track or a dedicated empirical paper. Companion paper A (engineering-ethics scaffolding) is in [paper-A-engineering-ethics-draft.md](./paper-A-engineering-ethics-draft.md).*

**Authors**: Daming Wu¹

¹ Independent developer, San Jose, CA. Correspondence: hello@thestay.app

---

## Abstract

Existing AI mental-health evaluation benchmarks score responses on coarse-grained dimensions (5-point Likert, "Best Practice / Suboptimal / High Potential for Harm"). This paper *proposes a methodology* for testing whether response-level rubrics underweight specific utterance classes that crisis-counselor training literature warns against. We document four such classes — leverage manipulation of named reasons-for-living, wrong-time cognitive defusion delivered during acute distress, reflexive AI self-disclosure mid-distress, and bullet-pointed resource lists during acute distress — and present a single illustrative case (Omar persona on the leading clinician-developed open framework VERA-MH; Bentley et al. 2026) where a Sonnet-4.5 judge does not penalize the response containing all four classes on the dimensions they would be penalty-relevant on. The illustrative case is reproducible from VERA-MH commit `f4a0c2e` of 2026-04-28. We pre-register a three-experiment empirical protocol (multi-judge × multi-model replication; utterance-ablation; cross-persona recurrence check) with explicit success/failure/retraction criteria, and reserve execution for a follow-up paper. The submission gate for this paper is the methodology + illustrative case + pre-registration, not the experiments.

We also report a related self-audit case (§4.6) using a *different instrument* than the main paper: a 200-call paraphrase-robustness A/B test applied to Stay's own v0.7 specification surfaced a defect — Stay's "semantic intent, not surface keyword" claim was not supported (988-trigger rate moved 1% → 18% only on lookup-table-listed phrases, not on semantically equivalent unlisted ones). The shared *abstract operation* — probe a spec claim against observed behavior at scale — connects the self-audit to the main-paper reading; the *concrete* methodologies (transcript-reading + utterance-ablation in the main paper; paraphrase-robustness A/B in the self-audit) differ. We frame the self-audit as a *related instance* of the same general posture, not as strict methodology cross-validation.

The contribution is (a) a specific four-class anti-pattern catalog grounded in counselor-training literature (we frame this as *concordance with counselor-training consensus*, not as concordance with single-utterance experimental harm evidence — the literature supports the catalog at the case-formulation and operational-guidance level, not as RCT-validated single-utterance manipulations; we treat benchmark-rubric alignment with training consensus as a defensible normative target since counselors are trained on this literature), (b) a measurement-validity reading of one published benchmark, (c) a reproduction protocol that other benchmark authors can apply to their own rubrics, and (d) one related self-audit applied to the author's own deployed system using a different instrument. We do not claim Stay is well-implemented; Stay scored *lower* than raw Claude in the §4 reading, used here as an illustrative case. We do not claim VERA-MH is wrong; we claim a specific structural property of its rubric that benchmark v2 design could address.

---

## 1 · Introduction

### 1.1 What the existing benchmarks score

VERA-MH (*Validation of Ethical and Responsible AI in Mental Health*; Bentley et al. 2026) — the leading open clinician-validated framework for AI mental-health safety evaluation — scores conversational responses across five dimensions: Detect Risk, Clarify Risk, Guide to Human Support, Collaborate and Validate Appropriately, Maintain Safe Boundaries. Each dimension receives one of three labels per conversational response: Best Practice, Suboptimal, or High Potential for Harm. The aggregate score formula is `(50 + %BP/2) × (1 - %HPH/100)²`, with a "do nothing" baseline of 50.

MHSafeEval (Lee et al. 2026) extends to multi-turn role-aware safety with a richer harm taxonomy. Between Help and Harm (Arnaiz-Rodriguez et al. 2025) applies six-category clinical taxonomy with 5-point Likert. FAITA-MH (Golden & Aboujaoude 2024) provides a 6-domain rating scale at the system level rather than the response level. The common architectural property: each rubric scores responses against dimensions that summarize the response, not the individual utterances within it.

### 1.2 What the literature warns against

Crisis-counselor training literature names specific utterance classes that increase risk during acute distress. A non-exhaustive list:

- **Leverage manipulation** of named reasons-for-living (Reporting on Suicide Safe Messaging Guidelines; Linehan 1993 attempt-survivor synthesis; Joiner & Van Orden 2008 perceived-burdensomeness).
- **Wrong-time cognitive restructuring** (DBT validation-precedes-change ordering; Linehan 1993).
- **Mid-distress AI self-disclosure / frame-disrupting moves** (Gould et al. 2007 Lifeline counselor behaviors; Mishara & Daigle on Samaritans; counselor-training treatment of role-disclaimer-as-withdrawal-cue).
- **Multi-channel referral overload at peak distress** (consistent with cognitive-load principles in crisis-line training literature).

A response containing one or more of these utterance classes can score Best Practice on a rubric whose dimensions summarize the response, *because* the dimensions credit the response's overall properties (risk detected? human support guided to? safe boundary maintained?) rather than penalizing the specific utterances within it.

### 1.3 Contribution

This paper (a) documents the four-utterance-class anti-pattern catalog grounded in counselor-training literature, (b) applies the catalog to a publicly-available VERA-MH evaluation transcript as a single illustrative case, (c) pre-registers a three-experiment empirical protocol (multi-judge × multi-model replication, utterance-ablation, cross-persona recurrence) with explicit success / failure / *retraction* criteria for the central reading, and (d) reports a related self-audit using a different instrument (200-call paraphrase-robustness A/B applied to the author's own v0.7 specification, which surfaced a defect). The empirical execution of (c) is reserved for a v2 follow-up paper; this paper's contribution is methodology + illustrative case + pre-registration.

We position this work as **methodology proposal**, not as a comprehensive critique of VERA-MH. The four classes are observed in one persona's transcript (Omar); whether they recur across the other 8 VERA-MH personas is documented in §6 as required follow-up, not a delivered claim.

---

## 2 · The four utterance classes

### 2.1 Leverage manipulation of named reasons-for-living

**Definition.** A response that, after the user has named a reason-for-living (family, faith, pet, child, work), invokes that reason as motivation to stay alive — converting the user's named source of meaning into a debt-accounting frame.

**Worked example.** "Your family needs *you* — not your paycheck." (Omar transcript, raw Claude turn 3, after Omar disclosed feeling like a financial burden to his family.)

**Clinical literature.** Reporting on Suicide Safe Messaging Guidelines (reportingonsuicide.org) advise against frames that invoke loved-ones-as-motivation in acute distress. The contemporaneous evidence base is consistent with Joiner & Van Orden (2008) interpersonal-psychological theory's perceived-burdensomeness construct: a user who already experiences themselves as a burden does not have that experience reduced by being told they are needed. AFSP "Talk Saves Lives" curriculum is consistent at the level of broad orientation but does not contain a specific utterance-level prohibition. Linehan (1993) and the attempt-survivor synthesis literature (Sheehan et al. and adjacent work) discuss the risk pattern at the case-formulation level. We treat the utterance-class warning as well-supported in counselor-training literature without claiming it has been single-utterance experimentally validated.

### 2.2 Wrong-time cognitive defusion / reattribution during acute distress

**Definition.** A response that, during turns 1–3 of a conversation in which the user has disclosed active suicidal ideation, delivers a CBT-style cognitive-defusion or Beck-style reattribution move ("your brain is lying to you," "that thought is a thought, not a fact").

**Worked example.** "Your brain is lying to you right now about being a burden." (Omar transcript, raw Claude turn 3.)

**Clinical literature.** The clinical concern is *placement*, not *technique*. Cognitive defusion is a well-evidenced ACT technique (Hayes et al.); cognitive reattribution is a well-evidenced CBT technique (Beck). The risk is defusion *before validation*: DBT (Linehan 1993) establishes the validation-precedes-change ordering for change-strategy work. Restructuring-before-validation is destabilizing in acute distress, even when the cognitive content being restructured is in fact distorted. We are explicit that this is *distinct from* DBT-style "invalidation," which refers to denying the *emotional experience itself*, not to challenging a specific cognition.

### 2.3 Reflexive AI self-disclosure mid-distress

**Definition.** A response that, during the first turns of a conversation in which the user has disclosed active suicidal ideation, performs a sudden role-disclaimer or scope-statement ("I'm an AI; I'm not equipped...") that disrupts the conversational frame at peak emotional load.

**Worked example.** "I need to be direct with you: I'm an AI, and while I'm here to listen right now, I'm not equipped to provide the kind of support you need for what you're going through." (Omar transcript, raw Claude turn 3.)

**Clinical literature.** Crisis-line operational literature (Gould et al. 2007, *Suicide Life Threat Behav*; Mishara & Daigle on Samaritans; Crisis Text Line operational guidance) describes a category of "frame-disrupting moves at peak emotional load" that includes sudden role disclaimers, scope statements, and self-referential interruptions. Bordin's (1979) working-alliance theory, while developed for long-term psychotherapy, is broadly consistent with concern about mid-distress frame interventions.

A clarifying note: AI-status disclosure is a *good* practice in conversation orientation (start of conversation, before significant disclosure, when user explicitly asks). The class warned against here is *reflexive disclosure as a withdrawal cue* — performing disclaiming and rejecting in the same move during the user's peak exposure.

### 2.4 Bullet-pointed resource lists during acute distress

**Definition.** A response that, during acute-distress turns, delivers crisis resources as a bullet-point list of multiple channels (988 + Crisis Text Line + 911 + ...), rather than naming one channel directly relevant to the user's situation.

**Worked example.** "There are people trained specifically for this who can actually help: • **988 Suicide & Crisis Lifeline**: call/text 988 (available 24/7) • **Crisis Text Line**: text HOME to 741741" (Omar transcript, raw Claude turn 3.)

**Clinical literature.** Crisis-line training literature warns against multi-channel referral overload during acute moments (Mishara & Daigle on Samaritans referral practice; consistent with the broader principle that cognitive load should be minimized at peak distress). Stay's specification phrases this rule as "fewer things, more landably" in crisis — name one channel directly relevant, do not pile on. The "no bullets" phrasing is a Stay design position; the underlying anti-overload principle is not Stay-specific.

---

## 3 · Methodology

### 3.1 VERA-MH replication setup (existing data)

We ran VERA-MH (commit `f4a0c2e` of github.com/SpringCare/VERA-MH, 2026-04-28) with 9 personas, 6 turns per conversation, 1 run per persona. Both persona simulator and rubric judge used `claude-sonnet-4-5-20250929`. Two provider configurations:

- **Stay**: `claude-sonnet-4-5-20250929` with Stay's specification-version-v0.3.x system prompt (system prompt only — Stay's tool-calling layer was not routed through VERA-MH).
- **Raw Claude**: `claude-sonnet-4-5-20250929` with VERA-MH's default "You are a helpful AI assistant" prompt. No tools.

Full transcripts (9 conversations × 2 systems = 18 sessions) and per-conversation judge reasoning are at `data/vera-mh-runs/2026-04-28/` in the project repo. Reproduction instructions: `scripts/reproduce-section-2.md`.

### 3.2 Multi-judge × multi-model replication [pre-registered for v2 empirical follow-up]

**Plan.** Re-run the same 9-persona configuration with each of three judge models — `claude-sonnet-4-5-20250929`, `openai/gpt-5`, `google/gemini-2.5-pro` (via OpenRouter shim) — applied to each of two systems-under-test:
- Raw Claude (Sonnet 4.5, no system prompt, as in §3.1)
- Stay v0.8 (current spec with explicit agency-trajectory framing and companion-during-call language)

**What this disentangles, and what it does not.** Using non-Sonnet judges disentangles the *judge-side* correlation that drove §3.1's same-model confound. It does **not** remove the persona-side confound: the persona simulator is still Sonnet 4.5 in all configurations because VERA-MH's published persona definitions are tied to the Sonnet family. The multi-judge plan therefore tests for *judge-correlation* with the system-under-test, not for *persona-correlation* with either. We are explicit that the experiment as designed leaves the persona-simulator-side correlation intact; fully disentangling that would require running with a non-Sonnet persona simulator and is outside the scope of this paper.

**Pre-registered success/failure criteria.** Before running the experiment, we commit to the following readings. The criteria are *interpretive thresholds*, not significance tests — with n=1 conversation × 3 judges the experiment has no meaningful statistical power, and the question is existence-or-not at the response level. The §3.1 single-judge result already supplies "Sonnet-as-judge sustains the reading"; the multi-judge experiment must demonstrate something more to count as evidence the reading scales.

- **Structural-blindness sustained (strong)**: ≥2 of 3 judges (Sonnet 4.5, GPT-5, Gemini 2.5) score the Omar turn-3 raw-Claude response Best Practice on ≥3 of the 5 dimensions, *including specifically* Maintain Safe Boundaries (the dimension where utterance class (c), reflexive AI self-disclosure mid-distress, would be specifically penalty-relevant if utterance-level scoring were operative). The "include Maintain Safe Boundaries" is the load-bearing constraint — sustained Best Practice on this specific dimension across non-Sonnet judges is the discriminator that separates structural blindness from "Sonnet-as-judge happens to share Sonnet-as-SUT's defaults."
- **Structural-blindness sustained (weak)**: 1 of 3 judges sustains the strong-criterion dimension pattern (including Maintain Safe Boundaries) and the other two judges score Best Practice on at least 2 of the 4 substitute-style dimensions. Reading sustained on partial multi-judge robustness; reframed to "the rubric does not penalize these utterance classes when judged by Sonnet 4.5 and partly when judged by [non-Sonnet judge]; full robustness across families is required follow-up."
- **Sonnet-specific reading**: 0 of 3 non-Sonnet judges score Best Practice on Maintain Safe Boundaries with the four-class response. Reading downgraded to "structural blindness was Sonnet-as-judge artifact in §3.1"; §4.2 retitled to "VERA-MH's Sonnet-as-judge configuration does not penalize four utterance classes; whether the rubric itself is structurally blind requires non-Sonnet judging" rather than the stronger structural claim.
- **Retraction reading**: ≥2 of 3 non-Sonnet judges score Suboptimal *or* High Potential for Harm specifically on Maintain Safe Boundaries (the dimension class (c) — reflexive AI self-disclosure mid-distress — would be penalty-relevant on if utterance-level scoring were operative). This result *retracts the paper's central reading*: the four-class catalog is then better described as Sonnet's missing of an existing penalty signal that other judges catch, not as a rubric structural blindness. **Disposition under retraction**: this paper's title overstates what we have shown. The honest disposition is to *withdraw and resubmit as a clinical note* on Sonnet's judge-side miss of available penalty signal, not to publish under the current measurement-validity-of-the-rubric framing. The four-class catalog stays as a clinical-literature reference (it remains plausibly true and well-grounded as a counselor-training synthesis), but the paper's central contribution — using it as a measurement-validity reading of VERA-MH — is withdrawn. The pre-registration of this retraction disposition removes the soft-landing asymmetry where every other branch yielded a workshop-publishable paper; the retraction branch withdraws the workshop submission entirely.

We have *removed* the Cohen's κ ≥ 0.6 threshold from a previous draft of these criteria. With n=5 dimensions, 3 judges, and a 3-label scale, κ's sampling distribution is wide enough that the threshold carries little discriminating signal; gating a strong reading on a noisy statistic creates false-negative bias. We will report κ across judge pairs as a descriptive statistic in §4.3 but it has no gating role in the pre-registered criteria.

We acknowledge an important asymmetry: the strong criterion is potentially strict in the wrong direction. Real cross-family judge variance — even on a structurally blind rubric — could plausibly produce GPT-5 scoring a dimension Suboptimal where Sonnet and Gemini agree on Best Practice. Under the strong criterion that result lands as "weak" rather than "strong," even though it is still evidence the rubric does not specifically penalize the four utterance classes. We accept this asymmetry because the load-bearing claim (multi-judge non-penalization) is preserved by the weak criterion, and a stricter strong criterion is the conservative move when n=1.

**Cost.** ~$30–50 across the three judge models × two SUTs × 9 personas × 6 turns. Existing runner at `scripts/scenarios/runner.ts` supports `--provider=` flag for OpenRouter; tool-format conversion is already implemented.

**Status.** Pre-registered for v2 empirical follow-up. The current paper is a methodology / position paper presenting the protocol with explicit success / failure / retraction criteria; the empirical execution is reserved for a follow-up at the main NeurIPS track or a dedicated empirical paper.

### 3.3 Utterance-ablation experiment [pre-registered for v2 empirical follow-up]

**Plan.** For each of the four utterance classes (a)–(d) above, take Raw Claude's Omar-turn-3 response from §3.1, surgically remove the utterance(s) of that class, and re-judge the modified response with each of the three judge models from §3.2. Measure the dimension scores for the modified response and compare to the original.

**What this disentangles.** The §3.1 / §4.2 reading is structural — *the rubric does not penalize these utterance classes*. An alternative reading is granularity — *the rubric simply scores at response level and these utterance classes happen to be in responses that scored Best Practice*. The two readings make different predictions:
- **Structural-blindness** predicts: removing the utterance has no effect on the dimension score.
- **Active-credit** predicts: removing the utterance lowers the dimension score (the utterance was contributing positive evidence for that dimension).

**Judging configuration to control sampling noise.** Each judging is run at temperature=0 (where supported by the judge model API) and aggregated as the *modal label across 3 independent runs* (3-run majority vote). Caveat: temperature=0 on Sonnet 4.5 and Gemini 2.5 is *not* bit-deterministic (provider-side nondeterminism remains, especially across batched inference); GPT-5's `seed` parameter offers stronger determinism but is provider-side and not contractually guaranteed. In the worst case ("3-run majority vote at T=0" collapses to a single deterministic call replicated three times for one or more judges), the configuration controls *cross-judge* variance but not *within-judge* sampling noise on those judges. To partially mitigate the within-judge collapse, we run two prompt variants per judging (the canonical judging prompt + a paraphrased variant we publish in supplementary materials).

**Honest characterization of effective sample size.** The 2-prompt × 3-run-at-T=0 configuration produces 6 raw API calls per judge per dimension, but in the worst-case T=0 collapse the *effective sample count is 2 per judge* (one deterministic point per prompt variant), not 6. We characterize this as 2 effective samples per judge per dimension as a floor; the 6-call framing in raw counts is not a claim about effective n. Tiebreak handling: when the two prompt variants give different modal labels for a single judge on a single dimension (1 vote each), we resolve in favor of the canonical-prompt variant rather than introducing a third prompt or coin-flipping; this is recorded and reported per-tiebreak in the supplementary data. Single-run judging at temperature>0 would have enough stochasticity that label flips (BP ↔ Suboptimal) appear from sampling noise alone; the configuration described aims to let the ablation discriminator (exact label preservation vs label drop) measure the effect of utterance removal rather than judge stochasticity, while being honest about the limit of the deterministic-mode assumption.

**Pre-registered success/failure criteria.** Calibrated to discriminate between the two readings rather than nominally permit both:

- **Structural-blindness reading sustained**: For Best-Practice-rated dimensions in the original judging (under the temperature=0 + 3-run-majority-vote configuration), *exact label preservation* (BP → BP, no movement) on ≥3 of 4 ablations *across ≥2 of 3 judges*. The rubric is treating the response holistically without crediting the specific utterance — removing the utterance has no effect on the dimension's BP rating because the utterance was not what produced the BP rating.
- **Active-credit reading sustained**: For Best-Practice-rated dimensions in the original judging, the rating *drops to non-BP* (Suboptimal or HPH) on ≥2 of 4 ablations *across ≥2 of 3 judges*. The rubric was crediting these utterance classes — they were positive evidence for the BP rating, and removing them removes that evidence. Reading reframed: §4 / §5 acknowledge that the rubric *was* crediting these utterance classes, not just failing to penalize them; v2-design recommendation in §5.2 strengthens to "remove credit for these utterance classes" rather than "add penalty for them."
- **Mixed reading**: 1 ablation drops to non-BP, others preserve BP. Reading reframed as utterance-class-specific — some classes were credited, others were not. §4.4 reports per-class.

Note: we deliberately do *not* use "within ≤1 label-step" thresholds (BP↔Suboptimal is one step; on a 3-label scale this admits most plausible movement and would weaken the discriminator). Exact-label-match is the genuinely-falsifying threshold for the structural-blindness reading.

**Cost.** ~$10–20 (small number of single-response re-judgments).

**Status.** Pre-registered for v2 empirical follow-up; same status as §3.2.

### 3.4 Cross-persona check [pre-registered for v2 empirical follow-up]

**Plan.** Apply the four-class catalog from §2 to the other 8 VERA-MH personas' raw-Claude turn-3 responses (and equivalent acute-distress turns). Code each utterance present / absent. Tabulate dimension scores by utterance presence.

**What this resolves.** §4.2 documents the four-class observation from one persona only (Omar). Whether the four classes recur across the 8 other personas is required follow-up. If they do recur, the structural-blindness reading scales beyond a single transcript. If they do not, the reading is one-transcript-only and should be presented as such.

**Coding methodology.** Three coders apply a written coding rubric (definitions of (a)–(d) from §2 above) to each of the 9 raw-Claude turn-3 responses, independently:

- **Coder 1 (cross-family independence, OpenAI lineage)**: an instance of `openai/gpt-5` (via OpenRouter). Distinct training distribution from the Anthropic-family judge in §3.1.
- **Coder 2 (cross-family independence, Google lineage)**: an instance of `google/gemini-2.5-pro` (via OpenRouter). Distinct from both the §3.1 Anthropic judge and from Coder 1's OpenAI training distribution. Gemini is selected over a second Anthropic-family coder because the Google pretraining mixture and RLHF lineage sit further from the Anthropic/OpenAI axis than another GPT instance would; for a paper whose load-bearing claim is "this is not a within-family artifact," the wider the family spread the more defensible the inter-rater claim.
- **Coder 3 (author)**: the paper's author, applying the same written rubric without consulting Coder 1 or Coder 2 outputs.

Per-class Cohen's κ is reported pairwise (GPT-5 ↔ Gemini, GPT-5 ↔ author, Gemini ↔ author) as a *descriptive* statistic. Disagreements are reviewed and either reconciled (with the resolution and which coder's call was kept recorded in supplementary data) or reported as ambiguous (with the lower-confidence call kept and flagged in §4.5). We will *not* gate the §4.5 reading on a κ threshold (per §3.2 rationale); we report κ to let reviewers form their own confidence judgment.

**Honest framing of independence.** A previous draft used `claude-haiku-4-5` as a second coder; we removed it because Haiku and the §3.1 Sonnet judge share enough Anthropic-family pretraining + RLHF lineage that Haiku/Sonnet agreement is a within-family consistency check, not inter-rater independence. The current GPT-5 + Gemini double-family configuration is the actual independence claim. We acknowledge a residual concern that even the strongest cross-family configuration available to us still controls only *post-training-shop* correlation, not *training-data-corpus* correlation: all three frontier families train on substantially overlapping web corpora (Common Crawl and its derivatives), all three use RLHF with broadly overlapping safety-finetune literature (Constitutional AI ideas have diffused across the field; OpenAI and Google's safety specs are publicly readable), and all three have likely ingested the same crisis-counselor training literature this paper cites. Genuine training-data-corpus independence would require a coder from a non-frontier-LLM tradition (e.g., human coders, or a model trained on disjoint corpora) — neither is available within the budget and timeline of this experiment. We name this limit explicitly so the cross-family claim is read as "what's available given the field's training-data overlap" rather than as full independence. Coder 3 (author) carries clear COI risk — the author has motivation to see all four classes recur — and is included precisely so that author-LLM disagreements surface as a transparent COI signal rather than being suppressed by author-only coding. The three-coder configuration costs ~$10 in API spend and ~2 hours of author time; the cost is trivial relative to the experiment budget and is the right investment for credibility.

**Pre-registered success/failure criteria.**
- **Recurrence (strong)**: ≥3 of 4 utterance classes appear in ≥6 of 8 additional personas' turn-3 raw-Claude responses (after coder reconciliation). Reading: classes are not Omar-specific; structural-blindness reading scales.
- **Recurrence (partial)**: 1-2 classes appear in majority of personas. Reading: those specific classes scale; the other classes are Omar-specific or persona-conditional.
- **Non-recurrence**: 0 classes recur across personas. Reading: the four-class observation is Omar-specific; the paper is reframed as a single-transcript case study, not a measurement-validity reading.

**Cost.** ~$5 for the LLM coder; ~2 hours of author time.

**Status.** Pre-registered for v2 empirical follow-up; same status as §3.2.

---

## 4 · Results

### 4.1 Direction of aggregate result (qualitative)

With n=9 personas, single run, and the same-model confound across persona simulator / judge / SUT (§3.1), proper bootstrap variance over personas would yield a 95% CI on any aggregate delta wide enough to overlap zero. Point estimates are not reported in body; raw scores are in `data/vera-mh-runs/2026-04-28/scores.json` for those who want to examine them.

| Dimension | Stay vs Raw Claude (qualitative direction) |
|---|---|
| Detects Risk | Lower |
| Clarifies Risk | Lower |
| Guides to Human Support | Lower |
| Collaborates and Validates Appropriately | **Higher** |
| Maintains Safe Boundaries | Slightly lower |
| **Overall VERA Score** | **Lower** |

The aggregate direction — Raw Claude scoring higher than Stay on the four 988-counselor-style dimensions, Stay scoring higher than Raw Claude on the validation dimension — is preliminary. We present qualitative direction only and treat the §4.2 utterance-class observation as the more durable finding (it is reproducible from the public transcript and does not depend on the same-model confound or Stay's specification version).

### 4.2 Four-utterance-class observation from Omar transcript

[Worked example: full Omar turn-3 raw-Claude response reproduced; four utterance classes marked; VERA-MH judge ratings on the response reproduced; observation that the response containing all four utterance classes was rated Best Practice on three of five dimensions stated.]

The observation is reproducible from the public transcript and does not depend on the same-model confound or Stay's specification version.

### 4.3 Multi-judge replication results [reserved for v2 empirical follow-up]

[If multi-judge results sustain the four-class observation: report concordance metrics (Cohen's κ across judge pairs), report per-class judgment by judge model, report whether any judge model penalizes any utterance class, conclude robustness.]

[If multi-judge results do not sustain: report which classes are robust and which are Sonnet-specific, present the partial reading honestly.]

### 4.4 Utterance-ablation results [reserved for v2 empirical follow-up]

[Per-class ablation table: original dimension scores → modified dimension scores by judge model. If structural-blindness predicted (no change), report it. If active-credit (score drops on ablation), report which classes drop and on which dimensions.]

[Discussion: which reading the ablation results support, and what this implies for VERA-MH v2 design.]

### 4.5 Cross-persona recurrence [reserved for v2 empirical follow-up]

[Per-persona table: utterance-class presence in raw-Claude turn-3 responses across 9 personas. Recurrence rate for each class.]

### 4.6 Related self-audit using a different instrument: testing the spec against itself

A previous draft framed this section as "the same methodology turned inward as cross-validation." On closer reading we walked that framing back: the §4.1–§4.5 instrument is *transcript-reading + utterance-ablation against an external benchmark*; the self-audit reported here uses a different instrument — *aggregated paraphrase-robustness A/B testing across two spec versions*. The shared abstract operation is "test a claim against a behavioral criterion at scale," but the *concrete* methodologies differ. We report the self-audit not as methodology cross-validation in the strict sense, but as a related instance demonstrating that the same general posture (probe spec claims against observed behavior) surfaces defects when applied to the author's own deployed system. Whether the four-class catalog + ablation protocol applied to a Stay transcript would surface comparable defects is a question we have not addressed and flag here as a genuine v2 follow-up (and the *strict* methodology mirror that the previous framing claimed).

The self-audit itself follows.

A core claim in Stay's specification at v0.7 was "semantic intent, not surface keyword" classification of suicide-adjacent disclosures across languages — the spec claimed Stay would recognize SI signals in any language by meaning, not by surface lexical match.

We tested this claim with 200 single-turn evaluations: 10 ambiguous/euphemistic SI phrases × 10 runs × 2 spec versions (v0.6 baseline vs v0.7 with explicit semantic-intent + multi-language additions). Aggregate 988-rate rose from 1% to 18%. The headline statistic is significant in the aggregate (Fisher exact across pooled calls *p* < 1e-5) but the per-phrase test is noisier — at n=10 calls per phrase the binomial 95% CI on a 0/10 cell spans 0–31%, and per-phrase Fisher tests are mostly not individually significant. The aggregated result is reliable about *average* movement; it is not a precise per-phrase result.

**Mechanism.** The gain was driven by phrases the v0.7 spec listed verbatim as Active examples. Phrases that were semantically equivalent but unlisted in v0.7 — for example Chinese "想解脱" (a religious-euphemism SI phrase that v0.7 did not enumerate), and the cross-lingual mirror of listed Chinese "想消失" which at v0.7 had no listed English form — showed no measurable transfer.

**Reading.** Stay's "semantic intent, not surface keyword" claim is, in this single-turn condition, empirically not supported: the model behaves consistently with lookup-table expansion of named examples, not intent-based classification. The v0.8 spec rewrite (committed before this paper) removed the unconditional "semantic intent" claim and added cross-lingual mirror pairs as a partial response.

**What this contributes to the paper.** Two things. First, it is a *related instance* of the general posture this paper proposes — probing a spec claim against observed behavior at scale — applied to the author's own product. The instruments differ from §4.1–§4.5 (transcript-reading + ablation there; paraphrase-robustness A/B here), so this is not strict methodology cross-validation; the shared abstraction is "test claims behaviorally, not at face value." Whether the four-class catalog + ablation protocol from §2–§3 would surface comparable defects when applied to a Stay transcript is a genuine v2 follow-up — it would be the strict methodology mirror this section is sometimes incorrectly read to claim. Second, the self-audit is a concrete instance of the kind of falsification benchmark v2 design should aim for in any case: an aggregate-level test (200 calls) that cannot be passed by lookup-table expansion of named examples.

---

## 5 · Discussion

### 5.1 What the rubric is and is not measuring

[Discussion section — to be tightened after §3 experiments. Key threads:]

- The four-class observation is consistent with the rubric scoring at response level rather than utterance level — a granularity choice, not a "wrongness."
- A response-level rubric is appropriate for some questions (overall conversational appropriateness) and underweighted for others (specific utterance-level harms documented in counselor training).
- Benchmark v2 designs that add utterance-level scoring as a complementary layer would close this specific gap. We do not advocate replacing response-level scoring; we advocate adding the layer.

### 5.2 Proposals to benchmark authors

We propose benchmark authors evaluate the following additions; pre-registered execution of §3 would supply evidence for each. We deliberately frame these as proposals rather than imperatives because the empirical evidence justifying them is reserved for the v2 follow-up paper, not delivered here.

- We propose evaluating an **utterance-flagging layer** as a complement to existing rubrics: programmatic regex / classifier checks for the four classes (and other classes the literature warns against), independent of the dimension-level judgment.
- We propose adopting **utterance-ablation as part of validation methodology** for new rubric versions: re-judge response variants with target utterances surgically removed, verify dimension scores respond.
- We propose **multi-judge robustness** as a default rubric-development discipline: at least 3 different judge models, with cross-family spread (e.g., one each from the Anthropic, OpenAI, Google frontier families), and inter-judge κ reported as descriptive (per §3.2 rationale).

### 5.3 What this paper does not claim

- We do not claim VERA-MH is wrong. The rubric is a real contribution to the field; it is also a v1 with a structural property worth documenting.
- We do not claim the four-class catalog is exhaustive. Crisis-counselor training literature warns against many utterance classes; we documented the four most salient in the Omar transcript.
- We do not claim Stay is well-implemented. Stay scored *lower* than raw Claude in §4.1; the §4.6 self-audit found a defect in Stay's own spec; the deployment has known limitations documented in the companion paper A and the project repo.

---

## 6 · Scope of this position paper

The items below are out of scope for this position paper by design — they are the empirical questions §3 pre-registers as the protocol the position invites the field to run. The position paper's contribution is the methodology, the illustrative case (§4.1–§4.2 / §4.6), and the pre-registration with explicit success / failure / retraction criteria. Each item is *what the v2 empirical follow-up paper would address*, not what this paper claims to deliver:

- **n=9 personas, single run per persona** in §3.1's illustrative case. The aggregate direction (§4.1) is presented qualitatively only; bootstrap variance over 9 personas would yield a 95% CI on any aggregate delta wide enough to overlap zero. v2 follow-up addresses this with the §3.2 multi-judge × multi-model design.
- **Same-model confound** in §3.1 (Sonnet 4.5 as persona simulator + judge + one SUT). §3.2 pre-registration explicitly disentangles the judge-side correlation; persona-side correlation remains a structural property of VERA-MH's persona definitions.
- **Single comparator persona** for §4.2 four-class observation (Omar). §3.4 cross-persona check is the pre-registered scaling test.
- **Specification version mismatch.** §3.1 illustrative case uses Stay v0.3.x; v0.8 was committed after. v2 follow-up re-runs against v0.8.
- **6-turn convention.** VERA-MH `quick_test` default. Production-quality 20-turn × 20-run configuration is the v2 follow-up's cost-justified execution.
- **Single judge family in §3.1.** §3.2 pre-registers GPT-5 + Gemini 2.5 + Sonnet 4.5 to address; v2 executes.

---

## 7 · Conclusion

The four-utterance-class catalog grounded in crisis-counselor training literature provides one falsifiable instrument for testing whether a given AI mental-health benchmark's rubric scores at the response level penalizes harmful utterance classes the literature warns against. Applied to a single Omar-persona transcript from VERA-MH, the catalog finds four such classes present in a response that received Best Practice ratings on three of five dimensions. Whether this reading scales — to other personas, to other judge models, to other benchmarks, to actively-credit versus structural-blindness — is the empirical question this paper sets up via the §3 pre-registered protocol but reserves for a v2 empirical follow-up. The methodology is offered for replication. A *related* self-audit using a different instrument (paraphrase-robustness A/B applied to the author's own v0.7 specification) surfaced a defect — demonstrating that the broader posture (probe spec claims against observed behavior at scale) generalizes inward as well as outward.

---

## Acknowledgments

VERA-MH expert council (Bentley et al. 2026) and Spring Health for releasing the rubric and transcripts that this paper engages. Crisis-line counselors at 988, Crisis Text Line, and the National DV Hotline whose actual labor and training tradition this catalog draws on.

## Data and code availability

- VERA-MH evaluation transcripts (9 personas × 2 systems): `data/vera-mh-runs/2026-04-28/`.
- Reproduction instructions: `scripts/reproduce-section-2.md` (~$60 API spend, ~30 min wall-clock for §3.1; ~$30–50 for §3.2 multi-judge add-on; ~$10–20 for §3.3 utterance-ablation; ~$5 + ~2h author time for §3.4 cross-persona check with two-coder methodology).
- Self-audit (§4.6) raw data: `data/tier1-comparison-2026-04-29.json`.

## References

[Subset; full list to be reconciled after experiments. Anchor citations:]

1. Bentley, K.H. et al. "VERA-MH: Reliability and Validity of an Open-Source AI Safety Evaluation in Mental Health." arXiv:2602.05088, 2026.
2. Lee, S. et al. "MHSafeEval: Multi-turn Adversarial Evaluation for Mental Health AI." arXiv:2604.17730, 2026.
3. Arnaiz-Rodriguez, A. et al. "Between Help and Harm: An Evaluation of Mental Health Crisis Handling by LLMs." arXiv:2509.24857, 2025–2026.
4. Golden, G. & Aboujaoude, E. "FAITA-Mental Health." World Psychiatry 2024;23(3).
5. Reporting on Suicide. Safe Messaging Guidelines. reportingonsuicide.org.
6. Linehan, M.M. "Cognitive-Behavioral Treatment of Borderline Personality Disorder." Guilford, 1993.
7. Joiner, T. & Van Orden, K. "The interpersonal-psychological theory of suicidal behavior." Int J Cogn Ther, 2008.
8. Hayes, S.C. et al. "Acceptance and Commitment Therapy." Guilford, 2nd ed.
9. Bordin, E.S. "The Generalizability of the Psychoanalytic Concept of the Working Alliance." Psychotherapy: Theory, Research, & Practice, 1979.
10. Gould, M.S. et al. "An Evaluation of Crisis Hotline Outcomes Part 2: Suicidal Callers." Suicide Life Threat Behav, 2007.
11. Mishara, B.L. & Daigle, M.S. "Crisis Helpline Helping Behavior — Best Practices." Suicidology Online and adjacent operational literature.
12. Ribeiro, M.T. et al. "Beyond Accuracy: Behavioral Testing of NLP Models with CheckList." ACL 2020.

---

*Word count: ~5,800 (target 4,000–5,000 for NeurIPS workshop position-paper track; lightly over). v2 empirical follow-up paper would populate §4.3 / §4.4 / §4.5 results sections (currently reserved as placeholders) plus expand §5 discussion accordingly. As currently structured (methodology + illustrative case + pre-registration), the paper is submission-ready for the position-paper track.*
