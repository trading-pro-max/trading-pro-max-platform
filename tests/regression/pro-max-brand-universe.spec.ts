import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  getBrandArchitectureSnapshot,
  getPrivateBrandUniverse,
  getPublicBrandNames,
} from "../../lib/brand";
import { getPrimeWorldSnapshot, getAlkonGenesisSnapshot } from "../../lib/server/alkon-genesis";
import { getPublicDeviceRegistry } from "../../lib/server/devices";

const ARTIFACT_DIR = path.join("test-results", "pro-max-brand-universe");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Genesis Universe|Future Worlds|World Seeds|World Birth|Prime World|Genesis Gates|World Factory|World Retirement|Digital Universe Runtime|Sovereign Consciousness|Cosmic Physics|Codex tasks|Task Passport|Result Tribunal|secrets authority|treasury controls|Product Memory internals|Risk Belt|Black Hole Zone|\bgovernance\b/i;

async function expectPublicBrandSafe(page: Page) {
  await expect(page.locator("body")).toContainText(/Pro Max/i);
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("body")).not.toContainText(/Download Windows|Download Android|Get it on|App Store|Play Store|\bAPK\b|\bIPA\b/i);
  await expect(page.locator("img")).toHaveCount(0);
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await expect(target).toBeVisible();
  await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
}

test.describe("Pro Max Brand Universe Architecture", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("defines Pro Max mother brand, Pro Max Trading Prime World, and internal TPM namespace policy", () => {
    const publicNames = getPublicBrandNames();
    const architecture = getBrandArchitectureSnapshot("public_user");
    const privateUniverse = getPrivateBrandUniverse();
    const primeWorld = getPrimeWorldSnapshot();
    const genesis = getAlkonGenesisSnapshot("2026-04-26T10:00:00.000Z");

    expect(publicNames).toEqual({
      motherBrand: "Pro Max",
      primeProduct: "Pro Max Trading",
      assistant: "Pro Max Assistant",
    });
    expect(architecture.productTruth).toMatchObject({
      proMaxTradingIsPrimeWorld: true,
      legacyTradingProMaxNameTransitional: true,
      tpmNamespaceAllowedInternally: true,
      noFutureWorldLaunch: true,
      noPublicAlkonExposure: true,
    });
    expect(privateUniverse).toMatchObject({
      motherBrand: "Pro Max",
      primeWorld: "Pro Max Trading",
      privateUniverse: "Alkon",
      futureWorldsReadiness: "private_world_seeds_only",
      publicExposure: false,
    });
    expect(primeWorld).toMatchObject({
      name: "Pro Max Trading",
      motherBrand: "Pro Max",
      legacyProjectName: "Trading Pro Max",
    });
    expect(genesis.productTruthStatus.proMaxTradingRemainsPrimeWorld).toBe(true);
  });

  test("updates public Apps / Platforms truth to Pro Max app names", () => {
    expect(getPublicDeviceRegistry().map((device) => device.publicName)).toEqual([
      "Pro Max Web App",
      "Pro Max Desktop App",
      "Pro Max Mobile App",
      "Pro Max Tablet App",
    ]);
  });

  test("documents the brand universe and keeps it code-only", () => {
    const requiredDocs = [
      "docs/product/pro-max-brand-universe.md",
      "docs/product/pro-max-mother-brand.md",
      "docs/product/pro-max-trading-prime-world.md",
      "docs/product/alkon-private-brand-universe.md",
      "docs/product/pro-max-future-worlds-readiness.md",
      "docs/product/brand-namespace-transition-policy.md",
      "docs/product/pro-max-brand-universe-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const changedSources = [
      "lib/brand/brand-architecture.ts",
      "modules/brand/components/ProductLogo.tsx",
      "modules/product/components/PublicProductEntry.tsx",
      "modules/product/components/PublicAppsPlatformsSection.tsx",
      "modules/companion/components/TPMCompanionPanel.tsx",
      "modules/shell/components/PublicAppShell.tsx",
    ];

    for (const sourcePath of changedSources) {
      const source = fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8");
      expect(source, sourcePath).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
      expect(source, sourcePath).not.toMatch(/liveExecutionActivated:\s*true|billingActivated:\s*true|realMoneyActivated:\s*true/);
    }
  });

  test("captures public Pro Max brand proof with no private leakage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPublicBrandSafe(page);
    await expect(page.locator("body")).toContainText("Pro Max Trading");
    await expect(page.locator("body")).toContainText("Pro Max Assistant");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-pro-max.png"),
    });
    await screenshotLocator(page, '[data-public-section="public-world-overview"]', "public-navigation-pro-max.png");
    await screenshotLocator(page, ".tpm-brand-lockup", "product-logo-pro-max.png");
    await screenshotLocator(page, '[data-public-section="apps-platforms"]', "apps-platforms-pro-max.png");
    await screenshotLocator(page, "#tpm-assistant-guidance", "assistant-pro-max.png");
    await screenshotLocator(page, ".tpm-product-hero", "public-no-alkon-leak.png");
  });

  test("keeps workspace, settings, diagnostics, and logo navigation aligned to Pro Max", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expectPublicBrandSafe(page);
    await screenshotLocator(page, ".tpm-terminal-topbar", "workspace-pro-max-topbar.png");

    await page.goto("/en/settings", { waitUntil: "domcontentloaded" });
    await expectPublicBrandSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-settings", "settings-pro-max.png");
    await page.getByRole("link", { name: /Pro Max home/i }).first().click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/en/diagnostics", { waitUntil: "domcontentloaded" });
    await expectPublicBrandSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-pro-max.png");
  });
});
