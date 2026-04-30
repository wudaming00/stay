# Four Utterance Classes Crisis-Counselor Training Warns Against, and How AI Mental-Health Benchmarks Score Responses Containing Them

*Paper B draft v0.1 (skeleton) — split from preprint v0.6.5 (2026-04-30) per independent peer-review recommendation. Target venue: NeurIPS Safe & Trustworthy AI workshop. **Submission gated on multi-judge × multi-model replication and utterance-ablation experiments (~$100 API spend, ~1 evening of work) — see §3.2–3.3 for what's needed.** Companion paper A (engineering-ethics scaffolding) is in [paper-A-engineering-ethics-draft.md](./paper-A-engineering-ethics-draft.md).*

**Authors**: Daming Wu¹

¹ Independent developer, San Jose, CA. Correspondence: hello@thestay.app

---

## Abstract

Existing AI mental-health evaluation benchmarks score responses on coarse-grained dimensions (5-point Likert, "Best Practice / Suboptimal / High Potential for Harm"). This paper documents four utterance classes — leverage manipulation of named reasons-for-living, wrong-time cognitive defusion delivered during acute distress, reflexive AI self-disclosure mid-distress, and bullet-pointed resource lists during acute distress — that crisis-counselor training literature warns against, but that the leading clinician-developed open evaluation framework (VERA-MH; Bentley et al. 2026) does not penalize when present in a system's response. We document the rubric-coarseness reading from a single Omar-persona transcript (publicly available; reproducible from the VERA-MH commit `f4a0c2e` of 2026-04-28) and report whether multi-judge × multi-model replication (GPT-5, Gemini 2.5, Sonnet 4.5 as judges; raw Sonnet, Stay v0.8 as systems-under-test) and utterance-ablation experiments (each utterance class surgically removed, response re-judged) sustain the structural-blindness reading versus an alternative that the four classes recur as actively-credited utterances at scale. **[Multi-judge and utterance-ablation results to be added before submission.]**

We also report a self-audit case (§5) in which the same methodology applied to the Stay system's own design specification surfaced a defect: Stay's v0.7 spec claim of "semantic intent, not surface keyword" classification of suicide-adjacent disclosures was not supported by a 200-call paraphrase-robustness test (1% → 18% 988-trigger rate driven by lookup-table expansion of named examples, not semantic generalization). The framework is offered as a way to test the spec against itself, not only as a critique of external benchmarks.

The contribution is (a) a specific four-class anti-pattern catalog grounded in named clinical literature, (b) a measurement-validity reading of one published benchmark, (c) a reproduction protocol that other benchmark authors can apply to their own rubrics, and (d) one demonstration of the protocol applied to the author's own deployed system as a self-audit. We do not claim Stay is well-implemented; Stay scored *lower* than raw Claude in the §4 reading, used here as an illustrative case. We do not claim VERA-MH is wrong; we claim a specific structural property of its rubric that benchmark v2 design could address.

---

## 1 · Introduction

### 1.1 What the existing benchmarks score

VERA-MH (Bentley et al. 2026) — the leading open clinician-validated framework for AI mental-health safety evaluation — scores conversational responses across five dimensions: Detect Risk, Clarify Risk, Guide to Human Support, Collaborate and Validate Appropriately, Maintain Safe Boundaries. Each dimension receives one of three labels per conversational response: Best Practice, Suboptimal, or High Potential for Harm. The aggregate score formula is `(50 + %BP/2) × (1 - %HPH/100)²`, with a "do nothing" baseline of 50.

MHSafeEval (Lee et al. 2026) extends to multi-turn role-aware safety with a richer harm taxonomy. Between Help and Harm (Arnaiz-Rodriguez et al. 2025) applies six-category clinical taxonomy with 5-point Likert. FAITA-MH (Golden & Aboujaoude 2024) provides a 6-domain rating scale at the system level rather than the response level. The common architectural property: each rubric scores responses against dimensions that summarize the response, not the individual utterances within it.

### 1.2 What the literature warns against

Crisis-counselor training literature names specific utterance classes that increase risk during acute distress. A non-exhaustive list:

