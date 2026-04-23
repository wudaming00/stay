"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "stay:age-confirmed-v1";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setConfirmed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setConfirmed(true); // if storage unavailable, don't block
    }
  }, []);

  if (confirmed === null) {
    // Avoid flash before hydration check
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-sans text-sm text-foreground-tertiary">
          loading…
        </span>
      </div>
    );
  }

  if (!confirmed) {
    return <Gate onConfirm={() => setConfirmed(true)} />;
  }

  return <>{children}</>;
}

function Gate({ onConfirm }: { onConfirm: () => void }) {
  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    onConfirm();
  }

  return (
    <div className="relative z-10 flex min-h-full flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-lg space-y-8 font-serif text-foreground">
        <div className="space-y-3 text-lg leading-relaxed">
          <p>
            Stay is for people 18 and older. It is not therapy, not medical
            advice, and not a substitute for a real human in a real crisis.
          </p>
          <p>
            If you might hurt yourself or someone else, please call or text
            988. If you may be in immediate danger, call 911.
          </p>
          <p className="text-foreground-secondary">
            By continuing, you confirm you are 18 or older and have read{" "}
            <Link href="/terms" className="text-accent underline">
              the terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent underline">
              the privacy notes
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={accept}
            className="rounded-2xl border border-accent bg-accent px-5 py-3 font-sans text-base text-background transition-colors hover:bg-accent-hover"
          >
            I&apos;m 18 or older — continue
          </button>
          <Link
            href="/resources"
            className="rounded-2xl border border-border-strong px-5 py-3 text-center font-sans text-base text-foreground-secondary transition-colors hover:border-foreground-secondary hover:text-foreground"
          >
            I need help right now
          </Link>
        </div>
      </div>
    </div>
  );
}
