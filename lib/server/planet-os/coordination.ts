import "server-only";

import {
  getMinistryMessageLedgerSnapshot,
  MINISTRY_MESSAGE_STATES,
  MINISTRY_MESSAGE_TYPES,
} from "./messages";
import {
  getInterMinistryWorkflowSnapshot,
  INTER_MINISTRY_WORKFLOWS,
} from "./workflows";
import type {
  CoordinationDecisionOutcome,
  CoordinationReviewer,
  MinistryCoordinationReadiness,
  MinistryMessage,
  MinistryMessageType,
  PlanetAutomationLevel,
  PlanetRiskLevel,
  PresidencyCoordinationDecision,
} from "./types";

export type CoordinationRequest = {
  id: string;
  title: string;
  sourceMinistry: string;
  targetMinistry: string;
  sourceState: string;
  targetState: string;
  type: MinistryMessageType;
  summary: string;
  requestedAction: string;
  riskLevel?: PlanetRiskLevel;
  automationLevel?: PlanetAutomationLevel;
};

const criticalBlockPatterns = [
  "guaranteed profit",
  "win-rate",
  "risk-free",
  "sure signal",
  "live trading activation",
  "enable live",
  "real money",
  "real-money",
  "billing activation",
  "checkout active",
  "social publishing activation",
  "publish externally now",
  "public launch active",
  "performance fee activation",
  "sharia certified",
  "swiss company status",
  "company name without contract",
];

const productTruthImpact = [
  "live execution remains blocked",
  "real-money routing remains blocked",
  "broker/feed activation remains guarded or unconfigured",
  "billing remains inactive",
  "public launch remains inactive",
  "social publishing remains inactive",
  "secrets remain unexposed",
];

function textForRequest(request: CoordinationRequest) {
  return `${request.title} ${request.summary} ${request.requestedAction} ${request.type}`.toLowerCase();
}

function includesAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern));
}

function uniqueReviewers(reviewers: CoordinationReviewer[]) {
  return Array.from(new Set(reviewers));
}

function outcomeForReviewers(
  reviewers: CoordinationReviewer[],
  fallback: CoordinationDecisionOutcome
): CoordinationDecisionOutcome {
  if (reviewers.includes("Founder Command Room")) return "founder_approval_required";
  if (reviewers.includes("Constitutional Council")) return "constitutional_review_required";
  if (reviewers.includes("Treasury")) return "treasury_review_required";
  if (reviewers.includes("Engineering")) return "engineering_review_required";
  if (reviewers.includes("Guardian")) return "guardian_review_required";
  if (reviewers.includes("Legal Counsel")) return "legal_review_required";

  return fallback;
}

