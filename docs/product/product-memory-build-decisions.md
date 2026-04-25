# Product Memory Build Decisions

Build Decision Memory records safe summaries of construction work.

It may store:

- Codex task title
- reason
- risk level
- forbidden scope
- validation result
- changed files summary
- commit hash if available
- pushed yes/no
- accepted/rejected status
- follow-up needed

It must not execute code, call external Codex automatically, expose secrets, or convert blocked tasks into approved work.

Used by:

- AI Build Planner
- Codex Task Compiler
- Founder Command
- Product Reality Scoring

Blocked launch, billing, broker/feed, live execution, real-money, social publishing, fake plan activation, fake metrics, and secret changes remain blocked.
