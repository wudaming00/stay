"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickyBottomRef = useRef(true);
  const lastContentLenRef = useRef(0);

  // focus input as soon as the page is interactive
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // pin to bottom while content grows, unless the user scrolled away
  useEffect(() => {
    const totalLen = messages.reduce((acc, m) => acc + m.content.length, 0);
    if (totalLen <= lastContentLenRef.current) {
      lastContentLenRef.current = totalLen;
      return;
    }
    lastContentLenRef.current = totalLen;
    if (stickyBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // detect intentional scroll-up so we don't fight the user
  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    stickyBottomRef.current = distanceFromBottom < 80;
  }

  // textarea auto-grow
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    stickyBottomRef.current = true; // user is engaged again

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };
    const assistantMsg: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    };

    const next = [...messages, userMsg, assistantMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    try {
      const apiMessages = next
        .filter((m) => m.id !== assistantMsg.id)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.text();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: errBody } : m
          )
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: acc } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                content:
                  "Something interrupted. If this is urgent, please reach 988, 1-800-799-SAFE, or 911.",
              }
            : m
        )
      );
    } finally {
      setStreaming(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const canSend = input.trim().length > 0 && !streaming;

  return (
    <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-6 pt-12 pb-6"
      >
        {messages.length === 0 && (
          <div className="relative min-h-[8rem] font-serif text-lg leading-relaxed text-foreground/95">
            {/* Stage 1: presence + identity */}
            <div
              className="absolute inset-x-0 top-0 animate-show-then-hide space-y-3"
              style={{ animationDelay: "200ms" }}
            >
              <p>I&apos;m here.</p>
              <p>I&apos;m Stay — an AI to think out loud with.</p>
            </div>

            {/* Stage 2: safety reassurance */}
            <div
              className="absolute inset-x-0 top-0 animate-show-then-hide"
              style={{ animationDelay: "3200ms" }}
            >
              <p>
                You&apos;re safe with me. Whatever you say stays between us.
              </p>
            </div>

            {/* Stage 3: invitation, stays */}
            <div
              className="absolute inset-x-0 top-0 animate-fadein-slow"
              style={{ animationDelay: "6200ms" }}
            >
              <p>Tell me what&apos;s happening.</p>
            </div>
          </div>
        )}

        <div className="space-y-7">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>

        <div ref={bottomRef} className="h-2" />
      </div>

      <div className="shrink-0 bg-background px-6 pb-6 pt-3">
        <div className="flex items-end gap-3 rounded-2xl border border-foreground/15 bg-foreground/[0.03] px-4 py-3 transition-colors focus-within:border-foreground/30">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="say anything…"
            rows={1}
            disabled={streaming}
            className="flex-1 resize-none bg-transparent font-sans text-base leading-relaxed text-foreground placeholder:text-foreground/35 focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            aria-label="send"
            className="shrink-0 self-end pb-0.5 font-sans text-base text-foreground/40 transition-colors hover:text-foreground disabled:opacity-25 enabled:text-foreground/70"
          >
            ↩
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "assistant") {
    return (
      <div className="animate-fadein whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground/95">
        {message.content || <BreathingDot />}
      </div>
    );
  }

  return (
    <div className="ml-auto max-w-[80%] animate-fadein whitespace-pre-wrap text-right font-sans text-base leading-relaxed text-foreground/80">
      {message.content}
    </div>
  );
}

function BreathingDot() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/40" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/40 [animation-delay:200ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/40 [animation-delay:400ms]" />
    </span>
  );
}
