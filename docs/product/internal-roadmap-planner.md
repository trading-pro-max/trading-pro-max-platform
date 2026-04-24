# Internal Roadmap Planner

The Internal Roadmap Planner deepens the AI Build Planner into a safe task classifier for future work.

Runtime:
- `lib/server/build-planner/planner.ts`
- `/api/build-planner/readiness`

Planner output:
- next safe task
- batchable tasks
- blocked tasks
- forbidden tasks
- dependency chain
- validation required
- risk level
- owner/ministry
- whether user-facing
- whether Founder-only
- whether docs-only
- whether work should wait

Forbidden by default:
- launch activation
- production secrets
- live execution
- billing activation
- broker/feed activation
- social publishing

The planner is not an autonomous code executor. Human direction, validation, and Ahmad acceptance remain required.
