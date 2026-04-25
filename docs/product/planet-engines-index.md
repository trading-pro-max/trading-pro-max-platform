# Planet Engines Index

The 10 core engines help Trading Pro Max construct, govern, explain, protect, and grow TPM Planet OS faster while preserving product truth.

| Engine | Purpose | Runtime Source | Doc |
| --- | --- | --- | --- |
| Planet Blueprint Engine | official Planet OS structure | `lib/server/planet-os/blueprint.ts` | [Planet Blueprint Engine](./planet-blueprint-engine.md) |
| Product Truth Engine | central blocked/inactive/planned truth | `lib/server/product/truth.ts` | [Product Truth Engine](./product-truth-engine.md) |
| Founder Command Reporting Engine | ministry and briefing reports | `lib/server/founder-command/reporting.ts` | [Founder Command Reporting Engine](./founder-command-reporting-engine.md) |
| Plan Entitlement Engine | plan capability truth | `lib/plans/entitlements.ts` | [Plan Entitlement Engine](./plan-entitlement-engine.md) |
| Assistant Context Engine | safe assistant context | `lib/server/companion/context.ts` | [Companion Context Engine](./companion-context-engine.md) |
| Guardian + Legal Rules Engine | abuse and claim classification | `lib/server/guardian-legal/rules.ts` | [Guardian + Legal Rules Engine](../security/guardian-legal-rules-engine.md) |
| Visual Acceptance Engine | visual acceptance rubric | `lib/server/visual-acceptance/rubric.ts` | [Visual Acceptance Engine](./visual-acceptance-engine.md) |
| State / Error / Blocked Engine | state explanations and safe next steps | `lib/server/state-explanations/engine.ts` | [State / Error / Blocked Engine](./state-error-blocked-engine.md) |
| Content Factory Engine | content lifecycle and risk review | `lib/server/content-factory/rules.ts` | [Content Factory Engine](./content-factory-engine.md) |
| AI Build Planner | safe task classification and validation planning | `lib/server/build-planner/planner.ts` | [AI Build Planner](./ai-build-planner.md) |

Safe read-only API surfaces:

- `/api/planet/status`
- `/api/planet/blueprint`
- `/api/planet/engines`
- `/api/planet/visual-acceptance`
- `/api/planet/state-explanations`
- `/api/planet/content-factory/readiness`
- `/api/build-planner/readiness`
- `/api/product/truth`
- `/api/founder/briefing/readiness`
- `/api/companion/context`
- `/api/journal-coach/readiness`

These routes expose readiness/planned/blocked truth only. They do not expose secrets, private user data, production config, fake metrics, billing, broker/feed activation, public launch, social publishing, live execution, or real-money routing.

Integration mesh:

- Product Truth is the source for live, real money, broker/feed, billing, launch, social, plan activation, Islamic/Sharia, and private command truth.
- Plan Entitlements are the source for Free, Pro, VIP, Institutional, and hidden/internal capabilities.
- TPM Assistant reads Product Truth, Plan Entitlements, Why Blocked explanations, Journal/Coach readiness, Settings, Diagnostics, and account/session state.
- Diagnostics shows public-safe readiness and must not expose secrets, fake metrics, private user data, or internal governance detail to normal users.
- Public surfaces use Free, Pro, VIP, Institutional, TPM Assistant, Trading Workspace, Journal, Coach, Academy, Community, Premium Reports, Plans, Settings, and Diagnostics.

Operational expansion:

- Founder Companion summaries are now available inside Founder readiness snapshots.
- Product Truth includes private command tooling as separate from user plans.
- Companion Context includes assistant tier, plan entitlement, and product truth summaries.
- Content Factory exposes sample classifications for education, VIP, Islamic, live-trading, and guaranteed-profit language.
- AI Build Planner now separates launch-forbidden, secret-forbidden, live-forbidden, companion, and media work.

Living experience activation:

- TPM Assistant launcher/panel now consumes safe context and state explanations.
- Diagnostics shows compact engine, assistant, why-blocked, and journal/coach readiness.
- Settings shows plan experience cards and paper-session coach prompts.
- Swiss Precision Clock and Platform Pulse provide compact living signals without fake market/live claims.

Intelligence and self-governance deepening:

- `tpm-brain-context-layer.md`: central bounded intelligence context.
- `user-skill-profile.md`: skill/risk profile adaptation.
- `decision-replay.md`: paper-only decision replay foundation.
- `plan-value-map.md`: plan value and non-billing truth.
- `internal-roadmap-planner.md`: roadmap automation without autonomous execution.
- `ministry-autonomy-levels.md`: ministry autonomy boundaries.
- `planet-intelligence-index.md`: index for intelligence and self-governance docs.
