# Al-Kawn Professional Workspace Architecture

## Status

prepared_not_run

## Workspace Blueprint

The proposed Desktop/AL-KAWN folder tree is documented and encoded in `scripts/setup-al-kawn-professional-workspace.ps1`.

## Script Safety

The script creates folders and README files only. It does not move the active repo, delete files, scan private folders, overwrite existing README files, publish, sign, upload, or activate public/money/broker/legal/external systems.

## Required Rules

- لا حذف قبل الجرد والتصنيف.
- لا نقل للريبو النشط قبل تقرير migration.
- كل مشروع داخل الكون له مجلد كامل مستقل.
- Product Truth يحكم كل شيء.

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
