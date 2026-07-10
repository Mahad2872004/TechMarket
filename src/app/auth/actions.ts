'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

interface AuthResponse {
  success: boolean;
  error?: string;
}

/**
 * Server Action for User Signup
 */
export async function signUpAction(data: { email: string; password: string; fullName: string }): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Server Action for User Login
 */
export async function loginAction(data: { email: string; password: string }): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Server Action for OTP Verification
 */
export async function verifyOtpAction(data: { email: string; token: string }): Promise<AuthResponse> {
  const supabase = await createServerSupabaseClient();

  try {
    const { error } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.token,
      type: 'signup',
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
