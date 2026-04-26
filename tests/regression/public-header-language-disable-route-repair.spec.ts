import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join(
  "test-results",
  "public-header-language-disable-route-repair"
);
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Founder Command|Founder King|Owner-only|private command|internal governance|construction queue|Codex task|secrets authority|treasury controls|security sovereignty|local universe/i;
const PUBLIC_LANGUAGE_ACTIVE_TERMS =
  /Arabic language|English \/ Arabic|Language coverage|Human-reviewed .*pack|English fallback|multilingual support active/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" | "system" = "dark"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key, mode }) => window.localStorage.setItem(key, mode),
    { key: THEME_STORAGE_KEY, mode: themeMode }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await expect(target).toBeVisible();
  await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
}

async function expectCleanPublicHeader(page: Page) {
  const header = page.locator(".tpm-foundation-nav-shell").first();
  const expectedLinks = [
    "Home",
    "Trading Workspace",
    "Markets",
    "Plans",
    "Apps / Platforms",
    "Support",
  ];

  await expect(header).toBeVisible();
  await expect(header.locator(".tpm-foundation-nav-brand")).toHaveCount(1);
  await expect(header.locator(".tpm-locale-select")).toHaveCount(0);
  await expect(header.locator(".tpm-locale-switcher")).toHaveCount(0);
  await expect(header.locator(".tpm-theme-switcher")).toHaveCount(0);
  await expect(header.locator(".tpm-environment-control")).toHaveCount(0);
  await expect(header.locator(".tpm-shell-utility-link")).toHaveCount(0);
  await expect(header.locator(".tpm-shell-status-badge")).toHaveCount(0);
  await expect(header.locator(".tpm-public-shell-status-row")).toHaveCount(0);
  await expect(header.locator(".tpm-auth-panel-nav")).toHaveCount(1);

  for (const label of expectedLinks) {
    await expect(header.getByRole("link", { exact: true, name: label })).toBeVisible();
  }

  const headerText = await header.innerText();
  expect(headerText).toContain("Sign in");
  expect(headerText).not.toMatch(
    /Academy|Community|Settings|Diagnostics|Language|System|Dark|Light|Theme|Adaptive Atmosphere|Weather|Paper-safe|Web current|Live inactive/
  );
}

async function expectWorkspaceOpened(page: Page) {
  await expect(page.locator('[data-shell-mode="workspace"]')).toHaveCount(1);
  await expect(page.locator('[data-shell-mode="public"]')).toHaveCount(0);
  await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
  await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
  await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
  await expect(page.locator(".tpmv2-execution").first()).toBeVisible();
  await expect(page.locator(".tpm-foundation-nav-shell")).toHaveCount(0);
  await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
  await expect(page.locator(".tpm-terminal-topbar .tpm-locale-select")).toHaveCount(0);
}

test.describe("public header hard cleanup, language disable, and workspace route repair", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("keeps public header minimal and language/theme controls out of the topbar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openWithTheme(page, "/", "dark");

    await expectCleanPublicHeader(page);
    await expect(page.locator(".tpm-product-hero").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    expect(await page.locator("body").innerText()).not.toMatch(PUBLIC_LANGUAGE_ACTIVE_TERMS);
    await expect(page.locator("img")).toHaveCount(0);
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-header-clean.png");
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-header-no-language.png");
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-header-no-theme-controls.png");
    await screenshotLocator(page, ".tpm-product-hero", "home-clean-header-dark.png");
    await screenshotLocator(page, ".tpm-product-hero", "hero-essential-ctas.png");

    await openWithTheme(page, "/", "light");
    await expectCleanPublicHeader(page);
    await screenshotLocator(page, ".tpm-product-hero", "home-clean-header-light.png");

    const logoHref = await page
      .locator(".tpm-shell-logo-home-link")
      .first()
      .getAttribute("href");
    expect(logoHref).toBe("/");
  });

  test("keeps Settings controls functional without a broken language dropdown", async ({
    page,
  }) => {
    await openWithTheme(page, "/settings", "dark");

    await expectCleanPublicHeader(page);
    await expect(page.locator(".tpm-utility-page-settings .tpm-theme-switcher")).toHaveCount(1);
    await expect(page.locator(".tpm-utility-page-settings .tpm-environment-control")).toHaveCount(1);
    await expect(page.locator(".tpm-utility-page-settings .tpm-locale-select")).toHaveCount(0);
    await expect(page.locator(".tpm-utility-page-settings .tpm-locale-switcher")).toHaveCount(0);
    await expect(page.locator(".tpm-language-disabled-note")).toHaveAttribute(
      "data-language-readiness",
      "multilingual_rebuild_needed"
    );
    await expect(page.locator(".tpm-language-disabled-note")).toHaveAttribute(
      "data-public-language-switching",
      "disabled"
    );
    await expect(page.locator(".tpm-language-disabled-note")).toHaveAttribute(
      "data-language-switching-note",
      "public_language_switching_disabled"
    );
    await expect(page.locator(".tpm-language-disabled-note")).toContainText(
      /English only for now|Language switching is being rebuilt/
    );
    expect(await page.locator("body").innerText()).not.toMatch(PUBLIC_LANGUAGE_ACTIVE_TERMS);
    await screenshotLocator(
      page,
      ".tpm-utility-page-settings .tpm-utility-card[data-utility-section='global']",
      "settings-no-broken-language.png"
    );
  });

  test("opens the Trading Workspace reliably from nav, hero, root, and localized routes", async ({
    page,
  }) => {
    await openWithTheme(page, "/", "dark");

    const workspaceLink = page
      .locator(".tpm-foundation-nav-shell")
      .getByRole("link", { exact: true, name: "Trading Workspace" });
    await expect(workspaceLink).toHaveAttribute("href", "/en");
    await workspaceLink.click();
    await expect(page).toHaveURL(/\/en$/);
    await expectWorkspaceOpened(page);
    await screenshotLocator(page, ".tpm-workspace-shell", "trading-workspace-route-open.png");
    await screenshotLocator(page, ".tpm-terminal-topbar", "workspace-no-public-nav.png");

    await openWithTheme(page, "/", "dark");
    await screenshotLocator(page, ".tpm-product-hero", "hero-essential-ctas.png");
    await page.getByRole("link", { exact: true, name: "Enter workspace" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expectWorkspaceOpened(page);

    await openWithTheme(page, "/", "dark");
    await expect(page.locator('[data-shell-mode="public"]')).toHaveCount(1);
    await expect(page.locator(".tpm-product-hero").first()).toBeVisible();

    await openWithTheme(page, "/en", "dark");
    await expect(page).toHaveURL(/\/en$/);
    await expectWorkspaceOpened(page);
  });

  test("keeps public surfaces private-term free and source code-only", async ({ page }) => {
    await openWithTheme(page, "/", "dark");
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    await expect(page.locator("img")).toHaveCount(0);
    await screenshotLocator(page, ".tpm-product-hero", "no-alkon-public-leak.png");

    const sourceFiles = [
      "modules/shell/components/PublicAppShell.tsx",
      "modules/shell/components/ShellControls.tsx",
      "modules/shell/components/PlatformUtilitySurfaces.tsx",
      "modules/product/components/PublicProductEntry.tsx",
      "modules/product/components/PublicWorldOverview.tsx",
      "app/theme-localization.css",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    }
  });
});
