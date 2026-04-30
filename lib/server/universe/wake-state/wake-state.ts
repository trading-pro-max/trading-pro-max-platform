import "server-only";

import { getLocalDesktopAuthStatus } from "@/lib/server/universe/local-desktop-auth";
import { getAlKawnWakeBoundaries } from "./wake-boundaries";
import { getAlKawnWakeNextAction } from "./wake-next-action";
import { getAlKawnWakeReadiness } from "./wake-readiness";
import { getAlKawnWakeSequence } from "./wake-sequence";
import type { AlKawnWakeState } from "./types";

export function getAlKawnWakeState(): AlKawnWakeState {
  const localAuthStatus = getLocalDesktopAuthStatus();

  return {
    id: "al_kawn_wake_state",
    title: "Al-Kawn Wake State",
    state: "operating_private_daily_loop",
    summary:
      "الكون استيقظ للعمل الداخلي اليومي as Ahmad's private electronic self with a human spoken interface, one next action, and Product Truth boundaries.",
    requiredWording: [
      "Al-Kawn Wake State",
      "الكون استيقظ للعمل الداخلي اليومي.",
      "الكون يتكلم مع أحمد بلغة بشرية واضحة.",
      "Daily Work Loop is active.",
      "Human Spoken Interface is active.",
      "Product Truth loaded.",
      "Universe Operating Kernel checked.",
      "Inside الكون: direct internal execution.",
      "Legal and Money gates stop execution for Ahmad.",
      "Daily WAKE REPORT prepared.",
      "One next action selected.",
    ],
    localAccessStatus: `Ahmad-only local access checked: ${localAuthStatus.state}; ${localAuthStatus.sessionTimeout}; ${localAuthStatus.manualLock}.`,
    productTruthStatus: "Product Truth loaded.",
    kernelStatus: "Universe Operating Kernel checked.",
    humanSpokenInterfaceState: "Human Spoken Interface is active.",
    dailyWorkLoopState: "Daily Work Loop is active.",
    dailyWakeReportPath: "reports/daily/al-kawn-daily-wake-report.md",
    oneNextAction: getAlKawnWakeNextAction(),
    sequence: getAlKawnWakeSequence(),
    readiness: getAlKawnWakeReadiness(),
    boundaries: getAlKawnWakeBoundaries(),
  };
}