- **Leverage manipulation** of named reasons-for-living (Reporting on Suicide Safe Messaging Guidelines; Linehan 1993 attempt-survivor synthesis; Joiner & Van Orden 2008 perceived-burdensomeness).
- **Wrong-time cognitive restructuring** (DBT validation-precedes-change ordering; Linehan 1993).
- **Mid-distress AI self-disclosure / frame-disrupting moves** (Gould et al. 2007 Lifeline counselor behaviors; Mishara & Daigle on Samaritans; counselor-training treatment of role-disclaimer-as-withdrawal-cue).
- **Multi-channel referral overload at peak distress** (consistent with cognitive-load principles in crisis-line training literature).

A response containing one or more of these utterance classes can score Best Practice on a rubric whose dimensions summarize the response, *because* the dimensions credit the response's overall properties (risk detected? human support guided to? safe boundary maintained?) rather than penalizing the specific utterances within it.

### 1.3 Contribution

This paper documents the four-utterance-class anti-pattern catalog, applies the catalog to a publicly-available VERA-MH evaluation transcript, reports whether multi-judge × multi-model replication and utterance-ablation experiments sustain the structural-blindness reading, and offers one demonstration of the same methodology turned on the author's own deployed system as a self-audit.

We position this work as **methodology demonstration**, not as a comprehensive critique of VERA-MH. The four classes are observed in one persona's transcript (Omar); whether they recur across the other 8 VERA-MH personas is documented in §7 as a follow-up gap, not a delivered claim.

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

### 3.2 Multi-judge × multi-model replication [TODO: experiments not yet run]

**Plan.** Re-run the same 9-persona configuration with each of three judge models — `claude-sonnet-4-5-20250929`, `openai/gpt-5`, `google/gemini-2.5-pro` (via OpenRouter shim) — applied to each of two systems-under-test:
- Raw Claude (Sonnet 4.5, no system prompt, as in §3.1)
- Stay v0.8 (current spec with explicit agency-trajectory framing and companion-during-call language)

**What this disentangles.** The same-model confound in §3.1 (Sonnet 4.5 as persona simulator + judge + one system) cannot be removed entirely (the persona simulator is also Sonnet), but using non-Sonnet judges disentangles the judge-side correlation. If GPT-5 and Gemini 2.5 judges produce results consistent with Sonnet's, the structural-blindness reading is robust. If the four-class observation appears only under Sonnet, the reading is partially attributable to model-self-preference.

**Cost.** ~$30–50 across the three judge models × two SUTs × 9 personas × 6 turns. Existing runner at `scripts/scenarios/runner.ts` supports `--provider=` flag for OpenRouter; tool-format conversion is already implemented.

**Status.** Not yet run. Submission of this paper to NeurIPS Safe & Trustworthy AI workshop is gated on completing this experiment.

### 3.3 Utterance-ablation experiment [TODO: experiments not yet run]

**Plan.** For each of the four utterance classes (a)–(d) above, take Raw Claude's Omar-turn-3 response from §3.1, surgically remove the utterance(s) of that class, and re-judge the modified response with each of the three judge models from §3.2. Measure the dimension scores for the modified response and compare to the original.

**What this disentangles.** The §3.1 / §4.2 reading is structural — *the rubric does not penalize these utterance classes*. An alternative reading is granularity — *the rubric simply scores at response level and these utterance classes happen to be in responses that scored Best Practice*. The two readings make different predictions:
- **Structural-blindness** predicts: removing the utterance has no effect on the dimension score.
- **Active-credit** predicts: removing the utterance lowers the dimension score (the utterance was contributing positive evidence for that dimension).

Utterance-ablation distinguishes them.

**Cost.** ~$10–20 (small number of single-response re-judgments). 

**Status.** Not yet run. Same gating as §3.2.

### 3.4 Cross-persona check [TODO]

**Plan.** Apply the four-class catalog from §2 to the other 8 VERA-MH personas' raw-Claude turn-3 responses (and equivalent acute-distress turns). Code each utterance present / absent. Tabulate dimension scores by utterance presence.

**What this resolves.** §4.2 documents the four-class observation from one persona only (Omar). Whether the four classes recur across the 8 other personas is required follow-up. If they do recur, the structural-blindness reading scales beyond a single transcript. If they do not, the reading is one-transcript-only and should be presented as such.

