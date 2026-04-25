# Academy, Journal, And Coach

Academy, Journal, and Coach are future learning and behavior systems. They help citizens use the platform responsibly, especially in paper mode. They are not financial advice systems and they do not guarantee outcomes.

## Academy

Purpose: teach safe platform use and trading concepts.

Future content:

- first-use lessons
- glossary
- paper trading practice
- platform walkthroughs
- market data source explanations
- fallback/degraded/live state education
- risk basics
- execution preflight education

## Journal

Purpose: record decisions, context, and reflections.

Future capabilities:

- trade idea notes
- session notes
- emotional and discipline prompts
- decision replay references
- paper performance context
- learning milestones

The Journal must not turn historical outcomes into guaranteed future predictions.

## Coach

Purpose: guide discipline and platform learning.

Future prompts:

- "What was your thesis?"
- "What would invalidate this idea?"
- "Is this paper-only?"
- "Which state is blocked or fallback?"
- "What did you learn from the session?"

## VIP Strategy Review

VIP strategy review may be planned as advanced coaching. It must remain:

- educational
- contextual
- non-guaranteed
- non-advisory
- reviewed by Legal Counsel for public claims

## Safety Rules

- no profit guarantees
- no financial advice
- no gambling-style urgency
- no manipulation
- no "revenge trade" prompting
- no pressure loops
- no win-rate or certainty claims

## Learning Role

Academy, Journal, and Coach teach, prompt reflection, summarize paper practice, and support discipline. They must not provide financial advice, manipulate behavior, create gambling-style urgency, or imply guaranteed improvement.

## Current Runtime Foundation

The first Journal / Coach foundation now exists as a safe readiness contract and compact settings/diagnostics surface.

Runtime sources:

- `lib/server/journal-coach/types.ts`
- `lib/server/journal-coach/state.ts`
- `app/api/journal-coach/readiness/route.ts`
- `modules/journal-coach/components/SessionCoachPanel.tsx`
- `modules/journal-coach/components/JournalPromptCard.tsx`

Active Free prompts:

- session readiness
- paper-mode reminder
- decision note
- post-session learning

Planned states:

- Pro journal depth remains planned and locked until entitlement support exists.
- VIP coach review remains locked until real entitlement and safety gates exist.

The runtime foundation is educational only. It does not produce trading signals, financial advice, guaranteed outcomes, or live execution authority.

## Decision Replay Foundation

Decision Replay is now represented as a paper-only learning contract in `lib/server/journal-coach/replay.ts`. It stores selected symbol/timeframe, context quality, product truth at decision time, preflight state, assistant guidance state, allowed/blocked state, and learning prompts.

Decision Replay explicitly does not guarantee that any alternate decision would have produced a better outcome.

## Plan-Based Learning Depth

Free has basic safe prompts active. Pro deeper session review is planned. VIP advanced coaching and strategy review are planned. Institutional team reports are future planned.

Journal and Coach surfaces must keep plan labels truthful and must not pressure trades, imply better outcomes, or sell premium results.

## Product Reality Journal Foundation

The Product Reality pass adds a practical local/session journal composer and decision replay card.

Current capabilities:

- session note
- decision note
- lesson learned
- blocked-state note
- paper-mode reflection
- local draft saving in the browser
- decision replay context card

Persistence remains a planned gap. Account-safe production journal storage is not active, and the local composer must not be treated as durable regulated recordkeeping.
## Product Memory Readiness

Journal/Coach memory is local/session foundation only in Command 4.

Allowed journal memory:

- session note
- decision note
- lesson learned
- blocked-state reflection
- paper-mode reflection

Allowed coach memory:

- session readiness
- safe prompt response
- reflection note
- risk-profile placeholder note

Forbidden memory:

- real-money records
- sensitive personal data
- financial advice
- outcome guarantees
- hidden tracking

Account-safe durable persistence remains planned and requires a future explicit implementation pass.
