# Swiss Precision Clock

The Swiss Precision Clock is a small operational signal, not decoration. It gives the platform a precise time anchor while keeping audit truth in UTC.

Runtime sources:

- `lib/time/platform-time.ts`
- `lib/server/time/platform-clock.ts`
- `modules/shell/components/SwissPrecisionClock.tsx`
- `modules/shell/components/PlatformPulse.tsx`

Current behavior:

- local client time is shown first
- Zurich and UTC references are shown compactly
- weekday/weekend reference is deterministic and does not claim market-open status
- audit time remains UTC
- pulse state is ready/degraded/blocked/fallback language only

Rules:

- no heavy animation
- animation must respect reduced-motion preferences
- no market-open claim without real market calendar support
- no Swiss legal/company status claim
- no distraction from chart or execution

## Living Platform Pulse

The top frame now carries a compact Platform Pulse beside the clock. It shows readiness language only:

- ready
- degraded
- blocked
- fallback

It may show feed state and execution mode, but it must not claim a live market feed, live execution, monitoring, broker activation, billing, or launch.
