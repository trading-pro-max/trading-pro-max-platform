# Planet Engines Index

The 10 core engines help Trading Pro Max construct, govern, explain, protect, and grow TPM Planet OS faster while preserving product truth.

| Engine | Purpose | Runtime Source | Doc |
| --- | --- | --- | --- |
| Planet Blueprint Engine | official Planet OS structure | `lib/server/planet-os/blueprint.ts` | [Planet Blueprint Engine](./planet-blueprint-engine.md) |
| Product Truth Engine | central blocked/inactive/planned truth | `lib/server/product/truth.ts` | [Product Truth Engine](./product-truth-engine.md) |
| Founder Command Reporting Engine | ministry and briefing reports | `lib/server/founder-command/reporting.ts` | [Founder Command Reporting Engine](./founder-command-reporting-engine.md) |
| Plan Entitlement Engine | plan capability truth | `lib/plans/entitlements.ts` | [Plan Entitlement Engine](./plan-entitlement-engine.md) |
| Companion Context Engine | safe assistant context | `lib/server/companion/context.ts` | [Companion Context Engine](./companion-context-engine.md) |
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

Operational expansion:

- Founder Companion summaries are now available inside Founder readiness snapshots.
- Product Truth includes Founder Command as owner-only/private.
- Companion Context includes assistant tier, plan entitlement, and product truth summaries.
- Content Factory exposes sample classifications for education, VIP, Islamic, live-trading, and guaranteed-profit language.
- AI Build Planner now separates launch-forbidden, secret-forbidden, live-forbidden, companion, and media work.

Living experience activation:

- TPM Companion launcher/panel now consumes safe context and state explanations.
- Diagnostics shows compact engine, assistant, why-blocked, and journal/coach readiness.
- Settings shows plan experience cards and paper-session coach prompts.
- Swiss Precision Clock and Platform Pulse provide compact living signals without fake market/live claims.
