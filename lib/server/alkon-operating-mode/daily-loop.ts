import type {
  AlkonDailyOperatingLoop,
  AlkonOperatingModeOptions,
  DailyOperatingLoopStatus,
} from "./types";
import { getAlkonActivationGates, decideAlkonActivation } from "./activation-gates";
import { getAlkonOneNextAction } from "./one-next-action";
import { getZeroTruthAudit } from "./zero-truth-audit";

export const ALKON_DAILY_OPERATING_LOOP_STEPS = [
  "Read Wake Report.",
  "Read current station.",
  "Check Product Truth.",
  "Check public/private boundary.",
  "Check the heart: Pro Max Trading, Workspace, and Chart.",
  "Check Assistant.",
  "Check visual acceptance notes.",
  "Check build, test, and Git evidence if available.",
  "Detect drift.",
  "Return one next action.",
  "Wait for Ahmad decision.",
];

function dailyStatus(
  activationStatus: ReturnType<typeof decideAlkonActivation>["status"],
  options: AlkonOperatingModeOptions
): DailyOperatingLoopStatus {
  if (activationStatus === "blocked") return "blocked";
  if (options.localDayOneStarted) return "active";
  if (activationStatus === "active") return "ready";

  return "active_with_notes";
}

export function getAlkonDailyOperatingLoop(
  checkedAt = new Date().toISOString(),
  options: AlkonOperatingModeOptions = {}
): AlkonDailyOperatingLoop {
  const audit = getZeroTruthAudit(checkedAt, options);
  const gates = getAlkonActivationGates(checkedAt, options, audit);
  const activation = decideAlkonActivation(gates);
  const oneNextAction = getAlkonOneNextAction(checkedAt, options, audit, gates);

  return {
    checkedAt,
    dailyLoopStatus: dailyStatus(activation.status, options),
    todayFocus:
      oneNextAction.actionId === "ask_ahmad_visual_review"
        ? "Ahmad visual acceptance and Final Universal Closure readiness"
        : oneNextAction.oneNextAction,
    loop: ALKON_DAILY_OPERATING_LOOP_STEPS,
    oneNextAction,
    driftDetected: audit.status === "blocked",
    driftNotes:
      audit.status === "blocked"
        ? audit.blockers.map((item) => item.summary)
        : [
            "No P0 Product Truth, public/private boundary, validation, or Git drift is active by default.",
            "Visual acceptance remains a human gate.",
          ],
    whatNotToDo: [
      "Do not launch publicly.",
      "Do not activate billing.",
      "Do not activate broker/feed.",
      "Do not enable live execution.",
      "Do not route real money.",
      "Do not expose Alkon publicly.",
      "Do not execute shell commands from the web app.",
      "Do not use images or raster assets for this mission.",
    ],
    founderDecisionNeeded: oneNextAction.founderDecisionNeeded,
  };
}
