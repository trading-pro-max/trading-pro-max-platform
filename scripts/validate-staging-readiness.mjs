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

const REQUIRED_ARTIFACTS = [
  "docs/ops/staging-deployment-checklist.md",
  "docs/ops/production-env.md",
  "docs/ops/monitoring-readiness.md",
  "docs/beta/closed-beta-runbook.md",
  "docs/beta/beta-test-plan.md",
  "docs/beta/feedback-triage.md",
  "docs/launch/soft-launch-readiness.md",
  "docs/launch/public-launch-readiness.md",
  "scripts/tpm-canonical-routes-smoke.mjs",
];

const PLACEHOLDER_PATTERN =
  /^(?:change-?me|todo|unset|replace-?me|example|placeholder|__.*__|<.*>|\[.*\])$/i;
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
  Object.assign(process.env, {
    NODE_ENV: "production",
    TPM_DEPLOYMENT_TARGET: "staging",
    TPM_LAUNCH_MODE: "staging",
    TPM_STAGING_BASE_URL: "https://staging.tradingpromax.app",
    TPM_STAGING_DEPLOYMENT_ID: "staging-simulated-validation-only",
    TPM_STAGING_ROLLBACK_REF: "previous-known-good-simulated",
    DATABASE_URL: "file:/var/lib/trading-pro-max/staging.db",
    TPM_OPERATOR_KEY: "TpmKey_2026_StagingSimulatedOnly_Value_ABCDEFG12345!",
    TPM_DEMO_EMAIL: "demo.staging@example.test",
    TPM_DEMO_PASSWORD: "DemoPass_2026_StagingSimulatedOnly_Value!",
    TPM_OPERATOR_EMAIL: "operator.staging@example.test",
    TPM_OPERATOR_PASSWORD: "OperPass_2026_StagingSimulatedOnly_Value!",
    TPM_CLOSED_BETA_ALLOWLIST_EMAILS:
      "tester1@example.test,tester2@example.test,tester3@example.test,tester4@example.test,tester5@example.test",
    TPM_OPS_EXTERNAL_MONITOR_PROVIDER: "custom",
    TPM_OPS_EXTERNAL_MONITOR_URL: "https://monitoring.tradingpromax.app/tpm",
    TPM_OPS_EXTERNAL_MONITOR_KEY:
      "MonKey_2026_StagingSimulatedOnly_Value_ABCDEFG12345!",
  });
}

loadEnvFile(".env", { override: false });
const requestedEnvFile = argValue("--env-file");
const envFileLoad = requestedEnvFile
  ? loadEnvFile(requestedEnvFile, { override: true })
  : { loaded: false, path: null };
if (SIMULATE_SAFE) applySimulatedSafeEnv();

function normalize(value) {
  return value?.trim() ?? "";
}

