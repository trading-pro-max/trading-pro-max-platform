import { getAlkonKernelSnapshot } from "@/lib/server/alkon-kernel";
import { getAlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";
import { getFounderDeviceReadinessSnapshot } from "./registry";
import type { AlkonPocketUniverseSnapshot } from "./types";

const POCKET_WHAT_NOT_TO_DO = [
  "Do not start Local Day One without explicit Ahmad visual acceptance.",
  "Do not activate launch, production, billing, broker/feed, live execution, or real money.",
  "Do not expose Alkon, Founder Command, device internals, secrets, bank/card data, or governance publicly.",
  "Do not run shell commands, Codex, payments, or external account actions from phones or the web app.",
];

export function getAlkonPocketUniverseSnapshot(
  checkedAt = new Date().toISOString()
): AlkonPocketUniverseSnapshot {
  const operatingMode = getAlkonOperatingModeSnapshot(checkedAt);
  const kernel = getAlkonKernelSnapshot(checkedAt);
  const devices = getFounderDeviceReadinessSnapshot(checkedAt);
  const officialDevices = devices.privateDevices.filter((device) =>
    [
      "windows_command_build_center",
      "iphone_pocket_decision_center",
      "samsung_review_android_reality_center",
    ].includes(device.constellationRole)
  );

  return {
    checkedAt,
    mode: "alkon_pocket_universe",
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    publicExposure: false,
    station: "Local Day One Gate",
    localDayOne: "not_started",
    heartStatus: "Pro Max Trading heart preserved",
    visualAcceptance: "visual_acceptance_needed",
    wakeReport: {
      status: operatingMode.status,
      mission: "Execute Alkon A-Z Operating Execution Roadmap without unsafe activation.",
      done:
        "Official path, device constellation, Pocket Universe, Local Builder, Reality Production, Self-Correction, and reporting are governed as private readiness.",
      notDone:
        "Ahmad visual acceptance is not recorded; Local Day One, public launch, billing, broker/feed, live execution, and real money are not started.",
      next: operatingMode.oneNextAction.oneNextAction,
    },
    oneNextAction: kernel.oneNextAction.oneNextAction,
    decisionOptions: ["accept", "reject_with_notes", "focused_correction"],
    deviceRoles: officialDevices.map((device) => ({
      deviceId: device.deviceId,
      privateName: device.privateName,
      role: device.role,
      constellationRole: device.constellationRole,
      allowed: device.allowedCapabilities,
      blocked: device.blockedCapabilities,
    })),
    blockedActions: devices.blockedActions,
    whatNotToDo: POCKET_WHAT_NOT_TO_DO,
    noShell: true,
    noCodex: true,
    noPayments: true,
    noSecrets: true,
    noLiveTrading: true,
  };
}
