"use client";

import type { SafetyPlan } from "@/lib/types";

/**
 * Stanley-Brown safety plan rendered in chat + downloadable as plain text.
 *
 * Evidence base: Stanley & Brown (2012); Stanley et al. (2018) JAMA Psychiatry —
 * 45% reduction in suicidal behavior vs usual care in RCT.
 */
export default function SafetyPlanCard({ plan }: { plan: SafetyPlan }) {
  function download() {
    const text = formatSafetyPlan(plan);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safety-plan-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ml-4 animate-fadein rounded-2xl border border-accent bg-background-elevated px-5 py-4 font-sans sm:ml-5">
      <p className="mb-3 text-xs uppercase tracking-widest text-foreground-tertiary">
        your safety plan
      </p>

      <div className="space-y-4 font-serif text-base leading-relaxed text-foreground">
        {plan.warning_signs && plan.warning_signs.length > 0 && (
          <Section title="Warning signs I notice">
            <ul className="list-disc pl-5">
              {plan.warning_signs.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        )}
        {plan.coping_strategies && plan.coping_strategies.length > 0 && (
          <Section title="What helps">
            <ul className="list-disc pl-5">
              {plan.coping_strategies.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        )}
        {plan.social_contacts && plan.social_contacts.length > 0 && (
          <Section title="People I could reach">
            <ul className="list-disc pl-5">
              {plan.social_contacts.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        )}
        {plan.professionals && plan.professionals.length > 0 && (
          <Section title="Professional contacts">
            <ul className="list-disc pl-5">
              {plan.professionals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        )}
        {plan.means_restriction && (
          <Section title="Keeping my space safe">
            <p>{plan.means_restriction}</p>
          </Section>
        )}
        {plan.reasons_for_living && plan.reasons_for_living.length > 0 && (
          <Section title="Reasons I'm still here">
            <ul className="list-disc pl-5">
              {plan.reasons_for_living.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div className="mt-5 border-t border-border pt-4 text-sm">
        <p className="mb-3 text-foreground-secondary">
          Crisis numbers to keep on this page:
        </p>
        <ul className="mb-4 space-y-1 font-mono text-xs text-foreground">
          <li>988 — suicide & crisis (call or text)</li>
          <li>1-800-799-7233 — DV hotline</li>
          <li>911 — immediate danger</li>
        </ul>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={download}
            className="rounded-md border border-accent bg-accent px-3 py-1.5 text-background transition-colors hover:bg-accent-hover"
          >
            ⬇ download as text
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-border-strong px-3 py-1.5 text-foreground-secondary transition-colors hover:text-foreground"
          >
            🖨 print
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 font-sans text-xs font-medium uppercase tracking-wider text-foreground-secondary">
        {title}
      </p>
      {children}
    </div>
  );
}

function formatSafetyPlan(plan: SafetyPlan): string {
  const lines: string[] = [];
  lines.push("MY SAFETY PLAN");
  lines.push(`Created ${new Date().toLocaleDateString()}`);
  lines.push("");

  const sections: [string, string[] | string | undefined][] = [
    ["WARNING SIGNS I NOTICE", plan.warning_signs],
    ["WHAT HELPS", plan.coping_strategies],
    ["PEOPLE I COULD REACH", plan.social_contacts],
    ["PROFESSIONAL CONTACTS", plan.professionals],
    ["KEEPING MY SPACE SAFE", plan.means_restriction],
    ["REASONS I'M STILL HERE", plan.reasons_for_living],
  ];

  for (const [title, content] of sections) {
    if (!content) continue;
    lines.push(title);
    if (Array.isArray(content)) {
      for (const item of content) lines.push(`  - ${item}`);
    } else {
      lines.push(`  ${content}`);
    }
    lines.push("");
  }

  lines.push("CRISIS NUMBERS");
  lines.push("  988 — Suicide & Crisis Lifeline (call or text)");
  lines.push("  1-800-799-7233 — National DV Hotline");
  lines.push("  911 — Emergency");
  lines.push("");
  lines.push("Keep this somewhere easy to find. You're allowed to edit it.");
  return lines.join("\n");
}
