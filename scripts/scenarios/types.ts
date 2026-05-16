/**
 * Scenario test types.
 *
 * A scenario is a named, reproducible conversation between a simulated user
 * (driven by a persona-prompted Claude) and System X (the production system
 * prompt + tools). Assertions describe must-pass criteria for the
 * resulting transcript.
 *
 * Philosophy: scenarios are REGRESSION tests. They check that prompt edits
 * do not break behavior we have agreed (with clinicians) is correct. They
 * are not training data. They are not used to auto-evolve the prompt.
 *
 * Add scenarios; never delete a passing one without clinician sign-off.
 */
export type Severity = "critical" | "major" | "minor";

export interface Turn {
  role: "user" | "assistant";
  content: string;
  /** Tool calls System X made on this turn (only present on assistant turns). */
  tools?: Array<{
    name: string;
    input: Record<string, unknown>;
  }>;
}

export interface ScenarioContext {
  /** Full transcript so far, oldest first. */
  transcript: Turn[];
  /** Convenience: only assistant turns. */
  assistant: Turn[];
  /** Convenience: all assistant text concatenated. */
  assistantText: string;
  /** Convenience: all tool calls System X made, flattened. */
  tools: Array<{ name: string; input: Record<string, unknown>; turnIndex: number }>;
}

/** Pre-canned assertion result from a synchronous check. */
export interface AssertionResult {
  passed: boolean;
  /** Short diagnostic for the report. Empty when passed. */
  diagnostic?: string;
}

export interface BaseAssertion {
  /** Human-readable description of what is being checked. */
  description: string;
  /** Assertion severity — critical fails block deployment. */
  severity: Severity;
  /**
   * Optional traceability tag pointing to the specification rule this
   * assertion enforces. Format examples:
   *   "inviolable.8" / "inviolable.6" / "inviolable.10" — one of the 10 inviolable rules
   *   "protocol.10" — one of the 12 calibrated behavioral protocols
   *   "imminent_sop.step_2" — a step in the method-driven imminent SOP
   *   "phrases_to_avoid" — the banned-phrase section of the prompt
   *   "language_handling" — non-English / non-US handling
   *   "" or undefined — assertion is for general behavior, not tied to a
   *     specific rule (lower-severity calibration checks)
   *
   * `npm run check-rule-coverage` enforces that every inviolable rule and
   * every numbered protocol has at least one critical assertion tagged to
   * it. This is the rule-↔-assertion invariant operationalized as CI.
   */
  rule?: string;
}

export interface MustCallTool extends BaseAssertion {
  kind: "must_call_tool";
  tool: string;
  /** Optional: subset of input fields that must match. */
  withInput?: Record<string, unknown>;
}

export interface MustNotCallTool extends BaseAssertion {
  kind: "must_not_call_tool";
  tool: string;
  /** Optional: only fail if input matches this subset. */
  withInput?: Record<string, unknown>;
}

export interface MustMatch extends BaseAssertion {
  kind: "must_match";
  pattern: RegExp;
  /** Where to look. Defaults to "any_assistant_text". */
  scope?: "any_assistant_text" | "first_response" | "final_response";
}

export interface MustNotMatch extends BaseAssertion {
  kind: "must_not_match";
  pattern: RegExp;
  scope?: "any_assistant_text" | "first_response" | "final_response" | "after_first_assistant_turn";
}

export interface MaxOccurrences extends BaseAssertion {
  kind: "max_occurrences";
  pattern: RegExp;
  max: number;
  /** "any_assistant_text" (default) counts in all assistant turns. */
  scope?: "any_assistant_text";
}

/**
 * LLM-as-judge: a separate Claude call evaluates whether a proposition is
 * true of the transcript. Use sparingly — judges add cost and variance.
 * Reserve for properties not cleanly expressible as regex/tool checks.
 */
export interface JudgeAssertion extends BaseAssertion {
  kind: "judge";
  /** A YES/NO proposition for the judge. Should be specific and testable. */
  proposition: string;
}

export type Assertion =
  | MustCallTool
  | MustNotCallTool
  | MustMatch
  | MustNotMatch
  | MaxOccurrences
  | JudgeAssertion;

export interface Scenario {
  /** Stable unique id, snake_case. Used in report and CI gating. */
  id: string;
  /** Free-text category for grouping. */
  category:
    | "suicide"
    | "dv"
    | "leverage"
    | "trauma"
    | "psychosis-mania"
    | "ocd"
    | "ed"
    | "substance"
    | "threats"
    | "caregiver"
    | "daily"
    | "calibration"
    | "agency";
  /** Short summary for the report. */
  description: string;
  /**
   * Persona prompt for the simulated-user Claude. Should describe who the
   * persona is, what state they are in, what they would and would not say,
   * how they should respond to System X's offers and questions, and explicit
   * end-conditions ("if System X says X, reply 'thanks' and stop").
   *
   * The persona MUST end with: "Reply only as the user. Do not narrate.
   * Do not break character. Keep responses 1-3 sentences."
   */
  persona: string;
  /** First user message (the scenario opener). Sent verbatim. */
  opening: string;
  /** Max user turns (excluding the opener). Stop early if user-sim signals end. */
  maxTurns: number;
  /** Assertions evaluated against the resulting transcript. */
  assertions: Assertion[];
}

export interface ScenarioRun {
  scenario: Scenario;
  transcript: Turn[];
  results: Array<{
    assertion: Assertion;
    result: AssertionResult;
  }>;
  /** True if all critical assertions passed. */
  passed: boolean;
  /** Wall time in ms. */
  durationMs: number;
  /** Error during run (network, model, parse). Run counts as failed. */
  error?: string;
}
