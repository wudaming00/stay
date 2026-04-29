# Tomorrow morning — 15-minute publishing checklist

Wake up. Coffee. Open this file. Click through.

---

## 0. Decide framing first (1 minute)

Open `preprint-v0.5-draft.md` line 1. The current title is:

> *When Benchmarks Reward What Crisis Training Forbids: A Measurement-Validity Audit of VERA-MH...*

This is permanent once you publish. Two options:

- **Option A — ship v0.5 as-is**. Title above. Faster. The framing you said
  was "too aggressive" stays as the public record under your name.
- **Option B — tell Claude "B"** in the chat. Claude rewrites the title +
  abstract + §1 to builder framing while you do something else. ~30 minutes
  for the version you'd actually be proud of.

If you don't care, pick A. If you care a little, pick B.

---

## 1. Zenodo (5 minutes) → DOI

Open: https://zenodo.org/uploads/new

1. Sign in (ORCID or email).
2. Open `docs/zenodo-submission-metadata.md` in a tab.
3. **Upload file**: `docs/preprint-v0.5.pdf` (or `preprint-v0.6.pdf` if Option B).
4. Paste each metadata field from the file. Title and abstract: pick A or B.
5. License: **CC-BY-4.0**.
6. Click **Save Draft** → check all required fields green → **Publish**.
7. Copy the DOI URL (looks like `https://doi.org/10.5281/zenodo.XXXXXXX`).
   **Save it somewhere visible** — you'll paste this into 5+ other places this
   week.

---

## 2. arXiv endorsement emails (5 minutes) → 3 cold emails out

Open `docs/arxiv-endorsement-emails.md`. Three emails ready to copy-paste.

For each:
1. Open the faculty homepage link → grab the current email.
2. Open Gmail → Compose.
3. Paste subject line.
4. Paste body.
5. Send.

Endorsement code (already inserted in all three): **`MFY8HC`**

Backup candidates listed at the bottom if you want to send a fourth.

---

## 3. arXiv submission form (3 minutes) → submit, wait for endorsement

Resume the in-progress arXiv submission you started yesterday at:
https://arxiv.org/submit

1. **License**: CC BY (already picked)
2. **Archive**: cs
3. **Subject Class**: cs.HC primary; cross-list cs.CY
4. **Add Files**: upload `docs/preprint-v0.5.pdf` (or v0.6)
5. **Metadata**:
   - **Title**: same as Zenodo (pick A or B)
   - **Authors**: Daming Wu (Independent Researcher)
   - **Abstract**: same as Zenodo
   - **Comments**: `Code, tests, and full evaluation transcripts: https://github.com/wudaming00/stay. Deployed product: https://thestay.app/. Zenodo DOI: [paste from step 1].`
   - **Report-no / Journal-ref / DOI / MSC / ACM**: leave blank
6. **Process** → **Preview** → **Submit**.

Expect arXiv to flag "needs endorsement before listing." Submission stays
queued until one of the three endorsers from Step 2 acts. No further action
needed until they do.

---

## 4. Done — what to do with the DOI

Once you have the Zenodo DOI URL, paste it into:

- `docs/anthropic-era-application-draft.md` → Identity & Affiliation section,
  add line: `Preprint DOI: https://doi.org/10.5281/zenodo.XXXXXXX`
- `docs/manifund-project-page.md` → Links section
- `docs/openai-mh-grant-email-draft.md` (when you write that)
- `docs/grant-applications-log.md` → top of file as project-wide artifact
- Stay GitHub repo `README.md` → "Cite this work" section
- Your resume → optionally add to research section

I can do these find-and-replace passes for you when you tell me the DOI
tomorrow.

---

## 5. If you have spare energy after that

In rough priority order:

- **Send Anthropic ERA** (`docs/anthropic-era-application-draft.md` is ready —
  paste each section into the Google Form at https://forms.gle/pZYC8f6qYqSKvRWn9).
- **Post Manifund** (`docs/manifund-project-page.md` is ready — paste into
  https://manifund.org/ project creation form, add the Zenodo DOI).
- **Send OpenAI MH email** (drafted separately; ready to paste).

But honestly: just shipping the preprint is enough for one morning. The rest
can wait a day.

---

## Files generated tonight (so you can find them)

```
docs/preprint-v0.5.pdf                       ← upload this to Zenodo + arXiv
docs/zenodo-submission-metadata.md           ← paste-ready Zenodo fields
docs/arxiv-endorsement-emails.md             ← three cold emails, code inserted
docs/anthropic-era-application-draft.md      ← ready-to-paste ERA form
docs/anthropic-fellows-application-draft.md  ← deferred (needs references)
docs/manifund-project-page.md                ← ready-to-post Manifund page
docs/resume-anthropic-fellows.md             ← markdown resume backup
/mnt/c/Users/Sining Xu/Downloads/Daming_Wu_Resume_AnthropicFellows.docx ← resume
docs/TOMORROW-MORNING.md                     ← this file
```

Sleep well.
