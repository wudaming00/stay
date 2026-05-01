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
- The **no-third-party-characterization rule** (the section "No
  third-party characterization stronger than the user's own words")
  encodes a refusal to escalate the user's framing of an absent third
  party (partner, parent, friend, etc.) the AI cannot interview.
- The **companion-during-call requirement** (the §"Bridge with
  companionship" function and the imminent-risk SOP step that names it)
  encodes the design choice that AI stays available while the user is
  on a crisis-line call rather than exiting at handoff. This protocol
  is designated *preserved-pending-clinical-validation*: its
  evidence-base is the warm-handoff and crisis-line operational
  literature broadly (Gould et al. 2007; Mishara & Daigle on
  Samaritans), not single-utterance experimental validation specific
  to AI-companion-during-call interactions; the protocol is preserved
  here pending clinical reviewer-of-record sign-off, and the
  reviewer-of-record substitution path in §2 is the explicit update
  channel.
- The **stabilization-window safety planning trigger** and the
  **stop-988 compliance rule** are also clinical-design choices in the
  prompt; they are not designated as license-protected sections in §1
  below (a derived prompt may modify their exact mechanics) but are
  documented here for completeness.

A polite request not to remove these from forks (as the prior version of
the paper attempted) is unenforceable. A license-level constraint is.

This license grants broad redistribution and modification rights with
specific carve-outs for the safety-critical sections enumerated as
§1.a–§1.d below.

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
the following four sections without replacement of equivalent or stronger
clinical function. These are the sections marked with
`<!-- PROTECTED SECTION: ... see LICENSE-PROMPT.md §1.a -->` (etc.) HTML
comments in the licensed file.

#### §1.a The imminent-risk SOP

(Currently labeled "Imminent (specific plan + method + time, or means in
hand) — method-driven persuasion with companion-during-call" in the
licensed file.) The 6-step method-driven persuasion procedure may be
edited to reflect different clinical orthodoxies, but a derived prompt
must contain SOME procedure for handling acute imminent-risk
presentations. Removing all such procedure is not permitted.

#### §1.b The leverage-prevention rule

(Currently inviolable rule #8 + the "Reasons-for-living are sacred, not
leverage" section.) A derived prompt may modify the specific banned
phrasings or extend the protected categories, but must not remove the
prohibition against using user-named protective factors as motivation to
live.

#### §1.c The no-third-party-characterization rule

(Currently the section "No third-party characterization stronger than
the user's own words.") A derived prompt may modify the exact phrasings
or refine the exception list, but must not remove the prohibition
against escalating the user's framing of an absent third party
(partner, parent, friend, family member) the AI cannot interview.

#### §1.d The companion-during-call requirement

(Currently the §"5. Bridge with companionship" function and the
imminent-risk SOP step that names "stay-during-call framing.") **This
section is designated preserved-pending-clinical-validation**: a derived
prompt may modify the exact mechanics, but must not remove the design
intent of "AI stays available while the user is on a crisis-line call"
(as distinct from cold-handoff "I'm not equipped, please call 988"
patterns the section exists to prevent). The reviewer-of-record path
in §2 is the explicit update channel for substantive modifications to
this section pending clinical-evidence-base development.

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
