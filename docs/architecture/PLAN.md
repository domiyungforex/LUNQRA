# Implementation plan

## Repository audit — 2026-10-04

Initial repository contained only `agent.md` (preserved). No AGENTS.md, Git repository,
package.json, application, environment files, docs, migrations, policies or tests existed.
Created AGENTS.md from the controlling user specification. Original brief has different
phase numbering; the user's numbered phases below control. Neither permits a single
uncontrolled full-product implementation.

## Current slice: Phase 0

Acceptance: strict Expo Router app; semantic tokens and reusable primitives; validated
public configuration; Clerk provider and secure token cache; Supabase client using Clerk
tokens; TanStack Query with native lifecycle; telemetry foundation; global error boundary;
documentation, tests, lint/typecheck and platform startup verification.

- Implement foundation first and review every changed file.
- Verify no-configuration behavior without fabricated service responses.
- Finish external provider wiring once real development configuration is available.
- Verify native and web startup; distinguish bundle export from actual native runtime.
- Commit verified foundation work. Do not mark the phase complete while gates remain.

## Subsequent phases (not implemented)

1. Clerk auth flows, guards, logout, session persistence, server-resolved user bootstrap.
2. Persisted onboarding, including preferences and agent introduction.
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
15. Expanded verification/moderation tooling; foundational access controls and safety are
    required from each feature's first release, not deferred to this phase.
16. Production hardening, accessibility, security and performance review, build pipeline.

V0 requires phases 0–7 to work against real services through completed conversations and
intent completion. No phase can substitute fake arrays or placeholder backend responses.
