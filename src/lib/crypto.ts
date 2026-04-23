/**
 * WebCrypto wrapper. AES-GCM-256 encryption with a per-device key.
 *
 * The key is generated client-side on first use and stored in localStorage.
 * Threat model: anyone who can unlock this browser can read this data.
 * That's the same threat model as iMessage / Email on this device.
 *
 * For higher security tiers (cloud backup), the key is derived from a
 * BIP-39 phrase the user manages — see architecture-v0.en.md. (Not v0.)
 */

const KEY_STORAGE = "stay:device-key-v1";

async function getOrCreateKey(): Promise<CryptoKey> {
  if (typeof window === "undefined")
    throw new Error("crypto only works in the browser");

  const existing = localStorage.getItem(KEY_STORAGE);
  if (existing) {
    const raw = Uint8Array.from(atob(existing), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey("raw", raw, "AES-GCM", true, [
      "encrypt",
      "decrypt",
    ]);
  }

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  localStorage.setItem(KEY_STORAGE, b64);
  return key;
}

export async function encryptString(plain: string): Promise<string> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain)
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptString(b64: string): Promise<string> {
  const key = await getOrCreateKey();
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plain);
}

export function deleteDeviceKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_STORAGE);
}
