import { getDimensionsStatus } from "./dimensions";
import {
  SAMPLE_LEGITIMACY_REQUESTS,
  evaluateAlkonLegitimacy,
} from "./engine";
import type {
  AlkonActionCategory,
  AlkonLegitimacyRequest,
  AlkonLegitimacySnapshot,
} from "./types";

export const BLOCKED_LEGITIMACY_CATEGORIES: AlkonActionCategory[] = [
  "production_activation",
  "billing_activation",
  "broker_feed_activation",
  "live_execution_activation",
  "real_money_activation",
  "social_publishing",
  "secrets_access",
];

export const BLACK_HOLE_LEGITIMACY_CATEGORIES: AlkonActionCategory[] = [
  "billing_activation",
  "broker_feed_activation",
  "live_execution_activation",
  "real_money_activation",
  "production_activation",
  "secrets_access",
];

export function getAlkonLegitimacySnapshot(
  checkedAt = new Date().toISOString()
): AlkonLegitimacySnapshot {
  return {
    snapshotId: "alkon_sovereign_legitimacy_system",
    name: "Alkon Sovereign Legitimacy System",
    visibility: "private_founder_only",
    publicExposure: false,
    readiness: "ready",
    dimensionsStatus: getDimensionsStatus(),
    recentSampleDecisions: SAMPLE_LEGITIMACY_REQUESTS.map(evaluateAlkonLegitimacy),
    blockedCategories: BLOCKED_LEGITIMACY_CATEGORIES,
    blackHoleCategories: BLACK_HOLE_LEGITIMACY_CATEGORIES,
    financialReadiness: {
      paymentExecutionStatus: "disabled",
      bankCardSecretStatus: "forbidden",
      taxReserveReadiness: "readiness_only",
      autopayGovernance: "planned_disabled",
    },
    securityAuthorityReadiness: {
      trustedDevice: "planned",
      stepUpConfirmation: "planned",
      passkey: "planned",
      presenceLiveness: "readiness_only_no_biometrics",
      auditLedger: "readiness_only",
      emergencyLockdown: "readiness_only",
    },
    timingReadiness: {
      currentStage: "laptop_planet",
      launchActivationAllowed: false,
      billingActivationAllowed: false,
      productionActivationAllowed: false,
    },
    reputationReadiness: {
      claimsFirewallReady: true,
      publishingGateInactive: true,
      mediaReviewRequired: true,
    },
    nextSafeActions: [
      "Use legitimacy review before sensitive Founder authority is applied.",
      "Keep payments, bank/card data, production secrets, publishing, billing, broker/feed, live execution, and real money blocked.",
      "Record decision permits as readiness-only audit reports with no secrets.",
      "Escalate money, security, launch, legal, reputation, and data decisions to explicit Founder responsibility.",
    ],
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
    },
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionActivationBlocked: true,
      socialPublishingInactive: true,
      productionSecretsUntouched: true,
      noPaymentExecution: true,
      noBankCardData: true,
      noTaxLegalFinancialFinalAdvice: true,
      noSecretsExposed: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
      noFakeClaims: true,
    },
    createdAt: checkedAt,
  };
}

export function getAlkonLegitimacyReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonLegitimacySnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noPayments: true,
    noBankCardData: true,
    noSecrets: true,
    noExternalCalls: true,
    snapshot,
  };
}

export function getAlkonLegitimacyDecisionSample(
  request?: Partial<AlkonLegitimacyRequest>
) {
  const base = SAMPLE_LEGITIMACY_REQUESTS[0];
  const decision = evaluateAlkonLegitimacy({ ...base, ...request });

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noPayments: true,
    noSecrets: true,
    decision,
  };
}
