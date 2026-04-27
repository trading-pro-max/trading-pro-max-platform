import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  getAlkonPocketUniverseSnapshot,
  getFounderDeviceReadinessSnapshot,
  HARD_BLOCKED_DEVICE_CAPABILITIES,
} from "../../lib/server/devices";
import { getLocalBuilderReadinessSnapshot } from "../../lib/server/local-builder";
import { getRealityProductionSnapshot } from "../../lib/server/reality-production";
import { getSelfCorrectionSnapshot } from "../../lib/server/self-correction";

const OFFICIAL_PATH =
  "C:\\Users\\ahmad\\Desktop\\ALKON\\Pro Max\\Pro Max Trading\\pro-max-trading-platform";
const ARTIFACT_DIR = path.join("test-results", "alkon-a-z-operating-execution");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|Founder Command|Kernel|Operating Mode|Device Constellation|Pocket Universe|Reality Production|Self-Correction|Local Builder|Zero Truth|Reality Trial|Product Memory internals|Treasury internals|Legal internals|internal governance|Task Passport|Result Tribunal|Risk Belt|Black Hole Zone/i;
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;

async function expectPublicClean(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main").first()).toBeVisible();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator(`a[href="/founder/pocket"]`)).toHaveCount(0);
  await expect(page.locator(`a[href="/founder/command"]`)).toHaveCount(0);
}

