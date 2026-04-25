import "server-only";

import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";
import {
  essentialIntegrationRegistry,
  summarizeIntegrationPriorities,
} from "./registry";
import { getAccountProvisioningSnapshot } from "./account-provisioning";
import { getCodexReadinessSnapshot } from "./codex-readiness";
import { getLocalRuntimeToolingSnapshot } from "./local-runtime";
import type { EssentialIntegrationsHubSnapshot } from "./types";

export function getEssentialIntegrationsHubSnapshot(
  checkedAt = new Date().toISOString()
): EssentialIntegrationsHubSnapshot {
  const registry = essentialIntegrationRegistry;
  const prioritySummary = summarizeIntegrationPriorities(registry);
  const codexReadiness = getCodexReadinessSnapshot(checkedAt);
  const localRuntime = getLocalRuntimeToolingSnapshot(checkedAt);
  const accountProvisioning = getAccountProvisioningSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "essential_integrations_tooling_hub",
    status: "ready",
    registry,
    prioritySummary,
    codexReadiness,
    localRuntime,
    accountProvisioning,
    founderCommandReadiness: {
      visible: true,
      publicNavigationVisible: false,
      approvalExecutionActive: false,
      automaticExternalExecution: false,
    },
    diagnosticsReadiness: {
      publicSafeSection: true,
      exposesSecrets: false,
      exposesInternalCommandDetails: false,
    },
    nextSafeSetupActions: [
      "Keep P0 local runtime, Git/GitHub, diagnostics, product memory, validation, and Founder Command readiness working.",
      "Plan support, email, secrets, security, and apps/platforms readiness without connecting external accounts.",
      "Prepare P2 staging, database, email provider, monitoring, payment, and waitlist requirements before launch gates.",
      "Keep P3 social publishing, CRM, partnerships, ads, and referrals future-only.",
    ],
    whatNotToConnectNow: [
      "billing activation",
      "broker/live execution",
      "real-money routing",
      "production secrets",
      "automatic social publishing",
      "external autopilot",
    ],
    truth: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      productionSecretsUntouched: true,
      socialPublishingInactive: true,
      noAutomaticExternalExecution: true,
      noAccountCreationAutomation: true,
      noSecretsExposed: true,
      fakeMetricsIncluded: false,
    },
  };
}

export function getFounderToolingReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const hub = getEssentialIntegrationsHubSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "founder_tooling_readiness",
    status: hub.status,
    essentialIntegrations: hub.prioritySummary,
    codexReadiness: hub.codexReadiness,
    githubReadiness:
      hub.registry.find((item) => item.id === "git-github-readiness") ??
      hub.registry[0],
    localRuntime: hub.localRuntime,
    secretsReadiness:
      hub.registry.find((item) => item.id === "secrets-readiness") ??
      hub.registry[0],
    worldInterfaceReadiness:
      hub.registry.find((item) => item.id === "email-readiness") ??
      hub.registry[0],
    appsPlatformsReadiness:
      hub.registry.find((item) => item.id === "apps-platforms-readiness") ??
      hub.registry[0],
    nextSafeSetupActions: hub.nextSafeSetupActions,
    whatNotToConnectNow: hub.whatNotToConnectNow,
    truth: hub.truth,
  };
}

export function getEssentialIntegrationsDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const hub = getEssentialIntegrationsHubSnapshot(checkedAt);

  return {
    key: "essential_integrations_tooling",
    label: "Tooling readiness",
    status: "ready",
    summary: "Essential local tooling and integration priorities are defined",
    detail:
      `${hub.prioritySummary.p0_local_required.count} P0 tools, ${hub.prioritySummary.p1_soon.count} P1 tools, ${hub.prioritySummary.p2_pre_launch.count} P2 tools, ${hub.prioritySummary.p3_post_launch.count} P3 tools, and ${hub.prioritySummary.blocked_now.count} blocked tools are classified. No shell execution, account creation, external publishing, billing, broker/live, real money, or secret exposure is enabled.`,
    checkedAt,
  };
}
