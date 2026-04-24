# Content Factory Engine

The Content Factory Engine prepares media/content workflow architecture without publishing externally.

Runtime source:

- `lib/server/content-factory/types.ts`
- `lib/server/content-factory/rules.ts`

Content types:

- text post
- academy post
- product update
- trust/safety post
- Pro/VIP teaser
- AI video script
- short video script
- long video script
- carousel outline
- changelog summary
- community announcement

Lifecycle:

- idea
- draft
- brand_review
- guardian_review
- legal_review
- founder_approval
- scheduled
- published
- blocked
- archived

Risk:

- safe_auto_publish
- approval_required
- blocked

Current truth:

- external publishing is blocked
- social tokens are not present
- fake metrics are blocked
- sensitive posts require review
- blocked claims must be rewritten before review

## Operational Samples

The readiness snapshot classifies:

- education platform tip: safe_auto_publish candidate later
- VIP claim: approval_required
- guaranteed profit: blocked
- Islamic/Sharia certification claim: blocked unless real certification exists
- live trading/broker claim: blocked

No sample creates an external post, social token, fake metric, or launch claim.
