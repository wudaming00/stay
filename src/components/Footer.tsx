import Link from "next/link";

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-border bg-background-raised/40 px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto max-w-2xl space-y-2 font-sans text-[11px] text-foreground-tertiary">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
          <FooterLink href="/about">about</FooterLink>
          <Sep />
          <FooterLink href="/promises">promises</FooterLink>
          <Sep />
          <FooterLink href="/privacy">privacy</FooterLink>
          <Sep />
          <FooterLink href="/architecture">how it works</FooterLink>
          <Sep />
          <FooterLink href="/resources">crisis help</FooterLink>
          <Sep />
          <FooterLink href="/faq">faq</FooterLink>
          <Sep />
          <FooterLink href="/terms">terms</FooterLink>
          <Sep />
          <FooterLink href="/settings">settings</FooterLink>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-foreground-quaternary sm:justify-between">
          <span>
            free for everyone, forever ·{" "}
            <a
              href="https://github.com/wudaming00/stay"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-foreground-quaternary/40 underline-offset-2 hover:text-foreground-tertiary"
            >
              open source · MIT
            </a>
          </span>
          <span className="font-mono">v0.9.1 · 2026.04.23</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="transition-colors hover:text-foreground">
      {children}
    </Link>
  );
}

function Sep() {
  return (
    <span aria-hidden className="text-foreground-quaternary">
      ·
    </span>
  );
}
