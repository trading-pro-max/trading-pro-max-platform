import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { parse as parseDotenv } from "dotenv";

const ROOT = process.cwd();
const DEFAULT_OUTPUT_PATH = ".env.launch-secrets.local";
const rawArgs = process.argv.slice(2);
const FORCE = rawArgs.includes("--force");
const PRINT_ONCE = rawArgs.includes("--print-once");

function argValue(name) {
  const exactIndex = rawArgs.indexOf(name);
  if (exactIndex >= 0) return rawArgs[exactIndex + 1] ?? "";
  const prefix = `${name}=`;
  const match = rawArgs.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : null;
}

const outputPath = argValue("--path") ?? DEFAULT_OUTPUT_PATH;
const resolvedPath = path.resolve(ROOT, outputPath);
const relativePath = path.relative(ROOT, resolvedPath).replaceAll("\\", "/");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
  fail("Refusing to write launch secrets outside the repository workspace.");
}

const basename = path.basename(resolvedPath);
if (!basename.startsWith(".env") || !basename.endsWith(".local")) {
  fail("Refusing to write secrets anywhere except an ignored .env*.local file.");
}

const checkIgnore = spawnSync("git", ["check-ignore", "-q", relativePath], {
  cwd: ROOT,
  stdio: "ignore",
});

if (checkIgnore.status !== 0) {
  fail(
    `Refusing to write ${relativePath}; it is not ignored by Git. Add an ignore rule before generating local launch secrets.`
  );
}

function readExisting() {
  if (!fs.existsSync(resolvedPath)) return {};
  return parseDotenv(fs.readFileSync(resolvedPath));
}

function strongSecret(prefix) {
  return `${prefix}_${randomBytes(40).toString("base64url")}_R9!`;
}

function choose(existing, key, nextValue) {
  if (!FORCE && existing[key]?.trim()) {
    return {
      value: existing[key],
      generated: false,
    };
  }

  return {
    value: nextValue,
    generated: true,
  };
}

function line(key, value) {
  return `${key}=${value ?? ""}`;
}

fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const existing = readExisting();
const generatedAt = new Date().toISOString();
const values = {
  TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED: "false",
  TPM_SECRET_ROTATION_BATCH_ID:
    existing.TPM_SECRET_ROTATION_BATCH_ID?.trim() ||
    `local-generation-${generatedAt.replace(/[:.]/g, "-")}`,
  TPM_SECRET_ROTATION_COMPLETED_AT:
    existing.TPM_SECRET_ROTATION_COMPLETED_AT?.trim() || "",
  TPM_OPERATOR_KEY: choose(
    existing,
    "TPM_OPERATOR_KEY",
    strongSecret("TpmOperatorKey")
  ),
  TPM_DEMO_PASSWORD: choose(
    existing,
    "TPM_DEMO_PASSWORD",
    strongSecret("TpmDemoPassword")
  ),
  TPM_OPERATOR_PASSWORD: choose(
    existing,
    "TPM_OPERATOR_PASSWORD",
    strongSecret("TpmOperatorPassword")
  ),
  TPM_MONITORING_KEY: choose(
    existing,
    "TPM_MONITORING_KEY",
    strongSecret("TpmMonitoringKey")
  ),
};

