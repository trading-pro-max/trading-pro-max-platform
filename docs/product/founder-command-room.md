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

## Still Planned

- private desktop Founder Command app
- private mobile Founder Command app
- owner-only authentication
- device trust
- step-up confirmation
- audit-backed approval execution

Until those are real, the command room remains read-only and hidden from public product navigation.
