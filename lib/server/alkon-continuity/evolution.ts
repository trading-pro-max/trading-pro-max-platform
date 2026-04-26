import type {
  AlkonEntityBirthCandidate,
  AlkonEntityEvolution,
  AlkonEntityIdentity,
} from "./types";

export function createAlkonEntityEvolutionRule(
  candidate: AlkonEntityBirthCandidate,
  identity: AlkonEntityIdentity
): AlkonEntityEvolution {
  const text = candidate.proposedName.toLowerCase();

  if (text.includes("image")) {
    return {
      entityId: identity.entityId,
      evolutionRule: "Image and raster work requires explicit Founder request before any future task is drafted.",
      appliesTo: ["visual identity", "public UI", "Codex prompt drafting"],
      requiredTest: "source scan for raster assets and image generation references",
      futureGuard: "Block image creation by default.",
      founderApprovalNeeded: true,
    };
  }

  if (text.includes("chart") || text.includes("workspace")) {
    return {
      entityId: identity.entityId,
      evolutionRule: "Chart and workspace changes require chart-first proof and no duplicate shell regression.",
      appliesTo: ["Trading Workspace", "Living Market Core", "shell navigation"],
      requiredTest: "workspace screenshot and public-nav absence test",
      futureGuard: "Chart remains king; no public nav inside workspace.",
      founderApprovalNeeded: true,
    };
  }

  if (identity.world === "private_alkon") {
    return {
      entityId: identity.entityId,
      evolutionRule: "Private Alkon entities require public no-leak proof before acceptance.",
      appliesTo: ["Founder Command", "Alkon private systems", "read-only APIs"],
      requiredTest: "public forbidden-term leak test",
      futureGuard: "Never expose private command language publicly.",
      founderApprovalNeeded: true,
    };
  }

  return {
    entityId: identity.entityId,
    evolutionRule: "Every accepted entity must keep owner, function, proof, memory, and Product Truth connected.",
    appliesTo: [identity.category, identity.world],
    requiredTest: "continuity regression",
    futureGuard: "Reject anonymous, ownerless, memoryless, or unvalidated entities.",
    founderApprovalNeeded: false,
  };
}
