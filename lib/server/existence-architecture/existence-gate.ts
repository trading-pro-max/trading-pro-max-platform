import type { JarId } from "@/lib/server/jar-build";
import type {
  ExistenceDecision,
  ExistenceEntity,
  ExistenceGateResult,
} from "./types";

export function decideExistenceGate(
  entity: ExistenceEntity,
  missingAnswers: string[] = [],
  jarId: JarId
): ExistenceGateResult {
  const reasons: string[] = [];
  let decision: ExistenceDecision = "allowed";

  if (entity.risk.level === "p0" || entity.nextFate === "black_hole") {
    decision = "black_hole";
    reasons.push("Entity carries P0 or black-hole risk and cannot enter execution.");
  } else if (entity.lifecycle === "blocked" || entity.nextFate === "block") {
    decision = "block";
    reasons.push("Entity is blocked until Ahmad or Reality Trial changes its state.");
  } else if (entity.owner === "unknown_needs_ahmad") {
    decision = "needs_ahmad";
    reasons.push("Entity owner is unknown and requires Ahmad classification.");
  } else if (entity.visibility === "unknown") {
    decision = "needs_classification";
    reasons.push("Entity visibility is unknown and must move through Jar or Inbox.");
  } else if (!entity.boundary.noExecution || !entity.boundary.noShell || !entity.boundary.noCodex) {
    decision = "needs_boundary";
    reasons.push("Entity boundary is not safe enough for ALKON existence.");
  } else if (entity.evidence.status === "missing" || missingAnswers.length > 0) {
    decision = "needs_evidence";
    reasons.push("Entity lacks evidence or complete existence answers.");
  } else if (entity.requiresAhmad) {
    decision = "needs_ahmad";
    reasons.push("Entity is structurally valid but requires Ahmad final decision.");
  } else if (
    entity.lifecycle === "active_with_notes" ||
    entity.lifecycle === "cleanup_candidate" ||
    entity.nextFate === "improve" ||
    entity.nextFate === "move" ||
    entity.nextFate === "merge"
  ) {
    decision = "allowed_with_notes";
    reasons.push("Entity may exist with notes and a known next fate.");
  } else {
    reasons.push("Entity has owner, purpose, boundary, evidence, lifecycle, and next fate.");
  }

  return {
    entityId: entity.id,
    allowed: decision === "allowed" || decision === "allowed_with_notes",
    decision,
    reasons,
    jarId,
  };
}
