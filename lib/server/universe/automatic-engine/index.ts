import "server-only";

import { getAlKawnDailyWorkLoop } from "../daily-work-loop";
import { getAlKawnInfinityPreparation } from "../infinity";

export type AutomaticEngineTrigger =
  | "desktop_open"
  | "manual_internal_cycle"
  | "daily_work_loop_request"
  | "future_infinity_safe_trigger";

export type AutomaticEngineState = {
  id: "al_kawn_automatic_internal_engine";
  status: "controlled_private_internal";
  requiredWording: string[];
  triggers: AutomaticEngineTrigger[];
  cyclePlan: string[];
  scanResult: string[];
  gapDetection: string[];
  selectedWork: string;
  validationPlan: string[];
  report: string;
  memoryUpdate: string;
  nextAction: string;
};

const REQUIRED_WORDING = [
  "الكون يعمل تلقائيًا داخل نطاقه الخاص.",
  "No uncontrolled infinite loop.",
  "Safe trigger required for every cycle.",
  "One automatic work item per cycle.",
];

export function getAutomaticTriggerRules() {
  return [
    {
      id: "desktop_open",
      trigger: "Ahmad opens /desktop/kawn",
      rule: "May refresh visible private state only.",
    },
    {
      id: "manual_internal_cycle",
      trigger: "Ahmad presses Run internal cycle",
      rule: "Runs one safe internal work item and stops.",
    },
    {
      id: "daily_work_loop_request",
      trigger: "Daily Work Loop requests a cycle",
      rule: "Uses the daily selected work item only.",
    },
    {
      id: "future_infinity_safe_trigger",
      trigger: "future Infinity safe trigger",
      rule: "Future-gated, trigger-based, never daemon-based.",
    },
  ] as const;
}

export function getAutomaticCyclePlan() {
  return [
    "Read current private state.",
    "Read Daily Work Loop selected work.",
    "Read Product Truth.",
    "Ask Universe Operating Kernel for verdict.",
    "Stop at Legal or Money gates.",
    "Run one safe internal work item.",
    "Prepare report and memory snapshot.",
    "Stop and wait for the next safe trigger.",
  ];
}

export function getAutomaticScanResult() {
  const dailyLoop = getAlKawnDailyWorkLoop();
  const infinity = getAlKawnInfinityPreparation();

  return [
    `Daily Work Loop state: ${dailyLoop.state}`,
    `Selected work: ${dailyLoop.selectedWorkItem.title}`,
    `Infinity preparation state: ${infinity.state}`,
    "Product Truth visible and enforced.",
    "No public, legal, money, broker, or external automation selected.",
  ];
}

export function getAutomaticGapDetection() {
  return [
    "No uncontrolled loop is present.",
    "No hidden background daemon is present.",
    "External accounts remain disconnected.",
    "Local Day One remains ready_not_started until Ahmad decides.",
  ];
}

export function getAutomaticSelectedWork() {
  return getAlKawnDailyWorkLoop().selectedWorkItem.title;
}

export function getAutomaticValidationPlan() {
  return [
    "Run focused A-Z regression specs.",
    "Run full regression.",
    "Run smoke routes.",
    "Confirm forbidden claims remain absent.",
  ];
}

export function getAutomaticReport() {
  return "reports/al-kawn-realistic-automatic-internal-engine.md";
}

export function getAutomaticMemoryUpdate() {
  return "reports/daily/al-kawn-daily-memory-snapshot.md";
}

export function getAutomaticNextAction() {
  return "Use one safe trigger to run one private internal cycle, then stop.";
}

export function getAlKawnAutomaticEngineState(): AutomaticEngineState {
  return {
    id: "al_kawn_automatic_internal_engine",
    status: "controlled_private_internal",
    requiredWording: REQUIRED_WORDING,
    triggers: getAutomaticTriggerRules().map((trigger) => trigger.id),
    cyclePlan: getAutomaticCyclePlan(),
    scanResult: getAutomaticScanResult(),
    gapDetection: getAutomaticGapDetection(),
    selectedWork: getAutomaticSelectedWork(),
    validationPlan: getAutomaticValidationPlan(),
    report: getAutomaticReport(),
    memoryUpdate: getAutomaticMemoryUpdate(),
    nextAction: getAutomaticNextAction(),
  };
}