export function evaluatePresidencyCoordinationRequest(
  request: CoordinationRequest
): PresidencyCoordinationDecision {
  const text = textForRequest(request);
  const requiredReviewers: CoordinationReviewer[] = ["Presidency Coordination"];
  const blockedReasons: string[] = [];
  let outcome: CoordinationDecisionOutcome = "auto_route";
  let reason = "Low-risk internal work can be routed through Presidency Coordination.";
  let safeNextStep = "Route as an internal readiness message and keep product truth attached.";
  let constitutionalReviewRequired = false;
  let legislativePolicyRequired = false;
  let executiveImplementationRequired = false;
  let councilDecision: string | null = null;
  let councilBlockerReason: string | null = null;

  if (includesAny(text, criticalBlockPatterns)) {
    outcome = "blocked";
    requiredReviewers.push("Constitutional Council", "Guardian", "Legal Counsel");
    blockedReasons.push(
      "Request conflicts with current Product Truth, Constitution, or Safety Boundaries."
    );
    reason =
      "The request contains activation, certainty, certification, launch, billing, social publishing, or unauthorized brand/company wording that is blocked.";
    safeNextStep =
      "Rewrite as a readiness-only request or defer until a future explicitly approved phase.";
    constitutionalReviewRequired = true;
    councilDecision = "Constitutional Council block";
    councilBlockerReason =
      "Critical actions cannot be activated by ministry request, wording, or Founder preference.";
  } else if (text.includes("vip") || text.includes("pro campaign")) {
    requiredReviewers.push(
      "Legal Counsel",
      "Guardian",
      "Treasury",
      "Founder Command Room"
    );
    outcome = "founder_approval_required";
    reason = "VIP/Pro wording can imply paid access, billing, or premium guarantees.";
    safeNextStep =
      "Route to Legal, Guardian, Treasury, then Founder as readiness-only copy.";
  } else if (text.includes("broker") || text.includes("feed")) {
    requiredReviewers.push("Engineering", "Guardian", "Founder Command Room");
    outcome = "founder_approval_required";
    reason = "Broker/feed readiness affects integration, safety, and execution truth.";
    safeNextStep =
      "Keep as readiness update; do not claim live connection or execution.";
  } else if (text.includes("islamic") || text.includes("sharia")) {
    requiredReviewers.push("Legal Counsel", "Rights & Brand", "Founder Command Room");
    outcome = "founder_approval_required";
    reason = "Islamic account wording is sensitive and not certified by default.";
    safeNextStep = "Use not-certified/review-required wording until real certification exists.";
  } else if (text.includes("community") || text.includes("abuse")) {
    requiredReviewers.push("Guardian", "Support");
    outcome = request.riskLevel === "critical" ? "guardian_review_required" : "review_required";
    reason = "Community incidents require anti-scam, anti-abuse, and support routing.";
    safeNextStep = "Route to Guardian and Support; add Legal if claims or illegal content appear.";
  } else if (
    text.includes("companion") ||
    text.includes("journal") ||
    text.includes("coach")
  ) {
    requiredReviewers.push("Legal Counsel", "Guardian", "AI Brain", "Quality");
    outcome = "review_required";
    reason = "Assistant, journal, and coach behavior must avoid advice, certainty, and pressure.";
    safeNextStep = "Route for policy, safety, AI context, and quality review.";
  } else if (text.includes("education") || text.includes("academy")) {
    requiredReviewers.push("Quality");
    outcome = "auto_route";
    reason = "Educational readiness content may route safely when it avoids claims and advice.";
    safeNextStep = "Send to Academy/Quality as internal educational draft.";
  } else if (text.includes("policy") || text.includes("law")) {
    requiredReviewers.push("Legislative Council", "Executive Council");
    outcome = "review_required";
    reason = "Policy questions require legislative drafting and executive implementation review.";
    safeNextStep = "Draft policy language, then route implementation requirements.";
    legislativePolicyRequired = true;
    executiveImplementationRequired = true;
    councilDecision = "Legislative review required";
  } else if (request.type.endsWith("_review")) {
    outcome = outcomeForReviewers(requiredReviewers, "review_required");
    reason = "Explicit review messages must be routed rather than acted on directly.";
    safeNextStep = "Send through the message ledger and wait for review state.";
  }

  const reviewers = uniqueReviewers(requiredReviewers);
  const finalOutcome =
    outcome === "blocked" ? outcome : outcomeForReviewers(reviewers, outcome);

  return {
    id: `decision-${request.id}`,
    title: request.title,
    decision: finalOutcome,
    outcome: finalOutcome,
    reason,
    requiredReviewers: reviewers,
    blockedReasons,
    safeNextStep,
    founderVisible:
      finalOutcome === "founder_approval_required" ||
      finalOutcome === "blocked" ||
      reviewers.includes("Founder Command Room"),
    userVisible: false,
    auditRequiredLater:
      finalOutcome === "founder_approval_required" || finalOutcome === "blocked",
    productTruthImpact,
    constitutionalReviewRequired,
    legislativePolicyRequired,
    executiveImplementationRequired,
    councilDecision,
    councilBlockerReason,
  };
}

export function getMinistryMessageExample(
  checkedAt = new Date().toISOString()
): MinistryMessage {
  return getMinistryMessageLedgerSnapshot(checkedAt).exampleMessages[0];
}

function decisionExample(
  request: CoordinationRequest
): PresidencyCoordinationDecision {
  return evaluatePresidencyCoordinationRequest(request);
}

