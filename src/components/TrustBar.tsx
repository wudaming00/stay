import Link from "next/link";

/**
 * Persistent credibility strip. Shown below the chat header.
 * Communicates: this is a real product with real guarantees, with
 * verifiable facts (open source, encryption, version, last update).
 */
export default function TrustBar() {
  return (
    <div className="border-b border-border bg-background-raised/40 px-4 py-2 sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-x-3 gap-y-1.5 font-sans text-[10px] text-foreground-tertiary">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="badge badge-trust">
            <span className="badge-dot" aria-hidden /> encrypted on device
          </span>
          <a
            href="https://github.com/wudaming00/stay"
            target="_blank"
            rel="noopener noreferrer"
            className="badge badge-version transition-opacity hover:opacity-70"
          >
            open source · github
          </a>
          <span className="badge badge-version">v0.9</span>
        </div>
        <Link
          href="/resources"
          className="badge badge-crisis transition-opacity hover:opacity-70"
        >
          <span className="badge-dot" aria-hidden /> in crisis? 988
        </Link>
      </div>
    </div>
  );
}
