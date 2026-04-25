import "server-only";

export type IntegrationPriority =
  | "p0_local_required"
  | "p1_soon"
  | "p2_pre_launch"
  | "p3_post_launch"
  | "blocked_now";

export type IntegrationCategory =
  | "local_runtime"
  | "codex"
  | "github"
  | "diagnostics"
  | "product_memory"
  | "founder_command"
  | "secrets"
  | "email"
  | "social"
  | "support"
  | "apps_platforms"
  | "hosting_future"
  | "database_future"
  | "billing_future"
  | "broker_future"
  | "monitoring_future"
  | "media_future";

export type IntegrationStatus =
  | "active_local"
  | "ready"
  | "planned"
  | "missing"
  | "not_configured"
  | "blocked"
  | "future"
  | "forbidden_now";

export type IntegrationOwnerSurface =
  | "public_readiness"
  | "diagnostics"
  | "founder_command"
  | "local_runtime"
  | "invisible_operating_layer";

export type EssentialIntegrationTool = {
  id: string;
  name: string;
  category: IntegrationCategory;
  priority: IntegrationPriority;
  currentStatus: IntegrationStatus;
  neededFor: string[];
  ownerSurface: IntegrationOwnerSurface;
  publicVisible: boolean;
  founderVisible: boolean;
  requiresSecret: boolean;
  requiresPayment: boolean;
  requiresLegalReview: boolean;
  requiresGuardianReview: boolean;
  requiresFounderApproval: boolean;
  blockedReason: string | null;
  safeNextAction: string;
};

export type IntegrationPrioritySummary = Record<
  IntegrationPriority,
  {
    label: string;
    count: number;
    tools: string[];
  }
>;

export type CodexReadinessSnapshot = {
  checkedAt: string;
  mode: "codex_operating_model_readiness";
  localCodexCli: "configured_by_user_environment" | "planned_by_user_environment";
  codexCloud: "external_setup_planned";
  githubReviewViaCodex: "optional_future_workflow";
  agentsGuidelines: "recommended_future_hardening";
  productCanDraftPrompts: true;
  productCanSendPromptsAutomatically: false;
  productCanExecuteCodex: false;
  productCanExposeSecretsToCodex: false;
  productCanRequestBlockedActivation: false;
  safeWorkflow: string[];
  forbiddenScope: string[];
};

export type LocalRuntimeCommand = {
  command: string;
  purpose: string;
  allowedSurface: "docs_readiness_only";
  executableFromWebApp: false;
  requiresFounderReview: boolean;
};

export type LocalRuntimeToolingSnapshot = {
  checkedAt: string;
  mode: "local_runtime_tooling_readiness";
  status: "ready";
  commands: LocalRuntimeCommand[];
  webAppShellExecution: false;
  remoteCommandExecution: false;
  unsafeAutomation: false;
  safeNextAction: string;
};

export type AccountProvisioningPriority =
  | "p0"
  | "p1"
  | "p2"
  | "p3"
  | "blocked";

export type AccountProvisioningItem = {
  id: string;
  label: string;
  priority: AccountProvisioningPriority;
  status: "ready" | "planned" | "future" | "blocked";
  purpose: string;
  createsAccountAutomatically: false;
  connectsExternally: false;
  safeNextAction: string;
};

export type AccountProvisioningSnapshot = {
  checkedAt: string;
  mode: "essential_account_provisioning_planner";
  status: "ready";
  items: AccountProvisioningItem[];
  summary: Record<AccountProvisioningPriority, number>;
  noAccountCreationAutomation: true;
  noExternalConnection: true;
  noSecretsStored: true;
};

export type EssentialIntegrationsHubSnapshot = {
  checkedAt: string;
  mode: "essential_integrations_tooling_hub";
  status: "ready";
  registry: EssentialIntegrationTool[];
  prioritySummary: IntegrationPrioritySummary;
  codexReadiness: CodexReadinessSnapshot;
  localRuntime: LocalRuntimeToolingSnapshot;
  accountProvisioning: AccountProvisioningSnapshot;
  founderCommandReadiness: {
    visible: true;
    publicNavigationVisible: false;
    approvalExecutionActive: false;
    automaticExternalExecution: false;
  };
  diagnosticsReadiness: {
    publicSafeSection: true;
    exposesSecrets: false;
    exposesInternalCommandDetails: false;
  };
  nextSafeSetupActions: string[];
  whatNotToConnectNow: string[];
  truth: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    productionSecretsUntouched: true;
    socialPublishingInactive: true;
    noAutomaticExternalExecution: true;
    noAccountCreationAutomation: true;
    noSecretsExposed: true;
    fakeMetricsIncluded: false;
  };
};
