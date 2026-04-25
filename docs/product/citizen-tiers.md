# Plan Tiers

Trading Pro Max uses professional plan tiers for public/user-facing surfaces. Internal compatibility IDs may still use older names, but public UI must expose only Free, Pro, VIP, and Institutional.

| Tier | User-facing access | Hidden / unavailable | Status |
| --- | --- | --- | --- |
| Guest | public entry, product truth | paid tools, owner command | public-safe only |
| Free | workstation, settings, diagnostics, basic Assistant | VIP Brain, billing, owner command | paper-safe active |
| Pro | future Pro workspace surfaces | owner command, VIP-only depth | planned unless entitlement exists |
| VIP | future VIP Brain and private rooms | owner command, Institutional admin | planned unless entitlement exists |
| Institutional | future team/admin/audit | owner controls | future only |
| Beta | future closed beta path | public launch claim | only if explicitly configured |
| Staff / Operator | future internal support/quality role | owner approvals, secrets | planned |
| Owner | all private internal summaries | public user-plan restrictions do not apply, but privacy still applies | owner-only private |

Rules:
- no plan activates billing
- no plan activates live execution or real-money routing
- no Pro or VIP availability is claimed unless entitlement exists
- no Institutional availability is claimed
- live execution and real money remain blocked for all user tiers
- owner command is private owner-only and never part of Free, Pro, VIP, or Institutional
