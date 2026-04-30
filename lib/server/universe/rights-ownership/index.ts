import "server-only";

export type RightsStatus =
  | "repo_owned"
  | "private_internal"
  | "unknown_source_blocked_public"
  | "legal_review_required"
  | "future_gate";

export type RightsLedgerEntry = {
  id: string;
  entity: string;
  assetType: "code" | "document" | "report" | "visual" | "brand" | "route" | "test";
  sourceEvidence: string;
  rightsStatus: RightsStatus;
  publicUseVerdict: string;
  productTruthImpact: string;
  nextAction: string;
};

const RIGHTS_LEDGER: RightsLedgerEntry[] = [
  {
    id: "repo_source_code",
    entity: "Application and universe source code",
    assetType: "code",
    sourceEvidence: "Current Git repository history and authored local source.",
    rightsStatus: "repo_owned",
    publicUseVerdict: "Private internal use allowed; public release remains gated.",
    productTruthImpact: "Product Truth overrides ownership claims.",
    nextAction: "Keep provenance in Git and avoid committing secrets.",
  },
  {
    id: "docs_reports",
    entity: "Al-Kawn product docs and reports",
    assetType: "document",
    sourceEvidence: "Created in repo as private founder documentation.",
    rightsStatus: "repo_owned",
    publicUseVerdict: "Private use allowed; legal/public copy review required before public use.",
    productTruthImpact: "No legal status or ownership overreach may be claimed.",
    nextAction: "Maintain report and doc paths for evidence.",
  },
  {
    id: "visual_tokens",
    entity: "Swiss-luxury living visual tokens",
    assetType: "visual",
    sourceEvidence: "Code-only CSS tokens; no generated images and no unknown-source public assets.",
    rightsStatus: "repo_owned",
    publicUseVerdict: "Private UI use allowed; official Swiss endorsement is not claimed.",
    productTruthImpact: "Swiss-inspired precision, not official Swiss endorsement.",
    nextAction: "Keep visuals code-only unless rights are proven.",
  },
  {
    id: "brand_names",
    entity: "Al-Kawn, ALKON, Pro Max, Earth Planet naming",
    assetType: "brand",
    sourceEvidence: "Internal working names and private product doctrine.",
    rightsStatus: "legal_review_required",
    publicUseVerdict: "Trademark/legal review required before public brand adoption.",
    productTruthImpact: "No global ownership claim is allowed.",
    nextAction: "Stop public brand adoption for Ahmad/legal review.",
  },
  {
    id: "unknown_source_assets",
    entity: "Unknown-source assets",
    assetType: "visual",
    sourceEvidence: "No approved public asset source in this mission.",
    rightsStatus: "unknown_source_blocked_public",
    publicUseVerdict: "Unknown-source items are blocked from public use.",
    productTruthImpact: "Product Truth blocks public use without evidence.",
    nextAction: "Use code-only visuals or approved assets with evidence.",
  },
];

export function getAlKawnOwnershipRegistry() {
  return {
    title: "Rights & Ownership Core",
    requiredWording: [
      "Every entity inside الكون must have ownership and source evidence.",
      "Unknown-source items are blocked from public use.",
      "No global ownership claim is allowed.",
      "Trademark/legal review is required before public brand adoption.",
      "Product Truth overrides ownership claims.",
    ],
    entries: RIGHTS_LEDGER,
    nextAction: getRightsNextAction(),
  };
}

export function getAlKawnRightsLedger() {
  return RIGHTS_LEDGER;
}

export function getAlKawnIPEvidence() {
  return RIGHTS_LEDGER.map((entry) => ({
    entity: entry.entity,
    evidence: entry.sourceEvidence,
    status: entry.rightsStatus,
  }));
}

export function getAssetRightsRegistry() {
  return RIGHTS_LEDGER.filter((entry) => entry.assetType === "visual");
}

export function getCodeProvenanceRegistry() {
  return RIGHTS_LEDGER.filter((entry) => entry.assetType === "code");
}

export function getDocumentRightsRegistry() {
  return RIGHTS_LEDGER.filter((entry) =>
    ["document", "report", "test"].includes(entry.assetType),
  );
}

export function getBrandRightsStatus() {
  return {
    status: "legal_review_required" as const,
    publicUse: "blocked_until_review",
    note: "Trademark/legal review is required before public brand adoption.",
  };
}

export function getLicensingPolicy() {
  return {
    privateUse: "allowed_inside_ahmad_private_devices",
    publicUse: "blocked_until_rights_and_legal_review",
    unknownSource: "blocked_from_public_use",
    officialSwissSymbols: "not_used",
  };
}

export function getPublicUseGate() {
  return {
    status: "blocked" as const,
    rule: "No public use without source evidence, legal review where needed, and Product Truth approval.",
  };
}

export function getRightsNextAction() {
  return "Keep all Al-Kawn entities private and evidence-backed until Ahmad/legal review allows a public-use path.";
}
