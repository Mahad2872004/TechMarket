import { SupabaseClient } from '@supabase/supabase-js';

export interface ProfileUpdateInput {
  username?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

export const profileService = {
  /**
   * Fetch a user profile by ID
   */
  async getProfile(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile information
   */
  async updateProfile(supabase: SupabaseClient, userId: string, profile: ProfileUpdateInput) {
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (profile.username !== undefined) updatePayload.username = profile.username;
    if (profile.fullName !== undefined) updatePayload.full_name = profile.fullName;
    if (profile.bio !== undefined) updatePayload.bio = profile.bio;
    if (profile.avatarUrl !== undefined) updatePayload.avatar_url = profile.avatarUrl;

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Upload an avatar file to Supabase Storage 'avatars' bucket
   */
  async uploadAvatar(supabase: SupabaseClient, userId: string, file: File) {
    // Save file in format: {userId}/{timestamp}-{filename}
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded image
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
};
