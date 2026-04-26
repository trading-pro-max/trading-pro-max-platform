import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import { getAlkonDeviceRegistry } from "./alkon-devices";
import { getDeviceContinuityPaths } from "./continuity";
import { getDevicePermissionRules, HARD_BLOCKED_DEVICE_CAPABILITIES } from "./permissions";
import { getPublicDeviceRegistry } from "./public-devices";
import { getDeviceSecurityReadiness } from "./security";
import type {
  DeviceRegistryItem,
  FounderDeviceReadinessSnapshot,
  PublicDeviceReadinessSnapshot,
  PublicDeviceRegistryItem,
} from "./types";

function sanitizePublicDevice(device: DeviceRegistryItem): PublicDeviceRegistryItem {
  const { privateName: _privateName, founderVisible: _founderVisible, ...publicDevice } = device;

  return {
    ...publicDevice,
    blockedCapabilities: device.blockedCapabilities.filter(
      (capability) =>
        !["production_secrets", "shell_execution", "public_private_systems"].includes(
          capability
        )
    ),
    world: "public_earth",
    audience:
      device.audience === "authenticated_user" ? "authenticated_user" : "public_user",
    publicVisible: true,
  };
}

export function getDeviceRegistry() {
  return [...getPublicDeviceRegistry(), ...getAlkonDeviceRegistry()];
}

export function getPublicDeviceReadinessSnapshot(
  checkedAt = new Date().toISOString()
): PublicDeviceReadinessSnapshot {
  const devices = getPublicDeviceRegistry().map(sanitizePublicDevice);

  return {
    checkedAt,
    mode: "public_device_world",
    status: "ready_with_notes",
    devices,
    appsPlatformsTruth: {
      webApp: "current",
      desktopApp: "planned",
      mobileApp: "planned",
      tabletApp: "future",
      fakeDownloads: false,
      appStoreClaims: false,
    },
    productTruth: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      billingInactive: true,
      brokerFeedInactive: true,
      publicLaunchInactive: true,
      internalDeviceExposure: false,
    },
    nextSafeActions: [
      "Keep Web App current and paper-safe.",
      "Keep Desktop and Mobile planned until real installers or store listings exist.",
      "Keep Tablet future-only.",
      "Keep internal device models hidden.",
    ],
  };
}

export function getFounderDeviceReadinessSnapshot(
  checkedAt = new Date().toISOString()
): FounderDeviceReadinessSnapshot {
  return {
    checkedAt,
    mode: "alkon_device_constellation",
    status: "ready_with_notes",
    publicDevices: getPublicDeviceRegistry(),
    privateDevices: getAlkonDeviceRegistry(),
    permissionRules: getDevicePermissionRules(),
    securityReadiness: getDeviceSecurityReadiness(),
    continuity: getDeviceContinuityPaths(),
    publicExposure: false,
    noExecution: true,
    noSecrets: true,
    nextSafeActions: [
      "Keep public apps truthful: Web current, Desktop planned, Mobile planned, Tablet future.",
      "Keep private Alkon device constellation internal and read-only.",
      "Prepare trusted-device, passkey, biometric/PIN, session timeout, and audit readiness before any private approval flow.",
      "Do not publish apps, create installers, activate billing/live/broker/social, or expose secrets.",
    ],
    blockedActions: HARD_BLOCKED_DEVICE_CAPABILITIES,
  };
}

export function getDeviceDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const publicSnapshot = getPublicDeviceReadinessSnapshot(checkedAt);
  const founderSnapshot = getFounderDeviceReadinessSnapshot(checkedAt);

  return {
    key: "multi_device_reality",
    label: "Device readiness",
    status: "ready",
    summary: "Public apps and private command devices separated",
    detail:
      `${publicSnapshot.devices.length} public devices are modeled with Web current, Desktop/Mobile planned, and Tablet future. ${founderSnapshot.privateDevices.length} internal device models remain hidden, read-only, secret-free, and non-executing.`,
    checkedAt,
  };
}
