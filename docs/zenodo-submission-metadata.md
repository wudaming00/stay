# Zenodo Submission — Paste-Ready Metadata

URL: https://zenodo.org/uploads/new (after sign-in)

Sign in with **ORCID** if you have one, otherwise email/password (creates account same-day).
No endorsement, no waiting — get a DOI within minutes of clicking Publish.

---

## Step 1 — Files

Upload **one file**:

- `/home/carwaii/projects/reflective-companion/docs/preprint-v0.5.pdf` (already generated, 278 KB)

Optional second file (recommended, makes the artifact reproducible):

- A zip of the GitHub repo. Generate with:
  ```bash
  cd /home/carwaii/projects/reflective-companion && \
    git archive --format=zip --output=/tmp/stay-snapshot-2026-04-28.zip HEAD
  ```
  Upload `/tmp/stay-snapshot-2026-04-28.zip` as a second file.

---

## Step 2 — Resource type

**Publication → Preprint**

---

## Step 3 — Title

> ⚠️ **DECIDE FIRST**: are you posting v0.5 (current reactive framing) or a builder-framed v0.6?

### Option A — v0.5 as-is title

```
When Benchmarks Reward What Crisis Training Forbids: A Measurement-Validity Audit of VERA-MH, with Stay as the Probe System
```

### Option B — builder-framed v0.6 title (recommended if rewriting)

```
Behavioral Specifications and Co-Designed Tests for AI Crisis Intervention: A Methodology Stack and Open-Source Reference Implementation
```

---

## Step 4 — Authors

- **Family name**: Wu
- **Given names**: Daming
- **Affiliation**: Independent Researcher
- **ORCID** (optional — create at https://orcid.org if you don't have one; takes 2 minutes and is worth doing): leave blank if no time.

---

## Step 5 — Description (abstract)

> ⚠️ Pick the version that matches the title you chose above.

### Option A — v0.5 abstract (paste from current preprint §Abstract)

Use the abstract from `preprint-v0.5-draft.md` lines 13–32 verbatim.

### Option B — builder-framed v0.6 abstract

```
We present a five-piece methodology stack for safety-critical conversational
AI — explicit positioning, a written behavioral specification, a co-designed
regression test suite with a machine-checkable rule-↔-assertion invariant,
CI-as-deployment-gate, and multi-rubric evaluation philosophy — together with
an open-source reference implementation (Stay; thestay.app) deployed on Claude
Sonnet 4.5 under the complement-to-988 positioning. As one application of the
methodology, we publish a reproducible replication of VERA-MH (Spring Health,
2025) on Stay vs. raw Claude across 9 personas × 6 turns × 5 dimensions,
finding a 14-point benchmark delta that surfaces specification-vs-baseline
behavioral differences and characterizes which behaviors a single-judge,
single-orthodoxy benchmark systematically rewards or penalizes. The open
artifact comprises an 8-rule + 12-protocol behavioral specification with a
method-driven imminent-risk SOP, a 61-scenario regression test suite,
multi-provider runner abstraction, full evaluation transcripts, and a
dual-license design (MIT methodology infrastructure + restrictive Stay System
Prompt License v1) that prevents downstream forks from silently removing
safety-critical SOPs. The contribution is the methodology stack and the
runnable artifact; the empirical finding is one demonstration of how the stack
behaves under multi-rubric evaluation.
```

---

## Step 6 — License

**Creative Commons Attribution 4.0 International (CC-BY-4.0)**

(Same as the arXiv pick. Standard for AI/ML preprints. Allows broad reuse with
attribution.)

---

## Step 7 — Keywords

Add each as a separate tag:

```
AI safety
mental health
LLM evaluation
behavioral specification
co-designed tests
crisis intervention
Constitutional AI
LLM-as-judge
VERA-MH
deployment gate
specification drift
multi-rubric evaluation
open-source AI
```

---

## Step 8 — Communities (optional)

Search and add:

- `coar` (Confederation of Open Access Repositories)
- `zenodo` (default, prepopulated)

If there's an "AI safety" or "open-source AI" community, add it.

---

## Step 9 — Funding (skip)

Leave blank — no formal grant funding for this artifact yet.

---

## Step 10 — Related identifiers

Add these one at a time:

| Relation | Identifier | Resource type |
|---|---|---|
| **is supplemented by** | `https://github.com/wudaming00/stay` | Software |
| **is supplemented by** | `https://thestay.app/` | Other |
| **is part of** | (leave blank) | — |
| **cites** | `arXiv:2602.05088` (VERA-MH; Brodsky et al. 2025) | Publication / preprint |
| **cites** | `arXiv:2511.18491` (MindEval; Sword Health 2025) | Publication / preprint |

---

## Step 11 — References (optional, can leave blank if tired)

Skip. The PDF itself contains the reference list.

---

## Step 12 — Subjects (optional)

Add these as keywords already covers it. Skip.

---

## Step 13 — Languages

**English (eng)**

---

## Step 14 — Dates

- **Publication date**: today's date (auto-filled)
- **Created**: leave blank
- **Submitted**: leave blank

---

## Step 15 — Version

**v0.5** (or **v0.6** if you rewrote)

---

## Step 16 — Publisher

**Zenodo** (auto-filled)

---

## Step 17 — Save → Preview → Publish

- Click **Save Draft** first to make sure all required fields are green.
- Click **Preview** to see how the record will look.
- Click **Publish** when ready. ⚠️ **Once published, the DOI is permanent.** You can issue new versions but cannot delete or replace this one.

The DOI you get back will look like: `10.5281/zenodo.XXXXXXX`. The cite-this URL is `https://doi.org/10.5281/zenodo.XXXXXXX`.

**Save that URL** — you'll paste it into the arXiv submission, ERA application, Manifund post, OpenAI MH email, and any future grant app.
