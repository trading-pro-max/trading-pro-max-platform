import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { ENVIRONMENT_MODE_STORAGE_KEY, THEME_STORAGE_KEY } from "../../lib/constants/storage";
import { getExistenceEntityInventory } from "../../lib/server/existence-architecture/state";
import { buildJarCommandPassportPreview } from "../../lib/server/jar-build/command-passport-bridge";
import { createJarExitPermit } from "../../lib/server/jar-build/exit-permit";
import { getJarRegistry } from "../../lib/server/jar-build/jar-registry";
import { getJarOneNextAction, prioritizeJarItems } from "../../lib/server/jar-build/prioritizer";
import { getJarInboxItems } from "../../lib/server/jar-build/state";
import { getRealityConversionSnapshot } from "../../lib/server/reality-conversion/state";

const ARTIFACT_DIR = path.join("test-results", "alkon-master-reality-command");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Alkon -0|Founder Command|Kernel|Zero Truth|Reality Trial|Jar System|Permission-to-Exist|Reality Conversion|Command Passport|Wake Report internals|internal governance/i;
const UNSAFE_PUBLIC_CLAIMS =
  /\bFINMA\b|Swiss\s+(regulated|licensed|company|bank)|regulated\s+by\s+Swiss|Swiss\s+license|win-rate|guaranteed profit/i;

