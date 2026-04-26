import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import type {
  FinalConvergenceLayer,
  FinalConvergenceSnapshot,
} from "../../lib/server/final-convergence/types";

const ARTIFACT_DIR = path.join("test-results", "final-convergence");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key|secret token value|password value/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|ط§ظ„ظƒظˆظ†|Founder Command|Final Convergence|Infinite Layer Growth|Sovereign Consciousness|Cosmic Physics|Codex Government|Task Passport|Result Tribunal|Product Memory|Automation Governor|Secrets Authority|Security Sovereignty/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" = "dark"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key, mode }) => window.localStorage.setItem(key, mode),
    { key: THEME_STORAGE_KEY, mode: themeMode }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function expectPublicSafe(page: Page) {
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("TPM Final Convergence and Infinite Governed Layer Growth", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents final convergence doctrine and indexes the system", () => {
    const requiredDocs = [
      "docs/product/tpm-final-convergence.md",
      "docs/product/final-convergence-operating-law.md",
      "docs/product/infinite-governed-layer-growth.md",
      "docs/product/governed-automation-boundaries.md",
      "docs/product/local-day-one-convergence.md",
      "docs/product/final-convergence-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }
  });

  test("registers every required converged layer with owner, validation, and memory", async ({
    request,
  }) => {
    const response = await request.get("/api/founder/final-convergence/layers");
    expect(response.status()).toBe(200);
    const payload = (await response.json()) as {
      layers: FinalConvergenceLayer[];
    };
    const layers = payload.layers;
    const requiredLayerIds = [
      "public_earth_world",
      "living_market_core",
      "plan_realms",
      "tpm_assistant",
      "planetary_environment",
      "alkon_private_universe",
      "alkon_cosmic_operating_physics",
      "alkon_sovereign_operating_consciousness",
      "codex_sovereign_construction",
      "product_memory",
      "security_sovereignty",
      "secrets_authority",
      "guardian_legal_trust",
      "world_interface",
      "launch_readiness",
      "reality_audit",
      "safe_cleanup",
      "local_day_one",
    ];

    expect(layers.map((layer) => layer.layerId)).toEqual(
      expect.arrayContaining(requiredLayerIds)
    );

    for (const layer of layers) {
      expect(layer.purpose, layer.layerId).toBeTruthy();
      expect(layer.owner, layer.layerId).toBeTruthy();
      expect(layer.validationRequired.length, layer.layerId).toBeGreaterThan(0);
      expect(layer.memoryRule, layer.layerId).toBeTruthy();
      expect(layer.blockedEscalations.join(" ")).toMatch(
        /billing|live execution|real-money|broker|public launch/i
      );
    }

    expect(
      layers.filter((layer) => !layer.publicVisible).map((layer) => layer.layerId)
    ).toEqual(expect.arrayContaining(["alkon_private_universe", "product_memory"]));
  });

  test("blocks unsafe growth and forbids uncontrolled automation", async ({
    request,
  }) => {
    const response = await request.get("/api/founder/final-convergence/snapshot");
    expect(response.status()).toBe(200);
    const payload = (await response.json()) as {
      snapshot: FinalConvergenceSnapshot;
    };
    const snapshot = payload.snapshot;

    expect(
      snapshot.layerGrowth.proposals.find(
        (proposal) => proposal.proposalId === "layer_growth_launch_activation_block"
      )
    ).toMatchObject({
      decision: "blocked",
      riskLevel: "critical",
      founderReviewRequired: true,
    });
    expect(
      snapshot.layerGrowth.proposals.find(
        (proposal) => proposal.proposalId === "layer_growth_visual_truth_audit"
      )
    ).toMatchObject({
      decision: "founder_approval_required",
      riskLevel: "high",
    });
    expect(
      snapshot.layerGrowth.proposals.find(
        (proposal) => proposal.proposalId === "layer_growth_local_day_one"
      )
    ).toMatchObject({
      decision: "draft_codex_task",
    });

    expect(snapshot.automationGovernor.allowedLevels).toEqual(
      expect.arrayContaining([
        "level_1_detect",
        "level_3_1_docs_tests_submission_readiness_only",
      ])
    );
    expect(snapshot.automationGovernor.disabledLevels).toEqual(
      expect.arrayContaining([
        "level_4_future_low_risk_auto_fix_disabled",
        "level_5_forbidden_uncontrolled_autopilot",
      ])
    );
  });

  test("builds a Founder-only convergence snapshot without fake 10/10", async ({
    request,
  }) => {
    const response = await request.get("/api/founder/final-convergence/snapshot");
    expect(response.status()).toBe(200);
    const payload = (await response.json()) as {
      snapshot: FinalConvergenceSnapshot;
    };
    const snapshot = payload.snapshot;

    expect(snapshot).toMatchObject({
      mode: "tpm_final_convergence_governed_layer_growth",
      founderOnly: true,
      publicExposure: false,
      layerRegistryStatus: "ready",
      publicPrivateBoundaryStatus: "preserved",
      productTruthStatus: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedBillingLaunchInactive: true,
        productionSecretsUntouched: true,
        noUncontrolledAutomation: true,
        noShellExecutionFromWebApp: true,
        noDirectCodexExecutionFromWebApp: true,
        noSecretsExposed: true,
        noPublicAlkonOrConvergenceLeak: true,
        noImagesOrRasterAssets: true,
      },
    });
    expect(snapshot.convergenceScore.score).toBeLessThan(10);
    expect(snapshot.layerGrowth.proposals.length).toBeGreaterThanOrEqual(5);
    expect(
      snapshot.layerGrowth.proposals.find(
        (proposal) => proposal.proposalId === "layer_growth_launch_activation_block"
      )
    ).toMatchObject({
      decision: "blocked",
      riskLevel: "critical",
      taskDraft: {
        noExecution: true,
        noSecrets: true,
      },
    });
    expect(snapshot.automationGovernor.truth.level4DisabledNow).toBe(true);
    expect(snapshot.automationGovernor.truth.level5Forbidden).toBe(true);
    expect(JSON.stringify(snapshot)).not.toMatch(SECRET_PATTERN);
  });

  test("exposes read-only founder APIs and no public convergence route", async ({
    request,
  }) => {
    for (const route of [
      "/api/founder/final-convergence/readiness",
      "/api/founder/final-convergence/snapshot",
      "/api/founder/final-convergence/layers",
      "/api/founder/final-convergence/growth-proposals",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(await response.json()).not.toMatchObject({
        executionActive: true,
      });
    }

    expect((await request.get("/api/final-convergence/snapshot")).status()).toBe(404);

    const response = await request.get("/api/founder/final-convergence/snapshot");
    const payload = (await response.json()) as {
      snapshot: FinalConvergenceSnapshot;
    };
    expect(payload.snapshot.publicExposure).toBe(false);
    expect(payload.snapshot.automationGovernor.truth.noShellExecutionFromWebApp).toBe(true);

    const command = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(command.snapshot.finalConvergence).toMatchObject({
      founderOnly: true,
      publicExposure: false,
    });
    expect(command.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/final-convergence/readiness",
        "/api/founder/final-convergence/snapshot",
        "/api/founder/final-convergence/layers",
        "/api/founder/final-convergence/growth-proposals",
      ])
    );
  });

  test("keeps public UI clean while capturing final-convergence proof", async ({
    page,
  }) => {
    await openWithTheme(page, "/", "dark");
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
    });

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });

    await openWithTheme(page, "/en", "dark");
    await expect(page.locator(".tpmv2-desktop-master").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workstation-dark.png"),
    });
  });

  test("keeps implementation code-only, secret-free, and non-executing", () => {
    const sourceFiles = [
      "app/api/founder/final-convergence/readiness/route.ts",
      "app/api/founder/final-convergence/snapshot/route.ts",
      "app/api/founder/final-convergence/layers/route.ts",
      "app/api/founder/final-convergence/growth-proposals/route.ts",
      "lib/server/final-convergence/types.ts",
      "lib/server/final-convergence/layer-registry.ts",
      "lib/server/final-convergence/layer-growth-engine.ts",
      "lib/server/final-convergence/convergence-score.ts",
      "lib/server/final-convergence/automation-level-governor.ts",
      "lib/server/final-convergence/state.ts",
      "modules/founder-command/components/AlkonFinalConvergencePanel.tsx",
      "modules/founder-command/components/AlkonLayerGrowthPanel.tsx",
      "modules/founder-command/components/AlkonAutomationGovernorPanel.tsx",
      "modules/founder-command/components/AlkonConvergenceScorePanel.tsx",
      "modules/founder-command/components/AlkonNextSafeLayersPanel.tsx",
    ];

    const sources = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(sources).not.toMatch(SECRET_PATTERN);
    expect(sources).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    expect(sources).not.toMatch(/child_process|execSync|spawnSync/i);
    expect(sources).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(sources).not.toMatch(/liveExecutionActive:\s*true/);
    expect(sources).not.toMatch(/billingActivationActive:\s*true/);
  });
});
