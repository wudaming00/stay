"use client";

import { useEffect, useRef, useState } from "react";
import type { Message, SafetyPlan, StreamEvent, ToolEvent } from "@/lib/types";
import { PHONE_PATTERNS, RESOURCES } from "@/lib/resources";
import SafetyPlanCard from "./SafetyPlanCard";
import {
  getCurrentSessionId,
  getSessionMeta,
  loadSession,
  newSession,
  saveSession,
  deleteEverything,
} from "@/lib/storage";
import { isInsightSaved, saveInsight } from "@/lib/insights";
import { matchesPanicPhrase } from "@/lib/panic";
import { deleteDeviceKey } from "@/lib/crypto";
import VoiceInput from "./VoiceInput";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const MAX_INPUT_CHARS = 4000;
const MAX_MESSAGES_KEPT = 60;

const EXAMPLE_PROMPTS = [
  "I just had a hard conversation and I'm spinning",
  "Help me figure out how to say something to someone",
  "I just need to think out loud for a minute",
];

const TRANSLATION_STARTER =
  "I'm trying to figure out how to say something to someone. Can you help me find the words?\n\nHere's what's going on: ";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [interimVoice, setInterimVoice] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [outage, setOutage] = useState(false);
  const [returningSince, setReturningSince] = useState<number | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [pauseSuggested, setPauseSuggested] = useState(false);
  const [reflectionQuote, setReflectionQuote] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        sessionIdRef.current = getCurrentSessionId();
        const stored = await loadSession(sessionIdRef.current);
        if (!cancelled && stored && stored.length > 0) {
          const meta = await getSessionMeta(sessionIdRef.current);
          if (meta) {
            const ageMs = Date.now() - meta.updatedAt;
            if (ageMs > 12 * 60 * 60 * 1000) {
              setReturningSince(meta.updatedAt);
            }
          }
          setMessages(stored);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    async function onQuickExit() {
      setMessages([]);
      setInput("");
      try {
        await deleteEverything();
        deleteDeviceKey();
      } catch {}
    }
    function onNewConversation() {
      sessionIdRef.current = newSession();
      setMessages([]);
      setInput("");
      setOutage(false);
      setReturningSince(null);
      setPauseSuggested(false);
      setReflectionQuote(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    window.addEventListener("stay:quick-exit", onQuickExit);
    window.addEventListener("stay:new-conversation", onNewConversation);
    return () => {
      window.removeEventListener("stay:quick-exit", onQuickExit);
      window.removeEventListener("stay:new-conversation", onNewConversation);
    };
  }, []);

  useEffect(() => {
    if (loaded) inputRef.current?.focus();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (messages.length > 0) return;
    if (input.length > 0) return;
    const t = setTimeout(() => {
      if (messagesRef.current.length === 0) setShowExamples(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [loaded, messages.length, input.length]);

  useEffect(() => {
    if (input.length > 0 || messages.length > 0) setShowExamples(false);
  }, [input.length, messages.length]);

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

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  async function handlePanicCheck(value: string): Promise<boolean> {
    if (!matchesPanicPhrase(value)) return false;
    try {
      await deleteEverything();
      deleteDeviceKey();
    } catch {}
    window.dispatchEvent(new Event("stay:quick-exit"));
    return true;
  }

  async function onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value.slice(0, MAX_INPUT_CHARS);
    setInput(val);
    // Panic phrase check (single-line, exact match)
    if (val && !val.includes("\n")) {
      const triggered = await handlePanicCheck(val);
      if (triggered) return;
    }
  }

  function pickExample(text: string) {
    setInput(text);
    setShowExamples(false);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      const el = inputRef.current;
      if (el) el.setSelectionRange(text.length, text.length);
    });
  }

  function startTranslation() {
    setInput(TRANSLATION_STARTER);
    setShowExamples(false);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      const el = inputRef.current;
      if (el) el.setSelectionRange(TRANSLATION_STARTER.length, TRANSLATION_STARTER.length);
    });
  }

  function onVoiceTranscript(text: string, isFinal: boolean) {
    if (isFinal) {
      setInput((prev) => (prev ? prev + " " + text : text));
      setInterimVoice("");
    } else {
      setInterimVoice(text);
    }
  }

  function applyToolEvent(messageId: string, evt: ToolEvent) {
    if (evt.name === "suggest_pause") {
      setPauseSuggested(true);
    } else if (evt.name === "end_with_reflection") {
      const q = evt.input.quote?.trim();
      if (q) setReflectionQuote(q);
    }
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, tools: [...(m.tools ?? []), evt] }
          : m
      )
    );
  }

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    if (trimmed.length > MAX_INPUT_CHARS) {
      setInput(trimmed.slice(0, MAX_INPUT_CHARS));
      return;
    }
    if (await handlePanicCheck(trimmed)) return;

    stickyBottomRef.current = true;
    setOutage(false);
    setReturningSince(null);
    setPauseSuggested(false);
    setReflectionQuote(null);

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
    setInterimVoice("");
    setStreaming(true);

    try {
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

      if (res.status === 429 || !res.ok || !res.body) {
        setOutage(true);
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accText = "";

      const processLine = (line: string) => {
        if (!line.trim()) return;
        try {
          const evt = JSON.parse(line) as StreamEvent;
          if (evt.type === "text") {
            accText += evt.data;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id ? { ...m, content: accText } : m
              )
            );
          } else if (evt.type === "tool") {
            applyToolEvent(assistantMsg.id, {
              name: evt.name,
              input: evt.input,
            });
          }
        } catch {
          // malformed line — skip
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl = buffer.indexOf("\n");
        while (nl !== -1) {
          const line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          processLine(line);
          nl = buffer.indexOf("\n");
        }
      }
      if (buffer.trim()) processLine(buffer);

      if (!accText.trim() && messagesRef.current.find((m) => m.id === assistantMsg.id)?.tools?.length === 0) {
        setOutage(true);
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
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

  function acceptPause() {
    setPauseSuggested(false);
    void saveSession(sessionIdRef.current, messagesRef.current).catch(() => {});
  }

  const canSend = input.trim().length > 0 && !streaming && loaded;
  const remaining = MAX_INPUT_CHARS - input.length;
  const showWelcome =
    loaded &&
    messages.length === 0 &&
    !outage &&
    input.length === 0 &&
    returningSince === null;
  const showReturning =
    loaded &&
    messages.length === 0 &&
    !outage &&
    input.length === 0 &&
    returningSince !== null;
  const displayInput = interimVoice ? input + " " + interimVoice : input;

  return (
    <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-8 pb-6 sm:px-6 sm:pt-12"
      >
        {showWelcome && <Welcome />}
        {showReturning && returningSince && (
          <ReturningWelcome since={returningSince} />
        )}
        {outage && <OutagePanel />}

        <div className="space-y-7">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>

        {pauseSuggested && (
          <PausePrompt onAccept={acceptPause} onDismiss={() => setPauseSuggested(false)} />
        )}

        {reflectionQuote && (
          <ReflectionCard
            quote={reflectionQuote}
            onClose={() => setReflectionQuote(null)}
          />
        )}

        {showExamples && messages.length === 0 && (
          <div className="mt-10 animate-fadein">
            <p className="mb-3 font-sans text-xs uppercase tracking-widest text-foreground-tertiary">
              or, if you&apos;re not sure where to start
            </p>
            <ul className="space-y-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => pickExample(p)}
                    className="w-full rounded-xl border border-border bg-background-elevated/60 px-4 py-3 text-left font-serif text-base leading-snug text-foreground-secondary transition-colors hover:border-accent hover:text-foreground"
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>

      <div className="shrink-0 bg-background px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
        <div className="flex items-end gap-2 rounded-2xl border border-border-strong bg-background-elevated px-3 py-2.5 shadow-sm transition-colors focus-within:border-accent sm:px-4 sm:py-3">
          <textarea
            ref={inputRef}
            value={displayInput}
            onChange={onInputChange}
            onKeyDown={handleKey}
            placeholder="say anything…"
            rows={1}
            disabled={streaming || !loaded}
            maxLength={MAX_INPUT_CHARS}
            className="flex-1 resize-none bg-transparent font-sans text-base leading-relaxed text-foreground placeholder:text-foreground-tertiary focus:outline-none"
          />
          <VoiceInput
            onTranscript={onVoiceTranscript}
            disabled={streaming || !loaded}
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
        <div className="mt-1.5 flex items-center justify-between font-sans text-[11px] text-foreground-tertiary">
          <button
            type="button"
            onClick={startTranslation}
            className="transition-colors hover:text-foreground"
          >
            draft a message →
          </button>
          {remaining < 200 && <span>{remaining} characters left</span>}
        </div>
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

function ReturningWelcome({ since }: { since: number }) {
  const ago = formatTimeAgo(since);
  return (
    <div className="animate-fadein-slow space-y-3 font-serif text-lg leading-relaxed text-foreground">
      <p>It&apos;s been {ago} since we talked.</p>
      <p>I&apos;m here. Pick up where we were, or start something new.</p>
      <p className="text-foreground-secondary">
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new Event("stay:new-conversation"))
          }
          className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
        >
          start fresh →
        </button>
      </p>
    </div>
  );
}

function OutagePanel() {
  return (
    <div className="animate-fadein space-y-4 rounded-2xl border border-border-strong bg-background-elevated p-5 font-serif text-base leading-relaxed text-foreground">
      <p>I&apos;m having trouble reaching the model right now.</p>
      <p>
        If this is something that can wait, please try again in a few minutes.
        If it can&apos;t —
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

function PausePrompt({
  onAccept,
  onDismiss,
}: {
  onAccept: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="mt-6 animate-fadein rounded-2xl border border-accent/30 bg-background-elevated/80 px-5 py-4 font-sans text-sm text-foreground">
      <p className="mb-3 leading-relaxed">
        Want to step away for a minute? Whatever we talked about will be here
        when you come back.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="rounded-md border border-accent bg-accent px-3 py-1.5 text-xs text-background transition-colors hover:bg-accent-hover"
        >
          i&apos;m good for now
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md border border-border-strong px-3 py-1.5 text-xs text-foreground-secondary transition-colors hover:text-foreground"
        >
          keep going
        </button>
      </div>
    </div>
  );
}

function ReflectionCard({
  quote,
  onClose,
}: {
  quote: string;
  onClose: () => void;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    isInsightSaved(quote).then(setSaved);
  }, [quote]);

  async function keep() {
    try {
      await saveInsight(quote);
      setSaved(true);
    } catch {}
  }

  return (
    <div className="mt-8 animate-fadein-slow rounded-2xl border border-border-strong bg-background-elevated/60 px-5 py-6 font-serif text-foreground">
      <p className="mb-2 font-sans text-xs uppercase tracking-widest text-foreground-tertiary">
        before you go
      </p>
      <p className="mb-4 text-base leading-relaxed text-foreground-secondary">
        Something you said earlier:
      </p>
      <blockquote className="border-l-2 border-accent pl-4 text-lg leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <p className="mt-4 text-base text-foreground-secondary">
        That&apos;s worth keeping with you.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 font-sans text-xs">
        <button
          type="button"
          onClick={keep}
          disabled={saved}
          className="rounded-md border border-accent bg-accent px-3 py-1.5 text-background transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {saved ? "✓ kept" : "keep this"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border-strong px-3 py-1.5 text-foreground-secondary transition-colors hover:text-foreground"
        >
          dismiss
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "assistant") {
    const tools = message.tools ?? [];
    const resourceTools = tools.filter((t) => t.name === "surface_resource");
    const safetyPlanTools = tools.filter(
      (t) => t.name === "generate_safety_plan"
    );
    return (
      <div className="space-y-3">
        <div className="animate-fadein border-l-2 border-accent/30 pl-4 font-serif text-base leading-relaxed text-foreground sm:pl-5 sm:text-lg">
          {message.content ? renderWithPhones(message.content) : <BreathingDot />}
        </div>
        {resourceTools.map((t, i) => (
          <ResourceCard key={i} resourceId={t.input.id ?? ""} />
        ))}
        {safetyPlanTools.map((t, i) => {
          const plan = t.input.plan as SafetyPlan | undefined;
          if (!plan) return null;
          return <SafetyPlanCard key={i} plan={plan} />;
        })}
      </div>
    );
  }

  return <UserMessage content={message.content} />;
}

function UserMessage({ content }: { content: string }) {
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    isInsightSaved(content).then(setSaved);
  }, [content]);

  async function keep() {
    if (pending) return;
    setPending(true);
    try {
      await saveInsight(content);
      setSaved(true);
    } catch {}
    setPending(false);
  }

  return (
    <div className="ml-auto flex max-w-[88%] flex-col items-end gap-1 sm:max-w-[85%]">
      <div className="animate-fadein whitespace-pre-wrap rounded-2xl bg-background-elevated px-4 py-3 font-sans text-sm leading-relaxed text-foreground/85 sm:text-base">
        {content}
      </div>
      <button
        type="button"
        onClick={keep}
        disabled={pending}
        title={saved ? "saved" : "keep this"}
        aria-label={saved ? "insight saved" : "keep this insight"}
        className="font-sans text-[10px] text-foreground-tertiary opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        {saved ? "✓ kept" : "★ keep"}
      </button>
    </div>
  );
}

function ResourceCard({ resourceId }: { resourceId: string }) {
  const r = RESOURCES[resourceId];
  if (!r) return null;
  return (
    <div className="ml-4 animate-fadein rounded-xl border border-accent/40 bg-background-elevated/80 px-4 py-3 font-sans sm:ml-5">
      <p className="text-sm font-medium text-foreground">{r.name}</p>
      <p className="mt-0.5 text-xs text-foreground-secondary">{r.description}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {r.call && (
          <a
            href={`tel:${r.call.replace(/\D/g, "")}`}
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            📞 call {r.call}
          </a>
        )}
        {r.text && (
          <a
            href={`sms:${r.text}`}
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            💬 text {r.text}
          </a>
        )}
      </div>
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
      segments.push(
        <span key={key++}>{remaining.slice(0, earliest.index)}</span>
      );
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

function formatTimeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"}`;
  }
  if (days >= 1) {
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}
