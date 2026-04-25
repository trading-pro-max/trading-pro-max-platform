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