test.describe("Alkon A-Z Operating Execution", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents official path and desktop structure", () => {
    const requiredDocs = [
      "docs/product/alkon-desktop-structure.md",
      "docs/product/alkon-private-device-constellation.md",
      "docs/product/windows-command-build-center.md",
      "docs/product/iphone-pocket-decision-center.md",
      "docs/product/samsung-review-android-reality-center.md",
      "docs/product/alkon-pocket-universe.md",
      "docs/product/device-trust-law.md",
      "docs/product/device-permission-law.md",
      "docs/product/device-security-boundaries.md",
      "docs/product/local-network-device-access.md",
      "docs/product/device-constellation-index.md",
    ];

    for (const filePath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), filePath)), filePath).toBe(true);
    }

    const desktopStructure = fs.readFileSync(
      path.join(process.cwd(), "docs/product/alkon-desktop-structure.md"),
      "utf8"
    );
    expect(desktopStructure).toContain(OFFICIAL_PATH);
    expect(desktopStructure).toContain("Archive is not the current project");
    expect(desktopStructure).not.toMatch(/legacy-trading-pro-max-archives/i);
  });

  test("models Ahmad's official private device constellation", () => {
    const snapshot = getFounderDeviceReadinessSnapshot("2026-04-27T10:00:00.000Z");
    const names = snapshot.privateDevices.map((device) => device.privateName);

    expect(snapshot.officialConstellation).toEqual({
      windows: "Windows Command + Build Center",
      iphone: "iPhone Pocket Decision Center",
      samsung: "Samsung Review + Android Reality Center",
    });
    expect(names).toEqual(
      expect.arrayContaining([
        "Windows Command + Build Center",
        "iPhone Pocket Decision Center",
        "Samsung Review + Android Reality Center",
      ])
    );

    for (const capability of [
      "shell_execution",
      "codex_execution",
      "payment_execution",
      "live_execution",
      "billing_activation",
      "broker_feed_activation",
      "real_money",
    ] as const) {
      expect(HARD_BLOCKED_DEVICE_CAPABILITIES).toContain(capability);
    }

    const phoneDevices = snapshot.privateDevices.filter((device) =>
      ["iphone_pocket_decision_center", "samsung_review_android_reality_center"].includes(
        device.constellationRole
      )
    );
    expect(phoneDevices).toHaveLength(2);
    for (const phone of phoneDevices) {
      expect(phone.permissionLevel).toBe("review_only");
      expect(phone.blockedCapabilities).toEqual(
        expect.arrayContaining([
          "shell_execution",
          "codex_execution",
          "payment_execution",
          "live_execution",
          "billing_activation",
          "broker_feed_activation",
          "real_money",
          "production_secrets",
        ])
      );
      expect(phone.publicVisible).toBe(false);
    }
  });

  test("Pocket snapshot and APIs are read-only and safe", async ({ request }) => {
    const pocket = getAlkonPocketUniverseSnapshot("2026-04-27T10:00:00.000Z");

    expect(pocket).toMatchObject({
      founderOnly: true,
      readOnly: true,
      publicExposure: false,
      localDayOne: "not_started",
      visualAcceptance: "visual_acceptance_needed",
      noShell: true,
      noCodex: true,
      noPayments: true,
      noSecrets: true,
      noLiveTrading: true,
    });
    expect(pocket.decisionOptions).toEqual([
      "accept",
      "reject_with_notes",
      "focused_correction",
    ]);

    for (const route of [
      "/api/founder/devices/readiness",
      "/api/founder/devices/registry",
      "/api/founder/pocket/status",
      "/api/founder/pocket/wake-report",
      "/api/founder/pocket/one-next-action",
      "/api/founder/pocket/visual-review",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text, route).toMatch(/readOnly|noExecution|founderOnly/);
      expect(text, route).not.toMatch(SECRET_PATTERN);
      expect(text, route).not.toMatch(/"noShell"\s*:\s*false|"noCodex"\s*:\s*false|"noPayments"\s*:\s*false/);
    }
  });

  test("Reality Production, Self-Correction, and Local Builder are private readiness systems", async ({
    request,
  }) => {
    const reality = getRealityProductionSnapshot("2026-04-27T10:00:00.000Z");
    const correction = getSelfCorrectionSnapshot("2026-04-27T10:00:00.000Z");
    const builder = getLocalBuilderReadinessSnapshot("2026-04-27T10:00:00.000Z");

    expect(reality).toMatchObject({
      status: "ready_with_notes",
      founderOnly: true,
      readOnly: true,
      publicExposure: false,
      codexIsBuilderNotLeader: true,
      nextFate: "ahmad_visual_review",
    });
    expect(reality.productTruth).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedInactive: true,
      billingInactive: true,
      publicLaunchInactive: true,
    });

    expect(correction.signals.map((signal) => signal.type)).toEqual(
      expect.arrayContaining([
        "visual_blocker",
        "route_blocker",
        "public_private_leak",
        "product_truth_risk",
        "failed_tests",
        "dirty_git",
        "missing_wake_report",
        "codex_dependency_risk",
        "local_day_one_blocker",
        "heart_drift",
      ])
    );
    expect(builder).toMatchObject({
      status: "ready_with_notes",
      terminalOnly: true,
      webAppCanExecuteShell: false,
      webAppCanRunCodex: false,
      externalCalls: false,
      secretsVisible: false,
    });

    for (const route of [
      "/api/founder/reality-production/readiness",
      "/api/founder/self-correction/readiness",
      "/api/founder/local-builder/readiness",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text).toMatch(/founderOnly|readOnly|noExecution/);
      expect(text).not.toMatch(SECRET_PATTERN);
    }

    expect((await request.get("/api/reality-production/readiness")).status()).toBe(404);
    expect((await request.get("/api/self-correction/readiness")).status()).toBe(404);
    expect((await request.get("/api/local-builder/readiness")).status()).toBe(404);
  });

  test("Founder Command receives all A-Z readiness surfaces", async ({ request }) => {
    const response = await request.get("/api/founder/command/snapshot");
    expect(response.status()).toBe(200);
    const payload = await response.json();
    const snapshot = payload.snapshot;

    expect(snapshot.deviceConstellation.officialConstellation).toMatchObject({
      windows: "Windows Command + Build Center",
      iphone: "iPhone Pocket Decision Center",
      samsung: "Samsung Review + Android Reality Center",
    });
    expect(snapshot.localBuilder.status).toBe("ready_with_notes");
    expect(snapshot.realityProduction.status).toBe("ready_with_notes");
    expect(snapshot.selfCorrection.status).toBe("ready_with_notes");
    expect(snapshot.finalUniversalClosureGate).toMatchObject({
      status: "ready_with_notes",
      localDayOne: "not_started",
      visualAcceptance: "visual_acceptance_needed",
      startsAutomatically: false,
    });
    expect(snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/devices/registry",
        "/api/founder/pocket/status",
        "/api/founder/local-builder/readiness",
        "/api/founder/reality-production/readiness",
        "/api/founder/self-correction/readiness",
      ])
    );
    const text = JSON.stringify(payload);
    expect(text).toMatch(/realityProduction|selfCorrection|localBuilder/);
    expect(text).not.toMatch(SECRET_PATTERN);
  });

  test("public UI remains clean and does not link to private pocket routes", async ({
    page,
  }) => {
    await expectPublicClean(page, "/");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-no-pocket-link.png"),
    });

    await expectPublicClean(page, "/diagnostics");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });
  });

  test("private Pocket UI is mobile-readable and action-safe", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Pocket Decision Center");
    await expect(page.locator("body")).toContainText("Wake Report");
    await expect(page.locator("body")).toContainText("One Next Action");
    await expect(page.locator("body")).toContainText("visual_acceptance_needed");
    await expect(page.locator("button")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Launch now|Pay now|Live trade now|Run shell now|Run Codex now/i);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "pocket-iphone-layout.png"),
    });
  });

  test("new A-Z source remains secret-free, no-execution, and no-raster outside screenshots", () => {
    const sourceFiles = [
      "lib/server/devices/pocket-universe.ts",
      "lib/server/reality-production/state.ts",
      "lib/server/self-correction/state.ts",
      "lib/server/local-builder/index.ts",
      "app/founder/pocket/page.tsx",
      "app/api/founder/pocket/status/route.ts",
      "app/api/founder/reality-production/readiness/route.ts",
      "app/api/founder/self-correction/readiness/route.ts",
      "app/api/founder/local-builder/readiness/route.ts",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/liveExecutionActive:\s*true/);
    expect(source).not.toMatch(/billingActivationActive:\s*true/);
    expect(source).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(source).not.toMatch(/realMoneyRoutingActive:\s*true/);
  });
});
