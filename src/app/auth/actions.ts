'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { consumeCredentials } from '@/app/api/auth/prepare/route';

interface AuthResponse {
  success: boolean;
  error?: string;
}

/**
 * Server Action for User Signup.
 * Only receives a sessionRef — no credentials in the payload.
 */
export async function signUpAction(data: { sessionRef: string }): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const creds = consumeCredentials(data.sessionRef);
    if (!creds) return { success: false, error: 'Session expired. Please try again.' };

    const { error } = await supabase.auth.signUp({
      email:    creds.email,
      password: creds.password,
      options:  { data: { full_name: creds.fullName } },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Server Action for User Login.
 * Only receives a sessionRef — no credentials in the payload.
 */
export async function loginAction(data: { sessionRef: string }): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const creds = consumeCredentials(data.sessionRef);
    if (!creds) return { success: false, error: 'Session expired. Please try again.' };

    const { error } = await supabase.auth.signInWithPassword({
      email:    creds.email,
      password: creds.password,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Server Action for OTP Verification.
 * Only receives a sessionRef and plaintext token.
 */
export async function verifyOtpAction(data: { emailRef: string; token: string }): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const creds = consumeCredentials(data.emailRef);
    if (!creds) return { success: false, error: 'Session expired. Please try again.' };

    const { error } = await supabase.auth.verifyOtp({
      email: creds.email,
      token: data.token,
      type:  'signup',
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
