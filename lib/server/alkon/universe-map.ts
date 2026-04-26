import "server-only";

import type { AlkonMapDomain, AlkonSubsystem } from "./types";

function domain(
  label: string,
  status: AlkonMapDomain["status"],
  detail: string
): AlkonMapDomain {
  return { label, status, detail };
}

function subsystem(input: AlkonSubsystem): AlkonSubsystem {
  return input;
}

export function buildAlkonUniverseMap(): AlkonSubsystem[] {
  return [
    subsystem({
      id: "earth_command",
      name: "Earth Command",
      symbolicRole: "Earth Public World status and public product truth",
      status: "ready",
      readiness:
        "Trading Pro Max public world is modeled as the only normal-user world.",
      linkedSystems: [
        "Home",
        "Trading Workspace",
        "Markets",
        "Plans",
        "Apps / Platforms",
        "Academy",
        "Community",
        "Support",
        "Settings",
        "Diagnostics",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "low",
      nextAction:
        "Keep users on public Trading Pro Max language while private command systems stay hidden.",
      domains: [
        domain("Public User World status", "ready", "Free / Pro / VIP / Institutional remain the only public plan names."),
        domain("Public/private boundary status", "ready", "Founder Command and Alkon terms are not public navigation."),
        domain("User-facing product truth", "ready", "Paper-safe, planned, future, inactive, and blocked states remain explicit."),
      ],
    }),
    subsystem({
      id: "moon_cycle",
      name: "Moon Command",
      symbolicRole: "Local time, review cycles, runtime readiness, and day reports",
      status: "ready",
      readiness: "Local day review signals are ready as private read-only reporting.",
      linkedSystems: [
        "Local Day Cycle",
        "Local Daily Loop",
        "Founder Review Cycle",
        "Runtime Readiness",
        "End-of-Day Reporting",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "low",
      nextAction:
        "Use the Moon cycle as a reporting cadence only; do not turn local review into launch authority.",
      domains: [
        domain("Local Day Cycle", "ready", "Closed laptop review phases are defined."),
        domain("Local Daily Loop", "ready", "Idea, gap, draft, validation, and memory stages are linked."),
        domain("End-of-day reporting", "ready", "Reports summarize readiness without fake users, revenue, or metrics."),
      ],
    }),
    subsystem({
      id: "orbit_command",
      name: "Orbit Command",
      symbolicRole: "Events, Founder ideas, task queue, passports, drafts, and result status",
      status: "ready",
      readiness:
        "Founder ideas and classified events can be reviewed without execution.",
      linkedSystems: [
        "Events",
        "Founder Idea Inbox",
        "Task Queue",
        "Sovereign Autonomy",
        "Task Passports",
        "Codex Drafts",
        "Result Status",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "medium",
      nextAction:
        "Keep Orbit output as review packets and manual drafts; no shell, Codex, or external action runs from the app.",
      domains: [
        domain("Events", "ready", "Internal events are classified and routed."),
        domain("Founder ideas", "ready", "Idea Inbox previews policy gates, passports, and draft readiness."),
        domain("Result status", "review_required", "Result Tribunal remains a validation review, not automatic acceptance."),
      ],
    }),
    subsystem({
      id: "solar_command",
      name: "Solar Command",
      symbolicRole: "Founder vision, priority law, safe direction, and blocked activation truth",
      status: "ready",
      readiness:
        "Founder priorities are represented as non-executing guidance and blocked future activation reminders.",
      linkedSystems: [
        "Founder Vision",
        "Priority Law",
        "Next Safe Direction",
        "Blocked Future Activations",
        "Real-World Activation Postponed",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "medium",
      nextAction:
        "Choose the next safe build step while preserving launch, billing, broker/feed, live, and real-money blocks.",
      domains: [
        domain("Founder vision", "ready", "Private priorities can guide local build scope."),
        domain("Priority law", "ready", "Product Truth and public/private boundaries outrank feature excitement."),
        domain("Real-world activation", "blocked", "Production, billing, broker/feed, live execution, and public launch remain postponed."),
      ],
    }),
    subsystem({
      id: "planetary_systems",
      name: "Planetary Systems",
      symbolicRole: "Ministries, authorities, and internal product systems",
      status: "partial",
      readiness:
        "Internal authorities are mapped for readiness, gaps, and next actions only.",
      linkedSystems: [
        "Design Ministry",
        "Product Truth",
        "Plans / Realms",
        "TPM Assistant",
        "Journal / Coach",
        "Academy / Community",
        "Media",
        "Treasury Readiness",
        "Diagnostics",
        "Integrations",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "medium",
      nextAction:
        "Use internal systems to produce public-safe outputs; never surface ministries or governance to users.",
      domains: [
        domain("Plans / realms", "ready", "Free is active; Pro and VIP planned; Institutional future; Alkon private."),
        domain("Treasury readiness", "blocked", "Billing and real-money routes are not active."),
        domain("Integrations", "planned", "External services stay readiness-only until explicit real setup exists."),
      ],
    }),
    subsystem({
      id: "defense_universe",
      name: "Defense Universe",
      symbolicRole: "Security, secrets, incident readiness, and Founder protection",
      status: "ready",
      readiness:
        "Security and secrets report status only; raw values and dangerous actions remain blocked.",
      linkedSystems: [
        "Public Security",
        "Cyber Sovereignty",
        "Secrets Authority",
        "Founder Protection",
        "Incident Readiness",
        "Red / Blue / Purple Readiness",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "critical",
      nextAction:
        "Keep secrets presence-only, protect owner-only command surfaces, and reject external attack or activation requests.",
      domains: [
        domain("Public security", "ready", "Public route and safety posture can be reviewed."),
        domain("Secrets authority", "ready", "Secret categories are status-only; values are never exposed."),
        domain("Incident readiness", "ready", "Defensive incident handling is readiness-only and evidence-safe."),
      ],
    }),
    subsystem({
      id: "construction_universe",
      name: "Construction Universe",
      symbolicRole: "Codex governance, task constitution, permits, tribunal, and lessons",
      status: "ready",
      readiness:
        "Construction governance produces manual review packets and validation expectations.",
      linkedSystems: [
        "Codex Sovereignty",
        "Task Constitution",
        "Jurisdiction",
        "Task Passport",
        "Execution Permit",
        "Result Tribunal",
        "Memory Lessons",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "high",
      nextAction:
        "Draft scoped work for external/manual Codex use only after policy gates and validation requirements are clear.",
      domains: [
        domain("Task Passport", "ready", "Allowed files, forbidden scope, validation, and public language rules are explicit."),
        domain("Execution Permit", "review_required", "Permits are readiness decisions, not web-app execution authority."),
        domain("Result Tribunal", "review_required", "Validation and product truth decide acceptance."),
      ],
    }),
    subsystem({
      id: "memory_universe",
      name: "Memory Universe",
      symbolicRole: "Founder acceptance, product gaps, visual feedback, local reports, and lessons",
      status: "ready",
      readiness:
        "Safe memory stores summaries and lessons without secrets or private sensitive data.",
      linkedSystems: [
        "Founder Acceptance",
        "Product Gaps",
        "Visual Feedback",
        "Local Day Reports",
        "Validation Summaries",
        "No-Images Preference",
        "Rejected Logo History",
        "Chart Annoyance History",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "medium",
      nextAction:
        "Keep memory as safe summaries and lessons; never store raw secrets, private sensitive data, fake users, or fake metrics.",
      domains: [
        domain("Founder acceptance", "ready", "Acceptance signals remain private review records."),
        domain("Visual feedback", "ready", "Logo and chart lessons can guide future work."),
        domain("Validation summaries", "ready", "Command outcomes are summarized without raw sensitive logs."),
      ],
    }),
    subsystem({
      id: "world_interface",
      name: "World Interface",
      symbolicRole: "External channel readiness without sending, publishing, or tokens",
      status: "partial",
      readiness:
        "Email, social, support, partner, media, and security channels are classified as readiness only.",
      linkedSystems: [
        "Email Readiness",
        "Social Readiness",
        "Support Readiness",
        "Partners / Media / Security Channels",
        "Quarantine",
        "No Sending / Publishing / Tokens",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "high",
      nextAction:
        "Keep all channels in draft/quarantine readiness; do not connect accounts, send messages, publish, or store tokens.",
      domains: [
        domain("Email readiness", "planned", "No real email connection or sending is active."),
        domain("Social readiness", "blocked", "No social accounts, tokens, posting, or publishing automation exists."),
        domain("Quarantine", "ready", "Suspicious links, secret requests, impersonation, and legal/security events are review-only."),
      ],
    }),
    subsystem({
      id: "invisible_operating_layer",
      name: "Invisible Operating Layer",
      symbolicRole: "Product Truth, entitlements, safety, legal, trust, brand, autonomy, and surface boundaries",
      status: "ready",
      readiness:
        "The hidden layer maps internal complexity into public-safe readiness outputs.",
      linkedSystems: [
        "Product Truth",
        "Plan Entitlements",
        "Guardian",
        "Legal",
        "Trust Governor",
        "Brand Intelligence",
        "Sovereign Autonomy",
        "Surface Boundaries",
      ],
      publicVisible: false,
      founderVisible: true,
      riskLevel: "medium",
      nextAction:
        "Continue translating private systems into public-safe product truth without leaking internal terminology.",
      domains: [
        domain("Product Truth", "ready", "Activation, paid access, launch, broker/feed, and execution truth is explicit."),
        domain("Surface Boundaries", "ready", "Public UI stays on Trading Pro Max terminology."),
        domain("Trust / Legal / Guardian", "review_required", "Sensitive claims and external actions require review."),
      ],
    }),
  ];
}
