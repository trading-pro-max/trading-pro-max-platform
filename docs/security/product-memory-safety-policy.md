# Product Memory Safety Policy

Product Memory is local/internal by default and must never become hidden user tracking.

## Allowed

- local day reports
- founder acceptance decisions
- visual feedback notes
- journal/coach demo notes
- decision replay note summaries
- build decisions
- validation summaries
- product gaps
- safe plan/readiness notes
- non-sensitive product preferences

## Forbidden

- production secrets
- API keys
- passwords
- broker credentials
- payment data
- raw private sensitive user data
- personally sensitive health, political, or religious data
- real-money trading credentials
- social tokens
- hidden production configuration
- fake users, revenue, or metrics

## Rules

- no production storage in this pass
- no surveillance
- no hidden user tracking
- no secret persistence
- no automatic external sync
- no launch, billing, broker/feed, live execution, real-money, or social publishing activation

Any `secret_forbidden` or `sensitive_do_not_store` memory item must be rejected before storage.
