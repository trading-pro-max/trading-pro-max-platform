import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { LOCAL_SQLITE_DATABASE_URL, getPrismaDatabaseUrl } from "@/lib/db/prisma-foundation";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

type ProductionDeploymentStage =
  | "local_verified"
  | "production_requirements_visible"
  | "deployment_ready_guarded";

type ChecklistItem = {
  key: string;
  ok: boolean;
  severity: "blocker" | "warning" | "pass";
  detail: string;
};

type DeploymentTarget = "local" | "staging" | "production";
type DatabaseProviderTruth =
  | "missing"
  | "local_sqlite"
  | "persistent_sqlite"
  | "external_managed"
  | "unsupported";

export type ProductionDeploymentReadinessSnapshot = {
  checkedAt: string;
  environment: {
    nodeEnv: string;
    deploymentTarget: DeploymentTarget;
    databaseUrlConfigured: boolean;
    usingLocalSqlite: boolean;
    trustProxyHeaders: "disabled" | "enabled";
    bearerAuth: "disabled" | "enabled";
  };
  secrets: {
    demoCredentialsRotated: boolean;
    operatorCredentialsRotated: boolean;
    operatorKeyConfigured: boolean;
    operatorKeyStrength: "missing" | "weak_or_default" | "configured_guarded";
    publicSecretLeakRisk: "none_detected" | "public_secret_key_names_present";
    secretExposurePolicy: "presence_only";
  };
  database: {
    providerTruth: DatabaseProviderTruth;
    migrationsDirectoryPresent: boolean;
    productionDatabaseRequired: true;
    migrationCommand: "prisma migrate deploy";
    seedPolicy: "manual_demo_seed_only";
  };
  closedBeta: {
    accessModel: "allowlist_only";
    allowlistConfigured: boolean;
    emailEntries: number;
    accountEntries: number;
    minimumEntries: number;
  };
  monitoring: {
    state: "configured_guarded" | "unconfigured";
    providerConfigured: boolean;
    endpointConfigured: boolean;
    keyConfigured: boolean;
    secretExposurePolicy: "presence_only";
  };
  startup: {
    buildRequired: true;
    baselineVerifier: "scripts/verify-runtime-baseline.mjs";
    runtimeCommand: "npm start";
    healthRoute: "/api/health";
  };
  rollback: {
    strategy: "manual_checkpoint_restore";
    requiredArtifacts: string[];
    recoveryRoute: "/api/ops/recovery";
    diagnosticsRoute: "/api/diagnostics/probes";
  };
  readiness: {
    score: number;
    stage: ProductionDeploymentStage;
  };
  checklist: ChecklistItem[];
  blockers: string[];
  warnings: string[];
  summary: string;
  detail: string;
};

