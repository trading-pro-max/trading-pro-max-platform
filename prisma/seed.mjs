import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

const DEMO_EMAIL = process.env.TPM_DEMO_EMAIL ?? "demo@tradingpromax.local";
const DEMO_PASSWORD =
  process.env.TPM_DEMO_PASSWORD ?? "TradingProMaxDemo!2026";
const DEMO_DISPLAY_NAME = process.env.TPM_DEMO_DISPLAY_NAME ?? "Trading Pro Demo";
const OPERATOR_EMAIL =
  process.env.TPM_OPERATOR_EMAIL ?? "operator@tradingpromax.local";
const OPERATOR_PASSWORD =
  process.env.TPM_OPERATOR_PASSWORD ?? "TradingProMaxOperator!2026";
const OPERATOR_DISPLAY_NAME =
  process.env.TPM_OPERATOR_DISPLAY_NAME ?? "Trading Pro Operator";
const OPERATOR_KEY = process.env.TPM_OPERATOR_KEY ?? "local-operator-review-key";
const DEMO_REGION = process.env.TPM_DEMO_REGION ?? "Global";
const DATABASE_URL = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const REQUIRED_DISCLOSURES = ["risk", "paper_trading", "jurisdiction", "terms"];
const LOCAL_DISCLOSURE_VERSION = "2026.04.local";
const REVIEW_REFERENCE = "demo-paper-review";

if (process.env.NODE_ENV === "production") {
  throw new Error("The demo bootstrap seed is local-only and cannot run in production.");
}

function createId(prefix) {
  return `${prefix}_${randomUUID().replaceAll("-", "")}`;
}

function now() {
  return new Date().toISOString().replace("Z", "+00:00");
}

function createPasswordHash(password) {
  const salt = randomBytes(16).toString("hex");
  const keyLength = 64;
  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");

  return ["scrypt", "v1", keyLength, salt, derivedKey].join(":");
}

function getSqlitePath(databaseUrl) {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("The local bootstrap seed only supports SQLite file URLs.");
  }

  const rawPath = databaseUrl.slice("file:".length).split("?")[0];
  const normalizedPath = rawPath.replaceAll("\\", "/");

  if (!normalizedPath) {
    throw new Error("The local bootstrap seed requires a SQLite database path.");
  }

  if (/^[A-Za-z]:\//.test(normalizedPath) || normalizedPath.startsWith("/")) {
    return normalizedPath;
  }

  return resolve(process.cwd(), rawPath);
}

function createDatabase() {
  const databasePath = getSqlitePath(DATABASE_URL);
  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new Database(databasePath);
  database.pragma("foreign_keys = ON");

  return database;
}

function getUserByEmail(database, email) {
  return database
    .prepare("SELECT * FROM users WHERE email = ? LIMIT 1")
    .get(email);
}

function upsertUser(database, { email, displayName, password, role }) {
  const existing = getUserByEmail(database, email);
  const timestamp = now();
  const passwordHash = createPasswordHash(password);

  if (existing) {
    database
      .prepare(
        "UPDATE users SET displayName = ?, passwordHash = ?, role = ?, updatedAt = ? WHERE id = ?",
      )
      .run(displayName, passwordHash, role, timestamp, existing.id);

    return getUserByEmail(database, email);
  }

  const id = createId("user");

  database
    .prepare(
      "INSERT INTO users (id, email, displayName, passwordHash, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(id, email, displayName, passwordHash, role, timestamp, timestamp);

  return getUserByEmail(database, email);
}

function ensureDemoAccount(database, userId) {
  const existing = database
    .prepare("SELECT * FROM accounts WHERE userId = ? AND mode = ? LIMIT 1")
    .get(userId, "demo");

  if (existing) return existing;

  const timestamp = now();
  const id = createId("account");

  database
    .prepare(
      "INSERT INTO accounts (id, userId, mode, lifecycleState, region, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(
      id,
      userId,
      "demo",
      "disclosures_pending",
      DEMO_REGION,
      timestamp,
      timestamp,
    );

  return database.prepare("SELECT * FROM accounts WHERE id = ? LIMIT 1").get(id);
}

function ensureDemoReview(database, accountId) {
  const existing = database
    .prepare(
      "SELECT * FROM compliance_reviews WHERE accountId = ? AND reference = ? LIMIT 1",
    )
    .get(accountId, REVIEW_REFERENCE);

  if (existing) return existing;

  const timestamp = now();
  const id = createId("review");

  database
    .prepare(
      "INSERT INTO compliance_reviews (id, accountId, state, reference, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(id, accountId, "not_started", REVIEW_REFERENCE, timestamp, timestamp);

  return database
    .prepare("SELECT * FROM compliance_reviews WHERE id = ? LIMIT 1")
    .get(id);
}

function ensureDemoActivationGate(database, accountId) {
  const existing = database
    .prepare(
      "SELECT * FROM activation_gates WHERE accountId = ? ORDER BY evaluatedAt DESC, createdAt DESC LIMIT 1",
    )
    .get(accountId);

  if (existing) return existing;

  const timestamp = now();
  const id = createId("gate");

  database
    .prepare(
      "INSERT INTO activation_gates (id, accountId, paperState, liveState, reason, nextStep, executionEnabled, evaluatedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .run(
      id,
      accountId,
      "gated",
      "blocked",
      "disclosures_required",
      "accept_disclosures",
      0,
      timestamp,
      timestamp,
      timestamp,
    );

  return database
    .prepare("SELECT * FROM activation_gates WHERE id = ? LIMIT 1")
    .get(id);
}

function recordBootstrapAudit(database, { userId, accountId, operatorUserId }) {
  const timestamp = now();

  database
    .prepare(
      "INSERT INTO audit_events (id, userId, accountId, kind, scope, actorRole, accountMode, message, metadataJson, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .run(
      createId("audit"),
      userId,
      accountId,
      "data_state_updated",
      "account",
      "owner",
      "demo",
      "Demo auth and compliance baseline initialized.",
      JSON.stringify({
        seed: "demo_bootstrap",
        operatorUserId,
        disclosureKeys: REQUIRED_DISCLOSURES,
        disclosureVersion: LOCAL_DISCLOSURE_VERSION,
        reviewReference: REVIEW_REFERENCE,
      }),
      timestamp,
    );
}

function main() {
  const database = createDatabase();

  try {
    const demoUser = upsertUser(database, {
      email: DEMO_EMAIL,
      displayName: DEMO_DISPLAY_NAME,
      password: DEMO_PASSWORD,
      role: "owner",
    });
    const operator = upsertUser(database, {
      email: OPERATOR_EMAIL,
      displayName: OPERATOR_DISPLAY_NAME,
      password: OPERATOR_PASSWORD,
      role: "operator",
    });
    const account = ensureDemoAccount(database, demoUser.id);

    ensureDemoReview(database, account.id);
    ensureDemoActivationGate(database, account.id);
    recordBootstrapAudit(database, {
      userId: demoUser.id,
      accountId: account.id,
      operatorUserId: operator.id,
    });

    console.log("Demo bootstrap ready");
    console.log(`Email: ${DEMO_EMAIL}`);
    console.log(`Password: ${DEMO_PASSWORD}`);
    console.log(`Operator email: ${OPERATOR_EMAIL}`);
    console.log(`Operator password: ${OPERATOR_PASSWORD}`);
    console.log(`Local operator key: ${OPERATOR_KEY}`);
  } finally {
    database.close();
  }
}

main();
