# TPM Safety Boundaries

Safety boundaries define what can be automated, reviewed, approved, or blocked.

## Risk Levels

- Low: auto allowed.
- Medium: review required.
- High: Founder approval required.
- Critical: blocked.

## Boundary Matrix

| Area | Default Risk | Boundary |
| --- | --- | --- |
| paper workspace guidance | Low | auto allowed |
| feedback triage | Medium | review required |
| media publishing | High | Founder approval required |
| Pro/VIP claims | High | Legal and Founder approval required |
| Islamic account claims | High | Legal review and real certification required |
| live execution | Critical | blocked |
| real-money routing | Critical | blocked |
| broker/feed activation | High/Critical | configured gates and Founder approval |
| billing/subscription claims | High | Treasury, Legal, Founder approval |
| community moderation | Medium | Guardian review |
| prompt-injection handling | Medium/High | Guardian escalation |
| secret-related actions | Critical | blocked unless secure workflow exists |
| Founder Command sensitive actions | High | explicit confirmation and audit |

## Rules

- Safe tasks can be automated.
- Sensitive tasks need review.
- High-risk tasks need Founder approval.
- Critical tasks are blocked.
- Every sensitive or blocked action creates an audit event.
- No secrets are exposed.
- No live execution or real money occurs without explicit configured future gates.

## Planet Earth OS Coverage

Safety boundaries apply to all continents, states, cities, ministries, professions, citizens, and Founder Command actions.

Examples:

- user Companion outputs: Low/Medium, auto or review depending content
- Founder Personal Companion recommendations: Medium/High, review or Founder approval
- media publishing: High, Founder approval after Guardian and Legal review
- billing/subscription claims: High, Treasury, Legal, and Founder approval
- live execution, real-money routing, secret exposure: Critical, blocked
- public launch: High/Critical, all gates plus Founder approval
