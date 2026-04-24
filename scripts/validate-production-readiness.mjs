import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { parse as parseDotenv } from "dotenv";

const ROOT = process.cwd();
const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const JSON_OUTPUT = args.has("--json");
const SIMULATE_SAFE = args.has("--simulate-safe");

const DEFAULTS = {
  databaseUrl: "file:./prisma/dev.db",
  demoEmail: "demo@tradingpromax.local",
  demoPassword: "TradingProMaxDemo!2026",
  operatorEmail: "operator@tradingpromax.local",
  operatorPassword: "TradingProMaxOperator!2026",
  localOperatorKey: "local-operator-review-key",
};

const SUPPORTED_MONITORING_PROVIDERS = new Set([
  "custom",
  "sentry",
  "datadog",
  "grafana",
  "newrelic",
  "honeycomb",
  "cloudwatch",
  "azure-monitor",
]);

const SECRET_ROTATION_REQUIRED_FLAG = "true";
const SENSITIVE_ROTATION_ENV_NAMES = [
  "DATABASE_URL",
  "TPM_OPERATOR_KEY",
  "TPM_DEMO_PASSWORD",
  "TPM_OPERATOR_PASSWORD",
  "TPM_MONITORING_KEY",
  "TPM_OPS_EXTERNAL_MONITOR_KEY",
  "TPM_BROKER_API_KEY",
  "TPM_BROKER_API_SECRET",
  "TPM_BROKER_SANDBOX_API_KEY",
  "TPM_BROKER_SANDBOX_API_SECRET",
  "TPM_BROKER_LIVE_API_KEY",
  "TPM_BROKER_LIVE_API_SECRET",
  "TPM_MARKET_FEED_API_KEY",
  "TPM_MARKET_FEED_API_SECRET",
  "TPM_MARKET_FEED_SANDBOX_API_KEY",
  "TPM_MARKET_FEED_SANDBOX_API_SECRET",
  "TPM_MARKET_FEED_LIVE_API_KEY",
  "TPM_MARKET_FEED_LIVE_API_SECRET",
  "TPM_PILOT_BROKER_API_KEY",
  "TPM_PILOT_BROKER_API_SECRET",
  "TPM_PILOT_FEED_API_KEY",
  "TPM_PILOT_FEED_API_SECRET",
  "TPM_ALERTS_QUEUE_BACKEND_URL",
  "TPM_ALERTS_WEBHOOK_URL",
  "TPM_DESKTOP_SIGNING_PROFILE",
  "TPM_MOBILE_ANDROID_SIGNING_PROFILE",
  "TPM_MOBILE_IOS_SIGNING_PROFILE",
  "TPM_MOBILE_DISTRIBUTION_PROFILE",
];

const PLACEHOLDER_PATTERN =
  /^(?:change-?me|todo|unset|replace-?me|example|placeholder|__.*__|<.*>|\[.*\])$/i;
const STALE_SECRET_PATTERN =
  /(?:local-operator-review-key|TradingProMaxDemo!2026|TradingProMaxOperator!2026|LocalOnly|SimulatedOnly|change[_-]?me|replace[_-]?me|placeholder|dummy|sample|default|password123|secret123|example\.|\.test\b|\.invalid\b|localhost|127\.0\.0\.1)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function argValue(name) {
  const exactIndex = rawArgs.indexOf(name);
  if (exactIndex >= 0) return rawArgs[exactIndex + 1] ?? "";
  const prefix = `${name}=`;
  const match = rawArgs.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : null;
}

