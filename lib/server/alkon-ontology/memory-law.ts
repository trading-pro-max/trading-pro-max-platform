import type { AlkonEntity, EntityMemoryReport } from "./types";

export const ENTITY_MEMORY_RULES = [
  "no generated images unless explicitly requested",
  "no raster assets",
  "public Alkon leak forbidden",
  "logo old versions rejected",
  "chart annoyance history",
  "duplicate topbar issue",
  "Free must be complete",
  "Pro/VIP must be functional realms, not only colors",
  "public Home must not be overcrowded",
  "Assistant must not expose internals",
  "no fake activation",
  "no fake claims",
];

export function evaluateEntityMemory(entity: AlkonEntity): EntityMemoryReport {
  const globalRules = ENTITY_MEMORY_RULES.filter((rule) =>
    /no generated images|no raster assets/i.test(rule)
  );
  const contextualRules = ENTITY_MEMORY_RULES.filter((rule) => {
    const text = `${entity.name} ${entity.type} ${entity.purpose} ${entity.memoryRule}`;

    if (/Assistant|intent/i.test(text)) return /Assistant/i.test(rule);
    if (/image|raster|logo|visual|earth|brand/i.test(text)) {
      return /image|raster|logo/i.test(rule);
    }
    if (/chart|workspace|topbar|shell/i.test(text)) {
      return /chart|topbar/i.test(rule);
    }
    if (/Free|Pro|VIP|plan|realm/i.test(text)) {
      return /Free|Pro\/VIP/i.test(rule);
    }
    if (/Home/i.test(text)) return /Home/i.test(rule);
    if (/Alkon|Founder|private|boundary/i.test(text)) return /Alkon/i.test(rule);
    if (/activation|billing|launch|apps|support|community/i.test(text)) {
      return /fake/i.test(rule);
    }

    return /fake claims|public Alkon/i.test(rule);
  });
  const appliedRules = Array.from(new Set([...globalRules, ...contextualRules]));

  return {
    entityId: entity.entityId,
    status: entity.memoryRule ? "memory_ready" : "missing_memory",
    appliedRules: appliedRules.length > 0 ? appliedRules : ["no fake claims"],
    repeatedMistakesPrevented: [
      "public private leakage",
      "fake activation",
      "clutter without owner",
      "accepted work without validation",
    ],
    founderPreferences: [
      "code-only visuals",
      "chart remains first",
      "Alkon remains private",
    ],
    futureRules: [
      "require validation before acceptance",
      "require memory update for repeated issues",
      "require Founder review for sensitive changes",
    ],
  };
}

export function evaluateEntitiesMemory(entities: AlkonEntity[]) {
  return entities.map(evaluateEntityMemory);
}
