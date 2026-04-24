import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DEFAULT_DEMO_EMAIL = "demo@tradingpromax.local";
const DEFAULT_DEMO_PASSWORD = "TradingProMaxDemo!2026";

function configured(value) {
  return Boolean(value?.trim());
}

function publicSecretNamesPresent() {
  return Object.keys(process.env).filter(
    (key) => key.startsWith("NEXT_PUBLIC_") && /(SECRET|TOKEN|PASSWORD|PRIVATE|KEY)/i.test(key)
  );
}

const checks = [
  {
    key: "database_url",
    ok: configured(process.env.DATABASE_URL) && process.env.DATABASE_URL !== "file:./prisma/dev.db",
    severity: "blocker",
    detail: "Set DATABASE_URL to the production database before deployment.",
  },
  {
    key: "migration_directory",
    ok: fs.existsSync(path.join(ROOT, "prisma", "migrations")),
    severity: "blocker",
    detail: "Create and review Prisma migrations, then deploy with `prisma migrate deploy`.",
  },
  {
    key: "operator_key",
    ok: configured(process.env.TPM_OPERATOR_KEY),
    severity: "blocker",
    detail: "Set TPM_OPERATOR_KEY before operator approval/release actions are available.",
  },
  {
    key: "demo_credentials_rotated",
    ok:
      configured(process.env.TPM_DEMO_EMAIL) &&
      configured(process.env.TPM_DEMO_PASSWORD) &&
      process.env.TPM_DEMO_EMAIL !== DEFAULT_DEMO_EMAIL &&
      process.env.TPM_DEMO_PASSWORD !== DEFAULT_DEMO_PASSWORD,
    severity: "blocker",
    detail: "Rotate seeded demo credentials for the controlled beta cohort.",
  },
  {
    key: "public_secret_names",
    ok: publicSecretNamesPresent().length === 0,
    severity: "blocker",
    detail: "Remove NEXT_PUBLIC_* variables whose names imply secrets or tokens.",
  },
  {
    key: "closed_beta_allowlist",
    ok: configured(process.env.TPM_CLOSED_BETA_ALLOWLIST_EMAILS),
    severity: "warning",
    detail: "Set TPM_CLOSED_BETA_ALLOWLIST_EMAILS for the five-tester closed beta cohort.",
  },
  {
    key: "external_monitoring",
    ok: configured(process.env.TPM_OPS_EXTERNAL_MONITOR_URL),
    severity: "warning",
    detail: "External monitoring is optional but should be configured before broad rollout.",
  },
];

const blockers = checks.filter((check) => !check.ok && check.severity === "blocker");
const warnings = checks.filter((check) => !check.ok && check.severity === "warning");

for (const check of checks) {
  const state = check.ok ? "PASS" : check.severity.toUpperCase();
  console.log(`${state} ${check.key} - ${check.detail}`);
}

console.log(
  `production readiness: ${blockers.length === 0 ? "PASS" : "BLOCKED"} | blockers=${blockers.length} warnings=${warnings.length}`
);

if (blockers.length > 0) {
  process.exitCode = 1;
}
