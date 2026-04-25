# Decision Replay Foundation

Decision Replay is a paper-mode learning foundation, not a performance guarantee system.

Runtime:
- `lib/server/journal-coach/replay.ts`
- `lib/server/journal-coach/state.ts`

The replay foundation records the intended context of a paper decision:
- selected symbol and timeframe
- context quality
- product truth at decision time
- preflight state
- assistant guidance state
- blocked/allowed state
- learning prompts

Decision Replay may ask what was learned from the decision, which guardrails were visible, and what could be reviewed next time. It must not claim that an alternate action would have produced a better result.

Plan behavior:
- Demo / Free: basic paper reflection
- Pro: deeper session review planned
- VIP: advanced performance review planned

No live execution, real money, broker/feed activation, or trading signals are enabled by Decision Replay.
## Product Reality Replay Card

The reusable replay card shows the symbol, timeframe, bounded context quality, product truth at the decision time, paper-safe preflight state, and learning prompts.

It must never claim that a different decision would have produced a better result. It is a learning and reflection aid only, not a performance predictor, financial adviser, or signal engine.
