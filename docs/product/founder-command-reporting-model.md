# Founder Command Reporting Model

The Founder Command Room receives reports from ministries, continents, states, and cities. Reports are designed for clarity, not hype.

## Reporting Destinations

- daily briefing
- approval center
- Guardian queue
- Legal queue
- Media queue
- Engineering queue
- Ops Tower queue
- Treasury readiness queue
- Product acceptance queue

## Cadence

| Report Type | Cadence | Examples |
| --- | --- | --- |
| daily | every Founder day | planet status, top risks |
| weekly | strategic review | product gaps, ministry trends |
| event-driven | when an incident or approval appears | Guardian alert, Legal block |
| manual | on request | visual acceptance, roadmap review |

## Escalation

- Low risk: summarize.
- Medium risk: send to review.
- High risk: prepare Founder decision.
- Critical risk: block and explain remediation.

Founder approval cannot convert false readiness into true readiness.

## Runtime Reporting Source

The Founder Command reporting model is now backed by the Planet OS snapshot:

- `getPlanetOsStatusSnapshot()`
- `getPlanetMinistryReports()`
- `getFounderBriefing()`
- `/api/planet/status`

The snapshot allows diagnostics to show whether continents and ministries are reporting, what is blocked, and what the Founder must not do now. It remains read-only and does not expose a Founder action surface.

## Earth Hierarchy Reporting

The reporting model now also understands hierarchy summaries from `lib/server/planet-os/hierarchy.ts`, coordination summaries from `lib/server/planet-os/coordination.ts`, and resource summaries from `lib/server/planet-os/resources.ts`.

Founder Command can conceptually review 12 continents, 60 states, 40 ministries, authorities, cities/modules, citizen classes, resources, and inter-ministry workflows. The current implementation remains read-only readiness reporting.

## Coordination Overview

Founder Command now receives read-only coordination readiness: workflow count, message type count, pending review categories, critical blocked categories, council readiness, inter-ministry dependencies, what not to approve, and next safe coordination actions.

No approval execution, publishing, billing, broker/feed activation, public launch, live execution, or real-money routing is available from this overview.
