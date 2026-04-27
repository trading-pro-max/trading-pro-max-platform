import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  getEarthTextureReadinessFromManifest,
  isRemoteEarthTextureReferenceBlocked,
} from "../../lib/brand/earth-texture-registry";
import { getPublicHybridEarthPolicy } from "../../lib/brand/hybrid-earth-policy";

const ARTIFACT_DIR = path.join("test-results", "pro-max-hybrid-earth-reality");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Founder Command|asset governance|license review|approvedBy|checksum|texture approval|Product Memory internals|Treasury internals|Risk Belt|Black Hole Zone|secrets authority|treasury controls/i;
const IMAGE_ASSET_PATTERN = /\.(png|jpe?g|webp|gif|avif)$/i;

async function openWithTheme(page: Page, route: string, theme = "dark") {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key, mode }) => window.localStorage.setItem(key, mode),
    { key: THEME_STORAGE_KEY, mode: theme }
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
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
  await expect(page.locator("[src^='http'], [src^='https']")).toHaveCount(0);
}

function readSource(filePath: string) {
  return fs.readFileSync(path.join(process.cwd(), filePath), "utf8");
}

test.describe("Pro Max Hybrid Living Earth Reality", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("keeps no texture active by default and requires complete approval metadata", () => {
    const defaultReadiness = getEarthTextureReadinessFromManifest();
    const publicPolicy = getPublicHybridEarthPolicy();

    expect(defaultReadiness.renderMode).toBe("procedural_fallback");
    expect(defaultReadiness.activeTexture).toBeNull();
    expect(defaultReadiness.activeTextureCount).toBe(0);
    expect(defaultReadiness.publicSummary).toMatchObject({
      textureActive: false,
      brokenImageRisk: false,
      remoteImageUrlsAllowed: false,
      publicWarningRequired: false,
    });
    expect(publicPolicy).toMatchObject({
      fallbackActive: true,
      textureActive: false,
      noRemoteImageUrls: true,
      workspaceChartFirst: true,
    });

    const invalidReadiness = getEarthTextureReadinessFromManifest([
      {
        id: "earth_day_candidate",
        file: "earth-day.approved.png",
        type: "day",
        status: "approved",
        source: "",
        license: "",
        author: "",
        usageNotes: "",
        approvedBy: "",
        dateAdded: "",
        checksum: "",
        enabled: true,
      },
      {
        id: "remote_earth",
        file: "https://example.com/earth.png",
        type: "day",
        status: "approved",
        source: "Example",
        license: "Unknown",
        author: "Unknown",
        usageNotes: "Do not use.",
        approvedBy: "Nobody",
        dateAdded: "2026-04-27",
        checksum: "abc",
        enabled: true,
      },
    ]);

    expect(invalidReadiness.renderMode).toBe("procedural_fallback");
    expect(invalidReadiness.activeTexture).toBeNull();
    expect(invalidReadiness.invalidMetadataCount).toBe(2);
    expect(isRemoteEarthTextureReferenceBlocked("https://example.com/earth.png")).toBe(true);

    const approvedDisabled = getEarthTextureReadinessFromManifest([
      {
        id: "earth_day_legal",
        file: "earth-day.approved.png",
        type: "day",
        status: "approved",
        source: "Legal source record",
        license: "Approved license",
        author: "Approved author",
        usageNotes: "Use inside Pro Max Earth renderer only.",
        approvedBy: "Ahmad",
        dateAdded: "2026-04-27",
        checksum: "sha256-demo",
        enabled: false,
      },
    ]);

    expect(approvedDisabled.renderMode).toBe("procedural_fallback");
    expect(approvedDisabled.approvedDisabledCount).toBe(1);
    expect(approvedDisabled.activeTexture).toBeNull();
  });

  test("renders Home and logo with the hybrid procedural fallback", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);

    const background = page.locator(".tpm-living-earth-background").first();
    const logo = page.locator(".tpm-product-hero-logo .tpm-earth-mark-public").first();
    await expect(background).toHaveAttribute("data-earth-renderer", "hybrid");
    await expect(background).toHaveAttribute("data-earth-texture-active", "false");
    await expect(background).toHaveAttribute("data-earth-render-mode", "procedural_fallback");
    await expect(logo.locator(".tpm-hybrid-earth")).toHaveAttribute(
      "data-earth-active-texture",
      "false"
    );
    await expect(logo.locator(".tpm-procedural-earth")).toHaveCount(1);
    await expect(logo.locator(".tpm-hybrid-earth-approved-texture")).toHaveCount(0);

    await screenshotLocator(page, ".tpm-product-hero", "home-procedural-earth-fallback.png");
    await screenshotLocator(page, ".tpm-product-hero-logo", "logo-hybrid-earth-fallback.png");
    await screenshotLocator(page, ".tpm-product-hero", "no-approved-texture-active.png");
    await screenshotLocator(page, ".tpm-product-hero", "no-alkon-public-leak.png");
  });

  test("keeps Workspace chart-first with only subtle Earth identity", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/en", "dark");
    await expectPublicSafe(page);

    const chart = page.locator(".tpmv2-chart-surface").first();
    const workspaceEarth = page.locator(
      ".tpm-living-earth-background[data-earth-surface='workstation']"
    );
    await expect(chart).toBeVisible();
    await expect(workspaceEarth).toHaveCount(1);
    await expect(page.locator("[data-living-market-core='true']").first()).toHaveAttribute(
      "data-chart-first",
      "true"
    );
    await expect(workspaceEarth.first()).toHaveAttribute(
      "data-earth-render-mode",
      "procedural_fallback"
    );

    const visualState = await page.locator(".tpm-workspace-shell").first().evaluate((element) => {
      const chartElement = element.querySelector("[data-living-market-core='true']");
      const earthElement = element.querySelector(
        ".tpm-living-earth-background[data-earth-surface='workstation']"
      );
      const chartBox = chartElement?.getBoundingClientRect();
      const earthStyle = earthElement ? window.getComputedStyle(earthElement) : null;

      return {
        chartWidth: chartBox?.width ?? 0,
        chartHeight: chartBox?.height ?? 0,
        earthOpacity: Number(earthStyle?.getPropertyValue("--tpm-living-earth-opacity") || 0),
      };
    });
    expect(visualState.chartWidth).toBeGreaterThan(0);
    expect(visualState.chartHeight).toBeGreaterThan(0);
    expect(visualState.earthOpacity).toBeLessThanOrEqual(0.16);

    await screenshotLocator(page, ".tpm-workspace-shell", "workspace-subtle-earth-identity.png");
  });

  test("shows public-safe Settings and Diagnostics Earth readiness", async ({ page }) => {
    await openWithTheme(page, "/settings", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("[data-utility-section='earth-reality']")).toContainText(
      /Earth visual|Procedural fallback/
    );
    await screenshotLocator(
      page,
      "[data-utility-section='earth-reality']",
      "settings-earth-controls.png"
    );

    await openWithTheme(page, "/diagnostics", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("[data-utility-section='earth-reality']")).toContainText(
      /Earth visual|Local fallback/
    );
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-public-safe.png");
  });

  test("preserves Product Truth and blocks unapproved/generated image assets", async ({
    request,
  }) => {
    const response = await request.get("/api/earth-reality/status");
    expect(response.status()).toBe(200);
    const payload = await response.json();

    expect(payload.snapshot.productTruthStatus).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedBillingInactive: true,
      productionInactive: true,
      socialPublishingInactive: true,
      noFakeClaims: true,
      noPrivateTermsPublic: true,
      noImagesOrRasterAssets: true,
    });

    const earthTextureDir = path.join(process.cwd(), "public/assets/textures/earth");
    const textureFiles = fs
      .readdirSync(earthTextureDir)
      .filter((fileName) => IMAGE_ASSET_PATTERN.test(fileName));
    expect(textureFiles).toEqual([]);

    const sourceBundle = [
      "modules/brand/components/ProMaxHybridEarth.tsx",
      "modules/brand/components/ProMaxProceduralEarth.tsx",
      "modules/brand/components/ProMaxEarthMark.tsx",
      "modules/brand/components/ProductLogo.tsx",
      "modules/brand/components/LivingEarthBackground.tsx",
      "modules/product/components/PublicProductEntry.tsx",
      "modules/shell/components/TradingWorkstation.tsx",
    ]
      .map(readSource)
      .join("\n");

    expect(sourceBundle).not.toMatch(/<img|fetch\(["']https?:\/\/|src=["']https?:\/\//i);
    expect(sourceBundle).not.toMatch(/liveExecutionActive:\s*true|billingActivated:\s*true|realMoneyActivated:\s*true/i);
  });
});
