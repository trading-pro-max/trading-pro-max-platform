# TPM Guardian Threat Model

TPM Guardian protects the kingdom from abuse, bypass attempts, false claims, and unsafe usage. It must be privacy-conscious and must not become invasive surveillance.

## Protected Assets

- users and sessions
- accounts and authentication
- APIs and rate limits
- plan and entitlement surfaces
- VIP access later
- assistant and prompt context
- feedback queue
- community surfaces later
- media and claims workflow
- market data source truth
- execution blocks
- secrets and configuration

## Abuse Scores

- Low: normal friction or minor issue, auto handling allowed.
- Medium: suspicious pattern, review required.
- High: potential abuse or bypass, Founder or Guardian escalation.
- Critical: blocked action, audit required, no automation.

## Incident Categories

- auth abuse
- API probing
- entitlement bypass
- live-execution bypass attempt
- prompt injection
- feedback spam
- community abuse
- media abuse
- fake claim attempt
- suspicious automation
- market data misuse
- execution manipulation attempt

## Guardian Rules

- log enough to investigate, not more than necessary
- explain blocked states when safe
- avoid public accusations
- preserve false-positive review path
- never expose secrets
- never punish users silently for ambiguous signals

## Audit Events

Sensitive or blocked actions should create audit events with:

- actor
- route or surface
- action
- risk level
- reason
- timestamp
- review destination
