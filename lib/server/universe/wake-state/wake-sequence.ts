import "server-only";

import { getLocalDesktopAuthStatus } from "@/lib/server/universe/local-desktop-auth";
import type { AlKawnWakeSequenceStep } from "./types";

export function getAlKawnWakeSequence(): AlKawnWakeSequenceStep[] {
  const localAuthStatus = getLocalDesktopAuthStatus();

  return [
    {
      id: "ahmad_local_access_check",
      label: "Ahmad local access check",
      status: "checked",
      details: `Local PIN/passphrase status: ${localAuthStatus.state}; Ahmad-only desktop status preserved.`,
      evidence: [
        "lib/server/universe/local-desktop-auth/",
        "app/desktop/kawn/_components/AlKawnLocalAuthGate.tsx",
      ],
    },
    {
      id: "identity_check",
      label: "Identity check",
      status: "checked",
      details: "الكون is Ahmad's private electronic self; no public exposure is active.",
      evidence: ["Product Truth", "Private Founder Universe Command Center"],
    },
    {
      id: "reality_sync",
      label: "Reality sync",
      status: "loaded",
      details:
        "Device time and device date are active reality sources; weather is not connected and location is not requested.",
      evidence: ["ProMaxDeviceTimeRealityBar", "AlKawnRealityDock"],
    },
    {
      id: "product_truth_load",
      label: "Product Truth load",
      status: "loaded",
      details:
        "Product Truth loaded. Public launch blocked, billing inactive, payments inactive, receiving money inactive, real money disabled, broker disabled, legal review pending, and ALKON private.",
      evidence: ["Product Truth strip", "reports/product truth history"],
    },
    {
      id: "kernel_check",
      label: "Kernel check",
      status: "checked",
      details:
        "Universe Operating Kernel checked. Execution judge and Product Truth law are available.",
      evidence: ["lib/server/universe/kernel/"],
    },
    {
      id: "boundary_check",
      label: "Boundary check",
      status: "checked",
      details:
        "Inside الكون: direct internal execution. Legal and Money gates stop execution for Ahmad. Product Truth violations are blocked immediately.",
      evidence: ["founder boundary", "desktop decision center"],
    },
    {
      id: "report_memory_check",
      label: "Report and memory check",
      status: "checked",
      details:
        "Latest WAKE REPORT, latest commit, validation memory, report paths, and tests are tracked as local project evidence when present.",
      evidence: ["reports/", "tests/regression/", "git evidence"],
    },
    {
      id: "work_selection",
      label: "Work selection",
      status: "prepared",
      details:
        "One safe internal work item selected; legal, money, public launch, broker, billing, and real trading are excluded.",
      evidence: ["daily work loop", "wake next action"],
    },
    {
      id: "daily_report",
      label: "Daily report",
      status: "prepared",
      details:
        "Daily WAKE REPORT prepared with state, blockers, chosen internal work, and one next action.",
      evidence: ["reports/daily/al-kawn-daily-wake-report.md"],
    },
  ];
}
