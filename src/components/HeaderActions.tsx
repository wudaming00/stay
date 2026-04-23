"use client";

import Link from "next/link";
import QuickExit from "./QuickExit";

export default function HeaderActions() {
  function newConversation() {
    if (typeof window === "undefined") return;
    if (
      !window.confirm(
        "Start a new conversation? The current one will still be saved."
      )
    )
      return;
    window.dispatchEvent(new Event("stay:new-conversation"));
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={newConversation}
        title="Start a new conversation"
        aria-label="Start a new conversation"
        className="hidden rounded-md border border-border bg-background-elevated px-2.5 py-1 font-sans text-xs text-foreground-secondary transition-colors hover:border-foreground-secondary hover:text-foreground sm:inline-flex"
      >
        new
      </button>
      <Link
        href="/resources"
        title="Crisis resources"
        className="hidden rounded-md border border-border bg-background-elevated px-2.5 py-1 font-sans text-xs text-foreground-secondary transition-colors hover:border-foreground-secondary hover:text-foreground sm:inline-flex"
      >
        crisis help
      </Link>
      <QuickExit />
    </div>
  );
}
