"use client";

import { useEffect, useRef, useState } from "react";
import type { Message, SafetyPlan, StreamEvent, ToolEvent } from "@/lib/types";
import {
  PHONE_PATTERNS,
  RESOURCES,
  detectResourcesInText,
} from "@/lib/resources";
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
import { addEntry as addDiaryEntry, isDiaryEnabled } from "@/lib/diary";
import { matchesPanicPhrase } from "@/lib/panic";
import { deleteDeviceKey } from "@/lib/crypto";
import { track } from "@/lib/telemetry";
import VoiceInput from "./VoiceInput";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const MAX_INPUT_CHARS = 4000;
const MAX_MESSAGES_KEPT = 60;
const RETURNING_THRESHOLD_MS = 12 * 60 * 60 * 1000;
const HEAVY_CHECKIN_WINDOW_MS = 72 * 60 * 60 * 1000;
// Resources that classify a prior session as "heavy" and qualify it for a
// quiet next-open check-in. Stored locally only; never sent anywhere.
const HEAVY_RESOURCE_IDS = new Set(["988", "911", "dv_hotline"]);

function classifyAsHeavy(messages: Message[]): boolean {
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    for (const t of m.tools ?? []) {
      if (t.name === "generate_safety_plan") return true;
      if (
        t.name === "surface_resource" &&
        typeof t.input.id === "string" &&
        HEAVY_RESOURCE_IDS.has(t.input.id)
      ) {
        return true;
      }
    }
  }
  return false;
}

const EXAMPLE_PROMPTS = [
  "I just had a hard conversation and I'm spinning",
  "Help me figure out how to say something to someone",
  "I just need to think out loud for a minute",
];

const TRANSLATION_STARTER =
  "I'm trying to figure out how to say something to someone. Can you help me find the words?\n\nHere's what's going on: ";

const HELP_SOMEONE_STARTER =
  "Someone I love is in a really dark place and I don't know what to do. ";

/** Seed prefills sent via ?seed= URL param from SEO landing pages. */
const SEED_PREFILLS: Record<string, string> = {
  draft: TRANSLATION_STARTER,
  "help-someone": HELP_SOMEONE_STARTER,
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [interimVoice, setInterimVoice] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [outage, setOutage] = useState(false);
  /** When non-null and `messages` is empty, prior session exists but was not
   *  auto-restored — user gets explicit pick-up/start-fresh choice. */
  const [returningSince, setReturningSince] = useState<number | null>(null);
  /** Stashed prior messages awaiting user "pick up where we were" choice. */
  const [pendingResume, setPendingResume] = useState<Message[] | null>(null);
  /** Was the prior (unresumed) session heavy enough to merit a check-in? */
  const [resumeWasHeavy, setResumeWasHeavy] = useState(false);
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
        if (cancelled || !stored || stored.length === 0) return;
        const meta = await getSessionMeta(sessionIdRef.current);
        const ageMs = meta ? Date.now() - meta.updatedAt : Infinity;
        if (ageMs > RETURNING_THRESHOLD_MS) {
          // Don't auto-restore stale sessions. Surface the welcome and let
          // the user choose to resume or start fresh.
          setReturningSince(meta?.updatedAt ?? Date.now());
          setPendingResume(stored);
          setResumeWasHeavy(
            classifyAsHeavy(stored) && ageMs < HEAVY_CHECKIN_WINDOW_MS
          );
        } else {
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

  function resumePending() {
    if (!pendingResume) return;
    setMessages(pendingResume);
    setPendingResume(null);
    setReturningSince(null);
    setResumeWasHeavy(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

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
      setPendingResume(null);
      setResumeWasHeavy(false);
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

  // Apply ?seed=draft / ?seed=help-someone prefill from SEO landing pages.
  // Only applies on a fresh session (no messages, no input typed yet).
  useEffect(() => {
    if (!loaded) return;
    if (typeof window === "undefined") return;
    if (messages.length > 0 || input.length > 0) return;
    const params = new URLSearchParams(window.location.search);
    const seed = params.get("seed");
    if (!seed) return;
    const prefill = SEED_PREFILLS[seed];
    if (!prefill) return;
    setInput(prefill);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(prefill.length, prefill.length);
      }
    });
    // Clean the URL so refresh doesn't re-prefill on top of typed content.
    const url = new URL(window.location.href);
    url.searchParams.delete("seed");
    window.history.replaceState({}, "", url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // Surface example prompts only after a long silence. Welcome ends
  // around 7s; jumping in at 8s felt pushy. 25s gives users real space
  // to sit with silence before the product nudges.
  useEffect(() => {
    if (!loaded) return;
    if (messages.length > 0) return;
    if (input.length > 0) return;
    const t = setTimeout(() => {
      if (messagesRef.current.length === 0) setShowExamples(true);
    }, 25000);
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
    track("panic_phrase_triggered");
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
    track("translation_started");
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
      track("reflection_card_shown");
    } else if (evt.name === "surface_resource") {
      const id = typeof evt.input.id === "string" ? evt.input.id : undefined;
      if (id) track("crisis_resource_surfaced", { resourceId: id });
    } else if (evt.name === "generate_safety_plan") {
      track("safety_plan_generated");
    } else if (evt.name === "log_entry") {
      const entry = evt.input.entry;
      if (
        entry &&
        isDiaryEnabled() &&
        (entry.emotion || entry.urge || entry.event_summary || entry.skill_used)
      ) {
        const sid = getCurrentSessionId();
        addDiaryEntry(entry, sid).catch(() => {
          // Silent failure — diary is best-effort.
        });
        track("diary_entry_logged");
      }
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

    // If a stale session is pending and the user typed instead of clicking
    // "pick up where we were", treat that as start-fresh so we don't
    // overwrite the prior session's storage blob under the same id.
    if (pendingResume !== null) {
      sessionIdRef.current = newSession();
      setPendingResume(null);
      setResumeWasHeavy(false);
    }
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
    if (messages.length === 0) track("session_started");
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

      // Debug mode (?debug=true in URL): log full request/response
      // to browser console for founder/dev debugging only. No server
      // transmission, no analytics — visible only on this device.
      const isDebug =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("debug") === "true";
      const userTurnIndex = apiMessages.filter((m) => m.role === "user").length;
      if (isDebug) {
        console.group(`[stay.debug] turn ${userTurnIndex}`);
        console.log("user message:", apiMessages[apiMessages.length - 1]?.content);
        console.log("messages in context:", apiMessages.length);
        console.log("Active SI keyword regex match:",
          /\b(I want to die|kill myself|kms|unalive|end (?:it|my life)|fall asleep and not wake up|want to disappear|I'?m a burden|I'?ve had enough of living)\b|我想死|想死了|不想活|想消失|想了断|不想拖累家[里人]|了断|活够了|想 over 了|想睡过去/i.test(apiMessages[apiMessages.length - 1]?.content ?? ""));
      }

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
            if (isDebug) console.log("[stay.debug] tool fired:", evt.name, evt.input);
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

      if (isDebug) {
        const finalMsg = messagesRef.current.find((m) => m.id === assistantMsg.id);
        console.log("[stay.debug] stay response:", accText);
        console.log("[stay.debug] tools fired:", finalMsg?.tools?.map((t) => t.name) ?? []);
        console.log("[stay.debug] companion-during-call language present:",
          /\b(while you dial|keep this (?:window|tab) open|type me anytime|I'?ll (?:stay|be) (?:here|with you))\b|我陪你|你拨|窗口开着|不挂/i.test(accText));
        console.groupEnd();
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
    track("session_ended_naturally", {
      turnCount: messagesRef.current.filter((m) => m.role === "user").length,
    });
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
          <ReturningWelcome
            since={returningSince}
            heavy={resumeWasHeavy}
            canResume={pendingResume !== null}
            onResume={resumePending}
          />
        )}
        {outage && <OutagePanel />}

        <div className="space-y-7">
          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              message={m}
              priorMessages={messages.slice(0, i)}
            />
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

      <div className="shrink-0 bg-background px-4 pb-5 pt-3 sm:px-6 sm:pb-6">
        <div className="flex items-end gap-1 rounded-lg border border-border-strong bg-background px-3 py-2 transition-colors duration-150 focus-within:border-accent focus-within:bg-background-raised sm:px-3.5 sm:py-2.5">
          <textarea
            ref={inputRef}
            value={displayInput}
            onChange={onInputChange}
            onKeyDown={handleKey}
            placeholder="say anything…"
            rows={1}
            disabled={streaming || !loaded}
            maxLength={MAX_INPUT_CHARS}
            className="flex-1 resize-none bg-transparent py-1 font-sans text-[15px] leading-relaxed text-foreground placeholder:text-foreground-tertiary disabled:opacity-50 sm:text-base"
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
            className="shrink-0 self-end rounded-md p-1.5 text-foreground-tertiary transition-colors hover:bg-background-sunken hover:text-foreground disabled:opacity-30 enabled:text-accent enabled:hover:bg-accent-soft enabled:hover:text-accent-hover"
          >
            <SendIcon />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between px-1 font-sans text-[11px] text-foreground-tertiary">
          <button
            type="button"
            onClick={startTranslation}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <DraftIcon />
            <span>draft a message</span>
          </button>
          {remaining < 200 && <span>{remaining} characters left</span>}
        </div>
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className="relative min-h-[11rem] font-serif text-xl leading-relaxed text-foreground sm:min-h-[9rem] sm:text-2xl">
      <div
        className="absolute inset-x-0 top-0 animate-show-then-hide space-y-3 tracking-tight"
        style={{ animationDelay: "200ms" }}
      >
        <p>I&apos;m here.</p>
        <p className="text-foreground-secondary">
          I&apos;m Stay — an AI to think out loud with.
        </p>
      </div>
      <div
        className="absolute inset-x-0 top-0 animate-show-then-hide text-foreground-secondary"
        style={{ animationDelay: "3200ms" }}
      >
        <p>You&apos;re safe with me.</p>
        <p>Whatever you say stays between us.</p>
      </div>
      <div
        className="absolute inset-x-0 top-0 animate-fadein-slow tracking-tight"
        style={{ animationDelay: "6200ms" }}
      >
        <p>Tell me what&apos;s happening.</p>
      </div>
    </div>
  );
}

function ReturningWelcome({
  since,
  heavy,
  canResume,
  onResume,
}: {
  since: number;
  heavy: boolean;
  canResume: boolean;
  onResume: () => void;
}) {
  const ago = formatTimeAgo(since);
  return (
    <div className="animate-fadein-slow space-y-4 font-serif text-lg leading-relaxed text-foreground">
      {heavy ? (
        <>
          <p>It&apos;s been {ago}. I&apos;ve been thinking about you.</p>
          <p className="text-foreground-secondary">
            Last time was a lot. No pressure to pick it back up — but I&apos;m
            here either way. How are you tonight?
          </p>
        </>
      ) : (
        <>
          <p>It&apos;s been {ago} since we talked.</p>
          <p className="text-foreground-secondary">
            I&apos;m here. Pick up where we were, or start something new.
          </p>
        </>
      )}
      <div className="flex flex-wrap gap-2 pt-1 font-sans text-sm">
        {canResume && (
          <button
            type="button"
            onClick={onResume}
            className="rounded-md border border-accent bg-accent px-3 py-1.5 text-xs text-background transition-colors hover:bg-accent-hover"
          >
            pick up where we were
          </button>
        )}
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new Event("stay:new-conversation"))
          }
          className="rounded-md border border-border-strong px-3 py-1.5 text-xs text-foreground-secondary transition-colors hover:text-foreground"
        >
          start fresh
        </button>
      </div>
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

function MessageBubble({
  message,
  priorMessages = [],
}: {
  message: Message;
  priorMessages?: Message[];
}) {
  if (message.role === "assistant") {
    const tools = message.tools ?? [];
    const explicitResourceIds = tools
      .filter((t) => t.name === "surface_resource")
      .map((t) => t.input.id)
      .filter((id): id is string => !!id);
    // Fallback: if AI mentioned a crisis number in text but didn't fire
    // surface_resource() tool, still render the card immediately.
    const detectedResourceIds = detectResourcesInText(message.content);
    // De-dupe within this message
    const idsThisTurn: string[] = [];
    const seenThisTurn = new Set<string>();
    for (const id of [...explicitResourceIds, ...detectedResourceIds]) {
      if (!seenThisTurn.has(id)) {
        seenThisTurn.add(id);
        idsThisTurn.push(id);
      }
    }
    // Suppress cards for resources already shown earlier in the session.
    // Inline text autolink still works on every mention; the big card
    // only renders the FIRST time we surface a given resource.
    const previouslyShown = new Set<string>();
    for (const prior of priorMessages) {
      if (prior.role !== "assistant") continue;
      const priorExplicit = (prior.tools ?? [])
        .filter((t) => t.name === "surface_resource")
        .map((t) => t.input.id)
        .filter((id): id is string => !!id);
      const priorDetected = detectResourcesInText(prior.content);
      for (const id of [...priorExplicit, ...priorDetected]) {
        previouslyShown.add(id);
      }
    }
    const allResourceIds = idsThisTurn.filter(
      (id) => !previouslyShown.has(id)
    );
    const safetyPlanTools = tools.filter(
      (t) => t.name === "generate_safety_plan"
    );
    const logEntryTools = isDiaryEnabled()
      ? tools.filter((t) => t.name === "log_entry")
      : [];
    return (
      <div className="space-y-3">
        <div className="animate-fadein font-serif text-base leading-relaxed text-foreground sm:text-lg">
          {message.content ? (
            <div className="relative pl-5 sm:pl-6">
              <span
                aria-hidden
                className="absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-full bg-accent"
              />
              {renderWithPhones(message.content)}
            </div>
          ) : (
            <div className="pl-5 sm:pl-6">
              <BreathingDot />
            </div>
          )}
        </div>
        {allResourceIds.map((id) => (
          <ResourceCard key={id} resourceId={id} />
        ))}
        {safetyPlanTools.map((t, i) => {
          const plan = t.input.plan as SafetyPlan | undefined;
          if (!plan) return null;
          return <SafetyPlanCard key={i} plan={plan} />;
        })}
        {logEntryTools.map((t, i) => {
          const entry = t.input.entry;
          if (!entry) return null;
          const summary = [
            entry.emotion &&
              (entry.emotion_intensity != null
                ? `${entry.emotion} ${entry.emotion_intensity}/10`
                : entry.emotion),
            entry.urge &&
              (entry.urge_intensity != null
                ? `urge: ${entry.urge} ${entry.urge_intensity}/10`
                : `urge: ${entry.urge}`),
            entry.event_summary,
            entry.skill_used && `skill: ${entry.skill_used}`,
          ]
            .filter(Boolean)
            .join(" · ");
          if (!summary) return null;
          return (
            <a
              key={i}
              href="/log"
              className="ml-5 inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground/80 sm:ml-6"
            >
              <span aria-hidden>·</span>
              <span>logged · {summary}</span>
            </a>
          );
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
    <div className="group ml-auto flex max-w-[88%] flex-col items-end gap-1 sm:max-w-[82%]">
      <div className="animate-fadein whitespace-pre-wrap rounded-[18px] rounded-br-sm border border-border/60 bg-background-elevated px-4 py-2.5 font-sans text-sm leading-relaxed text-foreground sm:text-[15px]">
        {content}
      </div>
      <button
        type="button"
        onClick={keep}
        disabled={pending}
        title={saved ? "saved to insights" : "keep this"}
        aria-label={saved ? "insight saved" : "keep this insight"}
        className="font-sans text-[10px] text-foreground-tertiary opacity-0 transition-opacity hover:text-accent-hover group-hover:opacity-100"
      >
        {saved ? "✓ kept" : "keep"}
      </button>
    </div>
  );
}

function ResourceCard({ resourceId }: { resourceId: string }) {
  const r = RESOURCES[resourceId];
  if (!r) return null;
  return (
    <div className="animate-fadein ml-5 sm:ml-6">
      <div className="rounded-xl border border-accent/30 bg-accent-soft/40 px-4 py-3 font-sans">
        <div className="mb-1 flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
          />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-hover">
            crisis resource
          </p>
        </div>
        <p className="text-[15px] font-medium text-foreground">{r.name}</p>
        <p className="mt-0.5 text-xs text-foreground-secondary">
          {r.description}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {r.call && (
            <a
              href={`tel:${r.call.replace(/\D/g, "")}`}
              className="btn btn-primary btn-xs"
            >
              <PhoneIcon />
              <span>call {r.call}</span>
            </a>
          )}
          {r.text && (
            <a
              href={`sms:${r.text}`}
              className="btn btn-secondary btn-xs"
            >
              <ChatIcon />
              <span>text {r.text}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function DraftIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8.5 2.5l1 1-5 5H3.5V7z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 2.5h2l1 2.5-1.5 1a6 6 0 0 0 3.5 3.5l1-1.5 2.5 1v2a1 1 0 0 1-1 1A9 9 0 0 1 2 3.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6l-3 2v-2H4a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function BreathingDot() {
  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <span className="h-1.5 w-1.5 animate-breath rounded-full bg-accent" />
      <span className="h-1.5 w-1.5 animate-breath rounded-full bg-accent [animation-delay:266ms]" />
      <span className="h-1.5 w-1.5 animate-breath rounded-full bg-accent [animation-delay:533ms]" />
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
        earliest = { index: m.index, match: m[0], tel: tel };
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
