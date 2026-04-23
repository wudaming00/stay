/**
 * Panic delete phrase. Optional. Pre-set in settings.
 *
 * When the user types this exact phrase in the chat input, the entire
 * conversation history (and the panic phrase itself) is wiped, the device
 * key is destroyed, and the page redirects to a neutral location.
 *
 * Use case: someone is reading over your shoulder. You type the phrase
 * (sounds normal, looks normal). Everything is gone before they see anything.
 */

const STORAGE_KEY = "stay:panic-phrase-v1";

export function getPanicPhrase(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setPanicPhrase(phrase: string): void {
  if (typeof window === "undefined") return;
  const trimmed = phrase.trim();
  if (!trimmed) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, trimmed.toLowerCase());
}

export function clearPanicPhrase(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function matchesPanicPhrase(input: string): boolean {
  const phrase = getPanicPhrase();
  if (!phrase) return false;
  return input.trim().toLowerCase() === phrase;
}