export function getCoordinationDecisionExamples() {
  return [
    decisionExample({
      id: "educational-academy-post",
      title: "Educational academy post",
      sourceMinistry: "Academy & Education Ministry",
      targetMinistry: "Media & Communications Ministry",
      sourceState: "Academy State",
      targetState: "Media State",
      type: "content_review",
      summary: "Draft a paper-mode education tip for internal review.",
      requestedAction: "Route safely for education copy.",
      riskLevel: "low",
      automationLevel: "review",
    }),
    decisionExample({
      id: "vip-campaign-copy",
      title: "VIP campaign copy",
      sourceMinistry: "Media & Communications Ministry",
      targetMinistry: "Plans & Subscriptions Ministry",
      sourceState: "Media State",
      targetState: "Plans State",
      type: "plan_review",
      summary: "Prepare VIP campaign copy for future planned capabilities.",
      requestedAction: "Classify reviews before any public use.",
      riskLevel: "high",
      automationLevel: "founder_approval",
    }),
    decisionExample({
      id: "guaranteed-profit-claim",
      title: "Guaranteed profit claim",
      sourceMinistry: "Growth & Conversion Ministry",
      targetMinistry: "Justice / Legal / Compliance Ministry",
      sourceState: "Growth State",
      targetState: "Legal Counsel State",
      type: "legal_review",
      summary: "Use guaranteed profit wording in a campaign.",
      requestedAction: "Approve wording.",
      riskLevel: "critical",
      automationLevel: "blocked",
    }),
    decisionExample({
      id: "live-trading-activation",
      title: "Live trading activation request",
      sourceMinistry: "Markets & Trading Ministry",
      targetMinistry: "Execution & Ticket Ministry",
      sourceState: "Execution State",
      targetState: "Execution State",
      type: "founder_decision_request",
      summary: "Enable live trading activation.",
      requestedAction: "Open live execution.",
      riskLevel: "critical",
      automationLevel: "blocked",
    }),
    decisionExample({
      id: "broker-feed-readiness",
      title: "Broker/feed readiness update",
      sourceMinistry: "Market Data & Feed Ministry",
      targetMinistry: "Engineering & Infrastructure Ministry",
      sourceState: "Feed/Data State",
      targetState: "Integrations State",
      type: "engineering_review",
      summary: "Document broker/feed readiness architecture.",
      requestedAction: "Review integration readiness without activation.",
      riskLevel: "high",
      automationLevel: "founder_approval",
    }),
    decisionExample({
      id: "islamic-account-wording",
      title: "Islamic account wording",
      sourceMinistry: "Special Accounts & Islamic Review Ministry",
      targetMinistry: "Justice / Legal / Compliance Ministry",
      sourceState: "Islamic Review State",
      targetState: "Legal Counsel State",
      type: "legal_review",
      summary: "Review Islamic account wording.",
      requestedAction: "Prevent certification overclaim.",
      riskLevel: "high",
      automationLevel: "founder_approval",
    }),
    decisionExample({
      id: "product-update-media-post",
      title: "Media post about product update",
      sourceMinistry: "Media & Communications Ministry",
      targetMinistry: "Rights & Brand Ministry",
      sourceState: "Media State",
      targetState: "Brand/IP State",
      type: "content_review",
      summary: "Draft product update post for future review.",
      requestedAction: "Check brand and claim safety.",
      riskLevel: "medium",
      automationLevel: "review",
    }),
    decisionExample({
      id: "community-abuse-incident",
      title: "Community abuse incident",
      sourceMinistry: "Community & Culture Ministry",
      targetMinistry: "Guardian & Defense Ministry",
      sourceState: "Community State",
      targetState: "Guardian State",
      type: "incident",
      summary: "Community abuse report requires review.",
      requestedAction: "Route to Guardian and Support.",
      riskLevel: "high",
      automationLevel: "review",
    }),
  ];
}

function count(value: number) {
  return { count: value, truth: "readiness_blueprint_not_real_activity" as const };
}

