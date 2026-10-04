import { useAuth } from '@clerk/clerk-expo';
import { useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { readEnvironment } from '@/lib/env';
import { createSupabaseClient } from '@/lib/supabase';

export function useSupabase(): SupabaseClient | null {
  const { getToken } = useAuth();
  const env = readEnvironment();

  return useMemo(() => {
    if (!env.ok) return null;
    return createSupabaseClient(env.value, async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        return token ?? await getToken();
      } catch {
        return null;
      }
    });
  }, [env, getToken]);
}
