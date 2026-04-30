import "server-only";

import { getAlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import { getDesktopDistributionGate } from "@/lib/server/universe/desktop-distribution-gate";
import { getPrivateDesktopLocalBuildDryRun } from "@/lib/server/universe/desktop-local-build-dry-run";
import { getDesktopPackagingGate } from "@/lib/server/universe/desktop-packaging-gate";
import { getPrivateDesktopPackagingPreparation } from "@/lib/server/universe/desktop-packaging-preparation";
import { getUniverseKernelReadiness, getUniverseKernelTruth } from "@/lib/server/universe/kernel";
import { getLocalDesktopAuthStatus } from "@/lib/server/universe/local-desktop-auth";
import { getAlKawnWakeState } from "@/lib/server/universe/wake-state";
import type { InfinityReadinessCheck } from "./types";

export function getInfinityReadiness(): InfinityReadinessCheck[] {
  const wakeState = getAlKawnWakeState();
  const dailyLoop = getAlKawnDailyWorkLoop();
  const kernelReadiness = getUniverseKernelReadiness();
  const kernelTruth = getUniverseKernelTruth();
  const packagingGate = getDesktopPackagingGate();
  const packagingPreparation = getPrivateDesktopPackagingPreparation();
  const localBuildDryRun = getPrivateDesktopLocalBuildDryRun();
  const distributionGate = getDesktopDistributionGate();
  const localAuthStatus = getLocalDesktopAuthStatus();

  return [
    {
      id: "wake_state",
      label: "Wake State",
      state: "ready_with_notes",
      status: `Wake State is ${wakeState.state}; daily WAKE REPORT path is visible.`,
      evidence: [
        wakeState.title,
        wakeState.dailyWakeReportPath,
        "reports/daily/al-kawn-daily-work-loop.md",
        "reports/daily/al-kawn-daily-memory-snapshot.md",
      ],
      notes: [
        "Wake State exists.",
        "Daily reports exist as private, no-secrets reports.",
        "Infinity preparation does not replace Wake State.",
      ],
    },
    {
      id: "daily_work_loop",
      label: "Daily Work Loop",
      state: "ready_with_notes",
      status: `Daily loop is ${dailyLoop.state}; selected work is ${dailyLoop.selectedWorkItem.title}.`,
      evidence: [
        dailyLoop.title,
        dailyLoop.selectedWorkItem.title,
        dailyLoop.memorySnapshot.path,
        dailyLoop.nextAction.next,
      ],
      notes: [
        "Daily Work Loop feeds Infinity preparation.",
        "Blockers and one next action are visible.",
        "Infinity preparation extends the daily loop without bypassing it.",
      ],
    },
    {
      id: "kernel",
      label: "Universe Operating Kernel",
      state: kernelReadiness.ok ? "ready_with_notes" : "blocked_by_prerequisite",
      status: `Kernel status is ${kernelReadiness.status}; Product Truth enforcement is available.`,
      evidence: [
        "Universe Operating Kernel checked.",
        `Founder boundary enforced: ${kernelReadiness.founderBoundaryEnforced}`,
        `Ontological law enforced: ${kernelReadiness.ontologicalLawEnforced}`,
      ],
      notes: [
        "Universe Operating Kernel is the execution judge.",
        "Product Truth law is available.",
        "Legal and money gates remain outside direct execution.",
      ],
    },
    {
      id: "product_truth",
      label: "Product Truth",
      state: "ready_with_notes",
      status: "Product Truth controls every cycle.",
      evidence: [
        `Public launch blocked: ${kernelTruth.publicLaunchBlocked}`,
        `Billing inactive: ${kernelTruth.billingInactive}`,
        `Real money disabled: ${kernelTruth.realMoneyDisabled}`,
        `Broker disabled/not connected: ${kernelTruth.brokerExecutionDisabled}`,
        `Legal review pending: ${kernelTruth.legalReviewPending}`,
        `Al-Kawn private to Ahmad devices: ${kernelTruth.universePrivateToAhmadDevices}`,
        `ALKON private/background: ${kernelTruth.alkonPrivateBackground}`,
      ],
      notes: [
        "Payments and receiving money remain inactive.",
        "Public Al-Kawn and public ALKON remain blocked.",
        "Forbidden public, money, broker, legal, and guarantee claims stay blocked.",
      ],
    },
    {
      id: "desktop",
      label: "Desktop readiness",
      state: "ready_with_notes",
      status: "/desktop/kawn exists as the private desktop command home.",
      evidence: [
        "/desktop/kawn",
        `Local auth: ${localAuthStatus.state}`,
        `Packaging gate: ${packagingGate.status}`,
        `Packaging preparation: ${packagingPreparation.status}`,
        `Local build dry run: ${localBuildDryRun.status}`,
        `Distribution gate: ${distributionGate.status}`,
      ],
      notes: [
        "Local PIN / Passphrase Auth remains preserved.",
        "Desktop packaging and distribution gates remain readiness gates.",
        "No public desktop distribution is created.",
      ],
    },
    {
      id: "safety",
      label: "Safety",
      state: "ready_with_notes",
      status: "No uncontrolled infinite loop; no public, money, broker, legal, or external automation.",
      evidence: [
        "No uncontrolled infinite loop.",
        "Infinity cycle waits for safe trigger.",
        "No external account automation.",
        "No secrets in Git.",
        "No secrets in the desktop bundle.",
      ],
      notes: [
        "Infinity preparation is not a background daemon.",
        "Safe internal work only.",
        "External actions remain blocked.",
      ],
    },
  ];
}
