"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";
import { PHONE_PATTERNS } from "@/lib/resources";
import {
  getCurrentSessionId,
  loadSession,
  newSession,
  saveSession,
  deleteEverything,
} from "@/lib/storage";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const MAX_INPUT_CHARS = 4000;
const MAX_MESSAGES_KEPT = 60; // sliding window sent to API; older stays in storage

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [outage, setOutage] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickyBottomRef = useRef(true);
  const lastContentLenRef = useRef(0);
  const sessionIdRef = useRef<string>("");
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Load existing session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        sessionIdRef.current = getCurrentSessionId();
        const stored = await loadSession(sessionIdRef.current);
        if (!cancelled && stored && stored.length > 0) {
          setMessages(stored);
        }
      } catch {
        // storage unavailable — continue with in-memory only
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Quick-exit handler — clear everything
  useEffect(() => {
    async function onQuickExit() {
      setMessages([]);
      setInput("");
      try {
        await deleteEverything();
      } catch {
        // best effort
      }
    }
    function onNewConversation() {
      sessionIdRef.current = newSession();
      setMessages([]);
      setInput("");
      setOutage(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    window.addEventListener("stay:quick-exit", onQuickExit);
    window.addEventListener("stay:new-conversation", onNewConversation);
    return () => {
      window.removeEventListener("stay:quick-exit", onQuickExit);
      window.removeEventListener("stay:new-conversation", onNewConversation);
    };
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (loaded) inputRef.current?.focus();
  }, [loaded]);

  // Sticky-bottom scroll
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

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    stickyBottomRef.current = distanceFromBottom < 80;
  }

  // Textarea auto-grow
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    if (trimmed.length > MAX_INPUT_CHARS) {
      setInput(trimmed.slice(0, MAX_INPUT_CHARS));
      return;
    }

    stickyBottomRef.current = true;
    setOutage(false);

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
      // Send sliding window of recent messages to API
      const allButAssistant = next.filter((m) => m.id !== assistantMsg.id);
      const window_ = allButAssistant.slice(-MAX_MESSAGES_KEPT);
      const apiMessages = window_.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (res.status === 429) {
        setOutage(true);
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMsg.id)
        );
        return;
      }

      if (!res.ok || !res.body) {
        setOutage(true);
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMsg.id)
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

      if (!acc.trim()) {
        setOutage(true);
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMsg.id)
        );
      }
    } catch {
      setOutage(true);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
    } finally {
      setStreaming(false);
      void saveSession(sessionIdRef.current, messagesRef.current).catch(() => {});
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const canSend = input.trim().length > 0 && !streaming && loaded;
  const remaining = MAX_INPUT_CHARS - input.length;

  return (
    <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-8 pb-6 sm:px-6 sm:pt-12"
      >
        {loaded && messages.length === 0 && !outage && <Welcome />}
        {outage && <OutagePanel />}

        <div className="space-y-7">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>

        <div ref={bottomRef} className="h-2" />
      </div>

      <div className="shrink-0 bg-background px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
        <div className="flex items-end gap-3 rounded-2xl border border-border-strong bg-background-elevated px-3 py-2.5 shadow-sm transition-colors focus-within:border-accent sm:px-4 sm:py-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
            onKeyDown={handleKey}
            placeholder="say anything…"
            rows={1}
            disabled={streaming || !loaded}
            maxLength={MAX_INPUT_CHARS}
            className="flex-1 resize-none bg-transparent font-sans text-base leading-relaxed text-foreground placeholder:text-foreground-tertiary focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            aria-label="send"
            className="shrink-0 self-end pb-0.5 font-sans text-lg text-foreground-tertiary transition-colors hover:text-foreground disabled:opacity-30 enabled:text-accent"
          >
            ↩
          </button>
        </div>
        {remaining < 200 && (
          <p className="mt-1.5 text-right font-sans text-[11px] text-foreground-tertiary">
            {remaining} characters left
          </p>
        )}
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className="relative min-h-[10rem] font-serif text-lg leading-relaxed text-foreground sm:min-h-[8rem]">
      <div
        className="absolute inset-x-0 top-0 animate-show-then-hide space-y-3"
        style={{ animationDelay: "200ms" }}
      >
        <p>I&apos;m here.</p>
        <p>I&apos;m Stay — an AI to think out loud with.</p>
      </div>
      <div
        className="absolute inset-x-0 top-0 animate-show-then-hide"
        style={{ animationDelay: "3200ms" }}
      >
        <p>You&apos;re safe with me. Whatever you say stays between us.</p>
      </div>
      <div
        className="absolute inset-x-0 top-0 animate-fadein-slow"
        style={{ animationDelay: "6200ms" }}
      >
        <p>Tell me what&apos;s happening.</p>
      </div>
    </div>
  );
}

function OutagePanel() {
  return (
    <div className="animate-fadein space-y-4 rounded-2xl border border-border-strong bg-background-elevated p-5 font-serif text-base leading-relaxed text-foreground">
      <p>I&apos;m having trouble reaching the model right now.</p>
      <p>
        If this is something that can wait, please try again in a few
        minutes. If it can&apos;t —
      </p>
      <ul className="space-y-1.5 font-sans text-sm">
        <li>
          <strong>988</strong> — call or text — suicide & crisis (24/7, free)
        </li>
        <li>
          <strong>1-800-799-7233</strong> — National DV Hotline
        </li>
        <li>
          <strong>911</strong> — for immediate physical danger
        </li>
      </ul>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "assistant") {
    return (
      <div className="animate-fadein border-l-2 border-accent/30 pl-4 font-serif text-base leading-relaxed text-foreground sm:pl-5 sm:text-lg">
        {message.content ? renderWithPhones(message.content) : <BreathingDot />}
      </div>
    );
  }

  return (
    <div className="ml-auto max-w-[88%] animate-fadein whitespace-pre-wrap rounded-2xl bg-background-elevated px-4 py-3 font-sans text-sm leading-relaxed text-foreground/85 sm:max-w-[85%] sm:text-base">
      {message.content}
    </div>
  );
}

function BreathingDot() {
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground-tertiary" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground-tertiary [animation-delay:200ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground-tertiary [animation-delay:400ms]" />
    </span>
  );
}

function renderWithPhones(text: string): React.ReactNode {
  const segments: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest: { index: number; match: string; tel: string } | null = null;
    for (const { pattern, tel } of PHONE_PATTERNS) {
      pattern.lastIndex = 0;
      const m = pattern.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, match: m[0], tel };
      }
    }

    if (!earliest) {
      segments.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (earliest.index > 0) {
      segments.push(<span key={key++}>{remaining.slice(0, earliest.index)}</span>);
    }
    segments.push(
      <a
        key={key++}
        href={`tel:${earliest.tel}`}
        className="font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
      >
        {earliest.match}
      </a>
    );
    remaining = remaining.slice(earliest.index + earliest.match.length);
  }

  return <span className="whitespace-pre-wrap">{segments}</span>;
}
