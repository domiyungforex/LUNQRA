import { createClient } from '@supabase/supabase-js';
import type { PublicEnvironment } from './env';

/** A fresh client per authenticated identity. Token callback must read the current Clerk session. */
export function createSupabaseClient(
  env: PublicEnvironment,
  getToken: () => Promise<string | null>,
) {
  return createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    accessToken: getToken,
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
