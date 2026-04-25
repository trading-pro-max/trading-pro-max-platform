# Forensics & Evidence Ledger

## Purpose

The Forensics & Evidence Ledger records safe evidence summaries for security review without storing secrets or raw private sensitive data.

## Allowed Evidence

- Event id
- Timestamp
- Affected area
- Event category
- Safe summary
- Review status
- Non-secret artifact hash/reference
- Chain-of-custody metadata

## Forbidden Evidence

- Secret values
- API keys
- Passwords
- Broker credentials
- Payment data
- Social tokens
- Raw private sensitive data
- Private surveillance logs

## Retention Truth

The ledger is a policy-defined readiness model, not surveillance. It supports incident review, Founder Command reporting, and safe hardening decisions.

## Founder Command Reporting

Founder Command may see evidence readiness, incident readiness, and safe blocked decision summaries. It must never display raw secret values.
