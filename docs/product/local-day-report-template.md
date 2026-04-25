# Local Day Report Template

Use this template at the end of a closed local Trading Pro Max review day.

## Required Fields

- Day number.
- Readiness state.
- Product reality score summary.
- Founder acceptance status.
- Open gaps.
- Suggested next Codex task.
- Validation status.
- Git clean status.
- Launch forbidden reminder.

## Readiness

- `day_one_candidate`: local day review can start.
- `local_day_passed`: a full local day passed with validation and Founder acceptance.
- `repeated_local_days`: multiple local days passed.
- `blocked`: a blocker prevents the local day from passing.

None of these states authorize public launch.

## Validation

Record pass, fail, or not run for:

- `npx tsc --noEmit`
- `npx eslint app modules tests --max-warnings=0`
- `npm run build`
- `npm run prisma:validate`
- `npm run test:regression`
- `npm run smoke:routes`
- `git diff --check`
- `git status --short`

Store summary only. Do not store raw logs if they may contain secrets.

## Launch Forbidden Reminder

Local Day reports do not authorize launch, production, billing, broker/feed activation, live execution, real-money routing, social publishing, paid entitlement activation, fake users, fake revenue, or fake metrics.
