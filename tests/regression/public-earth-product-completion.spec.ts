import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "public-earth-product-completion");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Founder King|Owner controls|internal governance|\bministries\b|\bcouncils\b|Codex tasks|Codex task|construction queue|\bsecrets?\b|internal memory|Product Memory|Cosmic Operating Physics|Risk Belt|Black Hole Zone|Task Graph|Secrets Authority|Security Sovereignty|Local Operations/i;
const FAKE_DOWNLOAD_TERMS =
  /Download Windows|Download Android|Download iOS|App Store|Google Play|Play Store|Get it on|Native installer/i;

const requiredPublicSurfaces = [
  "Home",
  "Trading Workspace",
  "Markets",
  "Plans",
  "Apps / Platforms",
  "Academy",
  "Community",
  "Support",
  "Settings",
  "Diagnostics",
];

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

async function expectPublicSafe(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
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

test.describe("public Earth product completion", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("renders a complete public Home without private leakage", async ({ page }) => {
    await openWithTheme(page, "/", "dark");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Pro Max Trading");

    for (const surface of requiredPublicSurfaces) {
      await expect(page.locator("body")).toContainText(surface);
    }

    await expect(page.locator(".tpm-public-world-nav-card")).toHaveCount(7);
    await expect(page.locator(".tpm-public-world-utility-card")).toHaveCount(2);
    await expect(page.locator("body")).toContainText(/Free|Pro|VIP|Institutional/);
    await expect(page.locator("body")).toContainText(/Paper-safe|Live inactive|Billing inactive/);
    await expect(page.locator("body")).not.toContainText(FAKE_DOWNLOAD_TERMS);
    await expectPublicSafe(page);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "home-dark.png"),
    });
    await screenshotLocator(page, "#public-navigation", "public-navigation.png");
    await screenshotLocator(page, "#markets", "markets.png");
    await screenshotLocator(page, "#apps-platforms", "apps-platforms.png");
    await screenshotLocator(page, "#academy", "academy.png");
    await screenshotLocator(page, "#community", "community.png");
    await screenshotLocator(page, "#support", "support.png");
  });

  test("renders light Home and plan realms with truthful activation states", async ({ page }) => {
    await openWithTheme(page, "/", "light");
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "home-light.png"),
    });
    await screenshotLocator(page, "#plans", "plan-surfaces.png");

    const free = page.locator('[data-plan-realm="free_earth"]').first();
    const pro = page.locator('[data-plan-realm="pro_orbit"]').first();
    const vip = page.locator('[data-plan-realm="vip_lunar"]').first();
    const institutional = page.locator('[data-plan-realm="institutional_station"]').first();

    await expect(free).toContainText(/Free|Active|Start on the web workspace/);
    await expect(pro).toContainText(/Pro|Planned|Professional workspace tools/);
    await expect(vip).toContainText(/VIP|Planned|Premium advanced layer/);
    await expect(institutional).toContainText(/Institutional|Future|Future team/);
    await expect(page.locator('[data-plan-realm="alkon_universe"]')).toHaveCount(0);

    await screenshotLocator(page, '[data-plan-realm="free_earth"]', "free-earth-realm.png");
    await screenshotLocator(page, '[data-plan-realm="pro_orbit"]', "pro-orbit-preview.png");
    await screenshotLocator(page, '[data-plan-realm="vip_lunar"]', "vip-lunar-preview.png");
    await screenshotLocator(
      page,
      '[data-plan-realm="institutional_station"]',
      "institutional-station-preview.png"
    );
  });

  test("renders workstation, Assistant, Settings, Diagnostics, and RTL safely", async ({
    page,
  }) => {
    await openWithTheme(page, "/en", "dark");
    await expect(page.locator(".tpmv2-desktop-master").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(/Pro Max Assistant|Paper-safe controls/);
    await expectPublicSafe(page);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workstation-dark.png"),
    });

    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "5", shiftKey: true }));
    });
    await expect(page.locator(".tpmv2-desktop-master").first()).toHaveClass(/focus-chart/);
    await screenshotLocator(page, ".tpmv2-chart-surface", "chart-focus.png");

    await page.locator(".tpm-companion-launcher").first().click();
    await expect(page.locator(".tpm-companion-panel").first()).toBeVisible();
    await expect(page.locator(".tpm-companion-panel").first()).toContainText(
      /Free Assistant|paper-safe guidance|Real money blocked/
    );
    await expect(page.locator(".tpm-companion-panel").first()).not.toContainText(
      PUBLIC_FORBIDDEN_TERMS
    );
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "assistant-open.png"),
    });
    await page.getByRole("button", { name: "Close Pro Max Assistant" }).click();

    await openWithTheme(page, "/en/settings", "dark");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(/Account|Plan|Assistant|Journal\/Coach|Theme|Language|Product truth/);
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "settings.png"),
    });

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(
      /System readiness|Workspace readiness|Plan readiness|Assistant readiness|Safety readiness|Service availability/
    );
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics.png"),
    });

    await openWithTheme(page, "/ar", "dark");
    await expect(page.locator(".tpmv2-desktop-master").first()).toBeVisible();
    await expect(page.locator(".tpm-foundation-frame").first()).toHaveAttribute("dir", "rtl");
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "arabic-rtl-workstation.png"),
    });
  });

  test("keeps public product source code-only without raster assets", () => {
    const sourceFiles = [
      "modules/product/components/PublicProductEntry.tsx",
      "modules/product/components/PublicWorldOverview.tsx",
      "modules/product/components/PublicMarketsSection.tsx",
      "modules/product/components/PublicAppsPlatformsSection.tsx",
      "modules/product/components/PublicAcademySection.tsx",
      "modules/product/components/PublicCommunitySection.tsx",
      "modules/product/components/PublicSupportSection.tsx",
      "modules/brand/components/TPMEarthMark.tsx",
      "modules/brand/components/LivingEarthBackground.tsx",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    }
  });
});
