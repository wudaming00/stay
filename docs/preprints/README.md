# Preprints

Frozen publication-ready snapshots of papers from this repository. Each version here is the markdown source as submitted to a preprint server (Zenodo, arXiv, etc.). The working drafts (which evolve over time) are at `../paper-A-engineering-ethics-draft.md` and `../paper-B-antipattern-catalog-draft.md`. The frozen snapshots are kept here so that DOIs and arXiv IDs resolve to stable text.

## Current

| File | Status | DOI / arXiv |
|---|---|---|
| `paper-A-v1.md` | Ready for Zenodo upload (v1, 2026-04-30) | TBD |

## Build

To convert markdown to PDF for submission:

```bash
pandoc docs/preprints/paper-A-v1.md \
  -o docs/preprints/paper-A-v1.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V mainfont="Times New Roman" \
  -V fontsize=11pt \
  --toc --toc-depth=2 \
  --metadata title="Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems" \
  --metadata author="Daming Wu" \
  --metadata date="2026-04-30"
```

(Adjust pandoc flags per target venue — Zenodo accepts plain PDF; arXiv typically wants LaTeX source plus PDF; FAccT/AIES want venue-templated LaTeX.)

## Zenodo upload metadata

Paste-ready metadata for the Zenodo deposit form (https://zenodo.org/uploads/new):

- **Resource type**: Publication → Preprint
- **Title**: Engineering-Ethics Scaffolding for Deployed Public-Good AI Mental-Health Systems: A Combined License, Deployment-Pause Posture, and Rule-Coverage CI Pattern
- **Creators**: Wu, Daming (affiliation: Independent; ORCID: TBD)
- **Description**: see paper abstract (paste from paper-A-v1.md §Abstract; ~430 words)
- **Publication date**: 2026-04-30
- **Language**: English
- **Keywords** (suggested): AI mental health; governance pattern; restricted-use license; deployment-pause posture; rule-coverage CI; safety-critical software; public-good AI; LLM safety; reference implementation; engineering ethics
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Related identifiers**:
  - "is supplemented by" — github.com/wudaming00/stay (URL)
  - (after Paper B Zenodo upload) "is part of" — Paper B DOI
- **Funding**: none / self-funded
- **Files to upload**: `paper-A-v1.pdf` (primary); `paper-A-v1.md` (source; secondary)

## Versioning

When the paper revises substantively, add a new file `paper-A-v2.md` rather than overwriting `v1.md`. Zenodo's versioning system links related DOIs together automatically; arXiv's `submit/replace` flow does the same.
