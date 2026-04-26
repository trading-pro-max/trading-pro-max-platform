import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "global-shell-navigation-rebuild");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|ministries|councils|governance|construction queue|Codex tasks|secrets|treasury controls|internal memory/i;

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

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const target = page.locator(selector).first();
      await expect(target).toBeVisible();
      await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(250);
    }
  }
}

async function expectPublicHeaderMinimal(page: Page, shellSelector: string) {
  const shell = page.locator(shellSelector).first();
  const shellControls = shell.locator(".tpm-shell-controls").first();
  const header = shell.locator(".tpm-foundation-nav-shell").first();

  await expect(shellControls).toHaveCount(1);
  await expect(shellControls.locator(".tpm-auth-panel-nav")).toHaveCount(1);
  await expect(header.locator(".tpm-locale-select")).toHaveCount(0);
  await expect(header.locator(".tpm-theme-switcher")).toHaveCount(0);
  await expect(header.locator(".tpm-environment-control")).toHaveCount(0);
  await expect(header.locator(".tpm-shell-utility-link")).toHaveCount(0);
  await expect(header.locator(".tpm-shell-status-badge")).toHaveCount(0);
}

async function expectWorkspaceControlsOnce(page: Page, shellSelector: string) {
  const shellControls = page.locator(shellSelector).first().locator(".tpm-shell-controls").first();

  await expect(shellControls).toHaveCount(1);
  await expect(shellControls.locator(".tpm-auth-panel-nav, .tpm-auth-panel-topbar")).toHaveCount(1);
  await expect(shellControls.locator(".tpm-theme-switcher")).toHaveCount(1);
  await expect(shellControls.locator(".tpm-locale-select")).toHaveCount(1);
  await expect(shellControls.locator(".tpm-shell-utility-link", { hasText: "Settings" })).toHaveCount(1);
  await expect(shellControls.locator(".tpm-shell-utility-link", { hasText: "Diagnostics" })).toHaveCount(1);
}

test.describe("global shell and navigation rebuild", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("renders a single compact public app shell on Home", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/", "dark");

    await expect(page.locator('[data-shell-mode="public"]')).toHaveCount(1);
    await expect(page.locator(".tpm-foundation-nav-shell")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(0);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    await expectPublicHeaderMinimal(page, ".tpm-public-shell");

    const publicNav = await page.locator(".tpm-foundation-nav-shell").innerText();
    expect(publicNav).toMatch(
      /Home|Trading Workspace|Markets|Plans|Apps \/ Platforms|Academy|Support|Sign in/
    );
    expect(publicNav).not.toMatch(/Community|Settings|Diagnostics|Language|Theme|Adaptive Atmosphere|Paper-safe|Web current|Live inactive/);
    await expect(page.locator(".tpm-foundation-nav-brand")).toHaveCount(1);
    await expect(page.locator(".tpm-foundation-nav-brand .tpm-earth-mark-compact")).toHaveCount(1);
    await expect(page.locator(".tpm-shell-status-public .tpm-shell-status-badge")).toHaveCount(0);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-shell-dark.png"),
    });
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-navigation-desktop.png");

    await openWithTheme(page, "/", "light");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-shell-light.png"),
    });

    await page.setViewportSize({ width: 1180, height: 780 });
    await openWithTheme(page, "/", "dark");
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-navigation-laptop.png");
  });

  test("renders workspace with one terminal shell and no public nav", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/en", "dark");

    await expect(page.locator('[data-shell-mode="workspace"]')).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-foundation-nav-shell")).toHaveCount(0);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpm-terminal-topbar .tpm-foundation-nav-brand")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar .tpm-brand-lockup")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar .tpm-shell-status-badge", { hasText: "Paper-safe" })).toHaveCount(1);
    await expectWorkspaceControlsOnce(page, ".tpm-terminal-topbar");
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);

    const terminalBox = await page.locator(".tpm-terminal-topbar").boundingBox();
    const chartBox = await page.locator(".tpmv2-chart-surface").first().boundingBox();
    expect(terminalBox).not.toBeNull();
    expect(chartBox).not.toBeNull();
    expect(chartBox!.y).toBeGreaterThanOrEqual(terminalBox!.y + terminalBox!.height - 2);
    expect(chartBox!.y - (terminalBox!.y + terminalBox!.height)).toBeLessThan(260);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-single-terminal-shell-dark.png"),
    });
    await screenshotLocator(page, ".tpm-terminal-topbar", "workspace-no-public-nav.png");
    await screenshotLocator(page, ".tpm-terminal-topbar .tpm-foundation-nav-brand", "workspace-single-logo.png");
    await screenshotLocator(page, ".tpmv2-primary", "workspace-chart-starts-under-terminal.png");

    await openWithTheme(page, "/en", "light");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-single-terminal-shell-light.png"),
    });
  });

  test("keeps utility pages public-shell and RTL workspace terminal-only", async ({ page }) => {
    await openWithTheme(page, "/en/settings", "dark");
    await expect(page.locator('[data-shell-mode="public"]')).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(0);
    await expectPublicHeaderMinimal(page, ".tpm-public-shell");
    await expect(page.locator(".tpm-utility-page-settings .tpm-theme-switcher")).toHaveCount(1);
    await expect(page.locator(".tpm-utility-page-settings .tpm-locale-select")).toHaveCount(1);
    await expect(page.locator(".tpm-utility-page-settings .tpm-environment-control")).toHaveCount(1);
    await screenshotLocator(page, ".tpm-public-shell", "settings-shell.png");

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator('[data-shell-mode="public"]')).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(0);
    await expectPublicHeaderMinimal(page, ".tpm-public-shell");
    await screenshotLocator(page, ".tpm-public-shell", "diagnostics-shell.png");

    await openWithTheme(page, "/ar", "dark");
    await expect(page.locator(".tpm-workspace-shell")).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-foundation-nav-shell")).toHaveCount(0);
    await screenshotLocator(page, ".tpm-workspace-shell", "rtl-workspace-shell.png");
  });

  test("keeps shell source code-only and public/private separated", () => {
    const sourceFiles = [
      "modules/shell/components/AppShell.tsx",
      "modules/shell/components/PublicAppShell.tsx",
      "modules/shell/components/TradingTerminalShell.tsx",
      "modules/shell/components/PrivateFounderShell.tsx",
      "modules/shell/components/ShellControls.tsx",
      "modules/shell/components/ShellNavigation.tsx",
      "modules/shell/components/ShellStatusBadges.tsx",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    }
  });
});
