import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Help me say something hard — Stay",
  description:
    "Trying to figure out how to say something difficult to your mom, your partner, your boss, your kid? Stay helps you find the words — calmly, and without making it worse.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/draft-message" },
  openGraph: {
    title: "Help me say something hard",
    description:
      "Help with what to actually say to the person — your mom, your partner, your boss, your kid. Free.",
  },
};

export default function DraftMessagePage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 prose-stay sm:px-6 sm:py-16">
        <h1>Help me say something hard.</h1>
        <p>
          You know the kind of message. The one you&apos;ve been drafting in
          your head all day. To your mom about the comment she keeps making.
          To your partner about something that landed wrong. To your boss
          about the thing you can&apos;t keep doing. To your kid about
          something neither of you wants to talk about.
        </p>
        <p className="!mb-6">
          The version you write at 11pm makes it worse. The version you say
          out loud makes it worse. The version you don&apos;t send at all
          eats you for a week.
        </p>

        <p className="!mb-0 !text-xl !leading-normal !text-foreground !italic">
          Stay helps you find the version that lands.
        </p>

        <h2>How it works</h2>
        <p>
          Stay walks you through what actually happened, how it landed, what
          you actually need, and what you might say. The structure is from
          Nonviolent Communication — but Stay won&apos;t use the jargon. It
          just helps you say the thing without setting fire to it on the way
          out.
        </p>
        <p>You stay in control. Stay never sends anything. It just helps you
          write it.</p>

        <h2>What people use it for</h2>
        <ul>
          <li>
            Texting a parent to ask them to stop commenting on something
            (weight, partner, religion, life choices)
          </li>
          <li>
            Telling a friend you can&apos;t hold something for them anymore
          </li>
          <li>
            Asking a partner for something you keep needing but can&apos;t
            articulate
          </li>
          <li>Setting a boundary at work without burning the bridge</li>
          <li>
            Writing the apology you actually mean (not the &ldquo;sorry you
            felt that way&rdquo; one)
          </li>
          <li>
            Saying no without seven sentences of explanation
          </li>
        </ul>

        <h2>What it isn&apos;t</h2>
        <p>
          Stay isn&apos;t a script generator. It won&apos;t hand you words to
          copy and paste. The reason is simple: scripts don&apos;t land
          because they aren&apos;t yours. Stay helps you get to YOUR version
          — which is the one the other person can actually hear.
        </p>

        <hr />

        <div className="!mt-12 flex justify-center">
          <Link
            href="/?seed=draft"
            className="inline-block rounded-md border border-accent bg-accent px-5 py-3 font-sans text-sm text-background no-underline transition-colors hover:bg-accent-hover"
          >
            help me draft this →
          </Link>
        </div>

        <p className="!mt-6 !text-center !text-sm !text-foreground-secondary">
          Free. Private (encrypted on your device). No account.
        </p>
      </article>
    </PageShell>
  );
}