function loadEnvFile(filePath, { override = false } = {}) {
  const resolved = path.resolve(ROOT, filePath);
  if (!fs.existsSync(resolved)) {
    return { loaded: false, path: resolved };
  }

  const parsed = parseDotenv(fs.readFileSync(resolved));
  for (const [key, value] of Object.entries(parsed)) {
    if (override || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return { loaded: true, path: resolved };
}

function applySimulatedSafeEnv() {
  const completedAt = new Date().toISOString();
  Object.assign(process.env, {
    NODE_ENV: "production",
    TPM_DEPLOYMENT_TARGET: "production",
    TPM_LAUNCH_MODE: "closed_beta",
    TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED: "true",
    TPM_SECRET_ROTATION_BATCH_ID: "rotation-simulated-validation-only",
    TPM_SECRET_ROTATION_COMPLETED_AT: completedAt,
    DATABASE_URL: "file:/var/lib/trading-pro-max/production.db",
    TPM_OPERATOR_KEY: "TpmKey_2026_SimulatedOnly_Value_ABCDEFG12345!",
    TPM_DEMO_EMAIL: "demo.beta@example.test",
    TPM_DEMO_PASSWORD: "DemoPass_2026_SimulatedOnly_Value!",
    TPM_OPERATOR_EMAIL: "operator.beta@example.test",
    TPM_OPERATOR_PASSWORD: "OperPass_2026_SimulatedOnly_Value!",
    TPM_CLOSED_BETA_ALLOWLIST_EMAILS:
      "tester1@example.test,tester2@example.test,tester3@example.test,tester4@example.test,tester5@example.test",
    TPM_OPS_EXTERNAL_MONITOR_PROVIDER: "custom",
    TPM_OPS_EXTERNAL_MONITOR_URL: "https://monitoring.example.test/tpm",
    TPM_OPS_EXTERNAL_MONITOR_KEY:
      "MonKey_2026_SimulatedOnly_Value_ABCDEFG12345!",
  });
}

loadEnvFile(".env", { override: false });
const requestedEnvFile = argValue("--env-file");
const envFileLoad = requestedEnvFile
  ? loadEnvFile(requestedEnvFile, { override: true })
  : { loaded: false, path: null };
if (SIMULATE_SAFE) applySimulatedSafeEnv();

function configured(value) {
  return Boolean(value?.trim());
}

function normalize(value) {
  return value?.trim() ?? "";
}

function envFirst(names) {
  for (const name of names) {
    if (configured(process.env[name])) return process.env[name];
  }

  return "";
}

function csv(value) {
  return normalize(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function csvFromEnv(names) {
  return [...new Set(names.flatMap((name) => csv(process.env[name])))];
}

function isPlaceholder(value) {
  const normalized = normalize(value);
  return !normalized || PLACEHOLDER_PATTERN.test(normalized);
}

function isTruthy(value) {
  return normalize(value).toLowerCase() === "true";
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

function hasKnownStaleSecretPattern(value) {
  if (!configured(value)) return false;
  if (SIMULATE_SAFE) return false;
  return STALE_SECRET_PATTERN.test(normalize(value));
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

function databaseReadiness(target) {
  const databaseUrl = normalize(process.env.DATABASE_URL);
  const configuredDatabase = configured(databaseUrl);
  const placeholder = isPlaceholder(databaseUrl);
  const localSqlite = isProbablyLocalSqlitePath(databaseUrl);
  const absolutePersistentSqlite =
    databaseUrl.startsWith("file:/") && !databaseUrl.startsWith("file://") && !localSqlite;
  const externalManagedUrl =
    /^(?:postgresql|postgres|mysql|sqlserver):\/\//i.test(databaseUrl);
  const localAllowed = target === "local" && localSqlite;
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
  const ok =
    !placeholder &&
    configuredDatabase &&
    (localAllowed || (!localSqlite && (absolutePersistentSqlite || externalManagedUrl)));

  return {
    ok,
    provider,
    configured: configuredDatabase,
    localSqlite,
    detail:
      provider === "missing"
        ? "DATABASE_URL is missing."
        : placeholder
          ? "DATABASE_URL is still a placeholder."
          : provider === "local_sqlite" && !localAllowed
            ? "DATABASE_URL points at a local SQLite path."
            : provider === "unsupported"
              ? "DATABASE_URL format is not supported for production syntax readiness."
              : "DATABASE_URL syntax is production-readable and not the local fallback.",
    remediation:
      target === "local"
        ? "For local-only validation set TPM_DEPLOYMENT_TARGET=local; for staging/production set a persistent file: URL or managed SQL URL in the secret store."
        : "Set DATABASE_URL in the deployment secret store to a persistent file: URL or managed SQL URL; do not use file:./prisma/dev.db.",
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
      ? "TPM_OPERATOR_KEY is missing."
      : forbidden
        ? "TPM_OPERATOR_KEY is a local/default-looking key."
        : !strong
          ? "TPM_OPERATOR_KEY is too weak for production readiness."
          : "TPM_OPERATOR_KEY is configured with acceptable presence/strength.",
    remediation:
      "Generate a high-entropy key outside the repo, store it as TPM_OPERATOR_KEY, and never commit or print it.",
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
    (SIMULATE_SAFE || !demoEmail.endsWith(".test")) &&
    EMAIL_PATTERN.test(demoEmail) &&
    hasMinimumSecretShape(demoPassword, 16);
  const operatorRotated =
    configured(operatorEmail) &&
    configured(operatorPassword) &&
    operatorEmail !== DEFAULTS.operatorEmail &&
    operatorPassword !== DEFAULTS.operatorPassword &&
    !operatorEmail.endsWith(".local") &&
    (SIMULATE_SAFE || !operatorEmail.endsWith(".test")) &&
    EMAIL_PATTERN.test(operatorEmail) &&
    hasMinimumSecretShape(operatorPassword, 16);

  return {
    ok: demoRotated && operatorRotated && demoEmail !== operatorEmail,
    demoRotated,
    operatorRotated,
    detail:
      demoRotated && operatorRotated && demoEmail !== operatorEmail
        ? "Demo and operator seed credentials are rotated away from local defaults."
        : "Demo/operator credentials are missing, defaulted, weak, invalid, or shared.",
    remediation:
      "Set TPM_DEMO_EMAIL, TPM_DEMO_PASSWORD, TPM_OPERATOR_EMAIL, and TPM_OPERATOR_PASSWORD to rotated values before seeding production-like accounts.",
  };
}

function secretRotationAttestationReadiness() {
  const confirmed = isTruthy(process.env.TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED);
  const batchId = normalize(process.env.TPM_SECRET_ROTATION_BATCH_ID);
  const completedAt = normalize(process.env.TPM_SECRET_ROTATION_COMPLETED_AT);
  const batchConfigured = configured(batchId) && !isPlaceholder(batchId);
  const completedDate = Date.parse(completedAt);
  const completedAtValid =
    configured(completedAt) &&
    Number.isFinite(completedDate) &&
    completedDate <= Date.now() + 60_000;
  const ok = confirmed && batchConfigured && completedAtValid;

  return {
    ok,
    confirmed,
    batchConfigured,
    completedAtValid,
    detail: ok
      ? "Pre-launch secret rotation attestation is present."
      : "Pre-launch secret rotation attestation is missing, placeholder, or invalid.",
    remediation:
      "Rotate every launch secret in the deployment secret manager, then set TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED=true, TPM_SECRET_ROTATION_BATCH_ID, and TPM_SECRET_ROTATION_COMPLETED_AT.",
  };
}

function rotatedSecretPatternReadiness() {
  const flaggedNames = SENSITIVE_ROTATION_ENV_NAMES.filter((name) =>
    hasKnownStaleSecretPattern(process.env[name])
  );

  return {
    ok: flaggedNames.length === 0,
    flaggedNames,
    scannedConfigured: SENSITIVE_ROTATION_ENV_NAMES.filter((name) =>
      configured(process.env[name])
    ).length,
    detail:
      flaggedNames.length === 0
        ? "No configured launch secret has a known local/default/placeholder pattern."
        : "One or more configured launch secrets still match a known local/default/placeholder pattern.",
    remediation:
      "Replace flagged secret names in the deployment secret manager with newly rotated values; do not reuse local, demo, default, placeholder, example, or simulated values.",
  };
}

function allowlistReadiness(target) {
  const emailEntries = csvFromEnv([
    "TPM_CLOSED_BETA_ALLOWLIST_EMAILS",
    "TPM_CLOSED_BETA_ALLOWLIST",
  ]);
  const accountEntries = csvFromEnv(["TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS"]);
  const invalidEmails = emailEntries.filter((entry) => !EMAIL_PATTERN.test(entry));
  const totalEntries = emailEntries.length + accountEntries.length;
  const minimumEntries = target === "production" ? 5 : 1;
  const ok = totalEntries >= minimumEntries && invalidEmails.length === 0;

  return {
    ok,
    configured: totalEntries > 0,
    emailEntries: emailEntries.length,
    accountEntries: accountEntries.length,
    invalidEmailEntries: invalidEmails.length,
    minimumEntries,
    detail:
      totalEntries === 0
        ? "Closed beta allowlist is empty."
        : invalidEmails.length > 0
          ? "Closed beta allowlist contains invalid email entries."
          : totalEntries < minimumEntries
            ? `Closed beta allowlist has ${totalEntries} entr${totalEntries === 1 ? "y" : "ies"} but requires ${minimumEntries}.`
            : "Closed beta allowlist is configured and capacity-scoped.",
    remediation:
      "Set TPM_CLOSED_BETA_ALLOWLIST_EMAILS or TPM_CLOSED_BETA_ALLOWLIST to the first five evaluator emails; this is not public signup.",
  };
}

function isPlaceholderEndpoint(endpoint) {
  const normalized = normalize(endpoint).toLowerCase();
  if (SIMULATE_SAFE) return false;
  return (
    isPlaceholder(endpoint) ||
    normalized.includes("localhost") ||
    normalized.includes("127.0.0.1") ||
    normalized.includes("example.") ||
    normalized.endsWith(".test") ||
    normalized.includes("__")
  );
}

function monitoringReadiness(target, mode) {
  const provider = normalize(
    envFirst(["TPM_OPS_EXTERNAL_MONITOR_PROVIDER", "TPM_MONITORING_PROVIDER"])
  );
  const endpoint = normalize(
    envFirst(["TPM_OPS_EXTERNAL_MONITOR_URL", "TPM_MONITORING_ENDPOINT"])
  );
  const key = normalize(
    envFirst(["TPM_OPS_EXTERNAL_MONITOR_KEY", "TPM_MONITORING_KEY"])
  );
  const providerKey = provider.toLowerCase();
  const providerConfigured =
    configured(provider) &&
    !isPlaceholder(provider) &&
    SUPPORTED_MONITORING_PROVIDERS.has(providerKey);
  const endpointConfigured =
    configured(endpoint) &&
    /^https:\/\//i.test(endpoint) &&
    !isPlaceholderEndpoint(endpoint);
  const keyConfigured = hasMinimumSecretShape(key, 24);
  const configuredMonitoring = providerConfigured && endpointConfigured && keyConfigured;
  const required = target === "production" || mode === "production";

  return {
    ok: configuredMonitoring,
    required,
    providerConfigured,
    endpointConfigured,
    keyConfigured,
    detail: configuredMonitoring
      ? "External monitoring provider, HTTPS endpoint, and secret key are configured."
      : "External monitoring is missing, unsupported, placeholder, or incomplete.",
    remediation:
      "Set TPM_MONITORING_PROVIDER/TPM_MONITORING_ENDPOINT/TPM_MONITORING_KEY or the TPM_OPS_EXTERNAL_MONITOR_* equivalents using a supported provider and HTTPS endpoint.",
  };
}

function check(key, ok, severity, detail, remediation, metadata = {}) {
  return {
    key,
    ok,
    severity: ok ? "pass" : severity,
    detail,
    remediation,
    metadata,
  };
}

const target = deploymentTarget();
const mode = launchMode();
const database = databaseReadiness(target);
const operatorKey = operatorKeyReadiness();
const credentials = credentialRotationReadiness();
const secretRotation = secretRotationAttestationReadiness();
const rotatedSecretPatterns = rotatedSecretPatternReadiness();
const allowlist = allowlistReadiness(target);
const monitoring = monitoringReadiness(target, mode);
const publicSecretNames = publicSecretNamesPresent();
const migrationsPresent = fs.existsSync(path.join(ROOT, "prisma", "migrations"));
const productionRuntime = process.env.NODE_ENV === "production";
const missingRequestedEnvFile = requestedEnvFile && !envFileLoad.loaded;

const checks = [
  ...(missingRequestedEnvFile
    ? [
        check(
          "env_file",
          false,
          "blocker",
          `Requested env file was not found: ${requestedEnvFile}`,
          "Create the env file first or pass an existing path with --env-file.",
          { requested: requestedEnvFile }
        ),
      ]
    : []),
  check("database_url", database.ok, "blocker", database.detail, database.remediation, {
    configured: database.configured,
    provider: database.provider,
    localSqlite: database.localSqlite,
  }),
  check(
    "migration_directory",
    migrationsPresent,
    "blocker",
    "Prisma migrations directory is available.",
    "Create and review Prisma migrations, then deploy with `prisma migrate deploy`."
  ),
  check(
    "operator_key",
    operatorKey.ok,
    "blocker",
    operatorKey.detail,
    operatorKey.remediation,
    {
      configured: operatorKey.configured,
      localKeyEnabled: operatorKey.localKeyEnabled,
    }
  ),
  check(
    "credentials_rotated",
    credentials.ok,
    "blocker",
    credentials.detail,
    credentials.remediation,
    {
      demoRotated: credentials.demoRotated,
      operatorRotated: credentials.operatorRotated,
    }
  ),
  check(
    "secret_rotation_attestation",
    secretRotation.ok,
    "blocker",
    secretRotation.detail,
    secretRotation.remediation,
    {
      confirmed: secretRotation.confirmed,
      batchConfigured: secretRotation.batchConfigured,
      completedAtValid: secretRotation.completedAtValid,
    }
  ),
  check(
    "rotated_secret_patterns",
    rotatedSecretPatterns.ok,
    "blocker",
    rotatedSecretPatterns.detail,
    rotatedSecretPatterns.remediation,
    {
      scannedConfigured: rotatedSecretPatterns.scannedConfigured,
      flaggedNames: rotatedSecretPatterns.flaggedNames,
    }
  ),
  check(
    "closed_beta_allowlist",
    allowlist.ok,
    "blocker",
    allowlist.detail,
    allowlist.remediation,
    {
      configured: allowlist.configured,
      emailEntries: allowlist.emailEntries,
      accountEntries: allowlist.accountEntries,
      invalidEmailEntries: allowlist.invalidEmailEntries,
      minimumEntries: allowlist.minimumEntries,
    }
  ),
  check(
    "external_monitoring",
    monitoring.ok,
    monitoring.required ? "blocker" : "warning",
    monitoring.detail,
    monitoring.remediation,
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
    "No NEXT_PUBLIC_* secret-looking names were detected.",
    "Remove NEXT_PUBLIC_* variables whose names imply secrets, tokens, passwords, private data, or keys.",
    { count: publicSecretNames.length }
  ),
  check(
    "production_runtime",
    productionRuntime,
    "warning",
    productionRuntime
      ? "Production runtime flag is set."
      : "NODE_ENV is not production for this validation process.",
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
  simulated: SIMULATE_SAFE,
  envFileLoaded: Boolean(envFileLoad.loaded),
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
        simulationNotice: SIMULATE_SAFE
          ? "Simulated safe mode proves validator logic only; it is not real production readiness."
          : null,
      },
      null,
      2
    )
  );
} else {
  if (SIMULATE_SAFE) {
    console.log(
      "SIMULATION - validator logic check only; not real production readiness."
    );
  }
  for (const item of checks) {
    const state = item.ok ? "PASS" : item.severity.toUpperCase();
    console.log(`${state} ${item.key} - ${item.detail}`);
    if (!item.ok) console.log(`  Remediation: ${item.remediation}`);
  }

  console.log(
    `production readiness: ${summary.status.toUpperCase()} | target=${target} launchMode=${mode} simulated=${summary.simulated ? "yes" : "no"} blockers=${summary.blockers} warnings=${summary.warnings}`
  );
}

if (blockers.length > 0) {
  process.exitCode = 1;
}
