import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";

const ARTIFACT_DIR = path.join("test-results", "living-market-core-rebuild");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Codex tasks|Task Passport|Result Tribunal|Product Memory internals|Treasury internals|Risk Belt|Black Hole Zone|internal governance/i;

async function openWorkspace(
  page: Page,
  pathName = "/en",
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
  await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
  await expect(page.locator(".tpm-living-market-core").first()).toBeVisible();
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

async function expectPublicSafeWorkspace(page: Page) {
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
  await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
  await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
  await expect(page.locator(".tpm-shell-logo-home-link")).toHaveCount(1);
}

test.describe("Living Market Core Trading Workspace Rebuild", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("renders one terminal shell, one compact logo, and no public navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWorkspace(page, "/en", "dark");
    await expectPublicSafeWorkspace(page);
    await expect(page.locator('[data-shell-mode="workspace"]')).toHaveCount(1);
    await expect(
      page.locator('.tpmv2-shell-desktop [data-living-market-core="true"]')
    ).toHaveCount(1);
    await expect(
      page.locator('.tpmv2-shell-desktop [data-chart-first="true"]')
    ).toHaveCount(1);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-dark.png"),
    });
    await screenshotLocator(page, ".tpm-terminal-topbar", "single-logo-proof.png");
    await screenshotLocator(page, ".tpm-workspace-shell", "no-public-nav.png");
    await screenshotLocator(page, ".tpm-workspace-shell", "no-alkon-public-leak.png");
  });

  test("keeps the chart dominant with paper execution beside it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWorkspace(page, "/en", "dark");
    await expectPublicSafeWorkspace(page);

    const chart = page.locator(".tpm-living-chart-surface .tpmv2-chart-surface").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    await expect(chart).toBeVisible();
    await expect(execution).toBeVisible();
    await expect(page.locator(".tpmv2-core-buy").first()).toContainText(/Buy|Paper/);
    await expect(page.locator(".tpmv2-core-ai").first()).toContainText(/AI Wait/);
    await expect(page.locator(".tpmv2-core-sell").first()).toContainText(/Sell|Paper/);
    await expect(page.locator("body")).toContainText(/Paper-safe active|Live inactive/);
    await expect(page.locator("body")).toContainText(/Broker\/feed inactive|Real money blocked/);
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

    await screenshotLocator(page, ".tpm-living-chart-surface", "chart-focus.png");
    await screenshotLocator(page, ".tpm-living-execution-rail", "execution-rail.png");
  });

  test("keeps Assistant collapsed and Journal Coach secondary", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWorkspace(page, "/en", "dark");
    await expectPublicSafeWorkspace(page);

    const assistantDock = page.locator(".tpm-workspace-assistant-dock").first();
    const details = page.locator(".tpm-workspace-assistant-details").first();
    const journalDock = page.locator(".tpm-workspace-journal-coach-dock").first();
    await expect(assistantDock).toBeVisible();
    await expect(journalDock).toBeVisible();
    await expect(assistantDock).toContainText(/Start|Why blocked\?|Bigger chart|Calmer|Plans|Journal|Support/);

    const assistantInitiallyOpen = await details.evaluate(
      (element) => element instanceof HTMLDetailsElement && element.open
    );
    expect(assistantInitiallyOpen).toBe(false);
    await screenshotLocator(page, ".tpm-workspace-assistant-dock", "assistant-collapsed.png");

    await page.evaluate(() => {
      const details = document.querySelector(".tpm-workspace-assistant-details");
      if (details instanceof HTMLDetailsElement) {
        details.open = true;
      }
    });
    await expect(details).toHaveAttribute("open", "");
    await screenshotLocator(page, ".tpm-workspace-assistant-dock", "assistant-open.png");
    await screenshotLocator(page, ".tpm-workspace-journal-coach-dock", "journal-coach-dock.png");
  });

  test("captures light, ultrawide, RTL, static, and high contrast workspace proof", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWorkspace(page, "/en", "light");
    await expectPublicSafeWorkspace(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-light.png"),
    });

    await page.setViewportSize({ width: 1920, height: 980 });
    await openWorkspace(page, "/en", "dark");
    await expectPublicSafeWorkspace(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-ultrawide.png"),
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await openWorkspace(page, "/ar", "dark");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "rtl");
    await expectPublicSafeWorkspace(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-rtl.png"),
    });

    await page.emulateMedia({ reducedMotion: "reduce" });
    await openWorkspace(page, "/en", "dark", "static");
    await expect(page.locator("html")).toHaveAttribute(
      "data-tpm-environment-mode",
      "static"
    );
    await expectPublicSafeWorkspace(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "static-mode.png"),
    });

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openWorkspace(page, "/en", "dark", "high_contrast");
    await expect(page.locator("html")).toHaveAttribute(
      "data-tpm-environment-mode",
      "high_contrast"
    );
    await expectPublicSafeWorkspace(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "high-contrast.png"),
    });
  });

  test("keeps implementation code-only and unsafe activation blocked", () => {
    const sourceFiles = [
      "modules/shell/components/TradingWorkstation.tsx",
      "modules/shell/components/LivingMarketCore.tsx",
      "modules/shell/components/TradingChartSurface.tsx",
      "modules/shell/components/TradingChartCanvas.tsx",
      "modules/shell/components/ExecutionRail.tsx",
      "modules/shell/components/WorkspaceAssistantDock.tsx",
      "modules/shell/components/WorkspaceJournalCoachDock.tsx",
      "modules/shell/components/PlatformShellV2.tsx",
      "app/theme-localization.css",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
      expect(source, sourceFile).not.toMatch(/child_process|execSync|spawnSync|run Codex directly/i);
      expect(source, sourceFile).not.toMatch(/liveExecutionActivated:\s*true|billingActivated:\s*true|realMoneyActivated:\s*true/);
    }
  });
});
