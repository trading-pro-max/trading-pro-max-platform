# Guardian + Legal Enforcement Matrix

The Guardian + Legal Enforcement Matrix defines how TPM classifies sensitive actions and claims. It is a readiness/runtime contract, not a claim that external legal compliance is certified.

Runtime:
- `lib/server/guardian-legal/enforcement-matrix.ts`

Subjects:
- user action
- assistant response
- media content
- plan claim
- legal claim
- Islamic claim
- live trading claim
- billing claim
- launch claim
- community content
- founder action

Outcomes:
- allow
- caution
- require review
- require Founder approval
- block
- escalate to Guardian
- escalate to Legal
- create audit event later

Blocked by default:
- live trading claims
- real-money/broker bypass attempts
- billing activation claims
- public launch claims
- Sharia/Islamic certification claims without real certification
- guaranteed profit, win-rate, risk-free, or sure-signal language

Founder approval does not override Critical Guardian/Legal blocks without remediation.
