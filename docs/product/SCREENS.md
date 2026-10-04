# Screens

## Active routes (Phase 1)

### Root
- `/`: Entrypoint with session guard. Routes unauthenticated visitors to `/(auth)/welcome`, incomplete profiles to `/(onboarding)`, and active users to `/(tabs)`. Renders `FoundationScreen` if environment configuration is incomplete.
- `+not-found.tsx`: Accessible recovery back to `/`.

### Authentication (`app/(auth)/`)
- `welcome.tsx`: Welcome screen introducing LUNQRA's Human Intent Network value proposition with direct actions for Account Creation and Sign In.
- `sign-in.tsx`: Email/password authentication via Clerk, with Zod validation, error handling, and session establishment.
- `sign-up.tsx`: Account registration with email verification code step, Zod validation, and automatic session activation.

### Onboarding (`app/(onboarding)/`)
- `index.tsx`: Initial profile landing screen showing internal user ID and profile bootstrap status, with direct sign-out capability.

### Primary navigation (`app/(tabs)/`)
- `index.tsx`: Home tab with primary "What do you need?" intent prompt and active user session info.
- `discover.tsx`: Discover tab shell.
- `create.tsx`: Center Create tab shell.
- `messages.tsx`: Messages tab shell.
- `profile.tsx`: Profile tab shell with user metadata and sign-out action.

## Error handling
- Global and route error boundaries (`AppErrorBoundary`, `_layout.tsx` ErrorBoundary) provide actionable error states with retry mechanisms and scrubbed telemetry reporting.
