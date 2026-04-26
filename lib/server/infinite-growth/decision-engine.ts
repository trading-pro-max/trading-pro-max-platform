import { getGrowthDomainRule } from "./domain-registry";
import { evaluateGrowthGates } from "./gates";
import { createGrowthPermit } from "./growth-permit";
import { selectGrowthMemoryLesson } from "./memory";
import { evaluateSwissLawGravity } from "./swiss-law-gravity";
import type {
  GrowthGateStatus,
  InfiniteGrowthDecision,
  InfiniteGrowthDecisionReport,
  InfiniteGrowthGate,
  InfiniteGrowthIdea,
} from "./types";

export const SAMPLE_INFINITE_GROWTH_IDEAS: InfiniteGrowthIdea[] = [
  {
    ideaId: "safe_docs_growth",
    title: "Document safe local readiness",
    description:
      "Expand doctrine, tests, audits, and memory without public claims or activation.",
    domain: "docs",
    requestedBy: "founder",
    currentStage: "local_laptop",
  },
  {
    ideaId: "workspace_polish",
    title: "Improve paper-safe workspace clarity",
    description:
      "Make the chart-first workspace calmer and clearer without live execution.",
    domain: "workspace",
    requestedBy: "founder",
    currentStage: "local_laptop",
  },
  {
    ideaId: "privacy_waitlist_readiness",
    title: "Plan future waitlist data collection",
    description:
      "Prepare privacy-minimized waitlist readiness before collecting any user data.",
    domain: "data",
    requestedBy: "founder",
    collectsUserData: true,
    currentStage: "readiness",
  },
  {
    ideaId: "invoice_payment_readiness",
    title: "Review a SaaS invoice",
    description:
      "Classify invoice, budget, reserve, and tax readiness without executing payment.",
    domain: "payments",
    requestedBy: "founder",
    involvesMoney: true,
    currentStage: "local_laptop",
  },
  {
    ideaId: "media_claim_review",
    title: "Draft public media story",
    description:
      "Prepare a media draft that says Web App is current, Desktop planned, Mobile planned, and billing inactive.",
    domain: "media",
    requestedBy: "founder",
    involvesMediaClaims: true,
    currentStage: "readiness",
  },
  {
    ideaId: "billing_activation_blocked",
    title: "Activate billing checkout now",
    description:
      "Activate checkout and paid Pro/VIP access from local code now.",
    domain: "billing",
    requestedBy: "founder",
    involvesMoney: true,
    involvesPayments: true,
    currentStage: "local_laptop",
  },
  {
    ideaId: "live_execution_black_hole",
    title: "Enable live execution and real money",
    description:
      "Connect broker/feed, route real money, and execute live trades now.",
    domain: "live_execution",
    requestedBy: "founder",
    involvesTrading: true,
    involvesBrokerFeed: true,
    involvesLiveExecution: true,
    involvesCustomerFunds: true,
    currentStage: "local_laptop",
  },
  {
    ideaId: "financial_services_review",
    title: "Assess regulated financial services",
    description:
      "Prepare a legal/regulatory readiness note without offering advice or customer funds.",
    domain: "financial_services",
    requestedBy: "founder",
    involvesFinancialAdvice: true,
    currentStage: "readiness",
  },
];

function gateRank(status: GrowthGateStatus): number {
  const rank: Record<GrowthGateStatus, number> = {
    pass: 0,
    readiness_only: 1,
    review_required: 2,
    founder_approval_required: 3,
    delayed_until_ready: 4,
    blocked: 5,
    black_hole: 6,
  };

  return rank[status];
}

function failedGates(gates: InfiniteGrowthGate[]): InfiniteGrowthGate[] {
  return gates.filter((gate) => gate.status !== "pass");
}

function decideGrowth(
  idea: InfiniteGrowthIdea,
  gates: InfiniteGrowthGate[]
): InfiniteGrowthDecision {
  const failures = failedGates(gates);

  if (failures.some((gate) => gate.status === "black_hole")) {
    return "black_hole_forbidden_now";
  }

  if (idea.domain === "live_execution" || idea.domain === "real_money" || idea.domain === "broker_feed") {
    return "black_hole_forbidden_now";
  }

  if (failures.some((gate) => gate.status === "blocked")) {
    if (
      idea.domain === "financial_services" ||
      idea.domain === "regulated_activity"
    ) {
      return "regulatory_review_required";
    }

    return "blocked_until_cleared";
  }

  if (failures.some((gate) => gate.status === "delayed_until_ready")) {
    return "delayed_until_ready";
  }

  if (failures.some((gate) => gate.gateId === "PrivacyGate")) {
    return "privacy_review_required";
  }

  if (
    failures.some((gate) =>
      ["TaxAccountingGate", "TreasuryGate"].includes(gate.gateId)
    )
  ) {
    return "accounting_review_required";
  }

  if (failures.some((gate) => gate.gateId === "FinancialServicesGate")) {
    return "regulatory_review_required";
  }

  if (
    failures.some((gate) =>
      ["ClaimsGate", "MediaPublishingGate"].includes(gate.gateId)
    )
  ) {
    return "legal_review_required";
  }

  if (
    failures.some((gate) => gate.status === "founder_approval_required")
  ) {
    return "founder_approval_required";
  }

  if (idea.domain === "safe_local_build") {
    return "allow_local_only";
  }

  if (["idea", "design", "docs", "tests", "audit", "memory"].includes(idea.domain)) {
    return "allow_safe_creation";
  }

  if (["public_ui", "assistant", "workspace", "support"].includes(idea.domain)) {
    return "allow_public_safe";
  }

  return "allow_readiness_only";
}

