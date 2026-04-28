import type { BrandCandidate } from "./types";

export const currentNameAssessments: BrandCandidate[] = [
  {
    id: "current_name_pro_max",
    name: "Pro Max",
    source: "current_working_name",
    useStatus: "working_name_only",
    decision: "working_name_only",
    riskLevel: "high",
    publicUseAllowed: true,
    globalLaunchAllowed: false,
    reasons: [
      "Generic words",
      "Widely used naming pattern",
      "Dell Pro Max usage creates trademark conflict risk",
      "Apple iPhone Pro Max mental association risk",
      "Weak exclusivity for a global public brand",
    ],
    internalSafeUsage: "May remain a working public product label until a cleared final brand exists.",
    nextSafeAction:
      "Keep Pro Max as a working name only and begin manual trademark/domain/conflict review before launch.",
    ahmadApprovalRequired: true,
  },
  {
    id: "current_name_pro_max_trading",
    name: "Pro Max Trading",
    source: "current_product_name",
    useStatus: "working_product_name_only",
    decision: "needs_search",
    riskLevel: "high",
    riskLabel: "medium_high",
    publicUseAllowed: true,
    globalLaunchAllowed: false,
    reasons: [
      "Contains Pro Max",
      "Trading is descriptive",
      "Needs clearance before public/global launch",
    ],
    internalSafeUsage: "May remain the first paper-safe working product name.",
    nextSafeAction:
      "Run brand clearance tasks before treating Pro Max Trading as a final public product name.",
    ahmadApprovalRequired: true,
  },
  {
    id: "current_name_alkon",
    name: "Alkon",
    source: "private_internal_name",
    useStatus: "private_internal_name",
    decision: "accept_for_internal_use",
    riskLevel: "high",
    riskLabel: "medium_high_if_public",
    publicUseAllowed: false,
    globalLaunchAllowed: false,
    reasons: [
      "Existing Alkon usage must be checked before any public use",
      "Alcon similarity may create confusion risk",
      "Private Alkon value is preserved by keeping it internal",
    ],
    internalSafeUsage: "Private Founder universe only.",
    nextSafeAction: "Keep Alkon private unless Ahmad orders a separate clearance review.",
    ahmadApprovalRequired: true,
  },
  {
    id: "current_name_alkon_minus_zero",
    name: "Alkon -0",
    source: "private_internal_name",
    useStatus: "private_internal_only",
    decision: "accept_for_internal_use",
    riskLevel: "critical",
    publicUseAllowed: false,
    globalLaunchAllowed: false,
    reasons: [
      "Private Origin identity",
      "Public use is forbidden by boundary law",
      "Must not appear as a public brand",
    ],
    internalSafeUsage: "Private Founder-only origin label.",
    nextSafeAction: "Never migrate Alkon -0 into public naming.",
    ahmadApprovalRequired: true,
  },
];

export function getCurrentNameAssessments() {
  return currentNameAssessments;
}

export function getCurrentNameAssessmentSummary() {
  return {
    proMax: currentNameAssessments[0],
    proMaxTrading: currentNameAssessments[1],
    alkon: currentNameAssessments[2],
    alkonMinusZero: currentNameAssessments[3],
    nextSafeAction:
      "Create, screen, legally review, and Ahmad-approve a final global public brand before any global launch.",
  };
}
