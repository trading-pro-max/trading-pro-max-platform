import "server-only";

import type {
  InvisibleOperatingLayerSystem,
  PublicSafeOperatingOutput,
} from "./types";

const hiddenPublicKeys = new Set([
  "product_memory",
  "sovereign_autonomy",
  "codex_governance",
  "security_sovereignty",
  "secrets_authority",
]);

export function mapInvisibleSystemToPublicOutput(
  system: InvisibleOperatingLayerSystem
): PublicSafeOperatingOutput | null {
  if (!system.visibleToPublicUsers || hiddenPublicKeys.has(system.key)) return null;
  if (!system.publicLabel || !system.publicOutput) return null;

  return {
    key: system.key,
    publicLabel: system.publicLabel,
    publicOutput: system.publicOutput,
    status: system.status === "hidden" ? "readiness_only" : system.status,
  };
}

export function mapInvisibleSystemsToPublicOutputs(
  systems: InvisibleOperatingLayerSystem[]
) {
  return systems
    .map((system) => mapInvisibleSystemToPublicOutput(system))
    .filter((item): item is PublicSafeOperatingOutput => Boolean(item));
}
