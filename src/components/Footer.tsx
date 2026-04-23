import Link from "next/link";

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-border px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 font-sans text-[11px] text-foreground-tertiary sm:flex-row sm:justify-between sm:text-xs">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link
            href="/about"
            className="transition-colors hover:text-foreground"
          >
            about
          </Link>
          <Link
            href="/promises"
            className="transition-colors hover:text-foreground"
          >
            promises
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            privacy
          </Link>
          <Link
            href="/faq"
            className="transition-colors hover:text-foreground"
          >
            faq
          </Link>
          <Link
            href="/resources"
            className="transition-colors hover:text-foreground"
          >
            crisis help
          </Link>
          <Link
            href="/settings"
            className="transition-colors hover:text-foreground"
          >
            settings
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-foreground"
          >
            terms
          </Link>
        </div>
        <Link
          href="/promises"
          className="text-center transition-colors hover:text-foreground"
        >
          free for everyone, forever
        </Link>
      </div>
    </footer>
  );
}
