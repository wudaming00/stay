import PageShell from "@/components/PageShell";
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
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 prose-stay sm:px-6 sm:py-16">
        <h1>If you need a real human, here.</h1>
        <p>
          Stay is not equipped to be your crisis line. The lines below are
          run by trained humans, free, confidential, and most are 24/7.
        </p>

        <h2>If you need someone right now</h2>

        <div className="not-prose mt-6 space-y-3 font-sans">
          {crisisOrder.map((id) => {
            const r = RESOURCES[id];
            if (!r) return null;
            return (
              <div
                key={id}
                className="rounded-xl border border-border bg-background-elevated/60 p-4 transition-colors hover:border-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-foreground">
                      {r.name}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground-secondary">
                      {r.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.call && (
                    <a
                      href={`tel:${r.call.replace(/\D/g, "")}`}
                      className="btn btn-primary btn-xs"
                    >
                      call {r.call}
                    </a>
                  )}
                  {r.text && (
                    <a
                      href={`sms:${r.text}`}
                      className="btn btn-secondary btn-xs"
                    >
                      text {r.text}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <h2>If you want ongoing support — a real therapist</h2>
        <p>
          Finding the right therapist is often the hardest part. These
          directories filter by insurance, cost, identity, and modality —
          so you can find someone who fits, not just someone with an
          opening.
        </p>

        <div className="not-prose mt-6 space-y-3 font-sans">
          {PROFESSIONAL_REFERRALS.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-border bg-background-elevated/40 p-4 transition-colors hover:border-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-foreground">
                    {r.name}{" "}
                    <span
                      className="text-foreground-tertiary"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground-secondary">
                    {r.description}
                  </p>
                  {r.best_for && (
                    <p className="mt-2 text-[11px] uppercase tracking-widest text-accent-hover">
                      best for · {r.best_for}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        <hr />

        <p className="!text-sm !text-foreground-secondary">
          If you&apos;re in immediate physical danger, call 911. If you
          have a plan to hurt yourself, call 988 right now — they will stay
          with you on the line. You don&apos;t have to know what to say.
        </p>
      </article>
    </PageShell>
  );
}