async function openWithMode(page: Page, route: string, theme: "dark" | "light" = "dark") {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ environmentKey, themeKey, themeMode }) => {
      window.localStorage.setItem(themeKey, themeMode);
      window.localStorage.setItem(environmentKey, "adaptive");
    },
    {
      environmentKey: ENVIRONMENT_MODE_STORAGE_KEY,
      themeKey: THEME_STORAGE_KEY,
      themeMode: theme,
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

async function expectPublicSafe(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  expect(bodyText).not.toMatch(UNSAFE_PUBLIC_CLAIMS);
  await expect(page.locator('a[href^="/founder"], a[href^="/api/founder"]')).toHaveCount(0);
  await expect(page.locator("img")).toHaveCount(0);
  await expect(page.locator("[src^='http'], [src^='https']")).toHaveCount(0);
}

test.describe("ALKON Master Reality Command", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("connects Source, Permission-to-Exist, Jar, and Reality Conversion privately", () => {
    const existenceEntities = getExistenceEntityInventory();
    const registry = getJarRegistry();
    const inbox = getJarInboxItems();
    const priorities = prioritizeJarItems(inbox);
    const oneNextAction = getJarOneNextAction(inbox);
    const oneNextItem = inbox.find((item) => item.id === oneNextAction.itemId) ?? priorities[0];
    const reality = getRealityConversionSnapshot("2026-04-28T00:00:00.000Z");

    expect(existenceEntities.length).toBeGreaterThan(20);
    expect(existenceEntities.some((entity) => entity.id === "route_trading")).toBe(true);
    expect(existenceEntities.some((entity) => entity.id === "route_founder_alkon")).toBe(true);

    expect(registry).toHaveLength(10);
    expect(registry.map((jarEntry) => jarEntry.number)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(oneNextItem).toBeDefined();
    const permit = createJarExitPermit(oneNextItem!);
    const passport = buildJarCommandPassportPreview(oneNextItem!, permit);
    expect(passport.status).toMatch(/preview_ready|blocked_until_exit_permit/);

    expect(reality).toMatchObject({
      founderOnly: true,
      readOnly: true,
      previewOnly: true,
      noExecution: true,
      noPublicExposure: true,
      status: "active_with_notes",
    });
    expect(reality.passports).toHaveLength(3);
    expect(reality.passports[0]).toMatchObject({
      status: "ahmad_decision_required",
      ahmadDecisionRequired: true,
    });
    expect(reality.productTruth.realMoneyBlocked).toBe(true);
    expect(reality.productTruth.liveExecutionBlocked).toBe(true);

    const requiredFiles = [
      "docs/product/alkon-reality-conversion-system.md",
      "docs/product/reality-passport-law.md",
      "docs/product/everything-to-reality-index.md",
      "reports/alkon-reality-conversion-status.md",
      "reports/alkon-reality-passports.md",
      "reports/alkon-first-reality-step.md",
      "reports/pro-max-trading-platform-depth.md",
      "reports/pro-max-trading-unified-soul-recomposition.md",
    ];

    for (const requiredFile of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), requiredFile)), requiredFile).toBe(true);
    }
  });

  test("renders Pro Max Center and routes users to /trading without public leaks", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/", "dark");

    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Center");
    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Trading");
    await expect(page.locator(".tpm-product-cta-primary").first()).toHaveAttribute(
      "href",
      "/trading"
    );
    await expect(page.locator(".tpm-public-shell .tpm-auth-panel-nav summary")).toHaveCount(1);
    await expectPublicSafe(page);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-pro-max-center.png"),
    });
    await screenshotLocator(page, ".tpm-product-hero-logo", "logo-and-earth-identity.png");

    await page.getByRole("link", { exact: true, name: "Enter workspace" }).click();
    await expect(page).toHaveURL(/\/trading$/);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "route-home-to-trading-proof.png"),
    });
  });

  test("renders Pro Max Trading as paper-safe living core with platform depth", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1600, height: 960 });
    await openWithMode(page, "/trading", "dark");
    await expectPublicSafe(page);

    await expect(page).toHaveURL(/\/trading$/);
    await expect(page.locator('[data-shell-mode="workspace"]')).toHaveCount(1);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar .tpm-brand-lockup")).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-shell .tpm-auth-panel-topbar summary")).toHaveCount(1);
    await expect(page.locator('[data-market-board="true"]')).toBeVisible();
    await expect(page.locator('[data-paper-order-ticket="true"]')).toBeVisible();
    await expect(page.locator('[data-bottom-terminal-dock="true"]')).toBeVisible();

    const chart = page.locator(".tpm-living-chart-surface .tpmv2-chart-surface-swiss").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    await expect(chart).toBeVisible();
    await expect(execution).toBeVisible();
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Paper-safe active");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Live inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Real money blocked");

    const chartBox = await chart.boundingBox();
    const executionBox = await execution.boundingBox();
    expect(chartBox).not.toBeNull();
    expect(executionBox).not.toBeNull();
    expect(chartBox!.width).toBeGreaterThan(executionBox!.width * 2);
    expect(chartBox!.height).toBeGreaterThan(580);
    expect(chartBox!.x + chartBox!.width).toBeGreaterThan(900);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-route-pro-max-trading.png"),
    });
    await screenshotLocator(page, ".tpm-workspace-shell", "trading-living-core-dark.png");
    await screenshotLocator(page, ".tpm-living-market-core-grid", "trading-chart-owns-page.png");
    await screenshotLocator(
      page,
      ".tpm-living-execution-rail",
      "trading-execution-arm-attached.png"
    );
    await screenshotLocator(page, ".tpm-workspace-shell", "trading-platform-depth.png");
    await screenshotLocator(page, ".tpm-living-market-core-grid", "trading-unified-soul.png");
  });

  test("renders Alkon private system, Jar, Reality Conversion, and Pocket gates", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/founder/alkon", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".alkon-sovereign-command-interface")).toBeVisible();
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Ask Alkon");
    await expect(page.locator(".alkon-jar-build-panel").first()).toBeVisible();
    await expect(page.locator(".alkon-reality-conversion-panel").first()).toBeVisible();
    await expect(page.locator(".alkon-reality-conversion-panel").first()).toHaveAttribute(
      "data-no-execution",
      "true"
    );
    await expect(page.locator(".alkon-reality-passport-panel").first()).toContainText(
      "Reality Passport"
    );

    await screenshotLocator(
      page,
      ".alkon-sovereign-command-interface",
      "founder-alkon-real-system.png"
    );
    await screenshotLocator(page, ".alkon-jar-build-panel", "jar-private-panel.png");
    await screenshotLocator(
      page,
      ".alkon-reality-conversion-panel",
      "reality-conversion-panel.png"
    );

    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".alkon-pocket-page").first()).toContainText("Alkon Pocket");
    await expect(page.locator(".tpm-founder-access-card").first()).toContainText("Not started");
    await screenshotLocator(page, ".alkon-pocket-page", "founder-pocket-real-use.png");
    await screenshotLocator(page, ".tpm-founder-access-card", "local-day-one-not-started.png");
  });

  test("keeps diagnostics public-safe and preserves product truth boundaries", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await openWithMode(page, "/diagnostics", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("body")).toContainText("Product truth");
    await expect(page.locator("body")).toContainText("Paper-safe");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });

    await openWithMode(page, "/", "dark");
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "no-public-alkon-leak.png"),
    });
  });
});
