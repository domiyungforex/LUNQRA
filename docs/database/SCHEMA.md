# Database schema

## Phase 1 Schema (Current)

Defined in migration `supabase/migrations/20261004000001_phase1_users_and_profiles.sql`.

### Tables

#### `public.users`
Internal user record associated with Clerk identity.
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `clerk_id` (TEXT, Unique, Not Null) — the Clerk user ID (`sub` claim)
- `email` (TEXT, Nullable)
- `phone` (TEXT, Nullable)
- `created_at` (TIMESTAMPTZ, default `now()`)
- `updated_at` (TIMESTAMPTZ, default `now()`)
- Index: `idx_users_clerk_id` on `(clerk_id)`

#### `public.profiles`
User profile data associated with internal user.
- `id` (UUID, Primary Key, Foreign Key -> `users(id)` ON DELETE CASCADE)
- `display_name` (TEXT, Nullable)
- `username` (TEXT, Unique, Nullable)
- `avatar_url` (TEXT, Nullable)
- `bio` (TEXT, Nullable)
- `location` (TEXT, Nullable)
- `onboarding_completed` (BOOLEAN, default `false`)
- `created_at` (TIMESTAMPTZ, default `now()`)
- `updated_at` (TIMESTAMPTZ, default `now()`)
- Index: `idx_profiles_username` on `(username)`

### Row Level Security (RLS)

- Function: `public.requesting_clerk_id()` extracts the verified Clerk `sub` claim from the request JWT.
- `users`:
  - `SELECT`: Only where `clerk_id = requesting_clerk_id()`.
  - `INSERT`: Only where `clerk_id = requesting_clerk_id()`.
  - `UPDATE`: Only where `clerk_id = requesting_clerk_id()`.
- `profiles`:
  - `SELECT`: Publicly readable (`true`).
  - `INSERT`: Owner only (`id IN (SELECT id FROM users WHERE clerk_id = requesting_clerk_id())`).
  - `UPDATE`: Owner only (`id IN (SELECT id FROM users WHERE clerk_id = requesting_clerk_id())`).

## Planned domain tables

Add normalized tables with each feature phase:
- Phase 2: `profile_skills`, `profile_interests`, `capabilities`
- Phase 3: `follows`
- Phase 4: `posts`, `post_media`, `comments`, `reactions`, `saved_items`
- Phase 5 & 6: `intents`, `intent_skills`, `intent_matches` (pgvector embeddings)
- Phase 7: `conversations`, `conversation_members`, `messages`, `message_attachments`, `message_reads`
- Phase 8: `notifications`, `notification_preferences`
- Phase 9: `communities`, `community_members`, `community_posts`
- Phase 10: `agents`, `agent_permissions`, `agent_actions`
- Phase 11: `opportunities`, `opportunity_applications`
- Phase 12: `listings`, `listing_media`
- Phase 13 & 14: `transactions`, `reviews`, `reports`, `blocks`
