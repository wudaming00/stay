#!/usr/bin/env -S npx tsx
/**
 * Skill structural-integrity check.
 *
 * Enforces invariants on the Claude Skill version of Stay so that the four
 * LICENSE-PROMPT §1.a–§1.d protected sections cannot be silently removed
 * from the skill files without CI screaming.
 *
 * This is structurally different from `check-rule-coverage.ts`, which is
 * scenario-driven (scenarios assert behaviors of the deployed system prompt).
 * The skill has no scenario harness today; the integrity check is a
 * static-text invariant on file contents instead.
 *
 * Exits non-zero on any violation.
 *
 * Usage:
 *   npm run check-skill-integrity
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SKILL_DIR = "skills/stay";

interface RequiredFile {
  path: string;
  minBytes?: number;
}

const REQUIRED_FILES: RequiredFile[] = [
  { path: "SKILL.md", minBytes: 4000 },
  { path: "crisis-protocol.md", minBytes: 10000 },
  { path: "leverage-and-framing.md", minBytes: 5000 },
  { path: "translator-and-mirror.md", minBytes: 5000 },
  { path: "language-and-tone.md", minBytes: 5000 },
  { path: "handoff-to-pwa.md", minBytes: 4000 },
  { path: "ATTRIBUTION.md", minBytes: 2000 },
];

interface ProtectedSection {
  licenseRef: string; // e.g. "§1.a"
  description: string;
  expectedFile: string;
  // Substring that must appear in the open marker so we can locate the
  // section even after editorial paraphrase. Matched case-insensitive.
  openMarkerSubstring: string;
}

const PROTECTED_SECTIONS: ProtectedSection[] = [
  {
    licenseRef: "§1.a",
    description: "Imminent-risk SOP (method-driven persuasion)",
    expectedFile: "crisis-protocol.md",
    openMarkerSubstring: "imminent-risk SOP",
  },
  {
    licenseRef: "§1.b",
    description: "Leverage-prevention rule (reasons-for-living)",
    expectedFile: "leverage-and-framing.md",
    openMarkerSubstring: "leverage-prevention rule",
  },
  {
    licenseRef: "§1.c",
    description: "No-third-party-characterization rule",
    expectedFile: "leverage-and-framing.md",
    openMarkerSubstring: "no-third-party-characterization rule",
  },
  {
    licenseRef: "§1.d",
    description: "Companion-during-call requirement",
    expectedFile: "crisis-protocol.md",
    openMarkerSubstring: "companion-during-call requirement",
  },
];

const DESCRIPTION_MAX_CHARS = 1536; // Claude Skill frontmatter cap

interface Violation {
  severity: "error" | "warn";
  message: string;
}

function checkFile(violations: Violation[], file: RequiredFile): string | null {
  const fullPath = join(SKILL_DIR, file.path);
  if (!existsSync(fullPath)) {
    violations.push({ severity: "error", message: `MISSING: ${fullPath}` });
    return null;
  }
  const content = readFileSync(fullPath, "utf8");
  if (file.minBytes && content.length < file.minBytes) {
    violations.push({
      severity: "error",
      message: `TOO SHORT: ${fullPath} (${content.length} bytes < min ${file.minBytes}). Content likely truncated or stubbed.`,
    });
  }
  return content;
}

function checkProtectedSection(
  violations: Violation[],
  fileContent: string,
  section: ProtectedSection,
): void {
  const lower = fileContent.toLowerCase();
  const sub = section.openMarkerSubstring.toLowerCase();

  // Count <!-- PROTECTED SECTION ... <sub> ... --> open markers
  const openMarkerRe = new RegExp(
    `<!--\\s*PROTECTED SECTION[^>]*${sub.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}[^>]*-->`,
    "gi",
  );
  // Count <!-- /PROTECTED SECTION ... <sub> ... --> close markers
  const closeMarkerRe = new RegExp(
    `<!--\\s*/PROTECTED SECTION[^>]*${sub.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}[^>]*-->`,
    "gi",
  );

  const openCount = (fileContent.match(openMarkerRe) || []).length;
  const closeCount = (fileContent.match(closeMarkerRe) || []).length;

  if (openCount === 0) {
    violations.push({
      severity: "error",
      message: `LICENSE-PROMPT ${section.licenseRef} (${section.description}): no <!-- PROTECTED SECTION ... ${section.openMarkerSubstring} ... --> open marker found in skills/stay/${section.expectedFile}. Required by LICENSE-PROMPT §1.${section.licenseRef.slice(2)}.`,
    });
    return;
  }
  if (openCount !== closeCount) {
    violations.push({
      severity: "error",
      message: `LICENSE-PROMPT ${section.licenseRef}: open/close marker imbalance in ${section.expectedFile} (${openCount} open, ${closeCount} close).`,
    });
  }
  // Heuristic check: section body should have substantive content, not just an empty wrapper.
  // Find the first open marker and check distance to the matching close marker.
  const openMatch = openMarkerRe.exec(fileContent);
  closeMarkerRe.lastIndex = 0;
  const closeMatch = closeMarkerRe.exec(fileContent);
  if (openMatch && closeMatch && closeMatch.index > openMatch.index) {
    const bodyLen = closeMatch.index - (openMatch.index + openMatch[0].length);
    if (bodyLen < 500) {
      violations.push({
        severity: "error",
        message: `LICENSE-PROMPT ${section.licenseRef}: protected section body in ${section.expectedFile} is only ${bodyLen} chars — likely emptied. LICENSE-PROMPT requires the section's clinical function be retained or replaced with equivalent-or-stronger function.`,
      });
    }
  }

  // Reference word check — does the section reference the license clause it preserves?
  const licenseRefRe = new RegExp(`LICENSE-PROMPT\\.md\\s*${section.licenseRef.replace("§", "§")}`);
  if (!licenseRefRe.test(fileContent)) {
    violations.push({
      severity: "warn",
      message: `LICENSE-PROMPT ${section.licenseRef}: file ${section.expectedFile} does not reference "LICENSE-PROMPT.md ${section.licenseRef}" in the marker comment. Consider adding for traceability.`,
    });
  }
}

