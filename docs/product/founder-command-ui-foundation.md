# Founder Command UI Foundation

The Founder Command UI Foundation is the reusable, private command-room surface for TPM Planet OS. It is not linked from public navigation and is not exposed as a normal web route.

## Current Implementation

- reusable server components exist under `modules/founder-command/components`
- deterministic room snapshot exists in `lib/server/founder-command/room.ts`
- the existing readiness API returns a sanitized `roomFoundation` payload
- no public Founder Command page is created
- no approval execution exists
- no billing, broker/feed, launch, social publishing, live execution, or real-money action exists

## Command Panels

The foundation contains:

- Planet Overview
- Ministry Reporting Grid
- Founder Daily Briefing
- Founder Approval Queue
- Guardian Command
- Legal Counsel Command
- Treasury Command
- Media and AI Video Command
- Founder Personal Companion summary

Every panel is read-only and uses readiness/planned/blocked truth only.

## Access Decision

The command UI remains component/API foundation only because owner-only device authentication, step-up confirmation, and audit workflow are not shipped. A route must not be exposed until those controls exist.

Public users must not see this as:

- a nav item
- a plan perk
- a settings tab
- a public dashboard
- a demo page

## Visual Direction

The foundation uses a restrained graphite, gold, and Swiss-red command style. It must feel precise and private, not fantasy-like, game-like, or public-facing.

The TPM Earth Mark may be used here as an internal Planet Command identity. It must not imply a shipped native app, public launch, Swiss legal/company status, users, revenue, billing, or live trading.

## Safety Rules

- no fake users
- no fake revenue
- no fake metrics
- no secrets
- no private user data
- no approval execution
- no public launch claim
- no live execution
- no real-money routing
- no broker/feed activation
- no billing activation
- no social publishing
