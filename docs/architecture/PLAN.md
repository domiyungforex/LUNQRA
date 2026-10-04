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

### Phase 2 — Onboarding (Completed & Verified)
- Comprehensive multi-step onboarding architecture:
  1. Usage mode selection (`/(onboarding)/usage`): Individual, Student, Creator, Professional, Business.
  2. Profile information (`/(onboarding)/profile`): display name, unique username, headline, short bio.
  3. Interests selection (`/(onboarding)/interests`): curated topics with custom chips addition.
  4. Capabilities / skills (`/(onboarding)/capabilities`): capability matrix with custom capability tags.
  5. Location & preferences (`/(onboarding)/location`): primary location, remote-only toggle, travel readiness.
  6. LUNQRA Agent introduction (`/(onboarding)/agent`): intent-engine agent capabilities walkthrough, notifications preference, and final activation.
- `OnboardingProvider` draft state management preserving user progress across steps.
- Supabase migration `20261004000002_phase2_onboarding_and_skills.sql` introducing `profile_skills`, `profile_interests`, indices, and strict owner RLS policies.
- Idempotent `completeOnboarding` service mutating profile attributes, batch inserting skills and interests, and setting `onboarding_completed: true`.
- Full verification: strict TypeScript, ESLint, 9/9 passing test suites (30 unit & screen tests), and multi-platform bundle export (Web, iOS, Android Hermes bytecode).

## Next slice: Phase 3 — Profile & Social Graph

Scope:
- Own profile view with completed capabilities, interests, and intent activity.
- Public profile view with permissions and sanitized data.
- Profile editing flow with validation.
- Follow / connection system with mutual edge tracking.
- Row-level security for profile privacy and connection requests.

## Subsequent phases (not implemented)

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
