# Self-Managed Platform Layer

The self-managed platform layer is the operating layer that helps Trading Pro Max understand its own health, readiness, risks, and next actions.

## Inputs

- health checks
- route checks
- diagnostics
- readiness validators
- feedback submissions
- regression results
- visual acceptance results
- secret rotation readiness
- production blockers
- staging blockers
- launch blockers
- Guardian incidents
- Legal review queue
- Engineering tasks
- Media review queue
- support queue

## Outputs

- Founder next actions
- incident summaries
- blocker summaries
- hardening recommendations
- review queues
- safe automation candidates
- blocked action explanations
- readiness state changes

## Operating Cadence

Daily:

- review health and incidents
- triage feedback
- inspect high-severity regressions
- review Guardian and Legal queues
- identify Founder decisions needed

Weekly:

- review product gaps
- review beta readiness
- review media backlog
- review plan/economy roadmap
- review academy and journal gaps

Before any launch stage:

- production env readiness must pass
- staging readiness must pass
- secret rotation must pass
- monitoring readiness must pass
- support path must pass
- Legal and Guardian review must pass
- Founder approval must be explicit

## Safety Rule

The platform may recommend actions. It must not silently perform high-risk actions or claim readiness that validators do not prove.
