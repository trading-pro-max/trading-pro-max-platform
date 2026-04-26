import { getAlkonDeviceRegistry } from "./alkon-devices";
import { getPublicDeviceRegistry } from "./public-devices";
import type { DeviceRegistryItem, DeviceSecurityReadiness } from "./types";

function requirementsForDevice(device: DeviceRegistryItem): string[] {
  if (device.world === "public_earth") {
    return [
      device.availability === "current"
        ? "Public-safe browsing and account session when signed in"
        : "No installer, store listing, or fake availability claim",
      "Paper-safe access only",
      "No broker/feed/live/billing capability",
    ];
  }

  const base = [
    "Trusted device readiness",
    "Passkey/WebAuthn readiness",
    "Step-up confirmation readiness",
    "Session timeout readiness",
    "Audit trail readiness",
    "No secret values",
  ];

  if (device.type === "watch") {
    return ["Alert-only posture", "No secret values", "No action execution"];
  }

  if (device.type === "mobile") {
    return [...base, "Biometric/PIN readiness", "Low-risk approval gates planned"];
  }

  return base;
}

export function getDeviceSecurityReadiness(): DeviceSecurityReadiness[] {
  return [...getPublicDeviceRegistry(), ...getAlkonDeviceRegistry()].map(
    (device) => ({
      deviceId: device.deviceId,
      publicName: device.publicVisible ? device.publicName : device.privateName,
      posture: device.securityPosture,
      requirements: requirementsForDevice(device),
      secretsVisible: false,
      executionControlsEnabled: false,
      nextSafeAction: device.nextSafeAction,
    })
  );
}
