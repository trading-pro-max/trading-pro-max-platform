import { createSelfCorrectionPassport } from "./command-passport";
import { getSelfCorrectionDailyLoop } from "./daily-loop";
import { buildSelfCorrectionEvidenceChain } from "./evidence-chain";
import { getReturnToHeartInstruction } from "./return-to-heart";
import { diagnoseSelfCorrectionSignals } from "./self-diagnosis";
import { SELF_CORRECTION_MEMORY } from "./self-memory";
import { SELF_CORRECTION_PRIORITY, prioritizeSelfCorrection } from "./self-prioritization";

export function runSelfCorrection() {
  const signals = prioritizeSelfCorrection(diagnoseSelfCorrectionSignals());

  return {
    signals,
    priorityOrder: SELF_CORRECTION_PRIORITY,
    returnToHeart: getReturnToHeartInstruction(),
    passport: createSelfCorrectionPassport(),
    evidence: buildSelfCorrectionEvidenceChain(),
    memory: SELF_CORRECTION_MEMORY,
    dailyLoop: getSelfCorrectionDailyLoop(),
    nextAction: "Ask Ahmad for visual review, then apply only focused correction if rejected.",
  };
}

