import "server-only";

import {
  getDesktopArtifactPolicy,
  getDesktopDistributionSecretSafety,
} from "./artifact-policy";
import { getDesktopDistributionNextAction } from "./distribution-next-action";
import {
  getDistributionPreviousReportCheck,
  getPrivateDistributionReadiness,
} from "./private-distribution-readiness";
import { getPublicDistributionBlock } from "./public-distribution-block";
import { getProductionSigningGate } from "./signing-gate";
import type { DesktopDistributionGate } from "./types";

export function getDesktopDistributionGate(): DesktopDistributionGate {
  return {
    id: "private_desktop_distribution_gate",
    title: "Private Desktop Distribution Gate",
    status: "needs_ahmad_decision",
    summary:
      "Distribution is defined as private Ahmad-only, while public distribution, production signing, installer upload, release publishing, and auto-update remain blocked.",
    requiredWording: [
      "Private Desktop Distribution Gate",
      "Distribution is private Ahmad-only.",
      "Public desktop distribution is blocked.",
      "Production signing remains a future gate.",
      "No installers are uploaded or published.",
      "Product Truth overrides distribution.",
    ],
    previousReports: getDistributionPreviousReportCheck(),
    privateDistributionReadiness: getPrivateDistributionReadiness(),
    publicDistributionBlock: getPublicDistributionBlock(),
    productionSigningGate: getProductionSigningGate(),
    artifactPolicy: getDesktopArtifactPolicy(),
    secretSafety: getDesktopDistributionSecretSafety(),
    productTruth: [
      "Distribution is private Ahmad-only.",
      "Public desktop distribution is blocked.",
      "No installers are uploaded or published.",
      "Production signing remains a future gate.",
      "Product Truth overrides distribution.",
      "Public launch blocked.",
      "Billing inactive.",
      "Payments inactive.",
      "Receiving money inactive.",
      "Real money disabled.",
      "Broker execution disabled/not connected.",
      "Legal review pending.",
      "Al-Kawn remains private to Ahmad devices.",
      "ALKON private/background.",
    ],
    blockedActions: [
      "Public desktop distribution.",
      "Public release.",
      "Installer upload.",
      "Release artifact publishing.",
      "Production signing.",
      "Auto-update activation.",
      "Secrets in Git.",
      "Secrets in desktop bundle.",
      "Billing, payments, receiving money, real money, broker, legal, or public launch activation.",
    ],
    nextAction: getDesktopDistributionNextAction(),
  };
}
