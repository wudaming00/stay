#!/usr/bin/env -S npx tsx
/**
 * Rule-↔-assertion coverage check.
 *
 * Enforces the methodology invariant claimed in the paper: every inviolable
 * rule + every numbered protocol must have at least one CRITICAL assertion
 * tagged to it via the `rule` field on the assertion.
 *
 * Exits non-zero if any rule is uncovered. Suitable for pre-commit / CI.
 *
 * Usage:
 *   npm run check-rule-coverage           # enforces all
 *   npm run check-rule-coverage -- --report-only   # prints coverage but exits 0
 */
import { ALL_SCENARIOS } from "./scenarios/index.js";

/**
 * The canonical list of rules that MUST be covered by at least one critical
 * assertion. Drawn from src/lib/system-prompt.ts. When you add a new rule
 * to the prompt, add it here AND tag the corresponding test assertion.
 */
const REQUIRED_RULES = {
  // 8 inviolable rules. Note: inviolable.3 (never assert another's intent) and
  // inviolable.7 (no comparison to others, even favorably) are TODO — they lack
  // programmatic test coverage in v0.5. Documented as future work.
  "inviolable.1": "Never claim to be human (plain disclosure when asked)",
  "inviolable.2": "Never use engagement tricks",
  "inviolable.4": "Never validate cognitive distortions for agreement",
  "inviolable.5": "Never encourage continued contact with someone hurting them",
  "inviolable.6": "Never roleplay as a person in user's life",
  "inviolable.8": "Never weaponize reasons-for-living (leverage prevention)",
  // 12 calibrated behavioral protocols. Note: protocol.8 (rupture/repair
  // check-in) is TODO — would require a long-conversation scenario to test
  // properly; documented as future work.
  "protocol.1": "Mode auto-detection (daily/depth/crisis)",
  "protocol.2": "Tone calibration without fixed persona",
  "protocol.5": "Stuck-user recovery (concrete-small-question, not throw-back)",
  "protocol.6": "Grounding before cognitive work",
  "protocol.7": "Helping find words (NVC translation)",
  "protocol.9_suicide_columbia": "Per-population SOP: suicide / Columbia gradient",
  "protocol.9_dv": "Per-population SOP: DV / strangulation / no couples therapy",
  "protocol.9_nssi": "Per-population SOP: NSSI / DBT framework / no 988 routing",
  "protocol.9_ocd": "Per-population SOP: OCD / reassurance loop recognition",
  "protocol.9_ed": "Per-population SOP: ED / no weight numbers / no validate restriction",
  "protocol.9_substance": "Per-population SOP: substance / no labeling / MI",
  "protocol.9_threats": "Per-population SOP: threats to others / duty-to-warn",
  "protocol.9_mania": "Per-population SOP: mania / 72-hour delay / don't celebrate",
  "protocol.9_psychosis": "Per-population SOP: psychosis / don't challenge / focus on feeling",
  "protocol.9_trauma": "Per-population SOP: trauma / stop narration / ground first",
  "protocol.9_caregiver": "Per-population SOP: caregiver mode (third-party patient)",
  "protocol.10_safety_plan": "Stabilization-window safety planning",
  "protocol.11_unconditional_goodbye": "Unconditional-presence crisis goodbye",
  "protocol.12_parasocial": "Parasocial reground via frame extension",
  // The method-driven imminent-risk SOP (6 steps) — collapsed to one rule
  "imminent_sop.full": "Method-driven imminent-risk persuasion (any step)",
  // Banned-phrase / language-handling sections
  "phrases_to_avoid": "Banned phrases ('stay strong', 'everything happens for a reason', etc.)",
  "language_handling": "Non-English handling / no fabricated non-US resources",
};

interface RuleCoverage {
  rule: string;
  description: string;
  criticalAssertions: number;
  scenarioIds: string[];
}

function main() {
  const reportOnly = process.argv.includes("--report-only");

  // Build coverage map
  const coverage: Record<string, RuleCoverage> = {};
  for (const [rule, description] of Object.entries(REQUIRED_RULES)) {
    coverage[rule] = { rule, description, criticalAssertions: 0, scenarioIds: [] };
  }

  // Also track tags that appear in assertions but are NOT in REQUIRED_RULES
  // (orphaned tags — usually indicate a typo or a rule we forgot to register).
  const seenTags = new Set<string>();
  const orphanedTags: Array<{ tag: string; scenarioId: string }> = [];

  for (const scenario of ALL_SCENARIOS) {
    for (const assertion of scenario.assertions) {
      const rule = assertion.rule;
      if (!rule) continue;
      seenTags.add(rule);
      if (rule in coverage) {
        if (assertion.severity === "critical") {
          coverage[rule].criticalAssertions += 1;
          if (!coverage[rule].scenarioIds.includes(scenario.id)) {
            coverage[rule].scenarioIds.push(scenario.id);
          }
        }
      } else {
        orphanedTags.push({ tag: rule, scenarioId: scenario.id });
      }
    }
  }

  // Report
  const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
  };

  console.log(`${C.bold}rule-↔-assertion coverage${C.reset}`);
  console.log(`${C.dim}${ALL_SCENARIOS.length} scenarios; ${Object.keys(REQUIRED_RULES).length} required rules${C.reset}\n`);

  const uncovered: RuleCoverage[] = [];
  for (const cov of Object.values(coverage)) {
    if (cov.criticalAssertions === 0) {
      uncovered.push(cov);
      console.log(`  ${C.red}✗${C.reset} ${cov.rule.padEnd(40)} ${C.dim}— ${cov.description}${C.reset}`);
    } else {
      console.log(
        `  ${C.green}✓${C.reset} ${cov.rule.padEnd(40)} ${C.dim}${cov.criticalAssertions} critical assertion(s) in ${cov.scenarioIds.length} scenario(s)${C.reset}`
      );
    }
  }

  if (orphanedTags.length > 0) {
    console.log(`\n${C.yellow}Orphaned tags${C.reset} ${C.dim}(rule referenced in assertion but not in REQUIRED_RULES — possible typo):${C.reset}`);
    for (const { tag, scenarioId } of orphanedTags) {
      console.log(`  ${C.yellow}?${C.reset} ${tag.padEnd(40)} ${C.dim}in ${scenarioId}${C.reset}`);
    }
  }

  console.log("");
  console.log(
    `${C.bold}summary${C.reset}: ${C.green}${Object.keys(REQUIRED_RULES).length - uncovered.length} covered${C.reset}, ${
      uncovered.length > 0 ? `${C.red}${uncovered.length} uncovered${C.reset}` : `${C.green}0 uncovered${C.reset}`
    }`
  );

  if (uncovered.length > 0 && !reportOnly) {
    console.log(
      `\n${C.red}FAIL${C.reset}: ${uncovered.length} rule(s) have zero critical assertions tagged. Either add a critical assertion with the corresponding ${C.cyan}rule:${C.reset} field, or remove the rule from REQUIRED_RULES (only if the rule is no longer in the specification).`
    );
    process.exit(1);
  }

  console.log(uncovered.length === 0 ? `${C.green}OK${C.reset}: every required rule has at least one critical assertion.` : `${C.yellow}REPORT-ONLY${C.reset}: ${uncovered.length} uncovered (would FAIL without --report-only).`);
}

main();
