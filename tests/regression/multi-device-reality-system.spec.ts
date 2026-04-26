import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { THEME_STORAGE_KEY } from "../../lib/constants/storage";
import {
  getAlkonDeviceRegistry,
  getDeviceContinuityPaths,
  getDevicePermissionRules,
  getFounderDeviceReadinessSnapshot,
  getPublicDeviceReadinessSnapshot,
  getPublicDeviceRegistry,
  HARD_BLOCKED_DEVICE_CAPABILITIES,
  isCapabilityHardBlockedOnEveryDevice,
} from "../../lib/server/devices";

const ARTIFACT_DIR = path.join("test-results", "multi-device-reality-system");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Owner App|Pocket Universe|Command Universe|Watch Alerts|\bministries\b|\bcouncils\b|\bgovernance\b|Codex tasks|secrets authority|treasury controls|Product Memory internals|App Store|Play Store|\bAPK\b|\bIPA\b/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" = "dark"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ themeKey, themeMode }) => {
      window.localStorage.setItem(themeKey, themeMode);
    },
    {
      themeKey: THEME_STORAGE_KEY,
      themeMode,
    }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const target = page.locator(selector).first();
    try {
      await target.waitFor({ state: "visible" });
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
  await expect(page.locator("body")).not.toContainText(/Download Windows|Download Android|Download iOS|Get it on|Install now/i);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("TPM Multi-Device Reality System and Alkon Device Constellation", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("models public apps and private Alkon devices with separate visibility", () => {
    const publicDevices = getPublicDeviceRegistry();
    const publicSnapshot = getPublicDeviceReadinessSnapshot("2026-04-26T10:00:00.000Z");
    const privateDevices = getAlkonDeviceRegistry();
    const founderSnapshot = getFounderDeviceReadinessSnapshot("2026-04-26T10:00:00.000Z");

    expect(publicSnapshot.appsPlatformsTruth).toMatchObject({
      webApp: "current",
      desktopApp: "planned",
      mobileApp: "planned",
      tabletApp: "future",
      fakeDownloads: false,
      appStoreClaims: false,
    });
    expect(publicDevices.map((device) => device.publicName)).toEqual([
      "Pro Max Web App",
      "Pro Max Desktop App",
      "Pro Max Mobile App",
      "Pro Max Tablet App",
    ]);
    expect(publicSnapshot.devices.map((device) => device.publicName)).toEqual(
      publicDevices.map((device) => device.publicName)
    );
    expect(JSON.stringify(publicSnapshot)).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
    expect(JSON.stringify(publicSnapshot)).not.toMatch(/privateName|production_secrets|shell_execution/);

    expect(privateDevices.map((device) => device.privateName)).toEqual(
      expect.arrayContaining([
        "Alkon Desktop Command",
        "Alkon Pocket Universe OS",
        "Alkon Tablet Review",
        "Alkon Watch Alerts",
      ])
    );
    expect(privateDevices.every((device) => !device.publicVisible)).toBe(true);
    expect(founderSnapshot.publicExposure).toBe(false);
    expect(founderSnapshot.noExecution).toBe(true);
    expect(founderSnapshot.noSecrets).toBe(true);
  });

  test("enforces device permission law, security posture, and continuity readiness", () => {
    const permissionRules = getDevicePermissionRules();
    const founderSnapshot = getFounderDeviceReadinessSnapshot("2026-04-26T10:00:00.000Z");
    const continuity = getDeviceContinuityPaths();

    for (const capability of HARD_BLOCKED_DEVICE_CAPABILITIES) {
      expect(isCapabilityHardBlockedOnEveryDevice(capability), capability).toBe(true);
    }
    for (const rule of permissionRules) {
      expect(rule.blocked).toEqual(expect.arrayContaining(HARD_BLOCKED_DEVICE_CAPABILITIES));
      expect(rule.reason).toMatch(/Product Truth/);
    }

    const mobile = founderSnapshot.privateDevices.find(
      (device) => device.deviceId === "alkon_pocket_universe_os"
    );
    const watch = founderSnapshot.privateDevices.find(
      (device) => device.deviceId === "alkon_watch_alerts"
    );
    expect(mobile?.permissionLevel).toBe("approve_low_risk");
    expect(mobile?.blockedCapabilities).toEqual(
      expect.arrayContaining(["production_secrets", "shell_execution"])
    );
    expect(watch?.permissionLevel).toBe("alert_only");

    expect(founderSnapshot.securityReadiness).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deviceId: "alkon_desktop_command",
          posture: expect.arrayContaining([
            "trusted_device_required",
            "step_up_required",
            "passkey_planned",
          ]),
          secretsVisible: false,
          executionControlsEnabled: false,
        }),
      ])
    );
    expect(continuity.map((pathItem) => pathItem.readiness)).toEqual(
      expect.arrayContaining(["planned", "future", "internal_only"])
    );
    expect(continuity.every((pathItem) => pathItem.syncTruth.length > 0)).toBe(true);
  });

  test("exposes public-safe and founder-only read-only device APIs", async ({ request }) => {
    for (const route of ["/api/devices/public", "/api/devices/readiness"]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text, route).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
      expect(text, route).not.toMatch(/privateName|production_secrets|shell_execution/);
      expect(text, route).toMatch(/Pro Max Web App/);
      expect(text, route).toMatch(/Desktop App/);
      expect(text, route).toMatch(/Mobile App/);
      expect(text, route).toMatch(/Tablet App/);
    }

    const founder = await request.get("/api/founder/devices/readiness");
    expect(founder.status()).toBe(200);
    const founderPayload = await founder.json();
    expect(founderPayload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      noExecution: true,
      noSecrets: true,
      noExternalCalls: true,
    });
    expect(JSON.stringify(founderPayload)).toMatch(/Alkon Desktop Command/);

    const alkon = await request.get("/api/founder/devices/alkon");
    expect(alkon.status()).toBe(200);
    const alkonPayload = await alkon.json();
    expect(alkonPayload.publicExposure).toBe(false);
    expect(alkonPayload.noExecution).toBe(true);
    expect(alkonPayload.noSecrets).toBe(true);
  });

  test("captures public device truth without private app leakage", async ({ page }) => {
    await openWithTheme(page, "/", "dark");
    await expectPublicSafe(page);
    await screenshotLocator(page, '[data-public-section="apps-platforms"]', "public-apps-platforms.png");
    await screenshotLocator(page, ".tpm-product-hero", "public-home-apps-strip.png");
    await expect(page.locator('[data-device-id="tpm_web_app"]')).toContainText("Current");
    await expect(page.locator('[data-device-id="tpm_desktop_app"]')).toContainText("Planned");
    await expect(page.locator('[data-device-id="tpm_mobile_app"]')).toContainText("Planned");
    await expect(page.locator('[data-device-id="tpm_tablet_app"]')).toContainText("Future");

    await openWithTheme(page, "/en/settings", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("body")).toContainText(/Device readiness|Web App|Desktop App|Mobile App|Tablet App/);
    await screenshotLocator(page, ".tpm-utility-page-settings", "settings-device-readiness.png");

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expectPublicSafe(page);
    await expect(page.locator("body")).toContainText(/Apps \/ Platforms device readiness|Web App|Desktop App|Mobile App|Tablet App/);
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-device-readiness.png");
  });
});
