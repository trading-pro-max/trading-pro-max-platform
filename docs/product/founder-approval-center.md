# Founder Approval Center

The Founder Approval Center is a future private queue inside the Founder Command App.

Current implementation status: the approval queue is represented as a read-only foundation in `lib/server/founder-command/room.ts` and `modules/founder-command/components/FounderApprovalQueue.tsx`. It cannot approve, publish, launch, bill, activate broker/feed, enable live execution, or route real money.

## Approval States

- pending_guardian_review
- pending_legal_review
- ready_for_founder
- approved
- rejected
- blocked
- requires_revision
- archived

## Applies To

- media content
- AI video scripts
- Pro/VIP claims
- Islamic account wording
- launch wording
- billing/pricing wording
- broker/feed wording
- sensitive assistant capabilities
- command app high-risk actions

## Rules

- Founder approval cannot override Critical blocks without remediation.
- Every approval must be audited.
- Approved wording must still reflect real configured capability.
- Blocked content must be revised before returning to review.
- No approval can enable live execution, real money, broker/feed, billing, or public launch without future explicit gates.

## Current Living Foundation

The approval queue remains read-only but is now visible inside the Founder Command component alongside daily briefing and risk panels. It is useful for planning and review readiness only. No queue item can be approved, rejected, scheduled, published, billed, launched, or routed to a broker from the current UI.

## Earth Hierarchy Approval Routing

High-risk approvals route upward through the Earth hierarchy: requesting city/module -> ministry -> state governor -> continent governor -> Founder Presidency / Central Coordination -> Guardian/Legal/Treasury/Engineering review where required -> Founder Command Room.

Founder approval remains read-only/planned in the current baseline and cannot override critical Guardian or Legal blocks without remediation.
