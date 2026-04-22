import { randomBytes, scryptSync } from "node:crypto";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/db/generated/client/index.js";

const DEMO_EMAIL = process.env.TPM_DEMO_EMAIL ?? "demo@tradingpromax.local";
const DEMO_PASSWORD =
  process.env.TPM_DEMO_PASSWORD ?? "TradingProMaxDemo!2026";
const DEMO_DISPLAY_NAME = process.env.TPM_DEMO_DISPLAY_NAME ?? "Trading Pro Demo";
const DEMO_REGION = process.env.TPM_DEMO_REGION ?? "Global";
const DATABASE_URL = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const REQUIRED_DISCLOSURES = ["risk", "paper_trading", "jurisdiction", "terms"];
const LOCAL_DISCLOSURE_VERSION = "2026.04.local";
const REVIEW_REFERENCE = "demo-paper-review";

if (process.env.NODE_ENV === "production") {
  throw new Error("The demo bootstrap seed is local-only and cannot run in production.");
}

function createPasswordHash(password) {
  const salt = randomBytes(16).toString("hex");
  const keyLength = 64;
  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");

  return ["scrypt", "v1", keyLength, salt, derivedKey].join(":");
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

async function ensureDemoAccount(prisma, userId) {
  const existing = await prisma.account.findUnique({
    where: {
      userId_mode: {
        userId,
        mode: "demo",
      },
    },
  });

  if (existing) return existing;

  return prisma.account.create({
    data: {
      userId,
      mode: "demo",
      lifecycleState: "disclosures_pending",
      region: DEMO_REGION,
    },
  });
}

async function ensureDemoReview(prisma, accountId) {
  const existing = await prisma.complianceReview.findFirst({
    where: {
      accountId,
      reference: REVIEW_REFERENCE,
    },
  });

  if (existing) return existing;

  return prisma.complianceReview.create({
    data: {
      accountId,
      reference: REVIEW_REFERENCE,
      state: "not_started",
    },
  });
}

async function ensureDemoActivationGate(prisma, accountId) {
  const existing = await prisma.activationGate.findFirst({
    where: { accountId },
    orderBy: [{ evaluatedAt: "desc" }, { createdAt: "desc" }],
  });

  if (existing) return existing;

  return prisma.activationGate.create({
    data: {
      accountId,
      paperState: "gated",
      liveState: "blocked",
      reason: "disclosures_required",
      nextStep: "accept_disclosures",
      executionEnabled: false,
    },
  });
}

async function main() {
  const prisma = createPrismaClient();

  try {
    const user = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      create: {
        email: DEMO_EMAIL,
        displayName: DEMO_DISPLAY_NAME,
        passwordHash: createPasswordHash(DEMO_PASSWORD),
        role: "owner",
      },
      update: {
        displayName: DEMO_DISPLAY_NAME,
        passwordHash: createPasswordHash(DEMO_PASSWORD),
        role: "owner",
      },
    });

    const account = await ensureDemoAccount(prisma, user.id);
    await ensureDemoReview(prisma, account.id);
    await ensureDemoActivationGate(prisma, account.id);

    await prisma.auditEvent.create({
      data: {
        userId: user.id,
        accountId: account.id,
        kind: "data_state_updated",
        scope: "account",
        actorRole: "owner",
        accountMode: "demo",
        message: "Demo auth and compliance baseline initialized.",
        metadataJson: JSON.stringify({
          seed: "demo_bootstrap",
          disclosureKeys: REQUIRED_DISCLOSURES,
          disclosureVersion: LOCAL_DISCLOSURE_VERSION,
          reviewReference: REVIEW_REFERENCE,
        }),
      },
    });

    console.log("Demo bootstrap ready");
    console.log(`Email: ${DEMO_EMAIL}`);
    console.log(`Password: ${DEMO_PASSWORD}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
