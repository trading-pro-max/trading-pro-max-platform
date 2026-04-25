# Founder Command Safety Boundaries

Founder Command safety boundaries define what the private command app may automate, review, request approval for, or block.

## Risk Levels

| Risk | Meaning | Default Action |
| --- | --- | --- |
| Low | safe informational action | auto allowed |
| Medium | sensitive enough to need review | review required |
| High | can affect public trust, access, claims, money, or operations | Founder approval required after review |
| Critical | unsafe or impossible under current gates | blocked |

## Boundary Matrix

| Area | Risk | Boundary |
| --- | --- | --- |
| command summaries | Low | auto allowed |
| daily command brief | Low | auto allowed |
| feedback triage | Medium | review required |
| community moderation | Medium | Guardian review required |
| assistant output policy changes | Medium/High | Guardian and Legal review |
| media publishing | High | Guardian, Legal, and Founder approval |
| AI video publishing | High | Guardian, Legal, and Founder approval |
| Pro/VIP claims | High | Legal and Founder approval |
| Islamic account claims | High | Legal review and real certification required |
| billing/subscription claims | High | Treasury, Legal, and Founder approval |
| public launch claims | High/Critical | all launch gates plus Founder approval |
| production deployment | High/Critical | production gates plus Founder approval |
| broker/feed activation | High/Critical | configured gates plus Founder approval |
| live execution | Critical | blocked |
| real-money routing | Critical | blocked |
| secret display or export | Critical | blocked |

## Command App Rules

- Safe tasks may be automated.
- Medium-risk tasks require review.
- High-risk tasks require Founder approval after required reviews.
- Critical tasks remain blocked.
- Sensitive actions create audit events.
- Founder approval does not bypass hard blocks.
- No secrets are shown in the command UI.
- No live execution or real money is available from the command app unless future legal, production, broker, and safety gates exist.

## Deep Foundation Hard Blocks

The deep command app foundation may display blocked categories, but it cannot activate or approve:

- live execution
- real-money routing
- broker/feed activation
- billing/subscriptions
- social publishing
- public launch
- fake Pro/VIP claims
- fake Islamic/Sharia certification
- performance-fee activation
- production/secret actions

Founder approval cannot override Critical blocks without remediation, and Guardian/Legal hard blocks remain hard blocks.

## Local Command Shell Boundaries

The local Founder Command shell may display readiness summaries for local operations, product memory, construction queue, product gaps, validation summaries, Treasury, Media, Guardian, Legal, Ops, and Quality. It may not execute approvals.

Hard boundaries:

- no public navigation
- no normal user access
- no Free, Pro, VIP, or Institutional plan access
- no secrets
- no private sensitive user data
- no fake users, revenue, or metrics
- no production action
- no billing activation
- no broker/feed activation
- no live execution
- no real-money routing
- no social publishing
- no approval execution

The local shell can recommend safe next local actions, but it cannot perform them automatically.
