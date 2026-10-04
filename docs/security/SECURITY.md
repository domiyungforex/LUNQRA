# Security boundaries

All EXPO_PUBLIC variables are public, including values embedded in native bundles.
Only Clerk publishable keys and Supabase publishable keys are accepted. Provider keys,
Clerk secret keys, Supabase service-role keys and Sentry auth tokens stay server-side or
in private CI storage. `.env*` is ignored except `.env.example`; do not log values.

The mobile app cannot authorize ownership, administrative privileges or transactions.
Clerk JWT verification and RLS enforce identity and object-level permissions. No Supabase
Auth runs alongside Clerk. Before any database feature ships, negative RLS tests are
required. Never infer verification or admin status from editable profile metadata.

Agent sensitive permissions default false. Side effects require authorization and audit
records. Payments need idempotency and verified webhooks; no raw card storage. Storage
buckets must enforce ownership, MIME and size limits with private/signed access where
needed. Reporting must preserve required evidence and respect blocks.

Telemetry accepts product event names only. Error reporting excludes message content,
request data, user context and breadcrumbs. Review this boundary when adding monitoring.

External service integration and native runtime verification are separate from successful
static checks. See VERIFICATION.md for current evidence and outstanding dependency risks.
