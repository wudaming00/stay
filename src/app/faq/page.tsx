import Link from "next/link";
import Wordmark from "@/components/Wordmark";

export const metadata = {
  title: "Stay — FAQ",
};

const QA = [
  {
    q: "Is this therapy?",
    a: "No. Stay is not therapy, and the AI is not a therapist. It does not diagnose, prescribe, or provide professional mental-health treatment. If what you're working through needs ongoing professional support, please see a real therapist. Stay can be useful before, between, or alongside therapy — but not instead of it.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT (and most general AI assistants) are designed to be maximally useful and engaging — to give you good answers and keep you coming back. Stay is the opposite. It runs on a more carefully designed system prompt focused specifically on emotional presence, communication, and crisis safety. It is built not to keep you. If anything, it tries to point you back toward the real people in your life.",
  },
  {
    q: "Can I trust what the AI says?",
    a: "Mostly, yes — and sometimes, no. The AI is a pattern-matcher trained on human writing about emotions, relationships, and healing. It can be wrong about your particular situation, and you should treat it like a thoughtful but imperfect friend. If something it says doesn't fit your reality, trust yourself first. We've designed it to challenge you when you're spiraling and to defer to you when the question is actually yours to answer.",
  },
  {
    q: "Will my data be sold or used to train AI models?",
    a: "No. We don't have a database of your conversations. They live encrypted on your device. The model that powers Stay (Anthropic's Claude) does not train on your conversation per their policy. Even if we wanted to read what you wrote, we structurally cannot. See privacy for the full architecture.",
  },
  {
    q: "Why is this free? What's the catch?",
    a: "There is no catch. Stay is free because the people who most need it can't pay for it. The plan to make it sustainable is to find institutional funding — foundations, mission-aligned sponsorships, possibly opt-in donations — never to charge people who came here for help.",
  },
  {
    q: "Will the AI remember me when I come back?",
    a: "Yes, on the same device. Your conversation is encrypted and stored locally for 90 days by default. When you return, you can pick up where you left off or start fresh. Cross-device sync (with a recovery phrase only you hold) is coming.",
  },
  {
    q: "What if I'm in crisis right now?",
    a: "If you're in immediate physical danger, call 911. If you're having thoughts of suicide or self-harm, please call or text 988 — they are real, trained humans available 24/7, free and confidential. Stay can be a bridge to those resources but is not a substitute for them.",
  },
  {
    q: "Can I delete my conversations?",
    a: "Yes. Anytime, with one button. Go to settings to delete a single conversation or every conversation we have on your device.",
  },
  {
    q: "Why does the AI sometimes disagree with me?",
    a: "Because a friend who only ever agrees with you is not actually being your friend. The system prompt explicitly instructs the AI to push back gently when you might be telling yourself a story that's not quite true. It will always be warm about it. If you ever feel it pushed back wrongly, trust yourself — the AI doesn't know your life.",
  },
  {
    q: "Is Stay watching me or listening through the microphone?",
    a: "No. Stay only sees what you type. It has no access to your microphone, camera, location, contacts, or anything outside the conversation you choose to have with it.",
  },
  {
    q: "What if the AI says something harmful or wrong?",
    a: "Please email hello@thestay.app and tell us what happened. We take this seriously — the design intentionally tries to prevent it, but no system is perfect. Your feedback is how we make it better.",
  },
  {
    q: "Are conversations shared with anyone else?",
    a: "No. Not with us. Not with researchers. Not with anyone. Your conversations exist between you and the AI on your device. The conversation passes through Anthropic's servers transiently to generate responses (this is unavoidable for any AI product), but it is not stored there past 30 days and is not used for training. We never see it.",
  },
];

export default function FaqPage() {
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
        <h1>Common questions, honestly answered.</h1>

        <div className="mt-10 space-y-10">
          {QA.map(({ q, a }) => (
            <div key={q}>
              <h2 className="!mt-0">{q}</h2>
              <p className="!mb-0">{a}</p>
            </div>
          ))}
        </div>

        <hr />

        <p className="text-sm text-foreground-secondary">
          Didn&apos;t find what you needed?{" "}
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
