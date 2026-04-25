# Founder Command Access Control

Founder Command access is owner-only. It must not be visible or available to normal Trading Pro Max users, plan classes, public visitors, or unauthenticated sessions.

## Access Principles

- Founder King access only.
- Not visible to Free users.
- Not visible to Pro users.
- Not visible to VIP users.
- Not visible to Institutional users unless a separate institutional command product is created later.
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

## Deep Foundation API Boundary

The sanitized Founder readiness APIs are allowed only because they expose readiness/truth data and no action authority:

- `/api/founder/command/snapshot`
- `/api/founder/command/modules`
- `/api/founder/approval/readiness`
- `/api/founder/treasury/readiness`
- `/api/founder/media/readiness`

They remain read-only, no-store, non-secret, non-private-data, non-metric, and non-execution routes. They are not public navigation, not SEO surfaces, and not Free/Pro/VIP/Institutional features.
## Product Reality Access State

Founder Command shell components and readiness APIs remain owner-only architecture. They are not linked in public navigation and are not user-plan features.

Current access truth:

- public navigation: disabled
- user-plan access: disabled
- read-only default: enabled
- owner device trust: planned
- step-up confirmation: planned
- audit-backed sensitive actions: planned
- approval execution: inactive
- secrets visible: false
- private user data visible: false

## Local Command Access States

The Local Founder Command App Shell uses these owner-only readiness states:

| State | Meaning | Current Use |
| --- | --- | --- |
| not_configured | owner access has not been configured | historical fallback |
| local_owner_ready | local owner shell can be reviewed safely | planned after guard proof |
| owner_auth_required | owner authentication is required before route exposure | current state |
| device_trust_planned | trusted device binding is planned | current blocker |
| step_up_required_later | sensitive action confirmation is planned | current blocker |
| approval_execution_disabled | approval execution is disabled | current hard boundary |
| blocked_public_access | public user access is blocked | current hard boundary |

The local command shell is not a Free, Pro, VIP, or Institutional feature. The read-only APIs `/api/founder/local-command/snapshot` and `/api/founder/local-command/readiness` expose sanitized readiness only and do not create public navigation, SEO, approval execution, secrets, private data, fake users, fake revenue, or fake metrics.
