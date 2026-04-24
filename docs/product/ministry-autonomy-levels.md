# Ministry Autonomy Levels

Ministry autonomy defines what TPM systems may do automatically, what requires review, what requires Founder approval, and what remains blocked.

Runtime:
- `lib/server/planet-os/autonomy.ts`

Levels:
- `manual_only`
- `assisted`
- `auto_draft`
- `auto_execute_safe`
- `requires_review`
- `requires_founder_approval`
- `blocked`

Current autonomy truth:
- Media may auto-draft only; publishing is blocked without Guardian, Legal, and Founder approval.
- Legal may review and block, but does not certify compliance.
- Guardian may flag, block, and escalate without invasive surveillance.
- Engineering is assisted and validation-bound; it does not autonomously execute code.
- Treasury requires Founder approval and cannot activate billing.
- Markets & Trading blocks live trading, real-money routing, and broker/feed activation.
- Companion and Brain provide safe responses only.
- Founder Command is read-only by default.

No autonomous dangerous action is allowed.
