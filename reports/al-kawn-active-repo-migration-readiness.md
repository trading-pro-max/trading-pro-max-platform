# Al-Kawn Active Repo Migration Readiness

## Status

not_ready_to_move

## Reason

This mission defines order only. The active repo must stay where it is until a dedicated migration report exists and Ahmad approves.

## Current Rule

لا نقل للريبو النشط قبل تقرير migration.

## Migration Requirements

- Full inventory of current repo.
- Classification of worlds and layers.
- Protection and Product Truth check.
- Rights and source review.
- Exact move plan.
- Rollback plan.
- Ahmad decision.

## Result

The active repo remains unchanged.

## Validation

Passed:

- `npx tsc --noEmit`
- `npx eslint app modules tests --max-warnings=0`
- `npm run desktop:check`
- `npm run build`
- `npm run prisma:validate`
- `npx playwright test tests/regression/al-kawn-project-root-order-foundation.spec.ts`
- `npm run test:regression` (430/430)
- `npm run smoke:routes`
