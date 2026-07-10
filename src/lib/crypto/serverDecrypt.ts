/**
 * Server-side AES-GCM decryption utilities.
 * Uses Node.js built-in 'crypto' module — no third-party dependencies.
 */

import { createHash, pbkdf2Sync, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const SALT = 'techmarket-static-salt-v1';
const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // 256-bit

function deriveKey(secret: string): Buffer {
  return pbkdf2Sync(secret, SALT, ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Decrypts a base64-encoded AES-GCM payload produced by clientEncrypt.ts.
 * Layout: [ IV (12 bytes) | ciphertext | auth-tag (16 bytes) ]
 */
export function decryptField(encryptedBase64: string): string {
  const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!secret) throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY is not set.');

  const key = deriveKey(secret);
  const combined = Buffer.from(encryptedBase64, 'base64');

  // Extract parts
  const iv         = combined.subarray(0, IV_LENGTH);
  const authTag    = combined.subarray(combined.length - AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH, combined.length - AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}
