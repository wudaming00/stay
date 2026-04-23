import Link from "next/link";
import Wordmark from "@/components/Wordmark";

export const metadata = {
  title: "Stay — About",
};

export default function AboutPage() {
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
        <h1>Why Stay exists.</h1>

        <p>
          Most of the worst decisions in our lives are made in the ten minutes
          between feeling something and saying it.
        </p>

        <p>
          The hot reply you can&apos;t take back. The text sent at 2am. The
          confrontation at the family dinner. The decision that felt like
          clarity but was really just exhaustion.
        </p>

        <p>
          Stay exists for those ten minutes.
        </p>

        <h2>What it is</h2>

        <p>
          Stay is a free AI you can talk to in moments where you can&apos;t —
          or shouldn&apos;t — be alone. It listens. It helps you find the
          words for what you actually feel and what you actually need to say.
          Then it lets you go.
        </p>
        <p>
          It is not therapy. It is not a friend. It is a quiet third thing —
          a place you can think out loud before doing anything you can&apos;t
          undo.
        </p>

        <h2>What it isn&apos;t</h2>

        <p>
          Most AI products are trying to keep you. Stay is built the opposite
          way. Read{" "}
          <Link href="/promises">our promises</Link> — the design choices we
          made (and the ones we refused to make) so this product doesn&apos;t
          pretend to care about you while quietly farming your attention.
        </p>

        <h2>Free, forever, for everyone</h2>

        <p>
          Stay does not charge users. It will never charge users. It does not
          show ads. It does not sell your data — it cannot sell your data,
          because we cannot read it.
        </p>
        <p>
          The cost of running Stay is real (LLMs cost money per
          conversation). It is currently covered out of pocket. As Stay
          grows, the plan is to fund it through institutional support —
          foundations, sponsorships from organizations whose mission aligns
          with this work, possibly opt-in donations from people who want to
          contribute. Never from the people who need the help.
        </p>

        <h2>Who built it</h2>

        <p>
          <em>(This section will be filled in by the founder. For now, what
          you can know: Stay was built by one person, in 2026, after years
          of watching people he loves suffer in the gap between what they
          felt and what they could say.)</em>
        </p>

        <h2>What we want it to be</h2>

        <p>
          Quiet. Honest. There when you need it. Gone when you don&apos;t.
          Trusted enough that someone in their hardest hour will type into
          it the truth they can&apos;t say to anyone else — and trust that
          what they say goes nowhere.
        </p>

        <p>
          We don&apos;t expect to be the only thing you turn to. We want to
          be the bridge between the moment you can&apos;t think and the
          conversation you actually need to have, with the people who
          actually matter to you.
        </p>

        <hr />

        <p className="text-sm text-foreground-secondary">
          Questions, ideas, or things we got wrong:{" "}
          <a href="mailto:hello@thestay.app">hello@thestay.app</a>
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
