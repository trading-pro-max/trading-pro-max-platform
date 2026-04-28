import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  getLivingEarthAssetPolicy,
  getLivingEarthRenderDecision,
  getLivingEarthRuntimeState,
} from "../../lib/brand/living-earth";

const ARTIFACT_DIR = path.join("test-results", "pro-max-living-earth-runtime");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Alkon -0|Founder Command|Kernel|Zero Truth|Reality Trial|Jar System|Permission-to-Exist|internal governance/i;
const UNSAFE_SWISS_CLAIMS =
  /\bFINMA\b|Swiss\s+(regulated|licensed|company|bank)|regulated\s+by\s+Swiss|Swiss\s+license/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" | "system"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key, mode }) => window.localStorage.setItem(key, mode),
    { key: THEME_STORAGE_KEY, mode: themeMode }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  await expect(page.locator(selector).first()).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const target = page.locator(selector).first();

    try {
      await target.scrollIntoViewIfNeeded({ timeout: 5000 });
      await expect(target).toBeVisible();
      await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(250);
    }
  }
}

async function expectPublicSafe(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  expect(bodyText).not.toMatch(UNSAFE_SWISS_CLAIMS);
  await expect(page.locator("img")).toHaveCount(0);
  await expect(page.locator("[src^='http'], [src^='https']")).toHaveCount(0);
}

function readSource(filePath: string) {
  return fs.readFileSync(path.join(process.cwd(), filePath), "utf8");
}

