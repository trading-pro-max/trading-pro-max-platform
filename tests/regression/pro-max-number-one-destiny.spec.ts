import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  PRO_MAX_INTERNAL_NORTH_STAR,
  PRO_MAX_STANDARDS,
  SAMPLE_NUMBER_ONE_TARGETS,
  calculateDestinyScore,
  detectDestinyDrift,
  evaluateAbsoluteCompletion,
  evaluateFounderEnergy,
  evaluateNorthStar,
  evaluateNumberOneTarget,
  evaluatePublicClaimFirewall,
  getNumberOneDestinySampleEvaluation,
  getNumberOneDestinySnapshot,
  protectPrimeWorld,
  type NumberOneEvaluationTarget,
} from "../../lib/server/number-one-destiny";

const ARTIFACT_DIR = path.join("test-results", "number-one-destiny");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /#1|number one|world['’]s best|global financial center|highest win rate|profit promise|guaranteed profit|Alkon|Founder Command|Number One Mission|Destiny Alignment|Drift Detector|Absolute Completion|Sovereign Standards|Genesis|Future Worlds|Task Passport|Result Tribunal|Product Memory internals|Risk Belt|Black Hole Zone|internal governance/i;

function target(
  overrides: Partial<NumberOneEvaluationTarget> = {}
): NumberOneEvaluationTarget {
  return {
    title: "Improve chart-first workspace",
    description:
      "Improve Pro Max Trading workspace clarity without public claims or activation.",
    type: "workspace",
    affectedSurface: "Trading Workspace",
    publicVisible: true,
    servesHumanNeed: true,
    improvesPrimeWorld: true,
    affectsChart: true,
    hasFunctionalProof: true,
    hasTruthProof: true,
    hasSafetyProof: true,
    hasOperationalProof: true,
    hasMemoryRule: true,
    hasCostJustification: true,
    hasTests: true,
    hasVisualAcceptance: false,
    stationStatus: "station_1_open",
    ...overrides,
  };
}

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Pro Max Number One Destiny Alignment", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents private doctrine and exposes founder-only read-only APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/pro-max-number-one-destiny-alignment.md",
      "docs/product/pro-max-number-one-internal-mission.md",
      "docs/product/pro-max-no-public-number-one-claim.md",
      "docs/product/pro-max-destiny-score.md",
      "docs/product/pro-max-drift-detector.md",
      "docs/product/pro-max-absolute-completion-law.md",
      "docs/product/pro-max-standards-authority.md",
      "docs/product/pro-max-founder-energy-gate.md",
      "docs/product/pro-max-worldline-protection.md",
      "docs/product/pro-max-number-one-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    expect((await request.get("/api/number-one-destiny/readiness")).status()).toBe(404);
    expect((await request.get("/api/alkon/number-one-destiny")).status()).toBe(404);

    const readiness = await request.get("/api/founder/number-one-destiny/readiness");
    expect(readiness.status()).toBe(200);
    const payload = await readiness.json();

    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noPublicNavigation: true,
      noSecrets: true,
      noExternalCalls: true,
      noFakeMetrics: true,
      publicNumberOneClaimForbidden: true,
      snapshot: {
        snapshotId: "pro_max_number_one_destiny_alignment",
        visibility: "private_founder_only",
        publicExposure: false,
        readiness: "ready",
        publicClaimStatus: "forbidden",
        noPublicNumberOneClaim: true,
        primeWorld: "Pro Max Trading",
        productTruthStatus: {
          liveExecutionBlocked: true,
          realMoneyBlocked: true,
          brokerFeedActivationBlocked: true,
          billingActivationBlocked: true,
          publicLaunchInactive: true,
          productionSecretsUntouched: true,
          authSecurityPreserved: true,
          noPublicNumberOneBestGlobalRegulatedClaims: true,
          noFakeClaims: true,
          noAlkonNumberOneExposureToPublicUsers: true,
          noShellExecutionFromWebApp: true,
          noImagesOrRasterAssets: true,
        },
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);

    for (const route of [
      "/api/founder/number-one-destiny/snapshot",
      "/api/founder/number-one-destiny/sample-evaluation",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(await response.text()).toMatch(/founderOnly|readOnly|noExecution/);
    }
  });

  test("keeps North Star private and blocks public number-one claims", () => {
    expect(PRO_MAX_INTERNAL_NORTH_STAR).toContain("world's #1");

    const aligned = evaluateNorthStar(target());
    expect(aligned.publicClaimForbidden).toBe(true);
    expect(aligned.northStarAlignment).toBe("aligned");

    const blocked = evaluateNorthStar(
      target({
        type: "public_copy",
        claimText: "Pro Max is #1, world's best, regulated, and guaranteed profit.",
        involvesPublicClaim: true,
      })
    );
    expect(blocked.northStarAlignment).toBe("blocked");
    expect(blocked.nextSafeAction).toMatch(/Replace the public claim/);

    const firewall = evaluatePublicClaimFirewall(
      "Pro Max is #1, the world's best global financial center, regulated, with guaranteed profit and highest win rate."
    );
    expect(firewall.status).toBe("blocked");
    expect(firewall.blockedTerms).toEqual(
      expect.arrayContaining(["#1", "world's best", "global financial center", "regulated", "profit", "win-rate"])
    );
  });

  test("Destiny Score caps weak proof and blocks unsafe activation", () => {
    const noProof = calculateDestinyScore(
      target({ hasFunctionalProof: false, hasTests: false })
    );
    expect(noProof.overallScore).toBeLessThanOrEqual(6);
    expect(noProof.noFakeTenOutOfTen).toBe(true);
    expect(noProof.requiredProof).toEqual(
      expect.arrayContaining(["functional proof", "tests"])
    );

    const claimRisk = calculateDestinyScore(
      target({
        type: "public_copy",
        claimText: "World's best regulated platform with profit promise.",
      })
    );
    expect(claimRisk.overallScore).toBeLessThanOrEqual(4);
    expect(claimRisk.recommendedDecision).toBe("review_required");

    const dangerous = calculateDestinyScore(
      target({ involvesLiveExecution: true, involvesRealMoney: true })
    );
    expect(dangerous.overallScore).toBeLessThanOrEqual(2);
    expect(dangerous.recommendedDecision).toBe("block");
  });

  test("Drift Detector flags future-world expansion and chart-not-king work", () => {
    const futureWorld = detectDestinyDrift(
      target({
        type: "future_world",
        publicVisible: false,
        expandsFutureWorld: true,
        improvesPrimeWorld: false,
      })
    );
    expect(futureWorld.map((drift) => drift.driftType)).toContain(
      "prime_world_distraction"
    );

    const weakChart = detectDestinyDrift(
      target({ affectsChart: true, improvesPrimeWorld: false })
    );
    expect(weakChart.map((drift) => drift.driftType)).toContain("chart_not_king");
    expect(
      weakChart.find((drift) => drift.driftType === "chart_not_king")
        ?.stopOrContinue
    ).toBe("block");
  });

  test("Absolute Completion requires function, truth, safety, proof, and Founder acceptance", () => {
    const checks = evaluateAbsoluteCompletion(
      target({
        hasFunctionalProof: false,
        hasTests: false,
        hasMemoryRule: false,
        hasFounderAcceptance: false,
      })
    );
    expect(checks.find((check) => check.checkId === "functional_completion")?.outcome).toBe(
      "needs_polish"
    );
    expect(
      checks.find((check) => check.checkId === "founder_acceptance_completion")?.outcome
    ).toBe("needs_polish");

    const claimChecks = evaluateAbsoluteCompletion(
      target({ type: "public_copy", claimText: "Guaranteed profit." })
    );
    expect(claimChecks.find((check) => check.checkId === "truth_completion")?.outcome).toBe(
      "blocked"
    );
  });

  test("Standards Authority, Founder Energy, and Worldline Protection stay deterministic", () => {
    expect(PRO_MAX_STANDARDS.map((standard) => standard.standardId)).toEqual(
      expect.arrayContaining([
        "chart_standard",
        "assistant_standard",
        "truth_standard",
        "security_standard",
        "accessibility_standard",
        "alkon_privacy_standard",
      ])
    );

    const energy = evaluateFounderEnergy(
      target({ increasesFounderLoad: true, requiresFounderNow: true })
    );
    expect(energy.decisionLoad).toBe("overload");
    expect(energy.oneNextDecision).toMatch(/one most important/);

    const worldline = protectPrimeWorld(
      target({ type: "future_world", expandsFutureWorld: true, publicVisible: false })
    );
    expect(worldline.requiredDelay).toBe(true);
    expect(worldline.allowedAsReadinessOnly).toBe(true);

    const report = evaluateNumberOneTarget(SAMPLE_NUMBER_ONE_TARGETS[1]);
    expect(report.decision).toBe("block");
    expect(report.publicClaimFirewall.status).toBe("blocked");
  });

  test("Founder Command and Alkon receive Number One Destiny readiness", async ({
    request,
  }) => {
    const snapshot = getNumberOneDestinySnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.publicClaimStatus).toBe("forbidden");
    expect(snapshot.nextOneCriticalDecision).toMatch(/Living Market Core/);
    expect(snapshot.memoryLessons.map((lesson) => lesson.lesson)).toEqual(
      expect.arrayContaining([
        "#1 is an internal standard, not a public claim.",
        "Chart is king.",
        "No future world before Prime World closure.",
      ])
    );

    const sample = getNumberOneDestinySampleEvaluation();
    expect(sample).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noSecrets: true,
    });

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.numberOneDestinyAlignment.readiness).toBe("ready");
    expect(
      alkon.snapshot.apiExposure.founderNumberOneDestinyReadinessRoute
    ).toBe("/api/founder/number-one-destiny/readiness");

    const founder = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founder.snapshot.numberOneDestiny).toMatchObject({
      snapshotId: "pro_max_number_one_destiny_alignment",
      visibility: "private_founder_only",
      publicExposure: false,
      publicClaimStatus: "forbidden",
    });
    expect(founder.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/number-one-destiny/readiness",
        "/api/founder/number-one-destiny/snapshot",
        "/api/founder/number-one-destiny/sample-evaluation",
      ])
    );
  });

  test("public UI has no number-one, global, Alkon, or internal mission terms", async ({
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
    const sourceFiles = [
      "lib/server/number-one-destiny/types.ts",
      "lib/server/number-one-destiny/north-star.ts",
      "lib/server/number-one-destiny/destiny-score.ts",
      "lib/server/number-one-destiny/drift-detector.ts",
      "lib/server/number-one-destiny/absolute-completion.ts",
      "lib/server/number-one-destiny/standards-authority.ts",
      "lib/server/number-one-destiny/founder-energy-gate.ts",
      "lib/server/number-one-destiny/worldline-protection.ts",
      "lib/server/number-one-destiny/public-claim-firewall.ts",
      "lib/server/number-one-destiny/memory.ts",
      "lib/server/number-one-destiny/decision-engine.ts",
      "lib/server/number-one-destiny/state.ts",
      "lib/server/number-one-destiny/index.ts",
      "app/api/founder/number-one-destiny/readiness/route.ts",
      "app/api/founder/number-one-destiny/snapshot/route.ts",
      "app/api/founder/number-one-destiny/sample-evaluation/route.ts",
      "modules/founder-command/components/AlkonNumberOneDestinyPanel.tsx",
      "modules/founder-command/components/AlkonNorthStarPanel.tsx",
      "modules/founder-command/components/AlkonDestinyScorePanel.tsx",
      "modules/founder-command/components/AlkonDriftDetectorPanel.tsx",
      "modules/founder-command/components/AlkonAbsoluteCompletionPanel.tsx",
      "modules/founder-command/components/AlkonFounderEnergyPanel.tsx",
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