function configured(value) {
  return Boolean(normalize(value));
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

function publicSecretNamesPresent() {
  return Object.keys(process.env).filter(
    (key) =>
      key.startsWith("NEXT_PUBLIC_") &&
      /(SECRET|TOKEN|PASSWORD|PRIVATE|KEY)/i.test(key)
  );
}

function endpointIsRealHttps(endpoint) {
  const normalized = normalize(endpoint).toLowerCase();
  if (!normalized.startsWith("https://")) return false;
  if (SIMULATE_SAFE) return true;
  if (
    normalized.includes("localhost") ||
    normalized.includes("127.0.0.1") ||
    normalized.includes("example.") ||
    normalized.endsWith(".test") ||
    normalized.includes("__")
  ) {
    return false;
  }

  return true;
}

function databaseReadiness() {
  const databaseUrl = normalize(process.env.DATABASE_URL);
  const localSqlite = isProbablyLocalSqlitePath(databaseUrl);
  const absolutePersistentSqlite =
    databaseUrl.startsWith("file:/") &&
    !databaseUrl.startsWith("file://") &&
    !localSqlite;
  const externalManagedUrl =
    /^(?:postgresql|postgres|mysql|sqlserver):\/\//i.test(databaseUrl);
  const placeholder = isPlaceholder(databaseUrl);
  const ok =
    configured(databaseUrl) &&
    !placeholder &&
    !localSqlite &&
    (absolutePersistentSqlite || externalManagedUrl);

  return {
    ok,
    detail: !configured(databaseUrl)
      ? "DATABASE_URL is missing for staging."
      : placeholder
        ? "DATABASE_URL is still a placeholder."
        : localSqlite
          ? "DATABASE_URL points at the local SQLite fallback."
          : ok
            ? "DATABASE_URL is staging-readable and not the local fallback."
            : "DATABASE_URL format is not supported for staging syntax readiness.",
    remediation:
      "Set DATABASE_URL in staging secrets to a persistent file: URL or tested managed database URL; never use file:./prisma/dev.db.",
    metadata: {
      configured: configured(databaseUrl),
      localSqlite,
    },
  };
}

function operatorKeyReadiness() {
  const key = normalize(process.env.TPM_OPERATOR_KEY);
  const forbidden =
    key === DEFAULTS.localOperatorKey ||
    /^(?:local|dev|development|test|operator|password)/i.test(key);
  const strong = hasMinimumSecretShape(key, 32);

  return {
    ok: strong && !forbidden,
    detail: !configured(key)
      ? "TPM_OPERATOR_KEY is missing for staging."
      : forbidden
        ? "TPM_OPERATOR_KEY is local/default-looking."
        : !strong
          ? "TPM_OPERATOR_KEY is too weak for staging readiness."
          : "TPM_OPERATOR_KEY is configured with acceptable presence/strength.",
    remediation:
      "Store a high-entropy TPM_OPERATOR_KEY in staging secrets and never print it.",
    metadata: {
      configured: configured(key),
    },
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
    EMAIL_PATTERN.test(demoEmail) &&
    hasMinimumSecretShape(demoPassword, 16);
  const operatorRotated =
    configured(operatorEmail) &&
    configured(operatorPassword) &&
    operatorEmail !== DEFAULTS.operatorEmail &&
    operatorPassword !== DEFAULTS.operatorPassword &&
    !operatorEmail.endsWith(".local") &&
    EMAIL_PATTERN.test(operatorEmail) &&
    hasMinimumSecretShape(operatorPassword, 16);

  return {
    ok: demoRotated && operatorRotated && demoEmail !== operatorEmail,
    detail:
      demoRotated && operatorRotated && demoEmail !== operatorEmail
        ? "Demo and operator credentials are rotated for staging."
        : "Demo/operator credentials are missing, defaulted, weak, invalid, or shared.",
    remediation:
      "Set rotated TPM_DEMO_* and TPM_OPERATOR_* credentials in staging secrets before seeding.",
    metadata: {
      demoRotated,
      operatorRotated,
    },
  };
}

function allowlistReadiness() {
  const emailEntries = csvFromEnv([
    "TPM_CLOSED_BETA_ALLOWLIST_EMAILS",
    "TPM_CLOSED_BETA_ALLOWLIST",
  ]);
  const accountEntries = csvFromEnv(["TPM_CLOSED_BETA_ALLOWLIST_ACCOUNT_IDS"]);
  const invalidEmailEntries = emailEntries.filter((entry) => !EMAIL_PATTERN.test(entry));
  const totalEntries = emailEntries.length + accountEntries.length;
  const ok = totalEntries >= 5 && invalidEmailEntries.length === 0;

  return {
    ok,
    detail:
      totalEntries === 0
        ? "Closed beta allowlist is empty."
        : invalidEmailEntries.length > 0
          ? "Closed beta allowlist contains invalid email entries."
          : totalEntries < 5
            ? `Closed beta allowlist has ${totalEntries} entr${totalEntries === 1 ? "y" : "ies"} but requires 5.`
            : "Closed beta allowlist has the first five evaluator identities.",
    remediation:
      "Set TPM_CLOSED_BETA_ALLOWLIST_EMAILS or TPM_CLOSED_BETA_ALLOWLIST to exactly the initial five evaluator emails for staging rehearsal.",
    metadata: {
      emailEntries: emailEntries.length,
      accountEntries: accountEntries.length,
      invalidEmailEntries: invalidEmailEntries.length,
      minimumEntries: 5,
    },
  };
}

function monitoringReadiness() {
  const provider = normalize(
    envFirst(["TPM_OPS_EXTERNAL_MONITOR_PROVIDER", "TPM_MONITORING_PROVIDER"])
  );
  const endpoint = normalize(
    envFirst(["TPM_OPS_EXTERNAL_MONITOR_URL", "TPM_MONITORING_ENDPOINT"])
  );
  const key = normalize(
    envFirst(["TPM_OPS_EXTERNAL_MONITOR_KEY", "TPM_MONITORING_KEY"])
  );
  const providerConfigured =
    configured(provider) &&
    !isPlaceholder(provider) &&
    SUPPORTED_MONITORING_PROVIDERS.has(provider.toLowerCase());
  const endpointConfigured = endpointIsRealHttps(endpoint);
  const keyConfigured = hasMinimumSecretShape(key, 24);
  const ok = providerConfigured && endpointConfigured && keyConfigured;

  return {
    ok,
    detail: ok
      ? "External staging monitoring contract is configured."
      : "External staging monitoring is missing, unsupported, placeholder, or incomplete.",
    remediation:
      "Configure a supported monitoring provider, HTTPS endpoint, and secret key in staging secrets.",
    metadata: {
      providerConfigured,
      endpointConfigured,
      keyConfigured,
    },
  };
}

function stagingHostingReadiness() {
  const baseUrl = normalize(process.env.TPM_STAGING_BASE_URL);
  const deploymentId = normalize(process.env.TPM_STAGING_DEPLOYMENT_ID);
  const rollbackRef = normalize(process.env.TPM_STAGING_ROLLBACK_REF);
  const baseUrlOk = endpointIsRealHttps(baseUrl);
  const deploymentIdOk = configured(deploymentId) && !isPlaceholder(deploymentId);
  const rollbackRefOk = configured(rollbackRef) && !isPlaceholder(rollbackRef);

  return {
    ok: baseUrlOk && deploymentIdOk && rollbackRefOk,
    detail:
      baseUrlOk && deploymentIdOk && rollbackRefOk
        ? "Staging host URL, deployment evidence, and rollback ref are configured."
        : "Staging hosting evidence is missing or placeholder.",
    remediation:
      "Set TPM_STAGING_BASE_URL, TPM_STAGING_DEPLOYMENT_ID, and TPM_STAGING_ROLLBACK_REF after a real staging deployment exists.",
    metadata: {
      baseUrlConfigured: baseUrlOk,
      deploymentIdConfigured: deploymentIdOk,
      rollbackRefConfigured: rollbackRefOk,
    },
  };
}

function artifactReadiness() {
  const missing = REQUIRED_ARTIFACTS.filter(
    (artifactPath) => !fs.existsSync(path.join(ROOT, artifactPath))
  );

  return {
    ok: missing.length === 0,
    detail:
      missing.length === 0
        ? "Staging, beta, and launch readiness artifacts are present."
        : "Required staging, beta, or launch readiness artifacts are missing.",
    remediation:
      "Create or restore the required docs/scripts before staging readiness can pass.",
    metadata: {
      required: REQUIRED_ARTIFACTS.length,
      missing,
    },
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

const deploymentTarget = normalize(process.env.TPM_DEPLOYMENT_TARGET).toLowerCase();
const launchMode = normalize(process.env.TPM_LAUNCH_MODE).toLowerCase();
const database = databaseReadiness();
const operatorKey = operatorKeyReadiness();
const credentials = credentialRotationReadiness();
const allowlist = allowlistReadiness();
const monitoring = monitoringReadiness();
const stagingHosting = stagingHostingReadiness();
const artifacts = artifactReadiness();
const publicSecretNames = publicSecretNamesPresent();
const migrationsPresent = fs.existsSync(path.join(ROOT, "prisma", "migrations"));
const productionRuntime = process.env.NODE_ENV === "production";
const missingRequestedEnvFile = requestedEnvFile && !envFileLoad.loaded;
const stagingTargetOk =
  deploymentTarget === "staging" &&
  (launchMode === "staging" || launchMode === "closed_beta");

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
  check(
    "staging_target",
    stagingTargetOk,
    "blocker",
    stagingTargetOk
      ? "Staging target and launch mode are configured."
      : "Staging validation requires TPM_DEPLOYMENT_TARGET=staging and TPM_LAUNCH_MODE=staging or closed_beta.",
    "Set TPM_DEPLOYMENT_TARGET=staging and TPM_LAUNCH_MODE=staging in the staging environment.",
    { deploymentTarget: deploymentTarget || "missing", launchMode: launchMode || "missing" }
  ),
  check(
    "staging_hosting",
    stagingHosting.ok,
    "blocker",
    stagingHosting.detail,
    stagingHosting.remediation,
    stagingHosting.metadata
  ),
  check(
    "database_url",
    database.ok,
    "blocker",
    database.detail,
    database.remediation,
    database.metadata
  ),
  check(
    "migration_directory",
    migrationsPresent,
    "blocker",
    "Prisma migrations directory is available.",
    "Create and review Prisma migrations, then deploy staging with `prisma migrate deploy`."
  ),
  check(
    "operator_key",
    operatorKey.ok,
    "blocker",
    operatorKey.detail,
    operatorKey.remediation,
    operatorKey.metadata
  ),
  check(
    "credentials_rotated",
    credentials.ok,
    "blocker",
    credentials.detail,
    credentials.remediation,
    credentials.metadata
  ),
  check(
    "closed_beta_allowlist",
    allowlist.ok,
    "blocker",
    allowlist.detail,
    allowlist.remediation,
    allowlist.metadata
  ),
  check(
    "external_monitoring",
    monitoring.ok,
    "blocker",
    monitoring.detail,
    monitoring.remediation,
    monitoring.metadata
  ),
  check(
    "readiness_artifacts",
    artifacts.ok,
    "blocker",
    artifacts.detail,
    artifacts.remediation,
    artifacts.metadata
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
      ? "Production runtime flag is set for staging start verification."
      : "NODE_ENV is not production for this staging validation process.",
    "Run final staging deployment verification with NODE_ENV=production, `npm run build`, and `npm start`.",
    { nodeEnv: process.env.NODE_ENV ?? "undefined" }
  ),
];

const blockers = checks.filter((item) => !item.ok && item.severity === "blocker");
const warnings = checks.filter((item) => !item.ok && item.severity === "warning");
const summary = {
  status: blockers.length === 0 ? "pass" : "blocked",
  target: deploymentTarget || "missing",
  launchMode: launchMode || "missing",
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
          ? "Simulated staging mode proves validator logic only; it is not real staging deployment evidence."
          : null,
      },
      null,
      2
    )
  );
} else {
  if (SIMULATE_SAFE) {
    console.log(
      "SIMULATION - staging validator logic check only; not real staging deployment evidence."
    );
  }
  for (const item of checks) {
    const state = item.ok ? "PASS" : item.severity.toUpperCase();
    console.log(`${state} ${item.key} - ${item.detail}`);
    if (!item.ok) console.log(`  Remediation: ${item.remediation}`);
  }

  console.log(
    `staging readiness: ${summary.status.toUpperCase()} | target=${summary.target} launchMode=${summary.launchMode} simulated=${summary.simulated ? "yes" : "no"} blockers=${summary.blockers} warnings=${summary.warnings}`
  );
}

if (blockers.length > 0) {
  process.exitCode = 1;
}
