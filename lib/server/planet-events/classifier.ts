import "server-only";

import { createPlanetConstructionEvent } from "./events";
import type {
  PlanetConstructionEvent,
  PlanetConstructionEventInput,
  PlanetConstructionEventType,
  PlanetConstructionRiskLevel,
} from "./types";

const typePatterns: Array<{
  type: PlanetConstructionEventType;
  riskLevel: PlanetConstructionRiskLevel;
  patterns: string[];
  nextAction: string;
}> = [
  {
    type: "live_execution_requested",
    riskLevel: "critical",
    patterns: ["live execution", "enable live", "live trading"],
    nextAction: "Keep live execution blocked and convert the request into readiness-only documentation.",
  },
  {
    type: "real_money_requested",
    riskLevel: "critical",
    patterns: ["real money", "cash routing", "real-money"],
    nextAction: "Keep real-money routing blocked and preserve paper-safe product truth.",
  },
  {
    type: "billing_activation_requested",
    riskLevel: "critical",
    patterns: ["billing", "checkout", "subscription activation"],
    nextAction: "Keep billing inactive and route only future readiness research to Treasury and Legal.",
  },
  {
    type: "broker_feed_activation_requested",
    riskLevel: "critical",
    patterns: ["broker", "feed activation", "live feed"],
    nextAction: "Keep broker/feed activation blocked and use sandbox/readiness contracts only.",
  },
  {
    type: "social_publish_requested",
    riskLevel: "critical",
    patterns: ["social publish", "publish externally", "post to x", "post to instagram"],
    nextAction: "Keep publishing blocked and route drafts through Media, Guardian, Legal, and Founder review.",
  },
  {
    type: "legal_claim_risk",
    riskLevel: "high",
    patterns: ["guaranteed profit", "win-rate", "risk-free", "financial advice", "legal advice"],
    nextAction: "Rewrite to a truthful educational alternative and require Legal/Guardian review.",
  },
  {
    type: "islamic_certification_claim_requested",
    riskLevel: "high",
    patterns: ["sharia certified", "islamic certified", "islamic compliant"],
    nextAction: "Keep Islamic wording as not certified or review-required until real certification exists.",
  },
  {
    type: "partnership_claim_requested",
    riskLevel: "high",
    patterns: ["official partner", "sponsored by", "partnership active"],
    nextAction: "Remove partner claim unless a signed contract and Rights/IP review exist.",
  },
  {
    type: "vip_claim_requested",
    riskLevel: "high",
    patterns: ["vip active", "vip signals", "premium active", "institutional available"],
    nextAction: "Keep VIP/Institutional wording planned or entitlement-gated only.",
  },
  {
    type: "internal_term_leak_detected",
    riskLevel: "medium",
    patterns: ["founder king", "planet os", "ministries", "councils", "presidency", "kingdom"],
    nextAction: "Replace public copy with professional product language.",
  },
  {
    type: "chart_quality_low",
    riskLevel: "medium",
    patterns: ["chart", "workstation", "execution ticket"],
    nextAction: "Draft a chart-first UI repair task with screenshot validation.",
  },
  {
    type: "assistant_response_risk",
    riskLevel: "medium",
    patterns: ["assistant", "tpm assistant", "companion"],
    nextAction: "Draft bounded assistant behavior updates and test forbidden intents.",
  },
  {
    type: "safe_docs_update_needed",
    riskLevel: "low",
    patterns: ["docs", "documentation", "readme"],
    nextAction: "Draft documentation-only update and validate links.",
  },
];

export function classifyPlanetConstructionEvent(
  input: PlanetConstructionEventInput,
  checkedAt = new Date().toISOString()
): PlanetConstructionEvent {
  const normalized = `${input.title} ${input.description ?? ""} ${input.affectedArea ?? ""}`.toLowerCase();
  const matched = input.type
    ? typePatterns.find((candidate) => candidate.type === input.type)
    : typePatterns.find((candidate) =>
        candidate.patterns.some((pattern) => normalized.includes(pattern))
      );
  const type = input.type ?? matched?.type ?? "codex_task_needed";
  const riskLevel = matched?.riskLevel ?? (type === "codex_task_needed" ? "low" : "medium");
  const suggestedNextAction =
    matched?.nextAction ?? "Draft a scoped, validation-heavy Codex task without external execution.";

  return createPlanetConstructionEvent({
    type,
    source: input.source ?? "planet_construction_classifier",
    affectedArea: input.affectedArea ?? "product_build_system",
    affectedFiles: input.affectedFiles,
    riskLevel,
    userFacingImpact:
      riskLevel === "critical"
        ? "No user-facing activation is allowed."
        : "Potential user-facing clarity or quality improvement.",
    founderImpact:
      riskLevel === "critical"
        ? "Founder-visible blocked request requiring no execution."
        : "Founder can review readiness and prioritization.",
    planImpact:
      type === "vip_claim_requested"
        ? "Plan wording must remain planned/entitlement-gated."
        : "Plan truth must remain Free active, Pro/VIP planned, Institutional future.",
    productTruthImpact:
      riskLevel === "critical"
        ? "Hard product truth block applies."
        : "Product truth must be preserved in any draft.",
    suggestedNextAction,
    createdAt: checkedAt,
  });
}

export function getPlanetEventReadinessSamples(checkedAt = new Date().toISOString()) {
  return [
    classifyPlanetConstructionEvent(
      {
        title: "Chart feels crowded on workstation",
        affectedArea: "Trading Workspace",
        affectedFiles: ["modules/shell/components/TradingWorkstation.tsx"],
      },
      checkedAt
    ),
    classifyPlanetConstructionEvent(
      {
        title: "Public copy mentions Founder King",
        affectedArea: "Public Entry",
      },
      checkedAt
    ),
    classifyPlanetConstructionEvent(
      {
        title: "Enable live execution and real money",
        affectedArea: "Execution",
      },
      checkedAt
    ),
  ];
}
