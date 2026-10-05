import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Intent,
  CreateIntentPayload,
  IntentFeedFilters,
} from './types';

/**
 * Fetch the public intent feed, optionally filtered and joined with author profiles.
 * Falls back gracefully if the intents table does not yet exist.
 */
export async function fetchIntentFeed(
  supabase: SupabaseClient,
  filters: IntentFeedFilters = {},
): Promise<Intent[]> {
  const { category, search, status = 'active', limit = 20, offset = 0 } = filters;

  try {
    let query = supabase
      .from('intents')
      .select(`
        id,
        author_id,
        title,
        body,
        category,
        budget,
        location,
        deadline,
        status,
        visibility,
        like_count,
        view_count,
        response_count,
        created_at,
        updated_at,
        author:profiles!intents_author_id_fkey(display_name, username, avatar_url)
      `)
      .eq('status', status)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (search?.trim()) {
      query = query.textSearch(
        'title',
        search.trim(),
        { type: 'websearch', config: 'english' },
      );
    }

    const { data, error } = await query;

    if (error) {
      // Graceful fallback if tables not yet created
      if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.warn('[IntentService] intents table not yet available — run phase3_intents_and_connections.sql');
        return [];
      }
      throw new Error(`Failed to fetch intent feed: ${error.message}`);
    }

    return (data ?? []) as unknown as Intent[];
  } catch (err) {
    console.warn('[IntentService] fetchIntentFeed error:', err);
    return [];
  }
}

/**
 * Create a new intent authored by the current user.
 */
export async function createIntent(
  supabase: SupabaseClient,
  authorId: string,
  payload: CreateIntentPayload,
): Promise<Intent> {
  const { data, error } = await supabase
    .from('intents')
    .insert({
      author_id: authorId,
      title: payload.title,
      body: payload.body ?? null,
      category: payload.category ?? null,
      budget: payload.budget ?? null,
      location: payload.location ?? null,
      deadline: payload.deadline ?? null,
      status: payload.status ?? 'active',
      visibility: payload.visibility ?? 'public',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create intent: ${error?.message ?? 'Unknown error'}`);
  }

  return data as Intent;
}

/**
 * Fetch a single intent by ID.
 */
export async function fetchIntentById(
  supabase: SupabaseClient,
  intentId: string,
): Promise<Intent | null> {
  const { data, error } = await supabase
    .from('intents')
    .select(`
      id, author_id, title, body, category, budget, location, deadline,
      status, visibility, like_count, view_count, response_count, created_at, updated_at,
      author:profiles!intents_author_id_fkey(display_name, username, avatar_url)
    `)
    .eq('id', intentId)
    .maybeSingle();

  if (error) {
    console.warn('[IntentService] fetchIntentById error:', error.message);
    return null;
  }

  return data as Intent | null;
}

/**
 * Fetch intents authored by a specific user (for profile screen).
 */
export async function fetchUserIntents(
  supabase: SupabaseClient,
  authorId: string,
  limit = 10,
): Promise<Intent[]> {
  try {
    const { data, error } = await supabase
      .from('intents')
      .select('id, author_id, title, body, category, status, like_count, response_count, created_at')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('[IntentService] fetchUserIntents error:', error.message);
      return [];
    }

    return (data ?? []) as Intent[];
  } catch {
    return [];
  }
}

/**
 * Toggle like on an intent.
 */
export async function toggleIntentLike(
  supabase: SupabaseClient,
  intentId: string,
  userId: string,
  currentlyLiked: boolean,
): Promise<void> {
  if (currentlyLiked) {
    await supabase
      .from('intent_reactions')
      .delete()
      .eq('intent_id', intentId)
      .eq('user_id', userId);
  } else {
    await supabase
      .from('intent_reactions')
      .insert({ intent_id: intentId, user_id: userId, reaction: 'like' });
  }
}
