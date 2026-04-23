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
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        type="button"
        onClick={newConversation}
        title="Start a new conversation"
        aria-label="Start a new conversation"
        className="btn btn-ghost btn-xs hidden sm:inline-flex"
      >
        <NewIcon />
        <span>new</span>
      </button>
      <Link
        href="/resources"
        title="Crisis resources"
        className="btn btn-ghost btn-xs hidden sm:inline-flex"
      >
        <HelpIcon />
        <span>help</span>
      </Link>
      <QuickExit />
    </div>
  );
}

function NewIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M7 3v8M3 7h8" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="7" cy="7" r="5" />
      <path d="M5.5 5.5a1.5 1.5 0 0 1 3 0c0 1-1.5 1.25-1.5 2.5" />
      <circle cx="7" cy="10" r="0.5" fill="currentColor" />
    </svg>
  );
}
