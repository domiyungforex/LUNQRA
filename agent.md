You are the founding engineering team for LUNQRA, the flagship product of ATEM.

You are not building a demo, landing page or static prototype.

You are building a production-oriented mobile application using Expo + React Native + TypeScript.

Before doing anything else:

1. Read AGENTS.md completely.
2. Treat AGENTS.md as authoritative.
3. Inspect the entire repository.
4. Inspect existing dependencies.
5. Inspect environment configuration without exposing secrets.
6. Inspect /docs.
7. Report the current implementation state.
8. Do not start unrelated work.

PRODUCT

LUNQRA is a human-intent network.

Users express what they want or need.

LUNQRA understands the request, finds relevant people, businesses, services, communities, products and opportunities, ranks them, and enables users to connect and achieve an outcome.

The fundamental product loop is:

INTENT
→ UNDERSTANDING
→ MATCHING
→ CONNECTION
→ CONVERSATION
→ OUTCOME
→ REPUTATION

This loop is more important than a traditional content feed.

TECHNOLOGY

Use:

Expo
React Native
TypeScript
Expo Router
Clerk
Supabase PostgreSQL
Supabase Realtime
Supabase Storage
pgvector
TanStack Query
Zustand where appropriate
React Hook Form
Zod
Expo Notifications
PostHog
Sentry

Use a provider-independent AI architecture.

Do not directly call OpenAI, Anthropic, Google or another model provider from React components.

Create an AI service abstraction.

Do the same for payments.

APPLICATION NAVIGATION

Primary tabs:

Home
Discover
Create
Messages
Profile

The center Create action opens a composer supporting:

Intent
Post
Opportunity
Listing
Event
Community

Intent is the primary action.

FIRST-TIME FLOW

Splash
→ Welcome
→ Authentication
→ Select usage type
→ Basic profile
→ Interests
→ Skills / capabilities
→ Location
→ Preferences
→ Agent introduction
→ Notification permission
→ Home

MAIN PRODUCT

HOME

The top of Home should prominently ask:

"What do you need?"

Home should surface:

relevant Intents
people
opportunities
communities
marketplace items
activity from relevant connections

Do not turn Home into an endless generic social feed.

INTENTS

A user can describe a need naturally.

Example:

"I need a React Native developer in Lagos to help finish an app before November. Budget ₦300k."

Preserve the original text.

Use AI/server logic to derive structured fields including:

intent type
category
skills
budget
currency
location
remote preference
deadline
constraints

Allow the user to review/edit structured information before publishing when appropriate.

MATCHING

Implement the matching architecture as independent stages:

candidate retrieval
hard constraints
semantic similarity
ranking
personalization

Do not implement matching as one giant LLM prompt.

Initial ranking can combine weighted factors such as:

semantic similarity
skills relevance
capability relevance
location compatibility
budget compatibility
availability
reputation
responsiveness

Persist match records.

Expose a human-readable reason for strong matches.

MESSAGING

Implement:

conversation list
1:1 messaging
realtime updates
message states
text
attachments
reply
read state
typing state where practical

Architect the messaging layer so group messaging can be added later without rewriting it.

PROFILES

Profiles contain:

identity
bio
location
capabilities
skills
interests
portfolio
services
reviews
reputation
communities
posts
Intents
verification status

COMMUNITIES

Users can:

discover communities
join
leave
view members
post
publish community-scoped Intents

MARKETPLACE

Support an architecture for:

products
services
digital offerings

Marketplace is not the first priority.

Do not allow marketplace work to delay the core Intent loop.

AI AGENT

Every user should conceptually have a personal LUNQRA Agent.

Initial agent abilities:

understand requests
search the LUNQRA network
recommend matches
summarize results
draft messages

Design the permissions system now so future capabilities can include:

sending messages
creating Intents
scheduling
negotiating
transactions

Do not automatically grant sensitive permissions.

DATABASE

Design normalized Supabase migrations for the core domain.

Implement RLS from the start.

Include appropriate indexes.

Add pgvector support for semantic matching.

Never expose service role credentials in the app.

DESIGN

The app should feel:

premium
minimal
intelligent
human
fast
global

Do not imitate Facebook, Instagram, LinkedIn, TikTok or X screen-for-screen.

LUNQRA should establish its own visual identity.

Create reusable:

Button
IconButton
Input
TextArea
SearchInput
Avatar
Badge
Card
IntentCard
PersonCard
OpportunityCard
CommunityCard
EmptyState
ErrorState
LoadingState
BottomSheet
Modal
Toast

Create proper design tokens.

Do not scatter arbitrary colors, font sizes and spacing values across screens.

MOBILE QUALITY

Account for:

safe areas
keyboard
notches
Android navigation
small screens
large screens
loading states
slow networks
offline transitions
accessibility
touch sizes
screen readers

SECURITY

Use secure defaults.

Never trust client-provided ownership IDs.

Never expose admin logic to the client.

Validate important operations server-side.

Implement database policies carefully.

Do not store unnecessary sensitive information.

EXECUTION

Do not attempt the entire application in one enormous implementation.

Work feature-by-feature.

For every task:

1. State exactly what you are implementing.
2. State what you are not changing.
3. State relevant constraints.
4. Inspect existing implementation.
5. Implement the smallest coherent solution.
6. Review the diff.
7. Run typecheck.
8. Run lint.
9. Run relevant tests.
10. Verify the affected flow.
11. Check for regressions.
12. Summarize results.
13. Commit only after verification.

BUILD ORDER

Follow this order unless there is a technical dependency that requires adjustment:

Phase 0
Project foundation
Expo configuration
routing
design tokens
environment handling
error boundary
query client
base architecture

Phase 1
Clerk authentication

Phase 2
Onboarding

Phase 3
Profiles
skills
capabilities
interests

Phase 4
Home
discovery foundations

Phase 5
Intent creation
Intent storage
Intent detail

Phase 6
Intent understanding
embeddings
matching engine
match results

Phase 7
People discovery
profile exploration

Phase 8
Realtime messaging

Phase 9
Notifications

Phase 10
Communities

Phase 11
LUNQRA AI Agent

Phase 12
Opportunities

Phase 13
Marketplace

Phase 14
payments architecture
transactions
reviews
reputation

Phase 15
verification
reporting
blocking
safety tooling

Phase 16
analytics
performance
accessibility
production hardening

FIRST DEVELOPMENT MILESTONE

Do not proceed toward marketplace, wallet or complex social features until this exact flow works reliably:

NEW USER
→ CREATE ACCOUNT
→ COMPLETE PROFILE
→ CREATE INTENT
→ INTENT STORED
→ RELEVANT USERS FOUND
→ MATCHES RANKED
→ USER OPENS MATCH
→ USER STARTS CONVERSATION
→ BOTH USERS EXCHANGE REALTIME MESSAGES

That is LUNQRA V0.

START NOW WITH PHASE 0 ONLY.

Read AGENTS.md first.

Audit the repository.

Then give a concise implementation plan for Phase 0 and execute it.

Do not prematurely build Phase 1+.