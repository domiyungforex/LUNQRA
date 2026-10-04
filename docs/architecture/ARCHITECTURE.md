# Architecture

Expo Router routes in `app/` compose feature modules in `src/features/`. Shared UI lives
in `src/design-system`, runtime integrations in `src/lib`, providers in `src/providers`,
and application services in `src/services`. Add feature directories with real code,
not speculative empty implementations.

Clerk is the only identity/session provider. Supabase receives fresh Clerk JWTs through
its `accessToken` callback; Supabase Auth session persistence is disabled. Configure the
Clerk third-party integration in Supabase before using Data API, Storage or Realtime.
No privileged key belongs in Expo configuration or public variables.

TanStack Query owns server data: 30-second stale time, five-minute garbage collection,
two read retries, no automatic mutation retries. Native connectivity/focus listeners
support reconnection/refetch. Auth integration must remount identity-scoped providers on
user changes and remove realtime channels to prevent cache/session data leakage.

Telemetry is optional: Sentry keeps structural errors with scrubbed content, no PII,
no request payloads and no tracing; PostHog exposes an event-name-only allowlist,
no replay/autocapture/lifecycle capture, and memory persistence. Product events are added
when their real user flows exist. Source-map upload needs private CI credentials.

Future backend: authenticated endpoints → ATEM AI Gateway → provider adapters. Validate
model output with Zod, retain raw text, enqueue embeddings/matching/notification jobs.
Matching has independent retrieval, hard-filter, vector and scoring stages. Payments
use separate provider adapters; webhooks require signature verification and idempotency.
Never put AI/payment SDK calls or SQL in screen components.

Deployment: Expo development builds for device QA; EAS environments for preview and
production once ATEM package identifiers and accounts are configured. Supabase migrations
must be reviewed and exercised locally before deployment. No deployment is performed by
Phase 0. Native generated directories are ignored (Expo continuous native generation).

Sources checked during setup: [Expo Router](https://docs.expo.dev/router/installation/),
[Clerk/Supabase](https://supabase.com/docs/guides/auth/third-party/clerk),
[TanStack native lifecycle](https://tanstack.com/query/latest/docs/framework/react/react-native),
[Sentry Expo](https://docs.expo.dev/guides/using-sentry/).
