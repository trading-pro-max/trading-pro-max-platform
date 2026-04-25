# Codex Construction Queue

The construction queue is a readiness-only model for proposed and drafted Codex work.

Statuses:
proposed, drafted, waiting_review, waiting_founder, approved_for_codex, sent_to_codex_later, running_external, validation_pending, passed, failed, blocked, archived.

Current rules:
- no automatic external sending
- no uncontrolled execution
- blocked items stay blocked
- Founder approval is required for sensitive work
- validation is required before acceptance

Queue items contain source event, owner ministry, task type, risk level, autonomy level, draft prompt, reviews, validation plan, expected artifacts, and timestamps.

## Founder Command Local Shell Integration

The queue is now summarized in the Founder Command Local App Shell. Founder Command can see proposed tasks, drafted tasks, waiting review, waiting Founder, blocked tasks, validation-pending categories, and safe next construction actions.

No automatic external Codex sending exists. Blocked items remain blocked, and activation requests for launch, production, billing, broker/feed, live execution, real money, social publishing, secrets, fake metrics, or fake plan activation are not eligible for execution.
