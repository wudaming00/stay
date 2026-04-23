import Link from "next/link";

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-border/70 bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 font-sans text-[11px] text-foreground-tertiary sm:flex-row sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <FooterLink href="/about">about</FooterLink>
          <Dot />
          <FooterLink href="/promises">promises</FooterLink>
          <Dot />
          <FooterLink href="/privacy">privacy</FooterLink>
          <Dot />
          <FooterLink href="/resources">crisis help</FooterLink>
          <Dot />
          <FooterLink href="/faq">faq</FooterLink>
          <Dot />
          <FooterLink href="/settings">settings</FooterLink>
        </div>
        <FooterLink href="/promises">
          free for everyone, forever
        </FooterLink>
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
    <Link
      href={href}
      className="transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="inline-block h-1 w-1 rounded-full bg-accent/60"
    />
  );
}