function checkSkillFrontmatter(violations: Violation[], skillMdContent: string): void {
  // Frontmatter is delimited by --- on its own line at the top
  const m = skillMdContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!m) {
    violations.push({
      severity: "error",
      message: `SKILL.md is missing YAML frontmatter (---...---).`,
    });
    return;
  }
  const fm = m[1];

  // Required: name
  if (!/^name:\s*\S/m.test(fm)) {
    violations.push({ severity: "error", message: `SKILL.md frontmatter missing 'name:' field.` });
  }

  // Required: description, and ≤ DESCRIPTION_MAX_CHARS
  const descMatch = fm.match(/^description:\s*([\s\S]*?)(?=\n[a-z_-]+:\s|$)/m);
  if (!descMatch) {
    violations.push({
      severity: "error",
      message: `SKILL.md frontmatter missing 'description:' field. Claude harness uses this field for auto-invocation; without it the skill will not trigger correctly.`,
    });
    return;
  }
  const desc = descMatch[1].trim();
  if (desc.length === 0) {
    violations.push({ severity: "error", message: `SKILL.md description is empty.` });
  } else if (desc.length > DESCRIPTION_MAX_CHARS) {
    violations.push({
      severity: "error",
      message: `SKILL.md description is ${desc.length} chars; Claude Skill cap is ${DESCRIPTION_MAX_CHARS}. Content beyond the cap is truncated in skill listings.`,
    });
  } else if (desc.length > DESCRIPTION_MAX_CHARS * 0.95) {
    violations.push({
      severity: "warn",
      message: `SKILL.md description is ${desc.length} chars — within 5% of the ${DESCRIPTION_MAX_CHARS} cap. Future edits may push over.`,
    });
  }

  // Both crisis bridging and handoff-to-PWA should be mentioned in the description so
  // host model has accurate auto-invocation signal.
  if (!/988|crisis/i.test(desc)) {
    violations.push({
      severity: "error",
      message: `SKILL.md description does not mention crisis bridging (988 / crisis). Required for host model to recognize this skill handles safety-critical content.`,
    });
  }
  if (!/thestay\.app|hand[s\s]*off/i.test(desc)) {
    violations.push({
      severity: "warn",
      message: `SKILL.md description does not mention handoff to thestay.app. Recommended so users understand the PWA destination for sustained use.`,
    });
  }
}

function main(): void {
  const violations: Violation[] = [];
  const fileContents: Record<string, string> = {};

  // 1. All required files exist and have minimum content
  for (const file of REQUIRED_FILES) {
    const content = checkFile(violations, file);
    if (content) fileContents[file.path] = content;
  }

  // 2. SKILL.md frontmatter integrity
  if (fileContents["SKILL.md"]) {
    checkSkillFrontmatter(violations, fileContents["SKILL.md"]);
  }

  // 3. Each LICENSE-PROMPT §1.a–§1.d section is present in the expected file
  for (const section of PROTECTED_SECTIONS) {
    const content = fileContents[section.expectedFile];
    if (!content) continue; // already reported as missing file
    checkProtectedSection(violations, content, section);
  }

  // Report
  const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
  };

  console.log(`${C.bold}skill structural integrity${C.reset}`);
  console.log(
    `${C.dim}${REQUIRED_FILES.length} required files; ${PROTECTED_SECTIONS.length} LICENSE-PROMPT-protected sections${C.reset}\n`,
  );

  const errors = violations.filter((v) => v.severity === "error");
  const warns = violations.filter((v) => v.severity === "warn");

  for (const v of violations) {
    const tag = v.severity === "error" ? `${C.red}✗ error${C.reset}` : `${C.yellow}? warn${C.reset}`;
    console.log(`  ${tag}  ${v.message}`);
  }

  if (violations.length === 0) {
    console.log(`  ${C.green}✓${C.reset} all checks passed`);
  }

  console.log("");
  console.log(
    `${C.bold}summary${C.reset}: ${
      errors.length > 0 ? `${C.red}${errors.length} error(s)${C.reset}` : `${C.green}0 errors${C.reset}`
    }, ${warns.length > 0 ? `${C.yellow}${warns.length} warning(s)${C.reset}` : `${C.dim}0 warnings${C.reset}`}`,
  );

  if (errors.length > 0) {
    console.log(
      `\n${C.red}FAIL${C.reset}: skill integrity violations detected. LICENSE-PROMPT §1.a–§1.d compliance requires all four protected sections to be present with their clinical function retained (or replaced with equivalent-or-stronger function per LICENSE-PROMPT §1).`,
    );
    process.exit(1);
  }

  console.log(`${C.green}OK${C.reset}: skill structural integrity invariants hold.`);
}

main();
