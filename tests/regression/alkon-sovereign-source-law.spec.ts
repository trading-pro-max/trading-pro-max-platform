import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  AHMAD_VISION_CORE,
  SAMPLE_SOURCE_LAW_TARGETS,
  SOURCE_LAW_MEMORY_LESSONS,
  decideOneCorrectAction,
  detectSourceDrift,
  evaluateHumanValue,
  evaluateProofCheck,
  evaluateSafetyCheck,
  evaluateSourceLawTarget,
  evaluateTruthCheck,
  evaluateVisionCore,
  getSourceLawOneCorrectAction,
  getSourceLawReadiness,
  getSourceLawSampleEvaluation,
  getSourceLawSnapshot,
  type SourceLawTarget,
} from "../../lib/server/source-law";

const ARTIFACT_DIR = path.join("test-results", "source-law");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Source Law|Sovereign Source|Ahmad Vision Core|One Correct Action|Source Drift|internal decision doctrine|internal governance|Task Passport|Result Tribunal|Product Memory internals|Risk Belt|Black Hole Zone/i;

function target(overrides: Partial<SourceLawTarget> = {}): SourceLawTarget {
  return {
    title: "Close Living Market Core proof",
    description:
      "Prove Pro Max Trading workspace truth, safety, chart focus, and Local Day One usefulness.",
    type: "workspace",
    affectedSurface: "Trading Workspace",
    currentStation: "station_1_open",
    publicVisible: true,
    servesHuman: true,
    improvesClarity: true,
    improvesTrust: true,
    improvesSafePractice: true,
    reducesConfusion: true,
    supportsFounderOperation: true,
    protectsBeginners: true,
    reducesClutter: true,
    improvesPrimeWorld: true,
    affectsChart: true,
    hasTruthProof: true,
    hasSafetyProof: true,
    hasValidationProof: true,
    hasScreenshots: true,
    hasPublicLeakCheck: true,
    hasProductTruthCheck: true,
    hasGitProof: true,
    ...overrides,
  };
}

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Sovereign Source Law", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents private doctrine and exposes only founder read-only APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-sovereign-source-law.md",
      "docs/product/alkon-source-of-decision.md",
      "docs/product/ahmad-vision-core.md",
      "docs/product/pro-max-human-value-law.md",
      "docs/product/pro-max-truth-safety-proof-law.md",
      "docs/product/one-correct-action-law.md",
      "docs/product/source-alignment-vs-drift.md",
      "docs/product/alkon-source-law-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    expect((await request.get("/api/source-law/readiness")).status()).toBe(404);
    expect((await request.get("/api/alkon/source-law")).status()).toBe(404);

    const readiness = await request.get("/api/founder/source-law/readiness");
    expect(readiness.status()).toBe(200);
    const payload = await readiness.json();

    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noPayments: true,
      noExternalCalls: true,
      noSecrets: true,
      noPublicNavigation: true,
      noPublicApi: true,
      noPublicDoctrine: true,
      snapshot: {
        snapshotId: "alkon_sovereign_source_law",
        visibility: "private_founder_only",
        publicExposure: false,
        readiness: "ready",
        primeWorld: "Pro Max Trading",
        productTruthStatus: {
          liveExecutionBlocked: true,
          realMoneyBlocked: true,
          brokerFeedActivationBlocked: true,
          billingActivationBlocked: true,
          publicLaunchInactive: true,
          productionSecretsUntouched: true,
          authSecurityPreserved: true,
          noSecretsExposed: true,
          noPublicSourceLawExposure: true,
          noShellExecutionFromWebApp: true,
          noImagesOrRasterAssets: true,
        },
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);

    for (const route of [
      "/api/founder/source-law/snapshot",
      "/api/founder/source-law/one-correct-action",
      "/api/founder/source-law/sample-evaluation",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(await response.text()).toMatch(/founderOnly|readOnly|noExecution/);
    }
  });

  test("Vision Core exists privately and never justifies unsafe activation", () => {
    expect(AHMAD_VISION_CORE.privateFounderSource).toBe(true);
    expect(AHMAD_VISION_CORE.noPublicDoctrine).toBe(true);
    expect(AHMAD_VISION_CORE.noPublicNumberOneClaim).toBe(true);

    const aligned = evaluateVisionCore(target());
    expect(aligned.visionAlignment).toBe("aligned");

    const blocked = evaluateVisionCore(
      target({
        involvesLiveExecution: true,
        involvesRealMoney: true,
        involvesBrokerFeed: true,
      })
    );
    expect(blocked.visionAlignment).toBe("blocked");
  });

  test("Human Value check delays useless or vanity targets", () => {
    const useless = evaluateHumanValue(
      target({
        title: "Vanity theory",
        publicVisible: false,
        servesHuman: false,
        supportsFounderOperation: false,
        improvesPrimeWorld: false,
        improvesClarity: false,
        improvesTrust: false,
        improvesSafePractice: false,
        reducesConfusion: false,
        protectsBeginners: false,
        reducesClutter: false,
        affectsChart: false,
        addsComplexity: true,
        theoryOnly: true,
      })
    );

    expect(useless.humanValueScore).toBe(0);
    expect(useless.decision).toBe("archive");
  });

  test("Truth Check blocks fake claims and public number-one wording", () => {
    const truth = evaluateTruthCheck(
      target({
        type: "public_copy",
        claimText:
          "Pro Max is #1, regulated, live, available in the app store, and guarantees profit with highest win rate.",
        involvesFakeClaim: true,
        involvesFakeNumberOneClaim: true,
        involvesLiveExecution: true,
      })
    );

    expect(truth.truthStatus).toBe("blocked");
    expect(truth.decision).toBe("block");
    expect(truth.falseClaimRisk).toEqual(
      expect.arrayContaining([
        "fake number-one or best claim",
        "profit or win-rate claim",
        "fake or premature live execution",
      ])
    );
  });

  test("Safety Check blocks live, real money, billing, broker, secrets, shell, Codex, and public Alkon", () => {
    const safety = evaluateSafetyCheck(
      target({
        involvesLiveExecution: true,
        involvesRealMoney: true,
        involvesBrokerFeed: true,
        involvesBilling: true,
        involvesSecrets: true,
        involvesBankCardData: true,
        involvesShellExecution: true,
        involvesDirectCodexExecution: true,
        exposesAlkonPublicly: true,
      })
    );

    expect(safety.safetyStatus).toBe("blocked");
    expect(safety.decision).toBe("block");
    expect(safety.blockedReasons).toEqual(
      expect.arrayContaining([
        "secrets exposure risk",
        "bank or card data risk",
        "web shell execution request",
        "direct Codex execution from web app",
        "public Alkon exposure",
        "live execution activation",
        "real-money activation",
        "broker/feed activation",
        "billing activation",
      ])
    );
  });

  test("Proof Check blocks closure without validation and required evidence", () => {
    const proof = evaluateProofCheck(
      target({
        hasValidationProof: false,
        hasTruthProof: false,
        hasSafetyProof: false,
        hasScreenshots: false,
        hasPublicLeakCheck: false,
        hasProductTruthCheck: false,
        hasGitProof: false,
      })
    );

    expect(proof.canClose).toBe(false);
    expect(proof.proofStatus).toBe("needs_proof");
    expect(proof.missingProof).toEqual(
      expect.arrayContaining([
        "validation proof",
        "Product Truth proof",
        "safety proof",
        "public leak check",
        "public Product Truth check",
        "screenshot or public visual proof",
        "git proof",
      ])
    );
  });

  test("One Correct Action prioritizes Living Market Core while Station 1 is open", () => {
    const decision = decideOneCorrectAction({
      currentStation: "station_1_open",
      livingMarketCoreClosed: false,
      visualAcceptancePending: true,
    });

    expect(decision.oneCorrectAction).toMatch(/Living Market Core/);
    expect(decision.whyThisNow).toMatch(/Prime World/);

    const snapshotAction = getSourceLawOneCorrectAction();
    expect(snapshotAction.oneCorrectAction.oneCorrectAction).toMatch(
      /Living Market Core/
    );
  });

  test("Source Drift flags complexity without impact and expansion before Prime World closure", () => {
    const drifts = detectSourceDrift(
      target({
        publicVisible: false,
        servesHuman: false,
        supportsFounderOperation: false,
        improvesPrimeWorld: false,
        addsComplexity: true,
        theoryOnly: true,
        expandsFutureWorld: true,
      })
    );

    expect(drifts.filter((signal) => signal.driftDetected).map((signal) => signal.driftType)).toEqual(
      expect.arrayContaining([
        "complexity_without_user_value",
        "theory_without_product_impact",
        "expansion_before_prime_world",
      ])
    );
  });

  test("Source Law engine returns one correct action and preserves Product Truth", () => {
    const report = evaluateSourceLawTarget(SAMPLE_SOURCE_LAW_TARGETS[0]);
    expect(report.oneCorrectAction.oneCorrectAction).toMatch(/Living Market Core/);
    expect(report.decision).toBe("needs_founder_review");

    const blocked = evaluateSourceLawTarget(SAMPLE_SOURCE_LAW_TARGETS[4]);
    expect(blocked.decision).toBe("block");
    expect(blocked.safety.blockedReasons).toEqual(
      expect.arrayContaining(["live execution activation", "real-money activation"])
    );

    const snapshot = getSourceLawSnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.memoryLessons.map((lesson) => lesson.lesson)).toEqual(
      expect.arrayContaining([
        "Alkon protects the reason Pro Max exists.",
        "No decision without source; no source without human value.",
        "Chart is king.",
        "Alkon is private.",
      ])
    );
    expect(snapshot.productTruthStatus.liveExecutionBlocked).toBe(true);
    expect(snapshot.productTruthStatus.noPublicSourceLawExposure).toBe(true);

    const readiness = getSourceLawReadiness();
    expect(readiness).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noSecrets: true,
    });

    const sample = getSourceLawSampleEvaluation();
    expect(sample.report.oneCorrectAction.oneCorrectAction).toMatch(/Living Market Core/);
  });

  test("Founder Command and Alkon receive Source Law readiness", async ({
    request,
  }) => {
    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.sovereignSourceLaw).toMatchObject({
      snapshotId: "alkon_sovereign_source_law",
      visibility: "private_founder_only",
      publicExposure: false,
      readiness: "ready",
    });
    expect(alkon.snapshot.apiExposure.founderSourceLawReadinessRoute).toBe(
      "/api/founder/source-law/readiness"
    );

    const founder = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founder.snapshot.sourceLaw).toMatchObject({
      snapshotId: "alkon_sovereign_source_law",
      visibility: "private_founder_only",
      publicExposure: false,
      readiness: "ready",
    });
    expect(founder.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/source-law/readiness",
        "/api/founder/source-law/snapshot",
        "/api/founder/source-law/one-correct-action",
        "/api/founder/source-law/sample-evaluation",
      ])
    );
  });

  test("public UI does not expose Source Law, Alkon, or internal governance terms", async ({
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

  test("implementation remains code-only, secret-free, and non-executing", () => {
    expect(SOURCE_LAW_MEMORY_LESSONS.length).toBeGreaterThanOrEqual(10);

    const sourceFiles = [
      "lib/server/source-law/types.ts",
      "lib/server/source-law/vision-core.ts",
      "lib/server/source-law/human-value.ts",
      "lib/server/source-law/truth-check.ts",
      "lib/server/source-law/safety-check.ts",
      "lib/server/source-law/proof-check.ts",
      "lib/server/source-law/one-correct-action.ts",
      "lib/server/source-law/source-drift.ts",
      "lib/server/source-law/memory.ts",
      "lib/server/source-law/engine.ts",
      "lib/server/source-law/state.ts",
      "lib/server/source-law/index.ts",
      "app/api/founder/source-law/readiness/route.ts",
      "app/api/founder/source-law/snapshot/route.ts",
      "app/api/founder/source-law/one-correct-action/route.ts",
      "app/api/founder/source-law/sample-evaluation/route.ts",
      "modules/founder-command/components/AlkonSourceLawPanel.tsx",
      "modules/founder-command/components/AlkonVisionCorePanel.tsx",
      "modules/founder-command/components/AlkonOneCorrectActionPanel.tsx",
      "modules/founder-command/components/AlkonSourceDriftPanel.tsx",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/liveExecutionActive:\s*true/);
    expect(source).not.toMatch(/billingActivationActive:\s*true/);
    expect(source).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(source).not.toMatch(/realMoneyRoutingActive:\s*true/);
  });
});
