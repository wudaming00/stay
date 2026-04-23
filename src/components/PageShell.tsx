import Link from "next/link";
import Wordmark from "./Wordmark";

/**
 * Shared chrome for static pages (about, promises, privacy, faq, resources,
 * settings, terms). Unified header, consistent spacing, gentle footer.
 */
export default function PageShell({
  children,
  backHref = "/",
  backLabel = "back",
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <main className="relative z-10 flex min-h-full flex-1 flex-col">
      <header className="shrink-0 border-b border-border/70 bg-background/80 px-4 py-4 backdrop-blur sm:px-6 sm:py-5">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Wordmark size="md" />
          <Link
            href={backHref}
            className="font-sans text-xs text-foreground-tertiary transition-colors hover:text-foreground"
          >
            ← {backLabel}
          </Link>
        </div>
      </header>

      {children}

      <footer className="shrink-0 border-t border-border/70 px-6 py-5">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2 font-sans text-[11px] text-foreground-tertiary">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            talk to Stay
          </Link>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-accent/60"
          />
          <Link
            href="/about"
            className="transition-colors hover:text-foreground"
          >
            about
          </Link>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-accent/60"
          />
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            privacy
          </Link>
          <span
            aria-hidden
            className="inline-block h-1 w-1 rounded-full bg-accent/60"
          />
          <Link
            href="/resources"
            className="transition-colors hover:text-foreground"
          >
            crisis help
          </Link>
        </div>
      </footer>
    </main>
  );
}
