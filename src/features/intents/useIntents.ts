import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/lib/useSupabase';
import { useAuthSession } from '@/features/auth/useAuthSession';
import {
  fetchIntentFeed,
  createIntent,
  fetchUserIntents,
  toggleIntentLike,
} from './intent-service';
import type { CreateIntentPayload, IntentFeedFilters } from './types';

/**
 * Live intent feed — TanStack Query powered, auto-refreshes every 30s.
 */
export function useIntentFeed(filters: IntentFeedFilters = {}) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['intents', 'feed', filters],
    queryFn: () => {
      if (!supabase) return [];
      return fetchIntentFeed(supabase, filters);
    },
    enabled: Boolean(supabase),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/**
 * Intents belonging to a specific user (for profile screen).
 */
export function useUserIntents(authorId: string | null | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['intents', 'user', authorId],
    queryFn: () => {
      if (!supabase || !authorId) return [];
      return fetchUserIntents(supabase, authorId);
    },
    enabled: Boolean(supabase && authorId),
    staleTime: 60_000,
  });
}

/**
 * Mutation to create a new intent.
 */
export function useCreateIntent() {
  const supabase = useSupabase();
  const { internalUser } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateIntentPayload) => {
      if (!supabase) throw new Error('Supabase client not available');
      if (!internalUser?.id) throw new Error('User not authenticated');
      return createIntent(supabase, internalUser.id, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['intents'] });
    },
  });
}

/**
 * Mutation to toggle like on an intent.
 */
export function useToggleIntentLike() {
  const supabase = useSupabase();
  const { internalUser } = useAuthSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      intentId,
      currentlyLiked,
    }: {
      intentId: string;
      currentlyLiked: boolean;
    }) => {
      if (!supabase) throw new Error('Supabase not available');
      if (!internalUser?.id) throw new Error('Not authenticated');
      return toggleIntentLike(supabase, intentId, internalUser.id, currentlyLiked);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['intents'] });
    },
  });
}
