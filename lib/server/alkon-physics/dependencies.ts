import "server-only";

import type { CosmicDependency, OrbitPath } from "./types";

export const COSMIC_DEPENDENCIES: Record<OrbitPath, CosmicDependency[]> = {
  public_ui_orbit: [
    {
      dependencyId: "public-ui-surface-boundaries",
      orbitPath: "public_ui_orbit",
      title: "Surface Boundaries and Product Truth",
      requiredBefore: "public UI work",
      status: "ready",
    },
  ],
  visual_identity_orbit: [
    {
      dependencyId: "logo-brand-identity",
      orbitPath: "visual_identity_orbit",
      title: "Brand Identity, Visual Acceptance, and Memory",
      requiredBefore: "logo or Earth identity work",
      status: "ready",
    },
  ],
  chart_workspace_orbit: [
    {
      dependencyId: "chart-workstation-proof",
      orbitPath: "chart_workspace_orbit",
      title: "Chart Satellite, Workstation, and Visual Proof",
      requiredBefore: "chart comfort acceptance",
      status: "ready",
    },
  ],
  assistant_orbit: [
    {
      dependencyId: "assistant-safety-boundary",
      orbitPath: "assistant_orbit",
      title: "Assistant safety boundary and plan state",
      requiredBefore: "Assistant behavior change",
      status: "ready",
    },
  ],
  journal_coach_orbit: [
    {
      dependencyId: "journal-coach-safety",
      orbitPath: "journal_coach_orbit",
      title: "No-advice Coach safety contract",
      requiredBefore: "Coach depth change",
      status: "ready",
    },
  ],
  plans_realms_orbit: [
    {
      dependencyId: "plan-entitlements-product-truth",
      orbitPath: "plans_realms_orbit",
      title: "Plan Entitlements and Product Truth",
      requiredBefore: "plan realm behavior change",
      status: "ready",
    },
  ],
  apps_support_orbit: [
    {
      dependencyId: "support-world-interface-boundary",
      orbitPath: "apps_support_orbit",
      title: "World Interface and Public User World",
      requiredBefore: "Apps or Support readiness",
      status: "ready",
    },
  ],
  security_orbit: [
    {
      dependencyId: "security-sovereignty-secrets",
      orbitPath: "security_orbit",
      title: "Security Sovereignty and Secrets Authority",
      requiredBefore: "security work",
      status: "ready",
    },
  ],
  secrets_orbit: [
    {
      dependencyId: "secrets-authority-presence-only",
      orbitPath: "secrets_orbit",
      title: "Secrets Authority presence-only rule",
      requiredBefore: "secret risk report",
      status: "ready",
    },
  ],
  codex_construction_orbit: [
    {
      dependencyId: "codex-sovereignty-task-passport",
      orbitPath: "codex_construction_orbit",
      title: "Codex Sovereignty, Task Passport, and Permit",
      requiredBefore: "Codex draft readiness",
      status: "ready",
    },
  ],
  media_world_interface_orbit: [
    {
      dependencyId: "world-interface-quarantine",
      orbitPath: "media_world_interface_orbit",
      title: "World Interface quarantine and no-token rule",
      requiredBefore: "external channel readiness",
      status: "review_required",
    },
  ],
  memory_orbit: [
    {
      dependencyId: "memory-no-secrets",
      orbitPath: "memory_orbit",
      title: "Safe memory, no secrets, no private sensitive data",
      requiredBefore: "memory update",
      status: "ready",
    },
  ],
  local_day_orbit: [
    {
      dependencyId: "local-day-product-truth",
      orbitPath: "local_day_orbit",
      title: "Local day report and Product Truth status",
      requiredBefore: "Founder daily report",
      status: "ready",
    },
  ],
  launch_forbidden_orbit: [
    {
      dependencyId: "product-truth-hard-block",
      orbitPath: "launch_forbidden_orbit",
      title: "Product Truth hard block",
      requiredBefore: "any activation discussion",
      status: "blocked",
    },
  ],
};

export function getCosmicDependencies(orbitPath: OrbitPath): CosmicDependency[] {
  return COSMIC_DEPENDENCIES[orbitPath];
}
