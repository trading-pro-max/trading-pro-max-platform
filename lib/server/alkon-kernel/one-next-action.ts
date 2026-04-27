import type { OneNextActionDecision } from "./types";

type OneNextActionOptions = {
  commandRunning?: boolean;
  visualRejected?: boolean;
  visualAccepted?: boolean;
  finalClosurePassed?: boolean;
  localDayOneStarted?: boolean;
  p0Blocker?: boolean;
};

function decision(
  oneNextAction: string,
  whyThisNow: string,
  founderDecisionNeeded: boolean
): OneNextActionDecision {
  return {
    oneNextAction,
    whyThisNow,
    founderDecisionNeeded,
    whatNotToDo: [
      "Do not start billing, broker/feed, live execution, real money, production, or public launch.",
      "Do not add future worlds before Station 1 closes.",
      "Do not expose Alkon, Kernel, Founder Source, or internal doctrine publicly.",
      "Do not claim Local Day One without Ahmad visual acceptance.",
    ],
  };
}

export function getKernelOneNextAction(
  options: OneNextActionOptions = {}
): OneNextActionDecision {
  if (options.p0Blocker) {
    return decision(
      "Fix the P0 truth, security, build, or public leak blocker.",
      "P0 blockers veto every other action.",
      false
    );
  }

  if (options.commandRunning) {
    return decision(
      "Wait for the current command Wake Report.",
      "Alkon does not stack commands without evidence from the running command.",
      false
    );
  }

  if (options.visualRejected) {
    return decision(
      "Create one focused visual correction command for the rejected surface.",
      "Rejected visual reality must be corrected before Local Day One.",
      true
    );
  }

  if (!options.visualAccepted) {
    return decision(
      "Ask Ahmad to visually accept or reject the current Pro Max public and Trading Workspace baseline.",
      "Local Day One is human-gated and cannot start from automated confidence.",
      true
    );
  }

  if (!options.finalClosurePassed) {
    return decision(
      "Run Final Universal Closure with full validation and public leak proof.",
      "Visual acceptance allows closure evidence, but closure still needs tests, reports, Git, and memory.",
      false
    );
  }

  if (!options.localDayOneStarted) {
    return decision(
      "Ask Ahmad whether to start Local Day One.",
      "Final closure can prepare Local Day One, but only Ahmad starts it.",
      true
    );
  }

  return decision(
    "Continue the Daily Operating Loop and select the next smallest safe action.",
    "Local Day One has started, so Alkon evolves through evidence and memory.",
    true
  );
}
