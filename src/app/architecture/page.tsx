import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Stay — How it works",
};

export default function ArchitecturePage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 prose-stay sm:px-6 sm:py-16">
        <div className="mb-6 flex flex-wrap items-center gap-2 font-sans text-[10px] text-foreground-tertiary">
          <span className="badge badge-version">v0.9.1</span>
          <span>·</span>
          <span>last updated 2026-04-23</span>
          <span>·</span>
          <a
            href="https://github.com/wudaming00/stay"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-foreground-quaternary/40 underline-offset-2 hover:text-foreground-secondary"
          >
            verify on github
          </a>
        </div>

        <h1>How Stay actually works.</h1>
        <p>
          Stay&apos;s trust model depends on specifics, not vibes. This page
          documents exactly what the software does, what the network does,
          what we can see, and what we cannot. Every claim here is directly
          verifiable against the open-source code.
        </p>

        <h2>The short version</h2>

        <aside className="callout">
          <strong>One paragraph</strong>
          <p>
            When you type, the browser sends your message directly to
            Anthropic&apos;s API via our serverless function, which adds the
            system prompt and streams back the reply. We do not store your
            messages on any server. They&apos;re encrypted on your device
            with a key your browser generates — we cannot decrypt them. Our
            server sees only rate-limit metadata (IP + timestamp).
          </p>
        </aside>

        <h2>The stack</h2>
        <ul>
          <li>
            <strong>Frontend:</strong> Next.js 16 (App Router) on React 19,
            styled with Tailwind CSS v4.
          </li>
          <li>
            <strong>Model:</strong> Anthropic Claude Sonnet 4.6, accessed
            via the official{" "}
            <a
              href="https://www.anthropic.com/claude/sonnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anthropic SDK
            </a>
            .
          </li>
          <li>
            <strong>Hosting:</strong> Vercel (serverless functions + edge
            middleware for rate limiting).
          </li>
          <li>
            <strong>DNS:</strong> Cloudflare, DNS-only mode (no proxying —
            Vercel handles TLS directly).
          </li>
          <li>
            <strong>Local storage:</strong> IndexedDB via the browser, with
            WebCrypto for encryption.
          </li>
          <li>
            <strong>Source:</strong>{" "}
            <a
              href="https://github.com/wudaming00/stay"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/wudaming00/stay
            </a>
            , MIT licensed.
          </li>
        </ul>

        <h2>What happens when you send a message</h2>
        <ol>
          <li>
            Your browser posts to{" "}
            <code className="font-mono text-[0.85em]">/api/chat</code> with
            the recent message history (last 60 messages, capped at 80KB
            total).
          </li>
          <li>
            Edge middleware checks your IP against an in-memory token
            bucket (30 requests per minute). Blocked requests get{" "}
            <code className="font-mono text-[0.85em]">429</code> and the
            client shows the outage panel with crisis numbers.
          </li>
          <li>
            The serverless function wraps your messages with the system
            prompt (cached by Anthropic for 5 minutes) and the tool
            definitions, then calls Anthropic&apos;s Messages API with
            streaming enabled.
          </li>
          <li>
            Anthropic&apos;s servers generate a response. Per Anthropic
            policy, the content is not used to train their models and is
            deleted within 30 days (unless flagged for abuse review).
          </li>
          <li>
            The stream comes back to our function, which re-encodes each
            text delta and tool-use block as an NDJSON line and streams it
            to your browser.
          </li>
          <li>
            Your browser appends each chunk to the visible message and, at
            the end, encrypts the full conversation using your device key
            and writes it to IndexedDB.
          </li>
        </ol>

        <h2>Encryption</h2>
        <ul>
          <li>
            <strong>Algorithm:</strong> AES-GCM with 256-bit keys, via the
            browser&apos;s{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API"
              target="_blank"
              rel="noopener noreferrer"
            >
              WebCrypto API
            </a>
            .
          </li>
          <li>
            <strong>Key generation:</strong> On first use, your browser
            generates a random 256-bit key via{" "}
            <code className="font-mono text-[0.85em]">
              crypto.subtle.generateKey
            </code>
            . The key is stored in{" "}
            <code className="font-mono text-[0.85em]">localStorage</code>{" "}
            on your device.
          </li>
          <li>
            <strong>IV:</strong> A fresh 12-byte random IV is generated for
            every encryption via{" "}
            <code className="font-mono text-[0.85em]">
              crypto.getRandomValues
            </code>
            .
          </li>
          <li>
            <strong>Where ciphertext lives:</strong> IndexedDB on your
            device, keyed by session ID. Never on our servers.
          </li>
          <li>
            <strong>Scope:</strong> Anyone who can unlock this specific
            browser can read your conversations. We inherit the security
            model of your browser session — same as iMessage or email on
            this device.
          </li>
        </ul>

        <h2>What each party can see</h2>
        <table className="not-prose my-6 w-full border-collapse font-sans text-[13px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left font-semibold">party</th>
              <th className="px-2 py-2 text-left font-semibold">
                can see
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                cannot see
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-2 py-2 font-medium">You (the user)</td>
              <td className="px-2 py-2 text-foreground-secondary">
                everything
              </td>
              <td className="px-2 py-2 text-foreground-secondary">
                nothing
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 font-medium">Stay&apos;s server</td>
              <td className="px-2 py-2 text-foreground-secondary">
                IP + timestamp of API requests (for rate-limiting, not
                logged to durable storage)
              </td>
              <td className="px-2 py-2 text-foreground-secondary">
                message content, identity, past conversations
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 font-medium">Anthropic</td>
              <td className="px-2 py-2 text-foreground-secondary">
                the system prompt + your messages in the current request,
                transiently, for &lt;30 days
              </td>
              <td className="px-2 py-2 text-foreground-secondary">
                who you are, past conversations we didn&apos;t send
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 font-medium">
                Vercel / Cloudflare
              </td>
              <td className="px-2 py-2 text-foreground-secondary">
                routing metadata (IP, TLS handshake, timestamps)
              </td>
              <td className="px-2 py-2 text-foreground-secondary">
                HTTPS-encrypted message content
              </td>
            </tr>
            <tr>
              <td className="px-2 py-2 font-medium">
                Anyone on your browser
              </td>
              <td className="px-2 py-2 text-foreground-secondary">
                your encrypted conversations (the key is also on this
                browser)
              </td>
              <td className="px-2 py-2 text-foreground-secondary">
                (nothing — same as your other browser data)
              </td>
            </tr>
          </tbody>
        </table>

        <h2>The safety mechanisms</h2>
        <ul>
          <li>
            <strong>Crisis detection:</strong> The system prompt implements
            a Columbia-Protocol-style risk gradient for active suicidal
            ideation, Stanley-Brown Safety Planning (Stanley &amp; Brown
            2012; JAMA Psychiatry 2018), Campbell&apos;s Danger Assessment
            for DV including strangulation screening (Glass et al. 2008),
            and DBT-informed NSSI handling.{" "}
            <a href="/promises">See promises</a> for the full list.
          </li>
          <li>
            <strong>Tool calling:</strong> Claude can surface crisis
            resources via{" "}
            <code className="font-mono text-[0.85em]">surface_resource</code>
            , suggest a pause via{" "}
            <code className="font-mono text-[0.85em]">suggest_pause</code>,
            reflect back user insights via{" "}
            <code className="font-mono text-[0.85em]">
              end_with_reflection
            </code>
            , and produce a downloadable safety plan via{" "}
            <code className="font-mono text-[0.85em]">
              generate_safety_plan
            </code>
            . Phone numbers are hardcoded in the frontend — the model
            cannot hallucinate a number because it only references ids.
          </li>
          <li>
            <strong>DV features:</strong> Quick-exit button + Escape key
            binding, panic-phrase option, neutral browser tab title
            (&ldquo;Notes&rdquo;), redirect to google.com and IndexedDB
            wipe on exit.
          </li>
          <li>
            <strong>Rate limiting:</strong> 30 requests per minute per IP
            via edge middleware. Prevents runaway cost and basic abuse.
          </li>
        </ul>

        <h2>What we do not do</h2>
        <ul>
          <li>No analytics that identify users.</li>
          <li>No tracking pixels, no cookies for marketing purposes.</li>
          <li>No third-party advertisers, ever.</li>
          <li>
            No model fine-tuning on user conversations (we don&apos;t
            collect them).
          </li>
          <li>
            No sale or sharing of data. There is no data to sell.
          </li>
        </ul>

        <h2>Limits of the trust model</h2>
        <p>
          We want to be explicit about what this architecture{" "}
          <em>doesn&apos;t</em> protect against:
        </p>
        <ul>
          <li>
            If someone has physical access to your unlocked browser, they
            can read your conversations.
          </li>
          <li>
            Anthropic and Vercel are both subject to US legal process. They
            could be compelled to retain or produce data in transit,
            though Anthropic&apos;s stated retention is short (30 days).
          </li>
          <li>
            We can be compelled by legal process to change this product.
            If that ever happens, we will tell you before it takes effect,
            and our preference is to shut down an affected service rather
            than weaken its guarantees.
          </li>
          <li>
            AI responses can be wrong. Stay can misread your situation or
            say something unhelpful. If that happens, please tell us:{" "}
            <a href="mailto:hello@thestay.app">hello@thestay.app</a>.
          </li>
        </ul>

        <hr />

        <p className="!text-sm !text-foreground-secondary">
          The entire source is at{" "}
          <a
            href="https://github.com/wudaming00/stay"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/wudaming00/stay
          </a>
          . If any claim on this page is wrong — or if the code does
          something this page doesn&apos;t describe — please open an issue
          or email{" "}
          <a href="mailto:hello@thestay.app">hello@thestay.app</a>.
        </p>

        <p className="!text-sm !text-foreground-secondary">
          See also:{" "}
          <Link href="/promises">promises</Link> ·{" "}
          <Link href="/privacy">privacy</Link> ·{" "}
          <Link href="/terms">terms</Link>
        </p>
      </article>
    </PageShell>
  );
}
