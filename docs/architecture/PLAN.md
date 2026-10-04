# Implementation plan

## Repository audit — 2026-10-04

Initial repository contained only `agent.md` (preserved). Initialized repository structure, AGENTS.md, configuration validation, design tokens, primitives, telemetry boundaries, and test suites.

## Completed slices

### Phase 0 — Foundation (Completed & Verified)
- Expo application foundation with strict TypeScript and Expo Router.
- Semantic tokens and reusable design primitives.
- Public environment validation with Zod (never leaks secret values).
- TanStack Query with native app lifecycle management and query cache isolation.
- Telemetry foundation (Sentry error reporting without PII; PostHog event capture with memory persistence).
- Global and route error boundaries.
- Full verification: typecheck, lint, unit tests, and multi-platform bundle export (Web, iOS, Android Hermes bytecode).

### Phase 1 — Authentication (Completed & Verified)
- Clerk integrated as the sole identity provider via `@clerk/clerk-expo`.
- Secure token cache implementation using `expo-secure-store` with web localStorage/memory fallback.
- Supabase client integration dynamically passing Clerk JWTs via `useSupabase()` hook.
- Idempotent server-resolved user bootstrap service (`bootstrapInternalUser`), mapping Clerk subjects to internal `users` and `profiles` records.
- Database migration `20261004000001_phase1_users_and_profiles.sql` with default-deny Row Level Security (RLS) enforcing Clerk subject ownership.
- Authentication screens:
  - WelcomeScreen (`/(auth)/welcome`)
  - SignInScreen (`/(auth)/sign-in`) with React Hook Form + Zod validation
  - SignUpScreen (`/(auth)/sign-up`) with email verification code step
- Protected route navigation guard (`app/index.tsx`) routing users to `(auth)`, `(onboarding)`, or `(tabs)` based on session and onboarding status.
- Primary bottom tabs layout (`(tabs)/_layout.tsx`) with Home, Discover, Create, Messages, and Profile screens.
- Comprehensive test coverage for token cache, user bootstrap, and auth screens.

## Next slice: Phase 2 — Onboarding

Scope:
- Multi-step onboarding flow in `app/(onboarding)`:
  1. Usage mode selection (Individual, Student, Creator, Professional, Business)
  2. Profile information (display name, username, bio, avatar)
  3. Interests selection
  4. Capabilities / skills
  5. Location & preferences
  6. LUNQRA Agent introduction
  7. Notifications permission
- Persist onboarding state to Supabase `profiles`, `profile_skills`, and `profile_interests` tables.
- Update `onboarding_completed` flag in `profiles`.
- Unit and flow test coverage.

## Subsequent phases (not implemented)

3. Own/public/edit profile and follow system.
4. Home, bounded discovery/search and social feed infrastructure.
5. Intent creation, validated parsing, confirmation, persistence and lifecycle.
6. Server embeddings, retrieval, hard filters, configurable scoring and match explanations.
7. Authorized realtime messaging, pagination, receipts and attachments.
8. In-app and push notifications.
9. Communities and private-content authorization.
10. Agent chat, network tools, permission checks and audited side effects.
11. Opportunities.
12. Marketplace listings.
13. Payment adapters and idempotent transaction processing.
14. Interaction-linked reviews and contextual reputation.
15. Expanded verification/moderation tooling.
16. Production hardening, accessibility, security and performance review, build pipeline.

V0 requires phases 0–7 to work against real services through completed conversations and
intent completion. No phase can substitute fake arrays or placeholder backend responses.
