import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ALKON_SHARED_WORLD_SERVICES,
  ALKON_WORLD_SEEDS,
  canTransitionWorldLifecycle,
  evaluateLawGate,
  evaluateMarketGate,
  evaluateMeaningGate,
  evaluatePrimeWorldProtectionGate,
  evaluatePrototypeGate,
  evaluateSecurityGate,
  evaluateTreasuryGate,
  evaluateWorldSeed,
  getAlkonGenesisSampleEvaluation,
  getAlkonGenesisSnapshot,
  getPrimeWorldSnapshot,
  type AlkonWorldSeed,
} from "../../lib/server/alkon-genesis";

const ARTIFACT_DIR = path.join("test-results", "alkon-genesis");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|ط§ظ„ظƒظˆظ†|Founder Command|Sovereign Genesis|Genesis Universe|World Seeds|World Birth|Future Worlds|Prime World|Genesis Gates|World Factory|World Retirement|Birth Permit|Product Memory internals|Risk Belt|Black Hole Zone|Task Passport|Result Tribunal|governance/i;

function seed(overrides: Partial<AlkonWorldSeed> = {}): AlkonWorldSeed {
  return {
    seedId: "sample_seed",
    name: "Sample Future Seed",
    category: "future_unknown",
    purposeHypothesis: "Possible useful future readiness concept.",
    intendedAudience: "Founder/internal review",
    relationshipToPrime: "supports_prime_world",
    possibleValue: "May improve readiness after Prime World acceptance.",
    possibleRisk: "Could distract if ungated.",
    requiredGates: [
      "meaning_gate",
      "human_need_gate",
      "market_gate",
      "law_gate",
      "treasury_gate",
      "security_gate",
      "prototype_gate",
      "proof_gate",
      "prime_world_protection_gate",
      "founder_gate",
      "birth_gate",
    ],
    currentStatus: "seed",
    allowedScopeNow: ["docs", "read-only readiness"],
    forbiddenScopeNow: ["public page", "new product launch"],
    nextSafeAction: "Keep as private readiness.",
    publicVisible: false,
    founderVisible: true,
    founderApproval: "not_requested",
    ...overrides,
  };
}

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Sovereign Genesis System", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents Genesis doctrine and exposes founder-only read-only APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-sovereign-genesis-system.md",
      "docs/product/alkon-prime-world-doctrine.md",
      "docs/product/alkon-world-seeds.md",
      "docs/product/alkon-genesis-gates.md",
      "docs/product/alkon-world-birth-law.md",
      "docs/product/alkon-world-life-cycle.md",
      "docs/product/alkon-world-retirement-law.md",
      "docs/product/alkon-multi-world-constitution.md",
      "docs/product/alkon-shared-world-services.md",
      "docs/product/alkon-genesis-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    expect((await request.get("/api/alkon-genesis/readiness")).status()).toBe(404);
    expect((await request.get("/api/future-worlds")).status()).toBe(404);

    const readiness = await request.get("/api/founder/alkon-genesis/readiness");
    expect(readiness.status()).toBe(200);
    const payload = await readiness.json();

    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noProjectCreation: true,
      noExternalCalls: true,
      noSecrets: true,
      snapshot: {
        snapshotId: "alkon_sovereign_genesis_system",
        visibility: "private_founder_only",
        publicExposure: false,
        readiness: "ready",
        productTruthStatus: {
          tradingProMaxRemainsPrimeWorld: true,
          noNewProjectLaunched: true,
          noPublicFutureWorldsExposed: true,
          liveExecutionBlocked: true,
          realMoneyBlocked: true,
          brokerFeedActivationBlocked: true,
          billingActivationBlocked: true,
          publicLaunchInactive: true,
          productionSecretsUntouched: true,
          noSecretsExposed: true,
          noShellExecutionFromWebApp: true,
          noImagesOrRasterAssets: true,
          noFakeClaims: true,
        },
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);

    for (const route of [
      "/api/founder/alkon-genesis/snapshot",
      "/api/founder/alkon-genesis/world-seeds",
      "/api/founder/alkon-genesis/sample-evaluation",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(await response.text()).toMatch(/founderOnly|readOnly|noExecution|noProjectCreation/);
    }
  });

  test("keeps Pro Max Trading as Prime World and registers private World Seeds", () => {
    const primeWorld = getPrimeWorldSnapshot();
    expect(primeWorld.name).toBe("Pro Max Trading");
    expect(primeWorld.motherBrand).toBe("Pro Max");
    expect(primeWorld.legacyProjectName).toBe("Trading Pro Max");
    expect(primeWorld.status).toBe("prime_world_protected");
    expect(primeWorld.newWorldLimit).toBe("seed_or_prototype_readiness_only");

    expect(ALKON_WORLD_SEEDS.length).toBeGreaterThanOrEqual(7);
    expect(ALKON_WORLD_SEEDS.every((item) => !item.publicVisible)).toBe(true);
    expect(ALKON_WORLD_SEEDS.map((item) => item.category)).toEqual(
      expect.arrayContaining([
        "media_ai_studio",
        "education_academy",
        "treasury_business_ops",
        "mobile_command_tool",
        "financial_intelligence_product",
        "support_platform",
        "analytics_platform",
      ])
    );
  });

  test("Genesis gates reject unclear, vanity, distracting, regulatory, spend, and public-Alkon seeds", () => {
    expect(
      evaluateMeaningGate(
        seed({ purposeHypothesis: "cool", category: "future_unknown" })
      ).status
    ).toBe("reject");

    expect(
      evaluateWorldSeed(
        seed({
          possibleValue: "vanity brand stunt",
          purposeHypothesis: "A vanity concept without a real human need.",
        })
      ).decision
    ).toBe("reject_seed");

    expect(
      evaluateMarketGate(
        seed({ relationshipToPrime: "distracts_from_prime_world" })
      ).status
    ).toBe("delay");

    expect(
      evaluateLawGate(
        seed({
          category: "financial_intelligence_product",
          requiresRegulatoryReview: true,
        })
      ).status
    ).toBe("blocked");

    expect(
      evaluateTreasuryGate(seed({ requiresExternalSpend: true })).status
    ).toBe("delay");

    expect(evaluateSecurityGate(seed({ publicVisible: true })).status).toBe(
      "black_hole"
    );
  });

  test("Prototype, Proof, Prime World protection, Founder gate, and Birth Permit remain gated", () => {
    const docsPrototype = evaluatePrototypeGate(seed());
    expect(docsPrototype.status).toBe("pass");
    expect(docsPrototype.safeAlternative).toMatch(/no functional|no|Prototype/i);

    const proofless = evaluateWorldSeed(seed({ category: "education_academy" }));
    expect(proofless.birthPermit.status).not.toBe("birth_permitted");
    expect(proofless.birthPermit.noExecution).toBe(true);
    expect(proofless.birthPermit.noProjectCreation).toBe(true);

    const weakensPrime = evaluatePrimeWorldProtectionGate(
      seed({ relationshipToPrime: "weakens_prime_world" })
    );
    expect(weakensPrime.status).toBe("reject");

    const prototypeAllowed = evaluateWorldSeed(
      ALKON_WORLD_SEEDS.find((item) => item.seedId === "academy_platform_seed")!
    );
    expect(prototypeAllowed.decision).toBe("prototype_allowed");
    expect(prototypeAllowed.birthPermit.status).toBe("prototype_only");
  });

  test("World lifecycle cannot skip stages and shared services are mandatory", () => {
    expect(canTransitionWorldLifecycle("seed", "evaluate")).toBe(true);
    expect(canTransitionWorldLifecycle("seed", "birth")).toBe(false);
    expect(ALKON_SHARED_WORLD_SERVICES).toEqual(
      expect.arrayContaining([
        "Product Truth",
        "Security / Secrets",
        "Treasury",
        "Legal Gates",
        "Media Claims Firewall",
        "Memory",
        "Codex Governance",
        "Result Tribunal",
        "Assistant Intent Layer",
        "Device Readiness",
        "Launch Gates",
        "Public/Private Boundaries",
      ])
    );
  });

  test("snapshot integrates with Alkon and Founder Command without public exposure", async ({
    request,
  }) => {
    const snapshot = getAlkonGenesisSnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.primeWorld.name).toBe("Pro Max Trading");
    expect(snapshot.worldSeedCount).toBeGreaterThanOrEqual(7);
    expect(snapshot.prototypeAllowedSeeds).toContain("academy_platform_seed");
    expect(snapshot.productTruthStatus.noNewProjectLaunched).toBe(true);

    const sample = getAlkonGenesisSampleEvaluation();
    expect(sample).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noProjectCreation: true,
      noPublicPageCreated: true,
      noSecrets: true,
    });

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.sovereignGenesis.readiness).toBe("ready");
    expect(alkon.snapshot.apiExposure.founderGenesisReadinessRoute).toBe(
      "/api/founder/alkon-genesis/readiness"
    );

    const founder = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founder.snapshot.alkonGenesis).toMatchObject({
      snapshotId: "alkon_sovereign_genesis_system",
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founder.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/alkon-genesis/readiness",
        "/api/founder/alkon-genesis/snapshot",
        "/api/founder/alkon-genesis/world-seeds",
        "/api/founder/alkon-genesis/sample-evaluation",
      ])
    );
  });

  test("public UI does not expose Genesis or future-world language", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
    });

    await page.goto("/diagnostics", { waitUntil: "domcontentloaded" });
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });
  });

  test("implementation remains code-only, secret-free, non-launching, and non-executing", () => {
    const sourceFiles = [
      "lib/server/alkon-genesis/types.ts",
      "lib/server/alkon-genesis/prime-world.ts",
      "lib/server/alkon-genesis/world-seeds.ts",
      "lib/server/alkon-genesis/meaning-gate.ts",
      "lib/server/alkon-genesis/human-need-gate.ts",
      "lib/server/alkon-genesis/market-gate.ts",
      "lib/server/alkon-genesis/law-gate.ts",
      "lib/server/alkon-genesis/treasury-gate.ts",
      "lib/server/alkon-genesis/security-gate.ts",
      "lib/server/alkon-genesis/prototype-gate.ts",
      "lib/server/alkon-genesis/proof-gate.ts",
      "lib/server/alkon-genesis/prime-world-protection-gate.ts",
      "lib/server/alkon-genesis/founder-gate.ts",
      "lib/server/alkon-genesis/birth-permit.ts",
      "lib/server/alkon-genesis/world-lifecycle.ts",
      "lib/server/alkon-genesis/shared-services.ts",
      "lib/server/alkon-genesis/memory.ts",
      "lib/server/alkon-genesis/engine.ts",
      "lib/server/alkon-genesis/state.ts",
      "lib/server/alkon-genesis/index.ts",
      "app/api/founder/alkon-genesis/readiness/route.ts",
      "app/api/founder/alkon-genesis/snapshot/route.ts",
      "app/api/founder/alkon-genesis/world-seeds/route.ts",
      "app/api/founder/alkon-genesis/sample-evaluation/route.ts",
      "modules/founder-command/components/AlkonGenesisPanel.tsx",
      "modules/founder-command/components/AlkonPrimeWorldPanel.tsx",
      "modules/founder-command/components/AlkonWorldSeedsPanel.tsx",
      "modules/founder-command/components/AlkonGenesisGatesPanel.tsx",
      "modules/founder-command/components/AlkonWorldBirthPermitPanel.tsx",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/paymentExecutionStatus:\s*["']enabled["']/);
    expect(source).not.toMatch(/noProjectCreation:\s*false/);
    expect(source).not.toMatch(/noLaunch:\s*false/);
  });
});
