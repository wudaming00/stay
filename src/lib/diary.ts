/**
 * DBT-style diary log. Each entry is auto-extracted from conversation by
 * the model (log_entry tool) and written here. The user owns the data,
 * encrypted at rest, exportable as Markdown for therapist sessions.
 *
 * Storage: IndexedDB store separate from sessions; encryption via the
 * same per-device key. Mirrors src/lib/storage.ts pattern.
 */

import { encryptString, decryptString } from "./crypto";
import type { DiaryEntry, DiaryFields } from "./types";

const DB_NAME = "stay";
const DB_VERSION = 2;
const STORE = "diary";
const RETENTION_DAYS = 365;

interface StoredEntry {
  id: string;
  createdAt: number;
  ciphertext: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("sessions")) {
        db.createObjectStore("sessions", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | Promise<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const store = t.objectStore(STORE);
        const result = fn(store);
        t.oncomplete = () => {
          if (result instanceof IDBRequest) resolve(result.result as T);
          else Promise.resolve(result).then(resolve, reject);
        };
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      })
  );
}

function generateEntryId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function addEntry(
  fields: DiaryFields,
  sessionId: string
): Promise<DiaryEntry> {
  const entry: DiaryEntry = {
    id: generateEntryId(),
    createdAt: Date.now(),
    sessionId,
    ...fields,
  };
  if (typeof window === "undefined") return entry;
  const ciphertext = await encryptString(JSON.stringify(entry));
  const record: StoredEntry = {
    id: entry.id,
    createdAt: entry.createdAt,
    ciphertext,
  };
  await tx("readwrite", (s) => s.put(record));
  return entry;
}

export async function listEntries(): Promise<DiaryEntry[]> {
  if (typeof window === "undefined") return [];
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const records = await tx<StoredEntry[]>("readonly", (s) => {
    return new Promise<StoredEntry[]>((resolve, reject) => {
      const all: StoredEntry[] = [];
      const req = s.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          all.push(cursor.value as StoredEntry);
          cursor.continue();
        } else {
          resolve(all);
        }
      };
      req.onerror = () => reject(req.error);
    }) as unknown as IDBRequest<StoredEntry[]>;
  });
  const entries: DiaryEntry[] = [];
  for (const r of records) {
    if (r.createdAt < cutoff) {
      await tx("readwrite", (s) => s.delete(r.id));
      continue;
    }
    try {
      const json = await decryptString(r.ciphertext);
      entries.push(JSON.parse(json) as DiaryEntry);
    } catch {
      // skip undecryptable
    }
  }
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateEntry(
  id: string,
  fields: DiaryFields
): Promise<void> {
  if (typeof window === "undefined") return;
  const existing = await tx<StoredEntry | undefined>("readonly", (s) =>
    s.get(id)
  );
  if (!existing) return;
  const decrypted = await decryptString(existing.ciphertext);
  const merged: DiaryEntry = { ...JSON.parse(decrypted), ...fields };
  const ciphertext = await encryptString(JSON.stringify(merged));
  const record: StoredEntry = {
    id,
    createdAt: existing.createdAt,
    ciphertext,
  };
  await tx("readwrite", (s) => s.put(record));
}

export async function deleteEntry(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  await tx("readwrite", (s) => s.delete(id));
}

export async function deleteAllEntries(): Promise<void> {
  if (typeof window === "undefined") return;
  await tx("readwrite", (s) => s.clear());
}

function fmtDate(ts: number): string {
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}

function fmtTime(ts: number): string {
  const d = new Date(ts);
  return d.toTimeString().slice(0, 5);
}

export function exportMarkdown(entries: DiaryEntry[]): string {
  if (entries.length === 0) return "# Diary log\n\n_(no entries)_\n";
  const byDay = new Map<string, DiaryEntry[]>();
  for (const e of entries) {
    const day = fmtDate(e.createdAt);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(e);
  }
  const days = Array.from(byDay.keys()).sort().reverse();
  const out: string[] = [
    "# Diary log",
    "",
    "_User notes prepared with AI assistance. Review before sharing with your clinician._",
    "",
  ];
  for (const day of days) {
    out.push(`## ${day}`);
    out.push("");
    for (const e of byDay.get(day)!) {
      const parts: string[] = [`**${fmtTime(e.createdAt)}**`];
      if (e.emotion) {
        const intensity = e.emotion_intensity != null ? ` ${e.emotion_intensity}/10` : "";
        parts.push(`emotion: ${e.emotion}${intensity}`);
      }
      if (e.urge) {
        const intensity = e.urge_intensity != null ? ` ${e.urge_intensity}/10` : "";
        const acted = e.urge_acted_on === true
          ? " (acted on)"
          : e.urge_acted_on === false
          ? " (did NOT act on)"
          : "";
        parts.push(`urge: ${e.urge}${intensity}${acted}`);
      }
      if (e.event_summary) parts.push(`event: ${e.event_summary}`);
      if (e.skill_used) parts.push(`skill used: ${e.skill_used}`);
      if (e.notes) parts.push(`notes: ${e.notes}`);
      out.push(`- ${parts.join(" · ")}`);
    }
    out.push("");
  }
  return out.join("\n");
}
