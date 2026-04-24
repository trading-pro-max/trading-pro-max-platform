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

## Operational Expansion

The engine now explicitly classifies launch, secrets, live/billing/broker wording, fake VIP guarantees, fake Islamic/Sharia certification, AI prediction overclaims, and copied competitor content. It is still a classifier and review helper only; it does not replace qualified legal counsel or claim real-world enforcement certification.
