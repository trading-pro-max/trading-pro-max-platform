import { runBrandClearanceEngine } from "./engine";

export function getBrandClearanceSnapshot(
  checkedAt = new Date().toISOString()
) {
  return runBrandClearanceEngine(checkedAt);
}

export function getBrandClearanceReadiness(checkedAt = new Date().toISOString()) {
  const snapshot = getBrandClearanceSnapshot(checkedAt);

  return {
    checkedAt,
    status: "ready_with_notes" as const,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExternalCalls: true,
    noDomainPurchase: true,
    noPayments: true,
    noLegalClaims: true,
    publicExposure: false,
    currentNameCount: snapshot.currentNames.length,
    candidateCount: snapshot.candidateShortlist.length,
    trademarkTaskCount: snapshot.trademarkSearchTasks.length,
    domainTaskCount: snapshot.domainSearchTasks.length,
    adoptionStatus: snapshot.adoptionGate.adoptionStatus,
    nextSafeBrandAction: snapshot.nextSafeBrandAction,
  };
}
