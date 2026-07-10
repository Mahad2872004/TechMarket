/**
 * Client-side AES-GCM encryption utilities.
 * Uses the browser Web Crypto API — no third-party dependencies.
 * The encrypted payload is meaningless to a network observer or DevTools sniffer.
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96-bit IV recommended for AES-GCM

/**
 * Derives a deterministic AES key from a string secret using PBKDF2.
 * Both client and server share the same secret (from env vars).
 */
async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('techmarket-static-salt-v1'),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plain-text string.
 * Returns base64-encoded: IV (12 bytes) + ciphertext concatenated.
 */
export async function encryptField(plaintext: string): Promise<string> {
  const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!secret) throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY is not set.');

  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const enc = new TextEncoder();

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    enc.encode(plaintext)
  );

  // Prepend IV to ciphertext so server can extract it for decryption
  const combined = new Uint8Array(iv.byteLength + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.byteLength);

  // Convert to base64 for safe JSON transport
  return btoa(String.fromCharCode(...combined));
}
