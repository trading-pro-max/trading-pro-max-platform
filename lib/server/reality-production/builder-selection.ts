import { REALITY_PRODUCTION_BUILDERS } from "./builder-registry";

export function selectRealityProductionBuilder() {
  return REALITY_PRODUCTION_BUILDERS.find((builder) => builder.builderId === "codex")!;
}

