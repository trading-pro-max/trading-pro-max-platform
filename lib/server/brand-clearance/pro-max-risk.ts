import type { BrandCandidate } from "./types";

export const proMaxRiskStatus: BrandCandidate & {
  status: "working_name_only";
  finalBrandApproved: false;
  publicLaunchAllowed: false;
  reasonDetail: string[];
} = {
  id: "current_name_pro_max",
  name: "Pro Max",
  source: "current_working_name",
  useStatus: "working_name_only",
  status: "working_name_only",
  decision: "working_name_only",
  riskLevel: "high",
  publicUseAllowed: true,
  globalLaunchAllowed: false,
  finalBrandApproved: false,
  publicLaunchAllowed: false,
  reasons: [
    "Generic words",
    "Heavy market use",
    "Likely conflicts",
    "Dell Pro Max conflict risk",
    "Apple Pro Max association risk",
    "Weak exclusive ownership potential",
  ],
  reasonDetail: [
    "generic words",
    "heavy market use",
    "likely conflicts",
    "Dell Pro Max conflict risk",
    "Apple Pro Max association risk",
    "weak exclusive ownership potential",
  ],
  internalSafeUsage:
    "May remain a working development and public-facing label only until a cleared final brand exists.",
  nextSafeAction:
    "Keep Pro Max as working name only; choose/search candidate names before any global public launch.",
  ahmadApprovalRequired: true,
  clearanceStatus: "search_required",
};

export function getProMaxRiskStatus() {
  return proMaxRiskStatus;
}
