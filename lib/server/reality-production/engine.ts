import { selectRealityProductionBuilder } from "./builder-selection";
import { createRealityProductionPassport } from "./command-passport";
import { buildRealityProductionEvidenceChain } from "./evidence-chain";
import { REALITY_PRODUCTION_BUILDERS } from "./builder-registry";
import { REALITY_PRODUCTION_MEMORY } from "./memory";
import { decideRealityProductionNextFate } from "./next-fate";
import { decideRightToAppear } from "./right-to-appear";
import { decideRightToBuild } from "./right-to-build";
import { decideRightToExist } from "./right-to-exist";
import { judgeRealityProduction } from "./tribunal";
import type { RealityProductionSignal } from "./types";

export const REALITY_PRODUCTION_SIGNALS: RealityProductionSignal[] = [
  {
    signalId: "alkon_a_z_operating_roadmap",
    type: "founder_command",
    title: "Alkon A-Z Operating Execution Roadmap",
    meaning: "Unifies path, devices, local builder, production, correction, reporting, gates, and proof.",
    publicVisible: false,
    sensitive: true,
  },
];

export function runRealityProduction() {
  const signal = REALITY_PRODUCTION_SIGNALS[0];

  return {
    signals: REALITY_PRODUCTION_SIGNALS,
    gates: [decideRightToExist(signal), decideRightToBuild(), decideRightToAppear()],
    builders: REALITY_PRODUCTION_BUILDERS,
    selectedBuilder: selectRealityProductionBuilder(),
    passport: createRealityProductionPassport(),
    evidence: buildRealityProductionEvidenceChain(),
    tribunal: judgeRealityProduction(),
    memory: REALITY_PRODUCTION_MEMORY,
    nextFate: decideRealityProductionNextFate(),
  };
}

