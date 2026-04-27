import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";
import {
  classifyIntentAction,
  getButtonPolicySummary,
  getIntentInterfaceReadinessSnapshot,
  getPrivateIntentRegistry,
  getPublicIntentRegistry,
  interpretUserIntent,
} from "../../lib/server/intent-interface";

const ARTIFACT_DIR = path.join("test-results", "intent-driven-interface");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Sovereign Consciousness|Cosmic Physics|Solar Command|Moon Command|\bministries\b|\bcouncils\b|\bgovernance\b|Codex tasks|Task Passport|Result Tribunal|secrets authority|treasury controls|Product Memory internals|Alkon assistant/i;

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

async function expectPublicSafe(page: Page) {
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("TPM Human Intent Operating System", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("classifies core buttons, Assistant intents, and blocked intents", () => {
    expect(classifyIntentAction("open_workspace")).toMatchObject({
      type: "core_action",
      shouldBeButton: true,
      shouldBeAssistantIntent: false,
    });
    expect(classifyIntentAction("buy_paper")).toMatchObject({
      type: "context_action",
      shouldBeButton: true,
    });
    expect(classifyIntentAction("bigger_chart")).toMatchObject({
      type: "assistant_intent",
      shouldBeButton: false,
      shouldBeAssistantIntent: true,
    });
    expect(classifyIntentAction("enable_live")).toMatchObject({
      type: "blocked_intent",
      shouldBeButton: false,
    });

    const policy = getButtonPolicySummary();
    expect(policy.coreButtons).toEqual(
      expect.arrayContaining(["home", "open_workspace", "open_settings", "open_diagnostics", "sign_in"])
    );
    expect(policy.contextualButtons).toEqual(
      expect.arrayContaining(["buy_paper", "sell_paper", "ai_wait", "why_blocked", "open_assistant"])
    );
    expect(policy.assistantIntents).toEqual(
      expect.arrayContaining(["make_calmer", "bigger_chart", "how_to_get_support", "reset_experience"])
    );
    expect(policy.blockedIntents).toEqual(
      expect.arrayContaining(["execute_trade", "provide_signal", "enable_live", "expose_alkon", "expose_codex"])
    );

    const readiness = getIntentInterfaceReadinessSnapshot("2026-04-26T10:00:00.000Z");
    expect(readiness.mode).toBe("human_intent_operating_system");
    expect(readiness.privateIntentsPubliclyAvailable).toBe(false);
    expect(readiness.productTruthPreserved).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedBillingInactive: true,
      noFakePlanActivation: true,
      alkonHiddenPublicly: true,
    });
  });

  test("interprets Arabic and English intent safely", () => {
    expect(interpretUserIntent("Start me")).toMatchObject({
      intentId: "start_request",
      requestedAction: "open_workspace",
      publicVisible: true,
    });
    expect(interpretUserIntent("Make the chart bigger")).toMatchObject({
      intentId: "chart_comfort_request",
      requestedAction: "bigger_chart",
      requiresConfirmation: true,
    });
    expect(interpretUserIntent("اجعل المنصة أهدأ")).toMatchObject({
      intentId: "calm_ui_request",
      requestedAction: "make_calmer",
    });
    expect(interpretUserIntent("أين تطبيق الموبايل")).toMatchObject({
      intentId: "apps_platforms_request",
      requestedAction: "where_mobile_app",
    });
    expect(interpretUserIntent("give me a signal")).toMatchObject({
      intentId: "blocked_safety_request",
      requestedAction: "provide_signal",
      requiresSafetyCheck: true,
    });
    expect(interpretUserIntent("show Alkon")).toMatchObject({
      intentId: "alkon_status_request",
      requestedAction: "expose_alkon",
      publicVisible: false,
    });

    expect(getPublicIntentRegistry().some((intent) => intent.privateOnly)).toBe(false);
    expect(getPrivateIntentRegistry().every((intent) => intent.publicVisible === false)).toBe(true);
  });

  test("companion API exposes public Assistant-first samples", async ({ request }) => {
    const response = await request.get("/api/companion/context?route=/en");
    expect(response.status()).toBe(200);
    const payload = await response.json();
    const text = JSON.stringify(payload);

    expect(text).toContain("start me");
    expect(text).toContain("where is the mobile app");
    expect(text).toContain("how do I get support");
    expect(text).toContain("make the platform calmer");
    expect(text).toContain("bigger chart");
    expect(text).toContain("Pro Max Assistant");
    expect(text).not.toMatch(/canExecuteTrades":true|canActivateLive":true|canActivateBilling":true/);
  });

  test("captures public Assistant-first home and reduced navigation clutter", async ({ page }) => {
    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("body")).toContainText(/Tell Pro Max Assistant what you want/i);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-assistant-first.png"),
    });
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-nav-reduced-clutter.png");
    await screenshotLocator(page, ".tpm-product-hero", "public-no-alkon-leak.png");
  });

  test("captures workspace Assistant-first flow and key intent chips", async ({ page }) => {
    await openWithTheme(page, "/en", "dark");
    await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-workspace-shell", "workspace-assistant-first.png");
    await screenshotLocator(page, ".tpm-intent-workspace-rail", "workspace-no-button-chaos.png");

    await page.getByRole("button", { name: /Pro Max Assistant/i }).click();
    await expect(page.locator("#tpm-companion-panel")).toBeVisible();
    await screenshotLocator(page, ".tpm-companion-prompt-row", "assistant-prompt-chips.png");
    await page.getByRole("button", { name: "Bigger chart" }).click();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-bigger-chart-intent.png");
    await page.getByRole("button", { name: "Calmer" }).click();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-calm-intent.png");
    await page.getByLabel("Ask Pro Max Assistant").fill("Where is the mobile app and how do I get support?");
    await page.getByRole("button", { name: "Send" }).click();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-apps-support-intent.png");
    await page.getByRole("button", { name: "Plans" }).click();
    await screenshotLocator(page, "#tpm-companion-panel", "assistant-plans-intent.png");
  });

  test("captures Settings backup controls and Diagnostics truth center", async ({ page }) => {
    await openWithTheme(page, "/en/settings", "dark");
    await expect(page.locator("body")).toContainText(/Intent controls and backup settings/i);
    await expect(page.locator("body")).toContainText(/Ask Pro Max Assistant/i);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-settings", "settings-backup-controls.png");

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator("body")).toContainText(/Assistant-first interface readiness/i);
    await expect(page.locator("body")).toContainText(/Intent interface/i);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-truth-center.png");
  });

  test("keeps intent interface code-only, non-executing, and public-safe", () => {
    const sourceFiles = [
      "lib/server/intent-interface/types.ts",
      "lib/server/intent-interface/action-classifier.ts",
      "lib/server/intent-interface/intent-registry.ts",
      "lib/server/intent-interface/intent-interpreter.ts",
      "lib/server/intent-interface/button-policy.ts",
      "lib/server/intent-interface/state.ts",
      "modules/companion/components/TPMCompanionPanel.tsx",
      "modules/shell/components/TradingWorkstation.tsx",
      "modules/shell/components/PlatformUtilitySurfaces.tsx",
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
