import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "public-shell-earth-visual-correction");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Founder Command|Founder King|Owner-only|private command|internal governance|construction queue|Codex task|secrets authority|treasury controls|security sovereignty|local universe/i;

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
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await expect(target).toBeVisible();
  await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
}

async function expectPublicTopbarClean(page: Page) {
  const header = page.locator(".tpm-foundation-nav-shell").first();
  const navText = await header.innerText();
  const primaryLinks = [
    "Home",
    "Trading Workspace",
    "Markets",
    "Plans",
    "Apps / Platforms",
    "Support",
  ];

  await expect(header.locator(".tpm-locale-select")).toHaveCount(0);
  await expect(header.locator(".tpm-theme-switcher")).toHaveCount(0);
  await expect(header.locator(".tpm-environment-control")).toHaveCount(0);
  await expect(header.locator(".tpm-shell-utility-link")).toHaveCount(0);
  await expect(header.locator(".tpm-shell-status-badge")).toHaveCount(0);
  await expect(header.locator(".tpm-auth-panel-nav")).toHaveCount(1);
  for (const linkName of primaryLinks) {
    await expect(header.getByRole("link", { exact: true, name: linkName })).toBeVisible();
  }
  expect(navText).toMatch(/Home|Trading Workspace|Markets|Plans|Apps \/ Platforms|Support|Sign in/);
  expect(navText).not.toMatch(/Academy|Community|Language|Theme|Adaptive Atmosphere|Settings|Diagnostics|Paper-safe|Web current|Live inactive/);
}

test.describe("public shell topbar cleanup and Earth visual correction", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("keeps public Home calm, Earth-native, and free of header control chaos", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/", "dark");

    await expectPublicTopbarClean(page);
    await expect(page.locator(".tpm-product-hero").first()).toBeVisible();
    await expect(page.locator(".tpm-living-earth-background[data-earth-surface='public_entry']")).toHaveCount(1);
    await expect(page.locator(".tpm-living-earth-atmosphere-arc").first()).toBeVisible();
    await expect(page.locator(".tpm-living-earth-globe").first()).toBeVisible();

    const earthVisual = await page.locator(".tpm-product-hero").first().evaluate((element) => {
      const arc = element.querySelector(".tpm-living-earth-atmosphere-arc");
      const globe = element.querySelector(".tpm-living-earth-globe");
      const hero = window.getComputedStyle(element);
      const arcStyle = arc ? window.getComputedStyle(arc) : null;
      const globeStyle = globe ? window.getComputedStyle(globe) : null;

      return {
        arcBorder: arcStyle?.borderTopColor ?? "",
        globeBackground: globeStyle?.backgroundImage ?? "",
        globeShadow: globeStyle?.boxShadow ?? "",
        heroBackground: hero.backgroundImage,
      };
    });
    expect(earthVisual.arcBorder).not.toBe("rgba(0, 0, 0, 0)");
    expect(earthVisual.globeBackground).toContain("gradient");
    expect(earthVisual.globeShadow).not.toBe("none");
    expect(earthVisual.heroBackground).toContain("gradient");

    const hero = page.locator(".tpm-product-hero").first();
    await expect(hero.locator(".tpm-product-cta")).toHaveCount(2);
    await expect(hero.locator(".tpm-product-cta-primary")).toHaveText("Enter workspace");
    await expect(hero.locator(".tpm-product-cta-secondary")).toHaveText("Ask Pro Max Assistant");
    await expect(page.locator("[data-public-section='product-truth-strip']")).toContainText(
      /Paper-safe|Live execution inactive|Broker\/feed not configured/
    );

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
    await expect(page.locator("img")).toHaveCount(0);

    await screenshotLocator(page, ".tpm-product-hero", "home-dark-earth-presence.png");
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-topbar-clean.png");
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-topbar-no-language.png");
    await screenshotLocator(page, ".tpm-product-hero", "hero-essential-ctas.png");
    await screenshotLocator(page, ".tpm-product-hero", "no-alkon-public-leak.png");

    await openWithTheme(page, "/", "light");
    await expectPublicTopbarClean(page);
    await screenshotLocator(page, ".tpm-product-hero", "home-light-earth-presence.png");

    await openWithTheme(page, "/settings", "light");
    await expect(page.locator(".tpm-foundation-nav-shell .tpm-locale-select")).toHaveCount(0);
    await expect(page.locator(".tpm-utility-page-settings .tpm-locale-select")).toHaveCount(0);
    await expect(page.locator(".tpm-language-disabled-note")).toContainText(
      /English only for now|Language switching is being rebuilt/
    );
    await expect(page.locator(".tpm-utility-page-settings .tpm-theme-switcher")).toBeVisible();
    await expect(page.locator(".tpm-utility-page-settings .tpm-environment-control")).toBeVisible();
    await screenshotLocator(
      page,
      ".tpm-utility-page-settings .tpm-utility-card[data-utility-section='global']",
      "settings-language-theme-controls.png"
    );

    await openWithTheme(page, "/", "dark");
    await page.evaluate(() => {
      const shell = document.querySelector<HTMLElement>("[data-shell-mode='public']");
      if (shell) {
        shell.setAttribute("dir", "rtl");
        shell.setAttribute("lang", "ar");
      }
    });
    await expect(page.locator("[data-shell-mode='public']")).toHaveAttribute("dir", "rtl");
    await screenshotLocator(page, ".tpm-product-hero", "rtl-public-home.png");
  });

  test("keeps corrected public shell source code-only without raster assets", () => {
    const sourceFiles = [
      "modules/shell/components/PublicAppShell.tsx",
      "modules/shell/components/ShellControls.tsx",
      "modules/product/components/PublicProductEntry.tsx",
      "modules/brand/components/LivingEarthBackground.tsx",
      "app/theme-localization.css",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    }
  });
});
