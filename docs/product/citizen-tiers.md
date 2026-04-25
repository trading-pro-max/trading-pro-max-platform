# Plan Tiers

Trading Pro Max uses professional plan tiers for public/user-facing surfaces. Internal compatibility IDs may still use older names, but public UI must expose only Free, Pro, VIP, and Institutional.

| Tier | User-facing access | Hidden / unavailable | Status |
| --- | --- | --- | --- |
| Guest | public entry, product truth | paid tools, private command | public-safe only |
| Free | workstation, settings, diagnostics, basic Assistant | advanced Assistant, billing, private command | paper-safe active |
| Pro | future Pro workspace surfaces | private command, VIP-only depth | planned unless entitlement exists |
| VIP | future advanced Assistant and private rooms | private command, Institutional admin | planned unless entitlement exists |
| Institutional | future team/admin/audit | owner controls | future only |
| Beta | future closed beta path | public launch claim | only if explicitly configured |
| Staff / Operator | future internal support/quality role | owner approvals, secrets | planned |
| Private Command | all private internal summaries | public user-plan restrictions do not apply, but privacy still applies | private |

Rules:
- no plan activates billing
- no plan activates live execution or real-money routing
- no Pro or VIP availability is claimed unless entitlement exists
- no Institutional availability is claimed
- live execution and real money remain blocked for all user tiers
- private command tooling is separate and never part of Free, Pro, VIP, or Institutional
