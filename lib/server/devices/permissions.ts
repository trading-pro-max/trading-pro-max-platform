import { getAlkonDeviceRegistry } from "./alkon-devices";
import { getPublicDeviceRegistry } from "./public-devices";
import type {
  DeviceBlockedCapability,
  DevicePermissionRule,
  DeviceRegistryItem,
} from "./types";

export const HARD_BLOCKED_DEVICE_CAPABILITIES: DeviceBlockedCapability[] = [
  "live_execution",
  "real_money",
  "billing_activation",
  "broker_feed_activation",
  "production_activation",
  "production_secrets",
  "codex_execution",
  "payment_execution",
  "social_publishing",
  "shell_execution",
  "public_private_systems",
  "fake_downloads",
  "fake_store_claims",
  "fake_metrics",
];

function allowedSummary(device: DeviceRegistryItem): string[] {
  if (device.world === "public_earth") {
    if (device.availability === "current") {
      return ["public view", "account use", "paper workspace"];
    }

    return ["readiness only", `${device.availability} availability truth`];
  }

  if (device.type === "watch") {
    return ["P0 alert visibility only", "no secret values", "no action execution"];
  }

  if (
    device.constellationRole === "iphone_pocket_decision_center" ||
    device.constellationRole === "samsung_review_android_reality_center"
  ) {
    return [
      "Wake Report review",
      "One Next Action review",
      "mobile visual review",
      "accept/reject/focused correction intent only",
    ];
  }

  if (device.type === "mobile") {
    return [
      "private status review",
      "idea capture readiness",
      "low-risk approval readiness later",
    ];
  }

  return ["private reporting", "review readiness", "Founder command visibility"];
}

export function getDevicePermissionRules(): DevicePermissionRule[] {
  return [...getPublicDeviceRegistry(), ...getAlkonDeviceRegistry()].map(
    (device) => ({
      deviceId: device.deviceId,
      permissionLevel: device.permissionLevel,
      allowed: allowedSummary(device),
      blocked: HARD_BLOCKED_DEVICE_CAPABILITIES,
      reason:
        "Every device sees only the capability level that matches its role; Product Truth and public/private boundaries cannot be bypassed.",
      founderApprovalRequired:
        device.world === "private_alkon" &&
        device.permissionLevel !== "alert_only" &&
        device.permissionLevel !== "review_only",
    })
  );
}

export function isCapabilityHardBlockedOnEveryDevice(
  capability: DeviceBlockedCapability
) {
  return HARD_BLOCKED_DEVICE_CAPABILITIES.includes(capability);
}
