import type { SupabaseClient } from '@supabase/supabase-js';
import type { InternalProfile, InternalUser } from './types';

export interface BootstrapParams {
  clerkId: string;
  email?: string | null;
  phone?: string | null;
  displayName?: string | null;
}

export interface BootstrapResult {
  user: InternalUser;
  profile: InternalProfile;
}

export async function bootstrapInternalUser(
  supabase: SupabaseClient,
  params: BootstrapParams,
): Promise<BootstrapResult> {
  const { clerkId, email = null, phone = null, displayName = null } = params;

  // 1. Check if user already exists
  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .maybeSingle();

  if (findError) {
    throw new Error(`Failed to query internal user: ${findError.message}`);
  }

  let user: InternalUser;

  if (existingUser) {
    user = existingUser as InternalUser;
  } else {
    // 2. Insert new user record
    const { data: newUser, error: insertUserError } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkId,
        email,
        phone,
      })
      .select('*')
      .single();

    if (insertUserError || !newUser) {
      throw new Error(`Failed to create internal user: ${insertUserError?.message ?? 'Unknown error'}`);
    }

    user = newUser as InternalUser;
  }

  // 3. Check for profile
  const { data: existingProfile, error: findProfileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (findProfileError) {
    throw new Error(`Failed to query user profile: ${findProfileError.message}`);
  }

  let profile: InternalProfile;

  if (existingProfile) {
    profile = existingProfile as InternalProfile;
  } else {
    // 4. Create initial profile
    const baseUsername = email ? email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '') : null;
    const initialUsername = baseUsername ? `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}` : null;

    const { data: newProfile, error: insertProfileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        display_name: displayName,
        username: initialUsername,
        onboarding_completed: false,
      })
      .select('*')
      .single();

    if (insertProfileError || !newProfile) {
      throw new Error(`Failed to create user profile: ${insertProfileError?.message ?? 'Unknown error'}`);
    }

    profile = newProfile as InternalProfile;
  }

  return { user, profile };
}
