import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ALKON_RUNTIME_MANDATORY_LESSONS,
  assignAlkonRuntimeCivilization,
  assignAlkonRuntimeGravity,
  assignAlkonRuntimeLife,
  assignAlkonRuntimeSpace,
  assignAlkonRuntimeTime,
  decideAlkonRealityAdmission,
  decideAlkonRuntimeLaw,
  decideAlkonRuntimeNextFate,
  evaluateAlkonRuntimeCommunication,
  evaluateAlkonRuntimeConsequence,
  evaluateAlkonRuntimeDefense,
  evaluateAlkonRuntimeEconomy,
  getAlkonRuntimeSampleInput,
  getAlkonRuntimeSnapshot,
  routeAlkonRuntimeOrbit,
  runAlkonRuntime,
  type AlkonRuntimeInput,
} from "../../lib/server/alkon-runtime";

const ARTIFACT_DIR = path.join("test-results", "alkon-runtime");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Digital Universe Runtime|Reality Admission|Consequence Layer|Next Fate|Black Hole Zone|Product Memory internals|Codex tasks|treasury controls|secrets authority|\bSpace\b|\bGravity\b|\bOrbit\b/i;

function input(overrides: Partial<AlkonRuntimeInput> = {}): AlkonRuntimeInput {
  return {
    category: "founder_idea",
    title: "Improve safe local product clarity",
    description:
      "Give the idea place, time, law, gravity, orbit, proof, memory, and next fate without execution.",
    requestedBy: "founder",
    affectedWorld: "private_alkon",
    currentStage: "laptop_planet",
    hasRollback: true,
    ...overrides,
  };
}

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Digital Universe Runtime", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents runtime doctrine and exposes founder-only read-only APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-digital-universe-runtime.md",
      "docs/product/alkon-space-layer.md",
      "docs/product/alkon-time-layer.md",
      "docs/product/alkon-law-layer.md",
      "docs/product/alkon-gravity-layer.md",
      "docs/product/alkon-orbit-layer.md",
      "docs/product/alkon-life-layer.md",
      "docs/product/alkon-civilization-layer.md",
      "docs/product/alkon-economy-layer.md",
      "docs/product/alkon-defense-layer.md",
      "docs/product/alkon-communication-layer.md",
      "docs/product/alkon-reality-layer.md",
      "docs/product/alkon-consequence-layer.md",
      "docs/product/alkon-memory-layer.md",
      "docs/product/alkon-next-fate-law.md",
      "docs/product/alkon-digital-universe-runtime-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    expect((await request.get("/api/alkon-runtime/readiness")).status()).toBe(404);
    expect((await request.get("/api/runtime/readiness")).status()).toBe(404);

    const readiness = await request.get("/api/founder/alkon-runtime/readiness");
    expect(readiness.status()).toBe(200);
    const payload = await readiness.json();

    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      previewOnly: true,
      noExecution: true,
      noDeletion: true,
      noPayments: true,
      noSecrets: true,
      noExternalCalls: true,
      snapshot: {
        snapshotId: "alkon_digital_universe_runtime",
        visibility: "private_founder_only",
        publicExposure: false,
        readiness: "ready",
        productTruthStatus: {
          liveExecutionBlocked: true,
          realMoneyBlocked: true,
          brokerFeedActivationBlocked: true,
          billingActivationBlocked: true,
          publicLaunchInactive: true,
          noPaymentExecution: true,
          noDeletionExecution: true,
          noShellExecutionFromWebApp: true,
          noDirectCodexExecutionFromWebApp: true,
          noSecretsExposed: true,
          noImagesOrRasterAssets: true,
          noFakeClaims: true,
        },
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);

    for (const route of [
      "/api/founder/alkon-runtime/snapshot",
      "/api/founder/alkon-runtime/sample-input",
      "/api/founder/alkon-runtime/next-fate",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(await response.text()).toMatch(
        /founderOnly|readOnly|sampleOnly|previewOnly|noExecution|noDeletion/
      );
    }
  });

  test("processes idea, chart, invoice, and media inputs safely", () => {
    const idea = runAlkonRuntime(input());
    expect(idea.space.assignedWorld).toBe("private_alkon");
    expect(idea.law.lawDecision).toBe("readiness_only");
    expect(idea.nextFate.noExecution).toBe(true);

    const chart = runAlkonRuntime(
      input({
        category: "chart_issue",
        title: "Chart is crowded",
        description: "Chart needs calmer chart-first proof.",
        affectedWorld: "public_earth",
        affectedSurface: "Trading Workspace",
      })
    );
    expect(chart.space.assignedSpace).toBe("Market Workspace");
    expect(chart.gravity.gravity).toBe("P1_high");
    expect(chart.orbit.orbit).toBe("market_workspace_orbit");

    const invoice = runAlkonRuntime(
      input({
        category: "invoice",
        title: "Review vendor invoice",
        description: "Classify invoice only; no payment execution.",
        amount: 140,
        currency: "CHF",
        hasInvoice: true,
        hasBudget: false,
        hasReserve: false,
      })
    );
    expect(invoice.economy.economyDecision).toBe("review_required");
    expect(invoice.economy.paymentExecutionStatus).toBe("disabled");
    expect(invoice.economy.bankCardDataStatus).toBe("forbidden");

    const media = runAlkonRuntime(
      input({
        category: "media_message",
        title: "Explain platform status",
        description: "Write public-safe app status.",
        claimText: "Web App current; Desktop App planned; Mobile App planned.",
      })
    );
    expect(media.communication.publishingStatus).toBe("inactive");
    expect(media.communication.safeWording).toMatch(/paper-safe|planned|inactive/i);
  });

  test("black-holes dangerous activation, secrets, payment execution, and public Alkon", () => {
    for (const category of [
      "live_request",
      "real_money_request",
      "billing_request",
      "broker_feed_request",
      "social_publish_request",
    ] as const) {
      const report = runAlkonRuntime(
        input({
          category,
          title: `Forbidden ${category}`,
          description: "Activate this real-world system now with secrets.",
          requiresSecrets: true,
          hasRollback: false,
        })
      );
      expect(report.law.lawDecision).toBe("black_holed");
      expect(report.gravity.gravity).toBe("black_hole");
      expect(report.orbit.orbit).toBe("black_hole_orbit");
      expect(report.reality.realityAdmission).toBe("black_hole_forbidden");
      expect(report.nextFate.fate).toBe("black_hole");
    }

    const payment = runAlkonRuntime(
      input({
        category: "invoice",
        title: "Pay with card data",
        description: "Execute payment with card number and CVV.",
        requestsPaymentExecution: true,
        containsBankCardData: true,
      })
    );
    expect(payment.law.lawDecision).toBe("black_holed");
    expect(payment.economy.paymentExecutionStatus).toBe("disabled");

    const publicAlkon = runAlkonRuntime(
      input({
        category: "founder_idea",
        title: "Expose Alkon publicly",
        description: "Show Alkon and Founder Command in public navigation.",
        publicVisible: true,
      })
    );
    expect(publicAlkon.law.lawDecision).toBe("black_holed");
  });

  test("individual runtime layers return deterministic safe decisions", () => {
    const base = input({ category: "claim_risk", claimText: "Guaranteed profit." });
    const space = assignAlkonRuntimeSpace(base);
    const time = assignAlkonRuntimeTime(base);
    const law = decideAlkonRuntimeLaw(base);
    const gravity = assignAlkonRuntimeGravity(base, law);
    const orbit = routeAlkonRuntimeOrbit(base, law, gravity);
    const life = assignAlkonRuntimeLife(base, law, orbit);
    const civilization = assignAlkonRuntimeCivilization(orbit);
    const economy = evaluateAlkonRuntimeEconomy(base, law);
    const defense = evaluateAlkonRuntimeDefense(base, law);
    const communication = evaluateAlkonRuntimeCommunication(base, law);
    const reality = decideAlkonRealityAdmission(base, law, economy, defense);
    const consequence = evaluateAlkonRuntimeConsequence(base, law, reality);
    const nextFate = decideAlkonRuntimeNextFate(law, gravity, consequence);

    expect(space.founderVisible).toBe(true);
    expect(time.decision).toBe("after_legal_review");
    expect(law.lawDecision).toBe("blocked");
    expect(gravity.gravity).toBe("P0_critical");
    expect(orbit.forbiddenActions).toContain("payment execution");
    expect(life.requiredProof.length).toBeGreaterThan(0);
    expect(civilization.reportTarget).toMatch(/Founder Command/);
    expect(economy.paymentExecutionStatus).toBe("disabled");
    expect(defense.requiredProtection.length).toBeGreaterThan(0);
    expect(communication.publishingStatus).toBe("inactive");
    expect(reality.realityAdmission).toBe("blocked_until_cleared");
    expect(consequence.memoryNeeded).toBe(true);
    expect(nextFate.noDeletion).toBe(true);
  });

  test("integrates with Alkon universe and Founder Command snapshots", async ({
    request,
  }) => {
    const snapshot = getAlkonRuntimeSnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.memoryLessons).toEqual(
      expect.arrayContaining([
        "No images unless explicit.",
        "No raster assets.",
        "Chart is king.",
        "Alkon is private.",
      ])
    );
    expect(ALKON_RUNTIME_MANDATORY_LESSONS).toContain(
      "Payments require invoice, budget, reserve, and Founder approval."
    );

    const sample = getAlkonRuntimeSampleInput();
    expect(sample).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noDeletion: true,
      noPayments: true,
      noSecrets: true,
    });

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.digitalUniverseRuntimeSnapshot.readiness).toBe("ready");
    expect(alkon.snapshot.apiExposure.founderRuntimeReadinessRoute).toBe(
      "/api/founder/alkon-runtime/readiness"
    );

    const founder = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founder.snapshot.alkonRuntime).toMatchObject({
      snapshotId: "alkon_digital_universe_runtime",
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founder.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/alkon-runtime/readiness",
        "/api/founder/alkon-runtime/snapshot",
        "/api/founder/alkon-runtime/sample-input",
        "/api/founder/alkon-runtime/next-fate",
      ])
    );
  });

  test("public UI does not expose runtime terms", async ({ page }) => {
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

  test("implementation remains code-only, secret-free, non-paying, non-deleting, and non-executing", () => {
    const sourceFiles = [
      "lib/server/alkon-runtime/types.ts",
      "lib/server/alkon-runtime/space-layer.ts",
      "lib/server/alkon-runtime/time-layer.ts",
      "lib/server/alkon-runtime/law-layer.ts",
      "lib/server/alkon-runtime/gravity-layer.ts",
      "lib/server/alkon-runtime/orbit-layer.ts",
      "lib/server/alkon-runtime/life-layer.ts",
      "lib/server/alkon-runtime/civilization-layer.ts",
      "lib/server/alkon-runtime/economy-layer.ts",
      "lib/server/alkon-runtime/defense-layer.ts",
      "lib/server/alkon-runtime/communication-layer.ts",
      "lib/server/alkon-runtime/reality-layer.ts",
      "lib/server/alkon-runtime/consequence-layer.ts",
      "lib/server/alkon-runtime/memory-layer.ts",
      "lib/server/alkon-runtime/next-fate.ts",
      "lib/server/alkon-runtime/engine.ts",
      "lib/server/alkon-runtime/state.ts",
      "app/api/founder/alkon-runtime/readiness/route.ts",
      "app/api/founder/alkon-runtime/snapshot/route.ts",
      "app/api/founder/alkon-runtime/sample-input/route.ts",
      "app/api/founder/alkon-runtime/next-fate/route.ts",
      "modules/founder-command/components/AlkonRuntimePanel.tsx",
      "modules/founder-command/components/AlkonRuntimeMapPanel.tsx",
      "modules/founder-command/components/AlkonRuntimeLayersPanel.tsx",
      "modules/founder-command/components/AlkonRuntimeFatePanel.tsx",
      "modules/founder-command/components/AlkonRuntimeConsequencesPanel.tsx",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/Remove-Item|unlinkSync|rmSync|rmdirSync|DELETE\s*\(/);
    expect(source).not.toMatch(/paymentExecutionStatus:\s*["']enabled["']/);
  });
});
