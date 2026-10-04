# API boundaries

Phase 0 exposes no application backend endpoints. `createSupabaseClient` accepts validated
public environment plus an async token getter; it never trusts a client-supplied owner ID.

Planned authenticated services:
- User bootstrap: verified Clerk subject → idempotent internal user/profile creation.
- Intent parser: raw text → schema-validated suggestions, not automatic publication.
- Publish intent: validated user confirmation → persisted intent and background jobs.
- Matching: paginated, authorized ranked candidates and heuristic score reasons.
- Messaging: membership-authorized insert/read/realtime and bounded history.
- Agent tools: authorized network reads and separately approved auditable side effects.
- Payments: provider-independent commands, idempotency, signed webhooks.

Errors return safe actionable messages and an opaque correlation ID. Provider errors,
SQL, tokens and stack traces never reach users. Specify concrete request/response schemas
and rate limits alongside endpoint implementation, not as placeholder responses.
