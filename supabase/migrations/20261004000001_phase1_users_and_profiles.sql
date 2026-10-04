-- Phase 1: Internal Users and Profiles
-- Clerk provides identity; Supabase stores internal user record and profile.
-- RLS enforces that users can only read/mutate their own internal records, while public profile fields are visible.

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for access paths
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to extract Clerk subject from JWT
CREATE OR REPLACE FUNCTION public.requesting_clerk_id()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  );
$$;

-- RLS for users: only the authenticated user matching clerk_id can read/write their user record
CREATE POLICY users_select_own ON public.users
  FOR SELECT
  USING (clerk_id = public.requesting_clerk_id());

CREATE POLICY users_insert_own ON public.users
  FOR INSERT
  WITH CHECK (clerk_id = public.requesting_clerk_id());

CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  USING (clerk_id = public.requesting_clerk_id())
  WITH CHECK (clerk_id = public.requesting_clerk_id());

-- RLS for profiles: public profiles can be read, but only owner can insert/update
CREATE POLICY profiles_select_all ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT
  WITH CHECK (
    id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE
  USING (
    id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  )
  WITH CHECK (
    id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );
