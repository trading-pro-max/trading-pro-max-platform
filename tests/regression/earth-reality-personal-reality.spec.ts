import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";
import {
  getEarthRealitySnapshot,
  getPublicWorldMatrix,
} from "../../lib/server/earth-reality";
import {
  buildPersonalRealityPreview,
  getPersonalRealityReadinessSnapshot,
  interpretPersonalRealityIntent,
} from "../../lib/server/personal-reality";

const ARTIFACT_DIR = path.join("test-results", "earth-reality-personal-reality");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Sovereign Consciousness|Cosmic Physics|Solar Command|Moon Command|\bministries\b|\bcouncils\b|\bgovernance\b|Codex tasks|Task Passport|Result Tribunal|secrets authority|treasury controls|Product Memory internals/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" = "dark",
  environmentMode = "adaptive"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ themeKey, envKey, themeMode: theme, environmentMode: environment }) => {
      window.localStorage.setItem(themeKey, theme);
      window.localStorage.setItem(envKey, environment);
    },
    {
      themeKey: THEME_STORAGE_KEY,
      envKey: ENVIRONMENT_MODE_STORAGE_KEY,
      themeMode,
      environmentMode,
    }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await expect(target).toBeVisible();
  await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
}

async function expectPublicSafe(page: Page) {
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Earth Reality Constitution and Personal Operating Reality", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("builds deterministic Earth Reality layers and public matrix", () => {
    const snapshot = getEarthRealitySnapshot("2026-04-26T10:00:00.000Z");
    const matrix = getPublicWorldMatrix();

    expect(snapshot.mode).toBe("earth_reality_constitution");
    expect(snapshot.status).toBe("ready_with_notes");
    expect(snapshot.score).toBeGreaterThan(8);
    expect(snapshot.score).toBeLessThan(10);
    expect(snapshot.layers.map((layer) => layer.layer)).toEqual(
      expect.arrayContaining([
        "human",
        "time",
        "place_privacy",
        "market",
        "law",
        "trust",
        "learning",
        "support",
        "environment",
        "product_truth",
      ])
    );
    expect(matrix.map((page) => page.surface)).toEqual(
      expect.arrayContaining([
        "home",
        "trading_workspace",
        "markets",
        "plans",
        "apps_platforms",
        "academy",
        "community",
        "support",
        "settings",
        "diagnostics",
      ])
    );
    for (const page of matrix) {
      expect(page.whereAmI).toBeTruthy();
      expect(page.whatCanIDo).toBeTruthy();
      expect(page.activeNow).toBeTruthy();
      expect(page.plannedFuture).toBeTruthy();
      expect(page.blockedInactive).toBeTruthy();
      expect(page.nextStep).toBeTruthy();
    }
    expect(snapshot.productTruthStatus).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedBillingInactive: true,
      noFakeClaims: true,
      noImagesOrRasterAssets: true,
    });
  });

  test("interprets Personal Reality intents and preserves Product Truth", () => {
    expect(interpretPersonalRealityIntent("اجعل المنصة أهدأ")).toMatchObject({
      intent: "calm_request",
      requestedSettings: expect.arrayContaining(["calm_workspace", "low_motion"]),
    });
    expect(interpretPersonalRealityIntent("أريد شارت أكبر")).toMatchObject({
      intent: "chart_size_request",
      requestedSettings: ["chart_comfort"],
    });
    expect(interpretPersonalRealityIntent("قلل الحركة")).toMatchObject({
      intent: "reduce_motion_request",
      requestedSettings: ["low_motion"],
    });
    expect(interpretPersonalRealityIntent("لماذا هذا مقفل؟")).toMatchObject({
      intent: "explain_locked_feature",
    });

    const freePreview = buildPersonalRealityPreview({
      userIntent: "make it calmer",
      currentPlan: "demo_free",
    });
    expect(freePreview.applyPlan).toMatchObject({
      canApply: true,
      previewOnly: true,
      noBillingActivation: true,
      noLiveExecution: true,
      noPrivateExposure: true,
    });
    expect(freePreview.allowedSettings.map((setting) => setting.name)).toEqual(
      expect.arrayContaining(["Calm Workspace", "Low Motion"])
    );

    const vipPreview = buildPersonalRealityPreview({
      userIntent: "I want VIP theme",
      currentPlan: "demo_free",
    });
    expect(vipPreview.applyPlan.canApply).toBe(false);
    expect(vipPreview.diagnosticsSummary.status).toBe("planned");
    expect(vipPreview.upgradeExplanation).toMatch(/planned|entitlement/i);
    expect(vipPreview.productTruth).toMatchObject({
      paidPlanActivated: false,
      billingActivated: false,
      liveExecutionActivated: false,
      brokerFeedActivated: false,
      realMoneyActivated: false,
      privateSystemsExposed: false,
      weatherOrSessionAdvice: false,
    });

    const blockedPreview = buildPersonalRealityPreview({
      userIntent: "activate VIP and live trading",
      currentPlan: "demo_free",
    });
    expect(blockedPreview.diagnosticsSummary.status).toBe("blocked");
    expect(blockedPreview.publicCopy).toMatch(/blocked/i);

    const readiness = getPersonalRealityReadinessSnapshot("2026-04-26T10:00:00.000Z");
    expect(readiness.freeControls).toEqual(
      expect.arrayContaining([
        "Clean Earth",
        "Calm Workspace",
        "Chart Comfort",
        "Static Mode",
        "Low Motion",
        "High Contrast",
        "Learning Basics",
      ])
    );
    expect(readiness.publicProfiles.map((profile) => profile.profileId)).not.toContain("alkon_private");
  });

  test("exposes public-safe Earth and Personal Reality APIs", async ({ request }) => {
    for (const route of [
      "/api/earth-reality/status",
      "/api/earth-reality/public-matrix",
      "/api/earth-reality/product-truth",
      "/api/earth-reality/privacy",
      "/api/personal-reality/status",
      "/api/personal-reality/profiles",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text, route).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
      expect(text, route).not.toMatch(/liveExecutionActivated":true|billingActivated":true|paidPlanActivated":true/);
    }

    const preview = await request.get(
      "/api/personal-reality/preview?intent=bigger%20chart&plan=demo_free"
    );
    expect(preview.status()).toBe(200);
    const previewPayload = await preview.json();
    expect(previewPayload.preview.applyPlan).toMatchObject({
      previewOnly: true,
      noBillingActivation: true,
      noLiveExecution: true,
      noPrivateExposure: true,
    });

    const vip = await request.get(
      "/api/personal-reality/preview?intent=I%20want%20VIP%20theme&plan=demo_free"
    );
    expect((await vip.json()).preview.applyPlan.canApply).toBe(false);

    const founderEarth = await request.get("/api/founder/earth-reality/readiness");
    expect(founderEarth.status()).toBe(200);
    expect((await founderEarth.json()).noExecution).toBe(true);

    const founderPersonal = await request.get("/api/founder/personal-reality/readiness");
    expect(founderPersonal.status()).toBe(200);
    expect((await founderPersonal.json()).productTruth.liveExecutionActivated).toBe(false);
  });

  test("captures public Earth world and settings/diagnostics proof", async ({ page }) => {
    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
    });
    await screenshotLocator(page, ".tpm-product-hero", "public-world-matrix-home.png");
    await screenshotLocator(page, '[data-public-section="markets"]', "markets-earth-truth.png");
    await screenshotLocator(page, '[data-public-section="apps-platforms"]', "apps-platforms-earth-truth.png");
    await screenshotLocator(page, '[data-public-section="support"]', "support-earth-truth.png");
    await screenshotLocator(page, '[data-public-section="academy"]', "academy-earth-learning.png");
    await screenshotLocator(page, '[data-plan-realm="free_earth"]', "free-clean-earth-reality.png");
    await screenshotLocator(page, '[data-plan-realm="pro_orbit"]', "pro-orbit-planned-reality.png");
    await screenshotLocator(page, '[data-plan-realm="vip_lunar"]', "vip-lunar-planned-reality.png");
    await expect(page.locator("body")).toContainText(/Personal Reality|Earth-native|Paper-safe/);

    await openWithTheme(page, "/", "light");
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-entry-light.png"),
    });

    await openWithTheme(page, "/en/settings", "dark");
    await expect(page.locator("body")).toContainText(/Earth Reality|Personal Reality|Clean Earth|Chart Comfort/);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-settings", "settings-earth-personal-reality.png");

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator("body")).toContainText(/Earth Reality readiness|Personal Reality readiness|Adaptive Atmosphere readiness/);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-earth-personal-reality.png");

    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-no-alkon-leak.png"),
    });
  });

  test("captures workspace, Assistant, static, and high-contrast proof", async ({
    page,
  }) => {
    await openWithTheme(page, "/en", "dark");
    await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpmv2-primary", "workspace-earth-truth.png");
    await screenshotLocator(page, ".tpmv2-primary", "workspace-chart-comfort.png");

    await page.getByRole("button", { name: /Pro Max Assistant/i }).click();
    await expect(page.locator("#tpm-companion-panel")).toBeVisible();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-calm-request.png");
    await page.getByRole("button", { name: "Bigger chart" }).click();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-chart-comfort-request.png");
    await page.getByRole("button", { name: "Why blocked?" }).click();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-vip-locked-explanation.png");

    await openWithTheme(page, "/en", "dark", "static");
    await expect(page.locator("html")).toHaveAttribute("data-tpm-environment-mode", "static");
    await screenshotLocator(page, ".tpmv2-primary", "workspace-static-mode.png");

    await openWithTheme(page, "/", "dark", "high_contrast");
    await expect(page.locator("html")).toHaveAttribute("data-tpm-environment-mode", "high_contrast");
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-product-hero", "high-contrast-reality.png");
  });

  test("keeps Earth/Personal Reality code-only and non-executing", () => {
    const sourceFiles = [
      "lib/server/earth-reality/engine.ts",
      "lib/server/earth-reality/public-world-matrix.ts",
      "lib/server/personal-reality/engine.ts",
      "lib/server/personal-reality/registry.ts",
      "lib/server/personal-reality/product-truth-guard.ts",
      "modules/companion/components/TPMCompanionPanel.tsx",
      "modules/shell/components/PlatformUtilitySurfaces.tsx",
      "app/theme-localization.css",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
      expect(source, sourceFile).not.toMatch(/child_process|execSync|spawnSync/i);
      expect(source, sourceFile).not.toMatch(/liveExecutionActivated:\s*true|billingActivated:\s*true|realMoneyActivated:\s*true/);
    }
  });
});
