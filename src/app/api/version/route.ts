import { SYSTEM_PROMPT } from "@/lib/system-prompt";

/**
 * Public health-check endpoint for the deployed system prompt.
 *
 * Returns metadata about the active SYSTEM_PROMPT — no user data, no
 * conversation content. Useful for verifying which spec version is in
 * production after a deploy, and for debugging compliance issues
 * (e.g., "is companion-during-call language present in the prompt?").
 *
 * No authentication. Output is exactly what the system prompt advertises;
 * the prompt itself is open-source.
 */
export const runtime = "nodejs";

export async function GET() {
  // Sanity probes: does the deployed prompt actually contain the v0.8
  // markers we shipped? If any of these returns false, the deploy is wrong.
  const checks = {
    has_agency_trajectory_principle: SYSTEM_PROMPT.includes(
      "agency trajectory"
    ),
    has_seven_functions_section: SYSTEM_PROMPT.includes(
      "Seven functions you perform"
    ),
    has_companion_during_call: SYSTEM_PROMPT.includes("while you dial"),
    has_988_hard_rule: SYSTEM_PROMPT.includes(
      "HARD RULE — read before generating any response"
    ),
    has_self_check_rubric: /# Self-check before each response/.test(
      SYSTEM_PROMPT
    ),
    has_leverage_prevention: SYSTEM_PROMPT.includes(
      "Reasons-for-living are sacred"
    ),
    has_imminent_sop: SYSTEM_PROMPT.includes(
      "method-driven persuasion"
    ),
  };

  return Response.json(
    {
      spec_label: "v0.8-agency-trajectory",
      git_commit:
        process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
      git_branch: process.env.VERCEL_GIT_COMMIT_REF ?? "unknown",
      deployed_at:
        process.env.VERCEL_DEPLOYMENT_CREATED_AT ??
        new Date().toISOString(),
      prompt_length_chars: SYSTEM_PROMPT.length,
      prompt_first_300_chars: SYSTEM_PROMPT.slice(0, 300),
      checks,
      all_checks_pass: Object.values(checks).every(Boolean),
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
