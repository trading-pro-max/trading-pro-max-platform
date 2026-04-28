import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";

const ARTIFACT_DIR = path.join(
  "test-results",
  "pro-max-full-balance-workspace-rebuild"
);
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Codex tasks|Task Passport|Result Tribunal|Product Memory internals|Treasury internals|Risk Belt|Black Hole Zone|internal governance/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" = "dark",
  environmentMode = "adaptive"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ envKey, environment, theme, themeKey }) => {
      window.localStorage.clear();
      window.localStorage.setItem(themeKey, theme);
      window.localStorage.setItem(envKey, environment);
    },
    {
      envKey: ENVIRONMENT_MODE_STORAGE_KEY,
      environment: environmentMode,
      theme: themeMode,
      themeKey: THEME_STORAGE_KEY,
    }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const target = page.locator(selector).first();
    await expect(target).toBeVisible();

    try {
      await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(250);
    }
  }

  throw lastError ?? new Error(`Unable to capture ${selector}.`);
}

function collectFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) return collectFiles(fullPath);
    return [fullPath];
  });
}

test.describe("Pro Max full visual balance and workspace rebuild", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("keeps the public header balanced and Home visually unified", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 920 });
    await openWithTheme(page, "/", "dark");

    const header = page.locator(".tpm-public-shell .tpm-shell-nav-row").first();
    const nav = page.locator(".tpm-public-shell .tpm-public-nav").first();
    await expect(header).toBeVisible();
    await expect(page.locator('.tpm-public-shell[data-visual-origin="pro-max-earth-financial"]')).toBeVisible();
    await expect(nav).toBeVisible();
    await expect(header).toContainText(
      "HomeTrading WorkspaceMarketsPlansApps / PlatformsSupportSign in"
    );
    await expect(header).not.toContainText(/Language|Theme|Adaptive Atmosphere|Settings|Diagnostics/);
    await expect(page.locator(".tpm-public-shell .tpm-auth-panel-nav summary")).toHaveCount(1);
    await expect(page.locator(".tpm-public-shell img")).toHaveCount(0);
    await expect(page.locator(".tpm-public-shell .tpm-procedural-earth").first()).toBeVisible();
    await expect(page.locator(".tpm-public-shell .tpm-hybrid-earth").first()).toHaveAttribute(
      "data-earth-renderer",
      "hybrid"
    );
    await expect(page.locator(".tpm-public-shell .tpm-hybrid-earth").first()).toHaveAttribute(
      "data-earth-active-texture",
      "false"
    );
    await expect(
      page.locator(
        '.tpm-product-hero[data-public-section="public-entry-hero"] .tpm-product-cta-row a'
      )
    ).toHaveCount(2);
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);

    const headerBox = await header.boundingBox();
    const navBox = await nav.boundingBox();

    if (!headerBox || !navBox) {
      throw new Error("Header or nav box was unavailable for visual balance check.");
    }

    const headerCenter = headerBox.x + headerBox.width / 2;
    const navCenter = navBox.x + navBox.width / 2;
    expect(Math.abs(headerCenter - navCenter)).toBeLessThan(28);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "home-full-balance-dark.png"),
    });
    await screenshotLocator(page, ".tpm-product-hero-logo", "logo-procedural-earth-balanced.png");
    await screenshotLocator(page, ".tpm-public-shell .tpm-shell-nav-row", "header-balanced.png");
    await screenshotLocator(page, ".tpm-public-shell .tpm-shell-nav-row", "header-no-language-theme.png");

    await openWithTheme(page, "/", "light");
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "home-full-balance-light.png"),
    });
  });

  test("routes from Home to the rebuilt workspace and keeps one shell", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 920 });
    await openWithTheme(page, "/", "dark");
    await page.getByRole("link", { name: "Enter workspace", exact: true }).click();
    await expect(page).toHaveURL(/\/trading$/);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator('.tpm-workspace-shell[data-visual-origin="pro-max-earth-financial"]')).toBeVisible();
    await expect(page.locator(".tpm-terminal-topbar")).toHaveAttribute(
      "data-workspace-header",
      "single-terminal-header"
    );
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpm-terminal-topbar .tpm-foundation-nav-brand")).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "home-to-workspace-route.png"),
    });
    await screenshotLocator(page, ".tpm-terminal-topbar", "workspace-one-logo-one-header.png");
    await screenshotLocator(page, ".tpm-workspace-shell", "workspace-no-public-nav.png");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);

    await page.locator(".tpm-terminal-topbar .tpm-shell-logo-home-link").click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("keeps chart dominant, execution integrated, and assistant secondary", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 920 });
    await openWithTheme(page, "/trading", "dark");

    const chart = page.locator(".tpm-living-chart-surface").first();
    const coreGrid = page.locator(".tpm-living-market-core-grid").first();
    const plot = page.locator(".tpm-living-chart-surface .tpmv2-chart-surface").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    const assistant = page.locator(".tpm-workspace-assistant-dock").first();
    const assistantDetails = page.locator(".tpm-workspace-assistant-details").first();
    const journal = page.locator(".tpm-workspace-journal-coach-dock").first();

    await expect(chart).toBeVisible();
    await expect(coreGrid).toBeVisible();
    await expect(plot).toBeVisible();
    await expect(execution).toBeVisible();
    await expect(assistant).toBeVisible();
    await expect(journal).toBeVisible();
    await expect(page.locator(".tpm-living-market-core")).toHaveAttribute(
      "data-visual-hierarchy",
      "chart-execution-truth-assistant-journal-atmosphere-brand"
    );
    await expect(chart).toHaveAttribute("data-visual-priority", "primary");
    await expect(execution).toHaveAttribute("data-visual-priority", "secondary");
    await expect(assistantDetails).not.toHaveAttribute("open", "");
    await expect(assistant).toContainText("Start");
    await expect(assistant).toContainText("Why blocked?");
    await expect(page.locator(".tpm-workspace-market-summary")).toBeVisible();

    const assistantLayout = await assistant.evaluate((element) => {
      const style = window.getComputedStyle(element);
      const parentStyle = element.parentElement
        ? window.getComputedStyle(element.parentElement)
        : null;

      return {
        parentDisplay: parentStyle?.display ?? "",
        parentGridTemplate: parentStyle?.gridTemplateColumns ?? "",
        position: style.position,
      };
    });

    expect(assistantLayout.position).not.toMatch(/absolute|fixed|sticky/);
    expect(assistantLayout.parentDisplay).toBe("grid");

    const workspaceCss = fs.readFileSync(
      path.join(process.cwd(), "app/theme-localization.css"),
      "utf8"
    );
    expect(workspaceCss).toContain(
      "grid-template-columns: minmax(0, 1fr) minmax(310px, 354px)"
    );
    expect(workspaceCss).toContain(
      "min-height: clamp(580px, calc(100svh - 252px), 900px)"
    );
    expect(workspaceCss).toContain("padding: 12px 14px");

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-full-rebuild-dark.png"),
    });
    await screenshotLocator(
      page,
      ".tpm-living-market-core-grid",
      "workspace-chart-dominant.png"
    );
    await screenshotLocator(
      page,
      ".tpm-living-market-core",
      "workspace-chart-starts-high.png"
    );
    await screenshotLocator(
      page,
      ".tpm-living-execution-rail",
      "workspace-execution-integrated.png"
    );
    await screenshotLocator(
      page,
      ".tpm-workspace-assistant-dock",
      "workspace-assistant-collapsed.png"
    );
    await screenshotLocator(
      page,
      ".tpm-workspace-journal-coach-dock",
      "workspace-journal-secondary.png"
    );

    await page.evaluate(() => {
      const details = document.querySelector(".tpm-workspace-assistant-details");
      if (details instanceof HTMLDetailsElement) {
        details.open = true;
      }
    });
    await expect(assistantDetails).toHaveAttribute("open", "");
    await expect(coreGrid).toBeVisible();
    await expect(execution).toBeVisible();
    await screenshotLocator(
      page,
      ".tpm-workspace-assistant-dock",
      "workspace-assistant-open-no-cover.png"
    );

    await openWithTheme(page, "/trading", "light");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-full-rebuild-light.png"),
    });
  });

  test("keeps Settings, Diagnostics, Plans, Apps, and Support in the same family", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 920 });

    await openWithTheme(page, "/en/settings", "dark");
    await expect(page.locator('.tpm-utility-page-settings[data-visual-origin="pro-max-earth-financial"]')).toBeVisible();
    await expect(page.locator(".tpm-language-disabled-note")).toContainText("English only for now");
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    await screenshotLocator(page, ".tpm-utility-page-settings", "settings-balanced.png");

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator('.tpm-utility-page-diagnostics[data-visual-origin="pro-max-earth-financial"]')).toBeVisible();
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-balanced.png");

    await openWithTheme(page, "/", "dark");
    await screenshotLocator(page, "#plans", "plans-balanced.png");
    await expect(
      page.locator("#apps-platforms a, #apps-platforms button").filter({
        hasText: /Download|Install|APK|App Store|Play Store/i,
      })
    ).toHaveCount(0);
    await screenshotLocator(page, "#apps-platforms", "apps-balanced.png");
    await screenshotLocator(page, "#support", "support-balanced.png");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "no-alkon-public-leak.png"),
    });
  });

  test("keeps the implementation code-only and free of raster asset use", () => {
    const sourceFiles = [
      "modules/brand/components/ProMaxProceduralEarth.tsx",
      "modules/brand/components/ProMaxHybridEarth.tsx",
      "modules/brand/components/ProductLogo.tsx",
      "modules/brand/components/TPMEarthMark.tsx",
      "modules/brand/components/LivingEarthBackground.tsx",
      "modules/shell/components/TradingWorkstation.tsx",
      "modules/shell/components/TradingTerminalShell.tsx",
      "app/theme-localization.css",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    }

    const rasterFiles = ["app", "modules", "lib", "public"]
      .flatMap((sourceDir) => collectFiles(path.join(process.cwd(), sourceDir)))
      .filter((fileName) => /\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)$/i.test(fileName));

    expect(rasterFiles).toEqual([]);
  });
});
