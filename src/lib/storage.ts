/**
 * IndexedDB session storage. Each session is encrypted at rest.
 *
 * v0 default: 90-day local. Auto-delete on read if a session is older than
 * the retention window. (No background process — cleanup happens on access.)
 */

import { encryptString, decryptString } from "./crypto";
import type { Message } from "./types";

const DB_NAME = "stay";
const DB_VERSION = 1;
const STORE = "sessions";
const RETENTION_DAYS = 90;
const CURRENT_SESSION_KEY = "stay:current-session-id";

interface StoredSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  ciphertext: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
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

function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getCurrentSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(CURRENT_SESSION_KEY);
  if (!id) {
    id = generateSessionId();
    localStorage.setItem(CURRENT_SESSION_KEY, id);
  }
  return id;
}

export function newSession(): string {
  const id = generateSessionId();
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_SESSION_KEY, id);
  }
  return id;
}

export async function saveSession(
  id: string,
  messages: Message[]
): Promise<void> {
  if (typeof window === "undefined") return;
  if (messages.length === 0) return;
  const ciphertext = await encryptString(JSON.stringify(messages));
  const now = Date.now();
  const existing = await tx<StoredSession | undefined>("readonly", (s) =>
    s.get(id)
  );
  const record: StoredSession = {
    id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ciphertext,
  };
  await tx("readwrite", (s) => s.put(record));
}

export async function loadSession(id: string): Promise<Message[] | null> {
  if (typeof window === "undefined") return null;
  const record = await tx<StoredSession | undefined>("readonly", (s) =>
    s.get(id)
  );
  if (!record) return null;
  const ageMs = Date.now() - record.updatedAt;
  if (ageMs > RETENTION_DAYS * 24 * 60 * 60 * 1000) {
    await deleteSession(id);
    return null;
  }
  try {
    const json = await decryptString(record.ciphertext);
    return JSON.parse(json) as Message[];
  } catch {
    return null;
  }
}

export async function deleteSession(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  await tx("readwrite", (s) => s.delete(id));
}

export async function deleteEverything(): Promise<void> {
  if (typeof window === "undefined") return;
  await tx("readwrite", (s) => s.clear());
  localStorage.removeItem(CURRENT_SESSION_KEY);
}

export async function pruneExpired(): Promise<void> {
  if (typeof window === "undefined") return;
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  await tx("readwrite", (s) => {
    return new Promise<void>((resolve, reject) => {
      const req = s.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const v = cursor.value as StoredSession;
          if (v.updatedAt < cutoff) cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => reject(req.error);
    }) as unknown as IDBRequest<void>;
  });
}
