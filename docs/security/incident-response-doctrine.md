# Incident Response Doctrine

## Purpose

Incident Response defines how Trading Pro Max classifies, contains, recovers from, and reviews security incidents.

## Stages

1. Detect
2. Classify
3. Contain
4. Preserve non-secret evidence
5. Recover
6. Review
7. Report to Founder Command

## Decision Level

Potential incidents use `incident_required` and require Incident Response, Forensics, Founder Command, and Legal review when appropriate.

## Evidence Rules

Allowed:

- Event id
- Timestamp
- Affected area
- Safe summary
- Review status
- Non-secret artifact hash/reference

Forbidden:

- Secret values
- Passwords
- API keys
- Broker credentials
- Payment data
- Social tokens
- Raw private sensitive data

## Non-Launch Truth

Incident readiness does not activate production, public launch, billing, broker/feed, live execution, real-money routing, or social publishing.
