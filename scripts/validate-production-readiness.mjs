import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const JSON_OUTPUT = args.has("--json");

const DEFAULTS = {
  databaseUrl: "file:./prisma/dev.db",
  demoEmail: "demo@tradingpromax.local",
  demoPassword: "TradingProMaxDemo!2026",
  operatorEmail: "operator@tradingpromax.local",
  operatorPassword: "TradingProMaxOperator!2026",
  localOperatorKey: "local-operator-review-key",
};

const PLACEHOLDER_PATTERN =
  /^(?:change-?me|todo|unset|replace-?me|example|placeholder|<.*>|\[.*\])$/i;

function configured(value) {
  return Boolean(value?.trim());
}

function normalize(value) {
  return value?.trim() ?? "";
}

function csv(value) {
  return normalize(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isPlaceholder(value) {
  const normalized = normalize(value);
  return !normalized || PLACEHOLDER_PATTERN.test(normalized);
}

function hasMinimumSecretShape(value, minLength = 32) {
  const normalized = normalize(value);
  if (normalized.length < minLength) return false;
  if (isPlaceholder(normalized)) return false;

  const classes = [
    /[a-z]/.test(normalized),
    /[A-Z]/.test(normalized),
    /[0-9]/.test(normalized),
    /[^A-Za-z0-9]/.test(normalized),
  ].filter(Boolean).length;

  return classes >= 3;
}

function publicSecretNamesPresent() {
  return Object.keys(process.env).filter(
    (key) =>
      key.startsWith("NEXT_PUBLIC_") &&
      /(SECRET|TOKEN|PASSWORD|PRIVATE|KEY)/i.test(key)
  );
}

function deploymentTarget() {
  const target = normalize(process.env.TPM_DEPLOYMENT_TARGET).toLowerCase();
  if (target === "local" || target === "staging" || target === "production") {
    return target;
  }

  return "production";
}

function launchMode() {
  const mode = normalize(process.env.TPM_LAUNCH_MODE).toLowerCase();
  if (
    mode === "local_dev" ||
    mode === "staging" ||
    mode === "closed_beta" ||
    mode === "production"
  ) {
    return mode;
  }

  return "closed_beta";
}

function isProbablyLocalSqlitePath(databaseUrl) {
  const value = normalize(databaseUrl).replaceAll("\\", "/").toLowerCase();
  if (!value) return false;
  if (value === DEFAULTS.databaseUrl) return true;
  if (value.startsWith("file:./") || value.startsWith("file:../")) return true;
  if (value.includes("/prisma/dev.db")) return true;
  if (value.includes("/node_modules/")) return true;
  if (value.includes("/desktop/trading-pro-max-platform/")) return true;
  return false;
}

function databaseReadiness() {
  const databaseUrl = normalize(process.env.DATABASE_URL);
  const configuredDatabase = configured(databaseUrl);
  const localSqlite = isProbablyLocalSqlitePath(databaseUrl);
  const absolutePersistentSqlite =
    databaseUrl.startsWith("file:/") && !databaseUrl.startsWith("file://") && !localSqlite;
  const externalManagedUrl =
    /^(?:postgresql|postgres|mysql|sqlserver):\/\//i.test(databaseUrl);
  const provider =
    externalManagedUrl
      ? "external_managed"
      : absolutePersistentSqlite
        ? "persistent_sqlite"
        : localSqlite
          ? "local_sqlite"
          : configuredDatabase
            ? "unsupported"
            : "missing";

  return {
    ok: configuredDatabase && !localSqlite && (absolutePersistentSqlite || externalManagedUrl),
    provider,
    configured: configuredDatabase,
    localSqlite,
    detail:
      provider === "missing"
        ? "Set DATABASE_URL in the deployment secret store."
        : provider === "local_sqlite"
          ? "Replace the local SQLite fallback with a production database URL."
          : provider === "unsupported"
            ? "Use a production-supported database URL such as an absolute persistent file: path or managed SQL URL."
            : "DATABASE_URL is present and not the local development fallback.",
  };
}

function operatorKeyReadiness() {
  const key = normalize(process.env.TPM_OPERATOR_KEY);
  const localKeyEnabled = normalize(process.env.TPM_ALLOW_LOCAL_OPERATOR_KEY) === "true";
  const forbidden =
    key === DEFAULTS.localOperatorKey ||
    /^(?:local|dev|development|test|operator|password)/i.test(key);
  const strong = hasMinimumSecretShape(key, 32);

  return {
    ok: strong && !forbidden,
    configured: configured(key),
    localKeyEnabled,
    detail: !configured(key)
      ? "Set TPM_OPERATOR_KEY in the deployment secret store."
      : forbidden
        ? "Replace TPM_OPERATOR_KEY; local/default operator keys are never production-valid."
        : !strong
          ? "Use a high-entropy TPM_OPERATOR_KEY of at least 32 characters."
          : "TPM_OPERATOR_KEY is configured with acceptable presence/strength.",
  };
}

function credentialRotationReadiness() {
  const demoEmail = normalize(process.env.TPM_DEMO_EMAIL);
  const demoPassword = normalize(process.env.TPM_DEMO_PASSWORD);
  const operatorEmail = normalize(process.env.TPM_OPERATOR_EMAIL);
  const operatorPassword = normalize(process.env.TPM_OPERATOR_PASSWORD);
  const demoRotated =
    configured(demoEmail) &&
    configured(demoPassword) &&
    demoEmail !== DEFAULTS.demoEmail &&
    demoPassword !== DEFAULTS.demoPassword &&
    !demoEmail.endsWith(".local") &&
    hasMinimumSecretShape(demoPassword, 16);
  const operatorRotated =
    configured(operatorEmail) &&
    configured(operatorPassword) &&
    operatorEmail !== DEFAULTS.operatorEmail &&
    operatorPassword !== DEFAULTS.operatorPassword &&
    !operatorEmail.endsWith(".local") &&
    hasMinimumSecretShape(operatorPassword, 16);

  return {
    ok: demoRotated && operatorRotated && demoEmail !== operatorEmail,
    demoRotated,
    operatorRotated,
    detail:
      demoRotated && operatorRotated && demoEmail !== operatorEmail
        ? "Demo and operator seed credentials are rotated away from local defaults."
        : "Set rotated TPM_DEMO_* and TPM_OPERATOR_* credentials; local defaults are blocked.",
  };
}

function allowlistReadiness(target) {
  const emailEntries = csv(process.env.TPM_CLOSED_BETA_ALLOWLIST_EMAILS);
  const accountEntries = csv(process.env.TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS);
  const totalEntries = emailEntries.length + accountEntries.length;
  const minimumEntries = target === "production" ? 5 : 1;

  return {
    ok: totalEntries >= minimumEntries,
    configured: totalEntries > 0,
    emailEntries: emailEntries.length,
    accountEntries: accountEntries.length,
    minimumEntries,
    detail:
      totalEntries === 0
        ? "Set TPM_CLOSED_BETA_ALLOWLIST_EMAILS or TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS."
        : totalEntries < minimumEntries
          ? `Add at least ${minimumEntries} closed-beta allowlist entr${minimumEntries === 1 ? "y" : "ies"} for this target.`
          : "Closed beta allowlist is configured and capacity-scoped.",
  };
}

function monitoringReadiness(target, mode) {
  const provider = normalize(process.env.TPM_OPS_EXTERNAL_MONITOR_PROVIDER);
  const endpoint = normalize(process.env.TPM_OPS_EXTERNAL_MONITOR_URL);
  const key = normalize(process.env.TPM_OPS_EXTERNAL_MONITOR_KEY);
  const configuredMonitoring =
    configured(provider) &&
    configured(endpoint) &&
    /^https:\/\//i.test(endpoint) &&
    hasMinimumSecretShape(key, 24);
  const required = target === "production" || mode === "production";

  return {
    ok: configuredMonitoring,
    required,
    providerConfigured: configured(provider) && !isPlaceholder(provider),
    endpointConfigured: configured(endpoint) && /^https:\/\//i.test(endpoint),
    keyConfigured: hasMinimumSecretShape(key, 24),
    detail: configuredMonitoring
      ? "External monitoring provider, HTTPS endpoint, and secret key are configured."
      : "Configure TPM_OPS_EXTERNAL_MONITOR_PROVIDER, TPM_OPS_EXTERNAL_MONITOR_URL, and TPM_OPS_EXTERNAL_MONITOR_KEY.",
  };
}

function check(key, ok, severity, detail, metadata = {}) {
  return {
    key,
    ok,
    severity: ok ? "pass" : severity,
    detail,
    metadata,
  };
}

const target = deploymentTarget();
const mode = launchMode();
const database = databaseReadiness();
const operatorKey = operatorKeyReadiness();
const credentials = credentialRotationReadiness();
const allowlist = allowlistReadiness(target);
const monitoring = monitoringReadiness(target, mode);
const publicSecretNames = publicSecretNamesPresent();
const migrationsPresent = fs.existsSync(path.join(ROOT, "prisma", "migrations"));
const productionRuntime = process.env.NODE_ENV === "production";

const checks = [
  check("database_url", database.ok, "blocker", database.detail, {
    configured: database.configured,
    provider: database.provider,
    localSqlite: database.localSqlite,
  }),
  check(
    "migration_directory",
    migrationsPresent,
    "blocker",
    "Create and review Prisma migrations, then deploy with `prisma migrate deploy`."
  ),
  check("operator_key", operatorKey.ok, "blocker", operatorKey.detail, {
    configured: operatorKey.configured,
    localKeyEnabled: operatorKey.localKeyEnabled,
  }),
  check("credentials_rotated", credentials.ok, "blocker", credentials.detail, {
    demoRotated: credentials.demoRotated,
    operatorRotated: credentials.operatorRotated,
  }),
  check(
    "closed_beta_allowlist",
    allowlist.ok,
    "blocker",
    allowlist.detail,
    {
      configured: allowlist.configured,
      emailEntries: allowlist.emailEntries,
      accountEntries: allowlist.accountEntries,
      minimumEntries: allowlist.minimumEntries,
    }
  ),
  check(
    "external_monitoring",
    monitoring.ok,
    monitoring.required ? "blocker" : "warning",
    monitoring.detail,
    {
      required: monitoring.required,
      providerConfigured: monitoring.providerConfigured,
      endpointConfigured: monitoring.endpointConfigured,
      keyConfigured: monitoring.keyConfigured,
    }
  ),
  check(
    "public_secret_names",
    publicSecretNames.length === 0,
    "blocker",
    "Remove NEXT_PUBLIC_* variables whose names imply secrets or tokens.",
    { count: publicSecretNames.length }
  ),
  check(
    "production_runtime",
    productionRuntime,
    target === "production" ? "warning" : "warning",
    "Run final deployment verification with NODE_ENV=production, `npm run build`, and `npm start`.",
    { nodeEnv: process.env.NODE_ENV ?? "undefined" }
  ),
];

const blockers = checks.filter((item) => !item.ok && item.severity === "blocker");
const warnings = checks.filter((item) => !item.ok && item.severity === "warning");
const summary = {
  status: blockers.length === 0 ? "pass" : "blocked",
  target,
  launchMode: mode,
  blockers: blockers.length,
  warnings: warnings.length,
};

if (JSON_OUTPUT) {
  console.log(
    JSON.stringify(
      {
        ok: blockers.length === 0,
        summary,
        checks,
        secretExposurePolicy: "presence_and_shape_only",
      },
      null,
      2
    )
  );
} else {
  for (const item of checks) {
    const state = item.ok ? "PASS" : item.severity.toUpperCase();
    console.log(`${state} ${item.key} - ${item.detail}`);
  }

  console.log(
    `production readiness: ${summary.status.toUpperCase()} | target=${target} launchMode=${mode} blockers=${summary.blockers} warnings=${summary.warnings}`
  );
}

if (blockers.length > 0) {
  process.exitCode = 1;
}
