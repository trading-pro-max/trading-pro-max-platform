import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  assignAlkonGravity,
  decideAlkonLaw,
  evolveAlkonRules,
  getAlkonConsciousnessSnapshot,
  getAlkonMemoryLessons,
  interpretAlkonMeaning,
  judgeAlkonResult,
  prepareAlkonAction,
  routeAlkonSignal,
  senseAlkonSignal,
} from "../../lib/server/alkon-consciousness";

const ARTIFACT_DIR = path.join("test-results", "alkon-consciousness");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key|secret token value|password value/i;
const PUBLIC_CONSCIOUSNESS_FORBIDDEN_TERMS =
  /Alkon|الكون|Sovereign Operating Consciousness|Sense\s*(->|\/).*Meaning|Law\s*(->|\/).*Gravity|Route\s*(->|\/).*Act|Judge\s*(->|\/).*Remember|Founder Command|Product Memory|Codex Government|Result Tribunal|Cosmic Operating Physics|Ontology|Task Passport|Codex License/;

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_CONSCIOUSNESS_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Sovereign Operating Consciousness", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("defines private doctrine, docs, and readiness API", async ({ request }) => {
    const requiredDocs = [
      "docs/product/alkon-sovereign-operating-consciousness.md",
      "docs/product/alkon-sense-layer.md",
      "docs/product/alkon-meaning-layer.md",
      "docs/product/alkon-law-layer.md",
      "docs/product/alkon-gravity-layer.md",
      "docs/product/alkon-route-layer.md",
      "docs/product/alkon-action-layer.md",
      "docs/product/alkon-judgment-layer.md",
      "docs/product/alkon-memory-evolution-layer.md",
      "docs/product/alkon-consciousness-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const publicResponse = await request.get("/api/alkon-consciousness/status");
    expect(publicResponse.status()).toBe(404);

    const response = await request.get("/api/founder/alkon-consciousness/readiness");
    expect(response.status()).toBe(200);
    const payload = await response.json();

    expect(payload.snapshot).toMatchObject({
      snapshotId: "alkon_sovereign_operating_consciousness",
      visibility: "private_founder_only",
      publicExposure: false,
      status: "ready",
      doctrine: {
        notHumanConsciousness: true,
        notIndependentAi: true,
        noUncontrolledAutonomy: true,
        founderFinalAuthority: true,
        productTruthIsLaw: true,
        codexIsWorkerNotRuler: true,
      },
      publicExposureStatus: {
        publicUiVisible: false,
        publicApiRoutesExposed: false,
        publicNavigationVisible: false,
        diagnosticsLeak: false,
      },
      productTruthStatus: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        publicLaunchInactive: true,
        socialPublishingInactive: true,
        productionSecretsUntouched: true,
        noShellExecutionFromWebApp: true,
        noDirectCodexExecutionFromWebApp: true,
        noImagesOrRasterAssets: true,
        noFakeClaims: true,
        noSecretsExposed: true,
      },
    });
    expect(payload.snapshot.flow).toEqual([
      "sense",
      "meaning",
      "law",
      "gravity",
      "route",
      "act",
      "judge",
      "remember",
      "evolve",
    ]);
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);
  });

  test("sense and meaning classify signals", () => {
    expect(senseAlkonSignal("الشارت مزعج")).toMatchObject({
      type: "chart_annoyance",
      surface: "Trading Workspace",
    });
    expect(senseAlkonSignal("duplicate topbars in workspace")).toMatchObject({
      type: "shell_duplication",
      surface: "Shell / Navigation",
    });
    expect(senseAlkonSignal("الشعار مرفوض")).toMatchObject({
      type: "logo_rejection",
      surface: "Visual Identity",
    });
    expect(senseAlkonSignal("enable billing now")).toMatchObject({
      type: "billing_request",
    });

    const securitySignal = senseAlkonSignal("secret risk in task");
    expect(interpretAlkonMeaning(securitySignal)).toMatchObject({
      category: "safety_risk",
      affectedWorld: "private_alkon",
      safetyImpact: "critical",
    });

    const chartSignal = senseAlkonSignal("chart annoying");
    expect(interpretAlkonMeaning(chartSignal)).toMatchObject({
      category: "visual_pain",
      affectedSurface: "Trading Workspace",
      repeatedLessonReferences: expect.arrayContaining(["chart annoyance history"]),
    });
  });

  test("law blocks forbidden requests and gravity assigns priorities", () => {
    const liveSignal = senseAlkonSignal("enable live execution and real money now");
    const liveMeaning = interpretAlkonMeaning(liveSignal);
    const liveLaw = decideAlkonLaw(liveSignal, liveMeaning);
    const liveGravity = assignAlkonGravity(liveSignal, liveMeaning, liveLaw);

    expect(liveLaw.outcome).toBe("black_hole");
    expect(liveGravity.priority).toBe("black_hole");

    for (const text of [
      "activate billing now",
      "activate broker feed",
      "publish social posts",
      "show production secrets",
      "generate raster images",
    ]) {
      const signal = senseAlkonSignal(text);
      const meaning = interpretAlkonMeaning(signal);
      expect(decideAlkonLaw(signal, meaning).outcome).toBe("black_hole");
    }

    const shellSignal = senseAlkonSignal("duplicate topbars in workspace");
    const shellMeaning = interpretAlkonMeaning(shellSignal);
    const shellLaw = decideAlkonLaw(shellSignal, shellMeaning);
    expect(assignAlkonGravity(shellSignal, shellMeaning, shellLaw).priority).toBe(
      "P0_critical"
    );

    const logoSignal = senseAlkonSignal("logo rejected");
    const logoMeaning = interpretAlkonMeaning(logoSignal);
    const logoLaw = decideAlkonLaw(logoSignal, logoMeaning);
    expect(assignAlkonGravity(logoSignal, logoMeaning, logoLaw).priority).toBe(
      "P1_high"
    );

    const environmentSignal = senseAlkonSignal("environment polish");
    const environmentMeaning = interpretAlkonMeaning(environmentSignal);
    const environmentLaw = decideAlkonLaw(environmentSignal, environmentMeaning);
    expect(
      assignAlkonGravity(environmentSignal, environmentMeaning, environmentLaw)
        .priority
    ).toBe("P2_standard");
  });

  test("route and action prepare safe non-executing work", () => {
    const chartSignal = senseAlkonSignal("chart annoying");
    const chartMeaning = interpretAlkonMeaning(chartSignal);
    const chartLaw = decideAlkonLaw(chartSignal, chartMeaning);
    const chartGravity = assignAlkonGravity(chartSignal, chartMeaning, chartLaw);
    const chartRoute = routeAlkonSignal(chartSignal);
    const chartAction = prepareAlkonAction(
      chartSignal,
      chartLaw,
      chartGravity,
      chartRoute
    );

    expect(chartRoute).toMatchObject({
      ownerSystem: "Trading Workspace",
      responsibleWorker: "Chart Comfort Worker",
      requiredMonitors: expect.arrayContaining(["Chart Satellite"]),
    });
    expect(chartAction).toMatchObject({
      actionType: "create_visual_review",
      taskPassportNeeded: true,
      validationNeeded: true,
      webAppMayExecute: false,
      directCodexCallAllowed: false,
      externalCallAllowed: false,
      secretsAllowed: false,
    });

    const supportSignal = senseAlkonSignal("support missing");
    expect(routeAlkonSignal(supportSignal)).toMatchObject({
      ownerSystem: "Support",
      responsibleWorker: "Support Readiness Worker",
    });
  });

  test("judge, remember, and evolve enforce tribunal memory", () => {
    expect(judgeAlkonResult({ publicInternalTermsFound: true })).toMatchObject({
      outcome: "public_boundary_violation",
      founderReviewNeeded: true,
    });
    expect(judgeAlkonResult({ secretsFound: true })).toMatchObject({
      outcome: "security_violation",
    });
    expect(judgeAlkonResult({ fakeActivationFound: true })).toMatchObject({
      outcome: "product_truth_violation",
    });
    expect(judgeAlkonResult({ tscPassed: false })).toMatchObject({
      outcome: "needs_fix",
    });

    const lessons = getAlkonMemoryLessons();
    expect(lessons.map((lesson) => lesson.lessonId)).toEqual(
      expect.arrayContaining([
        "lesson_no_images_unless_explicit",
        "lesson_chart_is_king",
        "lesson_duplicate_topbar",
        "lesson_old_logos_rejected",
      ])
    );
    expect(lessons.every((lesson) => !lesson.containsSecrets)).toBe(true);

    const rules = evolveAlkonRules(lessons);
    expect(rules.map((rule) => rule.ruleId)).toEqual(
      expect.arrayContaining([
        "evolve_no_images_prompt_guard",
        "evolve_chart_screenshot_proof",
        "evolve_shell_boundary_regression",
        "evolve_public_leak_test_required",
      ])
    );
  });

  test("integrates with Founder Command and stays absent from public UI", async ({
    page,
    request,
  }) => {
    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.alkonSovereignConsciousness).toMatchObject({
      snapshotId: "alkon_sovereign_operating_consciousness",
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/alkon-consciousness/readiness",
        "/api/founder/alkon-consciousness/snapshot",
        "/api/founder/alkon-consciousness/sample-signal",
      ])
    );
    expect(
      founderCommand.snapshot.insideOutsidePlanet.privateWorld.alkonUniverse
    ).toMatchObject({
      consciousnessReady: true,
      consciousnessPublicExposure: false,
    });

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

  test("keeps implementation code-only, non-executing, and secret-free", () => {
    const sourceFiles = [
      "app/api/founder/alkon-consciousness/readiness/route.ts",
      "app/api/founder/alkon-consciousness/snapshot/route.ts",
      "app/api/founder/alkon-consciousness/sample-signal/route.ts",
      "lib/server/alkon-consciousness/types.ts",
      "lib/server/alkon-consciousness/sense.ts",
      "lib/server/alkon-consciousness/meaning.ts",
      "lib/server/alkon-consciousness/law.ts",
      "lib/server/alkon-consciousness/gravity.ts",
      "lib/server/alkon-consciousness/route.ts",
      "lib/server/alkon-consciousness/action.ts",
      "lib/server/alkon-consciousness/judge.ts",
      "lib/server/alkon-consciousness/remember.ts",
      "lib/server/alkon-consciousness/evolve.ts",
      "lib/server/alkon-consciousness/engine.ts",
      "lib/server/alkon-consciousness/state.ts",
      "modules/founder-command/components/AlkonConsciousnessPanel.tsx",
      "modules/founder-command/components/AlkonSignalSensePanel.tsx",
      "modules/founder-command/components/AlkonMeaningLawPanel.tsx",
      "modules/founder-command/components/AlkonGravityRoutePanel.tsx",
      "modules/founder-command/components/AlkonActionJudgmentPanel.tsx",
      "modules/founder-command/components/AlkonMemoryEvolutionPanel.tsx",
    ];

    const sources = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(sources).not.toMatch(SECRET_PATTERN);
    expect(sources).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(sources).not.toMatch(/child_process|execSync|spawnSync|shellCommand/i);
    expect(sources).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(sources).not.toMatch(/liveExecutionActive:\s*true/);
    expect(sources).not.toMatch(/billingActivationActive:\s*true/);

    const snapshot = getAlkonConsciousnessSnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.blockedActions.join(" ")).toMatch(/live execution|billing|broker\/feed/i);
    expect(snapshot.productTruthStatus).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noSecretsExposed: true,
    });
  });
});
