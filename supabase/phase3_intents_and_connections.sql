-- ==============================================================================
-- LUNQRA Phase 3 Migration: Intents & Connections
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/toahwoginytcybzcwaew/sql/new
-- ==============================================================================

-- ==============================================================================
-- INTENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  category TEXT,
  budget TEXT,
  location TEXT,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matched', 'closed', 'draft')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'connections', 'private')),
  like_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  response_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intents_author ON public.intents(author_id);
CREATE INDEX IF NOT EXISTS idx_intents_status ON public.intents(status);
CREATE INDEX IF NOT EXISTS idx_intents_category ON public.intents(category);
CREATE INDEX IF NOT EXISTS idx_intents_created ON public.intents(created_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_intents_fts ON public.intents
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, '') || ' ' || coalesce(category, '')));

ALTER TABLE public.intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS intents_select_public ON public.intents;
CREATE POLICY intents_select_public ON public.intents
  FOR SELECT
  USING (visibility = 'public' OR author_id IN (
    SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id()
  ));

DROP POLICY IF EXISTS intents_insert_own ON public.intents;
CREATE POLICY intents_insert_own ON public.intents
  FOR INSERT
  WITH CHECK (
    author_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

DROP POLICY IF EXISTS intents_update_own ON public.intents;
CREATE POLICY intents_update_own ON public.intents
  FOR UPDATE
  USING (
    author_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  )
  WITH CHECK (
    author_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

DROP POLICY IF EXISTS intents_delete_own ON public.intents;
CREATE POLICY intents_delete_own ON public.intents
  FOR DELETE
  USING (
    author_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

-- ==============================================================================
-- CONNECTIONS (Follow / Match)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  intent_id UUID REFERENCES public.intents(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (requester_id, addressee_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_addressee ON public.connections(addressee_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS connections_select_own ON public.connections;
CREATE POLICY connections_select_own ON public.connections
  FOR SELECT
  USING (
    requester_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
    OR
    addressee_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

DROP POLICY IF EXISTS connections_insert_own ON public.connections;
CREATE POLICY connections_insert_own ON public.connections
  FOR INSERT
  WITH CHECK (
    requester_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

DROP POLICY IF EXISTS connections_update_addressee ON public.connections;
CREATE POLICY connections_update_addressee ON public.connections
  FOR UPDATE
  USING (
    addressee_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  )
  WITH CHECK (
    addressee_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

-- ==============================================================================
-- INTENT REACTIONS (likes)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.intent_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id UUID NOT NULL REFERENCES public.intents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (intent_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_intent_reactions_intent ON public.intent_reactions(intent_id);

ALTER TABLE public.intent_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reactions_select_all ON public.intent_reactions;
CREATE POLICY reactions_select_all ON public.intent_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS reactions_insert_own ON public.intent_reactions;
CREATE POLICY reactions_insert_own ON public.intent_reactions
  FOR INSERT
  WITH CHECK (
    user_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

DROP POLICY IF EXISTS reactions_delete_own ON public.intent_reactions;
CREATE POLICY reactions_delete_own ON public.intent_reactions
  FOR DELETE
  USING (
    user_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

-- ==============================================================================
-- MESSAGES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id UUID REFERENCES public.intents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  unread_count INT NOT NULL DEFAULT 0,
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conv_participants_user ON public.conversation_participants(user_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS conversations_select_own ON public.conversations;
CREATE POLICY conversations_select_own ON public.conversations
  FOR SELECT
  USING (
    id IN (
      SELECT cp.conversation_id FROM public.conversation_participants cp
      JOIN public.users u ON u.id = cp.user_id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

DROP POLICY IF EXISTS messages_select_own ON public.messages;
CREATE POLICY messages_select_own ON public.messages
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT cp.conversation_id FROM public.conversation_participants cp
      JOIN public.users u ON u.id = cp.user_id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

DROP POLICY IF EXISTS messages_insert_own ON public.messages;
CREATE POLICY messages_insert_own ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
    AND
    conversation_id IN (
      SELECT cp.conversation_id FROM public.conversation_participants cp
      JOIN public.users u ON u.id = cp.user_id
      WHERE u.clerk_id = public.requesting_clerk_id()
    )
  );

DROP POLICY IF EXISTS conv_participants_select ON public.conversation_participants;
CREATE POLICY conv_participants_select ON public.conversation_participants
  FOR SELECT
  USING (
    user_id IN (SELECT u.id FROM public.users u WHERE u.clerk_id = public.requesting_clerk_id())
  );

-- ==============================================================================
-- UPDATED_AT TRIGGERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS intents_updated_at ON public.intents;
CREATE TRIGGER intents_updated_at BEFORE UPDATE ON public.intents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS connections_updated_at ON public.connections;
CREATE TRIGGER connections_updated_at BEFORE UPDATE ON public.connections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS conversations_updated_at ON public.conversations;
CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
