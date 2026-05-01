# Archive

Superseded design documents and earlier preprint versions, preserved for audit-trail and reproducibility purposes. Files in this directory are *not* the current authoritative versions; they are kept so that:

- Citations of earlier preprint versions resolve.
- Readers tracing the design evolution of Stay's safety SOPs can see the history.
- The PDFs of earlier preprint versions remain hosted at stable paths.

## Current authoritative versions

| Old (in this archive) | Current authoritative location |
|---|---|
| `preprint-draft.md` / `preprint-v0.2-draft.md` / ... / `preprint-v0.5-draft.md` | [`../preprint-v0.6-draft.md`](../preprint-v0.6-draft.md) (note: itself superseded by Papers A and B post-split — see top of file) |
| `preprint-v0.5.pdf`, `preprint-v0.6.pdf` | Re-generate from current `preprint-v0.6-draft.md` (PDFs in archive are stale and have not been regenerated since the paper-split commit) |
| `system-prompt-v0.en.md` / `system-prompt-v0.1.en.md` / `system-prompt-v0.2.en.md` | [`../../src/lib/system-prompt.ts`](../../src/lib/system-prompt.ts) (the production system prompt; note that `LICENSE-PROMPT.md` in repo root governs that file) |
| `crisis-sop-v0.en.md` / `crisis-sop-v0.1.en.md` | Folded into [`../../src/lib/system-prompt.ts`](../../src/lib/system-prompt.ts) under the Per-population SOPs section |
| `architecture-v0.en.md` | Updated architecture coverage is in [`../paper-A-engineering-ethics-draft.md`](../paper-A-engineering-ethics-draft.md) §3 (Stay as a reference implementation) and [`../deployment-conditions.md`](../deployment-conditions.md) |
| `constitution-v0.en.md` | Early framing doc that called itself the system prompt; superseded by the production system prompt in [`../../src/lib/system-prompt.ts`](../../src/lib/system-prompt.ts) (governed by [`../../LICENSE-PROMPT.md`](../../LICENSE-PROMPT.md)) |

These archived files should not be linked from new documents — link to the current authoritative versions above instead.
