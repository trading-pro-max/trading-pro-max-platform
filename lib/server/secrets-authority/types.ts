import "server-only";

export type SecretReadinessState =
  | "not_configured"
  | "configured"
  | "missing"
  | "invalid_format"
  | "expired"
  | "rotation_required"
  | "blocked"
  | "production_forbidden";

export type SecretEnvironment =
  | "local"
  | "staging_future"
  | "production_future"
  | "blocked";

export type SecretCategory =
  | "email"
  | "social"
  | "market_data"
  | "broker_future"
  | "billing_future"
  | "monitoring_future"
  | "founder_command"
  | "github_vercel_domain_readiness";

export type SecretReadinessItem = {
  id: string;
  category: SecretCategory;
  label: string;
  environment: SecretEnvironment;
  state: SecretReadinessState;
  valueVisible: false;
  valueHashVisible: false;
  valueSourceVisible: false;
  rotationStatus: "not_started" | "planned" | "required_before_activation";
  allowedManagement: string[];
  blockedActions: string[];
  founderCommandVisible: true;
  safeNextAction: string;
};

export type FounderCommandProtectionReadiness = {
  checkedAt: string;
  mode: "founder_command_protection_readiness";
  status: "readiness_only";
  ownerOnly: true;
  localOnly: true;
  passkeyWebAuthn: "planned";
  biometricDevice: "planned";
  pin: "planned";
  trustedDevice: "planned";
  stepUpConfirmation: "planned";
  auditReadiness: "readiness_only";
  noPublicRoute: true;
  publicNavigationVisible: false;
  userPlanAccess: false;
  freeProVipInstitutionalAccess: false;
  rawSecretsVisible: false;
  approvalExecutionActive: false;
  dangerousActionsBlocked: true;
};

export type SecretsAuthoritySnapshot = {
  checkedAt: string;
  mode: "secrets_authority_readiness";
  status: "ready";
  coreRule: string;
  supportedStates: SecretReadinessState[];
  environments: SecretEnvironment[];
  categories: SecretCategory[];
  items: SecretReadinessItem[];
  summary: {
    totalCategories: number;
    configuredCount: number;
    blockedCount: number;
    productionForbiddenCount: number;
    rotationRequiredCount: number;
    rawValuesVisible: false;
    envFilesCommitted: false;
  };
  founderCommandProtection: FounderCommandProtectionReadiness;
  exposurePolicy: {
    rawValuesDisplayed: false;
    valuesLogged: false;
    valuesSentToAssistant: false;
    valuesSentToCodex: false;
    valuesStoredInProductMemory: false;
    valuesAllowedInScreenshots: false;
    envFilesAllowedInGit: false;
    presenceOnlyReporting: true;
  };
  rotationReadiness: {
    status: "policy_defined";
    activationRequiresRotationReview: true;
    productionRotationActive: false;
    safeRotationOutput: "status_only_no_values";
  };
  apis: {
    founderSecretsReadiness: "/api/founder/secrets/readiness";
    founderSecurityReadiness: "/api/founder/security/readiness";
    rawSecretApi: "not_available";
  };
  truth: {
    rawSecretsExposed: false;
    apiKeysExposed: false;
    tokensExposed: false;
    passwordsExposed: false;
    secretsStoredInMemorySystems: false;
    secretsSentToAssistant: false;
    secretsSentToCodex: false;
    secretsLogged: false;
    envFilesCommitted: false;
    productionActivated: false;
    billingActivated: false;
    brokerFeedActivated: false;
    liveExecutionActivated: false;
    realMoneyRoutingActivated: false;
    socialPublishingActive: false;
    authWeakened: false;
  };
};

export type FounderSecurityReadinessSnapshot = {
  checkedAt: string;
  mode: "founder_security_readiness";
  status: "ready";
  commandProtection: FounderCommandProtectionReadiness;
  secretsSummary: SecretsAuthoritySnapshot["summary"];
  exposurePolicy: SecretsAuthoritySnapshot["exposurePolicy"];
  securitySovereignty: {
    status: "ready";
    authorities: number;
    incidentReadiness: string;
    evidenceReadiness: string;
    hardeningReadiness: string;
  };
  truth: SecretsAuthoritySnapshot["truth"] & {
    founderCommandPublic: false;
    ownerOnly: true;
  };
};
