import "server-only";

import type {
  MinistryMessage,
  MinistryMessageState,
  MinistryMessageType,
  PlanetAutomationLevel,
  PlanetRiskLevel,
} from "./types";

export const MINISTRY_MESSAGE_TYPES: MinistryMessageType[] = [
  "status_update",
  "request",
  "review_required",
  "approval_needed",
  "warning",
  "incident",
  "handoff",
  "blocker",
  "escalation",
  "resolution",
  "policy_question",
  "content_review",
  "plan_review",
  "security_review",
  "legal_review",
  "engineering_review",
  "treasury_review",
  "founder_decision_request",
];

export const MINISTRY_MESSAGE_STATES: MinistryMessageState[] = [
  "draft",
  "sent",
  "received",
  "in_review",
  "waiting_for_response",
  "requires_revision",
  "approved",
  "rejected",
  "blocked",
  "escalated",
  "resolved",
  "archived",
];

const productTruth: MinistryMessage["productTruth"] = {
  liveExecution: "blocked",
  realMoneyRouting: "blocked",
  brokerFeedActivation: "not_configured",
  billing: "inactive",
  publicLaunch: "inactive",
  socialPublishing: "inactive",
  secrets: "not_exposed",
};

export type MinistryMessageInput = {
  messageId: string;
  sourceMinistry: string;
  targetMinistry: string;
  sourceState: string;
  targetState: string;
  type: MinistryMessageType;
  priority: MinistryMessage["priority"];
  riskLevel: PlanetRiskLevel;
  automationLevel: PlanetAutomationLevel;
  summary: string;
  requestedAction: string;
  guardianReviewRequired?: boolean;
  legalReviewRequired?: boolean;
  treasuryReviewRequired?: boolean;
  engineeringReviewRequired?: boolean;
  founderApprovalRequired?: boolean;
  constitutionalReviewRequired?: boolean;
  legislativePolicyRequired?: boolean;
  executiveImplementationRequired?: boolean;
  councilDecision?: string | null;
  councilBlockerReason?: string | null;
  status?: MinistryMessageState;
  safetyBoundary?: MinistryMessage["safetyBoundary"];
  reasonIfBlocked?: string | null;
};

export function createMinistryMessage(
  input: MinistryMessageInput,
  checkedAt = new Date().toISOString()
): MinistryMessage {
  return {
    messageId: input.messageId,
    sourceMinistry: input.sourceMinistry,
    targetMinistry: input.targetMinistry,
    sourceState: input.sourceState,
    targetState: input.targetState,
    coordinationCenter: "Founder Presidency / Central Coordination System",
    type: input.type,
    priority: input.priority,
    riskLevel: input.riskLevel,
    automationLevel: input.automationLevel,
    summary: input.summary,
    requestedAction: input.requestedAction,
    guardianReviewRequired: input.guardianReviewRequired ?? false,
    legalReviewRequired: input.legalReviewRequired ?? false,
    treasuryReviewRequired: input.treasuryReviewRequired ?? false,
    engineeringReviewRequired: input.engineeringReviewRequired ?? false,
    founderApprovalRequired: input.founderApprovalRequired ?? false,
    constitutionalReviewRequired: input.constitutionalReviewRequired ?? false,
    legislativePolicyRequired: input.legislativePolicyRequired ?? false,
    executiveImplementationRequired: input.executiveImplementationRequired ?? false,
    councilDecision: input.councilDecision ?? null,
    councilBlockerReason: input.councilBlockerReason ?? null,
    status: input.status ?? "draft",
    createdAt: checkedAt,
    updatedAt: checkedAt,
    resolvedAt: null,
    productTruth,
    safetyBoundary: input.safetyBoundary ?? "review_required",
    reasonIfBlocked: input.reasonIfBlocked ?? null,
  };
}

export function getMinistryMessageLedgerSnapshot(
  checkedAt = new Date().toISOString()
) {
  const exampleMessages = [
    createMinistryMessage(
      {
        messageId: "msg-presidency-0001",
        sourceMinistry: "Media & Communications Ministry",
        targetMinistry: "Justice / Legal / Compliance Ministry",
        sourceState: "Media State",
        targetState: "Legal Counsel State",
        type: "content_review",
        priority: "high",
        riskLevel: "high",
        automationLevel: "founder_approval",
        summary: "Review a future Pro/VIP campaign draft before any public use.",
        requestedAction: "Classify claims and return safe wording guidance.",
        guardianReviewRequired: true,
        legalReviewRequired: true,
        treasuryReviewRequired: true,
        founderApprovalRequired: true,
        constitutionalReviewRequired: false,
      },
      checkedAt
    ),
    createMinistryMessage(
      {
        messageId: "msg-presidency-0002",
        sourceMinistry: "Ops Health & Reliability Ministry",
        targetMinistry: "Engineering & Infrastructure Ministry",
        sourceState: "Production Blockers State",
        targetState: "Platform Engineering State",
        type: "blocker",
        priority: "critical",
        riskLevel: "critical",
        automationLevel: "blocked",
        summary: "Production activation is outside the current verified phase.",
        requestedAction: "Keep activation blocked and list future gates.",
        guardianReviewRequired: true,
        legalReviewRequired: true,
        engineeringReviewRequired: true,
        founderApprovalRequired: true,
        constitutionalReviewRequired: true,
        councilDecision: "Constitutional Council blocks early activation.",
        councilBlockerReason: "Public launch and production activation are last-stage actions.",
        status: "blocked",
        safetyBoundary: "blocked",
        reasonIfBlocked:
          "Current baseline forbids production, live execution, billing, broker/feed, and public launch.",
      },
      checkedAt
    ),
  ];

  return {
    checkedAt,
    mode: "ministry_message_ledger_readiness",
    messageTypes: MINISTRY_MESSAGE_TYPES,
    messageStates: MINISTRY_MESSAGE_STATES,
    exampleMessages,
    truth: {
      realMessageQueueActive: false,
      privateUserDataIncluded: false,
      secretsIncluded: false,
      fakeActivityMetricsIncluded: false,
    },
  };
}
