import type { InfiniteGovernedEvolution } from "./types";

export const KERNEL_ALLOWED_EVOLUTION = [
  "detect gaps",
  "classify gaps",
  "command passports",
  "validation",
  "memory",
  "UX improvement",
  "Assistant improvement",
  "Workspace improvement",
  "tests",
  "docs",
  "safety",
  "evidence",
];

export const KERNEL_FORBIDDEN_EVOLUTION_WITHOUT_GATES = [
  "public launch",
  "billing",
  "broker/feed",
  "live execution",
  "real money",
  "social publishing",
  "regulated financial services",
  "payment execution",
  "secrets exposure",
  "public Alkon",
];

export function getInfiniteGovernedEvolution(): InfiniteGovernedEvolution {
  return {
    evolutionStatus: "active_with_notes",
    allowedEvolution: KERNEL_ALLOWED_EVOLUTION,
    forbiddenWithoutGates: KERNEL_FORBIDDEN_EVOLUTION_WITHOUT_GATES,
    publicExposure: false,
  };
}
