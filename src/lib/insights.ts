/**
 * Insights — sentences the user (or AI quoting the user) has marked as
 * worth keeping. Stored encrypted in localStorage.
 *
 * The intent: at the end of a session, or when revisiting later, the user
 * can see a list of their own meaningful words. Not AI's words. Theirs.
 */

import { encryptString, decryptString } from "./crypto";

const STORAGE_KEY = "stay:insights-v1";
const MAX_INSIGHTS = 50;

export interface Insight {
  id: string;
  text: string;
  createdAt: number;
}

async function readAll(): Promise<Insight[]> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const json = await decryptString(raw);
    return JSON.parse(json) as Insight[];
  } catch {
    return [];
  }
}

async function writeAll(items: Insight[]): Promise<void> {
  if (typeof window === "undefined") return;
  const trimmed = items.slice(-MAX_INSIGHTS);
  const ciphertext = await encryptString(JSON.stringify(trimmed));
  localStorage.setItem(STORAGE_KEY, ciphertext);
}

export async function listInsights(): Promise<Insight[]> {
  return readAll();
}

export async function saveInsight(text: string): Promise<Insight> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("empty insight");
  const items = await readAll();
  // Dedupe by exact text match
  const existing = items.find((x) => x.text === trimmed);
  if (existing) return existing;
  const insight: Insight = {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    text: trimmed,
    createdAt: Date.now(),
  };
  await writeAll([...items, insight]);
  return insight;
}

export async function deleteInsight(id: string): Promise<void> {
  const items = await readAll();
  await writeAll(items.filter((x) => x.id !== id));
}

export async function deleteAllInsights(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function isInsightSaved(text: string): Promise<boolean> {
  const items = await readAll();
  return items.some((x) => x.text === text.trim());
}
