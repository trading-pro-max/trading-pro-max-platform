import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ALKON_FORBIDDEN_EVOLUTION_WITHOUT_GATES,
  ALKON_OPERATING_MEMORY_LESSONS,
  decideAlkonActivation,
  getAlkonActivationGates,
  getAlkonDailyOperatingLoop,
  getAlkonOneNextAction,
  getAlkonOperatingModeReadiness,
  getAlkonOperatingModeSnapshot,
  getInfiniteGovernedEvolutionStatus,
  getZeroTruthAudit,
  type AlkonOperatingModeSnapshot,
} from "../../lib/server/alkon-operating-mode";

const ARTIFACT_DIR = path.join("test-results", "alkon-operating-mode");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon Operating Mode|Zero Truth|Infinite Governed Evolution|Daily Operating Loop|One Next Action|Founder Command|internal activation|Alkon|الكون|Source Law|Self-Correction|Station Governance|Digital Runtime|Genesis|Treasury internals|Tax internals|Product Memory internals|Codex tasks|Task Passport|Result Tribunal|Risk Belt|Black Hole Zone|internal governance/i;

async function openWithTheme(page: Page, pathName: string) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key }) => window.localStorage.setItem(key, "dark"),
    { key: THEME_STORAGE_KEY }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function expectPublicSafe(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Operating Mode", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents activation doctrine and indexes Operating Mode", () => {
    const requiredDocs = [
      "docs/product/alkon-operating-mode.md",
      "docs/product/alkon-zero-truth-law.md",
      "docs/product/alkon-infinite-governed-evolution.md",
      "docs/product/alkon-daily-operating-loop.md",
      "docs/product/alkon-activation-law.md",
      "docs/product/alkon-operating-mode-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }
  });

  test("Zero Truth audit is deterministic and never resets the project", () => {
    const first = getZeroTruthAudit("2026-04-27T08:00:00.000Z");
    const second = getZeroTruthAudit("2026-04-27T08:00:00.000Z");

    expect(first).toEqual(second);
    expect(first.auditId).toBe("alkon_zero_truth_audit");
    expect(first.doctrine).toBe("reality_audit_not_deletion");
    expect(first.deletesProject).toBe(false);
    expect(first.resetsCodebase).toBe(false);
    expect(first.rebuildsFromBlank).toBe(false);
    expect(first.status).toBe("needs_review");
    expect(first.findings.map((finding) => finding.area)).toEqual(
      expect.arrayContaining([
        "public_pro_max_reality",
        "private_alkon_universe",
        "invisible_operating_layer",
        "prime_world",
        "trading_workspace",
        "assistant",
        "product_truth",
        "visual_acceptance",
        "settings_diagnostics",
        "tests_build_git",
        "public_leak_status",
        "local_day_one",
      ])
    );
    expect(first.localDayOneReadiness).toMatchObject({
      readyToStart: false,
      visualAcceptanceRequired: true,
      status: "waiting_ahmad_visual_acceptance",
    });
  });

  test("activation gates block P0 truth, public leak, validation, and dirty Git", () => {
    const truthGates = getAlkonActivationGates("2026-04-27T08:00:00.000Z", {
      productTruthSafe: false,
    });
    expect(decideAlkonActivation(truthGates)).toMatchObject({
      status: "blocked",
      activationDecision: "blocked",
    });

    const leakGates = getAlkonActivationGates("2026-04-27T08:00:00.000Z", {
      publicPrivateBoundarySafe: false,
    });
    expect(decideAlkonActivation(leakGates).status).toBe("blocked");

    const failedValidationGates = getAlkonActivationGates(
      "2026-04-27T08:00:00.000Z",
      { buildValidationPassed: false }
    );
    expect(decideAlkonActivation(failedValidationGates).status).toBe("blocked");

    const dirtyGitGates = getAlkonActivationGates(
      "2026-04-27T08:00:00.000Z",
      { gitClean: false }
    );
    expect(decideAlkonActivation(dirtyGitGates).status).toBe("blocked");
  });

  test("Operating Mode activates with notes while Local Day One waits for Ahmad visual acceptance", () => {
    const snapshot = getAlkonOperatingModeSnapshot("2026-04-27T08:00:00.000Z");

    expect(snapshot).toMatchObject({
      mode: "alkon_operating_mode",
      visibility: "private_founder_only",
      publicExposure: false,
      status: "active_with_notes",
      activationDecision: "activate_with_notes",
      founderOnly: true,
      readOnly: true,
      noExecution: true,
      localDayOneGate: {
        readyToStart: false,
        blockedUntilAhmadVisualAcceptance: true,
        status: "waiting_ahmad_visual_acceptance",
      },
      publicExposureStatus: {
        publicUiVisible: false,
        publicApiRoutesExposed: false,
        publicNavigationVisible: false,
        diagnosticsLeak: false,
        publicOperatingModeLanguageVisible: false,
      },
    });
    expect(snapshot.productTruthStatus.liveExecutionBlocked).toBe(true);
    expect(snapshot.productTruthStatus.noPublicAlkonOperatingModeExposure).toBe(true);
  });

  test("One Next Action chooses visual review, focused correction, closure, and Local Day One by gate state", () => {
    expect(
      getAlkonOneNextAction("2026-04-27T08:00:00.000Z").actionId
    ).toBe("ask_ahmad_visual_review");

    expect(
      getAlkonOneNextAction("2026-04-27T08:00:00.000Z", {
        visualAcceptance: "rejected",
      }).actionId
    ).toBe("create_focused_visual_correction");

    expect(
      getAlkonOneNextAction("2026-04-27T08:00:00.000Z", {
        visualAcceptance: "accepted",
      }).actionId
    ).toBe("final_universal_closure");

    expect(
      getAlkonOneNextAction("2026-04-27T08:00:00.000Z", {
        visualAcceptance: "accepted",
        finalUniversalClosurePassed: true,
      }).actionId
    ).toBe("start_local_day_one");
  });

  test("Daily loop and Infinite Governed Evolution are private, gated, and no-execution", () => {
    const dailyLoop = getAlkonDailyOperatingLoop("2026-04-27T08:00:00.000Z");
    expect(dailyLoop.dailyLoopStatus).toBe("active_with_notes");
    expect(dailyLoop.loop).toContain("Read Wake Report.");
    expect(dailyLoop.whatNotToDo).toEqual(
      expect.arrayContaining([
        "Do not activate billing.",
        "Do not activate broker/feed.",
        "Do not enable live execution.",
        "Do not route real money.",
        "Do not expose Alkon publicly.",
      ])
    );

    const evolution = getInfiniteGovernedEvolutionStatus(
      "2026-04-27T08:00:00.000Z"
    );
    expect(evolution.productTruthPreserved).toBe(true);
    expect(evolution.publicExposure).toBe(false);
    expect(ALKON_FORBIDDEN_EVOLUTION_WITHOUT_GATES).toEqual(
      expect.arrayContaining([
        "public launch",
        "billing activation",
        "broker/feed activation",
        "live execution",
        "real money",
        "public Alkon exposure",
      ])
    );
  });

  test("Founder and Alkon read-only APIs receive Operating Mode snapshot", async ({
    request,
  }) => {
    for (const route of [
      "/api/founder/alkon-operating-mode/readiness",
      "/api/founder/alkon-operating-mode/snapshot",
      "/api/founder/alkon-operating-mode/zero-truth",
      "/api/founder/alkon-operating-mode/one-next-action",
      "/api/founder/alkon-operating-mode/daily-loop",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text).toMatch(/founderOnly|readOnly|noExecution/);
      expect(text).not.toMatch(SECRET_PATTERN);
    }

    expect((await request.get("/api/alkon-operating-mode")).status()).toBe(404);
    expect((await request.get("/api/alkon/operating-mode")).status()).toBe(404);

    const founder = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founder.snapshot.alkonOperatingMode).toMatchObject({
      visibility: "private_founder_only",
      publicExposure: false,
      status: "active_with_notes",
      activationDecision: "activate_with_notes",
    });
    expect(founder.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/alkon-operating-mode/readiness",
        "/api/founder/alkon-operating-mode/snapshot",
        "/api/founder/alkon-operating-mode/zero-truth",
        "/api/founder/alkon-operating-mode/one-next-action",
        "/api/founder/alkon-operating-mode/daily-loop",
      ])
    );

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.operatingMode).toMatchObject({
      mode: "alkon_operating_mode",
      publicExposure: false,
      status: "active_with_notes",
    });
    expect(alkon.snapshot.apiExposure).toMatchObject({
      founderOperatingModeReadinessRoute:
        "/api/founder/alkon-operating-mode/readiness",
      founderOperatingModeSnapshotRoute:
        "/api/founder/alkon-operating-mode/snapshot",
    });
  });

  test("public UI does not expose Alkon Operating Mode, Zero Truth, or internal terms", async ({
    page,
  }) => {
    await openWithTheme(page, "/");
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
    });

    await openWithTheme(page, "/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });
  });

  test("implementation remains code-only, secret-free, non-executing, and no-raster", () => {
    expect(ALKON_OPERATING_MEMORY_LESSONS.map((lesson) => lesson.lesson)).toEqual(
      expect.arrayContaining([
        "Alkon starts from Zero Truth, not blank code.",
        "No deletion or rebuild-from-scratch without explicit Ahmad approval.",
        "Chart is king.",
        "Assistant is the user comfort and language layer.",
        "Product Truth is law.",
        "No public Alkon.",
        "No Local Day One without Ahmad visual acceptance.",
      ])
    );

    const readiness = getAlkonOperatingModeReadiness(
      "2026-04-27T08:00:00.000Z"
    );
    expect(readiness).toMatchObject({
      founderOnly: true,
      readOnly: true,
      noExecution: true,
      noShellExecution: true,
      noPayments: true,
      noExternalCalls: true,
      noSecrets: true,
      noPublicApi: true,
    });

    const sourceFiles = [
      "lib/server/alkon-operating-mode/types.ts",
      "lib/server/alkon-operating-mode/zero-truth-audit.ts",
      "lib/server/alkon-operating-mode/activation-gates.ts",
      "lib/server/alkon-operating-mode/daily-loop.ts",
      "lib/server/alkon-operating-mode/one-next-action.ts",
      "lib/server/alkon-operating-mode/infinite-governed-evolution.ts",
      "lib/server/alkon-operating-mode/memory.ts",
      "lib/server/alkon-operating-mode/index.ts",
      "app/api/founder/alkon-operating-mode/readiness/route.ts",
      "app/api/founder/alkon-operating-mode/snapshot/route.ts",
      "app/api/founder/alkon-operating-mode/zero-truth/route.ts",
      "app/api/founder/alkon-operating-mode/one-next-action/route.ts",
      "app/api/founder/alkon-operating-mode/daily-loop/route.ts",
      "modules/founder-command/components/AlkonOperatingModePanel.tsx",
      "modules/founder-command/components/AlkonZeroTruthPanel.tsx",
      "modules/founder-command/components/AlkonDailyLoopPanel.tsx",
      "modules/founder-command/components/AlkonOneNextActionPanel.tsx",
      "modules/founder-command/components/AlkonActivationGatesPanel.tsx",
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

    const snapshot: AlkonOperatingModeSnapshot =
      getAlkonOperatingModeSnapshot("2026-04-27T08:00:00.000Z");
    expect(snapshot.productTruthStatus.noShellExecutionFromWebApp).toBe(true);
    expect(snapshot.productTruthStatus.noImagesOrRasterAssets).toBe(true);
  });
});
