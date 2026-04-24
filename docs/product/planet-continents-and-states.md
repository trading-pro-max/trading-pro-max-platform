# Planet Continents And States

This document defines the continent/state model for TPM Planet Earth OS. It is an operating architecture only and does not create new public UI, real integrations, billing, or launch state.

| Continent | States / Cities | Purpose | Owner Role | Readiness | Citizen Impact | Plan Relevance | Automation | Truth Rules |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Trading Continent | Market State, Execution State, Risk State, Chart City, Ticket City, Watchlist City | market reading and paper execution rehearsal | Markets & Trading Ministry | active local product | all citizens | all plans | review for sensitive execution | live and real money blocked |
| Intelligence Continent | Brain State, Companion State, Coach State, Strategy Review State, AI/IQ Center | bounded decision support and learning context | AI / IQ / Brain Ministry | active/partial | all citizens | tiered by plan | auto for safe explanations, review for sensitive outputs | no prediction certainty |
| Protection Continent | Guardian State, Abuse Defense, Safety Boundaries, Incident Response | protect auth, users, APIs, plans, media, community | Guardian & Defense Ministry | architecture ready | all citizens | all plans | review/high-risk approval | no invasive surveillance |
| Law & Rights Continent | Legal State, Claims Court, Rights & Brand Office, Islamic Account Review Desk | protect wording, claims, rights, compliance boundaries | Justice / Legal / Compliance Ministry | architecture ready | all citizens | all plans | review/founder approval | no false legal or Sharia claims |
| People & Community Continent | Citizen Affairs, Community State, Support State, Feedback Court, VIP Rooms | account support, feedback, community, moderation | Interior & Citizen Affairs Ministry | planned/partial | all citizens | tiered later | review | no fake community or support scale |
| Academy Continent | Academy Library, Lessons, Glossary, Paper Training, Learning Paths | education and safer product learning | Academy & Education Ministry | planned | all citizens | tiered later | auto for safe education | no financial advice |
| Economy & Treasury Continent | Treasury State, Free/Pro/VIP/Enterprise, monetization readiness | plan economy and commercial truth | Treasury & Economy Ministry | roadmap | all citizens | all plans | founder approval for activation | no fake billing or paid access |
| Media & Communications Continent | Media Office, AI Video Studio, Content Calendar, Campaigns, Social Registry | safe content planning and review | Media & Communications Ministry | architecture ready | public later | all plans later | review/founder approval | no social posting or fake metrics |
| Engineering & Infrastructure Continent | Engineering State, Platform, Frontend, Backend, AI, Security, QA, Ops, Mobile/Desktop | build quality and system evolution | Engineering & Infrastructure Ministry | active discipline | all citizens | internal | review | no fake capability closure |
| Operations & Reliability Continent | Ops Tower, Health, Readiness, Monitoring Readiness, Recovery, Incidents, Production Blockers | system health and recovery truth | Ops / Health / Reliability Ministry | active docs/contracts | all citizens | internal | review/founder approval | no fake monitoring or production |
| Founder Command Capital | Founder King Command Room, Approval Center, Founder Personal Companion, Planet Overview | private owner governance | Founder King | foundation only | owner only | owner only | founder approval | not public, no fake metrics |

## Required Fields For Every State

- purpose
- user value
- owner role
- readiness state
- citizen/user affected
- plan relevance
- future capabilities
- automation level
- safety/truth rules
- what must not be faked

## Runtime Status

The official runtime structure is now defined in `lib/server/planet-os/state.ts`. The current deterministic model contains 11 continents, state summaries, city/module entries, plan-based citizen classes, professions, and Founder Command reporting metadata.

Every continent reports to the Founder Command Room and keeps separate lists for:

- active product truth
- planned systems
- blocked capabilities
- safety/truth rules

Blocked capabilities remain blocked even when the operating model is active.
