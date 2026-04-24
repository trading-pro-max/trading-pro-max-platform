# Trading Pro Max Beta Test Plan

## Scope

This plan validates controlled real-world use of the web app in paper-only mode. It does not validate live trading, real-money routing, live feed activation, billing, notifications, or public launch.

## Testers

- Tester 1: first-run comprehension and sign-in.
- Tester 2: chart/workstation paper workflow.
- Tester 3: settings and persistence.
- Tester 4: diagnostics and trust labels.
- Tester 5: feedback, recovery, and degraded-state interpretation.

## Test Areas

### Access

- Login with assigned credentials.
- Refresh page and confirm session remains visible.
- Sign out and verify protected APIs return `401`.

### Workstation

- Open `/en`.
- Confirm chart, ticket, IQ/Brain, watchlist, and blotter render.
- Toggle real mode and confirm paper actions are disabled.
- Confirm live execution remains blocked.

### Market Feed

- Call `/api/market?symbol=EUR/USD&timeframe=1m`.
- Confirm fallback source labeling.
- Confirm freshness/degraded fields are present.
- Confirm no external live feed is claimed.

### Broker Readiness

- Call `/api/broker/state`.
- Confirm sandbox/live separation fields exist.
- Confirm credential state is presence-only.
- Confirm real routing is blocked.

### Compliance and Safety

- Call authenticated `/api/account/compliance`.
- Confirm disclosure state, paper activation state, and `realMoneySafety.state: blocked`.
- Confirm hard block reasons include live-money policy and broker live configuration requirements.

### Feedback

- Submit one feedback item per tester.
- Assign category and severity.
- Triage within 24 hours.

## Acceptance Threshold

- All four key UI routes render.
- All protected routes remain protected while signed out.
- No tester reports confusion that the system is live-money capable.
- No API claims live execution, live broker routing, live feed activation, billing, notifications, or public launch.
