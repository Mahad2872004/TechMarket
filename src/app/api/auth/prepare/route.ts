import { NextRequest, NextResponse } from 'next/server';
import { decryptField } from '@/lib/crypto/serverDecrypt';
import { randomUUID } from 'crypto';
import { serialize } from 'cookie';

// In-memory store for temp credentials (scoped to this server instance)
// In production with multiple instances, use Redis or an encrypted DB row instead
const tempStore = new Map<string, { email: string; password: string; fullName: string; expires: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of tempStore.entries()) {
    if (val.expires < now) tempStore.delete(key);
  }
}, 5 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Decrypt AES-GCM fields sent from the client
    const plainEmail    = decryptField(email);
    const plainPassword = decryptField(password);
    const plainFullName = fullName ? decryptField(fullName) : '';

    // Store credentials server-side with a short TTL (2 minutes)
    const sessionRef = randomUUID();
    tempStore.set(sessionRef, {
      email:    plainEmail,
      password: plainPassword,
      fullName: plainFullName,
      expires:  Date.now() + 2 * 60 * 1000,
    });

    // Return only the reference token — credentials never leave the server
    return NextResponse.json({ sessionRef });
  } catch (err: any) {
    console.error('[prepare-auth] Error:', err);
    return NextResponse.json({ error: 'Failed to prepare auth session.' }, { status: 500 });
  }
}

/**
 * Retrieve and consume credentials from the temp store.
 * Called exclusively by server actions.
 */
export function consumeCredentials(sessionRef: string) {
  const entry = tempStore.get(sessionRef);
  if (!entry) return null;
  if (entry.expires < Date.now()) {
    tempStore.delete(sessionRef);
    return null;
  }
  tempStore.delete(sessionRef); // one-time use
  return entry;
}
