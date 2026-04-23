"use client";

import { useEffect, useState } from "react";

/**
 * Emergency Quick Exit — DV-shelter pattern.
 *
 * One click (or Esc key):
 *  - fires `stay:quick-exit` event so Chat clears in-memory state
 *  - replaces window history so back-button doesn't return to Stay
 *  - redirects to google.com (neutral cover page)
 *
 * Used when someone needs to leave fast — abusive partner approaching, shared
 * device situation, parent walking in. The Esc key binding matters because
 * users may not have time to look for the button.
 */
export default function QuickExit() {
  const [hovering, setHovering] = useState(false);

  function exit() {
    try {
      window.dispatchEvent(new Event("stay:quick-exit"));
      window.history.replaceState({}, "", "https://google.com");
    } finally {
      window.location.replace("https://google.com");
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        exit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={exit}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      title="Leave this page immediately. Goes to google.com and clears your screen. (Esc)"
      aria-label="Emergency quick exit — leave this page immediately"
      className="group relative flex items-center gap-1.5 rounded-md border border-border-strong bg-background-elevated px-2.5 py-1 font-sans text-xs text-foreground-secondary transition-colors hover:border-foreground-secondary hover:text-foreground"
    >
      <span aria-hidden className="text-sm leading-none">↗</span>
      <span>quick exit</span>
      {hovering && (
        <span className="absolute right-0 top-full z-50 mt-1 whitespace-nowrap rounded-md border border-border bg-background px-2.5 py-1.5 font-sans text-[11px] text-foreground-secondary shadow-sm">
          leaves to google.com · clears screen · press Esc anytime
        </span>
      )}
    </button>
  );
}
