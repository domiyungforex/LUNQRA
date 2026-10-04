# LUNQRA engineering instructions

Read this file completely before editing. Preserve `agent.md`, the original product brief.
The user's full product specification controls where it differs from that brief.

LUNQRA is ATEM's Human Intent Network. Prioritize intent → understanding → matching
→ connection → conversation → outcome → reputation. Build real persisted flows.

## Scope and architecture
- Work one verified phase at a time. Track status in docs/architecture/PLAN.md.
- Expo, React Native, strict TypeScript, Expo Router; feature-first src/features.
- Clerk is the sole identity provider. Supabase is database, realtime and storage.
- Never use client-supplied identity for sensitive authorization. RLS is mandatory.
- TanStack Query owns server state. Add Zustand only for genuine local state.
- Screen routes compose modules; business rules live outside routes.
- AI and payments use authenticated backend services and provider-independent adapters.
- Never put provider secrets, service-role keys, or raw card data in the mobile app.
- Preserve raw intent text; validate AI output before use; audit agent side effects.
- No mock network results presented as real data. Missing configuration must be explicit.
- Use semantic design tokens, accessible controls, bounded queries and list pagination.
- Add dependencies only when required by the current phase. No unrelated refactors.

## Before changes
Read repository instructions, inspect files, dependency manifest, docs, tests, migrations,
environment variable names (never expose secrets), git status and existing diffs.
Preserve unrelated work. Do not assume configured external services.

## Verification and commits
Review every changed file, then run typecheck, lint and relevant tests. Verify the
changed runtime flow and platform bundles. Fix failures and record remaining limits.
Commit only verified work using conventional commits. Never claim live integrations,
native launches or deployments succeeded without direct evidence.
Update product, architecture, API, database and security documentation as needed.
