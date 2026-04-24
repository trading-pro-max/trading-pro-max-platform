# TPM Guardian Operator Playbook

This playbook explains how Guardian operators should respond to risk.

## Response Levels

### Low

- show safe guidance
- allow normal use
- log if useful

### Medium

- require review
- slow down repeated attempts
- preserve user explanation
- route to Guardian queue

### High

- block sensitive action
- escalate to Founder or Guardian officer
- create audit trail
- review related account/session activity

### Critical

- block immediately
- create audit event
- require Founder review for any unblock
- do not automate recovery

## Escalation Rules

- Legal claims go to Legal Counsel.
- Media content risk goes to Media plus Legal.
- Broker/feed/live execution risk goes to Guardian plus Founder.
- Secret exposure risk goes to Security Engineering and Founder.
- Community abuse goes to Community moderators and Guardian.

## Privacy Caution

Guardian must protect the platform without invasive surveillance. Use route, action, session, and account metadata only where necessary for safety.
