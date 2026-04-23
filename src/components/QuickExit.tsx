"use client";

import { useEffect, useState } from "react";

/**
 * Emergency Quick Exit — DV-shelter pattern.
 * One click (or Escape) redirects to google.com, clears in-memory state,
 * and overwrites history.
 */
export default function QuickExit() {
  const [hover, setHover] = useState(false);

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
    <div className="relative">
      <button
        type="button"
        onClick={exit}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        title="Emergency exit — press Esc anytime"
        aria-label="Emergency quick exit — leaves this page and clears screen"
        className="btn btn-secondary btn-xs"
      >
        <ExitIcon />
        <span>exit</span>
      </button>
      {hover && (
        <span
          role="tooltip"
          className="absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-md border border-border bg-background px-3 py-1.5 font-sans text-[11px] leading-relaxed text-foreground-secondary shadow-sm"
        >
          goes to google.com · clears screen · Esc anytime
        </span>
      )}
    </div>
  );
}

function ExitIcon() {
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
      <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" />
      <path d="M8 4l3 3-3 3" />
      <path d="M11 7H5" />
    </svg>
  );
}
