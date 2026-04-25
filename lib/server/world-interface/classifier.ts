import "server-only";

import type {
  WorldInterfaceClassification,
  WorldInterfaceClassifierOutcome,
  WorldInterfaceEventInput,
  WorldInterfaceEventType,
  WorldInterfaceQuarantineReason,
} from "./types";

export const worldInterfaceEventTypes: WorldInterfaceEventType[] = [
  "email_received",
  "support_request",
  "partner_request",
  "media_request",
  "vip_interest",
  "institutional_interest",
  "social_comment",
  "social_dm",
  "brand_impersonation",
  "security_alert",
  "legal_notice",
  "public_complaint",
  "content_opportunity",
  "scam_attempt",
];

export const worldInterfaceClassifierOutcomes: WorldInterfaceClassifierOutcome[] = [
  "classify",
  "draft_reply",
  "review_required",
  "founder_approval_required",
  "quarantine",
  "blocked",
  "archive",
];

export const worldInterfaceQuarantineReasons: WorldInterfaceQuarantineReason[] = [
  "scam",
  "phishing",
  "suspicious_links",
  "impersonation",
  "fake_partnership",
  "threats",
  "secret_requests",
];

function baseClassification(
  input: WorldInterfaceEventInput,
  outcome: WorldInterfaceClassifierOutcome,
  reason: string,
  createdAt: string
): WorldInterfaceClassification {
  return {
    eventId: input.eventId,
    type: input.type,
    sourceChannel: input.sourceChannel,
    outcome,
    reason,
    quarantineReasons: [],
    requiredReviews: ["Guardian"],
    founderApprovalRequired: false,
    safeDraftType: "none",
    externalActionAllowed: false,
    createdAt,
  };
}

export function classifyWorldInterfaceEvent(
  input: WorldInterfaceEventInput,
  createdAt = new Date().toISOString()
): WorldInterfaceClassification {
  const quarantineReasons: WorldInterfaceQuarantineReason[] = [];
  const normalized = input.summary.toLowerCase();

  if (input.type === "scam_attempt" || /\bscam\b/.test(normalized)) {
    quarantineReasons.push("scam");
  }
  if (input.containsLink || /\b(phishing|suspicious link|click here)\b/.test(normalized)) {
    quarantineReasons.push("phishing", "suspicious_links");
  }
  if (input.impersonationRisk || input.type === "brand_impersonation") {
    quarantineReasons.push("impersonation");
  }
  if (input.claimsPartnership || /\bpartner(ship)? claim\b/.test(normalized)) {
    quarantineReasons.push("fake_partnership");
  }
  if (input.threatRisk || /\b(threat|blackmail|extort)\b/.test(normalized)) {
    quarantineReasons.push("threats");
  }
  if (input.asksForSecrets || /\b(secret|api key|token|password|credential)\b/.test(normalized)) {
    quarantineReasons.push("secret_requests");
  }

  if (quarantineReasons.length > 0) {
    return {
      ...baseClassification(
        input,
        "quarantine",
        "Suspicious, impersonation, threat, fake partnership, phishing, or secret-request risk must be quarantined.",
        createdAt
      ),
      quarantineReasons: [...new Set(quarantineReasons)],
      requiredReviews: ["Security", "Guardian", "Legal"],
      founderApprovalRequired:
        quarantineReasons.includes("impersonation") ||
        quarantineReasons.includes("fake_partnership") ||
        quarantineReasons.includes("threats"),
      safeDraftType: "blocked_reply",
    };
  }

  if (input.type === "legal_notice" || input.legalRisk) {
    return {
      ...baseClassification(
        input,
        "review_required",
        "Legal notices require Legal review before any response draft can be used.",
        createdAt
      ),
      requiredReviews: ["Legal", "Founder"],
      safeDraftType: "legal_review_required",
    };
  }

  if (input.type === "security_alert" || input.securityRisk) {
    return {
      ...baseClassification(
        input,
        "review_required",
        "Security alerts require Security and Guardian review before action.",
        createdAt
      ),
      requiredReviews: ["Security", "Guardian", "Founder"],
      safeDraftType: "blocked_reply",
    };
  }

  if (input.type === "partner_request") {
    return {
      ...baseClassification(
        input,
        "founder_approval_required",
        "Partnership requests can create legal, brand, and trust risk.",
        createdAt
      ),
      requiredReviews: ["Legal", "Guardian", "Founder"],
      founderApprovalRequired: true,
      safeDraftType: "partnership_draft",
    };
  }

  if (input.type === "media_request") {
    return {
      ...baseClassification(
        input,
        "review_required",
        "Media responses require Legal, Guardian, and Founder review before external use.",
        createdAt
      ),
      requiredReviews: ["Media", "Legal", "Guardian", "Founder"],
      founderApprovalRequired: true,
      safeDraftType: "media_draft",
    };
  }

  if (input.type === "vip_interest" || input.type === "institutional_interest") {
    return {
      ...baseClassification(
        input,
        "review_required",
        "VIP and Institutional interest is classification-only and cannot claim activation.",
        createdAt
      ),
      requiredReviews: ["Guardian", "Founder"],
      founderApprovalRequired: true,
      safeDraftType: "auto_acknowledgement_draft",
    };
  }

  if (input.type === "support_request" || input.type === "email_received") {
    return {
      ...baseClassification(
        input,
        "draft_reply",
        "Safe support or email request can receive an acknowledgement draft only.",
        createdAt
      ),
      requiredReviews: ["Support", "Quality"],
      safeDraftType: "support_draft",
    };
  }

  if (input.type === "content_opportunity") {
    return {
      ...baseClassification(
        input,
        "draft_reply",
        "Content opportunities may become internal drafts only; no publishing is enabled.",
        createdAt
      ),
      requiredReviews: ["Media", "Legal"],
      safeDraftType: "auto_acknowledgement_draft",
    };
  }

  return baseClassification(
    input,
    "classify",
    "Event is classified for later review; no external action is allowed.",
    createdAt
  );
}
