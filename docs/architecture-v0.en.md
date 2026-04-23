# Architecture v0 — Storage, Privacy, Identity

*Decisions about where data lives, who can read it, and how trust is structured. This is the technical foundation under the Constitution's privacy commitments.*

---

## Threat model

The product's core users include people in domestic violence, teenagers with hostile parents, victims of sexual harm, people in active suicidal crisis, and others whose primary device is shared, monitored, or unsafe. The architecture must protect them, not just paranoid users.

| # | Threat | Severity |
|---|--------|----------|
| 1 | Physical device access (housemate, family member opens unlocked phone) | High |
| 2 | Shared browser (one home computer, multiple users) | High |
| 3 | Lost/stolen device | Medium |
| 4 | Server-side breach | High *(if we have data)* |
| 5 | Legal subpoena / court order | Medium |
| 6 | Insider threat (us — the builders — being able to read user data) | High |
| 7 | Anthropic-side transit (the unavoidable LLM API path) | Mitigable but not eliminable |
| 8 | Coercion (abusive partner forces user to open product) | High *(core user scenario)* |
| 9 | Future-self regret (wanting to delete past content) | Low–Medium |

Designing against #1, #2, and #8 forces the most stringent architecture, which conveniently covers everything else.

---

## Core principles

### 1. No traditional accounts
Email + password is wrong for this product:
- Magic-link recovery means whoever holds the email can access
- Abusive partners often have email access
- Email itself is a tracking surface

**Identity model**: identity = possession of a key, not knowledge of a password. Closer to Signal than to Gmail.

### 2. Server can never read conversation content
If we use server storage at all (only for opt-in cross-device backup), it stores **encrypted blobs only**. We do not hold the keys. We physically cannot decrypt.

### 3. Anthropic transit is unavoidable — disclosed honestly
Conversation content must transit through Anthropic's API to generate responses. This is a physical fact of the product. We disclose it explicitly in the Constitution and ToS:
- TLS in transit
- Anthropic policy: no training on user data, 30-day deletion (except abuse investigation)
- We do not retain API request/response on our side

### 4. Defaults protect the most vulnerable
Default storage mode and UX patterns must be safe for someone whose phone is co-opted by an abusive partner. Stronger storage modes are explicit opt-ins.

---

## Three retention tiers

Each tier maps to a specific storage architecture, not just a deletion timer.

### Tier 1: Ephemeral

| Property | Implementation |
|----------|---------------|
| Client storage | In-memory only; cleared on tab close |
| Server storage | None |
| Cross-device | Not supported |
| Browser history | SPA + `replaceState` to avoid URL trail |
| Browser title | Static neutral string ("Reflect" or product name only) |
| Recoverability after close | Effectively zero (modulo browser cache leftovers) |
| Recommended for | Shared devices, DV scenarios, first-time tryouts, or users who want zero residue |

### Tier 2: Local 90-day (default)

| Property | Implementation |
|----------|---------------|
| Client storage | IndexedDB, AES-256 encrypted via WebCrypto API |
| Encryption key | Generated client-side via `crypto.subtle.generateKey`, stored in localStorage on the same device |
| Server storage | None |
| Cross-device | Not supported (local to this browser) |
| Auto-delete | 90 days from session creation |
| Threat model honestly | Anyone who can unlock this browser can read this data — equivalent to access to your iMessage / Email |
| Recommended for | Most users on personal devices; balance of utility and privacy |

### Tier 3a: Long-term local (no expiration)

Same as Tier 2 but no auto-deletion. Still no server storage, still no cross-device.

### Tier 3b: Long-term + encrypted cloud backup

The most deliberate choice. Requires explicit opt-in with strong warnings.

| Property | Implementation |
|----------|---------------|
| Client storage | Same as Tier 3a |
| Encryption key | **User-managed BIP-39 recovery phrase** (12 words). Generated client-side, displayed once, user instructed to save. Derives the AES key. |
| Server storage | `random_uuid → encrypted_blob`. Server holds only ciphertext + an opaque UUID. No mapping to person, email, or device fingerprint. |
| Cross-device sync | New device: paste recovery phrase, or scan QR code generated on existing device |
| Lost recovery phrase | **Data is permanently lost.** No recovery path. Disclosed up front. |
| Email | Optional, only for *system notifications* (suspicious access alerts, key changes). Never used for password reset, marketing, or identity verification. |
| Recommended for | Users who want longitudinal AI memory and cross-device continuity, and who can manage a recovery phrase |

---

## Cross-device handling

### Tier 1, 2, 3a: not supported by design.
Users moving devices export/import manually if they want to (download JSON, import elsewhere). Encryption keys travel with the export.

### Tier 3b: two methods.
- **QR code transfer**: existing device generates a QR encoding the recovery phrase + UUID, new device scans it. Phrase never goes through any server.
- **Manual phrase entry**: type the 12-word phrase on the new device.

There is no "sign in" flow because there's no account. The phrase IS the access.

### Multi-device write conflicts
- Sessions are immutable units once closed
- New session on either device = new entry server-side, no conflict possible
- Within an active session, no live sync (one device per session)

---

## Domestic violence / shared device protections

Patterns drawn from DV-shelter website best practices:

### Quick Exit button
Persistent, unobtrusive icon (top right). One tap:
1. Window location replaced with `https://google.com` (or `weather.com` based on user choice in settings)
2. Session memory cleared
3. Browser history for current tab overwritten via `replaceState`
4. If Tier 2/3, partial unsaved content is **not** persisted (only completed exchanges are persisted)

