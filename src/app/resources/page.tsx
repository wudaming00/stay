import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { RESOURCES, PROFESSIONAL_REFERRALS } from "@/lib/resources";

export const metadata = {
  title: "Stay — Crisis Help",
};

const crisisOrder = [
  "988",
  "crisis_text_line",
  "dv_hotline",
  "rainn",
  "trevor",
  "childhelp",
  "samhsa",
  "neda",
  "alzheimers",
  "911",
];

export default function ResourcesPage() {
  return (
    <main className="relative z-10 flex min-h-full flex-1 flex-col">
      <header className="shrink-0 border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Wordmark size="md" />
          <Link
            href="/"
            className="font-sans text-xs text-foreground-tertiary transition-colors hover:text-foreground"
          >
            ← back
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 prose-stay sm:px-6 sm:py-16">
        <h1>If you need a real human, here.</h1>
        <p className="text-foreground-secondary">
          Stay is not equipped to be your crisis line. The lines below are
          run by trained humans, free, confidential, available right now.
          Most are 24/7.
        </p>

        <h2>If you need someone right now</h2>

        <div className="mt-6 space-y-6">
          {crisisOrder.map((id) => {
            const r = RESOURCES[id];
            if (!r) return null;
            return (
              <div key={id} className="border-l-2 border-accent pl-5">
                <h3 className="!mt-0 font-serif text-lg font-medium">
                  {r.name}
                </h3>
                <p className="!mb-1 text-foreground-secondary">
                  {r.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-sans text-base">
                  {r.call && (
                    <a
                      href={`tel:${r.call.replace(/\D/g, "")}`}
                      className="text-accent hover:text-accent-hover"
                    >
                      📞 call {r.call}
                    </a>
                  )}
                  {r.text && (
                    <a
                      href={`sms:${r.text}`}
                      className="text-accent hover:text-accent-hover"
                    >
                      💬 text {r.text}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <hr />

        <h2>If you want ongoing support (a real therapist)</h2>
        <p className="text-foreground-secondary">
          Finding the right therapist is often the hardest part. These
          directories filter by insurance, cost, identity, and modality — so
          you can find someone who fits, not just someone who has an opening.
        </p>

        <div className="mt-6 space-y-6">
          {PROFESSIONAL_REFERRALS.map((r) => (
            <div key={r.id} className="border-l-2 border-border-strong pl-5">
              <h3 className="!mt-0 font-serif text-lg font-medium">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground no-underline hover:text-accent"
                >
                  {r.name} ↗
                </a>
              </h3>
              <p className="!mb-1 text-foreground-secondary">
                {r.description}
              </p>
              {r.best_for && (
                <p className="!mb-0 font-sans text-xs text-foreground-tertiary">
                  Best for: {r.best_for}
                </p>
              )}
            </div>
          ))}
        </div>

        <hr />

        <p className="text-sm text-foreground-secondary">
          If you&apos;re in immediate physical danger, call 911. If you have a
          plan to hurt yourself, call 988 right now — they will stay with you
          on the line. You don&apos;t have to know what to say.
        </p>
      </article>

      <footer className="shrink-0 border-t border-border px-6 py-4">
        <div className="mx-auto max-w-2xl text-center font-sans text-xs text-foreground-tertiary">
          <Link href="/" className="hover:text-foreground">
            ← talk to Stay
          </Link>
        </div>
      </footer>
    </main>
  );
}
