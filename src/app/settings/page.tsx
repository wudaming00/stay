"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import {
  deleteEverything,
  newSession,
  loadSession,
  getCurrentSessionId,
} from "@/lib/storage";
import { deleteDeviceKey } from "@/lib/crypto";

export default function SettingsPage() {
  const [count, setCount] = useState<number | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  async function refresh() {
    try {
      const id = getCurrentSessionId();
      const stored = await loadSession(id);
      setCount(stored?.length ?? 0);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function startNew() {
    setWorking("new");
    try {
      newSession();
      await refresh();
      window.dispatchEvent(new Event("stay:new-conversation"));
    } finally {
      setWorking(null);
    }
  }

  async function downloadAll() {
    setWorking("download");
    try {
      const id = getCurrentSessionId();
      const stored = await loadSession(id);
      const blob = new Blob([JSON.stringify(stored ?? [], null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stay-conversation-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setWorking(null);
    }
  }

  async function deleteAll() {
    const phrase = window.prompt(
      'This will permanently delete every conversation on this device. Type "delete" to confirm.'
    );
    if (phrase?.toLowerCase() !== "delete") return;
    setWorking("delete");
    try {
      await deleteEverything();
      deleteDeviceKey();
      await refresh();
    } finally {
      setWorking(null);
    }
  }

  return (
    <main className="relative z-10 flex min-h-full flex-1 flex-col">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Wordmark size="md" />
          <Link
            href="/"
            className="font-sans text-xs text-foreground-tertiary transition-colors hover:text-foreground"
          >
            ← back
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-medium leading-tight">
          Your data
        </h1>
        <p className="mt-3 font-serif text-foreground-secondary">
          Everything is stored encrypted on this device only. Nothing is on
          our servers.
        </p>

        <section className="mt-10 space-y-8 font-sans text-sm">
          <Row
            label="Current conversation"
            value={
              count === null
                ? "loading…"
                : `${count} message${count === 1 ? "" : "s"}, encrypted on this device`
            }
            actionLabel={working === "new" ? "starting…" : "start new"}
            onAction={startNew}
            disabled={working !== null}
          />
          <Row
            label="Download your data"
            value="Export the current conversation as a JSON file."
            actionLabel={working === "download" ? "preparing…" : "download"}
            onAction={downloadAll}
            disabled={working !== null}
          />
          <Row
            label="Delete everything"
            value="Permanently remove every conversation on this device. This cannot be undone."
            actionLabel={working === "delete" ? "deleting…" : "delete all"}
            onAction={deleteAll}
            disabled={working !== null}
            destructive
          />
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-xl font-medium">Retention</h2>
          <p className="mt-2 font-serif text-foreground-secondary">
            Default: encrypted on this device, automatically deleted after 90
            days. More retention options — including immediate-only mode and
            cross-device backup — coming soon. See{" "}
            <Link href="/privacy" className="text-accent underline">
              privacy
            </Link>{" "}
            for the architecture.
          </p>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-xl font-medium">Quick exit</h2>
          <p className="mt-2 font-serif text-foreground-secondary">
            The button in the top right of every page (or pressing Escape)
            takes you to google.com immediately and clears your conversation
            from this device. Use this if someone walks in unexpectedly.
          </p>
        </section>
      </article>

      <footer className="shrink-0 border-t border-border px-6 py-4">
        <div className="mx-auto max-w-2xl text-center font-sans text-xs text-foreground-tertiary">
          <Link href="/" className="hover:text-foreground">
            ← talk to Stay
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Row({
  label,
  value,
  actionLabel,
  onAction,
  disabled,
  destructive,
}: {
  label: string;
  value: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-6 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="mt-1 text-foreground-secondary">{value}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className={`shrink-0 rounded-md border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
          destructive
            ? "border-red-300/40 text-red-700/80 hover:border-red-500 hover:text-red-700"
            : "border-border-strong text-foreground-secondary hover:border-foreground-secondary hover:text-foreground"
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
