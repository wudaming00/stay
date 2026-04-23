import Link from "next/link";
import Wordmark from "@/components/Wordmark";

export const metadata = {
  title: "Stay — Privacy",
};

export default function PrivacyPage() {
  return (
    <main className="relative z-10 flex min-h-full flex-1 flex-col">
      <header className="shrink-0 border-b border-border px-6 py-4">
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

      <article className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 prose-stay">
        <h1>What we know about you. What we don&apos;t.</h1>
        <p className="text-foreground-secondary">
          Stay is built around the version of trust that doesn&apos;t depend
          on us being good people. The technical architecture exists so that
          the promises below are not promises — they are what we are
          structurally unable to break.
        </p>

        <h2>You don&apos;t need an account</h2>
        <p>
          You don&apos;t need to give us your name, email, or any identifier
          to talk to Stay. Open the page, type. That&apos;s it.
        </p>

        <h2>Where your conversations live</h2>
        <p>
          By default, your conversations live only on your device, encrypted,
          and delete themselves after 90 days. Nothing is sent to our servers
          for storage.
        </p>
        <p>
          You can change this in settings (coming soon). Choose to keep
          nothing, keep them longer, or back them up across devices with a
          recovery phrase that only you hold.
        </p>

        <h2>What we can never see</h2>
        <p>
          We do not have a server-side database of your conversations. Even if
          we wanted to read what you wrote, we structurally cannot. Even if a
          court ordered us to disclose your data, we have nothing to give
          them.
        </p>

        <h2>What goes through Anthropic</h2>
        <p>
          The AI you&apos;re talking to runs on Anthropic&apos;s Claude. Your
          message is sent to Anthropic&apos;s servers in order to generate a
          response. This is the only path that exists for you to talk to
          Stay.
        </p>
        <p>
          Anthropic&apos;s policy: they do not train their models on your
          conversation, and they delete API request logs within 30 days
          (except where they suspect abuse). Encryption in transit (TLS).
        </p>
        <p>
          We do not store the API request or response on our side. We never
          see the content.
        </p>

        <h2>What you can delete</h2>
        <p>
          Anything, any time, with one tap. No verification, no
          second-guessing.
        </p>

        <h2>If you share a device</h2>
        <p>
          Choose &quot;don&apos;t save anything&quot; mode (coming in
          settings). Use the <strong>quick-exit button</strong> in the top
          right of any page — it takes you to a neutral website and clears
          your screen.
        </p>

        <h2>What we don&apos;t track</h2>
        <ul>
          <li>No analytics that identify you.</li>
          <li>No cookies that follow you across the web.</li>
          <li>No advertising. We don&apos;t sell ads. We never will.</li>
        </ul>

        <h2>What happens if a court asks</h2>
        <p>
          We will comply with valid legal process. By design, what we can
          produce is minimal: there is no encrypted blob of your conversation
          on our servers (unless you&apos;ve explicitly enabled cloud backup,
          and even then, the blob requires your recovery phrase to decrypt).
        </p>
        <p>
          We will never weaken our encryption or add backdoors. If pressured
          to do so, we would shut down the affected service before complying.
        </p>

        <h2>Will this ever change?</h2>
        <p>
          If we ever change anything that affects how your conversations are
          stored or who can see them, we will tell you before the change
          takes effect, in plain English, on this page.
        </p>

        <hr />

        <p className="text-sm text-foreground-secondary">
          Trust is the precondition for what we do. We design for the version
          of trust that doesn&apos;t depend on us being good people.
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
