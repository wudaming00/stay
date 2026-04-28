# Stay System Prompt License (v1, 2026)

This license governs use of the file `src/lib/system-prompt.ts` and any
substantially-derivative system prompts. It does NOT govern any other file
in this repository — the rest of the codebase, the test suite, the runner,
the documentation, and the methodology infrastructure are released under
the **MIT** license (see `LICENSE`).

## Why this is not MIT

The system prompt encodes specific clinical-design choices:

- The **method-driven imminent-risk SOP** in `system-prompt.ts` (§"Imminent
  (specific plan + method + time, or means in hand)") encodes a
  deliberate alternative to two known failure modes (spam-anchoring and
  cold-handoff) at the highest-acuity moment a user can present in.
- The **leverage-prevention rule** (the eighth inviolable rule + the
  "Reasons-for-living are sacred, not leverage" section) encodes a
  refusal to weaponize a user's named protective factors.
- The **stabilization-window safety planning trigger** encodes a specific
  clinical timing for offering Stanley-Brown plan construction.

A polite request not to remove these from forks (as the prior version of
the paper attempted) is unenforceable. A license-level constraint is.

This license grants broad redistribution and modification rights with
specific carve-outs for these safety-critical sections.

## Grant

Subject to the conditions below, you are granted a perpetual, worldwide,
royalty-free, non-exclusive license to use, copy, modify, distribute, and
sublicense the licensed file (`src/lib/system-prompt.ts`) and any
substantially-derivative system prompt, for any purpose including
commercial use.

## Conditions

You may modify the licensed file freely. However, derived works that
distribute, deploy, or commercially use the modified file (or a
substantially-similar prompt) must comply with the following:

### 1. Safety-critical sections retained or replaced, not removed

You may **not** distribute or deploy a derived work that has removed any of
the following sections without replacement of equivalent or stronger
clinical function:

- **The imminent-risk SOP** (currently labeled "Imminent (specific plan +
  method + time, or means in hand)" in the licensed file). The 6-step
  method-driven persuasion procedure may be edited to reflect different
  clinical orthodoxies, but a derived prompt must contain SOME procedure
  for handling acute imminent-risk presentations. Removing all such
  procedure is not permitted.

- **The leverage-prevention rule** (currently inviolable rule #8 +
  "Reasons-for-living are sacred, not leverage" section). A derived
  prompt may modify the specific banned phrasings or extend the
  protected categories, but must not remove the prohibition against
  using user-named protective factors as motivation to live.

- **The stop-988 compliance rule** (currently in the suicide protocol's
  "CRITICAL — after you mention 988 substantively once, DO NOT keep
  repeating it" section). A derived prompt must contain SOME mechanism
  that prevents resource-name spam after first substantive mention.

### 2. Reviewer-of-record disclosure

If you deploy a derived work to real users in a context that may include
acute mental-health distress, you must publish a "Responsible-Deployment
Manifest" at a stable URL accessible to your users, which must include:

- The declared positioning of your system (what it is FOR; what human
  services it complements vs substitutes for; what it is NOT designed to
  handle)
- The named clinical reviewer-of-record (or a statement that no clinical
  reviewer is involved, with reasoning)
- The jurisdiction(s) of deployment
- Your commitment, if any, to adverse-event reporting and to whom

This is a transparency requirement. It does not require any specific
governance structure; it requires that whatever structure you have (or
don't) is publicly known.

### 3. Attribution

A derived work must retain a notice in the system prompt or in
prominent project documentation that includes:

> Derived from Stay (https://github.com/wudaming00/stay) under the Stay
> System Prompt License v1. The original imminent-risk SOP and
> leverage-prevention rules are retained / modified / extended [pick one
> and describe]. Responsible-Deployment Manifest at [URL].

### 4. No "endorsed by Stay" claims

Use of the project name "Stay" or implication that the original authors
endorse a derived work requires written permission. The methodology is
free to fork; the brand is not.

### 5. No medical-device misuse

This license does not authorize use of the licensed file as part of a
regulated medical device under FDA, EU MDR, or equivalent jurisdictional
authority without separate compliance with those regulations. The license
grant does not constitute a Substantial Equivalence claim, a Predicate
Device basis, or any other regulatory pathway argument.

## Disclaimer

THE LICENSED FILE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND
CLINICAL EFFICACY. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION
WITH THE LICENSED FILE OR THE USE OR OTHER DEALINGS IN THE LICENSED FILE.

## Termination

This license terminates automatically if you violate any of its
conditions. On termination, you must cease all use, distribution, and
deployment of the licensed file (or substantially-derivative prompts)
within 90 days. Sections 1, 4, 5, and the Disclaimer survive termination.

## Compatibility

The MIT-licensed portions of this repository (everything other than the
licensed file) may be combined with this licensed file in a single
deployed product without licensing conflict. The licensed file's
restrictions apply only to the file itself and to substantially-derivative
prompts.

A "substantially-derivative" prompt is one that retains a majority of the
specific behavioral rules, protocols, and SOPs from the licensed file.
A prompt that takes only the structural pattern (8 rules + 12 protocols +
imminent SOP + self-check) but writes original content for each is NOT
substantially derivative and falls under MIT.

## Versioning

This is the Stay System Prompt License v1, dated 2026-04-29. Future
versions may be issued; users may apply this version perpetually or
upgrade voluntarily.

---

Questions: hello@thestay.app
