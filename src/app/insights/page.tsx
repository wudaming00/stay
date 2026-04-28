"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { listInsights, deleteInsight, type Insight } from "@/lib/insights";

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[] | null>(null);

  async function refresh() {
    try {
      const list = await listInsights();
      setInsights(list.slice().reverse());
    } catch {
      setInsights([]);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function forget(id: string) {
    await deleteInsight(id);
    void refresh();
  }

  return (
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-medium leading-tight text-foreground">
          Things you wanted to keep.
        </h1>
        <p className="mt-3 font-serif text-foreground-secondary">
          Sentences you said in conversation that you didn&apos;t want to
          forget. Encrypted on this device. Yours alone.
        </p>

        <div className="mt-10">
          {insights === null && (
            <p className="font-sans text-sm text-foreground-tertiary">
              loading…
            </p>
          )}

          {insights !== null && insights.length === 0 && (
            <div className="space-y-4 rounded-2xl border border-border bg-background-elevated/40 px-5 py-6 font-serif text-foreground-secondary">
              <p>
                Nothing kept yet. In any conversation, hover over your own
                messages and click <span className="text-accent">★ keep</span>{" "}
                — or accept Stay&apos;s &ldquo;before you go&rdquo; card —
                and the sentence will land here.
              </p>
              <p className="font-sans text-sm">
                <Link
                  href="/"
                  className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
                >
                  go talk to Stay →
                </Link>
              </p>
            </div>
          )}

          {insights !== null && insights.length > 0 && (
            <ul className="space-y-4">
              {insights.map((it) => (
                <li
                  key={it.id}
                  className="group relative rounded-2xl border border-border bg-background-elevated/40 px-5 py-5 transition-colors hover:border-border-strong"
                >
                  <blockquote className="border-l-2 border-accent pl-4 font-serif text-lg leading-relaxed text-foreground">
                    &ldquo;{it.text}&rdquo;
                  </blockquote>
                  <div className="mt-3 flex items-center justify-between font-sans text-[11px] text-foreground-tertiary">
                    <span>{formatDate(it.createdAt)}</span>
                    <button
                      type="button"
                      onClick={() => forget(it.id)}
                      className="opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                      aria-label="forget this insight"
                    >
                      forget
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {insights !== null && insights.length > 0 && (
          <p className="mt-10 font-serif text-sm text-foreground-tertiary">
            No streaks. No reminders. No counts you should hit. Just a quiet
            place to find what you said when it mattered.
          </p>
        )}
      </article>
    </PageShell>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return `today, ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}