**Status.** Not yet run; trivial relative to §3.2 / §3.3 (no API calls — just re-reading the existing transcripts and coding presence/absence by hand or with a coding LLM).

---

## 4 · Results

### 4.1 Direction of aggregate result (qualitative)

[Qualitative direction table from §3.1 reproduced here. With n=9 personas, single run, same-model confound, point estimates are not reported in body; raw scores in `data/vera-mh-runs/2026-04-28/scores.json`.]

[TABLE: Stay vs Raw Claude direction across 5 VERA-MH dimensions]

The aggregate direction — Raw Claude scoring higher than Stay on most dimensions — is preliminary. The 95% CI on the delta would overlap zero given variance estimates over 9 personas. We present qualitative direction only and treat the §4.2 utterance-class observation as the more durable finding.

### 4.2 Four-utterance-class observation from Omar transcript

[Worked example: full Omar turn-3 raw-Claude response reproduced; four utterance classes marked; VERA-MH judge ratings on the response reproduced; observation that the response containing all four utterance classes was rated Best Practice on three of five dimensions stated.]

The observation is reproducible from the public transcript and does not depend on the same-model confound or Stay's specification version.

### 4.3 Multi-judge replication results [TODO: section to be filled in after §3.2 experiment]

[If multi-judge results sustain the four-class observation: report concordance metrics (Cohen's κ across judge pairs), report per-class judgment by judge model, report whether any judge model penalizes any utterance class, conclude robustness.]

[If multi-judge results do not sustain: report which classes are robust and which are Sonnet-specific, present the partial reading honestly.]

### 4.4 Utterance-ablation results [TODO: section to be filled in after §3.3 experiment]

[Per-class ablation table: original dimension scores → modified dimension scores by judge model. If structural-blindness predicted (no change), report it. If active-credit (score drops on ablation), report which classes drop and on which dimensions.]

[Discussion: which reading the ablation results support, and what this implies for VERA-MH v2 design.]

### 4.5 Cross-persona recurrence [TODO: section to be filled in after §3.4 check]

[Per-persona table: utterance-class presence in raw-Claude turn-3 responses across 9 personas. Recurrence rate for each class.]

---

## 5 · Self-audit case: testing the spec against itself

A core claim in Stay's specification at v0.7 was "semantic intent, not surface keyword" classification of suicide-adjacent disclosures across languages — the spec claimed Stay would recognize SI signals in any language by meaning, not by surface lexical match.

We tested this claim with 200 single-turn evaluations: 10 ambiguous/euphemistic SI phrases × 10 runs × 2 spec versions (v0.6 baseline vs v0.7 with explicit semantic-intent + multi-language additions). Aggregate 988-rate rose from 1% to 18%. The headline statistic is significant in the aggregate (Fisher exact across pooled calls *p* < 1e-5) but the per-phrase test is noisier — at n=10 calls per phrase the binomial 95% CI on a 0/10 cell spans 0–31%, and per-phrase Fisher tests are mostly not individually significant. The aggregated result is reliable about *average* movement; it is not a precise per-phrase result.

**Mechanism.** The gain was driven by phrases the v0.7 spec listed verbatim as Active examples. Phrases that were semantically equivalent but unlisted in v0.7 — for example Chinese "想解脱" (a religious-euphemism SI phrase that v0.7 did not enumerate), and the cross-lingual mirror of listed Chinese "想消失" which at v0.7 had no listed English form — showed no measurable transfer.

**Reading.** Stay's "semantic intent, not surface keyword" claim is, in this single-turn condition, empirically not supported: the model behaves consistently with lookup-table expansion of named examples, not intent-based classification. The v0.8 spec rewrite (committed before this paper) removed the unconditional "semantic intent" claim and added cross-lingual mirror pairs as a partial response.

**What this contributes to the paper.** Two things. First, it demonstrates the *same methodology* — taking a system's design claim, testing it against a behavioral criterion at scale — applied to the author's own product. The methodology critiquing VERA-MH is the methodology that surfaced Stay's defect; the framework is offered as a way to test specifications against themselves, not only as external critique. Second, it is a concrete instance of the kind of falsification benchmark v2 design should aim for: an aggregate-level test (200 calls) that cannot be passed by lookup-table expansion of named examples.

---

## 6 · Discussion

### 6.1 What the rubric is and is not measuring

[Discussion section — to be tightened after §3 experiments. Key threads:]

- The four-class observation is consistent with the rubric scoring at response level rather than utterance level — a granularity choice, not a "wrongness."
- A response-level rubric is appropriate for some questions (overall conversational appropriateness) and underweighted for others (specific utterance-level harms documented in counselor training).
- Benchmark v2 designs that add utterance-level scoring as a complementary layer would close this specific gap. We do not advocate replacing response-level scoring; we advocate adding the layer.

### 6.2 Recommendation to benchmark authors

- Add an **utterance-flagging layer** to existing rubrics: programmatic regex / classifier checks for the four classes (and other classes the literature warns against), independent of the dimension-level judgment.
- Adopt **utterance-ablation as part of validation methodology** for new rubric versions: re-judge response variants with target utterances surgically removed, verify dimension scores respond.
- Run **multi-judge robustness** with at least 3 different judge models, report inter-judge κ.

### 6.3 What this paper does not claim

- We do not claim VERA-MH is wrong. The rubric is a real contribution to the field; it is also a v1 with a structural property worth documenting.
- We do not claim the four-class catalog is exhaustive. Crisis-counselor training literature warns against many utterance classes; we documented the four most salient in the Omar transcript.
- We do not claim Stay is well-implemented. Stay scored *lower* than raw Claude in §4.1; the §5 self-audit found a defect in Stay's own spec; the deployment has known limitations documented in the companion paper A and the project repo.

---

## 7 · Limitations

- **n=9 personas, single run per persona.** No variance estimate, no significance test on the 14-point delta.
- **Same-model confound** in §3.1 partially addressed by §3.2 multi-judge plan, not yet executed.
- **Single comparator persona** for §4.2 four-class observation (Omar). Cross-persona recurrence (§3.4 / §4.5) is required but not delivered.
- **Specification version mismatch.** §3.1 uses Stay v0.3.x; v0.8 was committed after. Re-run with v0.8 is required follow-up.
- **6-turn convention.** VERA-MH `quick_test` default. Production-quality 20-turn × 20-run configuration not run due to cost.
- **Single judge family in §3.1.** §3.2 plan addresses; not yet run.

---

## 8 · Conclusion

The four-utterance-class catalog grounded in crisis-counselor training literature provides one falsifiable instrument for testing whether a given AI mental-health benchmark's rubric scores at the response level penalizes harmful utterance classes the literature warns against. Applied to a single Omar-persona transcript from VERA-MH, the catalog finds four such classes present in a response that received Best Practice ratings on three of five dimensions. Whether this reading scales — to other personas, to other judge models, to other benchmarks, to actively-credit versus structural-blindness — is the empirical question this paper sets up but does not yet answer. The methodology is offered for replication. The same methodology applied to the author's own deployed system surfaced a defect in Stay's v0.7 specification.

---

## Acknowledgments

VERA-MH expert council (Bentley et al. 2026) and Spring Health for releasing the rubric and transcripts that this paper engages. Crisis-line counselors at 988, Crisis Text Line, and the National DV Hotline whose actual labor and training tradition this catalog draws on.

## Data and code availability

- VERA-MH evaluation transcripts (9 personas × 2 systems): `data/vera-mh-runs/2026-04-28/`.
- Reproduction instructions: `scripts/reproduce-section-2.md` (~$60 API spend, ~30 min wall-clock for §3.1; ~$30–50 for §3.2 multi-judge add-on; ~$10–20 for §3.3 utterance-ablation; trivial for §3.4 cross-persona check).
- Self-audit (§5) raw data: `data/tier1-comparison-2026-04-29.json`.

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

*Word count: ~3,700 (target 4,000–5,000 for NeurIPS workshop). Submission gated on §3.2 + §3.3 + §3.4 experiments. PDF will be generated after results sections (§4.3 / §4.4 / §4.5) are populated.*
