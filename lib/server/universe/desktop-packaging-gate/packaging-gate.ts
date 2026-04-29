import "server-only";

import { getDesktopAuthReadiness } from "./auth-readiness";
import { getDesktopPrivateDistributionReadiness } from "./distribution-readiness";
import { getNativeDesktopShellReadiness } from "./native-shell-readiness";
import { getDesktopPackageReadiness } from "./package-readiness";
import { getDesktopPackagingNextAction } from "./packaging-next-action";
import { getDesktopSecretSafety } from "./secret-safety";
import { getDesktopShellReadiness } from "./shell-readiness";
import { getDesktopSigningReadiness } from "./signing-readiness";
import type { DesktopPackagingGate } from "./types";

export function getDesktopPackagingGate(): DesktopPackagingGate {
  return {
    id: "private_desktop_packaging_gate",
    title: "Private Desktop Packaging Gate",
    status: "ready_with_notes",
    summary:
      "The private desktop route is ready with notes, while native shell, packaging, signing, private distribution, and packaged local auth remain gated.",
    requiredWording: [
      "Private Desktop Packaging Gate",
      "Packaging is not public distribution.",
      "Al-Kawn Desktop remains Ahmad-only.",
      "No secrets are stored in the desktop bundle.",
      "Signing, packaging, and private distribution remain gated.",
      "Product Truth overrides desktop packaging.",
      "Public desktop distribution is blocked.",
    ],
    shellReadiness: getDesktopShellReadiness(),
    nativeShellReadiness: getNativeDesktopShellReadiness(),
    packageReadiness: getDesktopPackageReadiness(),
    signingReadiness: getDesktopSigningReadiness(),
    privateDistributionReadiness: getDesktopPrivateDistributionReadiness(),
    authReadiness: getDesktopAuthReadiness(),
    secretSafety: getDesktopSecretSafety(),
    productTruth: [
      "الكون private to Ahmad devices.",
      "Al-Kawn Desktop remains Ahmad-only.",
      "Public desktop distribution is blocked.",
      "Public launch blocked.",
      "Billing inactive.",
      "Payments inactive.",
      "Receiving money inactive.",
      "Real money disabled.",
      "Broker execution disabled/not connected.",
      "Legal review pending.",
      "ALKON private/background.",
      "Product Truth overrides desktop packaging.",
    ],
    blockedActions: [
      "Public desktop distribution.",
      "Production app signing without Ahmad approval.",
      "Packaging release activation without auth and distribution gates.",
      "Secrets in Git.",
      "Secrets in the desktop bundle.",
      "External account auto-connect.",
      "Billing, payments, receiving money, real money, broker execution, or legal approval claims.",
    ],
    nextAction: getDesktopPackagingNextAction(),
  };
}
