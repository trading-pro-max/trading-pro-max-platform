# Guardian + Legal Rules Engine

The Guardian + Legal Rules Engine classifies unsafe behavior and risky claims.

Runtime source:

- `lib/server/guardian-legal/types.ts`
- `lib/server/guardian-legal/rules.ts`

Guardian categories:

- auth abuse
- API abuse
- entitlement bypass
- prompt injection
- feedback spam
- media abuse
- community abuse
- execution bypass attempts
- suspicious activity
- data scraping

Legal blocked patterns:

- guaranteed profit
- win-rate claims
- risk-free wording
- sure signal
- fake live trading
- fake broker/feed/billing/public launch
- fake VIP guarantees
- fake Islamic/Sharia certification
- AI prediction overclaims
- legal or financial advice claims
- copied competitor content

Outputs:

- allowed
- caution
- review_required
- founder_approval_required
- blocked

The engine is a rules contract. It does not claim invasive surveillance, does not inspect private data, and does not expose secrets.
