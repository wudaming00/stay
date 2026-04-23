import Link from "next/link";

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-foreground/5 px-6 py-3">
      <div className="mx-auto flex max-w-2xl items-center justify-between font-sans text-xs text-foreground/40">
        <div className="flex gap-4">
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
            href="/resources"
            className="transition-colors hover:text-foreground"
          >
            crisis help
          </Link>
        </div>
        <span>free for everyone, forever</span>
      </div>
    </footer>
  );
}
