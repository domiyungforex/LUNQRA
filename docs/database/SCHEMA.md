# Database plan

No tables or policies are deployed in Phase 0. Empty migration/function directories are
reserved for backend work. There is no development seed data until real schemas exist.

Phase 1 creates internal users linked by a unique Clerk subject (text, not auth.uid UUID).
Bootstrap must resolve the verified JWT subject server-side. Phase 2 adds persisted
onboarding/profile data. Every exposed table must enable RLS before grants are applied.
Use normalized foreign keys to internal user IDs and ownership derived from JWT subject.

Add normalized domain tables with each feature, following the product specification:
profiles/skills/interests/capabilities; follows; posts/media/comments/reactions/saves;
intents/skills/matches; conversations/members/messages/attachments/reads;
communities/members/posts; opportunities/applications; listings/media;
agents/permissions/actions; notifications/preferences; reviews/reports/blocks;
orders/items/transactions/provider references. Financial and audit records are server-owned.

RLS tests must use at least two identities and an anonymous caller, and cover denied
read/write, ownership changes, private profiles/intents, community privacy and conversation
membership. Keep private fields separate from publicly readable profiles. Add pgvector
and appropriate embedding dimension/indexes with the chosen server embedding provider.
Do not preselect dimensions or create unused vector indexes in Phase 0.
