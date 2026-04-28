import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";

const ARTIFACT_DIR = path.join(
  "test-results",
  "pro-max-trading-clean-zero-rebuild"
);
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Kernel|Zero Truth|Reality Trial|Reality Production|Self-Correction|Pocket Universe|Local Builder|Treasury internals|Legal internals|Product Memory internals|internal governance/i;
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const RASTER_ASSET_PATTERN = /\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)$/i;

async function openWithMode(
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
  const target = page.locator(selector).first();
  await expect(target).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await target.scrollIntoViewIfNeeded();
      await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(250);
    }
  }
}

function collectFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) return collectFiles(fullPath);
    return [fullPath];
  });
}

async function expectNoPublicAlkonLeak(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator('a[href^="/founder"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/api/founder"]')).toHaveCount(0);
}

test.describe("Pro Max Trading Clean Zero Rebuild", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("Home and public header expose one clean sign-in and canonical workspace entry", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/", "dark");

    await expect(page.locator(".tpm-public-shell")).toHaveCount(1);
    await expect(page.locator(".tpm-public-shell .tpm-auth-panel-nav summary")).toHaveCount(1);
    await expect(page.locator(".tpm-public-shell .tpm-auth-popover summary")).toHaveText("Sign in");
    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Center");
    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Trading");
    await expect(page.locator(".tpm-product-cta-primary").first()).toHaveAttribute("href", "/trading");
    await expectNoPublicAlkonLeak(page);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "home-pro-max-center-clean.png"),
    });
    await screenshotLocator(
      page,
      ".tpm-public-shell .tpm-shell-nav-row",
      "public-header-signin-clean.png"
    );

    await page.locator(".tpm-public-nav a", { hasText: "Trading Workspace" }).click();
    await expect(page).toHaveURL(/\/trading$/);
    await expect(page.locator(".tpm-workspace-shell")).toHaveAttribute(
      "data-clean-zero-rebuild",
      "true"
    );
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-route-open.png"),
    });

    await openWithMode(page, "/", "dark");
    await page.getByRole("link", { name: "Enter workspace", exact: true }).click();
    await expect(page).toHaveURL(/\/trading$/);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
  });

  test("Trading Workspace is clean zero: one shell, one logo, no public nav", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/trading", "dark");

    await expect(page.locator('[data-shell-mode="workspace"]')).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpm-terminal-topbar .tpm-brand-lockup")).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-shell .tpm-auth-panel-topbar summary")).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-market-summary")).toContainText("Pro Max Trading");
    await expect(page.locator(".tpm-workspace-market-summary")).toContainText("Trading Workspace");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Paper-safe active");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Live inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Broker/feed inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Billing inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Real money blocked");
    await expectNoPublicAlkonLeak(page);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/\b[a-z][a-z0-9]+_[a-z0-9_]+\b/);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-workspace-clean-zero-dark.png"),
    });
    await screenshotLocator(page, ".tpm-terminal-topbar", "trading-single-logo-header.png");
    await screenshotLocator(page, ".tpm-workspace-shell", "trading-no-public-nav.png");
    await screenshotLocator(page, ".tpm-workspace-shell .tpm-auth-panel-topbar", "sign-in-not-duplicated.png");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "no-alkon-public-leak.png"),
    });

    await openWithMode(page, "/trading", "light");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-workspace-clean-zero-light.png"),
    });
  });

  test("chart dominates, starts high, and execution is integrated", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/trading", "dark");

    const chart = page.locator(".tpm-living-chart-surface .tpmv2-chart-surface").first();
    const chartHeader = page.locator(".tpm-living-chart-header").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    const terminal = page.locator(".tpm-terminal-topbar").first();
    const summary = page.locator(".tpm-workspace-market-summary").first();
    const grid = page.locator(".tpm-living-market-core-grid").first();

    await expect(chart).toBeVisible();
    await expect(execution).toBeVisible();
    await expect(grid).toBeVisible();
    await expect(page.locator(".tpmv2-core-buy").first()).toContainText(/Buy|Paper/);
    await expect(page.locator(".tpmv2-core-ai").first()).toContainText("AI Wait");
    await expect(page.locator(".tpmv2-core-sell").first()).toContainText(/Sell|Paper/);
    await expect(page.locator(".tpmv2-execution .tpm-why-blocked-hint").first()).toBeVisible();

    const chartBox = await chart.boundingBox();
    const chartHeaderBox = await chartHeader.boundingBox();
    const executionBox = await execution.boundingBox();
    const terminalBox = await terminal.boundingBox();
    const summaryBox = await summary.boundingBox();
    expect(chartBox).not.toBeNull();
    expect(chartHeaderBox).not.toBeNull();
    expect(executionBox).not.toBeNull();
    expect(terminalBox).not.toBeNull();
    expect(summaryBox).not.toBeNull();
    expect(chartBox!.width).toBeGreaterThan(executionBox!.width * 2.1);
    expect(chartBox!.height).toBeGreaterThan(560);
    expect(chartHeaderBox!.y).toBeLessThan(310);
    expect(chartBox!.y).toBeLessThan(390);
    expect(summaryBox!.height).toBeLessThan(205);
    expect(chartBox!.y).toBeGreaterThanOrEqual(chartHeaderBox!.y + chartHeaderBox!.height - 2);

    await expect(page.locator(".tpmv2-chart-market-structure")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-ai-panel")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-depth-panel")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-depth-strip").first()).toBeVisible();

    await screenshotLocator(page, ".tpm-living-market-core-grid", "trading-chart-dominant.png");
    await screenshotLocator(page, ".tpm-living-market-core", "trading-chart-starts-high.png");
    await screenshotLocator(page, ".tpm-living-execution-rail", "trading-execution-integrated.png");
  });

  test("Assistant is collapsed, opens without covering chart or execution, and Journal stays secondary", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/trading", "dark");

    const assistant = page.locator(".tpm-workspace-assistant-dock").first();
    const assistantDetails = page.locator(".tpm-workspace-assistant-details").first();
    const journal = page.locator(".tpm-workspace-journal-coach-dock").first();
    await expect(assistant).toBeVisible();
    await expect(journal).toBeVisible();
    await expect(assistantDetails).not.toHaveAttribute("open", "");
    await expect(assistant).toContainText("Pro Max Assistant");
    await expect(assistant).toContainText("Collapsed by default");
    await expect(journal).toContainText("Quiet reflection layer");

    const journalOpacity = await journal.evaluate((element) =>
      Number.parseFloat(window.getComputedStyle(element).opacity)
    );
    expect(journalOpacity).toBeLessThan(0.95);

    await screenshotLocator(page, ".tpm-workspace-assistant-dock", "trading-assistant-collapsed.png");
    await screenshotLocator(page, ".tpm-workspace-journal-coach-dock", "trading-journal-secondary.png");

    await page.evaluate(() => {
      const details = document.querySelector(".tpm-workspace-assistant-details");
      if (details instanceof HTMLDetailsElement) {
        details.open = true;
      }
    });
    await expect(assistantDetails).toHaveAttribute("open", "");

    const overlapState = await page.evaluate(() => {
      const assistantBox = document
        .querySelector(".tpm-workspace-assistant-dock")
        ?.getBoundingClientRect();
      const chartBox = document
        .querySelector(".tpmv2-chart-surface")
        ?.getBoundingClientRect();
      const executionBox = document
        .querySelector(".tpmv2-execution")
        ?.getBoundingClientRect();

      const overlaps = (a?: DOMRect, b?: DOMRect) =>
        Boolean(
          a &&
            b &&
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
        );

      return {
        chart: overlaps(assistantBox, chartBox),
        execution: overlaps(assistantBox, executionBox),
      };
    });

    expect(overlapState).toEqual({ chart: false, execution: false });
    await screenshotLocator(page, ".tpm-workspace-assistant-dock", "trading-assistant-open-no-cover.png");
  });

  test("Product Truth, source safety, and raster policy are preserved", async ({
    request,
  }) => {
    const truth = await request.get("/api/product/truth");
    expect(truth.status()).toBe(200);
    const payload = await truth.json();
    expect(payload.snapshot.summary).toMatchObject({
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      publicLaunch: "inactive",
      secrets: "not_exposed",
    });

    const sourceFiles = [
      "modules/shell/components/TradingWorkstation.tsx",
      "modules/shell/components/TradingTerminalShell.tsx",
      "modules/shell/components/LivingMarketCore.tsx",
      "modules/shell/components/TradingChartSurface.tsx",
      "modules/shell/components/ExecutionRail.tsx",
      "modules/shell/components/WorkspaceAssistantDock.tsx",
      "modules/shell/components/WorkspaceJournalCoachDock.tsx",
      "modules/auth/components/AuthSessionPanel.tsx",
      "modules/shell/components/PublicAppShell.tsx",
      "app/theme-localization.css",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");
    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|new Function|eval\(/);
    expect(source).not.toMatch(/liveExecutionActive:\s*true/);
    expect(source).not.toMatch(/billingActivationActive:\s*true/);
    expect(source).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(source).not.toMatch(/realMoneyRoutingActive:\s*true/);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);

    const rasterAssets = collectFiles(path.join(process.cwd(), "public")).filter(
      (filePath) => RASTER_ASSET_PATTERN.test(filePath)
    );
    expect(rasterAssets).toEqual([]);
  });
});
