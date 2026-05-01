# Al-Kawn Project Root Order Audit

## Status

ready_with_notes

## Major Surface Classification

| Surface | Classification | Verdict |
| --- | --- | --- |
| app/desktop/kawn | desktop_app | protected_do_not_touch |
| app/founder/universe | founder_private | protected_do_not_touch |
| app/trading | trading_layer | protected_do_not_touch |
| app/_components | shared_component | protected_do_not_touch |
| lib/server/universe | al_kawn_core | protected_do_not_touch |
| lib/client | shared_component | protected_do_not_touch |
| docs/product | private_report | protected_do_not_touch |
| reports | private_report | protected_do_not_touch |
| tests/regression | protected_do_not_touch | protected_do_not_touch |
| package/project naming | migration_candidate | needs_ahmad_decision |
| ALKON references | guardian_layer | protected_do_not_touch |
| Pro Max references | pro_max_layer | demote_pro_max |
| Trading references | trading_layer | protected_do_not_touch |

## Findings

- الكون is root.
- Pro Max is a world/layer inside الكون.
- /desktop/kawn is Ahmad's personal command home.
- /founder/universe is founder-private summary.
- /trading remains a product layer.
- No active repo movement was performed.
- No deletion was performed.
- No private folders outside the repo were scanned.

## Required Wording

- الكون يبقى داخل أجهزة أحمد الشخصية فقط.
- الاستخدام شخصي لأحمد فقط.
- الكون لا يبدأ من مجلد؛ الكون يبدأ من جهاز أحمد الشخصي.
- لابتوب أحمد هو نطاق الكون المحلي.
- AL-KAWN هو مركز قيادة داخل نطاق الجهاز.
- كل مشروع داخل الكون له مجلد كامل مستقل.
- كل المشاريع تعمل معًا عبر Al-Kawn Core.
- الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.
- لا حذف قبل الجرد والتصنيف.
- لا نقل للريبو النشط قبل تقرير migration.
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
