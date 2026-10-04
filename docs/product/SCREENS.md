# Screens

Current routes:
- `/`: foundation/startup and explicit missing-configuration state, with retry.
- Unmatched route: accessible recovery back to `/`.
- Global and route error boundaries: safe error copy with a retry action.

Planned: welcome, sign-in/up, recovery; onboarding; Home/Discover/Create/Messages/Profile
tabs; intent lifecycle and matches; public profiles; conversations; notifications;
communities; agent; opportunities; marketplace; transaction history; settings.

Create will open a sheet with Intent as the primary action, followed by post, opportunity,
listing, event and community. No inert tab collection is added in Phase 0.

Shared primitives currently cover screen, stack, row, text, heading, button, input,
text area, card, divider, loading, empty and error states. Add the remaining composable
controls and domain cards at their first feature usage. Tokens centralize all colors,
spacing, typography, radii, touch targets, elevation, icon sizes and motion durations.
