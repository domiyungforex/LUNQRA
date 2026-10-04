# LUNQRA by ATEM

Human Intent Network. Phase 0 foundation; product flows are under development.

## Local setup

Use Node 22.13+ and npm. Run `npm ci`, copy `.env.example` to `.env.local`, and fill in
public values. Never place secret/service-role/provider keys in EXPO_PUBLIC variables.

Run `npm start`, `npm run ios`, `npm run android`, or `npm run web`.
Missing configuration renders an explicit setup state. Restart Metro after env changes.
No fake accounts, matches or conversations are substituted for unavailable services.

Clerk: link the specified development app with the CLI, enable Native API, then configure
Clerk as a third-party auth provider in Supabase. Sentry and PostHog are optional until
configured. Real sign-in and native restart verification are required before Phase 1
can be declared complete.

## Verification

`npm run typecheck`, `npm run lint`, `npm test`, `npm run export`, `npx expo-doctor`.
See [implementation plan](docs/architecture/PLAN.md) and
[verification record](docs/architecture/VERIFICATION.md) for actual completion status.

Read [AGENTS.md](AGENTS.md) before changes. The original `agent.md` is preserved.