const body = [
  "# Trading Pro Max launch secret generation worksheet.",
  "# This file is intentionally ignored by Git. Do not commit it.",
  "# Move approved values into the deployment secret manager, then delete or archive this local file securely.",
  "# Provider-owned broker/feed/billing/notification secrets must be rotated at the provider and stored in the secret manager.",
  "",
  "# Rotation attestation. Keep false until every launch secret is rotated in deployment secret storage.",
  line(
    "TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED",
    values.TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED
  ),
  line("TPM_SECRET_ROTATION_BATCH_ID", values.TPM_SECRET_ROTATION_BATCH_ID),
  line("TPM_SECRET_ROTATION_COMPLETED_AT", values.TPM_SECRET_ROTATION_COMPLETED_AT),
  "",
  "# App-controlled secrets generated locally for transfer to secret storage.",
  line("TPM_OPERATOR_KEY", values.TPM_OPERATOR_KEY.value),
  line("TPM_DEMO_PASSWORD", values.TPM_DEMO_PASSWORD.value),
  line("TPM_OPERATOR_PASSWORD", values.TPM_OPERATOR_PASSWORD.value),
  line("TPM_MONITORING_KEY", values.TPM_MONITORING_KEY.value),
  line("TPM_OPS_EXTERNAL_MONITOR_KEY", values.TPM_MONITORING_KEY.value),
  "",
  "# External/provider-owned values are intentionally blank. Do not invent these.",
  line("DATABASE_URL", existing.DATABASE_URL ?? ""),
  line("TPM_BROKER_API_KEY", existing.TPM_BROKER_API_KEY ?? ""),
  line("TPM_BROKER_API_SECRET", existing.TPM_BROKER_API_SECRET ?? ""),
  line("TPM_BROKER_LIVE_API_KEY", existing.TPM_BROKER_LIVE_API_KEY ?? ""),
  line("TPM_BROKER_LIVE_API_SECRET", existing.TPM_BROKER_LIVE_API_SECRET ?? ""),
  line("TPM_MARKET_FEED_API_KEY", existing.TPM_MARKET_FEED_API_KEY ?? ""),
  line("TPM_MARKET_FEED_API_SECRET", existing.TPM_MARKET_FEED_API_SECRET ?? ""),
  line("TPM_MARKET_FEED_LIVE_API_KEY", existing.TPM_MARKET_FEED_LIVE_API_KEY ?? ""),
  line(
    "TPM_MARKET_FEED_LIVE_API_SECRET",
    existing.TPM_MARKET_FEED_LIVE_API_SECRET ?? ""
  ),
  line("TPM_PILOT_BROKER_API_KEY", existing.TPM_PILOT_BROKER_API_KEY ?? ""),
  line("TPM_PILOT_BROKER_API_SECRET", existing.TPM_PILOT_BROKER_API_SECRET ?? ""),
  line("TPM_PILOT_FEED_API_KEY", existing.TPM_PILOT_FEED_API_KEY ?? ""),
  line("TPM_PILOT_FEED_API_SECRET", existing.TPM_PILOT_FEED_API_SECRET ?? ""),
  line("TPM_ALERTS_WEBHOOK_URL", existing.TPM_ALERTS_WEBHOOK_URL ?? ""),
  line("TPM_ALERTS_QUEUE_BACKEND_URL", existing.TPM_ALERTS_QUEUE_BACKEND_URL ?? ""),
  "",
].join("\n");

fs.writeFileSync(resolvedPath, body, { encoding: "utf8", mode: 0o600 });

const generatedKeys = [
  ["TPM_OPERATOR_KEY", values.TPM_OPERATOR_KEY],
  ["TPM_DEMO_PASSWORD", values.TPM_DEMO_PASSWORD],
  ["TPM_OPERATOR_PASSWORD", values.TPM_OPERATOR_PASSWORD],
  ["TPM_MONITORING_KEY", values.TPM_MONITORING_KEY],
].filter(([, result]) => result.generated);

console.log(`created_or_updated=${relativePath}`);
console.log(`force=${FORCE ? "yes" : "no"}`);
console.log(`generated_secret_count=${generatedKeys.length}`);
console.log("rotation_confirmation=false");
console.log("external_provider_values=not_generated");
console.log("secret_output=redacted");
console.log(
  "next_step=move approved values to deployment secret storage, rotate provider-owned secrets at each provider, then run npm run production:validate"
);

if (PRINT_ONCE) {
  if (generatedKeys.length === 0) {
    console.log("print_once=no_new_secrets_generated");
  } else {
    console.log("print_once=explicitly_requested");
    for (const [key, result] of generatedKeys) {
      console.log(`${key}=${result.value}`);
    }
  }
}
