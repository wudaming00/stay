"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  listEntries,
  deleteEntry,
  deleteAllEntries,
  exportMarkdown,
  isDiaryEnabled,
  setDiaryEnabled,
} from "@/lib/diary";
import type { DiaryEntry } from "@/lib/types";

export default function LogPage() {
  const [entries, setEntries] = useState<DiaryEntry[] | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);

  async function refresh() {
    try {
      setEntries(await listEntries());
    } catch {
      setEntries([]);
    }
    setEnabled(isDiaryEnabled());
  }

  useEffect(() => {
    void refresh();
  }, []);

  function toggleEnabled() {
    const next = !enabled;
    setDiaryEnabled(next);
    setEnabled(next);
  }

  async function forget(id: string) {
    await deleteEntry(id);
    void refresh();
  }

  async function clearAll() {
    if (
      !window.confirm(
        "Delete every diary entry? This cannot be undone."
      )
    )
      return;
    await deleteAllEntries();
    void refresh();
  }

  function downloadMarkdown() {
    if (!entries) return;
    const md = exportMarkdown(entries);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stay-diary-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const grouped = groupByDay(entries ?? []);

  return (
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-medium leading-tight text-foreground">
          Diary log.
        </h1>
        <p className="mt-3 font-serif text-foreground-secondary">
          When you talked to Stay about a feeling, an urge, an event, or a
          skill you used — it was quietly written here. Encrypted on this
          device. Yours alone. Show your therapist if you want, or
          don&apos;t.
        </p>

        <div className="mt-10">
          {(entries === null || enabled === null) && (
            <p className="font-sans text-sm text-foreground-tertiary">
              loading…
            </p>
          )}

          {enabled === false && (
            <div className="space-y-5 rounded-2xl border border-border bg-background-elevated/40 px-5 py-6 font-serif text-foreground-secondary">
              <p>
                The diary log is <strong>off by default</strong>. Stay
                won&apos;t auto-extract or store anything until you turn it
                on here.
              </p>
              <p className="text-sm">
                When on: each time you describe an emotion with intensity,
                an urge (acted on or resisted), an event, or a coping skill
                you used, Stay quietly writes a one-line structured entry
                here. Encrypted on this device. Yours alone. Exportable as
                Markdown for your therapist.
              </p>
              <p className="text-sm text-foreground-tertiary">
                Some people don&apos;t want anything written down. That is
                an honest position. Leave this off if so.
              </p>
              <button
                type="button"
                onClick={toggleEnabled}
                className="rounded-md border border-accent bg-accent px-4 py-2 font-sans text-sm text-background transition-colors hover:bg-accent-hover"
              >
                turn on diary log
              </button>
            </div>
          )}

          {enabled === true && entries !== null && entries.length === 0 && (
            <div className="space-y-4 rounded-2xl border border-border bg-background-elevated/40 px-5 py-6 font-serif text-foreground-secondary">
              <p>
                Diary is on. Nothing logged yet. Stay writes here in the
                background when you mention an emotion with intensity, an
                urge (acted on or resisted), an event, or a coping skill
                you used.
              </p>
              <p className="font-sans text-sm">
                <Link
                  href="/"
                  className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
                >
                  go talk to Stay →
                </Link>
                {"   ·   "}
                <button
                  type="button"
                  onClick={toggleEnabled}
                  className="text-foreground-tertiary underline decoration-foreground-tertiary/40 underline-offset-2 hover:text-foreground"
                >
                  turn diary off
                </button>
              </p>
            </div>
          )}

          {enabled === true && entries !== null && entries.length > 0 && (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-3 font-sans text-xs">
                <button
                  type="button"
                  onClick={downloadMarkdown}
                  className="rounded-full border border-border px-3 py-1.5 text-foreground-secondary hover:border-border-strong hover:text-foreground"
                >
                  export markdown
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-full border border-border px-3 py-1.5 text-foreground-tertiary hover:border-border-strong hover:text-foreground"
                >
                  delete all
                </button>
                <button
                  type="button"
                  onClick={toggleEnabled}
                  className="rounded-full border border-border px-3 py-1.5 text-foreground-tertiary hover:border-border-strong hover:text-foreground"
                >
                  turn diary off
                </button>
              </div>

              <ul className="space-y-8">
                {grouped.map(([day, items]) => (
                  <li key={day}>
                    <h2 className="mb-3 font-sans text-xs uppercase tracking-wider text-foreground-tertiary">
                      {formatDay(day)}
                    </h2>
                    <ul className="space-y-3">
                      {items.map((e) => (
                        <li
                          key={e.id}
                          className="group relative rounded-2xl border border-border bg-background-elevated/40 px-5 py-4"
                        >
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-base text-foreground">
                            <span className="font-sans text-xs text-foreground-tertiary">
                              {formatTime(e.createdAt)}
                            </span>
                            <EntryFields e={e} />
                          </div>
                          <button
                            type="button"
                            onClick={() => forget(e.id)}
                            className="absolute right-4 top-4 font-sans text-[11px] text-foreground-tertiary opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                            aria-label="delete this entry"
                          >
                            forget
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {entries !== null && entries.length > 0 && (
          <p className="mt-10 font-serif text-sm text-foreground-tertiary">
            No streaks. No reminders. No counts you should hit. Just what
            you said, when you said it.
          </p>
        )}
      </article>
    </PageShell>
  );
}

function EntryFields({ e }: { e: DiaryEntry }) {
  const parts: string[] = [];
  if (e.emotion) {
    parts.push(
      e.emotion_intensity != null
        ? `${e.emotion} (${e.emotion_intensity}/10)`
        : e.emotion
    );
  }
  if (e.urge) {
    const intensity =
      e.urge_intensity != null ? ` (${e.urge_intensity}/10)` : "";
    const acted =
      e.urge_acted_on === true
        ? " — acted"
        : e.urge_acted_on === false
        ? " — resisted"
        : "";
    parts.push(`urge: ${e.urge}${intensity}${acted}`);
  }
  if (e.event_summary) parts.push(e.event_summary);
  if (e.skill_used) parts.push(`skill: ${e.skill_used}`);
  if (e.notes) parts.push(`note: ${e.notes}`);
  return <span>{parts.join(" · ")}</span>;
}

function groupByDay(entries: DiaryEntry[]): [string, DiaryEntry[]][] {
  const map = new Map<string, DiaryEntry[]>();
  for (const e of entries) {
    const day = new Date(e.createdAt).toISOString().slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(e);
  }
  return Array.from(map.entries());
}

function formatDay(day: string): string {
  const today = new Date().toISOString().slice(0, 10);
  if (day === today) return "today";
  const yest = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  if (day === yest) return "yesterday";
  return new Date(day + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