function allowedScopeFor(decision: InfiniteGrowthDecision): string[] {
  if (decision === "black_hole_forbidden_now") {
    return ["private blocked-state explanation only"];
  }

  if (decision === "blocked_until_cleared") {
    return ["readiness report", "safe alternative explanation"];
  }

  if (decision === "delayed_until_ready") {
    return ["readiness planning", "gate checklist"];
  }

  if (
    decision === "privacy_review_required" ||
    decision === "accounting_review_required" ||
    decision === "legal_review_required" ||
    decision === "regulatory_review_required" ||
    decision === "founder_approval_required"
  ) {
    return ["draft", "review packet", "risk summary", "no execution"];
  }

  if (decision === "allow_public_safe") {
    return ["public-safe copy", "UI improvement", "Product Truth proof"];
  }

  if (decision === "allow_local_only") {
    return ["local code", "tests", "docs", "audit", "no external activation"];
  }

  return ["ideas", "planning", "design", "docs", "tests", "audits", "memory"];
}

function blockedScopeFor(gates: InfiniteGrowthGate[]): string[] {
  const blocked = gates
    .filter((gate) => gateRank(gate.status) >= gateRank("review_required"))
    .map((gate) => gate.safeAlternative);

  return [
    "payment execution",
    "production activation",
    "billing activation",
    "broker/feed activation",
    "live execution",
    "real money",
    "social publishing",
    "secret exposure",
    ...blocked,
  ].filter((item, index, list) => list.indexOf(item) === index);
}

export function evaluateInfiniteGrowth(
  idea: InfiniteGrowthIdea
): InfiniteGrowthDecisionReport {
  const domainRule = getGrowthDomainRule(idea.domain);
  const gravity = evaluateSwissLawGravity(idea);
  const gates = evaluateGrowthGates(idea);
  const failures = failedGates(gates);
  const decision =
    gravity.gravity === "black_hole"
      ? "black_hole_forbidden_now"
      : decideGrowth(idea, gates);
  const memoryLesson = selectGrowthMemoryLesson(idea.domain);
  const allowedScope = allowedScopeFor(decision);
  const blockedScope = blockedScopeFor(gates);
  const founderApprovalRequired =
    failures.some(
      (gate) =>
        gate.status === "founder_approval_required" ||
        gate.requiredReview.some((review) => /Founder/i.test(review))
    ) ||
    [
      "billing",
      "payments",
      "treasury",
      "tax",
      "accounting",
      "launch",
      "production",
      "media",
      "social",
      "financial_services",
      "regulated_activity",
    ].includes(idea.domain);
  const safeAlternative =
    failures[0]?.safeAlternative ?? gravity.safeAlternative;

  const reportWithoutPermit = {
    reportId: `infinite_growth_${idea.ideaId ?? idea.domain}`,
    idea,
    domainRule,
    gravity,
    gates,
    decision,
    requiredGates: gravity.requiredGates,
    failedGates: failures,
    allowedScope,
    blockedScope,
    safeAlternative,
    founderApprovalRequired,
    suggestedTaskDraft: `Prepare ${idea.domain} work as ${allowedScope.join(", ")} under ${gravity.gravity}.`,
    memoryLesson,
    nextSafeAction:
      decision === "black_hole_forbidden_now"
        ? "Record the blocked request and offer readiness-only alternatives."
        : failures.length > 0
          ? failures[0].safeAlternative
          : gravity.nextSafeAction,
  };

  return {
    ...reportWithoutPermit,
    permit: createGrowthPermit(reportWithoutPermit),
  };
}

export function evaluateInfiniteGrowthSamples(): InfiniteGrowthDecisionReport[] {
  return SAMPLE_INFINITE_GROWTH_IDEAS.map(evaluateInfiniteGrowth);
}