### Browser history minimization
- Page `<title>` is always neutral: "Reflect" — never reflects conversation content
- URL never changes during conversation (SPA, no path or hash routing for content)
- Favicon is generic
- No share previews or rich link unfurls

### Onboarding nudge
First-time visitors see a subtle hint:
> *"Sharing this device with someone? Choose 'don't save anything' for safer use. You can change later."*

Not a popup. Not a checkbox. A line of text near the privacy mode selector.

### Panic delete (v1+)
User can pre-set a "kill phrase." Typing it in the chat triggers immediate full deletion of all local + cloud data. Useful when a user is being watched mid-session.

---

## What the server sees

To be precise about what we can and cannot know:

### Always (regardless of tier)
- Approximate IP geo from request headers (we use this for nothing; do not log to long-term storage)
- User-Agent (browser type, OS) — not logged
- Timestamps of API requests routed through us — not logged

### Tier 1, 2, 3a
- **Nothing else.** No conversation content, no metadata, no identifier.

### Tier 3b
- Random UUID per user
- Encrypted blob (the conversation history, encrypted with the user's key)
- Last-modified timestamp on the blob
- **No mapping** of UUID to email, device, IP, or person

### Anthropic API (all tiers)
- Conversation content transits through Anthropic to generate responses
- Anthropic does not train on this content per their policy
- Anthropic deletes within 30 days (except abuse investigation)
- We do not store the request or response on our side

This is the unavoidable disclosure. We state it in plain English everywhere users encounter the privacy story.

---

## Legal exposure under subpoena

What we can be compelled to disclose, by tier:

| Tier | What we can produce |
|------|--------------------|
| 1, 2, 3a | Nothing useful. We have nothing about the user. |
| 3b | Encrypted blob + UUID. **Without the recovery phrase, the blob is cryptographic noise.** |
| All tiers | Access logs (which we minimize) — proves a request hit our infrastructure at a time, nothing about content |

ToS must be explicit about what we can and cannot produce. This transparency is itself a trust signal.

If court orders us to add a backdoor or weaken encryption: we publicly state we will not, and would shut down the affected service before complying. (This is the standard E2E provider stance — Apple, Signal, ProtonMail.)

---

## Technical stack (preliminary)

| Layer | Choice | Why |
|-------|--------|-----|
| Encryption | WebCrypto API (AES-GCM-256, PBKDF2 for key derivation from phrase) | Native browser, audited, no dependency on third-party crypto libs |
| Recovery phrase | BIP-39 word list (12 words) | Human-typeable, well-tested in cryptocurrency, ~128 bits of entropy |
| Local storage | IndexedDB | Better than localStorage for blob storage, browser-supported everywhere |
| Server backup storage | Object storage (S3 or similar), only encrypted blobs | Simple, cheap, auditable |
| Identity | Random client-generated UUID v4 | Opaque, not tied to any PII |
| Transport | HTTPS / TLS 1.3 | Standard |
| Frontend | Next.js (React), mobile-first responsive | Per product design v0 |
| Backend | Minimal — only handles encrypted blob storage and Anthropic API proxying | Smaller attack surface |

---

## Settings UX (final)

Settings page is text-only, no toggles for things that should never toggle:

```
Your privacy mode

  ⊙ Don't save anything
    Conversations exist only while you're here.
    Recommended if you share this device.

  ⊙ Save on this device for 90 days  (default)
    Stored encrypted on this browser.
    Cleared automatically after 90 days.

  ⊙ Save on this device, no expiration
    Like above but no auto-deletion.

  ⊙ Save with secure backup across devices
    Stored on this browser AND backed up encrypted to our servers.
    Requires a recovery phrase. We cannot read your conversations
    or recover them if you lose the phrase.
    [generate my recovery phrase]


Your data right now
  3 conversations · stored encrypted on this device

  [download all]    [delete all]


Anonymous use
  You don't have an account. There is no email or username
  attached to anything you've written here.

  Optional: add an email only for backup notifications
  (we will never use it for marketing or to recover your data).
  [add email]


Quick exit destination
  When you tap the exit button, this site appears:
  ⊙ google.com  (default)   ⊙ weather.com   ⊙ wikipedia.org
```

What's deliberately absent:
- Notifications toggle (we never send notifications)
- Theme toggle (one theme)
- Persona selector (AI calibrates to user)
- Sound toggle (no sound)
- Profile / display name (no profile)

---

## Open questions

1. **Tier 2 → Tier 3b upgrade flow**: when user upgrades, do we automatically migrate existing 90-day data to encrypted backup, or start fresh? *Tentative: ask the user, default to migrate.*

2. **Tier 3b downgrade**: when user downgrades from 3b to anything lower, do we immediately delete server-side blob? *Tentative: yes, immediately, no soft-delete.*

3. **What if someone forgets recovery phrase but is still logged in on one device?** They can access existing data, can re-export, but cannot recover on a new device. We display this trade-off clearly.

4. **DSAR (Data Subject Access Request) handling**: under privacy law, we must respond to requests for "what data do you have about me?" Our answer for Tier 3b users is: "we have an encrypted blob associated with UUID X (you have to prove you have UUID X)." Need a process.

5. **Mobile app down the road**: same architecture works in iOS/Android via WebView or native crypto APIs. Not a blocker for v0.

6. **Quick exit on iOS Safari**: Safari has restrictions on `window.location` change behavior. Need to test fallback.

7. **Backup blob size limit**: do we cap at some reasonable size (e.g., 100 conversations max in cloud backup) to manage storage costs? *Tentative: no hard cap initially; revisit at scale.*
