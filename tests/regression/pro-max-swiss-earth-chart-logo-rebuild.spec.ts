import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "pro-max-swiss-earth-chart-logo-rebuild");
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
}

test.describe("Pro Max Swiss Earth, logo, and chart rebuild", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("renders the rebuilt chart body without old obstructing overlays", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithTheme(page, "/trading", "dark");
    await expectPublicSafe(page);

    const chart = page.locator(".tpmv2-chart-surface-swiss").first();
    const chartBody = page.locator(".tpmv2-chart-body").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    await expect(chart).toBeVisible();
    await expect(chart).toHaveAttribute("data-chart-obstruction-layer", "none");
    await expect(chart).toHaveAttribute("data-swiss-precision-chart", "true");
    await expect(chartBody).toHaveAttribute("data-old-overlay-artifacts", "removed");
    await expect(page.locator(".tpmv2-chart-market-structure")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-floating-bar")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-ai-panel")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-depth-panel")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-price-marker").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-volume").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-depth-strip").first()).toBeVisible();
    await expect(execution).toHaveAttribute("data-execution-attached-to-chart", "true");

    const chartBox = await chart.boundingBox();
    const executionBox = await execution.boundingBox();
    expect(chartBox).not.toBeNull();
    expect(executionBox).not.toBeNull();
    expect(chartBox!.width).toBeGreaterThan(executionBox!.width * 2);
    expect(chartBox!.height).toBeGreaterThan(620);
    expect(Math.abs(executionBox!.x - (chartBox!.x + chartBox!.width))).toBeLessThan(40);
    expect(Math.abs(executionBox!.y - chartBox!.y)).toBeLessThan(120);

    await screenshotLocator(page, ".tpmv2-chart-surface-swiss", "chart-body-rebuilt-dark.png");
    await screenshotLocator(page, ".tpmv2-chart-body", "chart-no-old-overlays.png");
    await screenshotLocator(page, ".tpm-living-execution-rail", "execution-attached-to-chart.png");

    await openWithTheme(page, "/trading", "light");
    await expect(page.locator(".tpmv2-chart-surface-swiss").first()).toBeVisible();
    await screenshotLocator(page, ".tpmv2-chart-surface-swiss", "chart-body-rebuilt-light.png");
  });

  test("renders a premium code-only Swiss-inspired logo and Earth fallback", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);

    const heroLogo = page.locator(".tpm-product-hero-logo").first();
    const heroMark = heroLogo.locator(".tpm-earth-mark-public").first();
    const hybridEarth = heroMark.locator(".tpm-hybrid-earth").first();
    await expect(heroLogo).toHaveAttribute(
      "data-brand-visual-origin",
      "pro-max-swiss-earth-financial"
    );
    await expect(heroLogo).toHaveAttribute("data-swiss-inspired-precision", "true");
    await expect(heroMark).toHaveAttribute(
      "data-earth-visual-direction",
      "swiss-inspired-procedural"
    );
    await expect(heroMark).toHaveAttribute("data-earth-raster-assets", "false");
    await expect(heroMark).toHaveAttribute("data-earth-swiss-regulatory-claim", "false");
    await expect(hybridEarth).toHaveAttribute("data-earth-active-texture", "false");
    await expect(hybridEarth).toHaveAttribute("data-earth-render-mode", "procedural_fallback");
    await expect(hybridEarth).toHaveAttribute("data-earth-swiss-regulatory-claim", "false");
    await expect(heroLogo.locator("image, img")).toHaveCount(0);
    await expect(heroMark.locator(".tpm-earth-moon-orbit")).toHaveAttribute(
      "data-legacy-visual-marker",
      "suppressed"
    );

    const inlineStyle = (await hybridEarth.getAttribute("style")) ?? "";
    expect(inlineStyle).not.toMatch(/https?:\/\//i);
    expect(inlineStyle).not.toMatch(/\.(png|jpe?g|webp|gif|avif)/i);

    await screenshotLocator(page, ".tpm-product-hero-logo", "logo-swiss-clean-hero.png");
    await screenshotLocator(page, ".tpm-foundation-nav-brand", "logo-swiss-clean-compact.png");
    await screenshotLocator(page, ".tpm-product-hero", "earth-swiss-identity-home.png");
    await screenshotLocator(page, ".tpm-product-hero-logo .tpm-earth-mark-public", "earth-swiss-identity-logo.png");
    await screenshotLocator(page, ".tpm-product-hero", "public-home-no-alkon-leak.png");
  });

  test("applies Swiss precision to the workspace while Local Day One stays gated", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1600, height: 960 });
    await openWithTheme(page, "/trading", "dark");
    await expectPublicSafe(page);

    await expect(page.locator(".tpm-workspace-shell").first()).toHaveAttribute(
      "data-swiss-inspired-precision",
      "true"
    );
    await expect(page.locator(".tpmv2-chart-surface-swiss").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-surface-swiss .tpmv2-chart-body").first()).toBeVisible();
    await screenshotLocator(page, ".tpm-living-market-core-grid", "trading-swiss-precision-cockpit.png");

    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".tpm-founder-access-card").first()).toContainText("Not started");
    await expect(page.locator(".tpm-founder-access-card").first()).toContainText(
      "Ahmad visual acceptance needed"
    );
    await screenshotLocator(page, ".tpm-founder-access-card", "local-day-one-not-started.png");
  });

  test("keeps the Swiss visual rebuild source code-only and product-truth safe", () => {
    const sourceFiles = [
      "modules/shell/components/PlatformShellV2.tsx",
      "modules/shell/components/TradingChartSurface.tsx",
      "modules/shell/components/TradingChartCanvas.tsx",
      "modules/brand/components/ProductLogo.tsx",
      "modules/brand/components/ProMaxEarthMark.tsx",
      "modules/brand/components/ProMaxHybridEarth.tsx",
      "modules/brand/components/ProMaxProceduralEarth.tsx",
      "app/theme-localization.css",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
      expect(source, sourceFile).not.toMatch(/FINMA-approved|Swiss regulated|Swiss licensed|Swiss company/i);
      expect(source, sourceFile).not.toMatch(/liveExecutionActivated:\s*true|billingActivated:\s*true|realMoneyActivated:\s*true/);
    }
  });
});
