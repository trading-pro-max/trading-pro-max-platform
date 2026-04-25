# Local Build Command Loop

The Local Build Command Loop defines how Ahmad uses Founder Command Build Room to guide Trading Pro Max construction safely.

## Loop

1. Ahmad opens the local platform.
2. Founder Command Build Room reads readiness.
3. Product, visual, validation, memory, and construction gaps are shown.
4. Safe next build actions are suggested.
5. A Codex-ready draft is generated.
6. Ahmad approves the chosen task manually.
7. Codex executes separately in a scoped work pass.
8. Validation is reviewed.
9. Product memory is updated with outcomes.
10. The next local day continues.

## Manual Approval Rule

No draft is automatically sent to Codex. Ahmad chooses what to build next.

High-risk work remains blocked or Founder-review-only. Launch, production, billing, broker/feed activation, live execution, real-money routing, social publishing, secrets, and fake metrics remain outside the loop.

## Validation Rule

Every build task draft keeps the standard validation list:

- `npx tsc --noEmit`
- `npx eslint app modules tests --max-warnings=0`
- `npm run build`
- `npm run prisma:validate`
- `npm run test:regression`
- `npm run smoke:routes`
- `git diff --check`
- `git status --short`

Visual tasks require screenshots before acceptance.

