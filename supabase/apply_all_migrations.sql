-- ==============================================================================
-- LUNQRA Database Initial Migrations (Phase 1 & Phase 2)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/toahwoginytcybzcwaew/sql/new
-- ==============================================================================

-- ==============================================================================
-- PHASE 1: USERS & PROFILES
-- ==============================================================================

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

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT
  USING (clerk_id = public.requesting_clerk_id());

DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users
  FOR INSERT
  WITH CHECK (clerk_id = public.requesting_clerk_id());

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  USING (clerk_id = public.requesting_clerk_id())
  WITH CHECK (clerk_id = public.requesting_clerk_id());

DROP POLICY IF EXISTS profiles_select_all ON public.profiles;
CREATE POLICY profiles_select_all ON public.profiles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT
  WITH CHECK (
    id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE
  USING (
    id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  )
  WITH CHECK (
    id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

-- ==============================================================================
-- PHASE 2: ONBOARDING, SKILLS, INTERESTS & CAPABILITIES
-- ==============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS usage_mode TEXT,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS organization TEXT,
  ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profile_skills (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.profile_interests (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, interest_id)
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skills_select_all ON public.skills;
CREATE POLICY skills_select_all ON public.skills
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS interests_select_all ON public.interests;
CREATE POLICY interests_select_all ON public.interests
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS profile_skills_select ON public.profile_skills;
CREATE POLICY profile_skills_select ON public.profile_skills
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS profile_skills_insert ON public.profile_skills;
CREATE POLICY profile_skills_insert ON public.profile_skills
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

DROP POLICY IF EXISTS profile_skills_delete ON public.profile_skills;
CREATE POLICY profile_skills_delete ON public.profile_skills
  FOR DELETE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

DROP POLICY IF EXISTS profile_interests_select ON public.profile_interests;
CREATE POLICY profile_interests_select ON public.profile_interests
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS profile_interests_insert ON public.profile_interests;
CREATE POLICY profile_interests_insert ON public.profile_interests
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

DROP POLICY IF EXISTS profile_interests_delete ON public.profile_interests;
CREATE POLICY profile_interests_delete ON public.profile_interests
  FOR DELETE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

-- Baseline Seed Data
INSERT INTO public.skills (name, category) VALUES
  ('React Native', 'Mobile Development'),
  ('TypeScript', 'Engineering'),
  ('UI/UX Design', 'Design'),
  ('Product Management', 'Product'),
  ('Backend Architecture', 'Engineering'),
  ('Machine Learning', 'AI/Data'),
  ('Content Strategy', 'Marketing'),
  ('Business Development', 'Business'),
  ('Full Stack Development', 'Engineering'),
  ('DevOps & Cloud', 'Engineering')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.interests (name, category) VALUES
  ('Tech Startups', 'Technology'),
  ('Artificial Intelligence', 'Technology'),
  ('Creative Design', 'Design'),
  ('Mobile Innovation', 'Technology'),
  ('Community Building', 'Social'),
  ('Mentorship', 'Career'),
  ('Freelance Projects', 'Work'),
  ('Entrepreneurship', 'Business')
ON CONFLICT (name) DO NOTHING;
