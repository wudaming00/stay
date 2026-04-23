"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Web Speech API voice input. Mostly for mobile (and accessibility).
 *
 * Supported on Safari iOS, Chrome, Edge, modern Android browsers.
 * Firefox support is limited.
 *
 * Permission is requested on first start. Audio is processed by the
 * browser/OS — never sent to our server.
 */

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

type SpeechRecognitionCtor = SpeechRecognitionConstructor | undefined;

function getRecognitionCtor(): SpeechRecognitionCtor {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export default function VoiceInput({
  onTranscript,
  disabled,
}: {
  onTranscript: (text: string, isFinal: boolean) => void;
  disabled?: boolean;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== undefined);
  }, []);

  function start() {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const text = result[0].transcript;
        if (result.isFinal) final += text;
        else interim += text;
      }
      if (final) onTranscript(final, true);
      else if (interim) onTranscript(interim, false);
    };
    r.onerror = () => {
      setListening(false);
    };
    r.onend = () => {
      setListening(false);
    };
    try {
      r.start();
      recognitionRef.current = r;
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  function stop() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setListening(false);
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => (listening ? stop() : start())}
      disabled={disabled}
      aria-label={listening ? "stop voice input" : "start voice input"}
      title={listening ? "stop listening" : "speak instead of type"}
      className={`shrink-0 self-end pb-0.5 font-sans text-base transition-colors disabled:opacity-30 ${
        listening
          ? "text-accent"
          : "text-foreground-tertiary hover:text-foreground"
      }`}
    >
      {listening ? "● rec" : "🎙"}
    </button>
  );
}
