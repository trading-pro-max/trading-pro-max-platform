import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";

const ARTIFACT_DIR = path.join(
  "test-results",
  "pro-max-alkon-origin-clean-rebirth"
);

const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Founder Command|Kernel|Zero Truth|Reality Trial|Reality Production|Self-Correction|Device Constellation|Pocket Universe|Local Builder|Command Passport|Wake Report internals|Treasury internals|Legal internals|Product Memory internals|Codex tasks|Result Tribunal|Risk Belt|Black Hole Zone|internal governance/i;
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

async function expectNoPublicLeak(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator('a[href^="/founder"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/api/founder"]')).toHaveCount(0);
}

test.describe("Pro Max / Alkon Origin-Clean Rebirth", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("root is Pro Max Center with clean public header and canonical trading route", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/", "dark");

    const header = page.locator(".tpm-foundation-nav-shell").first();
    await expect(header).toBeVisible();
    await expect(header.locator(".tpm-foundation-nav-brand")).toHaveCount(1);
    await expect(header.locator(".tpm-auth-panel-nav summary")).toHaveText("Sign in");
    await expect(header.locator(".tpm-auth-panel-nav summary")).toHaveCount(1);
    await expect(header.locator(".tpm-locale-select")).toHaveCount(0);
    await expect(header.locator(".tpm-theme-switcher")).toHaveCount(0);
    await expect(header.locator(".tpm-shell-utility-link")).toHaveCount(0);

    const allowedNav = [
      "Home",
      "Trading Workspace",
      "Markets",
      "Plans",
      "Apps / Platforms",
      "Support",
    ];
    for (const label of allowedNav) {
      await expect(header.getByRole("link", { exact: true, name: label })).toBeVisible();
    }

    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Center");
    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Trading");
    await expect(page.locator(".tpm-product-cta-primary").first()).toHaveAttribute(
      "href",
      "/trading"
    );
    await expect(
      header.getByRole("link", { exact: true, name: "Trading Workspace" })
    ).toHaveAttribute("href", "/trading");
    await expect(page.locator('a[href="/en"]')).toHaveCount(0);
    await expectNoPublicLeak(page);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "home-pro-max-center.png"),
    });
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-header-clean.png");
    await screenshotLocator(page, ".tpm-auth-panel-nav", "signin-clean.png");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-no-alkon-leak.png"),
    });

    await page.getByRole("link", { exact: true, name: "Enter workspace" }).click();
    await expect(page).toHaveURL(/\/trading$/);
    await expect(page.locator(".tpm-workspace-shell")).toHaveAttribute(
      "data-clean-zero-rebuild",
      "true"
    );
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "route-home-to-trading-proof.png"),
    });
  });

  test("Trading Workspace is canonical, refresh-safe, and origin-clean", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/trading", "dark");

    await expect(page).toHaveURL(/\/trading$/);
    await expect(page.locator('[data-shell-mode="workspace"]')).toHaveCount(1);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpm-foundation-nav-shell")).toHaveCount(0);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar .tpm-brand-lockup")).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-shell .tpm-auth-panel-topbar summary")).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-market-summary")).toContainText("Pro Max Trading");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Paper-safe active");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Live inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Broker/feed inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Billing inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Real money blocked");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/\b[a-z][a-z0-9]+_[a-z0-9_]+\b/);
    await expectNoPublicLeak(page);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-canonical-route.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-workspace-clean.png"),
    });
    await screenshotLocator(page, ".tpm-workspace-shell", "trading-no-public-nav.png");

    await openWithMode(page, "/en", "dark");
    await expect(page.locator(".tpm-workspace-shell")).toHaveAttribute(
      "data-clean-zero-rebuild",
      "true"
    );
  });

  test("chart, execution, assistant, and journal hierarchy stays clean", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/trading", "dark");

    const chart = page.locator(".tpm-living-chart-surface .tpmv2-chart-surface").first();
    const chartHeader = page.locator(".tpm-living-chart-header").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    const assistant = page.locator(".tpm-workspace-assistant-dock").first();
    const assistantDetails = page.locator(".tpm-workspace-assistant-details").first();
    const journal = page.locator(".tpm-workspace-journal-coach-dock").first();

    await expect(chart).toBeVisible();
    await expect(execution).toBeVisible();
    await expect(assistant).toBeVisible();
    await expect(journal).toBeVisible();
    await expect(assistantDetails).not.toHaveAttribute("open", "");
    await expect(page.locator(".tpmv2-core-buy").first()).toContainText(/Buy|Paper/);
    await expect(page.locator(".tpmv2-core-ai").first()).toContainText("AI Wait");
    await expect(page.locator(".tpmv2-core-sell").first()).toContainText(/Sell|Paper/);
    await expect(journal).toContainText("Quiet reflection layer");

    const chartBox = await chart.boundingBox();
    const executionBox = await execution.boundingBox();
    const chartHeaderBox = await chartHeader.boundingBox();
    expect(chartBox).not.toBeNull();
    expect(executionBox).not.toBeNull();
    expect(chartHeaderBox).not.toBeNull();
    expect(chartBox!.width).toBeGreaterThan(executionBox!.width * 2);
    expect(chartBox!.height).toBeGreaterThan(560);
    expect(chartHeaderBox!.y).toBeLessThan(310);

    await screenshotLocator(page, ".tpm-living-market-core-grid", "trading-chart-dominant.png");
    await screenshotLocator(page, ".tpm-living-execution-rail", "trading-execution-integrated.png");
    await screenshotLocator(page, ".tpm-workspace-assistant-dock", "trading-assistant-collapsed.png");

    await page.evaluate(() => {
      const details = document.querySelector(".tpm-workspace-assistant-details");
      if (details instanceof HTMLDetailsElement) details.open = true;
    });
    await expect(assistantDetails).toHaveAttribute("open", "");
    const overlapState = await page.evaluate(() => {
      const assistantBox = document
        .querySelector(".tpm-workspace-assistant-dock")
        ?.getBoundingClientRect();
      const chartBox = document.querySelector(".tpmv2-chart-surface")?.getBoundingClientRect();
      const executionBox = document.querySelector(".tpmv2-execution")?.getBoundingClientRect();
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

  test("private Alkon routes remain command surfaces outside public navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/founder/alkon", "dark");

    await expect(page.locator(".alkon-sovereign-command-interface")).toBeVisible();
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Ask Alkon");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("One Next Action");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Wake Report");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Evidence");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Reality Trial");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("What Not To Do");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Command Passport");
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpm-foundation-nav-shell")).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-alkon-command-interface.png"),
    });

    await openWithMode(page, "/founder/pocket", "dark");
    await expect(page.locator(".alkon-pocket-page")).toBeVisible();
    await expect(page.locator(".alkon-pocket-page")).toContainText("Alkon Pocket");
    await expect(page.locator(".alkon-pocket-page")).toContainText("Wake Report");
    await expect(page.locator(".alkon-pocket-page")).toContainText("One Next Action");
    await expect(page.locator(".alkon-pocket-page")).toContainText("Local Day One Gate");
    await expect(page.locator(".alkon-pocket-page")).toContainText("Open Ask Alkon");
    await expect(
      page.getByRole("button", {
        name: /Run shell|Live trading|Activate billing|Real money|Execute|Launch/i,
      })
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", {
        name: /Run shell|Live trading|Activate billing|Real money|Execute|Launch/i,
      })
    ).toHaveCount(0);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-pocket-clean.png"),
    });
  });

  test("diagnostics, APIs, reports, and source boundaries preserve Product Truth", async ({
    page,
    request,
  }) => {
    await openWithMode(page, "/diagnostics", "dark");
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    await expect(page.locator('a[href^="/founder"]')).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });

    const truth = await request.get("/api/product/truth");
    expect(truth.status()).toBe(200);
    const truthPayload = await truth.json();
    expect(truthPayload.snapshot.summary).toMatchObject({
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      publicLaunch: "inactive",
      secrets: "not_exposed",
    });

    for (const route of [
      "/api/founder/alkon-chat/status",
      "/api/founder/pocket/status",
      "/api/founder/alkon-kernel/snapshot",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text, route).not.toMatch(SECRET_PATTERN);
      expect(text, route).not.toMatch(/liveExecutionActive":true|realMoneyActive":true|billingActive":true|brokerFeedActive":true/);
    }

    const requiredReports = [
      "reports/origin-clean-inventory.md",
      "reports/origin-clean-ownership-map.md",
      "reports/origin-clean-risk-map.md",
      "reports/origin-clean-lifecycle-map.md",
      "reports/origin-clean-next-fate.md",
      "reports/alkon-cleanup-candidates.md",
      "reports/alkon-codebase-architecture-map.md",
    ];
    for (const reportPath of requiredReports) {
      expect(fs.existsSync(path.join(process.cwd(), reportPath)), reportPath).toBe(true);
    }

    const sourceFiles = [
      "app/page.tsx",
      "app/trading/page.tsx",
      "modules/shell/components/PublicAppShell.tsx",
      "modules/shell/components/TradingWorkstation.tsx",
      "modules/shell/components/WorkspaceAssistantDock.tsx",
      "modules/founder-command/components/AlkonSovereignChatInterface.tsx",
      "lib/server/alkon-chat/engine.ts",
      "app/theme-localization.css",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");
    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/new Function|eval\(/);
    expect(source).not.toMatch(/liveExecutionActive:\s*true/);
    expect(source).not.toMatch(/billingActivationActive:\s*true/);
    expect(source).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(source).not.toMatch(/realMoneyRoutingActive:\s*true/);

    const publicRasterAssets = collectFiles(path.join(process.cwd(), "public")).filter(
      (filePath) => RASTER_ASSET_PATTERN.test(filePath)
    );
    expect(publicRasterAssets).toEqual([]);
  });
});
