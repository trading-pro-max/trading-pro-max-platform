import "server-only";

import { getSecuritySovereigntySnapshot } from "@/lib/server/security-sovereignty";
import type {
  FounderCommandProtectionReadiness,
  FounderSecurityReadinessSnapshot,
  SecretCategory,
  SecretEnvironment,
  SecretReadinessItem,
  SecretReadinessState,
  SecretsAuthoritySnapshot,
} from "./types";

const supportedStates: SecretReadinessState[] = [
  "not_configured",
  "configured",
  "missing",
  "invalid_format",
  "expired",
  "rotation_required",
  "blocked",
  "production_forbidden",
];

const environments: SecretEnvironment[] = [
  "local",
  "staging_future",
  "production_future",
  "blocked",
];

const categories: SecretCategory[] = [
  "email",
  "social",
  "market_data",
  "broker_future",
  "billing_future",
  "monitoring_future",
  "founder_command",
  "github_vercel_domain_readiness",
];

const blockedSecretActions = [
  "display raw values",
  "print values in logs",
  "send values to Assistant",
  "send values to Codex",
  "store values in product memory",
  "commit env files",
  "activate production",
];

const secretItems: SecretReadinessItem[] = [
  {
    id: "secret-email-local",
    category: "email",
    label: "Email readiness",
    environment: "local",
    state: "not_configured",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "planned",
    allowedManagement: ["presence check", "format policy", "rotation plan"],
    blockedActions: blockedSecretActions,
    founderCommandVisible: true,
    safeNextAction: "Keep email secrets outside Git and report presence only.",
  },
  {
    id: "secret-social-blocked",
    category: "social",
    label: "Social token readiness",
    environment: "blocked",
    state: "blocked",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "required_before_activation",
    allowedManagement: ["policy only", "future approval checklist"],
    blockedActions: [...blockedSecretActions, "connect social accounts", "publish externally"],
    founderCommandVisible: true,
    safeNextAction: "Keep social tokens absent; social publishing remains inactive.",
  },
  {
    id: "secret-market-data-local",
    category: "market_data",
    label: "Market data readiness",
    environment: "local",
    state: "not_configured",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "planned",
    allowedManagement: ["presence check", "fallback truth"],
    blockedActions: [...blockedSecretActions, "activate external feed"],
    founderCommandVisible: true,
    safeNextAction: "Use fallback-first market data until reviewed credentials exist outside Git.",
  },
  {
    id: "secret-broker-future",
    category: "broker_future",
    label: "Broker future readiness",
    environment: "production_future",
    state: "production_forbidden",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "required_before_activation",
    allowedManagement: ["future policy", "legal/guardian review"],
    blockedActions: [...blockedSecretActions, "activate broker", "enable live execution"],
    founderCommandVisible: true,
    safeNextAction: "Keep broker credentials unavailable and blocked until future approval.",
  },
  {
    id: "secret-billing-future",
    category: "billing_future",
    label: "Billing future readiness",
    environment: "production_future",
    state: "production_forbidden",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "required_before_activation",
    allowedManagement: ["future policy", "legal/treasury review"],
    blockedActions: [...blockedSecretActions, "activate billing", "collect payments"],
    founderCommandVisible: true,
    safeNextAction: "Keep billing credentials unavailable and blocked until future approval.",
  },
  {
    id: "secret-monitoring-future",
    category: "monitoring_future",
    label: "Monitoring future readiness",
    environment: "staging_future",
    state: "not_configured",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "required_before_activation",
    allowedManagement: ["presence check", "rotation plan", "incident policy"],
    blockedActions: blockedSecretActions,
    founderCommandVisible: true,
    safeNextAction: "Prepare monitoring secret policy without storing or showing values.",
  },
  {
    id: "secret-founder-command",
    category: "founder_command",
    label: "Founder Command protection readiness",
    environment: "local",
    state: "rotation_required",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "required_before_activation",
    allowedManagement: ["owner auth readiness", "step-up readiness", "audit readiness"],
    blockedActions: [...blockedSecretActions, "public command exposure"],
    founderCommandVisible: true,
    safeNextAction: "Plan owner-only auth, device trust, step-up, and audit before command execution.",
  },
  {
    id: "secret-github-vercel-domain",
    category: "github_vercel_domain_readiness",
    label: "GitHub/Vercel/domain readiness",
    environment: "staging_future",
    state: "not_configured",
    valueVisible: false,
    valueHashVisible: false,
    valueSourceVisible: false,
    rotationStatus: "required_before_activation",
    allowedManagement: ["presence check", "deployment policy", "domain review"],
    blockedActions: [...blockedSecretActions, "production deployment"],
    founderCommandVisible: true,
    safeNextAction: "Keep deployment tokens outside Git and report readiness by status only.",
  },
];

