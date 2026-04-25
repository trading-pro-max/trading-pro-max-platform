# Quarantine And Evidence Locker

## Purpose

Quarantine catches unsafe or suspicious external signals before they can become a reply, task, or external action.

## Quarantine Reasons

- Scam
- Phishing
- Suspicious links
- Impersonation
- Fake partnership
- Threats
- Secret requests

## Evidence Locker

The evidence locker stores safe metadata only:

- Event id
- Channel category
- Event type
- Quarantine reason
- Review status
- Timestamp

## Forbidden Evidence

- Tokens
- Passwords
- API keys
- Email account credentials
- Social tokens
- Broker credentials
- Payment data
- Raw private sensitive data

## Output

Quarantined items can produce review summaries only. They do not trigger automated replies.
