'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { decryptField } from '@/lib/crypto/serverDecrypt';

interface AuthResponse {
  success: boolean;
  error?: string;
}

/**
 * Server Action for User Signup.
 * All sensitive fields arrive encrypted and are decrypted server-side
 * before being forwarded to Supabase — never visible in the client payload.
 */
export async function signUpAction(data: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const email    = decryptField(data.email);
    const password = decryptField(data.password);
    const fullName = decryptField(data.fullName);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Server Action for User Login.
 */
export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const email    = decryptField(data.email);
    const password = decryptField(data.password);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Server Action for OTP Verification.
 */
export async function verifyOtpAction(data: {
  email: string;
  token: string;
}): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const email = decryptField(data.email);
    const token = decryptField(data.token);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
