# Al-Kawn Modular Worlds Architecture

## Status

defined

## Root Rule

الكون is root. No project owns الكون. الكون owns all worlds.

## World Rules

- كل مشروع داخل الكون له مجلد كامل مستقل.
- كل المشاريع تعمل معًا عبر Al-Kawn Core.
- الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.
- Shared logic belongs in Al-Kawn Core.
- Cross-world communication happens through contracts.

## Contracts

ProductTruthContract, KernelVerdictContract, WorldStatusContract, ReportContract, RightsOwnershipContract, PrivacyBoundaryContract, CommandExecutionContract, and UIIntegrationContract.

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
