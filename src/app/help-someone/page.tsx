import Link from "next/link";
import PageShell from "@/components/PageShell";

// Override the site-wide noindex so this caregiver landing page can rank.
// People googling "my friend wants to die what do I do" deserve to find us.
export const metadata = {
  title: "How to help someone who said they want to die — Stay",
  description:
    "If someone you love said they don't want to be alive — what to do, what not to do, who to call. Plain language, no platitudes.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/help-someone" },
  openGraph: {
    title: "How to help someone who said they want to die",
    description:
      "If someone you love said they don't want to be alive — what to do, what not to do, who to call.",
  },
};

export default function HelpSomeonePage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 prose-stay sm:px-6 sm:py-16">
        <h1>If someone you love is in a dark place.</h1>
        <p>
          You probably found this page by typing something into Google you
          didn&apos;t want to type. Your friend, partner, kid, parent, or
          sibling said something — maybe directly, maybe sideways — that has
          you scared. You&apos;re not sure what to do.
        </p>
        <p className="!mb-6">
          You&apos;re in the right place. Read this slowly. It&apos;s short on
          purpose.
        </p>

        <h2>If they are in immediate danger right now</h2>
        <p>
          If they&apos;ve said they have a plan, the means to act on it, and a
          time — or they&apos;re currently somewhere they can&apos;t be safely
          alone:
        </p>
        <ul>
          <li>
            <strong>If they&apos;re with you</strong> — stay with them. Do not
            leave. Call <a href="tel:988">988</a> together if they&apos;ll talk.
            Or call <a href="tel:911">911</a> for a welfare check, knowing the
            person who arrives may not be a mental-health responder.
          </li>
          <li>
            <strong>If they&apos;re elsewhere and not answering</strong> —
            call 911 in their location and ask for a wellness/welfare check.
            Give the address. They can be wrong. You will not be wrong for
            making the call.
          </li>
        </ul>

        <h2>Three things to do</h2>
        <ol>
          <li>
            <strong>Ask the question directly.</strong> &ldquo;Are you thinking
            about ending your life?&rdquo; Asking does not plant the idea. Not
            asking is what isolates them. If the answer is yes, ask: &ldquo;Do
            you have a plan? Do you have what you&apos;d need to do it?&rdquo;
            Their answer tells you what to do next.
          </li>
          <li>
            <strong>Stay with them in the feeling without trying to fix it.</strong>{" "}
            They don&apos;t need to be talked out of how they feel. They need
            someone to not run. Sit. Listen. Don&apos;t tell them what to be
            grateful for. Don&apos;t tell them what they have to live for.
            Don&apos;t make this about you.
          </li>
          <li>
            <strong>Help them connect to someone who does this for a living.</strong>{" "}
            Offer to dial <a href="tel:988">988</a> with them — call or text.
            Offer to sit with them while they call. Offer to drive them to an
            urgent psychiatric care center. The phrase that works:
            &ldquo;I&apos;m not the right person to hold this alone with you.
            Will you let me help you talk to someone who does?&rdquo;
          </li>
        </ol>

        <h2>Three things NOT to do</h2>
        <ol>
          <li>
            <strong>Don&apos;t make them prove it.</strong> &ldquo;You&apos;re
            not really going to do anything, right?&rdquo; isn&apos;t reassurance —
            it&apos;s asking them to manage your fear. They came to you because
            they couldn&apos;t hold it alone. Don&apos;t hand it back.
          </li>
          <li>
            <strong>Don&apos;t use guilt or family as a weapon.</strong>{" "}
            &ldquo;Think of your kids,&rdquo; &ldquo;your mom would be
            destroyed,&rdquo; &ldquo;you&apos;d ruin so many lives&rdquo; —
            these turn the people they love into a debt. The shame they
            already feel deepens. People in crisis can know they are loved and
            still feel like a burden; adding more weight is cruel even when
            you mean well.
          </li>
          <li>
            <strong>Don&apos;t promise to keep it secret.</strong> If they ask
            you to swear you won&apos;t tell anyone, you can say: &ldquo;I love
            you and I&apos;m not going to lie to you. I will help you decide
            who to tell and when. But I&apos;m not going to be the only person
            holding this.&rdquo;
          </li>
        </ol>

        <h2>What if they shut down or say nothing?</h2>
        <p>
          Silence is not refusal. It is often grief, exhaustion, or shame.
          Stay anyway. &ldquo;You don&apos;t have to talk. I&apos;m just going
          to sit here with you.&rdquo; Your presence is the message. If the
          silence stretches and you&apos;re scared, name what you&apos;re
          seeing without judgment: &ldquo;I&apos;m worried about you. I&apos;d
          like to help us call someone together. Will you let me?&rdquo;
        </p>

        <h2>Resources you can offer them</h2>
        <ul>
          <li>
            <strong>988</strong> — Suicide & Crisis Lifeline. Call or text.
            Free, confidential, 24/7. People who do exactly this for a living.
          </li>
          <li>
            <strong>Crisis Text Line</strong> — text HOME to 741741. For
            people who can&apos;t talk on the phone.
          </li>
          <li>
            <strong>Trevor Project</strong> — 1-866-488-7386 — for LGBTQ+
            youth.
          </li>
          <li>
            <strong>Your local emergency room</strong> — if there&apos;s no
            time to call. ERs can&apos;t turn someone away in psychiatric
            crisis.
          </li>
          <li>
            <Link href="/">Stay</Link> — a free AI you can be with them
            through. Not a replacement for a hotline. A companion for the
            in-between moments.
          </li>
        </ul>

        <h2>For you</h2>
        <p>
          Holding someone in this place is heavy. People who support suicidal
          loved ones are themselves at elevated risk — partners and parents
          most. After tonight, find a person YOU can talk to about what
          you&apos;re carrying. NAMI&apos;s helpline (1-800-950-6264) helps
          family members navigate exactly this. A therapist of your own —
          even briefly — is not a luxury here.
        </p>
        <p>
          You did not cause their pain. You cannot fix it. You can be one of
          the reasons they are still here tomorrow morning. That is real, and
          it is enough.
        </p>

        <hr />

        <p className="!text-sm !text-foreground-secondary">
          Stay is a free, open-source AI for moments like these — for the
          person in the dark place AND the person trying to be there for them.{" "}
          <Link href="/?seed=help-someone">Talk to Stay about how to help</Link>.
          Or read <Link href="/about">about how Stay was built</Link> and
          why it&apos;s free.
        </p>
      </article>
    </PageShell>
  );
}
