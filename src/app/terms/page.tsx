import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Stay — Terms",
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 prose-stay sm:px-6 sm:py-16">
        <p className="!text-xs !uppercase !tracking-widest !text-foreground-tertiary">
          Last updated: April 23, 2026 · Draft, pending legal review
        </p>

        <h1>Terms of Use</h1>
        <p>
          Stay is a free, public-good AI conversation tool. By using it,
          you agree to these terms. They are written in plain English on
          purpose.
        </p>

        <h2>What Stay is — and isn&apos;t</h2>
        <p>
          Stay is an AI conversational tool intended for reflective
          practice and emotional processing. It is{" "}
          <strong>
            not therapy, not medical advice, not a crisis service, and not
            a substitute for any of those things.
          </strong>{" "}
          The AI does not diagnose, treat, or prescribe.
        </p>
        <p>
          If you are in crisis, please reach out to a real human — see{" "}
          <Link href="/resources">crisis help</Link>. If you may be in
          immediate physical danger, call 911.
        </p>

        <h2>Age requirement</h2>
        <p>
          You must be at least 18 years old to use Stay. By using the
          service, you confirm you are 18 or older.
        </p>
        <p>
          If you are under 18 and need support, please reach out to{" "}
          <a href="https://www.thetrevorproject.org">
            The Trevor Project
          </a>
          ,{" "}
          <a href="tel:18004224453">Childhelp (1-800-422-4453)</a>, or a
          trusted adult.
        </p>

        <h2>Your data</h2>
        <p>
          See <Link href="/privacy">Privacy</Link> for the full picture.
          The short version: by default, your conversations live encrypted
          on your device and delete themselves after 90 days. We can never
          read your conversations. The conversation transits through
          Anthropic (the AI provider) to generate responses; their policy
          is not to train on your data and to delete API logs within 30
          days.
        </p>

        <h2>What Stay can do wrong</h2>
        <p>
          AI systems can be wrong. Stay can give bad advice, misread your
          situation, or fail to recognize something important. You are
          responsible for your own decisions about your life.
        </p>
        <p>
          We&apos;ve made many design choices to reduce these risks (see{" "}
          <Link href="/promises">our commitments</Link>), but no system is
          perfect.
        </p>

        <h2>No warranty</h2>
        <p>
          Stay is provided &ldquo;as is.&rdquo; We make no warranties of
          any kind, express or implied, regarding the accuracy,
          reliability, or suitability of the service for any particular
          purpose.
        </p>

        <h2>Specific credible threats to identifiable people</h2>
        <p>
          Stay is an AI tool, not a licensed mental-health professional
          under legal duty-to-warn or mandated-reporting statutes. However,
          if you describe a specific, credible, and imminent threat against
          an identifiable person, you should know:
        </p>
        <ul>
          <li>
            The AI will not help you plan or rehearse harm to another
            person.
          </li>
          <li>
            The AI will urge you to reach a crisis line (988) and, if
            imminent, emergency services (911).
          </li>
          <li>
            Under legal process (valid court order, subpoena), we will
            comply with lawful requests. By architecture, our ability to
            produce anything meaningful is minimal — we do not store the
            content of your conversations on our servers.
          </li>
        </ul>
        <p>
          If you or someone you love is in immediate danger from someone,
          please call 911 (US) or reach the appropriate local emergency
          service.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, neither Stay nor its
          operators are liable for any direct, indirect, incidental,
          consequential, or special damages arising from your use of the
          service. This includes — but is not limited to — decisions you
          make based on conversations with the AI.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Don&apos;t use Stay to harm yourself or others. Don&apos;t
          attempt to extract harmful information from the AI. Don&apos;t
          use Stay to generate content for commercial purposes without
          permission.
        </p>

        <h2>If we discontinue the service</h2>
        <p>
          Stay is built as a sustainable public good, but we cannot
          guarantee permanence. If we shut down the service, we will give
          as much advance notice as possible and provide instructions for
          downloading any data you&apos;ve chosen to back up.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the State of California,
          USA, without regard to its conflict-of-law principles.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          If we change these terms in any material way, we will display a
          notice on the page before the change takes effect.
        </p>

        <hr />

        <p className="!text-sm !text-foreground-secondary">
          Questions?{" "}
          <a href="mailto:hello@thestay.app">hello@thestay.app</a>
        </p>
      </article>
    </PageShell>
  );
}
