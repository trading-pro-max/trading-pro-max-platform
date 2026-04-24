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

export type ProductionDeploymentReadinessSnapshot = {
  checkedAt: string;
  environment: {
    nodeEnv: string;
    databaseUrlConfigured: boolean;
    usingLocalSqlite: boolean;
    trustProxyHeaders: "disabled" | "enabled";
    bearerAuth: "disabled" | "enabled";
  };
  secrets: {
    demoCredentialsDefaulted: boolean;
    operatorKeyConfigured: boolean;
    publicSecretLeakRisk: "none_detected" | "public_secret_key_names_present";
    secretExposurePolicy: "presence_only";
  };
  database: {
    migrationsDirectoryPresent: boolean;
    productionDatabaseRequired: true;
    migrationCommand: "prisma migrate deploy";
    seedPolicy: "manual_demo_seed_only";
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

function usesDefaultDemoCredentials() {
  const defaultEmail = "demo@tradingpromax.local";
  const defaultPassword = "TradingProMaxDemo!2026";

  return (
    !process.env.TPM_DEMO_EMAIL ||
    process.env.TPM_DEMO_EMAIL === defaultEmail ||
    !process.env.TPM_DEMO_PASSWORD ||
    process.env.TPM_DEMO_PASSWORD === defaultPassword
  );
}

function publicSecretKeyNamesPresent() {
  return Object.keys(process.env).some((key) => {
    if (!key.startsWith("NEXT_PUBLIC_")) return false;
    return /(SECRET|TOKEN|PASSWORD|PRIVATE|KEY)/i.test(key);
  });
}

function buildChecklist(input: {
  databaseUrlConfigured: boolean;
  migrationsDirectoryPresent: boolean;
  operatorKeyConfigured: boolean;
  defaultDemoCredentials: boolean;
  publicSecretNamesPresent: boolean;
  productionRuntime: boolean;
}): ChecklistItem[] {
  return [
    {
      key: "production_database_url",
      ok: input.databaseUrlConfigured,
      severity: input.databaseUrlConfigured ? "pass" : "blocker",
      detail:
        "Production deployment must set DATABASE_URL to a managed production database, not the local sqlite fallback.",
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
      ok: input.operatorKeyConfigured,
      severity: input.operatorKeyConfigured ? "pass" : "blocker",
      detail:
        "TPM_OPERATOR_KEY must be configured before operator approval or guarded release actions are available in production.",
    },
    {
      key: "demo_credentials_rotated",
      ok: !input.defaultDemoCredentials,
      severity: input.defaultDemoCredentials ? "blocker" : "pass",
      detail:
        "Seeded demo credentials must be rotated for controlled testers before production-like use.",
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
  const databaseUrlConfigured = isConfigured(process.env.DATABASE_URL) &&
    databaseUrl !== LOCAL_SQLITE_DATABASE_URL;
  const migrationsDirectoryPresent = existsSync(join(process.cwd(), "prisma", "migrations"));
  const operatorKeyConfigured = isConfigured(process.env.TPM_OPERATOR_KEY);
  const defaultDemoCredentials = usesDefaultDemoCredentials();
  const publicSecretNamesPresent = publicSecretKeyNamesPresent();
  const productionRuntime = process.env.NODE_ENV === "production";
  const checklist = buildChecklist({
    databaseUrlConfigured,
    migrationsDirectoryPresent,
    operatorKeyConfigured,
    defaultDemoCredentials,
    publicSecretNamesPresent,
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
      { key: "production_database_url", ok: databaseUrlConfigured, weight: 25 },
      { key: "migration_directory", ok: migrationsDirectoryPresent, weight: 20 },
      { key: "operator_key", ok: operatorKeyConfigured, weight: 15 },
      { key: "demo_credentials_rotated", ok: !defaultDemoCredentials, weight: 15 },
      { key: "public_secret_names", ok: !publicSecretNamesPresent, weight: 10 },
      { key: "startup_baseline", ok: true, weight: 10 },
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
      databaseUrlConfigured,
      usingLocalSqlite: databaseUrl === LOCAL_SQLITE_DATABASE_URL,
      trustProxyHeaders: envIsTrue(process.env.TPM_TRUST_PROXY_HEADERS)
        ? "enabled"
        : "disabled",
      bearerAuth: envIsTrue(process.env.TPM_ALLOW_AUTHORIZATION_BEARER)
        ? "enabled"
        : "disabled",
    },
    secrets: {
      demoCredentialsDefaulted: defaultDemoCredentials,
      operatorKeyConfigured,
      publicSecretLeakRisk: publicSecretNamesPresent
        ? "public_secret_key_names_present"
        : "none_detected",
      secretExposurePolicy: "presence_only",
    },
    database: {
      migrationsDirectoryPresent,
      productionDatabaseRequired: true,
      migrationCommand: "prisma migrate deploy",
      seedPolicy: "manual_demo_seed_only",
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
