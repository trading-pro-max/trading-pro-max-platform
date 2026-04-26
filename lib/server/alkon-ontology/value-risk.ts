import type { AlkonEntity, EntityValueDimension, EntityValueRiskReport } from "./types";

function average(values: number[]) {
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function sortedDimensions(entity: AlkonEntity, direction: "asc" | "desc") {
  return (Object.entries(entity.valueScore) as Array<[EntityValueDimension, number]>)
    .sort((left, right) =>
      direction === "asc" ? left[1] - right[1] : right[1] - left[1]
    )
    .slice(0, 2)
    .map(([dimension]) => dimension);
}

function riskNumber(entity: AlkonEntity, kind: keyof EntityValueRiskReport["riskSummary"]) {
  const base =
    entity.riskLevel === "black_hole"
      ? 10
      : entity.riskLevel === "blocked"
        ? 9
        : entity.riskLevel === "founder_approval_required"
          ? 7
          : entity.riskLevel === "review_required"
            ? 5
            : 2;

  if (kind === "publicLeakRisk" && entity.world === "private_alkon") return base + 1;
  if (kind === "secretRisk" && /secret|security/i.test(entity.name)) return base + 2;
  if (kind === "fakeClaimRisk" && /plans|apps|launch|support|community/i.test(entity.name)) return base + 1;
  if (kind === "authSecurityRisk" && /founder|security|secret/i.test(entity.name)) return base + 2;
  if (kind === "visualClutterRisk" && /home|workspace|chart|identity/i.test(entity.name)) return base + 1;
  if (kind === "productTruthRisk" && /truth|plans|launch|billing|workspace/i.test(entity.name)) return base + 1;
  if (kind === "launchActivationRisk" && /launch|billing|broker|live/i.test(entity.name)) return base + 2;
  if (kind === "maintenanceComplexity" && entity.dependencies.length > 4) return base + 1;

  return Math.min(base, 10);
}

export function scoreEntityValueRisk(entity: AlkonEntity): EntityValueRiskReport {
  const averageValue = average(Object.values(entity.valueScore));
  const riskSummary = {
    publicLeakRisk: Math.min(riskNumber(entity, "publicLeakRisk"), 10),
    secretRisk: Math.min(riskNumber(entity, "secretRisk"), 10),
    fakeClaimRisk: Math.min(riskNumber(entity, "fakeClaimRisk"), 10),
    authSecurityRisk: Math.min(riskNumber(entity, "authSecurityRisk"), 10),
    visualClutterRisk: Math.min(riskNumber(entity, "visualClutterRisk"), 10),
    productTruthRisk: Math.min(riskNumber(entity, "productTruthRisk"), 10),
    launchActivationRisk: Math.min(riskNumber(entity, "launchActivationRisk"), 10),
    maintenanceComplexity: Math.min(riskNumber(entity, "maintenanceComplexity"), 10),
  };
  const highestRisk = Math.max(...Object.values(riskSummary));
  const recommendedAction =
    entity.riskLevel === "black_hole"
      ? "block"
      : highestRisk >= 8
        ? "quarantine"
        : highestRisk >= 6
          ? "review"
          : averageValue < 5
            ? "improve"
            : "keep";

  return {
    entityId: entity.entityId,
    valueSummary: {
      averageValue,
      strongestDimensions: sortedDimensions(entity, "desc"),
      weakestDimensions: sortedDimensions(entity, "asc"),
    },
    riskSummary,
    recommendedAction,
    priority:
      recommendedAction === "block" || recommendedAction === "quarantine"
        ? "P0"
        : recommendedAction === "review"
          ? "P1"
          : recommendedAction === "improve"
            ? "P2"
            : "P3",
  };
}

export function scoreEntitiesValueRisk(entities: AlkonEntity[]) {
  return entities.map(scoreEntityValueRisk);
}