test.describe("Pro Max Living Earth Runtime", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("returns deterministic governed runtime state", () => {
    const state = getLivingEarthRuntimeState("2026-04-28T00:00:00.000Z");
    const assetPolicy = getLivingEarthAssetPolicy();
    const chartDecision = getLivingEarthRenderDecision({
      surface: "trading_chart_atmosphere",
    });

    expect(state.checkedAt).toBe("2026-04-28T00:00:00.000Z");
    expect(state.status).toBe("active_with_notes");
    expect(state.acceptanceStatus).toBe("needs_ahmad_review");
    expect(state.truth).toMatchObject({
      codeDriven: true,
      noExternalImages: true,
      noGeneratedImages: true,
      noUnknownLicenseAssets: true,
      noSwissRegulatoryClaim: true,
      chartProtection: "chart_must_remain_king",
      proceduralFallbackIsPhotoreal: false,
    });
    expect(state.renderDecisions.map((decision) => decision.surface)).toEqual([
      "home_hero",
      "public_header_logo",
      "compact_logo",
      "trading_workspace",
      "trading_chart_atmosphere",
      "settings",
      "diagnostics",
      "founder_private_preview",
      "future_world_ready",
    ]);
    expect(state.assetStatus).toBe(assetPolicy.assetStatus);
    expect(chartDecision).toMatchObject({
      chartSafe: true,
      visualIntensity: "subtle",
      showClouds: false,
      showAtmosphere: false,
    });
  });

  test("renders Home as a living public Earth identity in dark and light", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 920 });
    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);

    const background = page.locator(".tpm-living-earth-background").first();
    const heroLogo = page.locator(".tpm-product-hero-logo").first();
    await expect(background).toHaveAttribute("data-living-earth-runtime", "active");
    await expect(background).toHaveAttribute("data-living-earth-surface", "home_hero");
    await expect(heroLogo).toHaveAttribute("data-living-earth-runtime", "active");
    await expect(heroLogo).toHaveAttribute("data-living-earth-logo-surface", "home_hero");
    await expect(heroLogo.locator(".tpm-hybrid-earth").first()).toHaveAttribute(
      "data-living-earth-runtime",
      "active"
    );
    await expect(heroLogo.locator("image, img")).toHaveCount(0);

    await screenshotLocator(page, ".tpm-product-hero", "home-living-earth-dark.png");
    await screenshotLocator(page, ".tpm-product-hero-logo", "logo-living-earth-hero.png");
    await screenshotLocator(page, ".tpm-foundation-nav-brand", "logo-living-earth-compact.png");
    await screenshotLocator(page, ".tpm-product-hero", "no-broken-earth-image.png");
    await screenshotLocator(page, ".tpm-product-hero", "no-public-alkon-leak.png");

    await openWithTheme(page, "/", "light");
    await expectPublicSafe(page);
    await expect(page.locator(".tpm-living-earth-background").first()).toHaveAttribute(
      "data-living-earth-surface",
      "home_hero"
    );
    await screenshotLocator(page, ".tpm-product-hero", "home-living-earth-light.png");
  });

  test("keeps Trading Earth subtle and never over the chart", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 960 });
    await openWithTheme(page, "/trading", "dark");
    await expectPublicSafe(page);

    const workspaceEarth = page.locator(
      ".tpm-living-earth-background[data-earth-surface='workstation']"
    );
    const chartSurface = page.locator(".tpm-living-chart-surface").first();
    const chartCanvas = page.locator(".tpm-living-chart-canvas").first();
    await expect(workspaceEarth).toHaveAttribute("data-living-earth-surface", "trading_workspace");
    await expect(workspaceEarth).toHaveAttribute("data-living-earth-chart-safe", "true");
    await expect(chartSurface).toHaveAttribute(
      "data-living-earth-surface",
      "trading_chart_atmosphere"
    );
    await expect(chartSurface).toHaveAttribute("data-earth-overlay", "none");
    await expect(chartCanvas).toHaveAttribute("data-earth-overlay", "none");

    const visualState = await page.locator(".tpm-workspace-shell").first().evaluate((element) => {
      const chart = element.querySelector(".tpmv2-chart-surface-swiss");
      const earth = element.querySelector(
        ".tpm-living-earth-background[data-earth-surface='workstation']"
      );
      const chartBox = chart?.getBoundingClientRect();
      const earthStyle = earth ? window.getComputedStyle(earth) : null;

      return {
        chartHeight: chartBox?.height ?? 0,
        chartWidth: chartBox?.width ?? 0,
        earthOpacity: Number(earthStyle?.getPropertyValue("--tpm-living-earth-opacity") || 0),
      };
    });
    expect(visualState.chartWidth).toBeGreaterThan(760);
    expect(visualState.chartHeight).toBeGreaterThan(620);
    expect(visualState.earthOpacity).toBeLessThanOrEqual(0.16);

    await screenshotLocator(page, ".tpm-workspace-shell", "trading-subtle-living-earth.png");
    await screenshotLocator(page, ".tpmv2-chart-surface-swiss", "trading-chart-not-covered-by-earth.png");
  });

  test("shows public-safe Earth controls in Settings and Diagnostics", async ({ page }) => {
    await openWithTheme(page, "/settings", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("[data-utility-section='earth-reality']")).toContainText(
      "Living Earth Runtime"
    );
    await expect(page.locator("[data-utility-section='earth-reality']")).toContainText(
      "Chart remains king"
    );
    await screenshotLocator(
      page,
      "[data-utility-section='earth-reality']",
      "settings-earth-controls-safe.png"
    );

    await openWithTheme(page, "/diagnostics", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("[data-utility-section='earth-reality']")).toContainText(
      "Living Earth Runtime"
    );
    await expect(page.locator("[data-utility-section='earth-reality']")).toContainText(
      "Texture mode"
    );
    await screenshotLocator(
      page,
      "[data-utility-section='earth-reality']",
      "diagnostics-earth-public-safe.png"
    );
  });

  test("keeps private Alkon Earth readiness private and Local Day One gated", async ({
    page,
  }) => {
    await page.goto("/founder/alkon", { waitUntil: "domcontentloaded" });
    const privatePanel = page.locator(".alkon-living-earth-runtime-panel").first();
    await expect(privatePanel).toBeVisible();
    await expect(privatePanel).toContainText("Living Earth Runtime");
    await expect(privatePanel).toContainText("Ahmad review needed");
    await screenshotLocator(
      page,
      ".alkon-living-earth-runtime-panel",
      "founder-earth-readiness-private.png"
    );

    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".tpm-founder-access-card").first()).toContainText("Not started");
    await screenshotLocator(page, ".tpm-founder-access-card", "local-day-one-not-started.png");
  });

  test("keeps Living Earth code-only and product-truth safe", () => {
    const sourceBundle = [
      "lib/brand/living-earth/types.ts",
      "lib/brand/living-earth/runtime.ts",
      "lib/brand/living-earth/render-decision.ts",
      "lib/brand/living-earth/asset-policy.ts",
      "lib/brand/living-earth/evolution.ts",
      "lib/brand/living-earth/state.ts",
      "modules/brand/components/ProMaxLivingEarth.tsx",
      "modules/brand/components/ProMaxHybridEarth.tsx",
      "modules/brand/components/ProMaxProceduralEarth.tsx",
      "modules/brand/components/ProMaxEarthMark.tsx",
      "modules/brand/components/ProductLogo.tsx",
      "modules/brand/components/LivingEarthBackground.tsx",
      "modules/shell/components/TradingChartSurface.tsx",
      "modules/shell/components/TradingChartCanvas.tsx",
    ]
      .map(readSource)
      .join("\n");

    expect(sourceBundle).not.toMatch(/<img|fetch\(["']https?:\/\/|src=["']https?:\/\//i);
    expect(sourceBundle).not.toMatch(/\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(sourceBundle).not.toMatch(/FINMA-approved|Swiss regulated|Swiss licensed|Swiss company/i);
    expect(sourceBundle).not.toMatch(/liveExecutionActivated:\s*true|billingActivated:\s*true|realMoneyActivated:\s*true/);
  });
});