export function getMinistryCoordinationReadinessFor(
  ministryName: string
): MinistryCoordinationReadiness {
  const normalized = ministryName.toLowerCase();
  const workflowMatches = INTER_MINISTRY_WORKFLOWS.filter((workflow) =>
    workflow.path.some((step) => normalized.includes(step.split(" / ")[0].toLowerCase()))
  );
  const founderApprovalMatches = workflowMatches.filter(
    (workflow) => workflow.founderApprovalRequired
  );
  const blockedMatches = workflowMatches.filter(
    (workflow) => workflow.currentTruth === "blocked_until_future_stage"
  );
  const highestRisk = workflowMatches.some((workflow) => workflow.riskLevel === "critical")
    ? "critical"
    : workflowMatches.some((workflow) => workflow.riskLevel === "high")
    ? "high"
    : workflowMatches.some((workflow) => workflow.riskLevel === "medium")
    ? "medium"
    : "low";

  return {
    incomingRequests: count(workflowMatches.length),
    outgoingRequests: count(workflowMatches.length),
    pendingReviews: count(
      workflowMatches.reduce((total, workflow) => total + workflow.requiredReviews.length, 0)
    ),
    pendingFounderApprovals: count(founderApprovalMatches.length),
    blockedRequests: count(blockedMatches.length),
    escalatedRequests: count(founderApprovalMatches.length),
    completedHandOffs: count(0),
    currentCoordinationLoad:
      workflowMatches.length === 0
        ? "none"
        : highestRisk === "critical"
        ? "blocked"
        : highestRisk === "high"
        ? "medium"
        : "low",
    topCoordinationRisk:
      workflowMatches[0]?.blockedCapabilities[0] ??
      "No live coordination activity; readiness only.",
    nextCoordinationAction:
      workflowMatches[0]?.founderDecisionPoint ??
      "Keep ministry ready to route requests through Founder Presidency.",
  };
}

export function getInterMinistryCoordinationSnapshot(
  checkedAt = new Date().toISOString()
) {
  const workflowSnapshot = getInterMinistryWorkflowSnapshot(checkedAt);
  const ledger = getMinistryMessageLedgerSnapshot(checkedAt);
  const decisions = getCoordinationDecisionExamples();

  return {
    checkedAt,
    mode: "founder_presidency_coordination_system",
    coordinationCenter: "Founder Presidency / Central Coordination System",
    messageContract: ledger.exampleMessages[0],
    messageLedger: ledger,
    workflows: workflowSnapshot.workflows,
    decisions,
    councilIntegration: {
      constitutionalReviewRequired:
        "critical violations, fake claims, launch/billing/live/broker/feed activation, and certification claims",
      legislativePolicyRequired:
        "new plan, community, media, assistant, safety, account, or policy rules",
      executiveImplementationRequired:
        "approved laws that need ministry implementation and reporting",
      criticalOverrideWithoutRemediationAllowed: false,
    },
    summary: {
      workflows: workflowSnapshot.summary.workflows,
      messageTypes: MINISTRY_MESSAGE_TYPES.length,
      messageStates: MINISTRY_MESSAGE_STATES,
      decisionOutcomes: [
        "auto_route",
        "review_required",
        "legal_review_required",
        "guardian_review_required",
        "treasury_review_required",
        "engineering_review_required",
        "founder_approval_required",
        "constitutional_review_required",
        "blocked",
        "archived",
      ],
      pendingReviewCategories: [
        "Legal",
        "Guardian",
        "Treasury",
        "Engineering",
        "Quality",
        "Rights & Brand",
        "Founder",
      ],
      criticalBlockedCategories: [
        "live execution activation",
        "real-money routing",
        "broker/feed activation",
        "billing activation",
        "social publishing",
        "public launch claims",
        "fake VIP claims",
        "fake Islamic/Sharia certification",
        "performance fee activation",
        "uncontracted company/brand use",
        "guaranteed profit or win-rate claims",
      ],
      crossMinistryMustUsePresidency: true,
      realWorkflowExecutionActive: false,
      socialPublishingActive: false,
      productionActivationActive: false,
      secretsExposed: false,
      fakeUsersIncluded: false,
      fakeRevenueIncluded: false,
      fakeMetricsIncluded: false,
    },
  };
}
