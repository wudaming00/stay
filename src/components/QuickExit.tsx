"use client";

/**
 * Quick Exit button — DV-shelter pattern.
 *
 * One click:
 *  - replaces window location with a neutral page (google.com)
 *  - clears in-memory state via window event
 *  - overwrites browser history for current tab
 *
 * Used when a user needs to leave the page fast — abusive partner walks in,
 * shared device situation, etc.
 */
export default function QuickExit() {
  function exit() {
    try {
      window.dispatchEvent(new Event("stay:quick-exit"));
      window.history.replaceState({}, "", "https://google.com");
    } finally {
      window.location.replace("https://google.com");
    }
  }

  return (
    <button
      type="button"
      onClick={exit}
      title="Quick exit (Esc)"
      aria-label="Quick exit — leave this page immediately"
      className="font-sans text-xs text-foreground/35 transition-colors hover:text-foreground"
    >
      exit ✕
    </button>
  );
}
