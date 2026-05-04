# AIES 2026 Submission Checklist

**Conference:** AIES 2026, Malmö, Sweden, 2026-10-12 to 2026-10-14
**Submission portal:** https://easychair.org/conferences/?conf=aies26
**Track:** Full paper (≤10 pages including figures/tables, refs unlimited)
**Review:** Double-blind

---

## Hard deadlines

| What | When | Status |
|---|---|---|
| Install TeX Live | ASAP | ⏳ pending (you) |
| Compile paper, verify ≤10 pages | Before 2026-05-12 | ⏳ |
| Register EasyChair account | Before 2026-05-14 | ⏳ |
| Set up anonymous.4open.science mirror | Before 2026-05-21 | ⏳ (you) |
| **Abstract registration** | **2026-05-14, 11:59pm AoE** | ⏳ |
| **Full paper submission** | **2026-05-21, 11:59pm AoE** | ⏳ |

---

## Step 1 — Install TeX Live

Run (in another terminal, takes ~10 min, ~1.5 GB download):

```bash
sudo apt update && sudo apt install -y \
  texlive-latex-base texlive-latex-recommended texlive-latex-extra \
  texlive-fonts-recommended texlive-fonts-extra \
  texlive-pictures texlive-bibtex-extra texlive-science \
  biber poppler-utils
```

Verify: `which pdflatex bibtex` should both return paths.

---

## Step 2 — Compile

```bash
cd projects/reflective-companion/submission
./build.sh
```

Expect: `paper.pdf` produced. Check page count (target ≤10 main + 3 optional statements + refs).

If errors: tell me what `/tmp/paper-pdflatex-1.log` says, I'll fix.

---

## Step 3 — Set up anonymous repo mirror

Why: paper references file paths (`src/lib/system-prompt.ts` etc.). Reviewers may want to inspect implementation. Double-blind = can't link to public `github.com/wudaming00/stay`.

**How:**
1. Go to https://anonymous.4open.science
2. Click "Anonymize a GitHub repository"
3. Paste `https://github.com/wudaming00/stay`
4. Select branch (probably `main`)
5. Choose anonymization options (default OK; maybe whitelist `LICENSE-PROMPT.md`, `src/lib/system-prompt.ts`, `scripts/check-rule-coverage.ts`, `src/lib/heartbeat-store.ts`, `.github/workflows/check-rule-coverage.yml`, `docs/deployment-conditions.md`)
6. Save the anonymous URL (looks like `https://anonymous.4open.science/r/<hash>`)

**Then add to paper.tex** — uncomment the `\begin{links}` block (currently absent; we'll add when we know the URL). Or list in supplementary materials field on EasyChair.

---

## Step 4 — Register EasyChair account

If you don't have one: go to https://easychair.org/account/signup. Use a NON-personal email (e.g., a fresh gmail) if you want to keep this submission's identity separate from any existing EasyChair history.

---

## Step 5 — Submit abstract (2026-05-14)

On EasyChair, navigate to AIES 2026, click "New Submission":
- **Title:** copy from paper.tex line 33–34
- **Authors:** "Anonymous Submission" (do not enter real name even in metadata; AIES strips this from review version, but defense-in-depth)
- **Abstract:** copy from paper.tex `\begin{abstract}` block (~270 words)
- **Keywords:** `AI mental health, governance pattern, restricted-use license, deployment-pause, rule-coverage CI, safety-critical software, public-good AI, LLM safety, engineering ethics`
- **Topic categories:** governance, ethical design, deployments

This step doesn't upload the PDF yet — just reserves your slot.

---

## Step 6 — Submit full paper (2026-05-21)

Before uploading, **strip PDF metadata** to prevent identity leak:

```bash
cd projects/reflective-companion/submission
exiftool -all= -overwrite_original paper.pdf  # or use qpdf --linearize
# Verify:
exiftool paper.pdf | grep -E "Author|Creator|Producer"
# Should show no personal info
```

Then on EasyChair, edit your existing submission, upload `paper.pdf`.

---

## Step 7 — Reproducibility checklist (optional)

AAAI provides one (`AuthorKit26/ReproducibilityChecklist/`). AIES may or may not require it; check the CFP. If included, append at end of paper.

---

## Pre-submission self-check

Before you click submit:

- [ ] PDF compiles without overfull-hbox warnings
- [ ] Page count: main body ≤10 (figures/tables included)
- [ ] Optional sections (Ethical/Positionality/Adverse Impact) are after main body
- [ ] References after optional sections
- [ ] No author names in PDF (search for "Wu", "Daming", "Stay", "thestay", "wudaming")
- [ ] No URLs to github.com/wudaming00 or thestay.app in PDF
- [ ] PDF metadata stripped (Author/Producer fields empty)
- [ ] Anonymous code mirror URL noted in EasyChair supplementary field
- [ ] Fonts embedded in PDF: `pdffonts paper.pdf` (all should say "yes" under "emb")
- [ ] No type 3 fonts: `pdffonts paper.pdf | grep -i "type 3"` returns nothing

---

## After submission

- Decision notification: 2026-07-16
- If accepted, camera-ready: typically 4-6 weeks after notification
- If rejected, decide: revise & resubmit elsewhere (FAccT, AI & Ethics, AI & Society) or treat Zenodo preprint as the publication

---

## Files in this directory

- `paper.tex` — main source (port from `docs/paper-A-aies-anon.md`)
- `paper.bib` — bibliography (29 entries; 1 unused will auto-drop)
- `aaai2026.sty` — AAAI style file (do not modify)
- `aaai2026.bst` — AAAI bibliography style (do not modify)
- `build.sh` — compile script
- `SUBMIT.md` — this file
