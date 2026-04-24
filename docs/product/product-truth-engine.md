# Product Truth Engine

The Product Truth Engine centralizes the current truth for every sensitive capability.

Runtime source:

- `lib/server/product/truth.ts`
- `/api/product/truth`

Tracked truth states:

- active
- inactive
- blocked
- guarded
- unavailable
- planned
- review_required
- not_certified
- not_configured

Current non-negotiable truth:

- live execution: blocked
- real-money routing: blocked
- broker/feed activation: not configured
- billing/subscriptions: inactive
- public launch: inactive
- production readiness: blocked until real external values exist
- staging readiness: planned/checklist-based
- monitoring: not configured unless real provider values exist
- social publishing: blocked
- Pro/VIP/Enterprise: planned or locked unless real entitlement exists
- Islamic/Sharia certification: not certified by default
- AI prediction claims: blocked
- performance-based revenue: hidden/inactive, future review only
- native apps: readiness only, not shipped

This engine is the source of wording discipline for product surfaces, docs, diagnostics, and future command reports.