export function getFounderCommandProtectionSnapshot(
  checkedAt = new Date().toISOString()
): FounderCommandProtectionReadiness {
  return {
    checkedAt,
    mode: "founder_command_protection_readiness",
    status: "readiness_only",
    ownerOnly: true,
    localOnly: true,
    passkeyWebAuthn: "planned",
    biometricDevice: "planned",
    pin: "planned",
    trustedDevice: "planned",
    stepUpConfirmation: "planned",
    auditReadiness: "readiness_only",
    noPublicRoute: true,
    publicNavigationVisible: false,
    userPlanAccess: false,
    freeProVipInstitutionalAccess: false,
    rawSecretsVisible: false,
    approvalExecutionActive: false,
    dangerousActionsBlocked: true,
  };
}

export function getSecretsAuthoritySnapshot(
  checkedAt = new Date().toISOString()
): SecretsAuthoritySnapshot {
  const items = secretItems;

  return {
    checkedAt,
    mode: "secrets_authority_readiness",
    status: "ready",
    coreRule:
      "Founder Command controls secret readiness, rotation, and safety. Founder Command never displays raw secret values.",
    supportedStates,
    environments,
    categories,
    items,
    summary: {
      totalCategories: categories.length,
      configuredCount: items.filter((item) => item.state === "configured").length,
      blockedCount: items.filter((item) => item.state === "blocked").length,
      productionForbiddenCount: items.filter(
        (item) => item.state === "production_forbidden"
      ).length,
      rotationRequiredCount: items.filter(
        (item) => item.rotationStatus === "required_before_activation"
      ).length,
      rawValuesVisible: false,
      envFilesCommitted: false,
    },
    founderCommandProtection: getFounderCommandProtectionSnapshot(checkedAt),
    exposurePolicy: {
      rawValuesDisplayed: false,
      valuesLogged: false,
      valuesSentToAssistant: false,
      valuesSentToCodex: false,
      valuesStoredInProductMemory: false,
      valuesAllowedInScreenshots: false,
      envFilesAllowedInGit: false,
      presenceOnlyReporting: true,
    },
    rotationReadiness: {
      status: "policy_defined",
      activationRequiresRotationReview: true,
      productionRotationActive: false,
      safeRotationOutput: "status_only_no_values",
    },
    apis: {
      founderSecretsReadiness: "/api/founder/secrets/readiness",
      founderSecurityReadiness: "/api/founder/security/readiness",
      rawSecretApi: "not_available",
    },
    truth: {
      rawSecretsExposed: false,
      apiKeysExposed: false,
      tokensExposed: false,
      passwordsExposed: false,
      secretsStoredInMemorySystems: false,
      secretsSentToAssistant: false,
      secretsSentToCodex: false,
      secretsLogged: false,
      envFilesCommitted: false,
      productionActivated: false,
      billingActivated: false,
      brokerFeedActivated: false,
      liveExecutionActivated: false,
      realMoneyRoutingActivated: false,
      socialPublishingActive: false,
      authWeakened: false,
    },
  };
}

export function getFounderSecurityReadinessSnapshot(
  checkedAt = new Date().toISOString()
): FounderSecurityReadinessSnapshot {
  const secrets = getSecretsAuthoritySnapshot(checkedAt);
  const sovereignty = getSecuritySovereigntySnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_security_readiness",
    status: "ready",
    commandProtection: secrets.founderCommandProtection,
    secretsSummary: secrets.summary,
    exposurePolicy: secrets.exposurePolicy,
    securitySovereignty: {
      status: sovereignty.status,
      authorities: sovereignty.authorities.length,
      incidentReadiness: sovereignty.incidentResponse.status,
      evidenceReadiness: sovereignty.evidenceLedger.status,
      hardeningReadiness: sovereignty.hardening.status,
    },
    truth: {
      ...secrets.truth,
      founderCommandPublic: false,
      ownerOnly: true,
    },
  };
}
