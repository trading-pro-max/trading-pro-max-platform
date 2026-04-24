# Founder Command Access Control

Founder Command access is owner-only. It must not be visible or available to normal Trading Pro Max users, plan classes, public visitors, or unauthenticated sessions.

## Access Principles

- Founder King access only.
- Not visible to Free users.
- Not visible to Pro users.
- Not visible to VIP users.
- Not visible to Enterprise users unless a separate enterprise command product is created later.
- Strong owner authentication required.
- Operator key or owner approval concept required for sensitive review paths.
- Read-only by default.
- Sensitive actions require explicit confirmation.
- All sensitive actions are audited.
- No public SEO.
- No public navigation item.
- No unauthenticated access.

## Owner Authentication Requirements

Future implementation must include:

- owner identity proof
- owner device trust
- session timeout
- step-up confirmation for high-risk actions
- audit event on sensitive action attempt
- no secret display
- no reusable local default key in production

## Access States

| State | Meaning | Product Truth |
| --- | --- | --- |
| blocked_unavailable | access is not available because owner guard is not installed | safest default |
| owner_only_planned | contracts and docs exist, but private app auth is not shipped | current state |
| owner_authenticated | future state after strong owner auth and private app shell exist | not current |

## Public Exposure Rule

The Founder Command App must not be exposed as:

- a normal route
- a public admin panel
- a settings tab for users
- a plan perk
- a search-indexed page
- a demo surface

## Audit Requirements

Every sensitive action attempt should record:

- actor identity
- owner confirmation state
- risk level
- module
- proposed action
- previous state
- requested state
- Guardian review state
- Legal review state
- result
- timestamp

Secrets must never be recorded in audit payloads.

