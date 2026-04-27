import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";
import {
  getPublicRevelationExperienceSnapshot,
  getRevelationExperienceSnapshot,
} from "../../lib/server/revelation-experience";

const ARTIFACT_DIR = path.join("test-results", "living-earth-revelation-experience");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|Founder Command|Sovereign Consciousness|Cosmic Physics|Solar Command|Moon Command|\bministries\b|\bcouncils\b|\bgovernance\b|Codex tasks|Task Passport|Result Tribunal|secrets authority|treasury controls|Product Memory internals|Risk Belt|Black Hole Zone/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" = "dark",
  environmentMode = "adaptive"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ themeKey, envKey, themeMode: theme, environmentMode: environment }) => {
      window.localStorage.setItem(themeKey, theme);
      window.localStorage.setItem(envKey, environment);
    },
    {
      themeKey: THEME_STORAGE_KEY,
      envKey: ENVIRONMENT_MODE_STORAGE_KEY,
      themeMode,
      environmentMode,
    }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const target = page.locator(selector).first();
      await target.scrollIntoViewIfNeeded();
      await expect(target).toBeVisible();
      await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(250);
    }
  }
}

async function expectPublicSafe(page: Page) {
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("TPM Living Earth Revelation Experience", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("builds deterministic revelation stages and gates", () => {
    const snapshot = getRevelationExperienceSnapshot("2026-04-26T10:00:00.000Z");
    const publicSnapshot =
      getPublicRevelationExperienceSnapshot("2026-04-26T10:00:00.000Z");

    expect(snapshot.mode).toBe("living_earth_revelation_experience");
    expect(snapshot.status).toBe("ready_with_notes");
    expect(snapshot.first3Seconds.map((check) => check.goal)).toContain("trust");
    expect(snapshot.first10Seconds.map((check) => check.goal)).toContain("clarity");
    expect(snapshot.first30Seconds.map((check) => check.goal)).toContain("guidance");
    expect(snapshot.first3Minutes.map((check) => check.goal)).toContain("usefulness");
    expect(snapshot.firstDay.map((check) => check.goal)).toContain("continuity");
    expect(snapshot.gates.map((gate) => gate.gateId)).toEqual(
      expect.arrayContaining([
        "earth_presence_gate",
        "product_clarity_gate",
        "assistant_awakening_gate",
        "workspace_usefulness_gate",
        "first_day_continuity_gate",
        "product_truth_gate",
        "public_private_boundary_gate",
        "accessibility_gate",
        "visual_acceptance_gate",
      ])
    );
    expect(snapshot.visualAcceptanceNeeded).toBe(true);
    expect(snapshot.productTruth).toMatchObject({
      paperSafeActive: true,
      webCurrent: true,
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedInactive: true,
      billingInactive: true,
      noFakeClaims: true,
      noImagesOrRasterAssets: true,
      noShellExecution: true,
    });
    expect(JSON.stringify(publicSnapshot)).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  });

  test("exposes public-safe revelation status APIs", async ({ request }) => {
    const publicResponse = await request.get("/api/revelation-experience/status");
    expect(publicResponse.status()).toBe(200);
    const publicText = await publicResponse.text();
    expect(publicText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
    expect(publicText).not.toMatch(/liveExecutionActivated":true|billingActivated":true|realMoneyActivated":true/);

    const founderResponse = await request.get("/api/founder/revelation-experience/readiness");
    expect(founderResponse.status()).toBe(200);
    const founderPayload = await founderResponse.json();
    expect(founderPayload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      noExecution: true,
      noSecrets: true,
      noExternalCalls: true,
    });
  });

  test("captures calm first impression and quick product clarity", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);
    await expect(page.locator(".tpm-product-hero")).toContainText(/Earth-native/i);
    await expect(page.locator(".tpm-product-hero .tpm-product-cta")).toHaveCount(2);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "first-3-seconds-home-dark.png"),
    });

    await openWithTheme(page, "/", "light");
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-product-hero", "first-3-seconds-home-light.png");
    await screenshotLocator(page, '[data-public-section="public-world-overview"]', "first-10-seconds-product-clarity.png");
    await screenshotLocator(page, "#tpm-assistant-guidance", "first-30-seconds-assistant-guidance.png");
    await screenshotLocator(page, ".tpm-revelation-continuity", "journal-coach-first-day.png");
    await screenshotLocator(page, ".tpm-product-hero", "no-alkon-public-leak.png");
  });

  test("captures Workspace usefulness, chart focus, and Assistant intents", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openWithTheme(page, "/en", "dark");
    await expectPublicSafe(page);
    await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await page.evaluate(() => {
      const details = document.querySelector(
        ".tpm-workspace-assistant-details"
      ) as HTMLDetailsElement | null;
      if (details) details.open = true;
    });
    await expect(page.locator(".tpm-intent-chip", { hasText: "Journal" }).first()).toBeVisible();
    await screenshotLocator(page, ".tpm-workspace-shell", "workspace-first-3-minutes.png");
    await screenshotLocator(page, ".tpmv2-primary", "workspace-chart-focus.png");

    await page.getByRole("button", { name: /Pro Max Assistant/i }).click();
    await expect(page.locator("#tpm-companion-panel")).toBeVisible();
    await screenshotLocator(page, ".tpm-companion-prompt-row", "assistant-start-intent.png");
    await page.getByRole("button", { name: "Why blocked?" }).click();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-why-blocked.png");
  });

  test("captures Settings, Diagnostics, Static Mode, and High Contrast readiness", async ({ page }) => {
    await openWithTheme(page, "/en/settings", "dark");
    await expect(page.locator("body")).toContainText(/First-use experience controls/i);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-settings", "settings-revelation-controls.png");

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator("body")).toContainText(/Living Earth first-use readiness/i);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-revelation-readiness.png");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await openWithTheme(page, "/", "dark", "static");
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-product-hero", "reduced-motion-static.png");

    await openWithTheme(page, "/", "dark", "high_contrast");
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-product-hero", "high-contrast-readable.png");
  });

  test("keeps revelation implementation code-only and product-truth preserving", () => {
    const sourceFiles = [
      "lib/server/revelation-experience/types.ts",
      "lib/server/revelation-experience/gates.ts",
      "lib/server/revelation-experience/engine.ts",
      "modules/product/components/PublicProductEntry.tsx",
      "modules/shell/components/TradingWorkstation.tsx",
      "modules/shell/components/PlatformUtilitySurfaces.tsx",
      "modules/companion/components/TPMCompanionPanel.tsx",
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
