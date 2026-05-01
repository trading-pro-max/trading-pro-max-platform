# Al-Kawn Modular Worlds Current Mapping

## Current Mapping

| World | Classification | Status | Note |
| --- | --- | --- | --- |
| Al-Kawn Core | al_kawn_core | active | Product Truth, kernel, contracts, reports, and device fabric. |
| Active Source Repo | active_repo | protected | No movement before migration report. |
| Pro Max Galaxy | pro_max_layer | future_gate | Product galaxy inside الكون, not root. |
| Trading Pro Max Earth | trading_layer | protected | /trading remains available without broker or real money activation. |
| Future Mobile | future_world | future_gate | No mobile work in this mission. |
| Private Vault | private | protected | Private folders not inspected. |
| Rights & Ownership | rights_asset | protected | Public use requires rights evidence and legal review. |
| Reports | private_report | active | Internal reports only. |
| Inbox To Classify | migration_candidate | planned | Inventory before use. |
| Legacy Do Not Delete | legacy_candidate | planned | لا حذف قبل الجرد والتصنيف. |

Product Truth يحكم كل شيء.

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
