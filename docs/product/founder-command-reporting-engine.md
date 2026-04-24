# Founder Command Reporting Engine

The Founder Command Reporting Engine aggregates Planet OS ministry status for the private Founder Command Room.

Runtime source:

- `lib/server/founder-command/reporting.ts`
- `/api/founder/briefing/readiness`

It reports:

- ministry reports
- Founder briefing
- top risks
- blocked/degraded ministries
- approvals needed
- Guardian alerts
- Legal warnings
- Media queue readiness
- Engineering tasks
- Product gaps
- Pro/VIP readiness
- next safe actions
- what not to do now

The readiness route is not a Founder Command action surface. It returns non-sensitive readiness truth only.

It must not contain fake users, fake revenue, fake metrics, secrets, public command controls, or launch activation.