function envIsTrue(value: string | null | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function isConfigured(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function normalize(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function parseCsv(value: string | null | undefined) {
  return normalize(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getDeploymentTarget(): DeploymentTarget {
  const target = normalize(process.env.TPM_DEPLOYMENT_TARGET).toLowerCase();

  if (target === "local" || target === "staging" || target === "production") {
    return target;
  }

  return "production";
}

function hasMinimumSecretShape(value: string | null | undefined, minLength: number) {
  const normalized = normalize(value);
  if (normalized.length < minLength) return false;

  const characterClasses = [
    /[a-z]/.test(normalized),
    /[A-Z]/.test(normalized),
    /[0-9]/.test(normalized),
    /[^A-Za-z0-9]/.test(normalized),
  ].filter(Boolean).length;

  return characterClasses >= 3;
}

function getCredentialRotation() {
  const demoEmail = normalize(process.env.TPM_DEMO_EMAIL);
  const demoPassword = normalize(process.env.TPM_DEMO_PASSWORD);
  const operatorEmail = normalize(process.env.TPM_OPERATOR_EMAIL);
  const operatorPassword = normalize(process.env.TPM_OPERATOR_PASSWORD);
  const demoRotated =
    isConfigured(demoEmail) &&
    isConfigured(demoPassword) &&
    demoEmail !== "demo@tradingpromax.local" &&
    demoPassword !== "TradingProMaxDemo!2026" &&
    !demoEmail.endsWith(".local") &&
    hasMinimumSecretShape(demoPassword, 16);
  const operatorRotated =
    isConfigured(operatorEmail) &&
    isConfigured(operatorPassword) &&
    operatorEmail !== "operator@tradingpromax.local" &&
    operatorPassword !== "TradingProMaxOperator!2026" &&
    !operatorEmail.endsWith(".local") &&
    hasMinimumSecretShape(operatorPassword, 16);

  return {
    demoRotated,
    operatorRotated,
    credentialsRotated: demoRotated && operatorRotated && demoEmail !== operatorEmail,
  };
}

function getOperatorKeyStrength() {
  const operatorKey = normalize(process.env.TPM_OPERATOR_KEY);

  if (!operatorKey) return "missing" as const;
  if (
    operatorKey === "local-operator-review-key" ||
    /^(?:local|dev|development|test|operator|password)/i.test(operatorKey) ||
    !hasMinimumSecretShape(operatorKey, 32)
  ) {
    return "weak_or_default" as const;
  }

  return "configured_guarded" as const;
}

function databaseProviderTruth(databaseUrl: string): DatabaseProviderTruth {
  const normalized = normalize(databaseUrl).replaceAll("\\", "/").toLowerCase();

  if (!normalized) return "missing";
  if (
    normalized === LOCAL_SQLITE_DATABASE_URL ||
    normalized.startsWith("file:./") ||
    normalized.startsWith("file:../") ||
    normalized.includes("/prisma/dev.db")
  ) {
    return "local_sqlite";
  }
  if (normalized.startsWith("file:/") && !normalized.startsWith("file://")) {
    return "persistent_sqlite";
  }
  if (/^(?:postgresql|postgres|mysql|sqlserver):\/\//i.test(normalized)) {
    return "external_managed";
  }

  return "unsupported";
}

function publicSecretKeyNamesPresent() {
  return Object.keys(process.env).some((key) => {
    if (!key.startsWith("NEXT_PUBLIC_")) return false;
    return /(SECRET|TOKEN|PASSWORD|PRIVATE|KEY)/i.test(key);
  });
}

function buildChecklist(input: {
  databaseUrlConfigured: boolean;
  databaseProvider: DatabaseProviderTruth;
  migrationsDirectoryPresent: boolean;
  operatorKeyStrength: ReturnType<typeof getOperatorKeyStrength>;
  credentialsRotated: boolean;
  publicSecretNamesPresent: boolean;
  closedBetaAllowlistConfigured: boolean;
  monitoringConfigured: boolean;
  productionRuntime: boolean;
}): ChecklistItem[] {
  return [
    {
      key: "production_database_url",
      ok: input.databaseUrlConfigured,
      severity: input.databaseUrlConfigured ? "pass" : "blocker",
      detail:
        input.databaseProvider === "local_sqlite"
          ? "Production deployment must not use the local SQLite fallback."
          : "Production deployment must set DATABASE_URL to a managed production database or a persistent database URL.",
    },
    {
      key: "migration_directory",
      ok: input.migrationsDirectoryPresent,
      severity: input.migrationsDirectoryPresent ? "pass" : "blocker",
      detail:
        "A production rollout needs a checked migration directory and `prisma migrate deploy` plan.",
    },
    {
      key: "operator_key",
      ok: input.operatorKeyStrength === "configured_guarded",
      severity:
        input.operatorKeyStrength === "configured_guarded" ? "pass" : "blocker",
      detail:
        "TPM_OPERATOR_KEY must be present, high entropy, and not a local/default operator key.",
    },
    {
      key: "credentials_rotated",
      ok: input.credentialsRotated,
      severity: input.credentialsRotated ? "pass" : "blocker",
      detail:
        "Seeded demo and operator credentials must be rotated for controlled testers before production-like use.",
    },
    {
      key: "closed_beta_allowlist",
      ok: input.closedBetaAllowlistConfigured,
      severity: input.closedBetaAllowlistConfigured ? "pass" : "blocker",
      detail:
        "Closed beta access must be constrained by email/account allowlist before production-like use.",
    },
    {
      key: "external_monitoring",
      ok: input.monitoringConfigured,
      severity: input.monitoringConfigured ? "pass" : "blocker",
      detail:
        "External monitoring provider, endpoint, and secret key must be configured before production launch readiness.",
    },
    {
      key: "public_secret_names",
      ok: !input.publicSecretNamesPresent,
      severity: input.publicSecretNamesPresent ? "blocker" : "pass",
      detail:
        "No NEXT_PUBLIC_* variable name should look like a secret, token, private key, or password.",
    },
    {
      key: "production_runtime",
      ok: input.productionRuntime,
      severity: input.productionRuntime ? "pass" : "warning",
      detail:
        "Run final deployment verification with NODE_ENV=production, `npm run build`, and `npm start`.",
    },
  ];
}

export function getProductionDeploymentReadinessSnapshot(
  checkedAt = new Date().toISOString()
): ProductionDeploymentReadinessSnapshot {
  const databaseUrl = getPrismaDatabaseUrl();
  const deploymentTarget = getDeploymentTarget();
  const databaseProvider = databaseProviderTruth(databaseUrl);
  const databaseUrlConfigured =
    isConfigured(process.env.DATABASE_URL) &&
    (databaseProvider === "persistent_sqlite" ||
      databaseProvider === "external_managed");
  const migrationsDirectoryPresent = existsSync(join(process.cwd(), "prisma", "migrations"));
  const operatorKeyStrength = getOperatorKeyStrength();
  const operatorKeyConfigured = operatorKeyStrength === "configured_guarded";
  const credentials = getCredentialRotation();
  const publicSecretNamesPresent = publicSecretKeyNamesPresent();
  const emailAllowlist = parseCsv(process.env.TPM_CLOSED_BETA_ALLOWLIST_EMAILS);
  const accountAllowlist = parseCsv(process.env.TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS);
  const minimumEntries = deploymentTarget === "production" ? 5 : 1;
  const closedBetaAllowlistConfigured =
    emailAllowlist.length + accountAllowlist.length >= minimumEntries;
  const monitoringProviderConfigured = isConfigured(
    process.env.TPM_OPS_EXTERNAL_MONITOR_PROVIDER
  );
  const monitoringEndpointConfigured =
    isConfigured(process.env.TPM_OPS_EXTERNAL_MONITOR_URL) &&
    normalize(process.env.TPM_OPS_EXTERNAL_MONITOR_URL).startsWith("https://");
  const monitoringKeyConfigured = hasMinimumSecretShape(
    process.env.TPM_OPS_EXTERNAL_MONITOR_KEY,
    24
  );
  const monitoringConfigured =
    monitoringProviderConfigured &&
    monitoringEndpointConfigured &&
    monitoringKeyConfigured;
  const productionRuntime = process.env.NODE_ENV === "production";
  const checklist = buildChecklist({
    databaseUrlConfigured,
    databaseProvider,
    migrationsDirectoryPresent,
    operatorKeyStrength,
    credentialsRotated: credentials.credentialsRotated,
    publicSecretNamesPresent,
    closedBetaAllowlistConfigured,
    monitoringConfigured,
    productionRuntime,
  });
  const blockers = checklist
    .filter((item) => !item.ok && item.severity === "blocker")
    .map((item) => item.key);
  const warnings = checklist
    .filter((item) => !item.ok && item.severity === "warning")
    .map((item) => item.key);
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "production_database_url", ok: databaseUrlConfigured, weight: 20 },
      { key: "migration_directory", ok: migrationsDirectoryPresent, weight: 10 },
      { key: "operator_key", ok: operatorKeyConfigured, weight: 15 },
      { key: "credentials_rotated", ok: credentials.credentialsRotated, weight: 15 },
      { key: "closed_beta_allowlist", ok: closedBetaAllowlistConfigured, weight: 10 },
      { key: "external_monitoring", ok: monitoringConfigured, weight: 10 },
      { key: "public_secret_names", ok: !publicSecretNamesPresent, weight: 10 },
      { key: "startup_baseline", ok: true, weight: 5 },
      { key: "rollback_contract", ok: true, weight: 5 },
    ],
    stageThresholds: [
      { stage: "local_verified", minScore: 0 },
      { stage: "production_requirements_visible", minScore: 55 },
      { stage: "deployment_ready_guarded", minScore: 90 },
    ],
  });

  return {
    checkedAt,
    environment: {
      nodeEnv: process.env.NODE_ENV ?? "undefined",
      deploymentTarget,
      databaseUrlConfigured,
      usingLocalSqlite: databaseProvider === "local_sqlite",
      trustProxyHeaders: envIsTrue(process.env.TPM_TRUST_PROXY_HEADERS)
        ? "enabled"
        : "disabled",
      bearerAuth: envIsTrue(process.env.TPM_ALLOW_AUTHORIZATION_BEARER)
        ? "enabled"
        : "disabled",
    },
    secrets: {
      demoCredentialsRotated: credentials.demoRotated,
      operatorCredentialsRotated: credentials.operatorRotated,
      operatorKeyConfigured,
      operatorKeyStrength,
      publicSecretLeakRisk: publicSecretNamesPresent
        ? "public_secret_key_names_present"
        : "none_detected",
      secretExposurePolicy: "presence_only",
    },
    database: {
      providerTruth: databaseProvider,
      migrationsDirectoryPresent,
      productionDatabaseRequired: true,
      migrationCommand: "prisma migrate deploy",
      seedPolicy: "manual_demo_seed_only",
    },
    closedBeta: {
      accessModel: "allowlist_only",
      allowlistConfigured: closedBetaAllowlistConfigured,
      emailEntries: emailAllowlist.length,
      accountEntries: accountAllowlist.length,
      minimumEntries,
    },
    monitoring: {
      state: monitoringConfigured ? "configured_guarded" : "unconfigured",
      providerConfigured: monitoringProviderConfigured,
      endpointConfigured: monitoringEndpointConfigured,
      keyConfigured: monitoringKeyConfigured,
      secretExposurePolicy: "presence_only",
    },
    startup: {
      buildRequired: true,
      baselineVerifier: "scripts/verify-runtime-baseline.mjs",
      runtimeCommand: "npm start",
      healthRoute: "/api/health",
    },
    rollback: {
      strategy: "manual_checkpoint_restore",
      requiredArtifacts: [
        "last successful git commit",
        "database migration backup/checkpoint",
        "diagnostics snapshot",
        "operator incident note",
      ],
      recoveryRoute: "/api/ops/recovery",
      diagnosticsRoute: "/api/diagnostics/probes",
    },
    readiness: {
      score: readiness.score,
      stage: readiness.stage as ProductionDeploymentStage,
    },
    checklist,
    blockers,
    warnings,
    summary:
      blockers.length === 0
        ? "Production deployment readiness is guarded and explicit."
        : "Production deployment blockers are explicit and machine-readable.",
    detail:
      blockers.length === 0
        ? "Build/startup verification, secret discipline, database/migration requirements, and rollback contracts are visible for controlled deployment."
        : `Missing production requirements: ${blockers.join(", ")}.`,
  };
}

export function getProductionDeploymentDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getProductionDeploymentReadinessSnapshot(checkedAt);

  return {
    key: "production_deployment_readiness",
    label: "Production deployment readiness",
    status: snapshot.blockers.length === 0 ? "ready" : "blocked",
    summary: snapshot.summary,
    detail:
      `Deployment readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}); ` +
      `blockers=${snapshot.blockers.length}, warnings=${snapshot.warnings.length}.`,
    checkedAt,
  };
}
