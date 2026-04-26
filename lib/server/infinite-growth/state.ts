import { INFINITE_GROWTH_DOMAIN_REGISTRY } from "./domain-registry";
import { evaluateGrowthGates } from "./gates";
import {
  SAMPLE_INFINITE_GROWTH_IDEAS,
  evaluateInfiniteGrowth,
  evaluateInfiniteGrowthSamples,
} from "./decision-engine";
import { INFINITE_GROWTH_MEMORY_LESSONS } from "./memory";
import type {
  GrowthDomain,
  InfiniteGrowthIdea,
  InfiniteGrowthLayer,
  InfiniteGrowthSnapshot,
} from "./types";

export const INFINITE_GROWTH_BLACK_HOLE_DOMAINS: GrowthDomain[] = [
  "broker_feed",
  "live_execution",
  "real_money",
];

export const INFINITE_GROWTH_BLOCKED_DOMAINS: GrowthDomain[] = [
  "billing",
  "launch",
  "production",
  "social",
  "broker_feed",
  "live_execution",
  "real_money",
  "financial_services",
  "regulated_activity",
];

export const INFINITE_GROWTH_SAFE_CREATION_DOMAINS: GrowthDomain[] = [
  "idea",
  "design",
  "docs",
  "tests",
  "audit",
  "memory",
  "safe_local_build",
];

export const INFINITE_GROWTH_GATED_REALITY_DOMAINS: GrowthDomain[] =
  INFINITE_GROWTH_DOMAIN_REGISTRY.map((rule) => rule.domain).filter(
    (domain) => !INFINITE_GROWTH_SAFE_CREATION_DOMAINS.includes(domain)
  );

function layerStatuses(): InfiniteGrowthSnapshot["layerStatuses"] {
  const layers: InfiniteGrowthLayer[] = [
    "domain_registry",
    "swiss_law_gravity",
    "product_truth_gate",
    "privacy_gate",
    "tax_accounting_gate",
    "treasury_gate",
    "claims_gate",
    "media_publishing_gate",
    "launch_gate",
    "production_gate",
    "security_secrets_gate",
    "financial_services_gate",
    "founder_final_authority_gate",
    "growth_permit",
    "memory_law",
  ];

  return layers.reduce<InfiniteGrowthSnapshot["layerStatuses"]>(
    (statuses, layer) => ({
      ...statuses,
      [layer]:
        layer === "product_truth_gate" ||
        layer === "security_secrets_gate" ||
        layer === "financial_services_gate"
          ? "blocked_guard_ready"
          : [
                "tax_accounting_gate",
                "treasury_gate",
                "media_publishing_gate",
                "launch_gate",
                "production_gate",
              ].includes(layer)
            ? "readiness_only"
            : "ready",
    }),
    {} as InfiniteGrowthSnapshot["layerStatuses"]
  );
}

export function getInfiniteGrowthSnapshot(
  checkedAt = new Date().toISOString()
): InfiniteGrowthSnapshot {
  const sampleDecisions = evaluateInfiniteGrowthSamples();

  return {
    snapshotId: "alkon_swiss_law_infinite_sovereign_growth_constitution",
    name: "Alkon Swiss-Law Infinite Sovereign Growth Constitution",
    visibility: "private_founder_only",
    publicExposure: false,
    readiness: "ready",
    domains: INFINITE_GROWTH_DOMAIN_REGISTRY,
    layerStatuses: layerStatuses(),
    sampleDecisions,
    safeCreationDomains: INFINITE_GROWTH_SAFE_CREATION_DOMAINS,
    gatedRealityDomains: INFINITE_GROWTH_GATED_REALITY_DOMAINS,
    blockedDomains: INFINITE_GROWTH_BLOCKED_DOMAINS,
    blackHoleDomains: INFINITE_GROWTH_BLACK_HOLE_DOMAINS,
    requiredReviewCategories: [
      "privacy",
      "tax/accounting",
      "treasury",
      "claims",
      "media publishing",
      "launch",
      "production",
      "security/secrets",
      "financial services/regulatory",
      "Founder final authority",
    ],
    founderDecisionsNeeded: sampleDecisions
      .filter((decision) => decision.founderApprovalRequired)
      .map((decision) => decision.idea.ideaId ?? decision.idea.domain),
    memoryLessons: INFINITE_GROWTH_MEMORY_LESSONS,
    nextSafeActions: [
      "Let ideas, planning, design, docs, tests, audits, memory, and local build grow freely under Product Truth.",
      "Keep public UI, Assistant, workspace, support, and media public-safe with claims and privacy gates.",
      "Keep billing, payments, treasury, tax, accounting, launch, production, social, broker/feed, live execution, real money, and regulated activity blocked or readiness-only until gates pass.",
      "Use Growth Permits as private Founder reports, not execution authority.",
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
      noRegulatedActivityActivation: true,
      noSecretsExposed: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
      noFakeClaims: true,
    },
    createdAt: checkedAt,
  };
}

export function getInfiniteGrowthReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getInfiniteGrowthSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noPayments: true,
    noBankCardData: true,
    noSecrets: true,
    noExternalCalls: true,
    noRegulatedActivityActivation: true,
    snapshot,
  };
}

export function getInfiniteGrowthSampleDecision(
  idea?: Partial<InfiniteGrowthIdea>
) {
  const base = SAMPLE_INFINITE_GROWTH_IDEAS[0];
  const report = evaluateInfiniteGrowth({ ...base, ...idea });

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noPayments: true,
    noBankCardData: true,
    noSecrets: true,
    noExternalCalls: true,
    report,
  };
}

export function getInfiniteGrowthGates() {
  const sample = SAMPLE_INFINITE_GROWTH_IDEAS[0];

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    gates: evaluateGrowthGates(sample),
    gateIds: [
      "ProductTruthGate",
      "PrivacyGate",
      "TaxAccountingGate",
      "TreasuryGate",
      "ClaimsGate",
      "MediaPublishingGate",
      "LaunchGate",
      "ProductionGate",
      "SecuritySecretsGate",
      "FinancialServicesGate",
      "FounderFinalAuthorityGate",
    ],
  };
}
