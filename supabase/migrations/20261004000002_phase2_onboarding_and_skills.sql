-- Phase 2: Onboarding, Skills, Interests, and Capabilities
-- Extends profiles and establishes normalized skills and interests tables with RLS.

-- Alter profiles to add onboarding fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS usage_mode TEXT,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS organization TEXT,
  ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Catalog table: skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catalog table: interests
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction table: profile_skills
CREATE TABLE IF NOT EXISTS public.profile_skills (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, skill_id)
);

-- Junction table: profile_interests
CREATE TABLE IF NOT EXISTS public.profile_interests (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, interest_id)
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;

-- RLS for skills and interests catalogs: readable by everyone
CREATE POLICY skills_select_all ON public.skills
  FOR SELECT
  USING (true);

CREATE POLICY interests_select_all ON public.interests
  FOR SELECT
  USING (true);

-- RLS for profile_skills: public read, owner write
CREATE POLICY profile_skills_select ON public.profile_skills
  FOR SELECT
  USING (true);

CREATE POLICY profile_skills_insert ON public.profile_skills
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

CREATE POLICY profile_skills_delete ON public.profile_skills
  FOR DELETE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

-- RLS for profile_interests: public read, owner write
CREATE POLICY profile_interests_select ON public.profile_interests
  FOR SELECT
  USING (true);

CREATE POLICY profile_interests_insert ON public.profile_interests
  FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

CREATE POLICY profile_interests_delete ON public.profile_interests
  FOR DELETE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.users u ON u.id = p.id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

-- Seed baseline skills and interests
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
