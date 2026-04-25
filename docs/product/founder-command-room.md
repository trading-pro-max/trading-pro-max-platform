# Founder Command Room

The Founder Command Room is the private operational room for the Founder King inside TPM Planet OS. It is a shorter product name for the Founder King Command Room and is intended for internal documentation consistency.

## Boundary

- private owner-only concept
- no public user route
- no public navigation
- no Free, Pro, VIP, or Enterprise access
- no fake native app release
- no launch claim
- no live trading activation

## Purpose

The room lets Ahmad observe the Planet OS, review sensitive queues, and approve only reviewed actions that remain inside safety boundaries.

It is built around three truths:

1. visibility does not equal activation
2. Founder approval does not bypass hard blocks
3. planned systems must remain visibly planned until genuinely implemented

## Current Implementation Decision

This pass keeps the Founder Command Room private and component/contracts-first. No public route is created because the final owner-only device authentication and private app shell are not shipped yet.

## Runtime Foundation

Current runtime foundation:

- `lib/server/founder-command/room.ts` builds a deterministic room snapshot
- `modules/founder-command/components/FounderCommandRoom.tsx` provides a reusable read-only command shell
- `/api/founder/briefing/readiness` includes sanitized `roomFoundation` readiness data
- public navigation does not include Founder Command
- normal Free, Pro, VIP, and Enterprise surfaces do not expose Founder Command access

The room snapshot includes Planet Overview, Ministry Reporting, Daily Briefing, Founder Approval Queue, Guardian, Legal Counsel, Treasury, Media, AI Video, and Product Truth panels.

## Operational Expansion

The room snapshot now also includes Founder Personal Companion readiness. It summarizes planet status, ministry reports, top risks, approvals needed, Guardian and Legal warnings, Media and Treasury readiness, engineering tasks, product gaps, what not to do, and next safe decisions.

The companion summary is advisory only. It cannot approve actions alone, publish media, expose secrets, enable live execution, enable real money, activate broker/feed, activate billing, or override Guardian/Legal critical blocks.

## Living Experience Activation

The read-only command shell now renders more actionable briefing slices:

- priority briefing
- next safe decisions
- Guardian and Legal warning summary
- product gaps
- blocked/degraded ministries
- approval queue truth

This is still a component/contracts foundation, not a public page or native Founder app. No approval execution, public route, private data, secrets, fake users, fake revenue, fake metrics, launch action, billing action, broker/feed activation, social publishing, live execution, or real-money routing is exposed.

## Still Planned

- private desktop Founder Command app
- private mobile Founder Command app
- owner-only authentication
- device trust
- step-up confirmation
- audit-backed approval execution

Until those are real, the command room remains read-only and hidden from public product navigation.

## Plan Visibility

Founder Command readiness now includes a plan visibility concept: available citizen classes, plan readiness, Pro/VIP blockers, billing inactive state, performance-fee hidden/inactive state, next safe plan actions, and what not to activate now.

This is not user-count, revenue, or conversion reporting. It is readiness-only plan governance.
