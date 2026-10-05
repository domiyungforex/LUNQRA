// Intent types for Phase 3

export type IntentStatus = 'active' | 'matched' | 'closed' | 'draft';
export type IntentVisibility = 'public' | 'connections' | 'private';

export interface Intent {
  id: string;
  author_id: string;
  title: string;
  body: string | null;
  category: string | null;
  budget: string | null;
  location: string | null;
  deadline: string | null;
  status: IntentStatus;
  visibility: IntentVisibility;
  like_count: number;
  view_count: number;
  response_count: number;
  created_at: string;
  updated_at: string;
  // Joined author profile (from query)
  author?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  // Whether the current user has liked this intent
  has_liked?: boolean;
}

export interface CreateIntentPayload {
  title: string;
  body?: string | null;
  category?: string | null;
  budget?: string | null;
  location?: string | null;
  deadline?: string | null;
  status?: IntentStatus;
  visibility?: IntentVisibility;
}

export interface IntentFeedFilters {
  category?: string;
  search?: string;
  status?: IntentStatus;
  limit?: number;
  offset?: number;
}

// Connection types
export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Connection {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: ConnectionStatus;
  intent_id: string | null;
  message: string | null;
  created_at: string;
  updated_at: string;
}
