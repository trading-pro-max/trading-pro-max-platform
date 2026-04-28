import { expect, test, type Page } from "@playwright/test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const STORAGE_KEY = "tpm-platform-state-v1";
const DEMO_EMAIL = process.env.TPM_DEMO_EMAIL ?? "demo@tradingpromax.local";
const DEMO_PASSWORD =
  process.env.TPM_DEMO_PASSWORD ?? "TradingProMaxDemo!2026";
const VALIDATOR_SCRIPT = "scripts/validate-production-readiness.mjs";
const STAGING_VALIDATOR_SCRIPT = "scripts/validate-staging-readiness.mjs";
const SETUP_SCRIPT = "scripts/setup-production-env-local.mjs";
const GENERATE_LAUNCH_SECRETS_SCRIPT = "scripts/generate-launch-secrets.mjs";
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const THEME_ARTIFACT_DIR = path.join(
  "test-results",
  "visual-simplification-global-standard"
);

function validatorEnv(overrides: Record<string, string | undefined> = {}) {
  const env: Record<string, string | undefined> = {
    SystemRoot: process.env.SystemRoot,
    PATH: process.env.PATH,
    PATHEXT: process.env.PATHEXT,
    ComSpec: process.env.ComSpec,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP,
    USERPROFILE: process.env.USERPROFILE,
    DOTENV_CONFIG_PATH: ".env.production.validation-test-missing",
  };

  return {
    ...env,
    ...overrides,
  };
}

function runProductionValidator(
  overrides: Record<string, string | undefined> = {},
  extraArgs: string[] = []
) {
  return spawnSync(process.execPath, [VALIDATOR_SCRIPT, "--json", ...extraArgs], {
    cwd: process.cwd(),
    env: validatorEnv(overrides) as NodeJS.ProcessEnv,
    encoding: "utf8",
  });
}

function runStagingValidator(
  overrides: Record<string, string | undefined> = {},
  extraArgs: string[] = []
) {
  return spawnSync(process.execPath, [STAGING_VALIDATOR_SCRIPT, "--json", ...extraArgs], {
    cwd: process.cwd(),
    env: validatorEnv(overrides) as NodeJS.ProcessEnv,
    encoding: "utf8",
  });
}

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

async function expectRuntimeCssApplied(page: Page, mode: "entry" | "workstation" | "utility") {
  const runtime = await page.evaluate(async (expectedMode) => {
    const cssLinks = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
    ).map((link) => link.href);
    const cssAssets = await Promise.all(
      cssLinks.map(async (href) => {
        try {
          const response = await fetch(href, { cache: "no-store" });
          const text = await response.text();

          return {
            href,
            status: response.status,
            length: text.length,
            hasFrameSelectors: text.includes("tpm-foundation-frame"),
            hasBrandSelectors: text.includes("tpm-brand-mark"),
            hasProductSelectors: text.includes("tpm-product-entry"),
            hasWorkstationSelectors: text.includes("tpmv2-desktop-master"),
            hasAuthSelectors: text.includes("tpm-auth-panel"),
          };
        } catch {
          return {
            href,
            status: 0,
            length: 0,
            hasFrameSelectors: false,
            hasBrandSelectors: false,
            hasProductSelectors: false,
            hasWorkstationSelectors: false,
            hasAuthSelectors: false,
          };
        }
      })
    );
    const bodyStyle = window.getComputedStyle(document.body);
    const frame = document.querySelector(".tpm-foundation-frame");
    const nav = document.querySelector(".tpm-foundation-nav");
    const entry = document.querySelector(".tpm-product-entry");
    const workstation = document.querySelector(".tpmv2-desktop-master");
    const utility = document.querySelector(".tpm-utility-page");

    return {
      cssLinks,
      cssAssets,
      bodyFont: bodyStyle.fontFamily,
      bodyColor: bodyStyle.color,
      frameDisplay: frame ? window.getComputedStyle(frame).display : "missing",
      navDisplay: nav ? window.getComputedStyle(nav).display : "missing",
      entryDisplay: entry ? window.getComputedStyle(entry).display : "missing",
      workstationDisplay: workstation
        ? window.getComputedStyle(workstation).display
        : "missing",
      workstationColumns: workstation
        ? window.getComputedStyle(workstation).gridTemplateColumns
        : "missing",
      utilityDisplay: utility ? window.getComputedStyle(utility).display : "missing",
      expectedMode,
    };
  }, mode);

  expect(runtime.cssLinks.length).toBeGreaterThan(0);
  expect(runtime.cssAssets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        status: 200,
        hasFrameSelectors: true,
        hasBrandSelectors: true,
        hasAuthSelectors: true,
      }),
    ])
  );
  expect(runtime.bodyFont).toContain("Inter");
  expect(runtime.bodyColor).not.toBe("rgb(0, 0, 0)");
  expect(runtime.frameDisplay).not.toBe("missing");
  if (mode === "workstation") {
    expect(["missing", "flex"]).toContain(runtime.navDisplay);
  } else {
    expect(["flex", "grid"]).toContain(runtime.navDisplay);
  }

  if (mode === "entry") {
    expect(runtime.cssAssets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          hasProductSelectors: true,
          hasWorkstationSelectors: true,
        }),
      ])
    );
    expect(runtime.entryDisplay).not.toBe("missing");
    expect(runtime.workstationDisplay).toBe("missing");
  }

  if (mode === "workstation") {
    expect(runtime.cssAssets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          hasWorkstationSelectors: true,
        }),
      ])
    );
    expect(runtime.workstationDisplay).toBe("grid");
    expect(runtime.workstationColumns).not.toBe("none");
  }

  if (mode === "utility") {
    expect(runtime.utilityDisplay).toBe("grid");
  }
}

test.describe("verified platform truth", () => {
  test("keeps production readiness validation strict and secret-safe", () => {
    const monitorSecret = "DoNotLeak_MonitoringSecret_2026_Value!";
    const oldBrokerSecret = "LocalOnly_BrokerSecret_DoNotLeak_2026_Value!";
    const blockedResult = runProductionValidator({
      NODE_ENV: "production",
      TPM_DEPLOYMENT_TARGET: "production",
      DATABASE_URL: "file:./prisma/dev.db",
      TPM_DEMO_EMAIL: "demo@tradingpromax.local",
      TPM_DEMO_PASSWORD: "TradingProMaxDemo!2026",
      TPM_OPERATOR_EMAIL: "operator@tradingpromax.local",
      TPM_OPERATOR_PASSWORD: "TradingProMaxOperator!2026",
      TPM_OPS_EXTERNAL_MONITOR_KEY: monitorSecret,
      TPM_BROKER_API_SECRET: oldBrokerSecret,
    });

    expect(blockedResult.status).toBe(1);
    expect(blockedResult.stdout).not.toContain(monitorSecret);
    expect(blockedResult.stdout).not.toContain(oldBrokerSecret);
    const blockedPayload = JSON.parse(blockedResult.stdout);
    expect(blockedPayload.summary).toMatchObject({
      status: "blocked",
      target: "production",
      launchMode: "closed_beta",
    });
    expect(blockedPayload.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "database_url", ok: false }),
        expect.objectContaining({ key: "operator_key", ok: false }),
        expect.objectContaining({ key: "credentials_rotated", ok: false }),
        expect.objectContaining({ key: "secret_rotation_attestation", ok: false }),
        expect.objectContaining({ key: "rotated_secret_patterns", ok: false }),
        expect.objectContaining({ key: "closed_beta_allowlist", ok: false }),
        expect.objectContaining({ key: "external_monitoring", ok: false }),
      ])
    );

    const passResult = runProductionValidator({}, ["--simulate-safe"]);

    expect(passResult.status).toBe(0);
    expect(passResult.stdout).not.toContain(
      "TpmKey_2026_SimulatedOnly_Value_ABCDEFG12345!"
    );
    expect(passResult.stdout).not.toContain(
      "MonKey_2026_SimulatedOnly_Value_ABCDEFG12345!"
    );
    const passPayload = JSON.parse(passResult.stdout);
    expect(passPayload).toMatchObject({
      ok: true,
      summary: {
        status: "pass",
        simulated: true,
        blockers: 0,
      },
      secretExposurePolicy: "presence_and_shape_only",
    });
  });

  test("keeps staging readiness validation strict and simulation labeled", () => {
    const monitorSecret = "DoNotLeak_StagingMonitoringSecret_2026_Value!";
    const blockedResult = runStagingValidator({
      NODE_ENV: "production",
      TPM_DEPLOYMENT_TARGET: "staging",
      TPM_LAUNCH_MODE: "staging",
      TPM_STAGING_BASE_URL: "https://example.test",
      TPM_STAGING_DEPLOYMENT_ID: "placeholder",
      TPM_STAGING_ROLLBACK_REF: "placeholder",
      DATABASE_URL: "file:./prisma/dev.db",
      TPM_OPS_EXTERNAL_MONITOR_KEY: monitorSecret,
    });

    expect(blockedResult.status).toBe(1);
    expect(blockedResult.stdout).not.toContain(monitorSecret);
    const blockedPayload = JSON.parse(blockedResult.stdout);
    expect(blockedPayload.summary).toMatchObject({
      status: "blocked",
      target: "staging",
      launchMode: "staging",
    });
    expect(blockedPayload.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "staging_hosting", ok: false }),
        expect.objectContaining({ key: "database_url", ok: false }),
        expect.objectContaining({ key: "operator_key", ok: false }),
        expect.objectContaining({ key: "credentials_rotated", ok: false }),
        expect.objectContaining({ key: "closed_beta_allowlist", ok: false }),
        expect.objectContaining({ key: "external_monitoring", ok: false }),
      ])
    );

    const passResult = runStagingValidator({}, ["--simulate-safe"]);

    expect(passResult.status).toBe(0);
    expect(passResult.stdout).not.toContain(
      "TpmKey_2026_StagingSimulatedOnly_Value_ABCDEFG12345!"
    );
    expect(passResult.stdout).not.toContain(
      "MonKey_2026_StagingSimulatedOnly_Value_ABCDEFG12345!"
    );
    const passPayload = JSON.parse(passResult.stdout);
    expect(passPayload).toMatchObject({
      ok: true,
      summary: {
        status: "pass",
        target: "staging",
        launchMode: "staging",
        simulated: true,
        blockers: 0,
      },
      secretExposurePolicy: "presence_and_shape_only",
      simulationNotice:
        "Simulated staging mode proves validator logic only; it is not real staging deployment evidence.",
    });
  });

  test("creates ignored local production env safely without printing secrets and keeps launch blocked", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tpm-prod-env-"));
    const envPath = path.join(tempDir, ".env.production.local");
    const setupResult = spawnSync(
      process.execPath,
      [
        SETUP_SCRIPT,
        "--path",
        envPath,
        "--database-url",
        "file:/var/lib/trading-pro-max/production.db",
        "--allowlist",
        "tester1@example.test,tester2@example.test,tester3@example.test,tester4@example.test,tester5@example.test",
        "--monitoring-provider",
        "custom",
        "--monitoring-endpoint",
        "https://monitoring.tradingpromax.invalid/tpm",
      ],
      {
        cwd: process.cwd(),
        env: validatorEnv() as NodeJS.ProcessEnv,
        encoding: "utf8",
      }
    );

    expect(setupResult.status).toBe(0);
    expect(fs.existsSync(envPath)).toBe(true);
    const envFile = fs.readFileSync(envPath, "utf8");
    const operatorKey = envFile.match(/^TPM_OPERATOR_KEY=(.+)$/m)?.[1] ?? "";
    const monitoringKey =
      envFile.match(/^TPM_OPS_EXTERNAL_MONITOR_KEY=(.+)$/m)?.[1] ?? "";
    expect(operatorKey.length).toBeGreaterThan(32);
    expect(monitoringKey.length).toBeGreaterThan(24);
    expect(setupResult.stdout).not.toContain(operatorKey);
    expect(setupResult.stdout).not.toContain(monitoringKey);
    expect(setupResult.stdout).toContain("secret_output=redacted");

    const validation = runProductionValidator({}, ["--env-file", envPath]);
    expect(validation.status).toBe(1);
    const validationPayload = JSON.parse(validation.stdout);
    expect(validationPayload.summary).toMatchObject({
      status: "blocked",
      envFileLoaded: true,
    });
    expect(validationPayload.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "secret_rotation_attestation", ok: false }),
        expect.objectContaining({ key: "rotated_secret_patterns", ok: false }),
      ])
    );
    expect(validation.stdout).not.toContain(operatorKey);
    expect(validation.stdout).not.toContain(monitoringKey);
  });

  test("generates ignored launch secrets without leaking values or faking rotation", () => {
    const outputPath = path.join("test-results", ".env.launch-secrets.local");
    fs.mkdirSync("test-results", { recursive: true });
    if (fs.existsSync(outputPath)) fs.rmSync(outputPath);

    const generateResult = spawnSync(
      process.execPath,
      [GENERATE_LAUNCH_SECRETS_SCRIPT, "--path", outputPath],
      {
        cwd: process.cwd(),
        env: validatorEnv() as NodeJS.ProcessEnv,
        encoding: "utf8",
      }
    );

    expect(generateResult.status).toBe(0);
    expect(generateResult.stdout).toContain("secret_output=redacted");
    expect(generateResult.stdout).toContain("rotation_confirmation=false");
    expect(fs.existsSync(outputPath)).toBe(true);

    const envFile = fs.readFileSync(outputPath, "utf8");
    const generatedOperatorKey =
      envFile.match(/^TPM_OPERATOR_KEY=(.+)$/m)?.[1] ?? "";
    const generatedDemoPassword =
      envFile.match(/^TPM_DEMO_PASSWORD=(.+)$/m)?.[1] ?? "";
    const generatedMonitoringKey =
      envFile.match(/^TPM_MONITORING_KEY=(.+)$/m)?.[1] ?? "";
    expect(generatedOperatorKey.length).toBeGreaterThan(32);
    expect(generatedDemoPassword.length).toBeGreaterThan(16);
    expect(generatedMonitoringKey.length).toBeGreaterThan(24);
    expect(generateResult.stdout).not.toContain(generatedOperatorKey);
    expect(generateResult.stdout).not.toContain(generatedDemoPassword);
    expect(generateResult.stdout).not.toContain(generatedMonitoringKey);
    expect(envFile).toContain("TPM_PRE_LAUNCH_SECRET_ROTATION_CONFIRMED=false");

    const validation = runProductionValidator({}, ["--env-file", outputPath]);
    expect(validation.status).toBe(1);
    expect(validation.stdout).not.toContain(generatedOperatorKey);
    expect(JSON.parse(validation.stdout).checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "secret_rotation_attestation", ok: false }),
      ])
    );

    fs.rmSync(outputPath, { force: true });
  });

  test("visibly renders the verified workstation and utility routes", async ({
    page,
  }) => {
    const routes = [
      {
        path: "/",
        expectedUrl: /\/$/,
        text: /Pro Max Trading|Plans at a glance|Product Truth/,
      },
      {
        path: "/en",
        expectedUrl: /\/en$/,
        text: /Pro Max Trading|Execution Panel|Decision/,
      },
      {
        path: "/en/settings",
        expectedUrl: /\/en\/settings$/,
        text: /Settings|Account|Plan|Assistant|Product/,
      },
      {
        path: "/settings",
        expectedUrl: /\/settings$/,
        text: /Settings|Account|Plan|Assistant|Product/,
      },
      {
        path: "/diagnostics",
        expectedUrl: /\/diagnostics$/,
        text: /Diagnostics|System readiness|Product readiness|Safety/,
      },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page).toHaveURL(route.expectedUrl);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(page.locator(".tpm-brand-mark").first()).toBeVisible();
      await expect(page.locator(".tpm-brand-wordmark").first()).toContainText(
        "Pro Max"
      );
      await expect(page.locator(".tpm-brand-mark svg").first()).toBeVisible();
      await expect(page.locator(".tpm-brand-mark img")).toHaveCount(0);
      const compactNavMark = page.locator(".tpm-foundation-nav-brand .tpm-earth-mark-compact").first();
      await expect(compactNavMark).toBeVisible();
      await expect(compactNavMark).toHaveAttribute("data-variant", "compact");
      if (route.path === "/en") {
        await expect(page.locator(".tpm-precision-clock")).toHaveCount(1);
        await expect(page.locator(".tpm-platform-pulse")).toHaveCount(1);
      } else {
        await expect(page.locator(".tpm-precision-clock")).toHaveCount(0);
        await expect(page.locator(".tpm-platform-pulse")).toHaveCount(0);
      }
      await expect(page.locator(".tpm-companion-launcher").first()).toBeVisible();
      await expect(page.locator("body")).toContainText(route.text);
      await expectRuntimeCssApplied(
        page,
        route.path === "/" ? "entry" : route.path === "/en" ? "workstation" : "utility"
      );
      const publicNavText = (
        await page.locator(".tpm-foundation-nav a").allTextContents()
      ).join(" ");
      expect(publicNavText).not.toMatch(/Founder Command|Command Room/);
      const publicBodyText = await page.locator("body").innerText();
      expect(publicBodyText).not.toMatch(
        /Cosmic Operating Physics|Gravity Priority|Orbit Path|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Task Passport|Codex License/i
      );
      expect(publicBodyText).not.toMatch(
        /Alkon|الكون|Founder Command|Founder King|Kingdom|\bministries\b|\bcouncils\b|Presidency|government model|Planet OS|Planet governance|\bPlanet\b|\bEnterprise\b|Owner command|Owner-only|owner-only|private command|internal governance|ruler|construction queue|Codex task|secrets authority|treasury controls|security sovereignty|product memory internals|local operations|local universe|TPM Companion|Demo \/ Paper/i
      );

      if (route.path === "/") {
        const publicNavText = await page.locator(".tpm-foundation-nav-shell").innerText();
        expect(publicNavText).toMatch(
          /Home|Trading Workspace|Markets|Plans|Apps \/ Platforms|Support|Sign in/
        );
        expect(publicNavText).not.toMatch(/Academy|Community|Settings|Diagnostics|Language|Theme|Adaptive Atmosphere|Paper-safe|Web current|Live inactive/);
        await expect(page.locator(".tpm-product-entry").first()).toBeVisible();
        await expect(page.locator(".tpm-product-hero").first()).toBeVisible();
        await expect(page.locator(".tpm-product-workstation-shell")).toHaveCount(0);
        await expect(page.locator(".tpm-product-cta-primary").first()).toHaveAttribute(
          "href",
          "/trading"
        );
        const heroMark = page.locator(".tpm-product-hero-logo .tpm-earth-mark-public").first();
        await expect(heroMark).toBeVisible();
        await expect(heroMark).toHaveAttribute("data-variant", "public");
        await expect(heroMark).toHaveAttribute("data-state", "paper_safe");
        await expect(heroMark).toHaveAttribute("data-animated", "true");
        const heroMarkBox = await heroMark.boundingBox();
        expect(heroMarkBox?.width ?? 0).toBeGreaterThan(48);
        expect(heroMarkBox?.width ?? 0).toBeLessThanOrEqual(120);
        expect(heroMarkBox?.height ?? 0).toBeLessThanOrEqual(120);
        const heroMarkDetailCount = await heroMark.locator("circle, ellipse, path").count();
        expect(heroMarkDetailCount).toBeGreaterThanOrEqual(10);
        await expect(heroMark.locator("image, img")).toHaveCount(0);
        await expect(page.locator(".tpm-product-entry .tpm-earth-mark-command")).toHaveCount(0);
        const heroMarkContracts = await heroMark.evaluate((element) => ({
          hasBEMVariant: element.classList.contains("tpm-earth-mark--public"),
          hasStateClass: element.classList.contains("tpm-earth-mark--paper-safe"),
          hasPulse: Boolean(element.querySelector(".tpm-earth-pulse")),
          hasNoExtraOrbitSegments: !element.querySelector(".tpm-earth-orbit-segment"),
          hasNoMarketMiniLayer: !element.querySelector(".tpm-earth-market-move"),
          hasMoonOrbit: Boolean(element.querySelector(".tpm-earth-moon-orbit")),
          hasMoon: Boolean(element.querySelector(".tpm-earth-moon")),
          hasLiteralContinent: Boolean(element.querySelector(".tpm-earth-continent")),
          hasContinentEdges: Boolean(element.querySelector(".tpm-earth-continent-edge")),
          hasGoldMapEdge: Boolean(element.querySelector(".tpm-earth-map-edge")),
          hasPrimaryGoldMapEdge: Boolean(
            element.querySelector(".tpm-earth-map-edge-primary")
          ),
        }));
        expect(heroMarkContracts).toMatchObject({
          hasBEMVariant: true,
          hasStateClass: true,
          hasPulse: true,
          hasNoExtraOrbitSegments: true,
          hasNoMarketMiniLayer: true,
          hasMoonOrbit: true,
          hasMoon: true,
          hasLiteralContinent: true,
          hasContinentEdges: true,
          hasGoldMapEdge: true,
          hasPrimaryGoldMapEdge: true,
        });
        const heroMarkBackground = await heroMark.evaluate((element) =>
          window.getComputedStyle(element).backgroundColor
        );
        expect(heroMarkBackground).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
        await expect(page.locator("body")).toContainText(
          /Paper-safe|Web available|Live inactive/
        );
        await expect(page.locator(".tpm-product-hero-logo .tpm-brand-subline")).toHaveCount(0);
        await expect(page.locator("body")).not.toContainText(/Celestial Swiss/i);
        await expect(page.locator("body")).not.toContainText(/CELESTIAL SWISS TRADING IDENTITY/i);
        await expect(page.locator("body")).toContainText(
          /Plans at a glance|Free|Pro|VIP|Institutional|Familiar paper-safe workspace/
        );
        await expect(page.locator("body")).toContainText(
          /Product navigation|Markets|Apps \/ Platforms|Academy|Community|Support/
        );
        await expect(page.locator("#markets")).toContainText(
          /Forex|Crypto|Commodities|Indices|Stocks|Paper-safe/
        );
        await expect(page.locator("#apps-platforms")).toContainText(
          /Web App|Current|Desktop App|Planned|Mobile App|Tablet|Future/
        );
        await expect(page.locator("#support")).toContainText(
          /Help Center|Contact Support|Report a Problem|Security Contact|Partnership Contact/
        );
        await expect(page.locator("#community")).toContainText(
          /Learning|Feedback|Pro community|VIP rooms|No fake members|active rooms|signal rooms/
        );
        await expect(page.locator("body")).toContainText(
          /Pro Max Assistant|Journal\/Coach|Paper-safe|Why Blocked/
        );
        await expect(page.locator("body")).toContainText(
          /real-money routing|broker\/feed activation|billing/
        );
      }

      if (route.path === "/en") {
        if (route.path === "/en") {
          const topbarMark = page
            .locator(".tpmv2-topbar-brand .tpm-earth-mark-compact")
            .first();
          await expect(topbarMark).toBeVisible();
          await expect(topbarMark).toHaveAttribute("data-variant", "compact");
          await expect(topbarMark).toHaveAttribute("data-animated", "false");
          await expect(topbarMark.locator(".tpm-earth-moon")).toHaveCount(1);
        }
        await expect(page.locator(".tpm-workspace-market-summary").first()).toBeVisible();
        await expect(page.locator(".tpmv2-brain-deck")).toHaveCount(0);
        await expect(page.locator(".tpm-workspace-truth-row").first()).toBeVisible();
        await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
        const depthPanelOpacity = await page.locator(".tpmv2-chart-depth-panel").first().evaluate(
          (element) => Number.parseFloat(window.getComputedStyle(element).opacity)
        );
        expect(depthPanelOpacity).toBeLessThan(0.2);
        await expect(page.locator(".tpmv2-execution").first()).toBeVisible();
        await expect(page.locator(".tpmv2-ticket-preflight").first()).toBeVisible();
        await expect(page.locator(".tpm-workspace-activity-shelf").first()).toBeVisible();
        await expect(page.locator(".tpmv2-execution .tpm-why-blocked-hint").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /Pro Max Assistant|Execution Panel|Paper-safe controls|Market depth/
        );
        await expect(page.locator("body")).toContainText(
          /Workspace focus|Journal \/ Coach|Chart focus|Market depth/
        );
        await expect(page.locator("body")).toContainText(
          /Paper access|Fallback-bound|Interpretive only|Live inactive/
        );
        await expect(page.locator("body")).toContainText("Fallback-bound");
        await expect(page.locator("body")).toContainText("Interpretive only");
        await expect(page.locator("body")).toContainText("Live inactive");
        if (route.path === "/en") {
          await page.locator(".tpm-companion-launcher").first().click();
          await expect(page.locator(".tpm-companion-panel").first()).toBeVisible();
          await expect(page.locator(".tpm-companion-panel").first()).toContainText(
            /Free Assistant|paper-safe guidance|Real money blocked/
          );
          await expect(page.locator(".tpm-companion-panel").first()).toContainText(
            /Ask safely|execute trade|enable live/
          );
          await page.getByLabel("Ask Pro Max Assistant").fill("enable live and real money");
          await page.getByRole("button", { name: "Send" }).click();
          await expect(page.locator(".tpm-companion-panel").first()).toContainText(
            /I cannot do that|remain blocked/
          );
          await expect(page.locator(".tpm-companion-panel").first()).not.toContainText(
            /guaranteed profit|win-rate/i
          );
          const companionLayout = await page.evaluate(() => {
            const companion = document
              .querySelector(".tpm-companion-panel")
              ?.getBoundingClientRect();
            const execution = document
              .querySelector(".tpmv2-execution")
              ?.getBoundingClientRect();
            const chart = document
              .querySelector(".tpmv2-chart-surface")
              ?.getBoundingClientRect();

            const overlaps = (
              first: DOMRect | undefined,
              second: DOMRect | undefined
            ) =>
              Boolean(
                first &&
                  second &&
                  first.left < second.right &&
                  first.right > second.left &&
                  first.top < second.bottom &&
                  first.bottom > second.top
              );

            return {
              companionOverlapsExecution: overlaps(companion, execution),
              chartWidth: chart?.width ?? 0,
              chartHeight: chart?.height ?? 0,
            };
          });
          expect(companionLayout.companionOverlapsExecution).toBe(false);
          const workspaceCss = fs.readFileSync(
            path.join(process.cwd(), "app/theme-localization.css"),
            "utf8"
          );
          expect(workspaceCss).toContain(
            "grid-template-columns: minmax(0, 1fr) minmax(310px, 354px)"
          );
          expect(workspaceCss).toContain(
            "min-height: clamp(580px, calc(100svh - 252px), 900px)"
          );
          await page.getByRole("button", { name: "Close Pro Max Assistant" }).click();
        }
        const emptyStateNotice = page.locator(".tpm-state-notice[data-state='empty']").first();
        if (!(await emptyStateNotice.isVisible().catch(() => false))) {
          await page.locator(".tpm-workspace-activity-panel").first().evaluate((element) => {
            if (element instanceof HTMLDetailsElement) {
              element.open = true;
            }
          });
        }
        await expect(emptyStateNotice).toBeVisible();

        await expect(page.locator(".tpm-living-chart-surface").first()).toBeVisible();
        const executionBox = await page
          .locator(".tpmv2-execution")
          .first()
          .boundingBox();

        expect(executionBox?.width ?? 0).toBeGreaterThan(240);
      }

      if (
        route.path === "/en/settings" ||
        route.path === "/settings" ||
        route.path === "/diagnostics"
      ) {
        await expect(page.locator(".tpm-utility-page").first()).toBeVisible();
        await expect(page.locator(".tpm-foundation-card").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /Workspace depth and interaction layer|Workstation depth and shortcut truth|Plan capability truth/
        );
        await expect(page.locator("body")).toContainText(
          /Commercial trust and public product state|Account and commercial readiness|Product access/
        );
        await expect(page.locator("body")).toContainText(
          /Product trust ledger|Commercial packaging readiness|No billing system active|Broker integration/
        );
        await expect(page.locator("body")).toContainText(
          /Pro Max Assistant|Free Assistant|Pro, VIP, and Institutional assistants remain locked/
        );
        await expect(page.locator("body")).toContainText(
          /Plan capability truth|Paper-session guidance|No financial advice/
        );
        await expect(page.locator("body")).toContainText(
          /Current plan|Plan capability truth|Familiar paper trading layer|Free|Pro|VIP|Institutional/
        );
        if (route.path === "/en/settings" || route.path === "/settings") {
          await expect(page.locator(".tpm-plan-experience-card")).toHaveCount(4);
          await expect(page.locator(".tpm-plan-experience-card").first()).toContainText(
            /Familiar premium paper platform|Billing: inactive|Paid access: not_enabled/
          );
          const planCardText = (
            await page.locator(".tpm-plan-experience-card").allTextContents()
          ).join(" ");
          expect(planCardText).not.toMatch(/Founder Command|Enterprise/);
        }
        if (route.path === "/diagnostics") {
          await expect(page.locator("body")).toContainText(
            /Product readiness|Product readiness model|Core engines/
          );
          await expect(page.locator("body")).toContainText(
            /Why blocked readiness|Session coach foundation|Journal \/ Coach/
          );
          await expect(page.locator("body")).toContainText(
            /Safety integration readiness|Assistant context|Automation boundary/
          );
          await expect(page.locator("body")).toContainText(
            /Service readiness chain|Public\/private surface readiness|Safe note readiness/
          );
        }
      }
    }
  });

  test("enforces dual-world public, private, and invisible layer boundaries", async ({
    page,
    request,
  }) => {
    const requiredDocs = [
      "docs/product/tpm-dual-world-operating-civilization.md",
      "docs/product/public-user-world.md",
      "docs/product/private-founder-command-world.md",
      "docs/product/invisible-operating-layer.md",
      "docs/product/public-private-surface-boundaries.md",
      "docs/product/invisible-layer-output-mapping.md",
      "docs/product/public-product-navigation.md",
      "docs/product/tpm-assistant-boundaries.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath))).toBe(true);
    }

    const boundaryTypes = fs.readFileSync(
      path.join(process.cwd(), "lib/server/surface-boundaries/types.ts"),
      "utf8"
    );
    const boundaryState = fs.readFileSync(
      path.join(process.cwd(), "lib/server/surface-boundaries/state.ts"),
      "utf8"
    );
    const outputMapper = fs.readFileSync(
      path.join(process.cwd(), "lib/server/surface-boundaries/output-mapper.ts"),
      "utf8"
    );

    expect(boundaryTypes).toContain("public_user");
    expect(boundaryTypes).toContain("private_founder");
    expect(boundaryTypes).toContain("invisible_operating_layer");
    expect(boundaryState).toContain("public_entry");
    expect(boundaryState).toContain("founder_command");
    expect(boundaryState).toContain("construction_queue");
    expect(outputMapper).toContain("Live execution is not active.");
    expect(outputMapper).toContain("Billing is not active.");
    expect(outputMapper).toContain("VIP is planned.");

    await page.goto("/");
    const navText = await page.locator(".tpm-foundation-nav-shell").innerText();
    for (const label of [
      "Home",
      "Trading Workspace",
      "Markets",
      "Plans",
      "Apps / Platforms",
      "Support",
      "Sign in",
    ]) {
      expect(navText).toContain(label);
    }
    expect(navText).not.toMatch(/Academy|Community|Settings|Diagnostics|Language|Theme|Adaptive Atmosphere|Paper-safe|Web current|Live inactive/);
    const bodyText = await page.locator("body").innerText();
    for (const label of ["Community", "Settings", "Diagnostics"]) {
      expect(bodyText).toContain(label);
    }

    await expect(page.locator("#markets")).toContainText(/Forex|Crypto|Commodities|Indices|Stocks/);
    await expect(page.locator("#apps-platforms")).toContainText(/Web App|Desktop App|Mobile App|Tablet/);
    await expect(page.locator("#apps-platforms")).not.toContainText(/Download Windows|Download Android|App Store|Play Store/);
    await expect(page.locator("#academy")).toContainText(/Getting started|paper trading basics|Why Blocked|Pro Max Assistant/i);
    await expect(page.locator("#community")).toContainText(/Learning|Feedback|Pro community|VIP rooms|No fake members/i);
    await expect(page.locator("#support")).toContainText(/Help Center|Security Contact|Partnership Contact/);

    const forbiddenPublicTerms =
      /Alkon|الكون|Founder Command|Founder King|Kingdom|\bministries\b|\bcouncils\b|Presidency|government model|Planet OS|Planet governance|\bPlanet\b|\bEnterprise\b|Owner command|Owner-only|owner-only|private command|internal governance|ruler|construction queue|Codex task|secrets authority|treasury controls|security sovereignty|product memory internals|local operations|local universe/i;

    expect(await page.locator("body").innerText()).not.toMatch(forbiddenPublicTerms);
    expect(await page.locator("body").innerText()).not.toMatch(
      /Cosmic Operating Physics|Gravity Priority|Orbit Path|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Task Passport|Codex License/i
    );

    await page.goto("/settings");
    expect(await page.locator("body").innerText()).not.toMatch(forbiddenPublicTerms);
    expect(await page.locator("body").innerText()).not.toMatch(
      /Cosmic Operating Physics|Gravity Priority|Orbit Path|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Task Passport|Codex License/i
    );
    await expect(page.locator("body")).toContainText(/Account session|Theme and interface|Plan capability truth|Paper-session guidance/);

    await page.goto("/diagnostics");
    expect(await page.locator("body").innerText()).not.toMatch(forbiddenPublicTerms);
    expect(await page.locator("body").innerText()).not.toMatch(
      /Cosmic Operating Physics|Gravity Priority|Orbit Path|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Task Passport|Codex License/i
    );
    await expect(page.locator("body")).toContainText(/System readiness|Assistant readiness|Service readiness chain|Product trust ledger/);

    const companionContext = await (await request.get("/api/companion/context")).json();
    expect(JSON.stringify(companionContext.samples)).not.toMatch(forbiddenPublicTerms);
    expect(JSON.stringify(companionContext.samples)).not.toMatch(
      /Cosmic Operating Physics|Gravity Priority|Orbit Path|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Task Passport|Codex License/i
    );

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "surface_boundaries",
          status: "ready",
        }),
      ])
    );
  });

  test("protects the living identity OS contracts", () => {
    const css = fs.readFileSync("app/theme-localization.css", "utf8");
    expect(css).toContain(".tpm-earth-mark--public");
    expect(css).toContain(".tpm-earth-mark--paper-safe");
    expect(css).toContain(".tpm-earth-mark--command");
    expect(css).toContain(".tpm-earth-mark--motion-none");
    expect(css).toContain(".tpm-earth-mark--motion-command");
    expect(css).toContain(".tpm-earth-mark--surface-workstation");
    expect(css).toContain(".tpm-earth-moon-orbit");
    expect(css).toContain(".tpm-earth-moon-carrier");
    expect(css).toContain(".tpm-earth-map-edge");
    expect(css).toContain(".tpm-earth-continent");
    expect(css).toContain(".tpm-earth-ocean-rim");
    expect(css).toContain("tpm-earth-moon-orbit");
    expect(css).toContain("tpm-earth-gold-edge-shimmer");
    expect(css).toContain("tpm-earth-orbit-breathe");
    expect(css).toContain("tpm-earth-point-pulse");
    expect(css).toContain("prefers-reduced-motion: reduce");

    const earthMarkSource = fs.readFileSync(
      "modules/brand/components/TPMEarthMark.tsx",
      "utf8"
    );
    expect(earthMarkSource).toContain("tpm-earth-moon-orbit");
    expect(earthMarkSource).toContain("tpm-earth-moon");
    expect(earthMarkSource).toContain("tpm-earth-map-edge");
    expect(earthMarkSource).toContain("tpm-earth-map-edge-primary");
    expect(earthMarkSource).toContain("tpm-earth-continent-americas");
    expect(earthMarkSource).toContain("tpm-earth-continent-europe-africa");
    expect(earthMarkSource).toContain("tpm-earth-continent-asia");
    expect(earthMarkSource).toContain("radialGradient");
    expect(earthMarkSource).toContain("clipPath");
    expect(earthMarkSource).toContain("Pro Max Earth Mark");
    expect(earthMarkSource).not.toContain("Celestial Swiss Trading Identity");
    expect(earthMarkSource).not.toMatch(/<image|<img|\\.png|\\.jpg|\\.gif/i);

    const productLogoSource = fs.readFileSync(
      "modules/brand/components/ProductLogo.tsx",
      "utf8"
    );
    expect(productLogoSource).toContain("Pro Max Earth Mark");
    expect(productLogoSource).not.toContain("Celestial Swiss Trading Identity");
    expect(productLogoSource).not.toContain("Trading Pro Max Celestial Swiss Earth Mark");

    const appIconSource = fs.readFileSync("app/icon.svg", "utf8");
    expect(appIconSource).toContain("Pro Max Earth Mark");
    expect(appIconSource).toContain("rx=\"28.9\"");
    expect(appIconSource).toContain("stroke=\"#f4d37a\"");
    expect(appIconSource).toContain("url(#tpm-icon-ocean)");
    expect(appIconSource).not.toMatch(/<rect/i);
    expect(appIconSource).not.toMatch(/<image|<img|\\.png|\\.jpg|\\.gif/i);

    const identityDocs = [
      "docs/product/living-earth-mark.md",
      "docs/product/brand-identity.md",
      "docs/product/tpm-living-identity-os.md",
      "docs/product/swiss-precision-identity.md",
      "docs/product/living-platform-signals.md",
      "docs/product/plan-visual-identity.md",
      "docs/product/state-visual-language.md",
      "docs/product/brand-voice-constitution.md",
      "docs/product/identity-governance.md",
      "docs/product/founder-command-visual-direction.md",
      "docs/product/ministry-visual-identity-platform-design.md",
      "docs/product/platform-design-system.md",
      "docs/product/swiss-precision-motion-law.md",
      "docs/product/tpm-living-brand-intelligence.md",
      "docs/product/brand-genome.md",
      "docs/product/identity-guardian.md",
      "docs/product/identity-memory.md",
      "docs/product/identity-evolution-system.md",
      "docs/product/identity-surface-simulation.md",
      "docs/product/occasion-identity-system.md",
    ];

    for (const docPath of identityDocs) {
      expect(fs.existsSync(docPath)).toBe(true);
    }

    const livingMarkDoc = fs.readFileSync("docs/product/living-earth-mark.md", "utf8");
    expect(livingMarkDoc).toContain("SVG-only");
    expect(livingMarkDoc).toContain("Celestial Swiss Earth Mark");
    expect(livingMarkDoc).toContain("gold coast/edge strokes");
    expect(livingMarkDoc).toContain("moon orbiting Earth");
    expect(livingMarkDoc).toContain("prefers-reduced-motion");
    expect(livingMarkDoc).toContain("ready");
    expect(livingMarkDoc).toContain("paper_safe");
    expect(livingMarkDoc).toContain("review_required");
    expect(livingMarkDoc.toLowerCase()).toContain("no raster");

    const identityOs = fs.readFileSync("docs/product/tpm-living-identity-os.md", "utf8");
    expect(identityOs).toContain("Free");
    expect(identityOs).toContain("Pro");
    expect(identityOs).toContain("VIP");
    expect(identityOs).toContain("Institutional");
    expect(identityOs).toContain("Founder terms internal only");
    expect(identityOs).toContain("guaranteed profit");
    expect(identityOs).toContain("fake win-rate");

    const visualMinistryDoc = fs.readFileSync(
      "docs/product/ministry-visual-identity-platform-design.md",
      "utf8"
    );
    expect(visualMinistryDoc).toContain("Design System Authority");
    expect(visualMinistryDoc).toContain("Plan Style Authority");
    expect(visualMinistryDoc).toContain("Platform Experience Authority");
    expect(visualMinistryDoc).toContain("Motion & State Authority");
    expect(visualMinistryDoc).toContain("Visual Quality Authority");
    expect(visualMinistryDoc).toContain("Free");
    expect(visualMinistryDoc).toContain("Pro");
    expect(visualMinistryDoc).toContain("VIP");
    expect(visualMinistryDoc).toContain("Institutional");
    expect(visualMinistryDoc).toContain("Founder Command is not a user plan");

    const brandIntelligenceDoc = fs.readFileSync(
      "docs/product/tpm-living-brand-intelligence.md",
      "utf8"
    );
    expect(brandIntelligenceDoc).toContain("surface");
    expect(brandIntelligenceDoc).toContain("motion preference");
    expect(brandIntelligenceDoc).toContain("SVG/code identity only");
    expect(brandIntelligenceDoc).toContain("No raster image dependency");
    expect(brandIntelligenceDoc).toContain("Free");
    expect(brandIntelligenceDoc).toContain("Pro");
    expect(brandIntelligenceDoc).toContain("VIP");
    expect(brandIntelligenceDoc).toContain("Institutional");
  });

  test("renders global theme modes, disabled language controls, and RTL/LTR surfaces", async ({
    page,
  }) => {
    test.setTimeout(240000);
    fs.mkdirSync(THEME_ARTIFACT_DIR, { recursive: true });

    await openWithTheme(page, "/", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".tpm-foundation-nav-shell .tpm-theme-switcher")).toHaveCount(0);
    await expect(page.locator(".tpm-foundation-nav-shell .tpm-locale-select")).toHaveCount(0);
    await expect(page.locator(".tpm-foundation-nav-shell .tpm-environment-control")).toHaveCount(0);
    await expect(page.locator("body")).toContainText(/Pro Max Trading|Trading Workspace/);
    await expectRuntimeCssApplied(page, "entry");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "public-entry-dark.png"),
    });

    await openWithTheme(page, "/", "light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectRuntimeCssApplied(page, "entry");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "public-entry-light.png"),
    });

    await openWithTheme(page, "/en", "dark");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "ltr");
    const darkChartSurface = page.locator(".tpmv2-chart-surface").first();
    await expect(darkChartSurface).toBeVisible();
    await expectRuntimeCssApplied(page, "workstation");
    const darkChartVisual = await darkChartSurface.evaluate((element) => {
      const surfaceStyle = window.getComputedStyle(element);
      const candle = element.querySelector(".tpmv2-candle");
      const candleStyle = candle ? window.getComputedStyle(candle) : null;
      const plot = element.querySelector(".tpmv2-chart-plot");
      const priceScale = element.querySelector(".tpmv2-chart-price-scale");

      return {
        backgroundImage: surfaceStyle.backgroundImage,
        candleHeight: candle ? candle.getBoundingClientRect().height : 0,
        candleWidth: candleStyle ? Number.parseFloat(candleStyle.width) : 0,
        plotDirection: plot ? window.getComputedStyle(plot).direction : "",
        priceScaleDirection: priceScale
          ? window.getComputedStyle(priceScale).direction
          : "",
      };
    });
    expect(darkChartVisual.backgroundImage).toContain("linear-gradient");
    expect(darkChartVisual.candleHeight).toBeGreaterThanOrEqual(14);
    expect(darkChartVisual.candleWidth).toBeGreaterThanOrEqual(2);
    expect(darkChartVisual.plotDirection).toBe("ltr");
    expect(darkChartVisual.priceScaleDirection).toBe("ltr");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "workstation-dark.png"),
    });
    await page.locator(".tpmv2-execution").first().screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "execution-panel.png"),
    });
    await page.locator(".tpm-companion-launcher").first().click();
    await expect(page.locator(".tpm-companion-panel").first()).toBeVisible();
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "assistant-open.png"),
    });
    await page.getByRole("button", { name: "Close Pro Max Assistant" }).click();
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "5", shiftKey: true }));
    });
    await expect(page.locator(".tpmv2-desktop-master").first()).toHaveClass(/focus-chart/);
    await darkChartSurface.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "chart-focus.png"),
    });
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "4", shiftKey: true }));
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "english-ltr-workstation.png"),
    });
    await page.setViewportSize({ width: 1920, height: 1080 });
    await openWithTheme(page, "/en", "dark");
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "workstation-ultrawide.png"),
    });
    await page.setViewportSize({ width: 1280, height: 720 });

    await openWithTheme(page, "/en", "light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const lightChartSurface = page.locator(".tpmv2-chart-surface").first();
    await expect(page.locator(".tpmv2-execution").first()).toBeVisible();
    await expect(lightChartSurface).toBeVisible();
    await expectRuntimeCssApplied(page, "workstation");
    const lightChartVisual = await lightChartSurface.evaluate((element) => {
      const surfaceStyle = window.getComputedStyle(element);
      const priceScale = element.querySelector(".tpmv2-chart-price-scale");

      return {
        backgroundImage: surfaceStyle.backgroundImage,
        priceScaleDirection: priceScale
          ? window.getComputedStyle(priceScale).direction
          : "",
      };
    });
    expect(lightChartVisual.backgroundImage).toContain("linear-gradient");
    expect(lightChartVisual.priceScaleDirection).toBe("ltr");
    await page.locator(".tpmv2-execution .tpmv2-real-input").first().fill("0");
    await expect(page.locator("body")).toContainText("Paper amount needs review");
    await page.locator(".tpm-ticket-amount-state").first().screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "invalid-input-state.png"),
    });
    await page.locator(".tpmv2-execution .tpmv2-real-input").first().fill("100");
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "5", shiftKey: true }));
    });
    await expect(page.locator(".tpmv2-desktop-master").first()).toHaveClass(/focus-chart/);
    await lightChartSurface.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "chart-focus-light.png"),
    });
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "4", shiftKey: true }));
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "workstation-light.png"),
    });

    await openWithTheme(page, "/ar", "dark");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expectRuntimeCssApplied(page, "workstation");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "arabic-rtl-workstation.png"),
    });

    await openWithTheme(page, "/en/settings", "light");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("lang", "en");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("body")).toContainText("Settings");
    await expect(page.locator(".tpm-utility-page-settings .tpm-theme-switcher")).toHaveCount(1);
    await expect(page.locator(".tpm-utility-page-settings .tpm-locale-select")).toHaveCount(0);
    await expect(page.locator(".tpm-language-disabled-note")).toContainText(
      /English only for now|Language switching is being rebuilt/
    );
    await expect(page.locator(".tpm-utility-page-settings .tpm-environment-control")).toHaveCount(1);
    await expectRuntimeCssApplied(page, "utility");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "settings.png"),
    });
    await page.locator(".tpm-plan-experience-grid").first().screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "plan-surfaces.png"),
    });
    await page.locator(".tpm-auth-panel-inline").first().screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "login-session-ui.png"),
    });

    await openWithTheme(page, "/de/settings", "light");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("lang", "de");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("body")).toContainText(
      "Language switching is being rebuilt"
    );
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "language-switching-disabled.png"),
    });

    await openWithTheme(page, "/ar/settings", "dark");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("main").first()).toBeVisible();

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator("body")).toContainText("Public language");
    await expect(page.locator("body")).toContainText("Language switching is disabled");
    await expect(page.locator("body")).toContainText("Feedback and recovery state");
    await expectRuntimeCssApplied(page, "utility");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "diagnostics.png"),
    });

    await openWithTheme(page, "/ar/diagnostics", "dark");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("main").first()).toBeVisible();

    await openWithTheme(page, "/en", "dark");
    const emptyStateNotice = page.locator(".tpm-state-notice[data-state='empty']").first();
    if (!(await emptyStateNotice.isVisible().catch(() => false))) {
      await page.locator(".tpm-workspace-activity-panel").first().evaluate((element) => {
        if (element instanceof HTMLDetailsElement) {
          element.open = true;
        }
      });
    }
    await emptyStateNotice.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "empty-state.png"),
    });
    await page.locator(".tpm-workspace-truth-row").first().screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "feedback-ui.png"),
    });

    await page.emulateMedia({ colorScheme: "light" });
    await openWithTheme(page, "/en", "system");
    await expect(page.locator("html")).toHaveAttribute("data-theme-mode", "system");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.emulateMedia({ colorScheme: "dark" });
  });

  test("keeps unauthenticated preferences on local fallback storage", async ({
    page,
    request,
  }) => {
    const unauthenticatedPreferences = await request.get(
      "/api/account/preferences"
    );
    expect(unauthenticatedPreferences.status()).toBe(401);

    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();
    await page.waitForFunction(
      (key) => Boolean(window.localStorage.getItem(key)),
      STORAGE_KEY
    );

    const storedState = await page.evaluate((key) => {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }, STORAGE_KEY);

    expect(storedState?.accountMode).toBe("demo");
    expect(storedState?.workspacePreferences?.ticketVisible).toBe(true);
    expect(storedState?.workspacePreferences?.chartType).toBe("candlestick");
  });

  test("provides visible login, session, and logout UI", async ({ page }) => {
    fs.mkdirSync(THEME_ARTIFACT_DIR, { recursive: true });

    await page.goto("/en/settings");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(
      /Login and account session|Protected account access|Sign in/
    );

    const protectedBeforeLogin = await page.request.get("/api/launch/operations");
    expect(protectedBeforeLogin.status()).toBe(401);

    const screenshotAuthPanel = async (fileName: string) => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const panel = page.locator(".tpm-auth-panel-inline").first();
          await expect(panel).toBeVisible();
          await panel.screenshot({
            path: path.join(THEME_ARTIFACT_DIR, fileName),
          });
          return;
        } catch (error) {
          if (attempt === 2) throw error;
          await page.waitForTimeout(250);
        }
      }
    };

    await screenshotAuthPanel("login-state.png");
    const authPanel = page.locator(".tpm-auth-panel-inline").first();
    const emailField = authPanel.locator('input[name="email"]');
    const passwordField = authPanel.locator('input[name="password"]');

    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (await emailField.isVisible().catch(() => false)) {
        break;
      }

      await page.reload();
      await expect(authPanel).toBeVisible();
      await page.waitForTimeout(250);
    }

    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await emailField.fill(DEMO_EMAIL);
    await passwordField.fill(DEMO_PASSWORD);
    await authPanel.getByRole("button", { name: "Sign in" }).click();

    await expect(authPanel).toContainText("Signed in");
    await expect(authPanel).toContainText(DEMO_EMAIL);
    await screenshotAuthPanel("session-state.png");

    const protectedAfterLogin = await page.request.get("/api/launch/operations");
    expect(protectedAfterLogin.status()).toBe(200);

    await authPanel.getByRole("button", { name: "Sign out" }).click();
    await expect(authPanel).toContainText("Sign in");
    await screenshotAuthPanel("logout-state.png");

    const protectedAfterLogout = await page.request.get("/api/launch/operations");
    expect(protectedAfterLogout.status()).toBe(401);
  });

  test("persists authenticated workspace preferences through the backend", async ({
    request,
  }) => {
    const login = await request.post("/api/auth/login", {
      data: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });
    expect(login.status()).toBe(200);

    const preferences = {
      chartType: "bars",
      activeIndicators: ["EMA 20", "RSI", "VOL"],
      activeDrawingTool: "Level",
      chartZoom: 120,
      watchlistVisible: true,
      ticketVisible: true,
      blotterExpanded: true,
      timeframe: "5m",
      duration: "30s",
      selectedAssetSymbol: "BTC/USD",
    };

    const update = await request.post("/api/account/preferences", {
      data: { preferences },
    });
    expect(update.status()).toBe(200);
    const updatePayload = await update.json();
    expect(updatePayload.authenticated).toBe(true);
    expect(updatePayload.preferences).toMatchObject(preferences);

    const readBack = await request.get("/api/account/preferences");
    expect(readBack.status()).toBe(200);
    const readBackPayload = await readBack.json();
    expect(readBackPayload.preferences).toMatchObject(preferences);
  });

  test("keeps market feed fallback-first, normalized, and honestly labeled", async ({
    request,
  }) => {
    const valid = await request.get("/api/market?symbol=EUR/USD&timeframe=1m");
    expect(valid.status()).toBe(200);
    const validPayload = await valid.json();

    expect(validPayload.snapshot.feed).toMatchObject({
      adapter: "fallback_simulated",
      state: "fallback_ready",
      sourceLabel: "Fallback market adapter",
      externalFeedActive: false,
    });
    expect(typeof validPayload.snapshot.feed.readinessScore).toBe("number");
    expect(validPayload.snapshot.feed.readinessScore).toBeGreaterThanOrEqual(0);
    expect(validPayload.snapshot.feed.freshness).toMatchObject({
      chart: expect.stringMatching(/Fresh|Warm|Session Closed|Delayed|Stale|Pending/),
      health: expect.stringMatching(/Healthy|Stable|Delayed|Degraded|Session Closed/),
    });
    expect(validPayload.snapshot.assets[0].freshness).toMatch(
      /Fresh|Warm|Session Closed|Delayed|Stale|Pending/
    );
    expect(validPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "EUR/USD",
      normalizedTimeframe: "1m",
      symbolFallbackApplied: false,
      timeframeFallbackApplied: false,
    });

    const invalid = await request.get(
      "/api/market?symbol=not-a-market&timeframe=2h"
    );
    expect(invalid.status()).toBe(200);
    const invalidPayload = await invalid.json();
    const noticeCodes = invalidPayload.snapshot.feed.notices.map(
      (notice: { code: string }) => notice.code
    );

    expect(invalidPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "EUR/USD",
      normalizedTimeframe: "1m",
      symbolFallbackApplied: true,
      timeframeFallbackApplied: true,
    });
    expect(noticeCodes).toEqual(
      expect.arrayContaining([
        "fallback_adapter_active",
        "symbol_fallback_applied",
        "timeframe_fallback_applied",
      ])
    );

    const compact = await request.get("/api/market?symbol=btcusd&timeframe=5M");
    expect(compact.status()).toBe(200);
    const compactPayload = await compact.json();
    expect(compactPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "BTC/USD",
      normalizedTimeframe: "5m",
    });
  });

  test("shows truthful degraded intelligence when the market route falls back locally", async ({
    page,
  }) => {
    await page.route("**/api/market**", async (route) => {
      await route.abort();
    });

    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator(".tpmv2-brain-deck").first()).toBeHidden();
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Fallback-bound");
    await expect(page.locator("body")).toContainText("Interpretive only");
    await expect(page.locator("body")).toContainText("Live inactive");
  });

  test("reports diagnostics, readiness, auth-required routes, and connector truth", async ({
    request,
  }) => {
    const health = await request.get("/api/health");
    expect(health.status()).toBe(200);
    const healthPayload = await health.json();
    expect(healthPayload).toMatchObject({
      ok: true,
      status: "ready",
      paperSafe: true,
      liveExecution: "blocked",
    });
    expect(healthPayload.policyTruth).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      marketData: "fallback_first",
      brokerRouting: "blocked",
      externalFeed: "fallback_active",
    });
    expect(healthPayload.launchReadinessGate).toMatchObject({
      mode: "verification_gate",
      status: expect.stringMatching(/pass|fail/),
      score: expect.any(Number),
      failedChecklist: expect.any(Number),
      warnedDomains: expect.any(Number),
    });
    expect(healthPayload.marketParity).toMatchObject({
      mode: "final_market_parity_closure",
      status: expect.stringMatching(/closed|partially_closed/),
      score: expect.any(Number),
      guardedCapabilities: expect.any(Number),
      launchReadiness: expect.stringMatching(/pass|fail/),
    });
    expect(healthPayload.launchOperations).toMatchObject({
      mode: expect.stringMatching(
        /closed_beta_preparation|soft_launch_preparation|public_launch_preparation|closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
      ),
      status: expect.stringMatching(/in_progress|blocked/),
      supportRoute: "/api/launch/feedback",
      feedbackLoop: expect.stringMatching(
        /operational_guarded|triage_backlog_guarded/
      ),
      pendingTriage: expect.any(Number),
      highSeverityOpen: expect.any(Number),
      hardeningFollowUps: expect.any(Number),
      recoveryLinked: expect.any(Number),
      supportReadiness: expect.stringMatching(/operator_ready|operator_guarded/),
      rollbackReadiness: expect.stringMatching(/recoverable_guarded|guarded/),
      escalationState: expect.stringMatching(/normal|elevated/),
      publicLaunchGate: expect.stringMatching(/active_guarded|inactive_guarded/),
      publicLaunchDecision: expect.stringMatching(/ready_guarded|not_ready/),
      publicLaunchAuthority: "operator_manual_release_only",
      productionHardening: expect.stringMatching(/ready|guarded/),
      softLaunch: expect.stringMatching(/ready|guarded/),
      publicLaunch: expect.stringMatching(/ready|guarded/),
    });
    expect(healthPayload.truthSemantics).toMatchObject({
      blocked: expect.arrayContaining([
        "live_execution",
        "real_money_routing",
        "auto_trading",
      ]),
      fallback: expect.arrayContaining(["market_data_fallback_first"]),
      unconfigured: expect.arrayContaining([
        "notification_delivery_unconfigured",
        "billing_checkout_inactive",
      ]),
    });
    expect(Array.isArray(healthPayload.truthSemantics.degraded)).toBe(true);
    expect(healthPayload.architecture.marketFeed.policyMode).toBe("fallback_first");
    expect(typeof healthPayload.architecture.marketFeed.readinessScore).toBe("number");
    expect(typeof healthPayload.architecture.marketFeed.readinessStage).toBe("string");
    expect(typeof healthPayload.architecture.broker.readinessScore).toBe("number");
    expect(typeof healthPayload.architecture.broker.readinessStage).toBe("string");
    expect(healthPayload.architecture.activationPilot).toMatchObject({
      mode: "sandbox_guarded",
    });
    expect(
      ["inactive_unconfigured", "inactive_guarded", "pilot_requested_blocked", "pilot_guarded_ready"]
    ).toContain(healthPayload.architecture.activationPilot.state);
    expect(healthPayload.clientExpansion).toMatchObject({
      shared: {
        apiContract: "http_json_v1",
        executionSafety: "paper_only_live_blocked",
      },
      desktop: {
        state: "future_ready",
        foundation: {
          runtimeBridge: "ipc_json_v1",
          packaging: "contract_ready",
          sessionStrategy: "http_session_bridge",
        },
        productization: {
          releaseClaims: "no_public_store_release_claim",
        },
      },
      mobile: {
        state: "future_ready",
        foundation: {
          runtimeBridge: "bridge_json_v1",
          pushDelivery: "unconfigured",
          sessionStrategy: "session_or_token_bridge",
        },
        productization: {
          releaseClaims: "no_store_release_claim",
        },
      },
    });
    expect(healthPayload.clientExpansion.shared).toMatchObject({
      workspaceContinuity: "backend_workspace_depth_contract",
      preferenceContinuity: "hybrid_preference_contract",
      sessionContinuity: "guarded_cross_client",
      notificationTruth: "readiness_state_shared",
    });
    expect(healthPayload.clientExpansion.desktop.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(healthPayload.clientExpansion.mobile.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(healthPayload.productionDeployment).toMatchObject({
      status: expect.stringMatching(/ready|blocked/),
      score: expect.any(Number),
      stage: expect.stringMatching(
        /local_verified|production_requirements_visible|deployment_ready_guarded/
      ),
      blockers: expect.any(Array),
      warnings: expect.any(Array),
    });
    expect(healthPayload.productionDeployment.database).toMatchObject({
      providerTruth: expect.stringMatching(
        /missing|local_sqlite|persistent_sqlite|external_managed|unsupported/
      ),
      productionDatabaseRequired: true,
    });
    expect(healthPayload.productionDeployment.secrets).toMatchObject({
      operatorKeyStrength: expect.stringMatching(
        /missing|weak_or_default|configured_guarded/
      ),
      secretExposurePolicy: "presence_only",
    });
    expect(healthPayload.productionDeployment.closedBeta).toMatchObject({
      accessModel: "allowlist_only",
      allowlistConfigured: expect.any(Boolean),
    });
    expect(healthPayload.productionDeployment.monitoring).toMatchObject({
      state: expect.stringMatching(/configured_guarded|unconfigured/),
      secretExposurePolicy: "presence_only",
    });
    expect(healthPayload.clientExpansion.desktop.foundation.targets).toEqual(
      expect.arrayContaining(["windows", "macos", "linux"])
    );
    expect(healthPayload.clientExpansion.mobile.foundation.targets).toEqual(
      expect.arrayContaining(["android", "ios"])
    );
    expect(healthPayload.ops).toMatchObject({
      status: "ready",
    });
    expect(Array.isArray(healthPayload.subsystems)).toBe(true);
    expect(healthPayload.subsystems.length).toBeGreaterThanOrEqual(8);
    expect(healthPayload.connectors[0]).toMatchObject({
      paperCapability: "local_paper_only",
      realCapability: "blocked",
      liveExecution: "blocked",
    });
    expect(["unconfigured", "configured_blocked"]).toContain(
      healthPayload.connectors[0].state
    );

    const diagnostics = await request.get("/api/diagnostics/probes");
    expect(diagnostics.status()).toBe(200);
    const diagnosticsPayload = await diagnostics.json();
    expect(diagnosticsPayload.ok).toBe(true);
    expect(diagnosticsPayload.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "surface_boundaries",
          summary: expect.stringContaining("Public and private surfaces"),
        }),
      ])
    );

    const planetStatus = await request.get("/api/planet/status");
    expect(planetStatus.status()).toBe(200);
    const planetPayload = await planetStatus.json();
    expect(planetPayload.ok).toBe(true);
    expect(planetPayload.snapshot).toMatchObject({
      model: "tpm_planet_earth_os",
      founderCommand: {
        privateOwnerOnly: true,
        publicRouteExposed: false,
        desktopAppShipped: false,
        mobileAppShipped: false,
        reportDestination: "Founder Command Room",
      },
      safetyBoundaries: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        brokerFeedActivation: "blocked",
        billingActivation: "blocked",
        publicLaunchClaim: "blocked",
        socialPublishing: "blocked",
        secretExposure: "blocked",
      },
      truth: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
        publicLaunch: "not_claimed",
        socialPublishing: "inactive",
        secrets: "not_exposed",
      },
    });
    expect(planetPayload.snapshot.continents).toHaveLength(11);
    expect(planetPayload.snapshot.ministries).toHaveLength(40);
    expect(planetPayload.hierarchySummary).toMatchObject({
      hierarchyLevels: 17,
      continents: 12,
      ministries: 40,
      publicFounderRouteExposed: false,
      fakeMetricsIncluded: false,
      launchActivated: false,
      billingActivated: false,
      liveExecutionActivated: false,
      truth: {
        fakeUsers: false,
        fakeRevenue: false,
        fakeMetrics: false,
        productionActivation: false,
      },
    });
    expect(planetPayload.coordinationSummary).toMatchObject({
      workflows: 10,
      messageTypes: 18,
      crossMinistryMustUsePresidency: true,
      realWorkflowExecutionActive: false,
      socialPublishingActive: false,
      productionActivationActive: false,
      secretsExposed: false,
      fakeUsersIncluded: false,
      fakeRevenueIncluded: false,
      fakeMetricsIncluded: false,
    });
    expect(planetPayload.coordinationSummary.messageStates).toEqual(
      expect.arrayContaining(["draft", "received", "requires_revision", "blocked"])
    );
    expect(planetPayload.coordinationSummary.criticalBlockedCategories).toEqual(
      expect.arrayContaining([
        "live execution activation",
        "real-money routing",
        "billing activation",
        "social publishing",
        "guaranteed profit or win-rate claims",
      ])
    );
    expect(planetPayload.resourceSummary).toMatchObject({
      privateDataSaleAllowed: false,
      fakeMetricsAllowed: false,
    });
    expect(planetPayload.economyGrowthSummary).toMatchObject({
      treasuryState: "readiness_only",
      billing: "inactive",
      paidEntitlements: "not_enabled",
      performanceBasedRevenue: "hidden_inactive_research_only",
      community: "planned_only",
      mediaOffice: "draft_review_only",
      aiVideoStudio: "script_readiness_only",
      partnerships: "inactive_planned",
      finalAcceptance: "internal_review_only",
      launchReady: false,
      truth: {
        fakeUsersIncluded: false,
        fakeRevenueIncluded: false,
        fakeMetricsIncluded: false,
        fakePartnershipsIncluded: false,
      },
    });
    expect(planetPayload.intelligenceSummary).toMatchObject({
      brainContextQuality: "bounded",
      decisionSupportMode: "paper_decision_support",
      dangerousAutonomy: "blocked",
      liveTradingAutonomy: "blocked",
    });
    expect(planetPayload.integrationMeshSummary).toMatchObject({
      mode: "tpm_integration_mesh",
      systemsConnected: 10,
      publicLanguageAligned: true,
      publicPlanNames: ["Free", "Pro", "VIP", "Institutional"],
      assistantName: "Pro Max Assistant",
      requiredBlockedStateCoverage: true,
      privateReportingReadinessOnly: true,
      truth: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        socialPublishing: "inactive",
        fakePlanActivation: "blocked",
        internalGovernanceLeakedToNormalUsers: false,
      },
    });
    expect(planetPayload.snapshot.citizenClasses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "free_demo", state: "active_paper" }),
        expect.objectContaining({ key: "pro", state: "planned" }),
        expect.objectContaining({ key: "vip", state: "planned" }),
        expect.objectContaining({ key: "enterprise", state: "future" }),
      ])
    );
    expect(planetPayload.snapshot.founderBriefing.whatNotToDoToday).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Do not launch/),
        expect.stringMatching(/Do not expose secrets/),
      ])
    );
    const planetPayloadText = JSON.stringify(planetPayload);
    expect(planetPayloadText).not.toMatch(/billing active/i);
    expect(planetPayloadText).not.toMatch(/win-rate claim active/i);

    const planetBlueprint = await request.get("/api/planet/blueprint");
    expect(planetBlueprint.status()).toBe(200);
    const planetBlueprintPayload = await planetBlueprint.json();
    expect(planetBlueprintPayload.snapshot).toMatchObject({
      mode: "planet_blueprint_engine",
      structure: {
        continents: 11,
        ministries: 40,
        citizenClasses: 4,
      },
      hierarchySummary: {
        continents: 12,
        ministries: 40,
        launchActivated: false,
        billingActivated: false,
        liveExecutionActivated: false,
      },
      truth: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
        publicLaunch: "inactive",
      },
    });
    expect(planetBlueprintPayload.snapshot.engines).toHaveLength(10);

    const planetCoordination = await request.get("/api/planet/coordination");
    expect(planetCoordination.status()).toBe(200);
    const planetCoordinationPayload = await planetCoordination.json();
    expect(planetCoordinationPayload.snapshot).toMatchObject({
      mode: "founder_presidency_coordination_system",
      coordinationCenter: "Founder Presidency / Central Coordination System",
      summary: {
        workflows: 10,
        messageTypes: 18,
        crossMinistryMustUsePresidency: true,
        realWorkflowExecutionActive: false,
        socialPublishingActive: false,
        productionActivationActive: false,
        secretsExposed: false,
        fakeUsersIncluded: false,
        fakeRevenueIncluded: false,
        fakeMetricsIncluded: false,
      },
    });
    expect(planetCoordinationPayload.snapshot.decisions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "decision-guaranteed-profit-claim",
          outcome: "blocked",
          constitutionalReviewRequired: true,
        }),
        expect.objectContaining({
          id: "decision-live-trading-activation",
          outcome: "blocked",
        }),
        expect.objectContaining({
          id: "decision-vip-campaign-copy",
          outcome: "founder_approval_required",
          requiredReviewers: expect.arrayContaining([
            "Legal Counsel",
            "Guardian",
            "Treasury",
            "Founder Command Room",
          ]),
        }),
        expect.objectContaining({
          id: "decision-educational-academy-post",
          outcome: "auto_route",
        }),
      ])
    );
    expect(planetCoordinationPayload.snapshot.messageLedger).toMatchObject({
      truth: {
        realMessageQueueActive: false,
        privateUserDataIncluded: false,
        secretsIncluded: false,
        fakeActivityMetricsIncluded: false,
      },
    });

    const planetWorkflows = await request.get("/api/planet/workflows");
    expect(planetWorkflows.status()).toBe(200);
    const planetWorkflowsPayload = await planetWorkflows.json();
    expect(planetWorkflowsPayload.snapshot.summary).toMatchObject({
      workflows: 10,
      externalExecutionActive: false,
      publicLaunchActive: false,
      socialPublishingActive: false,
    });
    expect(planetWorkflowsPayload.snapshot.workflows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "production-activation-workflow" }),
        expect.objectContaining({ id: "plan-entitlement-change-workflow" }),
      ])
    );

    const planetCouncils = await request.get("/api/planet/councils");
    expect(planetCouncils.status()).toBe(200);
    const planetCouncilsPayload = await planetCouncils.json();
    expect(planetCouncilsPayload.snapshot.summary).toMatchObject({
      councils: 3,
      publicLaunchAllowed: false,
      criticalOverrideAllowedWithoutRemediation: false,
      secretsAllowedInGit: false,
    });

    const productTruth = await request.get("/api/product/truth");
    expect(productTruth.status()).toBe(200);
    const productTruthPayload = await productTruth.json();
    expect(productTruthPayload.snapshot).toMatchObject({
      mode: "product_truth_engine",
      summary: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
        publicLaunch: "inactive",
        islamicCertification: "not_certified",
        performanceRevenue: "hidden_inactive",
        secrets: "not_exposed",
      },
    });
    expect(productTruthPayload.snapshot.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "plan_based_product_layers",
          state: "guarded",
          safeNextStep:
            "Keep Free active, Pro/VIP planned, Institutional future, and restricted controls separate.",
        }),
        expect.objectContaining({
          key: "brand_partnerships",
          state: "inactive",
        }),
        expect.objectContaining({
          key: "community_vip_rooms",
          state: "planned",
        }),
        expect.objectContaining({
          key: "final_internal_acceptance",
          state: "review_required",
        }),
      ])
    );

    const founderReadiness = await request.get("/api/founder/briefing/readiness");
    expect(founderReadiness.status()).toBe(200);
    const founderReadinessPayload = await founderReadiness.json();
    expect(founderReadinessPayload.snapshot).toMatchObject({
      mode: "founder_command_reporting_engine",
      privateOwnerOnly: true,
      publicRouteExposed: false,
      truth: {
        fakeUsers: "blocked",
        fakeRevenue: "blocked",
        fakeMetrics: "blocked",
        publicFounderRoute: "blocked",
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
      },
    });
    expect(founderReadinessPayload.snapshot.roomFoundation).toMatchObject({
      mode: "founder_command_room_foundation",
      access: {
        privateOwnerOnly: true,
        publicRouteExposed: false,
        publicNavigationVisible: false,
        normalUserVisible: false,
        userPlanFeature: false,
        readOnly: true,
      },
      overview: {
        ministryCount: 40,
      },
      approvalQueue: {
        readOnly: true,
        blockedActions: expect.arrayContaining([
          "approval execution",
          "external publishing",
          "billing activation",
          "broker/feed activation",
          "public launch claim",
          "live execution",
          "real-money routing",
        ]),
      },
      treasury: {
        currentPerformanceFee: "0%",
        futurePerformanceFeeResearchRange: "5%-10%",
        ownerOnlyActivationLater: true,
        visibleToPublicUsers: false,
      },
      mediaVideo: {
        socialAccountsConnected: false,
        externalPublishingActive: false,
        aiVideoPublishingActive: false,
      },
      coordination: {
        readiness: "readiness_only",
        workflowCount: 10,
        messageTypeCount: 18,
        realWorkflowExecutionActive: false,
      },
      security: {
        secretsExposed: false,
        privateUserDataExposed: false,
        fakeUsers: "blocked",
        fakeRevenue: "blocked",
        fakeMetrics: "blocked",
        dangerousActionsRemainBlocked: true,
      },
    });
    expect(founderReadinessPayload.snapshot.roomFoundation.planVisibility).toMatchObject({
      citizenClasses: expect.arrayContaining([
        "Guest",
        "Free",
        "Pro",
        "VIP",
        "Institutional",
        "Restricted Controls",
      ]),
      billingInactive: true,
      performanceFeeHiddenInactive: true,
      nextSafePlanActions: expect.arrayContaining([
        "Keep Free paper-safe layer active and understandable.",
        "Prepare Pro/VIP entitlement UX without billing or activation claims.",
      ]),
      whatNotToActivateNow: expect.arrayContaining([
        "billing",
        "VIP access",
        "performance-fee UI",
        "private command user-plan access",
      ]),
    });
    expect(
      founderReadinessPayload.snapshot.roomFoundation.planVisibility.planReadiness
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ plan: "Free", state: "paper_active" }),
        expect.objectContaining({ plan: "Pro", state: "planned_locked" }),
        expect.objectContaining({ plan: "VIP", state: "planned_locked" }),
        expect.objectContaining({ plan: "Institutional later", state: "future_planned" }),
      ])
    );
    expect(founderReadinessPayload.snapshot.roomFoundation.ministries).toHaveLength(40);
    expect(
      founderReadinessPayload.snapshot.roomFoundation.ministries[0].coordinationLoad
    ).toBeDefined();
    expect(
      founderReadinessPayload.snapshot.roomFoundation.approvalQueue.states
    ).toEqual(
      expect.arrayContaining([
        "pending_guardian_review",
        "pending_legal_review",
        "ready_for_founder",
        "requires_revision",
        "blocked",
      ])
    );
    expect(founderReadinessPayload.snapshot.commandApp).toMatchObject({
      mode: "founder_king_command_app_deep_foundation",
      access: {
        ownerOnly: true,
        publicRouteExposed: false,
        userPlanAccess: false,
      },
      moduleSummary: {
        total: 20,
      },
      approvalExecutionActive: false,
      safety: {
        approvalExecutionActive: false,
        liveExecutionActive: false,
        realMoneyRoutingActive: false,
        socialPublishingActive: false,
      },
    });
    const founderReadinessText = JSON.stringify(founderReadinessPayload);
    expect(founderReadinessText).not.toMatch(/DATABASE_URL|TPM_OPERATOR_KEY/i);
    expect(founderReadinessText).not.toMatch(
      /DoNotLeak|TradingProMaxOperator|TradingProMaxDemo|Bearer\s+[A-Za-z0-9]/i
    );

    const founderCoordination = await request.get("/api/founder/coordination/readiness");
    expect(founderCoordination.status()).toBe(200);
    const founderCoordinationPayload = await founderCoordination.json();
    expect(founderCoordinationPayload.snapshot).toMatchObject({
      mode: "founder_coordination_readiness",
      privateOwnerOnly: true,
      publicRouteExposed: false,
      readOnly: true,
      noExecution: true,
      coordination: {
        summary: {
          workflows: 10,
          realWorkflowExecutionActive: false,
          socialPublishingActive: false,
          productionActivationActive: false,
        },
      },
    });

    const founderCommandSnapshot = await request.get("/api/founder/command/snapshot");
    expect(founderCommandSnapshot.status()).toBe(200);
    const founderCommandSnapshotPayload = await founderCommandSnapshot.json();
    expect(founderCommandSnapshotPayload.snapshot).toMatchObject({
      mode: "founder_king_command_app_deep_foundation",
      access: {
        audience: "founder_king_only",
        ownerOnly: true,
        publicRouteExposed: false,
        publicNavigationVisible: false,
        userPlanAccess: false,
        readOnlyDefault: true,
      },
      desktopApp: {
        platform: "desktop",
        currentState: "foundation_only",
        routeExposed: false,
        nativeAppShipped: false,
        actionExecutionActive: false,
      },
      mobileApp: {
        platform: "mobile",
        currentState: "foundation_only",
        routeExposed: false,
        nativeAppShipped: false,
        actionExecutionActive: false,
      },
      moduleSummary: {
        total: 20,
      },
      approvalCenter: {
        readOnly: true,
        executionActive: false,
        criticalOverrideWithoutRemediationAllowed: false,
      },
      treasuryCommand: {
        billingInactive: true,
        subscriptionsInactive: true,
        currentPerformanceFee: "0%",
        futurePerformanceFeeResearchRange: "5%-10%",
        performanceBasedRevenueResearch: "hidden_inactive_research_only",
        visibleToPublicUsers: false,
      },
      mediaCommand: {
        socialAccountsConnected: false,
        socialTokensPresent: false,
        externalPublishingActive: false,
        fakeFollowersIncluded: false,
        fakeMetricsIncluded: false,
      },
      communityVipGrowth: {
        readiness: "planned_only",
        noFakeRooms: true,
        noFakeVipActivation: true,
      },
      partnershipsCommand: {
        readiness: "inactive_planned",
        fakePartnershipClaims: false,
        impliedEndorsementAllowed: false,
      },
      finalInternalAcceptance: {
        readiness: "internal_review_only",
        launchReady: false,
        publicLaunchApproved: false,
        productionApproved: false,
        humanVisualAcceptanceRequired: true,
        realWorldBetaTestingRequired: true,
      },
      engineeringOpsQuality: {
        designMinistry: {
          status: "ready",
          publicLanguageGuarded: true,
          platformExperiences: 6,
        },
      },
      safety: {
        approvalExecutionActive: false,
        billingActivationActive: false,
        brokerFeedActivationActive: false,
        liveExecutionActive: false,
        realMoneyRoutingActive: false,
        socialPublishingActive: false,
        publicLaunchActive: false,
        fakeUsersIncluded: false,
        fakeRevenueIncluded: false,
        fakeMetricsIncluded: false,
        secretsExposed: false,
        privateUserDataExposed: false,
      },
    });
    expect(founderCommandSnapshotPayload.snapshot.modules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "planet_overview" }),
        expect.objectContaining({ key: "continents_states_map" }),
        expect.objectContaining({ key: "ministry_reports" }),
        expect.objectContaining({ key: "presidency_coordination" }),
        expect.objectContaining({ key: "councils_constitution" }),
        expect.objectContaining({ key: "ai_video_studio_command" }),
        expect.objectContaining({ key: "companion_brain_command" }),
        expect.objectContaining({ key: "quality_visual_acceptance_command" }),
        expect.objectContaining({ key: "rights_brand_command" }),
        expect.objectContaining({ key: "islamic_review_command" }),
      ])
    );
    expect(
      founderCommandSnapshotPayload.snapshot.engineeringOpsQuality.designMinistry.authorities
    ).toEqual(
      expect.arrayContaining([
        "Design System Authority",
        "Plan Style Authority",
        "Platform Experience Authority",
        "Motion & State Authority",
        "Visual Quality Authority",
      ])
    );
    expect(
      founderCommandSnapshotPayload.snapshot.engineeringOpsQuality.designMinistry.planIdentities
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Free", state: "active_paper_safe" }),
        expect.objectContaining({ label: "Pro", state: "planned_locked" }),
        expect.objectContaining({ label: "VIP", state: "planned_locked" }),
        expect.objectContaining({ label: "Institutional", state: "future_planned" }),
        expect.objectContaining({
          label: "Founder Command",
          audience: "founder_internal",
          state: "internal_private",
        }),
      ])
    );
    expect(
      founderCommandSnapshotPayload.snapshot.approvalCenter.states
    ).toEqual(
      expect.arrayContaining([
        "pending_treasury_review",
        "pending_engineering_review",
        "ready_for_founder",
        "blocked",
      ])
    );

    const founderModules = await request.get("/api/founder/command/modules");
    const founderApproval = await request.get("/api/founder/approval/readiness");
    const founderTreasury = await request.get("/api/founder/treasury/readiness");
    const founderMedia = await request.get("/api/founder/media/readiness");
    const founderEconomy = await request.get("/api/founder/economy/readiness");
    const founderPartnerships = await request.get(
      "/api/founder/partnerships/readiness"
    );
    const founderFinalAcceptance = await request.get(
      "/api/founder/final-acceptance/readiness"
    );
    expect(founderModules.status()).toBe(200);
    expect(founderApproval.status()).toBe(200);
    expect(founderTreasury.status()).toBe(200);
    expect(founderMedia.status()).toBe(200);
    expect(founderEconomy.status()).toBe(200);
    expect(founderPartnerships.status()).toBe(200);
    expect(founderFinalAcceptance.status()).toBe(200);
    const founderModulesPayload = await founderModules.json();
    const founderApprovalPayload = await founderApproval.json();
    const founderTreasuryPayload = await founderTreasury.json();
    const founderMediaPayload = await founderMedia.json();
    const founderEconomyPayload = await founderEconomy.json();
    const founderPartnershipsPayload = await founderPartnerships.json();
    const founderFinalAcceptancePayload = await founderFinalAcceptance.json();
    expect(founderModulesPayload.snapshot).toMatchObject({
      mode: "founder_command_modules_readiness",
      moduleSummary: { total: 20 },
      safety: { approvalExecutionActive: false, secretsExposed: false },
    });
    expect(founderApprovalPayload.snapshot).toMatchObject({
      mode: "founder_approval_center_readiness",
      approvalCenter: {
        readOnly: true,
        executionActive: false,
        criticalOverrideWithoutRemediationAllowed: false,
      },
    });
    expect(founderTreasuryPayload.snapshot).toMatchObject({
      mode: "founder_treasury_command_readiness",
      treasuryCommand: {
        billingInactive: true,
        subscriptionsInactive: true,
        currentPerformanceFee: "0%",
        visibleToPublicUsers: false,
      },
    });
    expect(founderMediaPayload.snapshot).toMatchObject({
      mode: "founder_media_command_readiness",
      mediaCommand: {
        socialAccountsConnected: false,
        socialTokensPresent: false,
        externalPublishingActive: false,
        mediaOffice: {
          noAccountsConnected: true,
          noApiTokens: true,
          externalPublishingActive: false,
          fakeMetricsIncluded: false,
        },
        aiVideoStudio: {
          uploadActive: false,
          publishingActive: false,
          fakeViewsIncluded: false,
        },
      },
    });
    expect(founderEconomyPayload.snapshot).toMatchObject({
      mode: "founder_economy_readiness",
      economy: {
        monetizationReadiness: {
          billing: "inactive",
          checkout: "inactive",
          subscriptions: "inactive",
          paidEntitlements: "not_enabled",
          currentPerformanceFee: "0%",
          performanceBasedRevenue: "hidden_inactive_research_only",
          userVisible: false,
        },
      },
      community: {
        status: "planned_only",
        fakeActiveRooms: false,
      },
      finalAcceptance: {
        launchReady: false,
        publicLaunchApproved: false,
      },
      truth: {
        fakeUsersIncluded: false,
        fakeRevenueIncluded: false,
        fakeMetricsIncluded: false,
      },
    });
    expect(founderPartnershipsPayload.snapshot).toMatchObject({
      mode: "founder_partnerships_readiness",
      partnerships: {
        status: "inactive_planned",
        fakePartnershipClaims: false,
        impliedEndorsementAllowed: false,
      },
      sponsoredClock: {
        state: "inactive",
        publicVisibility: "off",
        companyNamesInUserUi: false,
        contractRequired: true,
      },
    });
    expect(founderFinalAcceptancePayload.snapshot).toMatchObject({
      mode: "founder_final_internal_acceptance_readiness",
      finalAcceptance: {
        status: "internal_review_only",
        launchReady: false,
        productionApproved: false,
        humanVisualAcceptanceRequired: true,
        realWorldBetaTestingRequired: true,
        recommendation: "continue_internal_refinement",
      },
    });
    const founderApiText = JSON.stringify([
      founderCommandSnapshotPayload,
      founderModulesPayload,
      founderApprovalPayload,
      founderTreasuryPayload,
      founderMediaPayload,
      founderEconomyPayload,
      founderPartnershipsPayload,
      founderFinalAcceptancePayload,
    ]);
    expect(founderApiText).not.toMatch(/DATABASE_URL|TPM_OPERATOR_KEY/i);
    expect(founderApiText).not.toMatch(
      /DoNotLeak|TradingProMaxOperator|TradingProMaxDemo|Bearer\s+[A-Za-z0-9]/i
    );
    expect(founderApiText).not.toMatch(/fakeUsersIncluded":true|fakeRevenueIncluded":true|fakeMetricsIncluded":true/);
    expect(founderApiText).not.toMatch(/fakePartnershipsIncluded":true/);

    const founderCommandPath = await request.get("/founder-command");
    expect([200, 404]).toContain(founderCommandPath.status());
    expect(await founderCommandPath.text()).not.toMatch(
      /Founder Command Room Foundation|TPM Planet Command|owner-only planned/i
    );

    const companionContext = await request.get("/api/companion/context");
    expect(companionContext.status()).toBe(200);
    const companionContextPayload = await companionContext.json();
    expect(companionContextPayload.snapshot).toMatchObject({
      assistantTier: {
        tier: "demo_paper",
        availability: "active",
        currentAccess: true,
      },
      planEntitlements: {
        billing: "inactive",
        paidAccess: "not_enabled",
        vipActivation: "not_active",
        institutionalActivation: "future_planned",
        founderCommandAccess: "owner_only_never_user_plan",
        ownerCommandAccess: "owner_only_never_user_plan",
      },
      productTruth: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
        publicLaunch: "inactive",
        founderCommand: "owner_only_private",
      },
      dailyUse: {
      assistantName: "Pro Max Assistant",
        role: "safe_daily_workspace_assistant",
        nonAdvice: true,
        nonExecuting: true,
        nonPredictive: true,
        localOperationSupport: true,
      },
      memoryReadiness: {
        safeSummariesOnly: true,
        accountSafePersistence: "planned",
        productionSync: "inactive",
        surveillance: "blocked",
      },
      planetAccess: {
        citizenClass: "demo_free",
        activeLayer: "Familiar paper trading layer",
        companionLevel: "Basic Assistant active",
        founderCommandUserVisible: false,
        performanceFeeUserVisible: false,
      },
      planAccess: {
        label: "Free",
        activeLayer: "Familiar paper trading layer",
        assistantLevel: "Basic Assistant active",
        ownerCommandUserVisible: false,
        performanceFeeUserVisible: false,
      },
    });
    expect(companionContextPayload.snapshot.planetAccess.visibleCities).toEqual(
      expect.arrayContaining(["Chart", "Paper ticket", "Pro Max Assistant"])
    );
    expect(companionContextPayload.snapshot.planetAccess.lockedFeatures).toEqual(
      expect.arrayContaining(["advanced Assistant"])
    );
    expect(companionContextPayload.snapshot.planetAccess.hiddenFeatures).toEqual(
      expect.arrayContaining(["restricted controls", "revenue research"])
    );
    expect(companionContextPayload.snapshot.planAccess.visibleSurfaces).toEqual(
      expect.arrayContaining(["Chart", "Paper ticket", "Pro Max Assistant"])
    );
    expect(JSON.stringify(companionContextPayload.snapshot.planetAccess)).not.toMatch(
      /performance fee|performance-fee/i
    );
    expect(companionContextPayload.snapshot.brain).toMatchObject({
      contextQuality: "bounded",
      decisionSupportMode: "paper_decision_support",
    });
    expect(companionContextPayload.snapshot.intents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          intent: "explain_blocked_state",
          demoFree: "allowed",
        }),
        expect.objectContaining({
          intent: "founder_unavailable_for_user",
          demoFree: "blocked",
        }),
      ])
    );
    expect(companionContextPayload.snapshot.safety).toMatchObject({
      secretsIncluded: false,
      privateSensitiveDataIncluded: false,
      brokerCredentialsIncluded: false,
      rawTokensIncluded: false,
      canExecuteTrades: false,
      canActivateLive: false,
      guaranteeClaimsAllowed: false,
      winRateClaimsAllowed: false,
      paymentDataIncluded: false,
      socialTokensIncluded: false,
      rawPrivateLogsIncluded: false,
      canActivateBilling: false,
      canActivateBrokerFeed: false,
      canPublishSocial: false,
      financialAdviceAllowed: false,
      legalAdviceAllowed: false,
      pressureToTradeAllowed: false,
    });
    expect(companionContextPayload.snapshot.blockedIntents).toEqual(
      expect.arrayContaining([
        "execute_trade",
        "enable_live",
        "enable_real_money",
        "activate_broker",
        "activate_feed",
        "activate_billing",
        "reveal_secrets",
        "fake_billing",
        "fake_launch",
        "fake_institutional_activation",
        "publish_social",
        "provide_legal_advice",
        "provide_financial_advice",
      ])
    );
    expect(companionContextPayload.snapshot.dailyUse.publicLanguage).toEqual([
      "Free",
      "Pro",
      "VIP",
      "Institutional",
      "Pro Max Assistant",
    ]);
    expect(companionContextPayload.snapshot.whyBlocked).toMatchObject({
      liveDisabled: expect.stringContaining("Live disabled"),
      realMoneyBlocked: expect.stringContaining("Real money blocked"),
      billingInactive: expect.stringContaining("Billing inactive"),
      institutionalFuture: expect.stringContaining("Institutional future"),
    });
    expect(companionContextPayload.snapshot.journalCoach).toMatchObject({
      readiness: "basic_safe_prompts_active",
      persistence: "local_session_memory_foundation",
      canSuggestJournalNotes: true,
      canSuggestCoachPrompts: true,
      canPromiseResults: false,
      canGiveFinancialAdvice: false,
      canFakePersistence: false,
    });
    expect(companionContextPayload.responses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          intent: "explain_plan_upgrade_without_billing",
          state: "planned",
        }),
        expect.objectContaining({
          intent: "founder_unavailable_for_user",
          state: "blocked",
        }),
        expect.objectContaining({
          intent: "explain_upgrade_path_without_billing",
          state: "planned",
        }),
        expect.objectContaining({
          intent: "coach_prompt",
          state: "ready",
        }),
      ])
    );
    expect(companionContextPayload.samples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          input: "activate live trading",
          intent: "enable_live",
          state: "blocked",
        }),
        expect.objectContaining({
          input: "use real money",
          intent: "enable_real_money",
          state: "blocked",
        }),
        expect.objectContaining({
            input: "show broker credentials",
          intent: "reveal_secrets",
          state: "blocked",
        }),
        expect.objectContaining({
          input: "guarantee profit",
          intent: "guarantee_profit",
          state: "blocked",
        }),
        expect.objectContaining({
          input: "what is VIP",
          intent: "explain_plan_access",
          state: "planned",
        }),
        expect.objectContaining({
          input: "why billing inactive",
          intent: "explain_billing_inactive",
          state: "blocked",
        }),
        expect.objectContaining({
          input: "why Institutional future",
          intent: "explain_plan_access",
          state: "planned",
        }),
        expect.objectContaining({
            input: "why is that area separate",
            intent: "founder_unavailable_for_user",
            state: "blocked",
          }),
        expect.objectContaining({
          input: "help me journal",
          intent: "journal_prompt",
          state: "ready",
        }),
        expect.objectContaining({
          input: "explain paper mode",
          intent: "explain_paper_mode",
          state: "ready",
        }),
        expect.objectContaining({
          input: "draft feedback",
          intent: "draft_feedback",
          state: "ready",
        }),
      ])
    );
    expect(JSON.stringify(companionContextPayload.samples)).not.toMatch(
      /guaranteed signal|win-rate claim|financial advice|legal advice/i
    );
    expect(JSON.stringify(companionContextPayload.samples)).not.toMatch(
      /Founder Command|Founder King|Kingdom|\bministries\b|\bcouncils\b|presidency|construction queue|Codex task|secrets authority|treasury controls/i
    );
    expect(JSON.stringify(companionContextPayload.samples)).not.toMatch(
      /Cosmic Operating Physics|Gravity Priority|Orbit Path|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Task Passport|Codex License/i
    );
    expect(JSON.stringify(companionContextPayload)).not.toMatch(
      /execute trade now|activate live now|DATABASE_URL/i
    );

    const journalCoachReadiness = await request.get("/api/journal-coach/readiness");
    expect(journalCoachReadiness.status()).toBe(200);
    const journalCoachReadinessPayload = await journalCoachReadiness.json();
    expect(journalCoachReadinessPayload.snapshot).toMatchObject({
      mode: "journal_coach_foundation",
      currentPlan: "demo_free",
      planAccess: {
        demo: "basic_safe_prompts_active",
        pro: "deeper_session_review_planned",
        vip: "advanced_coaching_planned",
        enterprise: "institutional_team_reports_future",
      },
      planTruth: {
        demo: "basic_prompts_active",
        pro: "journal_depth_planned",
        vip: "advanced_coaching_planned",
      },
      safety: {
        profitGuarantee: "blocked",
        financialAdvice: "blocked",
        tradingSignals: "blocked",
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
      },
    });
    expect(journalCoachReadinessPayload.snapshot.prompts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "session-readiness", state: "active" }),
        expect.objectContaining({ id: "vip-coach-review", state: "locked" }),
      ])
    );
    expect(journalCoachReadinessPayload.snapshot.localJournalFoundation).toMatchObject({
      persistence: "local_session_foundation",
      accountSync: "planned",
      privateSensitiveStorage: "not_enabled",
    });
    expect(journalCoachReadinessPayload.snapshot.localJournalFoundation.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "session_note" }),
        expect.objectContaining({ type: "decision_note" }),
        expect.objectContaining({ type: "lesson_learned" }),
      ])
    );
    expect(journalCoachReadinessPayload.snapshot.decisionReplay).toMatchObject({
      mode: "decision_replay_foundation",
      productTruthAtDecisionTime: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
      },
      noAlternativeOutcomeGuarantee: true,
    });
    expect(JSON.stringify(journalCoachReadinessPayload.snapshot)).not.toMatch(
      /guaranteed profit|financial advice|sure signal/i
    );

    const brainContext = await request.get("/api/brain/context?skillLevel=beginner");
    expect(brainContext.status()).toBe(200);
    const brainContextPayload = await brainContext.json();
    expect(brainContextPayload.snapshot).toMatchObject({
      mode: "tpm_brain_context_layer",
      contextQuality: "bounded",
      decisionSupportMode: "paper_decision_support",
      marketContext: {
        feedTruth: "fallback_first",
        predictiveCertainty: "blocked",
      },
      truth: {
        secretsIncluded: false,
        brokerCredentialsIncluded: false,
        fakeWinRateIncluded: false,
        predictiveCertaintyClaimed: false,
        autoTradingEnabled: false,
        realMoneyEnabled: false,
      },
    });
    expect(JSON.stringify(brainContextPayload.snapshot)).not.toMatch(
      /DATABASE_URL|TPM_OPERATOR_KEY|guaranteed profit|win-rate claim active/i
    );

    const planetEngines = await request.get("/api/planet/engines");
    expect(planetEngines.status()).toBe(200);
    const planetEnginesPayload = await planetEngines.json();
    expect(planetEnginesPayload.snapshot).toMatchObject({
      mode: "planet_core_engines",
      enginesEstablished: 10,
      truth: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        brokerFeedBillingLaunch: "not_faked",
        secrets: "not_exposed",
        socialPublishing: "blocked",
      },
    });
    expect(planetEnginesPayload.snapshot.planEntitlements.truth).toMatchObject({
      billing: "inactive",
      paidAccess: "not_enabled",
      vipActivation: "not_active",
      founderCommandAccess: "owner_only_never_user_plan",
    });
    expect(planetEnginesPayload.snapshot.guardianLegalRules.blockedClaim).toMatchObject({
      outcome: "blocked",
    });
    expect(planetEnginesPayload.snapshot.founderCompanion).toMatchObject({
      mode: "founder_personal_companion",
      boundaries: {
        canApproveActionsAlone: false,
        canPublishMedia: false,
        canEnableLiveExecution: false,
        canExposeSecrets: false,
      },
    });
    expect(planetEnginesPayload.snapshot.platformClock).toMatchObject({
      mode: "swiss_precision_clock",
      auditTimeBasis: "utc",
      truth: {
        auditRemainsUtc: true,
        marketOpenClaim: false,
      },
    });
    expect(planetEnginesPayload.snapshot.stateExplanations.explanations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "live_disabled",
          safeNextStep: expect.any(String),
        }),
        expect.objectContaining({
          key: "billing_inactive",
          safeNextStep: expect.any(String),
        }),
        expect.objectContaining({
          key: "real_money_blocked",
          safeNextStep: expect.any(String),
        }),
        expect.objectContaining({
          key: "social_publishing_inactive",
          safeNextStep: expect.any(String),
        }),
        expect.objectContaining({
          key: "founder_command_private",
          safeNextStep: expect.any(String),
        }),
        expect.objectContaining({
          key: "institutional_future",
          safeNextStep: expect.any(String),
        }),
      ])
    );
    expect(planetEnginesPayload.snapshot.contentFactory.blockedDraft).toMatchObject({
      risk: "blocked",
      truth: {
        externalPublishing: "blocked",
        socialTokens: "not_present",
        fakeMetrics: "blocked",
      },
    });
    expect(planetEnginesPayload.snapshot.contentFactory.educationTip).toMatchObject({
      risk: "safe_auto_publish",
      lifecycle: "brand_review",
      reviewSequence: expect.arrayContaining([
        "idea",
        "draft",
        "brand_review",
        "guardian_review",
        "legal_review",
        "founder_approval",
      ]),
    });
    expect(planetEnginesPayload.snapshot.contentFactory.vipClaim).toMatchObject({
      risk: "approval_required",
    });
    expect(planetEnginesPayload.snapshot.contentFactory.islamicClaim).toMatchObject({
      risk: "blocked",
    });
    expect(planetEnginesPayload.snapshot.contentFactory.liveClaim).toMatchObject({
      risk: "blocked",
    });
    expect(planetEnginesPayload.snapshot.buildPlanner.forbiddenLaunchPlan).toMatchObject({
      domain: "launch-forbidden",
      completionStatus: "blocked",
      executorTruth: "planner_only_not_executor",
    });
    expect(planetEnginesPayload.snapshot.buildPlanner.companionPlan).toMatchObject({
      domain: "companion",
      completionStatus: "partial",
    });
    expect(planetEnginesPayload.snapshot.buildPlanner.mediaPlan).toMatchObject({
      domain: "media",
      completionStatus: "partial",
    });
    expect(planetEnginesPayload.snapshot.buildPlanner.secretForbiddenPlan).toMatchObject({
      domain: "secret-forbidden",
      completionStatus: "blocked",
    });
    expect(planetEnginesPayload.snapshot.buildPlanner.liveForbiddenPlan).toMatchObject({
      domain: "live-forbidden",
      completionStatus: "blocked",
    });

    const visualAcceptance = await request.get("/api/planet/visual-acceptance");
    expect(visualAcceptance.status()).toBe(200);
    const visualAcceptancePayload = await visualAcceptance.json();
    expect(visualAcceptancePayload.snapshot.areas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ area: "founder_command" }),
        expect.objectContaining({ area: "swiss_precision" }),
        expect.objectContaining({ area: "earth_planet_identity" }),
      ])
    );

    const stateExplanations = await request.get("/api/planet/state-explanations");
    expect(stateExplanations.status()).toBe(200);
    const stateExplanationsPayload = await stateExplanations.json();
    expect(stateExplanationsPayload.snapshot.explanations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "real_money_blocked",
          blockerType: "safety",
          whoCanUnblock: "founder",
        }),
        expect.objectContaining({
          key: "founder_command_private",
          blockerType: "owner_private",
          state: "hidden",
        }),
        expect.objectContaining({
          key: "institutional_future",
          blockerType: "plan",
          state: "planned",
        }),
        expect.objectContaining({
          key: "assistant_intent_restricted",
          blockerType: "safety",
        }),
      ])
    );

    const contentFactoryReadiness = await request.get(
      "/api/planet/content-factory/readiness"
    );
    expect(contentFactoryReadiness.status()).toBe(200);
    const contentFactoryReadinessPayload = await contentFactoryReadiness.json();
    expect(contentFactoryReadinessPayload.snapshot.lifecycle.reviewSequence).toEqual([
      "idea",
      "draft",
      "brand_review",
      "guardian_review",
      "legal_review",
      "founder_approval",
    ]);
    expect(contentFactoryReadinessPayload.snapshot.samples).toMatchObject({
      educationTip: { risk: "safe_auto_publish" },
      vipClaim: { risk: "approval_required" },
      guaranteedProfitClaim: { risk: "blocked" },
      islamicCertificationClaim: { risk: "blocked" },
      liveTradingClaim: { risk: "blocked" },
      sponsoredClockClaim: { risk: "approval_required" },
      aiVideoScript: { risk: "approval_required" },
    });
    expect(contentFactoryReadinessPayload.snapshot.mediaOffice).toMatchObject({
      accountsConnected: false,
      tokensPresent: false,
      externalPublishing: "blocked",
      metrics: "not_present",
    });
    expect(contentFactoryReadinessPayload.snapshot.aiVideoStudio).toMatchObject({
      upload: "blocked",
      publishing: "blocked",
      fakeViews: "blocked",
      requiredReviews: expect.arrayContaining(["Safety", "Legal", "Private approval"]),
    });
    expect(contentFactoryReadinessPayload.snapshot.truth).toMatchObject({
      socialTokens: "not_present",
      fakeFollowersOrViews: "blocked",
    });

    const planetEconomy = await request.get("/api/planet/economy/readiness");
    const planetMedia = await request.get("/api/planet/media/readiness");
    expect(planetEconomy.status()).toBe(200);
    expect(planetMedia.status()).toBe(200);
    const planetEconomyPayload = await planetEconomy.json();
    const planetMediaPayload = await planetMedia.json();
    expect(planetEconomyPayload.snapshot).toMatchObject({
      mode: "planet_economy_readiness",
      economy: {
        treasuryState: "readiness_only",
        revenueReadiness: "planned_not_active",
        monetizationReadiness: {
          billing: "inactive",
          checkout: "inactive",
          subscriptions: "inactive",
          currentPerformanceFee: "0%",
          userVisible: false,
        },
      },
      truth: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
        publicLaunch: "inactive",
        fakeUsersIncluded: false,
        fakeRevenueIncluded: false,
        fakeMetricsIncluded: false,
        fakePartnershipsIncluded: false,
      },
    });
    expect(planetEconomyPayload.snapshot.resourcesToEconomy.rules).toEqual(
      expect.arrayContaining(["do not sell private user data"])
    );
    expect(planetMediaPayload.snapshot).toMatchObject({
      mode: "planet_media_readiness",
      mediaOffice: {
        status: "draft_review_only",
        noAccountsConnected: true,
        noApiTokens: true,
        externalPublishingActive: false,
      },
      aiVideoStudio: {
        status: "script_readiness_only",
        uploadActive: false,
        publishingActive: false,
        fakeViewsIncluded: false,
      },
      partnerships: {
        status: "inactive_planned",
        fakePartnershipClaims: false,
      },
    });

    const buildPlannerReadiness = await request.get("/api/build-planner/readiness");
    expect(buildPlannerReadiness.status()).toBe(200);
    const buildPlannerReadinessPayload = await buildPlannerReadiness.json();
    expect(buildPlannerReadinessPayload.snapshot.plans).toMatchObject({
      launchForbidden: { domain: "launch-forbidden", completionStatus: "blocked" },
      secretForbidden: { domain: "secret-forbidden", completionStatus: "blocked" },
      liveForbidden: { domain: "live-forbidden", completionStatus: "blocked" },
      billingForbidden: { domain: "billing-forbidden", completionStatus: "blocked" },
      brokerFeedForbidden: { domain: "broker-feed-forbidden", completionStatus: "blocked" },
      socialForbidden: { domain: "social-publishing-forbidden", completionStatus: "blocked" },
    });
    expect(JSON.stringify(buildPlannerReadinessPayload.snapshot)).not.toMatch(
      /activate production|enable live execution without approval/i
    );

    const selfGovernance = await request.get("/api/planet/self-governance");
    expect(selfGovernance.status()).toBe(200);
    const selfGovernancePayload = await selfGovernance.json();
    expect(selfGovernancePayload.snapshot).toMatchObject({
      mode: "planet_self_governance_readiness",
      guardianLegal: {
        mode: "guardian_legal_enforcement_matrix",
        truth: {
          invasiveSurveillance: false,
          fakeRuntimeEnforcementClaimed: false,
          secretsRequired: false,
        },
      },
      ministryAutonomy: {
        truth: {
          dangerousAutonomy: "blocked",
          liveTradingAutonomy: "blocked",
          billingAutonomy: "blocked",
          founderCommandDefault: "read_only",
        },
      },
      planValueMap: {
        truth: {
          billing: "inactive",
          vipActivation: "not_active",
        },
      },
      roadmap: {
        truth: {
          autonomousCodeExecution: "not_enabled",
          liveExecutionForbidden: true,
          billingActivationForbidden: true,
          brokerFeedActivationForbidden: true,
        },
      },
    });

    const probes = new Map<string, { key: string; status: string }>(
      diagnosticsPayload.health.probes.map((probe: { key: string; status: string }) => [
        probe.key,
        probe,
      ])
    );
    expect(probes.get("server_readiness")).toMatchObject({ status: "ready" });
    expect(probes.get("preferences_persistence")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("workspace_persistence")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("runtime_ops")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("product_backend_state")).toMatchObject({
      status: "ready",
    });
    expect(["unconfigured", "ready"]).toContain(
      probes.get("desktop_productization")?.status
    );
    expect(["unconfigured", "ready"]).toContain(
      probes.get("mobile_productization")?.status
    );
    expect(probes.get("enterprise_ops_foundation")).toMatchObject({
      status: "ready",
    });
    expect(["ready", "degraded"]).toContain(
      probes.get("production_ops_activation")?.status
    );
    expect(["ready", "blocked"]).toContain(
      probes.get("production_deployment_readiness")?.status
    );
    expect(probes.get("commercial_scaling_foundation")).toMatchObject({
      status: "ready",
    });
    expect(["ready", "degraded"]).toContain(
      probes.get("commercial_activation")?.status
    );
    expect(probes.get("market_data")).toMatchObject({ status: "fallback" });
    expect(["unconfigured", "blocked"]).toContain(
      probes.get("broker_connector")?.status
    );
    expect(["unconfigured", "blocked"]).toContain(
      probes.get("real_integrations_foundation")?.status
    );
    expect(["unconfigured", "blocked", "ready"]).toContain(
      probes.get("real_activation_pilot")?.status
    );
    expect(probes.get("alerts_automation")).toMatchObject({
      status: "unconfigured",
    });
    expect(["unconfigured", "ready"]).toContain(
      probes.get("alerts_delivery_activation")?.status
    );
    expect(probes.get("alerts_workflow")).toMatchObject({
      status: "unconfigured",
    });
    expect(probes.get("intelligence_backend")).toMatchObject({
      status: "ready",
    });
    expect(["ready", "degraded"]).toContain(
      probes.get("ai_iq_brain_foundation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("ai_iq_brain_deepening")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("launch_readiness_gate")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("production_hardening")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("ops_recovery")?.status
    );
    expect(["ready", "unconfigured", "degraded"]).toContain(
      probes.get("closed_beta_preparation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("soft_launch_preparation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("public_launch_preparation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("market_parity_closure")?.status
    );
    expect(probes.get("visual_identity_platform_design")).toMatchObject({
      status: "ready",
    });

    const routes = new Map<string, { path: string; status: string }>(
      diagnosticsPayload.health.routes.map((route: { path: string; status: string }) => [
        route.path,
        route,
      ])
    );
    expect(routes.get("/api/planet/status")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/blueprint")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/engines")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/visual-acceptance")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/state-explanations")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/content-factory/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/economy/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/media/readiness")).toMatchObject({
      status: "ready",
    });
    expect(diagnosticsPayload.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "visual_identity_platform_design",
          status: "ready",
        }),
      ])
    );
    expect(routes.get("/api/build-planner/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/product/truth")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/briefing/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/command/snapshot")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/command/modules")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/approval/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/treasury/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/media/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/economy/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/partnerships/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/founder/final-acceptance/readiness")).toMatchObject({
      status: "ready",
    });
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/companion/context")?.status
    );
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/brain/context")?.status
    );
    expect(routes.get("/api/journal-coach/readiness")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/planet/self-governance")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/account/preferences")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/commercial/catalog")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/account/commercial-state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/commercial-activation")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/workspace")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/product-state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/telemetry")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/runbook")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/hardening")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/recovery")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/alerts/workflows")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/alerts/automation/state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/alerts/delivery/state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/market/feed-state")).toMatchObject({
      status: "fallback",
    });
    expect(["unconfigured", "blocked"]).toContain(
      routes.get("/api/broker/state")?.status
    );
    expect(routes.get("/api/platform/desktop/state")).toMatchObject({
      status: "ready",
    });
    expect(["unconfigured", "ready"]).toContain(
      routes.get("/api/platform/desktop/productization")?.status
    );
    expect(routes.get("/api/platform/mobile/state")).toMatchObject({
      status: "ready",
    });
    expect(["unconfigured", "ready"]).toContain(
      routes.get("/api/platform/mobile/productization")?.status
    );
    expect(["unconfigured", "blocked"]).toContain(
      routes.get("/api/integrations/readiness")?.status
    );
    expect(["unconfigured", "blocked", "ready"]).toContain(
      routes.get("/api/integrations/pilot")?.status
    );
    expect(routes.get("/api/account/compliance")).toMatchObject({
      status: "auth_required",
    });
    expect(["unconfigured", "auth_required"]).toContain(
      routes.get("/api/operator/compliance/review")?.status
    );
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/intelligence/insights")?.status
    );
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/intelligence/operator-assist")?.status
    );
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/launch/readiness")?.status
    );
    expect(routes.get("/api/launch/operations")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/beta-readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/feedback")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/soft-readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/soft-access")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/public-readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/public-go-live")).toMatchObject({
      status: "auth_required",
    });
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/parity/final")?.status
    );

    const launchReadiness = await request.get("/api/launch/readiness");
    expect(launchReadiness.status()).toBe(200);
    const launchReadinessPayload = await launchReadiness.json();
    expect(launchReadinessPayload.gate).toMatchObject({
      gateVersion: "tpm.launch.readiness.v2",
      mode: "verification_gate",
      contracts: {
        minimumScore: expect.any(Number),
        requiredDomains: expect.arrayContaining([
          "platform",
          "integrations",
          "ops",
          "deployment",
          "trust",
          "commercial",
          "intelligence",
        ]),
        requiredChecklistPassRate: 1,
      },
      overall: {
        status: expect.stringMatching(/pass|fail/),
      },
      decision: {
        canEnterControlledLaunchOperations: expect.any(Boolean),
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
      },
    });
    expect(launchReadinessPayload.gate.domains).toHaveLength(10);
    expect(launchReadinessPayload.gate.domains).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "deployment",
          required: true,
          statuses: expect.arrayContaining([
            expect.stringMatching(/ready|blocked|unavailable/),
          ]),
        }),
      ])
    );
    const deploymentDomain = launchReadinessPayload.gate.domains.find(
      (domain: { key: string }) => domain.key === "deployment"
    );
    if (healthPayload.productionDeployment.status === "blocked") {
      expect(deploymentDomain).toMatchObject({ state: "fail" });
    }
    expect(launchReadinessPayload.gate.checklist.items.length).toBeGreaterThan(4);
    expect(Array.isArray(launchReadinessPayload.gate.decision.blockers)).toBe(true);

    const marketParity = await request.get("/api/parity/final");
    expect(marketParity.status()).toBe(200);
    const marketParityPayload = await marketParity.json();
    expect(marketParityPayload.snapshot).toMatchObject({
      mode: "final_market_parity_closure",
      status: expect.stringMatching(/closed|partially_closed/),
      score: expect.any(Number),
      evidence: {
        diagnosticsReadiness: expect.stringMatching(
          /ready|fallback|blocked|auth_required|degraded|unconfigured|unavailable/
        ),
        launchReadinessGate: {
          status: expect.stringMatching(/pass|fail/),
          score: expect.any(Number),
        },
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
        billing: "inactive",
        predictiveGuarantee: "none",
      },
    });
    expect(Array.isArray(marketParityPayload.snapshot.objectives)).toBe(true);
    expect(marketParityPayload.snapshot.objectives.length).toBeGreaterThanOrEqual(7);
    expect(Array.isArray(marketParityPayload.snapshot.guards)).toBe(true);
    expect(marketParityPayload.snapshot.guards.length).toBeGreaterThan(3);

    const compliance = await request.get("/api/account/compliance");
    expect(compliance.status()).toBe(401);
    const opsTelemetryUnauth = await request.get("/api/ops/telemetry");
    expect(opsTelemetryUnauth.status()).toBe(401);
    const opsRunbookUnauth = await request.get("/api/ops/runbook");
    expect(opsRunbookUnauth.status()).toBe(401);
    const opsReadinessUnauth = await request.get("/api/ops/readiness");
    expect(opsReadinessUnauth.status()).toBe(401);
    const opsHardeningUnauth = await request.get("/api/ops/hardening");
    expect(opsHardeningUnauth.status()).toBe(401);
    const opsRecoveryUnauth = await request.get("/api/ops/recovery");
    expect(opsRecoveryUnauth.status()).toBe(401);
    const automationStateUnauth = await request.get("/api/alerts/automation/state");
    expect(automationStateUnauth.status()).toBe(401);
    const deliveryStateUnauth = await request.get("/api/alerts/delivery/state");
    expect(deliveryStateUnauth.status()).toBe(401);
    const launchOperationsUnauth = await request.get("/api/launch/operations");
    expect(launchOperationsUnauth.status()).toBe(401);
    const betaReadinessUnauth = await request.get("/api/launch/beta-readiness");
    expect(betaReadinessUnauth.status()).toBe(401);
    const launchFeedbackUnauth = await request.get("/api/launch/feedback");
    expect(launchFeedbackUnauth.status()).toBe(401);
    const softLaunchUnauth = await request.get("/api/launch/soft-readiness");
    expect(softLaunchUnauth.status()).toBe(401);
    const softLaunchAccessUnauth = await request.get("/api/launch/soft-access");
    expect(softLaunchAccessUnauth.status()).toBe(401);
    const publicLaunchUnauth = await request.get("/api/launch/public-readiness");
    expect(publicLaunchUnauth.status()).toBe(401);
    const publicGoLiveUnauth = await request.get("/api/launch/public-go-live");
    expect(publicGoLiveUnauth.status()).toBe(401);
    const commercialStateUnauth = await request.get("/api/account/commercial-state");
    expect(commercialStateUnauth.status()).toBe(401);
    const commercialActivationUnauth = await request.get(
      "/api/account/commercial-activation"
    );
    expect(commercialActivationUnauth.status()).toBe(401);
    const operatorReview = await request.get(
      "/api/operator/compliance/review?accountId=missing"
    );
    expect(operatorReview.status()).toBe(401);

    const broker = await request.get("/api/broker/state");
    expect(broker.status()).toBe(200);
    const brokerPayload = await broker.json();
    expect(brokerPayload.integration.integration).toMatchObject({
      paperRouting: "local_paper_only",
      realRouting: "blocked",
    });
    expect(brokerPayload.integration.pilotReadiness).toMatchObject({
      releaseRequirements: expect.arrayContaining([
        "sandbox_endpoint",
        "sandbox_credentials",
        "operator_review",
        "pilot_policy_release",
        "paper_only_guard",
      ]),
      audit: {
        activationAttempts: "recorded_to_audit_events",
        secretExposure: "presence_only",
        safeFailureState: "no_order_route_enabled",
      },
    });
    expect(brokerPayload.integration.pilotReadiness.environmentSeparation).toMatchObject({
      liveOrderRoute: "blocked",
    });
    expect(brokerPayload.safety.liveExecution).toBe("blocked");
    expect(["unconfigured", "configured_blocked"]).toContain(
      brokerPayload.safety.state
    );
    const brokerAttemptUnauth = await request.post("/api/broker/state", {
      data: {
        action: "request_pilot_activation",
        environment: "sandbox",
      },
    });
    expect(brokerAttemptUnauth.status()).toBe(401);

    const feedState = await request.get("/api/market/feed-state");
    expect(feedState.status()).toBe(200);
    const feedStatePayload = await feedState.json();
    expect(feedStatePayload.snapshot).toMatchObject({
      policyMode: "fallback_first",
    });
    expect(typeof feedStatePayload.snapshot.readiness.score).toBe("number");
    expect(typeof feedStatePayload.snapshot.readiness.stage).toBe("string");
    expect([
      "unconfigured",
      "configured_inactive",
      "configured_blocked",
    ]).toContain(feedStatePayload.snapshot.externalDriver.state);
    expect(feedStatePayload.snapshot.pilotReadiness).toMatchObject({
      transitionContract: {
        fallbackToExternal: "manual_policy_release_required",
        externalToFallback: "automatic_safe_fallback",
        servingTruthLabel: "source_label_required",
        falseLiveClaimGuard: "blocked",
      },
      audit: {
        activationAttempts: "recorded_to_audit_events",
        secretExposure: "presence_only",
        safeFailureState: "fallback_remains_authoritative",
      },
    });
    const feedAttemptUnauth = await request.post("/api/market/feed-state", {
      data: {
        action: "request_external_activation",
        mode: "external_live",
      },
    });
    expect(feedAttemptUnauth.status()).toBe(401);

    const desktopState = await request.get("/api/platform/desktop/state");
    expect(desktopState.status()).toBe(200);
    const desktopStatePayload = await desktopState.json();
    expect(desktopStatePayload.snapshot.truth).toMatchObject({
      foundationState: "contract_ready",
      hostRuntime: "desktop_shell_reserved",
      nativeClaims: "none",
    });
    expect(desktopStatePayload.snapshot.bridge).toMatchObject({
      protocol: "ipc_json_v1",
      transport: "local_host_bridge",
    });
    expect(desktopStatePayload.snapshot.targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ os: "windows" }),
        expect.objectContaining({ os: "macos" }),
        expect.objectContaining({ os: "linux" }),
      ])
    );
    expect(desktopStatePayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const desktopProductization = await request.get(
      "/api/platform/desktop/productization"
    );
    expect(desktopProductization.status()).toBe(200);
    const desktopProductizationPayload = await desktopProductization.json();
    expect(desktopProductizationPayload.snapshot.truth).toMatchObject({
      hostRuntime: "desktop_shell_reserved",
      releaseClaims: "no_public_store_release_claim",
    });
    expect(desktopProductizationPayload.snapshot.shell).toMatchObject({
      usability: "operator_pilot_usable",
      windowLayouts: "restorable",
    });
    expect(desktopProductizationPayload.snapshot.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      preferenceState: "hybrid_preference_sync",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(desktopProductizationPayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const mobileState = await request.get("/api/platform/mobile/state");
    expect(mobileState.status()).toBe(200);
    const mobileStatePayload = await mobileState.json();
    expect(mobileStatePayload.snapshot.truth).toMatchObject({
      foundationState: "contract_ready",
      runtime: "mobile_shell_reserved",
      pushClaims: "none",
    });
    expect(mobileStatePayload.snapshot.bridge).toMatchObject({
      protocol: "bridge_json_v1",
      transport: "native_web_runtime_bridge",
    });
    expect(mobileStatePayload.snapshot.targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ platform: "android" }),
        expect.objectContaining({ platform: "ios" }),
      ])
    );
    expect(mobileStatePayload.snapshot.workflow).toMatchObject({
      pushDelivery: "unconfigured",
    });
    expect(mobileStatePayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const mobileProductization = await request.get(
      "/api/platform/mobile/productization"
    );
    expect(mobileProductization.status()).toBe(200);
    const mobileProductizationPayload = await mobileProductization.json();
    expect(mobileProductizationPayload.snapshot.truth).toMatchObject({
      runtime: "mobile_shell_reserved",
      pushClaims: "none",
      releaseClaims: "no_store_release_claim",
    });
    expect(mobileProductizationPayload.snapshot.clientFlow).toMatchObject({
      navigationModel: "workstation_compact_tabs",
      routeScope: "operator_assist",
    });
    expect(mobileProductizationPayload.snapshot.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      preferenceState: "hybrid_preference_sync",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(mobileProductizationPayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      autoTrading: "blocked",
    });

    const integrationReadiness = await request.get("/api/integrations/readiness");
    expect(integrationReadiness.status()).toBe(200);
    const integrationPayload = await integrationReadiness.json();
    expect(integrationPayload.snapshot.policy).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked_until_policy_release",
      externalFeedActivation: "blocked_until_policy_release",
      operatorApproval: "required",
    });
    expect(integrationPayload.snapshot.activation).toMatchObject({
      mode: "operator_review_and_policy_guard",
      canActivateNow: false,
      sandboxState: "inactive_guarded",
      auditReference: "local_audit_contract",
    });
    expect(integrationPayload.snapshot.activation.checklist).toEqual(
      expect.arrayContaining([
        "broker_endpoint",
        "broker_credentials",
        "feed_endpoint",
        "feed_credentials",
        "operator_review",
        "policy_release",
      ])
    );
    expect(Array.isArray(integrationPayload.snapshot.activation.blockedReasons)).toBe(
      true
    );
    expect(integrationPayload.snapshot.activation.blockedReasons.length).toBeGreaterThan(
      0
    );
    expect(["unconfigured", "configured_blocked"]).toContain(
      integrationPayload.snapshot.broker.state
    );
    expect(integrationPayload.snapshot.broker.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      validation: "guarded_local_probe",
      auditTrail: "local_audit",
    });
    expect(["unconfigured", "configured_inactive", "configured_blocked"]).toContain(
      integrationPayload.snapshot.marketFeed.state
    );
    expect(integrationPayload.snapshot.marketFeed.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      validation: "guarded_local_probe",
      auditTrail: "local_audit",
    });
    expect(integrationPayload.snapshot.pilotPath).toMatchObject({
      mode: "sandbox_only",
      scope: "single_broker_single_feed",
      state: "inactive_guarded",
      canEnterPilot: false,
    });
    expect(integrationPayload.snapshot.pilotPath.nextMilestones).toEqual(
      expect.arrayContaining([
        "configure broker endpoint and credentials",
        "configure external feed endpoint and credentials",
      ])
    );

    const integrationPilot = await request.get("/api/integrations/pilot");
    expect(integrationPilot.status()).toBe(200);
    const integrationPilotPayload = await integrationPilot.json();
    expect(integrationPilotPayload.snapshot.truth).toMatchObject({
      environment: "sandbox_pilot_only",
      scope: "single_broker_single_feed",
      claims: "no_live_ready_claims",
    });
    expect(integrationPilotPayload.snapshot.safety).toMatchObject({
      paperOnlyDefault: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      externalMoneyMovement: "blocked",
    });
    expect(integrationPilotPayload.snapshot.brokerPath.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      verification: "guarded_probe_only",
      auditTrail: "local_audit",
    });
    expect(integrationPilotPayload.snapshot.feedPath.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      verification: "guarded_probe_only",
      auditTrail: "local_audit",
    });
    expect(integrationPilotPayload.snapshot.activation.checklist).toEqual(
      expect.arrayContaining([
        "broker_endpoint",
        "broker_credentials",
        "feed_endpoint",
        "feed_credentials",
        "policy_release",
        "paper_only_guard",
      ])
    );
    expect(integrationPilotPayload.snapshot.controls).toMatchObject({
      credentialScope: "sandbox_namespace_only",
      dataPlaneIsolation: "sandbox_only",
      releaseMode: "operator_guarded_manual",
      auditReference: "local_audit_contract",
    });
    expect(typeof integrationPilotPayload.snapshot.readiness.score).toBe("number");
    expect(typeof integrationPilotPayload.snapshot.readiness.stage).toBe("string");

    const commercialCatalog = await request.get("/api/commercial/catalog");
    expect(commercialCatalog.status()).toBe(200);
    const commercialCatalogPayload = await commercialCatalog.json();
    expect(commercialCatalogPayload.snapshot.truth).toMatchObject({
      billingEngine: "inactive",
      subscriptionEngine: "unconfigured",
      checkoutSurface: "not_enabled",
      paidPlanActivation: "not_enabled",
    });
    expect(commercialCatalogPayload.snapshot.productTruth).toMatchObject({
      goToMarketState: "evaluation_only",
      billingClaims: "none",
      checkoutClaims: "none",
      nativeClaims: "contract_only",
    });
    expect(commercialCatalogPayload.snapshot.assistant.current).toMatchObject({
      tier: "demo_paper",
      label: "Free Assistant",
      availability: "active",
      currentAccess: true,
    });
    expect(commercialCatalogPayload.snapshot.assistant.truth).toMatchObject({
      billing: "inactive",
      paidAccess: "not_enabled",
      vipActivation: "not_active",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      guaranteeClaims: "none",
      winRateClaims: "none",
    });
    expect(commercialCatalogPayload.snapshot.plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "evaluation",
          billing: "inactive",
          assistantTier: expect.objectContaining({
            tier: "demo_paper",
            currentAccess: true,
          }),
        }),
        expect.objectContaining({
          key: "team_review",
          billing: "inactive",
          assistantTier: expect.objectContaining({
            tier: "pro",
            currentAccess: false,
          }),
        }),
      ])
    );
    expect(commercialCatalogPayload.snapshot.plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "evaluation",
          capabilities: expect.objectContaining({
            supportLane: "manual_operator_review",
            notificationDelivery: "unconfigured",
          }),
        }),
      ])
    );

    const workspace = await request.get("/api/account/workspace");
    expect(workspace.status()).toBe(401);
    const productState = await request.get("/api/account/product-state");
    expect(productState.status()).toBe(401);
    const workflows = await request.get("/api/alerts/workflows");
    expect(workflows.status()).toBe(401);

    const intelligence = await request.get(
      "/api/intelligence/context?symbol=EURUSD&timeframe=1m"
    );
    expect(intelligence.status()).toBe(200);
    const intelligencePayload = await intelligence.json();
    expect(intelligencePayload.snapshot).toMatchObject({
      authenticated: false,
      availability: "bounded",
    });
    expect(intelligencePayload.snapshot.truth).toMatchObject({
      modelScope: "deterministic_context",
      predictiveScope: "interpretive_only",
      liveExecution: "blocked",
      predictiveGuarantee: "none",
      winRateClaim: "none",
      degradedModeExplicit: true,
    });
    expect(intelligencePayload.snapshot.multiTimeframe.windows).toHaveLength(3);
    expect(intelligencePayload.snapshot.multiTimeframe.structureBias).toMatch(
      /trend_following|range_balanced|mixed_structure/
    );
    expect(["aligned", "mixed", "unclear"]).toContain(
      intelligencePayload.snapshot.multiTimeframe.alignment
    );
    expect(intelligencePayload.snapshot.executionContext).toMatchObject({
      route: "paper_only",
      operatorControl: "required",
      riskBudgetBand: expect.stringMatching(/low|medium/),
      sessionCadence: expect.stringMatching(/slow|moderate/),
    });
    expect(intelligencePayload.snapshot.journal.coverage).toBe(
      "local_audit_limited"
    );
    expect(intelligencePayload.snapshot.journal.qualitySignal).toMatch(
      /limited|emerging|structured/
    );
    expect(intelligencePayload.snapshot.coaching.mode).toBe("bounded_guidance");
    expect(intelligencePayload.snapshot.coaching.reviewWindowMinutes).toBeGreaterThan(0);
    expect(Array.isArray(intelligencePayload.snapshot.coaching.degradedBoundaries)).toBe(
      true
    );
    expect(intelligencePayload.snapshot.assist.tier).toMatchObject({
      tier: "demo_paper",
      label: "Free Assistant",
      currentAccess: true,
    });
    expect(JSON.stringify(intelligencePayload.snapshot)).not.toMatch(
      /guaranteed profit|win-rate claim|sure signal/i
    );

    const intelligenceInsights = await request.get(
      "/api/intelligence/insights?symbol=EUR/USD&timeframe=5m"
    );
    expect(intelligenceInsights.status()).toBe(200);
    const intelligenceInsightsPayload = await intelligenceInsights.json();
    expect(intelligenceInsightsPayload.view).toBe("expanded_intelligence_context");
    expect(intelligenceInsightsPayload.snapshot.truth).toMatchObject({
      modelScope: "deterministic_context",
      predictiveGuarantee: "none",
      winRateClaim: "none",
      liveExecution: "blocked",
    });

    const intelligenceOperatorAssist = await request.get(
      "/api/intelligence/operator-assist?symbol=EUR/USD&timeframe=15m"
    );
    expect(intelligenceOperatorAssist.status()).toBe(200);
    const intelligenceOperatorAssistPayload = await intelligenceOperatorAssist.json();
    expect(intelligenceOperatorAssistPayload.view).toBe("operator_assist_pack");
    expect(intelligenceOperatorAssistPayload.snapshot.assist).toMatchObject({
      depth: "expanded_operator_assist",
      dataBoundaries: "bounded_local_context",
      executionAuthority: "operator_manual",
    });
    expect(Array.isArray(intelligenceOperatorAssistPayload.snapshot.assist.workspaceActions)).toBe(
      true
    );
    expect(
      intelligenceOperatorAssistPayload.snapshot.assist.workspaceActions.length
    ).toBeGreaterThan(0);
    expect(typeof intelligenceOperatorAssistPayload.snapshot.multiTimeframe.consensusScore).toBe(
      "number"
    );
  });

  test("persists backend workspace depth and workflow state for authenticated sessions", async ({
    request,
  }) => {
    const login = await request.post("/api/auth/login", {
      data: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });
    expect(login.status()).toBe(200);

    const complianceState = await request.get("/api/account/compliance");
    expect(complianceState.status()).toBe(200);
    const complianceStatePayload = await complianceState.json();
    expect(complianceStatePayload.compliance.realMoneySafety).toMatchObject({
      state: "blocked",
      jurisdiction: {
        warning: "placeholder_required_before_live_money",
      },
      auditTrail: "activation_gate_and_compliance_events",
    });
    expect(complianceStatePayload.compliance.realMoneySafety.activationChecklist).toEqual(
      expect.arrayContaining([
        "required_disclosures",
        "operator_approval",
        "jurisdiction_warning",
        "live_money_policy_release",
        "broker_live_configuration",
      ])
    );
    expect(
      complianceStatePayload.compliance.realMoneySafety.hardBlockReasons
    ).toEqual(expect.arrayContaining(["real_money_routing_hard_blocked"]));

    const brokerAttempt = await request.post("/api/broker/state", {
      data: {
        action: "request_pilot_activation",
        environment: "sandbox",
        note: "Closed beta operator check of broker pilot readiness.",
      },
    });
    expect(brokerAttempt.status()).toBe(200);
    const brokerAttemptPayload = await brokerAttempt.json();
    expect(brokerAttemptPayload).toMatchObject({
      ok: true,
      authenticated: true,
      reason: "broker_activation_attempt_recorded",
      activation: {
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        safeFailureState: "no_order_route_enabled",
      },
    });
    expect(["recorded_guarded", "recorded_blocked"]).toContain(
      brokerAttemptPayload.audit.result
    );
    expect(Array.isArray(brokerAttemptPayload.activation.blockedReasons)).toBe(true);

    const feedAttempt = await request.post("/api/market/feed-state", {
      data: {
        action: "request_external_activation",
        mode: "external_live",
        note: "Closed beta operator check of feed transition readiness.",
      },
    });
    expect(feedAttempt.status()).toBe(200);
    const feedAttemptPayload = await feedAttempt.json();
    expect(feedAttemptPayload).toMatchObject({
      ok: true,
      authenticated: true,
      reason: "market_feed_activation_attempt_recorded",
      activation: {
        externalFeedActive: false,
        liveExecution: "blocked",
        safeFailureState: "fallback_remains_authoritative",
      },
    });
    expect(feedAttemptPayload.audit.result).toBe("recorded_blocked");
    expect(Array.isArray(feedAttemptPayload.activation.blockedReasons)).toBe(true);

    const product = await request.get("/api/account/product-state");
    expect(product.status()).toBe(200);
    const productPayload = await product.json();
    expect(productPayload.snapshot.capabilities).toMatchObject({
      liveExecution: "blocked",
      marketData: "fallback_first",
      alertsWorkflow: "configured_local",
    });
    expect(productPayload.snapshot.trust).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      degradedDisclosure: "explicit",
      liveExecutionControls: "hard_blocked",
    });
    expect(productPayload.snapshot.availabilitySemantics).toMatchObject({
      paperExecution: expect.stringMatching(/available|guarded|blocked/),
      liveExecution: "blocked",
      marketData: "fallback_first",
      brokerRouting: "blocked",
      workflowDelivery: expect.stringMatching(/unconfigured|configured_guarded/),
    });
    expect(productPayload.snapshot.guardrails).toMatchObject({
      executionConfirmation: "required",
      disclosureAcknowledgement: "required_before_paper_enablement",
      degradedStateLabeling: "explicit",
      auditTrace: "active",
    });
    expect(productPayload.snapshot.commercial).toMatchObject({
      billing: "inactive",
      subscriptions: "unconfigured",
      plan: "evaluation",
    });
    expect(productPayload.snapshot.assistant.current).toMatchObject({
      tier: "demo_paper",
      label: "Free Assistant",
      currentAccess: true,
    });
    expect(productPayload.snapshot.assistant.tiers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tier: "vip",
          currentAccess: false,
          unavailableReason: expect.stringContaining("VIP entitlement is not active"),
        }),
      ])
    );

    const launchOperations = await request.get("/api/launch/operations");
    expect(launchOperations.status()).toBe(200);
    const launchOperationsPayload = await launchOperations.json();
    expect(launchOperationsPayload.snapshot).toMatchObject({
      mode: expect.stringMatching(
        /closed_beta_preparation|soft_launch_preparation|public_launch_preparation|closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
      ),
      program: {
        releaseTrack: "controlled_launch_operations",
        currentStage: expect.stringMatching(
          /launch_readiness_verification_gate|closed_beta_preparation|soft_launch_preparation|public_launch_preparation|closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
        ),
        previousStage: expect.stringMatching(
          /launch_readiness_verification_gate|closed_beta_preparation|soft_launch_preparation|closed_beta_activation|soft_launch_activation/
        ),
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        publicAccess: "not_open",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
      },
    });
    expect(launchOperationsPayload.snapshot.stages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "launch_readiness_verification_gate",
          required: true,
          state: expect.stringMatching(/ready|blocked/),
        }),
        expect.objectContaining({
          key: "closed_beta_preparation",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
        expect.objectContaining({
          key: "production_hardening",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
        expect.objectContaining({
          key: "soft_launch_preparation",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
        expect.objectContaining({
          key: "public_launch_preparation",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
      ])
    );

    const launchGateStage = launchOperationsPayload.snapshot.stages.find(
      (stage: { key: string }) => stage.key === "launch_readiness_verification_gate"
    );
    const launchGateBlocked = launchGateStage?.state === "blocked";

    const closedBetaActivation = await request.post("/api/launch/operations", {
      data: {
        action: "activate_closed_beta",
        note: "Activate guarded closed beta operations mode.",
      },
    });
    const softLaunchActivation = await request.post("/api/launch/operations", {
      data: {
        action: "activate_soft_launch",
        note: "Activate guarded soft launch limited rollout mode.",
      },
    });

    if (launchGateBlocked) {
      expect(closedBetaActivation.status()).toBe(409);
      const closedBetaActivationPayload = await closedBetaActivation.json();
      expect(closedBetaActivationPayload).toMatchObject({
        ok: false,
        authenticated: true,
        action: "activate_closed_beta",
        reason: "launch_readiness_gate_blocked",
      });
      expect(softLaunchActivation.status()).toBe(409);
      const softLaunchActivationPayload = await softLaunchActivation.json();
      expect(softLaunchActivationPayload).toMatchObject({
        ok: false,
        authenticated: true,
        action: "activate_soft_launch",
        reason: "launch_readiness_gate_blocked",
      });
    } else {
      expect(closedBetaActivation.status()).toBe(200);
      const closedBetaActivationPayload = await closedBetaActivation.json();
      expect(closedBetaActivationPayload).toMatchObject({
        ok: true,
        authenticated: true,
        action: "activate_closed_beta",
        reason: "closed_beta_activated",
      });
      expect(closedBetaActivationPayload.lifecycle).toMatchObject({
        mode: "closed_beta_activation",
        stage: "closed_beta_active",
      });
      expect(closedBetaActivationPayload.snapshot.mode).toMatch(
        /closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
      );
      expect(softLaunchActivation.status()).toBe(200);
      const softLaunchActivationPayload = await softLaunchActivation.json();
      expect(softLaunchActivationPayload).toMatchObject({
        ok: true,
        authenticated: true,
        action: "activate_soft_launch",
        reason: "soft_launch_activated",
      });
      expect(softLaunchActivationPayload.lifecycle).toMatchObject({
        mode: "soft_launch_activation",
        stage: "soft_launch_active",
      });
      expect(softLaunchActivationPayload.snapshot.mode).toMatch(
        /soft_launch_activation|public_launch_activation_gate/
      );
      expect(softLaunchActivationPayload.snapshot.softLaunch.activation).toMatchObject({
        state: "active_guarded",
        activationRoute: "/api/launch/operations",
      });
      expect(
        typeof softLaunchActivationPayload.snapshot.softLaunch.activation.activatedAt
      ).toBe("string");
    }
    expect(launchOperationsPayload.snapshot.closedBeta).toMatchObject({
      mode: "controlled_closed_beta",
      programMode: expect.stringMatching(
        /closed_beta|soft_launch|public_launch_preparation/
      ),
      access: "allowlist_only",
      accessDecision: expect.stringMatching(
        /granted|review_required|blocked_unconfigured/
      ),
      evaluatorEligibility: expect.stringMatching(
        /eligible|review_required|allowlist_unconfigured/
      ),
      matchSource: expect.stringMatching(/email|account|none/),
      capacity: {
        maxEvaluators: expect.any(Number),
        activeEvaluators: expect.any(Number),
        remainingSlots: expect.any(Number),
        state: expect.stringMatching(/within_limit|at_limit/),
      },
      cohort: {
        userEmail: expect.any(String),
        accountId: expect.any(String),
        supportLane: "operator_review",
        feedbackRoute: "/api/launch/feedback",
      },
      activation: {
        state: expect.stringMatching(/active_guarded|inactive_guarded/),
        activationRoute: "/api/launch/operations",
      },
      feedbackLoop: {
        state: expect.stringMatching(
          /operational_guarded|triage_backlog_guarded/
        ),
        pendingTriage: expect.any(Number),
        hardeningInProgress: expect.any(Number),
        highSeverityOpen: expect.any(Number),
        hardeningFollowUps: expect.any(Number),
        recoveryLinked: expect.any(Number),
        lifecycleRoute: "/api/launch/feedback",
        hardeningRoute: "/api/ops/hardening",
        recoveryRoute: "/api/ops/recovery",
      },
      safety: {
        paperOnly: true,
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
      },
    });
    expect(Array.isArray(launchOperationsPayload.snapshot.closedBeta.limitations)).toBe(
      true
    );
    expect(launchOperationsPayload.snapshot.softLaunch).toMatchObject({
      mode: "limited_rollout_guarded",
      programMode: expect.stringMatching(/limited_rollout_guarded|disabled_guarded/),
      state: expect.stringMatching(/prepared_guarded|active_guarded|blocked_guarded/),
      access: "cohort_and_capacity_guard",
      admission: {
        decision: expect.stringMatching(/admitted|queue_review|blocked/),
        reason: expect.stringMatching(
          /capacity_available|requires_operator_review|soft_launch_disabled_or_blocked/
        ),
        supportLane: "operator_review",
        queueRoute: "/api/launch/feedback",
      },
      activation: {
        state: expect.stringMatching(/active_guarded|inactive_guarded/),
        activationRoute: "/api/launch/operations",
      },
      channels: {
        publicEntry: "limited_rollout_visibility",
        inviteFlow: "operator_issue_only",
        supportPath: "operator_review",
      },
      support: {
        feedbackRoute: "/api/launch/feedback",
        responseSlaHours: expect.any(Number),
        rolloutStatus: "limited_guarded",
      },
      guardrails: {
        capacityProtection: {
          state: expect.stringMatching(
            /stable_guarded|pressure_guarded|at_limit_guarded/
          ),
          utilizationPct: expect.any(Number),
          thresholdPct: expect.any(Number),
          protectionMode: "queue_then_operator_review",
        },
        supportReadiness: {
          state: expect.stringMatching(/operator_ready|operator_guarded/),
          pendingTriage: expect.any(Number),
          highSeverityOpen: expect.any(Number),
          supportLane: "operator_review",
          incidentLane: "operator_incident_review",
          responseSlaHours: expect.any(Number),
        },
        rollback: {
          state: expect.stringMatching(/recoverable_guarded|guarded/),
          strategy: "manual_checkpoint_restore",
          rollbackWindowMinutes: expect.any(Number),
          requiresOperatorConfirmation: true,
          recoveryRoute: "/api/ops/recovery",
          runbookRoute: "/api/ops/runbook",
        },
        commercial: {
          billing: "inactive",
          checkout: "not_enabled",
          subscriptionActivation: "inactive_guarded",
          rolloutClaim: "limited_rollout_only",
        },
        escalation: {
          policy: "manual_threshold_escalation",
          triggerState: expect.stringMatching(/normal|elevated/),
          triggers: expect.any(Array),
          feedbackRoute: "/api/launch/feedback",
          recoveryRoute: "/api/ops/recovery",
        },
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        scaleClaims: "none",
        liveExecution: "blocked",
        billing: "inactive",
      },
    });
    expect(launchOperationsPayload.snapshot.softLaunch.capacity).toMatchObject({
      maxAccounts: expect.any(Number),
      activeAccounts: expect.any(Number),
      remainingSlots: expect.any(Number),
      state: expect.stringMatching(/within_limit|at_limit/),
    });
    expect(launchOperationsPayload.snapshot.publicLaunch).toMatchObject({
      mode: "go_live_checklist_guarded",
      state: expect.stringMatching(
        /prepared_guarded|gate_active_guarded|in_progress_guarded|blocked_guarded/
      ),
      contracts: {
        checklistAuthority: "operator_manual",
        legalDisclosures: "required_prelaunch",
        customerComms: "prepared_guarded",
        statusPage: "manual_guarded",
      },
      decision: {
        goLiveState: expect.stringMatching(/ready_guarded|not_ready/),
        reason: expect.stringMatching(
          /public_launch_gate_active_manual_release_required|public_launch_gate_not_activated|checklist_incomplete_or_gate_blocked/
        ),
        releaseRoute: "/api/launch/public-go-live",
        releaseAuthority: "operator_manual_release_only",
      },
      visibility: {
        launchModeLabel: expect.stringMatching(
          /public_launch_preparation|public_launch_activation_gate/
        ),
        customerStateLabel: "not_launched",
        claimsPolicy: "no_false_public_launch_claims",
      },
      activation: {
        state: expect.stringMatching(/active_guarded|inactive_guarded/),
        activationRoute: "/api/launch/public-go-live",
        releaseAuthority: "operator_manual_release_only",
      },
      goLive: {
        releaseAuthority: "operator_manual",
        rolloutWindow: expect.stringMatching(/guarded_unset|guarded_planned/),
        rollbackPlan: "required",
        customerComms: "prepared_guarded",
        supportScale: "operator_limited",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        billing: "inactive",
        liveExecution: "blocked",
        scaleClaims: "none",
      },
    });
    expect(launchOperationsPayload.snapshot.publicLaunch.checklist).toMatchObject({
      requiredCount: expect.any(Number),
      passedCount: expect.any(Number),
      failedCount: expect.any(Number),
    });
    expect(Array.isArray(launchOperationsPayload.snapshot.publicLaunch.checklist.items)).toBe(
      true
    );
    expect(
      launchOperationsPayload.snapshot.publicLaunch.checklist.items.length
    ).toBeGreaterThan(3);
    expect(launchOperationsPayload.snapshot.support).toMatchObject({
      mode: "closed_beta_operator_review",
      feedbackSubmissions30d: expect.any(Number),
      feedbackLifecycleUpdates30d: expect.any(Number),
      pendingTriage: expect.any(Number),
      hardeningInProgress: expect.any(Number),
      highSeverityOpen: expect.any(Number),
      hardeningFollowUps: expect.any(Number),
      recoveryLinked: expect.any(Number),
      supportReadiness: expect.stringMatching(/operator_ready|operator_guarded/),
      escalationState: expect.stringMatching(/normal|elevated/),
      feedbackRoute: "/api/launch/feedback",
      hardeningRoute: "/api/ops/hardening",
      recoveryRoute: "/api/ops/recovery",
    });

    const launchBetaReadiness = await request.get("/api/launch/beta-readiness");
    expect(launchBetaReadiness.status()).toBe(200);
    const launchBetaReadinessPayload = await launchBetaReadiness.json();
    expect(launchBetaReadinessPayload.snapshot).toMatchObject({
      mode: "closed_beta_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      closedBeta: {
        mode: "controlled_closed_beta",
        access: "allowlist_only",
      },
      support: {
        mode: "closed_beta_operator_review",
        feedbackRoute: "/api/launch/feedback",
      },
    });

    const softLaunchReadiness = await request.get("/api/launch/soft-readiness");
    expect(softLaunchReadiness.status()).toBe(200);
    const softLaunchReadinessPayload = await softLaunchReadiness.json();
    expect(softLaunchReadinessPayload.snapshot).toMatchObject({
      mode: "soft_launch_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      softLaunch: {
        mode: "limited_rollout_guarded",
        programMode: expect.stringMatching(/limited_rollout_guarded|disabled_guarded/),
        state: expect.stringMatching(/prepared_guarded|active_guarded|blocked_guarded/),
        access: "cohort_and_capacity_guard",
        guardrails: {
          capacityProtection: {
            state: expect.stringMatching(
              /stable_guarded|pressure_guarded|at_limit_guarded/
            ),
          },
          supportReadiness: {
            state: expect.stringMatching(/operator_ready|operator_guarded/),
          },
          rollback: {
            state: expect.stringMatching(/recoverable_guarded|guarded/),
          },
        },
      },
    });

    const softLaunchAccess = await request.get("/api/launch/soft-access");
    expect(softLaunchAccess.status()).toBe(200);
    const softLaunchAccessPayload = await softLaunchAccess.json();
    expect(softLaunchAccessPayload.snapshot).toMatchObject({
      mode: "soft_launch_access",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      softLaunch: {
        programMode: expect.stringMatching(/limited_rollout_guarded|disabled_guarded/),
        state: expect.stringMatching(/prepared_guarded|active_guarded|blocked_guarded/),
        admission: {
          decision: expect.stringMatching(/admitted|queue_review|blocked/),
          reason: expect.stringMatching(
            /capacity_available|requires_operator_review|soft_launch_disabled_or_blocked/
          ),
        },
        activation: {
          state: expect.stringMatching(/active_guarded|inactive_guarded/),
          activationRoute: "/api/launch/operations",
        },
        guardrails: {
          capacityProtection: {
            state: expect.stringMatching(
              /stable_guarded|pressure_guarded|at_limit_guarded/
            ),
          },
          supportReadiness: {
            state: expect.stringMatching(/operator_ready|operator_guarded/),
          },
          rollback: {
            state: expect.stringMatching(/recoverable_guarded|guarded/),
          },
        },
      },
    });

    const publicLaunchReadiness = await request.get(
      "/api/launch/public-readiness"
    );
    expect(publicLaunchReadiness.status()).toBe(200);
    const publicLaunchReadinessPayload = await publicLaunchReadiness.json();
    expect(publicLaunchReadinessPayload.snapshot).toMatchObject({
      mode: "public_launch_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      publicLaunch: {
        mode: "go_live_checklist_guarded",
        state: expect.stringMatching(
          /prepared_guarded|gate_active_guarded|in_progress_guarded|blocked_guarded/
        ),
      },
    });

    const publicLaunchGateActivation = await request.post(
      "/api/launch/public-go-live",
      {
        data: {
          action: "activate_public_launch_gate",
          note: "Activate guarded final public launch gate for manual release authority.",
        },
      }
    );
    if (launchGateBlocked) {
      expect(publicLaunchGateActivation.status()).toBe(409);
      const publicLaunchGateActivationPayload =
        await publicLaunchGateActivation.json();
      expect(publicLaunchGateActivationPayload).toMatchObject({
        ok: false,
        authenticated: true,
        action: "activate_public_launch_gate",
        reason: "launch_readiness_gate_blocked",
      });
    } else {
      expect(publicLaunchGateActivation.status()).toBe(200);
      const publicLaunchGateActivationPayload =
        await publicLaunchGateActivation.json();
      expect(publicLaunchGateActivationPayload).toMatchObject({
        ok: true,
        authenticated: true,
        action: "activate_public_launch_gate",
        reason: "public_launch_gate_activated",
      });
      expect(publicLaunchGateActivationPayload.lifecycle).toMatchObject({
        mode: "public_launch_activation_gate",
        stage: "public_launch_gate_active",
      });
      expect(publicLaunchGateActivationPayload.launchOperations.mode).toBe(
        "public_launch_activation_gate"
      );
    }

    const publicGoLive = await request.get("/api/launch/public-go-live");
    expect(publicGoLive.status()).toBe(200);
    const publicGoLivePayload = await publicGoLive.json();
    expect(publicGoLivePayload.snapshot).toMatchObject({
      mode: "public_go_live_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      publicLaunch: {
        state: expect.stringMatching(
          /prepared_guarded|gate_active_guarded|in_progress_guarded|blocked_guarded/
        ),
        decision: {
          goLiveState: expect.stringMatching(/ready_guarded|not_ready/),
          reason: expect.stringMatching(
            /public_launch_gate_active_manual_release_required|public_launch_gate_not_activated|checklist_incomplete_or_gate_blocked/
          ),
          releaseRoute: "/api/launch/public-go-live",
          releaseAuthority: "operator_manual_release_only",
        },
        visibility: {
          launchModeLabel: expect.stringMatching(
            /public_launch_preparation|public_launch_activation_gate/
          ),
          customerStateLabel: "not_launched",
        },
        activation: {
          state: expect.stringMatching(/active_guarded|inactive_guarded/),
          activationRoute: "/api/launch/public-go-live",
          releaseAuthority: "operator_manual_release_only",
        },
      },
    });

    const launchFeedback = await request.get("/api/launch/feedback");
    expect(launchFeedback.status()).toBe(200);
    const launchFeedbackPayload = await launchFeedback.json();
    expect(launchFeedbackPayload.snapshot).toMatchObject({
      mode: "closed_beta_feedback",
      intake: {
        route: "/api/launch/feedback",
        auth: "required",
        queue: "operator_review",
      },
      summary: {
        submissions30d: expect.any(Number),
        lifecycleUpdates30d: expect.any(Number),
        openItems: expect.any(Number),
        pendingTriage: expect.any(Number),
        hardeningInProgress: expect.any(Number),
        highSeverityOpen: expect.any(Number),
      },
      triage: {
        contract: "beta_feedback_hardening_loop",
        queue: {
          submitted: expect.any(Number),
          triaged: expect.any(Number),
          hardeningInProgress: expect.any(Number),
          resolved: expect.any(Number),
          deferred: expect.any(Number),
        },
        hardeningFollowUps: expect.any(Number),
        recoveryLinked: expect.any(Number),
        hardeningRoute: "/api/ops/hardening",
        recoveryRoute: "/api/ops/recovery",
      },
      support: {
        mode: "closed_beta_support_guarded",
        lane: "operator_review",
        incidentLane: "operator_incident_review",
        feedbackRoute: "/api/launch/feedback",
        escalationRoute: "/api/ops/recovery",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
        billing: "inactive",
      },
    });
    const baselineFeedbackCount =
      launchFeedbackPayload.snapshot.summary.submissions30d;
    const baselineLifecycleCount =
      launchFeedbackPayload.snapshot.summary.lifecycleUpdates30d;
    expect(typeof baselineFeedbackCount).toBe("number");
    expect(Array.isArray(launchFeedbackPayload.snapshot.recent)).toBe(true);

    const launchFeedbackUpdate = await request.post("/api/launch/feedback", {
      data: {
        category: "usability",
        severity: "medium",
        summary: "Ticket defaults are clear in closed beta mode.",
        detail:
          "Operator feedback capture should stay account-scoped and auditable while access is limited.",
      },
    });
    expect(launchFeedbackUpdate.status()).toBe(200);
    const launchFeedbackUpdatePayload = await launchFeedbackUpdate.json();
    expect(launchFeedbackUpdatePayload.action).toBe("submit_feedback");
    expect(launchFeedbackUpdatePayload.reason).toBe("feedback_submitted");
    expect(launchFeedbackUpdatePayload.snapshot.summary.submissions30d).toBeGreaterThanOrEqual(
      baselineFeedbackCount
    );
    expect(launchFeedbackUpdatePayload.snapshot.recent).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          feedbackId: expect.any(String),
          category: "usability",
          severity: "medium",
          lifecycleState: expect.stringMatching(
            /submitted|triaged|hardening_in_progress|resolved|deferred/
          ),
        }),
      ])
    );

    const lifecycleFeedbackId =
      launchFeedbackUpdatePayload.snapshot.recent[0]?.feedbackId;
    expect(typeof lifecycleFeedbackId).toBe("string");

    const lifecycleUpdate = await request.post("/api/launch/feedback", {
      data: {
        action: "update_feedback_lifecycle",
        feedbackId: lifecycleFeedbackId,
        lifecycleState: "triaged",
        reviewNote: "Triaged for hardening follow-up in closed beta support queue.",
      },
    });
    expect(lifecycleUpdate.status()).toBe(200);
    const lifecycleUpdatePayload = await lifecycleUpdate.json();
    expect(lifecycleUpdatePayload).toMatchObject({
      ok: true,
      authenticated: true,
      action: "update_feedback_lifecycle",
      reason: "feedback_lifecycle_updated",
    });
    expect(lifecycleUpdatePayload.snapshot.summary.lifecycleUpdates30d).toBeGreaterThanOrEqual(
      baselineLifecycleCount
    );
    expect(lifecycleUpdatePayload.snapshot.recent).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          feedbackId: lifecycleFeedbackId,
          lifecycleState: "triaged",
        }),
      ])
    );

    const opsTelemetry = await request.get("/api/ops/telemetry");
    expect(opsTelemetry.status()).toBe(200);
    const opsTelemetryPayload = await opsTelemetry.json();
    expect(opsTelemetryPayload.snapshot.observability).toMatchObject({
      mode: "local_observability",
      logging: "structured_local",
      metrics: "runtime_process",
      tracing: expect.stringMatching(/inactive|configured_guarded/),
      alerting: expect.stringMatching(/unconfigured|configured_guarded/),
    });
    expect(opsTelemetryPayload.snapshot.opsTruth).toMatchObject({
      adminSurface: "operator_guarded_api",
      remoteControl: "not_enabled",
      externalMonitoring: expect.stringMatching(/unconfigured|configured_guarded/),
      incidentAutomation: "inactive",
    });
    expect(opsTelemetryPayload.snapshot.degradation).toMatchObject({
      status: expect.stringMatching(/stable|guarded/),
      memoryPressure: expect.stringMatching(/normal|elevated/),
      sessionBacklog: expect.stringMatching(/normal|elevated/),
      auditVolume: expect.stringMatching(/stable|elevated/),
    });
    expect(Array.isArray(opsTelemetryPayload.snapshot.degradation.indicators)).toBe(
      true
    );
    expect(opsTelemetryPayload.snapshot.runbookPointers).toEqual(
      expect.arrayContaining([
        "/api/ops/runbook",
        "/api/ops/readiness",
        "/api/ops/hardening",
        "/api/diagnostics/probes",
      ])
    );

    const opsHardening = await request.get("/api/ops/hardening");
    expect(opsHardening.status()).toBe(200);
    const opsHardeningPayload = await opsHardening.json();
    expect(opsHardeningPayload.snapshot).toMatchObject({
      runtime: {
        state: expect.stringMatching(/stable|guarded/),
      },
      database: {
        state: expect.stringMatching(/reachable|guarded/),
        timeoutMs: expect.any(Number),
      },
      durability: {
        state: expect.stringMatching(/stable|guarded/),
      },
      degraded: {
        status: expect.stringMatching(/stable|guarded/),
        failureMode: "truthful_degraded_disclosure",
        recoveryMode: "operator_guided_manual",
      },
      safeguards: {
        responseTimeouts: "bounded",
        retryPolicy: "single_retry_with_truthful_failure",
        fallbackPolicy: "fallback_first",
        executionSafety: "paper_only_live_blocked",
      },
      recovery: {
        runbookRoute: "/api/ops/runbook",
        readinessRoute: "/api/ops/readiness",
        diagnosticsRoute: "/api/diagnostics/probes",
        hardeningRoute: "/api/ops/hardening",
      },
    });
    expect(Array.isArray(opsHardeningPayload.snapshot.recovery.recommendedActions)).toBe(
      true
    );
    expect(opsHardeningPayload.snapshot.recovery.recommendedActions.length).toBeGreaterThan(
      1
    );

    const opsRecovery = await request.get("/api/ops/recovery");
    expect(opsRecovery.status()).toBe(200);
    const opsRecoveryPayload = await opsRecovery.json();
    expect(opsRecoveryPayload.snapshot).toMatchObject({
      mode: "operator_recovery_guarded",
      stage: expect.stringMatching(/recoverable|guarded/),
      rollback: {
        strategy: "manual_checkpoint_restore",
        rollbackWindowMinutes: expect.any(Number),
        readiness: expect.stringMatching(/recoverable|guarded/),
        requiresOperatorConfirmation: true,
      },
      failurePaths: {
        databasePath: "manual_operator_restore",
        runtimePath: "manual_process_recycle",
        sessionPath: "manual_session_hygiene",
        workflowPath: "manual_queue_review",
      },
      truth: {
        automation: "inactive",
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        launchClaim: "not_launched",
      },
      references: {
        runbookRoute: "/api/ops/runbook",
        readinessRoute: "/api/ops/readiness",
        hardeningRoute: "/api/ops/hardening",
        diagnosticsRoute: "/api/diagnostics/probes",
      },
    });
    expect(Array.isArray(opsRecoveryPayload.snapshot.rollback.checkpoints)).toBe(true);
    expect(opsRecoveryPayload.snapshot.rollback.checkpoints.length).toBeGreaterThan(2);
    expect(Array.isArray(opsRecoveryPayload.snapshot.recommendedActions)).toBe(true);

    const opsRunbook = await request.get("/api/ops/runbook");
    expect(opsRunbook.status()).toBe(200);
    const opsRunbookPayload = await opsRunbook.json();
    expect(opsRunbookPayload.snapshot.mode).toBe("operator_manual");
    expect(opsRunbookPayload.snapshot.runbooks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "runtime_readiness", state: "ready" }),
        expect.objectContaining({ key: "execution_safety", state: "ready" }),
      ])
    );
    expect(opsRunbookPayload.snapshot.runbooks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "ops_incident_review",
          severity: "elevated",
          probeKey: "production_ops_activation",
        }),
      ])
    );
    expect(typeof opsRunbookPayload.snapshot.lastReviewedAt).toBe("string");

    const opsReadiness = await request.get("/api/ops/readiness");
    expect(opsReadiness.status()).toBe(200);
    const opsReadinessPayload = await opsReadiness.json();
    expect(opsReadinessPayload.snapshot.adminGuard).toMatchObject({
      operatorApi: "guarded",
      remoteAdmin: "not_enabled",
      commandExecution: "manual_review_required",
      maintenanceMode: "manual_only",
    });
    expect(opsReadinessPayload.snapshot.runbookFlow).toMatchObject({
      readinessReview: "manual_operator",
      incidentReview: "manual_operator",
      escalation: "manual_operator",
      automation: "inactive",
    });
    expect(opsReadinessPayload.snapshot.degradationSurface).toMatchObject({
      status: expect.stringMatching(/stable|guarded/),
    });
    expect(Array.isArray(opsReadinessPayload.snapshot.degradationSurface.signals)).toBe(
      true
    );
    expect(opsReadinessPayload.snapshot.healthExposure).toMatchObject({
      telemetryRoute: "authenticated",
      runbookRoute: "authenticated",
      diagnosticsRoute: "public_truthful",
    });

    const commercialState = await request.get("/api/account/commercial-state");
    expect(commercialState.status()).toBe(200);
    const commercialStatePayload = await commercialState.json();
    expect(commercialStatePayload.snapshot.plan).toMatchObject({
      key: "evaluation",
      state: "active_evaluation",
      activationLane: "operator_review_queue",
    });
    expect(commercialStatePayload.snapshot.assistant.current).toMatchObject({
      tier: "demo_paper",
      label: "Free Assistant",
      availability: "active",
      currentAccess: true,
    });
    expect(commercialStatePayload.snapshot.assistant.tiers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tier: "pro",
          availability: "locked",
          currentAccess: false,
        }),
        expect.objectContaining({
          tier: "vip",
          availability: "locked",
          currentAccess: false,
        }),
        expect.objectContaining({
          tier: "enterprise",
          availability: "planned_later",
          currentAccess: false,
        }),
      ])
    );
    expect(commercialStatePayload.snapshot.assistant.truth).toMatchObject({
      billing: "inactive",
      paidAccess: "not_enabled",
      vipActivation: "not_active",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });
    expect(commercialStatePayload.snapshot.billing).toMatchObject({
      engine: "inactive",
      subscriptions: "unconfigured",
      checkout: "not_enabled",
      statementDelivery: "inactive",
    });
    expect(commercialStatePayload.snapshot.account).toMatchObject({
      tenancy: "single_account_guarded",
    });
    expect(commercialStatePayload.snapshot.customerLifecycle).toMatchObject({
      stateExposure: "explicit",
    });
    expect(commercialStatePayload.snapshot.customerLifecycle.checkpoints).toEqual(
      expect.arrayContaining(["disclosures", "verification", "paper_ready"])
    );
    expect(commercialStatePayload.snapshot.trust).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      paidPlanActivation: "not_enabled",
      billingClaims: "none",
    });
    expect(commercialStatePayload.snapshot.commercialTruth).toMatchObject({
      evaluationMode: "active",
      contractMaturity: "operator_review_ready",
      checkoutClaims: "none",
      paidActivationClaims: "none",
    });

    const commercialActivation = await request.get(
      "/api/account/commercial-activation"
    );
    expect(commercialActivation.status()).toBe(200);
    const commercialActivationPayload = await commercialActivation.json();
    expect(commercialActivationPayload.snapshot.plan).toMatchObject({
      current: "evaluation",
    });
    expect(commercialActivationPayload.snapshot.commercialTruth).toMatchObject({
      billingEngine: "inactive",
      checkout: "not_enabled",
      paidActivation: "not_enabled",
      subscriptionState: "unconfigured",
    });
    expect(commercialActivationPayload.snapshot.activation).toMatchObject({
      queueState: expect.stringMatching(/idle|operator_review_queue/),
    });
    expect(commercialActivationPayload.snapshot.requestLedger).toMatchObject({
      source: "local_audit",
      policyMode: "manual_operator_review",
      activationClaims: "no_paid_auto_activation",
    });
    expect(commercialActivationPayload.snapshot.customerFacingSemantics).toMatchObject({
      evaluationState: "active",
      checkoutClaims: "none",
      billingClaims: "none",
      requestPath: "operator_review",
    });

    const commercialActivationUpdate = await request.post(
      "/api/account/commercial-activation",
      {
        data: {
          requestedPlan: "team_review",
          note: "Need multi-operator review lane",
        },
      }
    );
    expect(commercialActivationUpdate.status()).toBe(200);
    const commercialActivationUpdatePayload = await commercialActivationUpdate.json();
    expect(commercialActivationUpdatePayload.snapshot.activation).toMatchObject({
      state: "requested",
      operatorActionRequired: true,
      queueState: "operator_review_queue",
    });
    expect(commercialActivationUpdatePayload.snapshot.plan).toMatchObject({
      current: "evaluation",
      requested: "team_review",
    });

    const workspaceUpdate = await request.post("/api/account/workspace", {
      data: {
        workspaceDepth: {
          focusMode: "execution_focus",
          watchlistDensity: "dense",
          shortcutLayer: "layout_only",
        },
      },
    });
    expect(workspaceUpdate.status()).toBe(200);
    const workspaceUpdatePayload = await workspaceUpdate.json();
    expect(workspaceUpdatePayload.workspaceDepth).toMatchObject({
      focusMode: "execution_focus",
      watchlistDensity: "dense",
      shortcutLayer: "layout_only",
    });

    const workspaceRead = await request.get("/api/account/workspace");
    expect(workspaceRead.status()).toBe(200);
    const workspaceReadPayload = await workspaceRead.json();
    expect(workspaceReadPayload.workspaceDepth).toMatchObject({
      focusMode: "execution_focus",
      watchlistDensity: "dense",
      shortcutLayer: "layout_only",
    });
    expect(workspaceReadPayload.source).toBe("backend_audit");

    const workflowsRead = await request.get("/api/alerts/workflows");
    expect(workflowsRead.status()).toBe(200);
    const workflowsReadPayload = await workflowsRead.json();
    expect(workflowsReadPayload.snapshot.runtime).toMatchObject({
      delivery: "unconfigured",
      automation: "inactive",
      queue: "local_buffer_ready",
      scheduler: "inactive",
      liveExecution: "blocked",
      autoTrading: "blocked",
    });
    expect(workflowsReadPayload.snapshot.runtime.notificationChannels).toMatchObject({
      inApp: "local_unconfigured",
      push: "unconfigured",
      email: "unconfigured",
      webhook: "unconfigured",
    });

    const nextRules = [
      {
        id: "volatility-watch",
        label: "Volatility watch",
        state: "enabled",
        severity: "warning",
        metric: "volatility",
        operator: "gt",
        threshold: 1.2,
        action: "desk_note",
        deliveryMode: "record_only",
        schedule: "market_hours",
        triggerWindowSeconds: 120,
        cooldownSeconds: 90,
        requiresOperatorAck: false,
      },
      {
        id: "drawdown-guard",
        label: "Drawdown guard",
        state: "enabled",
        severity: "critical",
        metric: "session_drawdown",
        operator: "lt",
        threshold: -110,
        action: "review_flag",
        deliveryMode: "operator_queue",
        schedule: "always",
        triggerWindowSeconds: 60,
        cooldownSeconds: 180,
        requiresOperatorAck: true,
      },
    ];

    const workflowsUpdate = await request.post("/api/alerts/workflows", {
      data: {
        rules: nextRules,
      },
    });
    expect(workflowsUpdate.status()).toBe(200);
    const workflowsUpdatePayload = await workflowsUpdate.json();
    expect(workflowsUpdatePayload.snapshot.source).toBe("backend_audit");
    expect(workflowsUpdatePayload.snapshot.rules).toHaveLength(2);
    expect(workflowsUpdatePayload.snapshot.rules[0]).toMatchObject({
      severity: "warning",
      deliveryMode: "record_only",
      schedule: "market_hours",
      triggerWindowSeconds: 120,
      requiresOperatorAck: false,
    });
    expect(workflowsUpdatePayload.snapshot.rules[1]).toMatchObject({
      severity: "critical",
      deliveryMode: "operator_queue",
      schedule: "always",
      triggerWindowSeconds: 60,
      requiresOperatorAck: true,
    });

    const automationState = await request.get("/api/alerts/automation/state");
    expect(automationState.status()).toBe(200);
    const automationStatePayload = await automationState.json();
    expect(automationStatePayload.snapshot.runtime).toMatchObject({
      triggerEngine: "deterministic_local_rules",
      scheduler: "inactive",
      queue: "local_buffer_ready",
      delivery: "unconfigured",
      autoTrading: "blocked",
    });
    expect(automationStatePayload.snapshot.queue).toMatchObject({
      pending: 0,
      processing: 0,
      failed: 0,
    });
    expect(automationStatePayload.snapshot.triggers).toMatchObject({
      enabledRuleCount: 2,
      criticalRuleCount: 1,
      operatorAckRequiredCount: 1,
      scheduleMode: "deterministic_local",
    });

    const deliveryState = await request.get("/api/alerts/delivery/state");
    expect(deliveryState.status()).toBe(200);
    const deliveryStatePayload = await deliveryState.json();
    expect(deliveryStatePayload.snapshot.runtime).toMatchObject({
      activationMode: "operator_guarded",
      executionAuthority: "manual_operator",
      autoTrading: "blocked",
      liveExecution: "blocked",
    });
    expect(deliveryStatePayload.snapshot.triggerAction).toMatchObject({
      enabledRuleCount: 2,
      operatorAckRequiredCount: 1,
    });
    expect(Array.isArray(deliveryStatePayload.snapshot.deliveryState.blockedReasons)).toBe(
      true
    );

    const intelligence = await request.get(
      "/api/intelligence/context?symbol=EUR/USD&timeframe=5m"
    );
    expect(intelligence.status()).toBe(200);
    const intelligencePayload = await intelligence.json();
    expect(intelligencePayload.snapshot).toMatchObject({
      authenticated: true,
      availability: "bounded",
    });
    expect(intelligencePayload.snapshot.workflow.state).toBe("configured_local");
    expect(intelligencePayload.snapshot.execution.liveExecution).toBe("blocked");
    expect(intelligencePayload.snapshot.multiTimeframe.windows).toHaveLength(3);
    expect(intelligencePayload.snapshot.multiTimeframe.structureBias).toMatch(
      /trend_following|range_balanced|mixed_structure/
    );
    expect(intelligencePayload.snapshot.performance.disciplineScore).toBeGreaterThanOrEqual(
      0
    );
    expect(intelligencePayload.snapshot.performance.disciplineScore).toBeLessThanOrEqual(
      100
    );
    expect(intelligencePayload.snapshot.performance.stabilityScore).toBeGreaterThanOrEqual(
      0
    );
    expect(intelligencePayload.snapshot.performance.stabilityScore).toBeLessThanOrEqual(
      100
    );
    expect(intelligencePayload.snapshot.journal.qualitySignal).toMatch(
      /limited|emerging|structured/
    );
    expect(intelligencePayload.snapshot.coaching.mode).toBe("bounded_guidance");
    expect(intelligencePayload.snapshot.coaching.reviewWindowMinutes).toBeGreaterThan(0);
    expect(Array.isArray(intelligencePayload.snapshot.coaching.actions)).toBe(true);
    expect(Array.isArray(intelligencePayload.snapshot.coaching.degradedBoundaries)).toBe(
      true
    );
    expect(Array.isArray(intelligencePayload.snapshot.assist.workspaceActions)).toBe(true);
    expect(intelligencePayload.snapshot.truth.executionAuthority).toBe(
      "operator_manual"
    );
    expect(intelligencePayload.snapshot.truth).toMatchObject({
      modelScope: "deterministic_context",
      predictiveGuarantee: "none",
      winRateClaim: "none",
      liveExecution: "blocked",
    });
  });

  test("reports autonomous construction intelligence without uncontrolled execution", async ({
    request,
  }) => {
    const endpoints = [
      "/api/planet/consciousness",
      "/api/planet/events/readiness",
      "/api/planet/construction/queue",
      "/api/planet/codex/task-drafts",
      "/api/planet/validation/interpreter",
      "/api/planet/product-reality/score",
      "/api/planet/trust-governor",
      "/api/founder/construction/readiness",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(/api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i);
      expect(text).not.toMatch(/fake users active|fake revenue active|metrics active/i);
    }

    const consciousness = await (await request.get("/api/planet/consciousness")).json();
    expect(consciousness.snapshot).toMatchObject({
      mode: "tpm_planet_consciousness_layer",
      consciousnessStatus: "ready_readiness_only",
      truth: {
        readinessOnly: true,
        externalExecution: "not_enabled",
        productionActions: "blocked",
        secrets: "not_allowed",
        fakeMetrics: "not_allowed",
      },
    });
    expect(consciousness.snapshot.coreLoop).toEqual([
      "observe",
      "understand",
      "classify",
      "route",
      "decide",
      "draft",
      "validate",
      "learn",
      "report",
    ]);
    expect(consciousness.snapshot.blockedActions).toEqual(
      expect.arrayContaining([
        "live execution activation",
        "real-money routing",
        "broker/feed activation",
        "billing activation",
        "public launch",
        "production secret changes",
        "social publishing",
      ])
    );

    const events = await (await request.get("/api/planet/events/readiness")).json();
    expect(events.snapshot.eventTypes).toEqual(
      expect.arrayContaining(["assistant_context_missing"])
    );
    expect(events.snapshot.eventTypes).not.toContain("companion_context_missing");
    expect(events.snapshot.sampleEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "live_execution_requested",
          riskLevel: "critical",
          status: "blocked",
        }),
      ])
    );

    const queue = await (await request.get("/api/planet/construction/queue")).json();
    expect(queue.snapshot.summary).toMatchObject({
      total: expect.any(Number),
      blocked: expect.any(Number),
      externalExecutionActive: false,
    });
    expect(queue.snapshot.truth).toMatchObject({
      noAutomaticExternalSending: true,
      noUncontrolledExecution: true,
      blockedItemsStayBlocked: true,
    });
    expect(queue.snapshot.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "blocked",
          autonomyLevel: "blocked",
          blockedReason: expect.stringContaining("forbidden"),
        }),
      ])
    );

    const drafts = await (await request.get("/api/planet/codex/task-drafts")).json();
    expect(drafts.snapshot.truth).toMatchObject({
      externalCodexExecution: "not_enabled",
      taskSending: "not_enabled",
      approvalsExecuted: false,
      productionActions: "blocked",
    });
    expect(drafts.snapshot.drafts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          taskType: "blocked_live_request",
          autonomyLevel: "blocked",
          executionTruth: "draft_only_not_sent_not_executed",
        }),
      ])
    );

    const validation = await (
      await request.get("/api/planet/validation/interpreter")
    ).json();
    expect(validation.snapshot.samples.productTruthViolation).toMatchObject({
      status: "failed",
      blockers: expect.arrayContaining(["fake_activation_risk"]),
    });
    expect(validation.snapshot.truth.falsePassAllowed).toBe(false);

    const score = await (await request.get("/api/planet/product-reality/score")).json();
    expect(score.snapshot.scoring.truth).toMatchObject({
      humanAhmadAcceptanceRequired: true,
      launchReadyClaimAllowed: false,
      fakeMetricsAllowed: false,
    });
    expect(score.snapshot.digitalTwin.truth).toMatchObject({
      usersSeeFounderCommand: false,
      enterprisePublicLabelAllowed: false,
      performanceFeePubliclyVisible: false,
      fakeBillingLiveLaunchClaimsAllowed: false,
    });
    expect(score.snapshot.digitalTwin.layers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ role: "Free", founderCommandExposure: "hidden" }),
        expect.objectContaining({ role: "Founder", founderCommandExposure: "owner_only" }),
      ])
    );

    const trustGovernor = await (await request.get("/api/planet/trust-governor")).json();
    expect(trustGovernor.snapshot.samples.guaranteedProfit).toMatchObject({
      outcome: "blocked",
    });
    expect(trustGovernor.snapshot.truth).toMatchObject({
      hiddenFeesAllowed: false,
      pressureToTradeAllowed: false,
      fakePartnershipAllowed: false,
    });

    const founderConstruction = await (
      await request.get("/api/founder/construction/readiness")
    ).json();
    expect(founderConstruction.snapshot.access).toMatchObject({
      publicRouteExposed: false,
      publicNavigationVisible: false,
      userPlanAccess: false,
      readOnlyDefault: true,
    });
    expect(founderConstruction.snapshot.construction).toMatchObject({
      readiness: "readiness_only",
      externalExecutionActive: false,
    });
    expect(founderConstruction.snapshot.safety).toMatchObject({
      approvalExecutionActive: false,
      billingActivationActive: false,
      brokerFeedActivationActive: false,
      liveExecutionActive: false,
      realMoneyRoutingActive: false,
      socialPublishingActive: false,
      secretsExposed: false,
      fakeUsersIncluded: false,
      fakeRevenueIncluded: false,
      fakeMetricsIncluded: false,
    });
  });

  test("reports local universe operations without launch automation", async ({
    request,
  }) => {
    const endpoints = [
      "/api/local-ops/day-cycle",
      "/api/local-ops/readiness-law",
      "/api/local-ops/report",
      "/api/local-ops/digital-twin",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(/api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i);
      expect(text).not.toMatch(/fake users active|fake revenue active|metrics active/i);
    }

    const dayCycle = await (await request.get("/api/local-ops/day-cycle")).json();
    expect(dayCycle.snapshot).toMatchObject({
      mode: "local_day_cycle",
      operationMode: "local_closed_universe",
      summary: {
        totalStages: 21,
        launchCriteriaIncluded: false,
        productionCriteriaIncluded: false,
        billingCriteriaIncluded: false,
        realMoneyCriteriaIncluded: false,
        brokerFeedActivationIncluded: false,
        socialPublishingIncluded: false,
      },
      truth: {
        localOnly: true,
        paperSafe: true,
        readinessOnly: true,
        automaticLaunch: false,
      },
    });
    expect(dayCycle.snapshot.stages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "wake_start", order: 1 }),
        expect.objectContaining({ id: "sleep_archive", order: 21 }),
      ])
    );

    const readinessLaw = await (
      await request.get("/api/local-ops/readiness-law")
    ).json();
    expect(readinessLaw.snapshot).toMatchObject({
      mode: "local_readiness_law",
      successfulLocalDays: 0,
      readinessState: "not_started",
      truth: {
        automaticLaunch: false,
        founderApprovalAlwaysRequired: true,
        legalGuardianProductTruthGatesRequired: true,
        launchActionIncluded: false,
        productionActionIncluded: false,
      },
    });
    expect(readinessLaw.snapshot.thresholds).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          successfulLocalDays: 14,
          state: "launch_readiness_discussion_candidate",
          automaticLaunch: false,
          founderApprovalRequired: true,
        }),
      ])
    );

    const digitalTwin = await (
      await request.get("/api/local-ops/digital-twin")
    ).json();
    expect(digitalTwin.snapshot.summary).toMatchObject({
      profileCount: 9,
      testPersonaOnly: true,
      fakeUsersIncluded: false,
      privateUserDataIncluded: false,
      secretsIncluded: false,
    });
    expect(digitalTwin.snapshot.profiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "institutional_future_evaluator",
          testPersonaOnly: true,
        }),
      ])
    );

    const report = await (await request.get("/api/local-ops/report")).json();
    expect(report.snapshot).toMatchObject({
      mode: "local_operations_report",
      localDayNumber: 0,
      readinessState: "not_started",
      validationStatus: "not_run_for_today",
      gitStatus: "not_evaluated_by_snapshot",
      founderDecisionNeeded: true,
      truth: {
        localOnly: true,
        paperSafe: true,
        productionAction: "blocked",
        launchAction: "blocked",
        billingAction: "blocked",
        brokerFeedAction: "blocked",
        realMoneyAction: "blocked",
        socialPublishingAction: "blocked",
        fakeUsersMetricsRevenue: "not_allowed",
      },
    });
    expect(report.snapshot.launchForbiddenReminder).toContain(
      "Local maturity does not authorize public launch"
    );

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/local-ops/day-cycle" }),
        expect.objectContaining({ path: "/api/local-ops/readiness-law" }),
        expect.objectContaining({ path: "/api/local-ops/report" }),
        expect.objectContaining({ path: "/api/local-ops/digital-twin" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "local_operations",
          status: "ready",
        }),
      ])
    );

    const founderConstruction = await (
      await request.get("/api/founder/construction/readiness")
    ).json();
    expect(founderConstruction.snapshot.localUniverseOperations).toMatchObject({
      readiness: "readiness_only",
      launchAutomationActive: false,
      readinessLaw: {
        state: "not_started",
        automaticLaunch: false,
      },
      digitalTwin: {
        fakeUsersIncluded: false,
      },
    });
  });

  test("reports persistent product memory without secrets or surveillance", async ({
    page,
    request,
  }) => {
    const endpoints = [
      "/api/product-memory/summary",
      "/api/product-memory/founder-acceptance",
      "/api/product-memory/product-gaps",
      "/api/product-memory/local-day",
      "/api/product-memory/validation-summary",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(/api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i);
      expect(text).not.toMatch(/broker credential stored|social token stored/i);
      expect(text).not.toMatch(/fake users active|fake revenue active|metrics active/i);
    }

    const summary = await (await request.get("/api/product-memory/summary")).json();
    expect(summary.snapshot).toMatchObject({
      mode: "product_memory_summary",
      storage: {
        persistence: "deterministic_local_readiness_model",
        databaseMigrationCreated: false,
        productionStorageActive: false,
        externalSyncActive: false,
      },
      truth: {
        secretsStored: false,
        privateSensitiveDataStored: false,
        rawUserTrackingEnabled: false,
        fakeUsersStored: false,
        fakeRevenueStored: false,
        fakeMetricsStored: false,
        productionStorageActive: false,
        automaticExternalSync: false,
        launchAutomation: false,
      },
    });
    expect(summary.snapshot.policy).toMatchObject({
      surveillanceAllowed: false,
      secretPersistenceAllowed: false,
      rawSensitiveUserDataAllowed: false,
      fakeMetricsAllowed: false,
    });
    expect(summary.snapshot.rejectedExamples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sensitivity: "secret_forbidden",
          rejected: true,
        }),
      ])
    );
    expect(summary.snapshot.domainSummary).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ domain: "founder_acceptance" }),
        expect.objectContaining({ domain: "journal_note" }),
        expect.objectContaining({ domain: "decision_replay_note" }),
        expect.objectContaining({ domain: "build_decision" }),
        expect.objectContaining({ domain: "validation_summary" }),
        expect.objectContaining({ domain: "product_gap" }),
        expect.objectContaining({ domain: "local_day_report" }),
      ])
    );

    const fullSummary = await (
      await request.get("/api/product-memory/summary")
    ).json();
    expect(fullSummary.snapshot.founderSummary.forbiddenStorageReminders).toEqual(
      expect.arrayContaining(["production secrets", "API keys", "passwords"])
    );

    const founderAcceptance = await (
      await request.get("/api/product-memory/founder-acceptance")
    ).json();
    expect(founderAcceptance.snapshot.preferenceRules).toEqual(
      expect.arrayContaining([
        "no images unless explicitly requested",
        "Institutional replaces Enterprise in public language",
        "final visual acceptance requires Ahmad approval",
      ])
    );
    expect(founderAcceptance.snapshot.truth).toMatchObject({
      storesSecrets: false,
      storesPrivateSensitiveData: false,
      fakeAcceptanceRecords: false,
      launchApprovalRecorded: false,
    });

    const productGaps = await (
      await request.get("/api/product-memory/product-gaps")
    ).json();
    expect(productGaps.snapshot.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "gap-boxed-small-ui" }),
        expect.objectContaining({ id: "gap-chart-dominance" }),
        expect.objectContaining({ id: "gap-internal-language-leak" }),
        expect.objectContaining({ id: "gap-earth-mark-block" }),
        expect.objectContaining({ id: "gap-no-unrequested-images" }),
      ])
    );
    expect(productGaps.snapshot.truth).toMatchObject({
      fakeMetricsStored: false,
      privateUserDataStored: false,
      secretsStored: false,
    });

    const journalCoach = await (
      await request.get("/api/journal-coach/readiness")
    ).json();
    expect(journalCoach.snapshot.memoryFoundation).toMatchObject({
      persistence: "local_session_memory_foundation",
      accountSafePersistence: "planned",
      storesSensitivePersonalData: false,
      storesFinancialAdvice: false,
      storesOutcomeGuarantees: false,
    });
    expect(journalCoach.snapshot.memoryFoundation.forbiddenMemory).toEqual(
      expect.arrayContaining(["sensitive personal data", "advisory recommendations"])
    );

    const validationMemory = await (
      await request.get("/api/product-memory/validation-summary")
    ).json();
    expect(validationMemory.snapshot).toMatchObject({
      storagePolicy: "summary_only_no_raw_logs",
      truth: {
        rawLogsStored: false,
        secretsStored: false,
        falsePassAllowed: false,
        visualProofTrackedAsPresenceOnly: true,
      },
    });

    const localDayMemory = await (
      await request.get("/api/product-memory/local-day")
    ).json();
    expect(localDayMemory.snapshot.truth).toMatchObject({
      launchAutomation: false,
      productionAction: false,
      fakeUsersStored: false,
      fakeMetricsStored: false,
    });

    const founderConstruction = await (
      await request.get("/api/founder/construction/readiness")
    ).json();
    expect(founderConstruction.snapshot.persistentProductMemory).toMatchObject({
      readiness: "safe_local_internal_foundation",
      memorySafetyStatus: "safe_readiness_only",
      truth: {
        secretsStored: false,
        privateSensitiveDataStored: false,
        rawUserTrackingEnabled: false,
        fakeUsersStored: false,
        fakeRevenueStored: false,
        fakeMetricsStored: false,
      },
    });

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/product-memory/summary" }),
        expect.objectContaining({ path: "/api/product-memory/founder-acceptance" }),
        expect.objectContaining({ path: "/api/product-memory/product-gaps" }),
        expect.objectContaining({ path: "/api/product-memory/local-day" }),
        expect.objectContaining({ path: "/api/product-memory/validation-summary" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "product_memory",
          status: "ready",
        }),
      ])
    );

    await page.goto("/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Safe note readiness");
    await expect(page.locator("body")).toContainText("restricted credentials storage");
    await expect(page.locator("body")).not.toContainText(/Enterprise|TPM Companion/);
  });

  test("reports daily local operations memory loop without launch automation", async ({
    page,
    request,
  }) => {
    const requiredDailyLoopDocs = [
      "docs/product/local-daily-operations-loop.md",
      "docs/product/local-day-report-template.md",
      "docs/product/founder-acceptance-loop.md",
      "docs/product/product-memory-daily-use.md",
    ];

    for (const docPath of requiredDailyLoopDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const endpoints = [
      "/api/local-ops/daily-loop",
      "/api/local-ops/daily-report",
      "/api/product-memory/daily-summary",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(
        /(?:api[_-]?key|password|secret_value)\s*[:=]\s*["'][^"']{8,}/i
      );
      expect(text).not.toMatch(/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/);
      expect(text).not.toMatch(/"autoLaunch"\s*:\s*true/);
      expect(text).not.toMatch(/"launchAutomation"\s*:\s*true/);
      expect(text).not.toMatch(/"storesSecrets"\s*:\s*true/);
      expect(text).not.toMatch(/"storesPrivateSensitiveData"\s*:\s*true/);
      expect(text).not.toMatch(/"surveillanceActive"\s*:\s*true/);
    }

    const dailyLoop = await (
      await request.get("/api/local-ops/daily-loop")
    ).json();
    expect(dailyLoop.snapshot).toMatchObject({
      mode: "local_daily_operations_loop",
      status: "ready",
      summary: {
        totalStages: 14,
        launchCriteriaIncluded: false,
        automaticLaunch: false,
        productionActionIncluded: false,
        billingActionIncluded: false,
        brokerFeedActionIncluded: false,
        realMoneyActionIncluded: false,
        secretStorageIncluded: false,
        surveillanceIncluded: false,
      },
      truth: {
        localOnly: true,
        readinessOnly: true,
        paperSafe: true,
        storesSecrets: false,
        storesPrivateSensitiveData: false,
        createsSurveillance: false,
        autoLaunch: false,
      },
    });
    expect(dailyLoop.snapshot.stages.map((stage: { id: string }) => stage.id)).toEqual([
      "start",
      "inspect_build",
      "inspect_routes",
      "review_public_entry",
      "review_workstation",
      "review_assistant",
      "review_journal_coach",
      "review_settings_diagnostics",
      "record_founder_acceptance",
      "record_product_gaps",
      "draft_codex_task",
      "validate",
      "store_summary",
      "close_day",
    ]);
    expect(dailyLoop.snapshot.founderAcceptanceStates).toEqual([
      "accepted",
      "needs_polish",
      "confusing",
      "too_much",
      "missing",
      "blocked_by_design",
      "future",
    ]);

    const dailyReport = await (
      await request.get("/api/local-ops/daily-report")
    ).json();
    expect(dailyReport.snapshot).toMatchObject({
      mode: "local_daily_operations_report",
      dayNumber: 1,
      readiness: {
        state: "day_one_candidate",
        readyToStartLocalDayOne: true,
        ahmadReviewRequired: true,
        globalLaunchEvaluated: false,
      },
      scores: {
        scoreScale: "0_to_10",
        noPerfectScoreClaim: true,
        ahmadHumanAcceptanceRequired: true,
      },
      validation: {
        status: "not_run_for_today",
        rawLogsStored: false,
        falsePassAllowed: false,
      },
      gitClean: "not_evaluated_by_snapshot",
      truth: {
        localOnly: true,
        paperSafe: true,
        productionActive: false,
        launchActive: false,
        billingActive: false,
        brokerFeedActive: false,
        liveExecutionActive: false,
        realMoneyActive: false,
        socialPublishingActive: false,
        secretsStored: false,
        privateSensitiveDataStored: false,
        surveillanceActive: false,
        fakeUsersRevenueMetrics: false,
      },
    });
    expect(dailyReport.snapshot.launchForbiddenReminder).toContain(
      "does not authorize launch"
    );
    expect(dailyReport.snapshot.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "gap-boxed-small-ui",
          summary: expect.any(String),
        }),
        expect.objectContaining({
          id: "gap-chart-dominance",
          summary: expect.any(String),
        }),
      ])
    );
    for (const gap of dailyReport.snapshot.gaps) {
      expect(JSON.stringify(gap)).not.toMatch(/password|api key|secret value/i);
    }

    const dailySummary = await (
      await request.get("/api/product-memory/daily-summary")
    ).json();
    expect(dailySummary.snapshot).toMatchObject({
      mode: "product_memory_daily_summary",
      status: "ready",
      dailyLoop: {
        totalStages: 14,
        automaticLaunch: false,
      },
      productGaps: {
        safeSummaryOnly: true,
      },
      validation: {
        storagePolicy: "summary_only_no_raw_logs",
        rawLogsStored: false,
        secretsStored: false,
        falsePassAllowed: false,
      },
      buildDecisions: {
        externalCodexCalls: false,
        codeExecutionTriggered: false,
      },
      localDayReports: {
        launchAutomation: false,
      },
      truth: {
        secretsStored: false,
        privateSensitiveDataStored: false,
        rawUserTrackingEnabled: false,
        surveillanceActive: false,
        fakeUsersStored: false,
        fakeRevenueStored: false,
        fakeMetricsStored: false,
        productionStorageActive: false,
        automaticExternalSync: false,
        launchAutomation: false,
      },
    });

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.dailyOperationsMemoryLoop).toMatchObject({
      readiness: "ready",
      latestLocalDay: {
        dayNumber: 1,
        readinessState: "day_one_candidate",
        validationStatus: "not_run_for_today",
        gitClean: "not_evaluated_by_snapshot",
      },
      suggestedTask: {
        externalExecutionActive: false,
      },
      truth: {
        secretsStored: false,
        privateSensitiveDataStored: false,
        rawUserTrackingEnabled: false,
        surveillanceActive: false,
        launchAutomation: false,
      },
    });
    expect(founderCommand.snapshot.localUniverseOperations.dailyLoop).toMatchObject({
      totalStages: 14,
      automaticLaunch: false,
      secretStorageIncluded: false,
      surveillanceIncluded: false,
    });
    expect(founderCommand.snapshot.persistentProductMemory.dailySummary).toMatchObject({
      loopStages: 14,
      latestLocalDay: 1,
      automaticLaunch: false,
    });

    const founderCommandRoute = await request.get("/founder-command");
    expect([200, 404]).toContain(founderCommandRoute.status());
    expect(await founderCommandRoute.text()).not.toMatch(
      /Daily operations loop|Product memory daily summary|Secret storage/i
    );

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/local-ops/daily-loop" }),
        expect.objectContaining({ path: "/api/local-ops/daily-report" }),
        expect.objectContaining({ path: "/api/product-memory/daily-summary" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "daily_operations_loop",
          label: "Daily operations loop",
          status: "ready",
        }),
      ])
    );

    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    await expect(page.locator("body")).not.toContainText(
      /Founder Command|daily operations loop|construction memory/i
    );

    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expect(page.locator(".tpmv2-execution").first()).toContainText("Execution Panel");
    await expect(page.locator("body")).toContainText(/EUR\/USD|BTC\/USD|AAPL/i);
  });

  test("reports founder local command shell without public exposure or approval execution", async ({
    request,
  }) => {
    const endpoints = [
      "/api/founder/local-command/snapshot",
      "/api/founder/local-command/readiness",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(/api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i);
      expect(text).not.toMatch(/fake users active|fake revenue active|metrics active/i);
      expect(text).not.toMatch(/approvalExecutionActive":true/);
    }

    const snapshotPayload = await (
      await request.get("/api/founder/local-command/snapshot")
    ).json();
    const snapshot = snapshotPayload.snapshot;

    expect(snapshot).toMatchObject({
      mode: "founder_local_command_app_shell",
      access: {
        currentState: "owner_auth_required",
        ownerOnly: true,
        localOnly: true,
        publicRouteExposed: false,
        publicNavigationVisible: false,
        userPlanAccess: false,
        freeProVipInstitutionalAccess: false,
        readOnlyDefault: true,
        approvalExecution: "disabled",
        secretsVisible: false,
      },
      routeExposure: {
        apiSnapshotAdded: true,
        apiReadinessAdded: true,
        previewRouteCreated: false,
        publicNavigationVisible: false,
        userPlanExposure: false,
      },
      localCommandStatus: {
        ownerOnly: true,
        localOnly: true,
        approvalExecutionActive: false,
        publicRouteExposed: false,
      },
      truth: {
        noSecrets: true,
        noPrivateUserData: true,
        noFakeUsers: true,
        noFakeRevenue: true,
        noFakeMetrics: true,
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        brokerFeedActivation: "blocked",
        billing: "inactive",
        publicLaunch: "inactive",
        socialPublishing: "inactive",
        approvalExecution: "disabled",
        externalAutomation: "not_enabled",
      },
    });
    expect(snapshot.localOperations.dayCycle.totalStages).toBe(21);
    expect(snapshot.localOperations.readinessLaw.automaticLaunch).toBe(false);
    expect(snapshot.productMemory.truth).toMatchObject({
      secretsStored: false,
      privateSensitiveDataStored: false,
      fakeUsersStored: false,
      fakeRevenueStored: false,
      fakeMetricsStored: false,
    });
    expect(snapshot.constructionQueue.summary).toMatchObject({
      externalExecutionActive: false,
    });
    expect(snapshot.validation.truth).toMatchObject({
      rawLogsStored: false,
      secretsStored: false,
      falsePassAllowed: false,
    });
    expect(snapshot.treasuryMedia).toMatchObject({
      billingInactive: true,
      performanceFeeHiddenInactive: true,
      socialPublishingInactive: true,
      fakePartnershipClaimsAllowed: false,
      swissLegalCompanyClaimAllowed: false,
      islamicShariaCertificationClaimAllowed: false,
    });
    expect(snapshot.safety).toMatchObject({
      approvalExecutionActive: false,
      billingActivationActive: false,
      brokerFeedActivationActive: false,
      liveExecutionActive: false,
      realMoneyRoutingActive: false,
      socialPublishingActive: false,
      noPublicNavigation: true,
      noUserPlanExposure: true,
    });

    const readinessPayload = await (
      await request.get("/api/founder/local-command/readiness")
    ).json();
    expect(readinessPayload.snapshot).toMatchObject({
      mode: "founder_local_command_readiness",
      access: {
        ownerOnly: true,
        publicRouteExposed: false,
        publicNavigationVisible: false,
        userPlanAccess: false,
      },
      routeExposure: {
        previewRouteCreated: false,
        publicNavigationVisible: false,
        userPlanExposure: false,
      },
      localCommandStatus: {
        approvalExecutionActive: false,
        publicRouteExposed: false,
      },
      truth: {
        noSecrets: true,
        noPrivateUserData: true,
        noFakeUsers: true,
        noFakeRevenue: true,
        noFakeMetrics: true,
        approvalExecution: "disabled",
      },
    });
    expect(readinessPayload.snapshot.summaries.localDayStages).toBe(21);
    expect(readinessPayload.snapshot.summaries.memoryDomains).toBeGreaterThan(0);

    const hiddenPreviewRoute = await request.get("/founder/local-command");
    expect(hiddenPreviewRoute.status()).not.toBe(200);

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/founder/local-command/snapshot" }),
        expect.objectContaining({ path: "/api/founder/local-command/readiness" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "founder_local_command",
          status: "ready",
        }),
      ])
    );
  });

  test("reports founder build room as draft-only local construction guidance", async ({
    page,
    request,
  }) => {
    const response = await request.get("/api/founder/build-room/readiness");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).not.toMatch(/api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i);
    expect(text).not.toMatch(/fake users active|fake revenue active|metrics active/i);
    expect(text).not.toMatch(/approvalExecutionActive":true/);
    expect(text).not.toMatch(/noAutomaticCodexSending":false/);

    const payload = JSON.parse(text);
    expect(payload.snapshot).toMatchObject({
      mode: "founder_command_build_room",
      localMode: "local_laptop_universe",
      readinessStatus: "ready_for_local_build_drafting",
      routeExposure: {
        hiddenRouteCreated: false,
        apiReadinessAdded: true,
        publicNavigationVisible: false,
        userPlanExposure: false,
      },
      localDayReadiness: {
        readyToStartLocalDayOne: true,
        ahmadHumanReviewRequired: true,
        globalLaunchEvaluation: "not_evaluated",
      },
      truth: {
        noSecrets: true,
        noPrivateUserData: true,
        noFakeUsers: true,
        noFakeRevenue: true,
        noFakeMetrics: true,
        noAutomaticCodexSending: true,
        noUncontrolledAutomation: true,
        approvalExecutionActive: false,
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        brokerFeedActivation: "blocked",
        billing: "inactive",
        publicLaunch: "inactive",
        socialPublishing: "inactive",
      },
    });
    expect(payload.snapshot.codexTaskDrafts.length).toBeGreaterThanOrEqual(8);
    expect(payload.snapshot.codexTaskDrafts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Visual simplification and global trading polish",
        }),
        expect.objectContaining({ title: "Chart polish for local Day One acceptance" }),
        expect.objectContaining({ title: "TPM Assistant daily-use improvement" }),
        expect.objectContaining({ title: "Journal and Coach local reflection improvement" }),
        expect.objectContaining({ title: "Settings and Diagnostics cleanup" }),
        expect.objectContaining({ title: "Public entry local acceptance polish" }),
        expect.objectContaining({ title: "Local Day One blocker fix" }),
        expect.objectContaining({ title: "Regression and smoke test cleanup" }),
      ])
    );

    for (const draft of payload.snapshot.codexTaskDrafts) {
      expect(draft.executionTruth).toBe("draft_only_not_sent_not_executed");
      expect(draft.validationCommands).toEqual(
        expect.arrayContaining([
          "npx tsc --noEmit",
          "npm run test:regression",
          "git status --short",
        ])
      );
      expect(draft.scope.join(" ")).not.toMatch(
        /enable live|activate billing|activate broker|route real money|publish externally/i
      );
      expect(draft.productTruthRequirements).toEqual(
        expect.arrayContaining([
          "live execution blocked",
          "real money blocked",
          "broker/feed inactive",
          "billing inactive",
          "public launch inactive",
          "social publishing inactive",
        ])
      );
      expect(draft.prompt).toContain("FORBIDDEN:");
      expect(draft.prompt).toContain("VALIDATION:");
    }

    expect(payload.readiness).toMatchObject({
      mode: "founder_build_room_readiness",
      localMode: "local_laptop_universe",
      routeExposure: {
        hiddenRouteCreated: false,
        publicNavigationVisible: false,
        userPlanExposure: false,
      },
      summaries: {
        codexTaskDrafts: expect.any(Number),
        productGaps: expect.any(Number),
        visualGaps: expect.any(Number),
        validationCommands: expect.any(Number),
      },
      truth: {
        noAutomaticCodexSending: true,
        noUncontrolledAutomation: true,
        approvalExecutionActive: false,
      },
    });

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.founderBuildRoom).toMatchObject({
      readiness: "ready_for_local_build_drafting",
      localMode: "local_laptop_universe",
      routeExposure: {
        hiddenRouteCreated: false,
        publicNavigationVisible: false,
        userPlanExposure: false,
      },
      founderDecisionNeeded: true,
      truth: {
        noAutomaticCodexSending: true,
        noUncontrolledAutomation: true,
        approvalExecutionActive: false,
      },
    });

    const localCommand = await (
      await request.get("/api/founder/local-command/readiness")
    ).json();
    expect(localCommand.snapshot.summaries).toMatchObject({
      buildRoomDrafts: expect.any(Number),
      buildRoomReady: "ready_for_local_build_drafting",
    });

    const hiddenRoute = await request.get("/founder/build-room");
    expect(hiddenRoute.status()).not.toBe(200);

    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Founder Command Build Room");
    await expect(page.locator("body")).not.toContainText("Codex-ready task drafts");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/founder/build-room/readiness" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "founder_build_room",
          status: "ready",
        }),
      ])
    );
  });

  test("reports local day one acceptance gate without launch readiness claims", async ({
    page,
    request,
  }) => {
    const endpoints = [
      "/api/local-ops/day-one",
      "/api/local-ops/start-readiness",
      "/api/local-ops/day-one-operation",
      "/api/local-ops/final-report",
      "/api/product-reality/final-score",
      "/api/product-reality/local-start-score",
      "/api/founder/local-day-one/readiness",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(/api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i);
      expect(text).not.toMatch(/fake users active|fake revenue active|metrics active/i);
      expect(text).not.toMatch(/global launch ready|production active|billing active/i);
    }

    const dayOne = await (await request.get("/api/local-ops/day-one")).json();
    expect(dayOne.snapshot).toMatchObject({
      mode: "local_day_one_acceptance_gate",
      operationMode: "closed_local_product_review",
      gateStatus: "local_operations_ready",
      readyToStartLocalDayOne: true,
      ahmadHumanReviewRequired: true,
      globalLaunchEvaluation: "not_evaluated",
      summary: {
        total: 18,
        blocker: 0,
        needsAhmadReview: expect.any(Number),
      },
      truth: {
        localOnly: true,
        paperSafe: true,
        productionActive: false,
        billingActive: false,
        brokerFeedActive: false,
        liveExecutionActive: false,
        realMoneyActive: false,
        publicLaunchActive: false,
        socialPublishingActive: false,
        fakeUsersRevenueMetrics: false,
        globalLaunchReadinessClaimed: false,
      },
    });
    expect(dayOne.snapshot.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "chart_readiness",
          status: "needs_ahmad_review",
        }),
        expect.objectContaining({
          id: "git_validation_readiness",
          status: "partial",
        }),
        expect.objectContaining({
          id: "founder_command_privacy_readiness",
          status: "pass",
        }),
      ])
    );
    expect(dayOne.snapshot.commands).toEqual(
      expect.arrayContaining([
        "cd C:\\Users\\ahmad\\Desktop\\ALKON\\Pro Max\\Pro Max Trading\\pro-max-trading-platform",
        "npm run build",
        "npm start",
      ])
    );
    expect(dayOne.snapshot.routes).toEqual(
      expect.arrayContaining([
        "http://localhost:3000",
        "http://localhost:3000/trading",
        "http://localhost:3000/settings",
        "http://localhost:3000/diagnostics",
      ])
    );
    expect(dayOne.snapshot.reviewChecklist).toEqual(
      expect.arrayContaining([
        "Free plan clarity",
        "Pro planned clarity",
        "VIP planned clarity",
        "Institutional future clarity",
        "no fake activation",
      ])
    );
    expect(dayOne.snapshot.endOfDayChecklist).toEqual(
      expect.arrayContaining(["Git clean", "launch remains forbidden"])
    );
    expect(dayOne.snapshot.launchForbiddenReminder).toContain(
      "does not evaluate or authorize global launch"
    );

    const operation = await (
      await request.get("/api/local-ops/day-one-operation")
    ).json();
    expect(operation.snapshot).toMatchObject({
      mode: "local_day_one_operation_gate",
      status: "ready_with_notes",
      canStartLocalWork: true,
      canStartOnlyAs: "closed_local_paper_safe_review",
      ahmadHumanVisualAcceptanceRequired: true,
      ahmadVisualReviewRecorded: false,
      globalLaunchReadinessClaimed: false,
      truth: {
        localOnly: true,
        paperSafe: true,
        nonLaunch: true,
        nonProduction: true,
        billingActive: false,
        brokerFeedActive: false,
        liveExecutionActive: false,
        realMoneyActive: false,
        socialPublishingActive: false,
        fakeUsersRevenueMetrics: false,
        founderGoverned: true,
        globalLaunchReadinessClaimed: false,
      },
    });
    expect(operation.snapshot.reviewAreas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "chart", status: "needs_ahmad_review" }),
        expect.objectContaining({
          id: "founder_command_privacy",
          status: "pass",
        }),
        expect.objectContaining({
          id: "build_room_readiness",
          status: "pass",
        }),
      ])
    );
    expect(operation.snapshot.requiredScreenshots).toEqual(
      expect.arrayContaining([
        "public-entry-dark.png",
        "public-entry-light.png",
        "workstation-dark.png",
        "workstation-light.png",
        "chart-focus.png",
        "execution-ticket.png",
        "assistant-open.png",
        "journal-coach.png",
        "settings.png",
        "diagnostics.png",
        "plan-surfaces.png",
        "arabic-rtl-workstation.png",
      ])
    );
    expect(operation.snapshot.blockedByDesign).toEqual(
      expect.arrayContaining([
        "global launch",
        "production activation",
        "billing activation",
        "broker/feed activation",
        "live execution",
        "real-money routing",
        "social publishing",
      ])
    );

    const startReadiness = await (
      await request.get("/api/local-ops/start-readiness")
    ).json();
    expect(startReadiness.snapshot).toMatchObject({
      mode: "local_day_one_operation_gate",
      status: "ready_with_notes",
      canStartLocalWork: true,
      globalLaunchReadinessClaimed: false,
    });

    const finalReport = await (
      await request.get("/api/local-ops/final-report")
    ).json();
    expect(finalReport.snapshot).toMatchObject({
      mode: "local_operations_final_report",
      readinessState: "local_operations_ready",
      canStartLocalDayOne: true,
      ahmadHumanVisualReviewRequired: true,
      truth: {
        publicLaunchActive: false,
        productionActive: false,
        billingActive: false,
        brokerFeedActive: false,
        liveExecutionActive: false,
        realMoneyActive: false,
        socialPublishingActive: false,
        globalLaunchReadinessClaimed: false,
      },
    });
    expect(finalReport.snapshot.excludedFromLocalOperations).toEqual(
      expect.arrayContaining([
        "public launch",
        "production deployment",
        "billing and checkout",
        "real broker/feed credentials",
        "live-money order routing",
        "social account connection",
      ])
    );
    expect(finalReport.snapshot.blockedByDesign).toEqual(
      expect.arrayContaining([
        "global launch",
        "billing activation",
        "broker/feed activation",
        "live execution",
        "real-money routing",
        "social publishing",
      ])
    );

    const finalScore = await (
      await request.get("/api/product-reality/final-score")
    ).json();
    expect(finalScore.snapshot).toMatchObject({
      mode: "local_product_reality_final_score",
      status: "needs_human_review",
      ahmadHumanAcceptanceRequired: true,
      summary: {
        totalAreas: 18,
        blocker: 0,
      },
      truth: {
        scale: "0_to_10",
        noPerfectScoreClaim: true,
        ahmadVisualAcceptanceRequired: true,
        globalLaunchReadinessClaimed: false,
        fakeUsersRevenueMetrics: false,
      },
    });
    expect(finalScore.snapshot.overallScore).toBeGreaterThan(0);
    expect(finalScore.snapshot.overallScore).toBeLessThan(10);
    for (const area of finalScore.snapshot.areas) {
      expect(area.score).toBeLessThan(10);
      expect(area.score).toBeGreaterThanOrEqual(0);
      expect(area.blocker).toBeNull();
    }

    const localStartScore = await (
      await request.get("/api/product-reality/local-start-score")
    ).json();
    expect(localStartScore.snapshot).toMatchObject({
      mode: "local_start_product_reality_score",
      status: "ready_with_notes",
      ahmadHumanVisualAcceptanceRequired: true,
      summary: {
        totalAreas: 11,
        blocked: 0,
      },
      truth: {
        scale: "0_to_10",
        noPerfectScoreClaim: true,
        localOperationsOnly: true,
        globalLaunchReadinessClaimed: false,
        fakeUsersRevenueMetrics: false,
        billingActive: false,
        brokerFeedActive: false,
        liveExecutionActive: false,
        realMoneyActive: false,
        socialPublishingActive: false,
      },
    });
    expect(localStartScore.snapshot.overallScore).toBeGreaterThan(0);
    expect(localStartScore.snapshot.overallScore).toBeLessThan(10);
    expect(localStartScore.snapshot.areas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: "chart",
          status: "needs_ahmad_review",
        }),
        expect.objectContaining({
          area: "local_operations",
          status: "pass",
        }),
      ])
    );

    const founderDayOne = await (
      await request.get("/api/founder/local-day-one/readiness")
    ).json();
    expect(founderDayOne.snapshot).toMatchObject({
      mode: "founder_local_day_one_readiness",
      access: {
        ownerOnly: true,
        publicNavigationVisible: false,
        userPlanAccess: false,
      },
      localDayOne: {
        gateStatus: "local_operations_ready",
        readyToStartLocalDayOne: true,
        ahmadHumanReviewRequired: true,
        globalLaunchEvaluation: "not_evaluated",
      },
      productRealityFinalScore: {
        status: "needs_human_review",
        noPerfectScoreClaim: true,
      },
      operationGate: {
        status: "ready_with_notes",
        canStartLocalWork: true,
        canStartOnlyAs: "closed_local_paper_safe_review",
        ahmadHumanVisualAcceptanceRequired: true,
        ahmadVisualReviewRecorded: false,
      },
      productRealityLocalStartScore: {
        status: "ready_with_notes",
        noPerfectScoreClaim: true,
      },
      truth: {
        publicLaunchActive: false,
        noApprovalExecution: true,
        noSecrets: true,
        noPrivateSensitiveData: true,
      },
    });
    expect(founderDayOne.snapshot.safety).toMatchObject({
      approvalExecutionActive: false,
      billingActivationActive: false,
      brokerFeedActivationActive: false,
      liveExecutionActive: false,
      realMoneyRoutingActive: false,
      socialPublishingActive: false,
      publicLaunchActive: false,
    });

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.localDayOneAcceptance).toMatchObject({
      gateStatus: "local_operations_ready",
      readyToStartLocalDayOne: true,
      ahmadHumanReviewRequired: true,
      globalLaunchEvaluation: "not_evaluated",
      productRealityFinalScore: {
        status: "needs_human_review",
        noPerfectScoreClaim: true,
      },
      operationGate: {
        status: "ready_with_notes",
        canStartLocalWork: true,
        ahmadHumanVisualAcceptanceRequired: true,
      },
      productRealityLocalStartScore: {
        status: "ready_with_notes",
        noPerfectScoreClaim: true,
      },
      truth: {
        publicLaunchActive: false,
        globalLaunchReadinessClaimed: false,
      },
    });

    const localCommand = await (
      await request.get("/api/founder/local-command/readiness")
    ).json();
    expect(localCommand.snapshot.summaries).toMatchObject({
      localDayOneGate: "local_operations_ready",
      localDayOneReady: true,
      localDayOneAhmadReviewRequired: true,
    });

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/local-ops/day-one" }),
        expect.objectContaining({ path: "/api/local-ops/start-readiness" }),
        expect.objectContaining({ path: "/api/local-ops/day-one-operation" }),
        expect.objectContaining({ path: "/api/local-ops/final-report" }),
        expect.objectContaining({ path: "/api/product-reality/final-score" }),
        expect.objectContaining({
          path: "/api/product-reality/local-start-score",
        }),
        expect.objectContaining({ path: "/api/founder/local-day-one/readiness" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "local_day_one_acceptance",
          status: "ready",
        }),
        expect.objectContaining({
          key: "local_day_one_operation",
          status: "ready",
        }),
      ])
    );

    await page.goto("/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Local-only review readiness");
    await expect(page.locator("body")).toContainText("Local-only review");
    await expect(page.locator("body")).toContainText("Ready for local review");
    await expect(page.locator("body")).toContainText("Product reality score");
    await expect(page.locator("body")).not.toContainText(/Enterprise|TPM Companion/);
  });

  test("reports living brand intelligence without images or unsafe identity claims", async ({
    page,
    request,
  }) => {
    const endpoints = [
      "/api/brand-intelligence/summary",
      "/api/brand-intelligence/simulation",
      "/api/brand-intelligence/guardian",
      "/api/brand-intelligence/occasion-themes",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(/api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i);
      expect(text).not.toMatch(/fake users active|fake revenue active|metrics active/i);
      expect(text).not.toMatch(/Founder Command|Kingdom|\bministries\b|\bcouncils\b|Planet OS/i);
      expect(text).not.toMatch(/rasterAssetsUsed":true|externalImagesUsed":true/);
      expect(text).not.toMatch(/liveExecutionActivated":true|billingActivated":true/);
    }

    const summary = await (
      await request.get("/api/brand-intelligence/summary")
    ).json();
    expect(summary).toMatchObject({
      ok: true,
      status: "ready",
      publicPlanNames: ["Free", "Pro", "VIP", "Institutional"],
      publicAssistantName: "Pro Max Assistant",
      truth: {
        rasterAssetsUsed: false,
        externalImagesUsed: false,
        liveExecutionActivated: false,
        realMoneyActivated: false,
        brokerFeedActivated: false,
        billingActivated: false,
        publicLaunchActivated: false,
        fakeSwissClaim: false,
        publicInternalTerminologyLeakAllowed: false,
      },
    });
    expect(summary.defaultDecision).toMatchObject({
      earthMarkVariant: "public",
      earthMarkState: "paper_safe",
      motionIntensity: "low",
      occasionSkin: "default",
      publicSafe: true,
    });
    expect(summary.defaultDecision.allowedTerminology).toEqual(
      expect.arrayContaining([
        "Pro Max",
        "Pro Max Trading",
        "Pro Max Assistant",
        "Free",
        "Pro",
        "VIP",
        "Institutional",
      ])
    );
    expect(summary.defaultDecision.blockedTerminology.join(" ")).not.toContain(
      "Founder Command"
    );

    const simulation = await (
      await request.get("/api/brand-intelligence/simulation")
    ).json();
    expect(simulation.snapshot).toMatchObject({
      mode: "identity_surface_simulation",
      status: "ready",
      truth: {
        publicTerminologyChecked: true,
        chartMotionChecked: true,
        reducedMotionChecked: true,
        noFakeActivation: true,
        publicSafeOutput: true,
        restrictedVocabularyRedacted: true,
      },
    });
    expect(simulation.snapshot.simulations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          surface: "workstation",
          earthMarkVariant: "compact",
          motionIntensity: "low",
          chartPriority: "high",
        }),
        expect.objectContaining({
          surface: "restricted_surface",
          plan: "restricted_internal",
          audience: "internal",
        }),
      ])
    );

    const guardian = await (
      await request.get("/api/brand-intelligence/guardian")
    ).json();
    expect(guardian.snapshot).toMatchObject({
      mode: "identity_guardian",
      status: "ready",
      truth: {
        publicInternalTerminologyAllowed: false,
        fakeClaimsAllowed: false,
        chartDistractionAllowed: false,
        publicSafeOutput: true,
        restrictedVocabularyRedacted: true,
      },
    });
    expect(guardian.snapshot.samples.publicInternalTermLeak.outcome).toBe(
      "blocked"
    );
    expect(guardian.snapshot.samples.fakeSwissClaim.outcome).toBe("blocked");
    expect(guardian.snapshot.samples.chartHighMotion.outcome).toBe("blocked");
    expect(guardian.snapshot.blockedCategories).toEqual(
      expect.arrayContaining([
        "restricted command as user plan",
        "legacy non-public plan label",
        "fake Swiss legal/company claim",
      ])
    );

    const occasions = await (
      await request.get("/api/brand-intelligence/occasion-themes")
    ).json();
    expect(occasions.truth).toMatchObject({
      defaultOnlyAutoApplies: true,
      religiousCulturalThemesOptInOnly: true,
      founderApprovalRequiredForPublicOccasions: true,
      fakePartnershipAllowed: false,
    });
    expect(occasions.themes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "default", autoApplies: true }),
        expect.objectContaining({
          key: "ramadan_or_eid_optional",
          autoApplies: false,
          founderApprovalRequired: true,
        }),
        expect.objectContaining({
          key: "christmas_optional",
          autoApplies: false,
          founderApprovalRequired: true,
        }),
      ])
    );

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(
      founderCommand.snapshot.engineeringOpsQuality.livingBrandIntelligence
    ).toMatchObject({
      status: "ready",
      guardianStatus: "ready",
      rasterAssetsUsed: false,
      externalImagesUsed: false,
      publicInternalTerminologyLeakAllowed: false,
    });

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/brand-intelligence/summary" }),
        expect.objectContaining({ path: "/api/brand-intelligence/simulation" }),
        expect.objectContaining({ path: "/api/brand-intelligence/guardian" }),
        expect.objectContaining({
          path: "/api/brand-intelligence/occasion-themes",
        }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "living_brand_intelligence",
          status: "ready",
        }),
      ])
    );

    await page.goto("/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Living brand intelligence");
    await expect(page.locator("body")).toContainText("Identity decisions");
    await expect(page.locator("body")).toContainText("Occasion themes");
    await expect(page.locator("body")).not.toContainText(/Enterprise|TPM Companion/);
  });

  test("reports public security and cyber sovereignty readiness without unsafe scope", async ({
    page,
    request,
  }) => {
    const requiredSecurityDocs = [
      "docs/security/ministry-public-security-cyber-sovereignty.md",
      "docs/security/cyber-sovereignty-state.md",
      "docs/security/planet-immune-system.md",
      "docs/security/red-team-command.md",
      "docs/security/blue-team-defense.md",
      "docs/security/purple-team-operations.md",
      "docs/security/incident-response-doctrine.md",
      "docs/security/forensics-evidence-ledger.md",
    ];

    for (const docPath of requiredSecurityDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const redTeamDoctrine = fs.readFileSync(
      path.join(process.cwd(), "docs/security/red-team-command.md"),
      "utf8"
    );
    expect(redTeamDoctrine).toContain("owned local");
    expect(redTeamDoctrine).toContain("No third-party targeting");
    expect(redTeamDoctrine).toContain("No malware");
    expect(redTeamDoctrine).toContain("No credential theft");
    expect(redTeamDoctrine).toContain("No external attack automation");

    const founderResponse = await request.get("/api/founder/command/snapshot");
    expect(founderResponse.status()).toBe(200);
    const founderText = await founderResponse.text();
    expect(founderText).not.toMatch(
      /api[_-]?key\s*[:=]\s*["']?[A-Za-z0-9_-]{16,}/i
    );
    expect(founderText).not.toMatch(
      /password\s*[:=]\s*["']?[^"',\s]{8,}/i
    );
    expect(founderText).not.toMatch(/secret_value\s*[:=]/i);
    expect(founderText).not.toMatch(/AKIA[0-9A-Z]{16}/);

    const founderPayload = JSON.parse(founderText);
    const securitySovereignty =
      founderPayload.snapshot.engineeringOpsQuality.securitySovereignty;
    expect(securitySovereignty).toMatchObject({
      status: "ready",
      authorities: 13,
      redTeamReadiness: "readiness_only",
      blueTeamReadiness: "ready",
      purpleTeamReadiness: "ready",
      incidentReadiness: "ready",
      evidenceReadiness: "defined_no_secret_payloads",
      hardeningReadiness: "ready",
      blockedSampleDecisions: {
        thirdPartyRedTeam: "blocked",
        secretExposureAttempt: "blocked",
        launchAttempt: "blocked",
        billingAttempt: "blocked",
        liveExecutionAttempt: "blocked",
        realMoneyAttempt: "blocked",
        brokerFeedAttempt: "blocked",
        socialPublishingAttempt: "blocked",
        malwareExploitAttempt: "blocked",
        founderCommandPublicAttempt: "blocked",
      },
      localDefensiveReview: "allowed_with_logging",
      truth: {
        thirdPartyTargetingAllowed: false,
        malwareAllowed: false,
        credentialTheftAllowed: false,
        externalAttackAutomationAllowed: false,
        secretsExposed: false,
        liveExecutionActivated: false,
        realMoneyActivated: false,
        billingActivated: false,
        brokerFeedActivated: false,
        publicLaunchActivated: false,
        socialPublishingActive: false,
        founderCommandPublic: false,
        authWeakened: false,
      },
    });
    expect(securitySovereignty.decisionLevels).toEqual([
      "allowed_with_logging",
      "review_required",
      "founder_approval_required",
      "quarantined",
      "blocked",
      "incident_required",
    ]);

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "security_sovereignty",
          label: "Security sovereignty readiness",
          status: "ready",
        }),
      ])
    );
    expect(JSON.stringify(diagnostics)).not.toMatch(/secret_value\s*[:=]/i);

    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    await expect(page.locator("body")).not.toContainText(
      /Cyber Sovereignty|Red Team Command|Blue Team Defense|Purple Team|Founder Command|Security Command/i
    );
  });

  test("reports secrets authority and Founder Command protection without exposing values", async ({
    page,
    request,
  }) => {
    const requiredSecretDocs = [
      "docs/security/secrets-authority.md",
      "docs/security/founder-command-protection.md",
      "docs/security/owner-auth-readiness.md",
      "docs/security/secret-rotation-readiness.md",
      "docs/security/no-secret-exposure-policy.md",
    ];

    for (const docPath of requiredSecretDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const committedEnvFiles = spawnSync("git", ["ls-files", ".env*"], {
      cwd: process.cwd(),
      encoding: "utf8",
    }).stdout
      .split(/\r?\n/)
      .filter(Boolean);
    expect(committedEnvFiles).toEqual([
      ".env.production.example",
      ".env.staging.example",
    ]);

    const endpoints = [
      "/api/founder/secrets/readiness",
      "/api/founder/security/readiness",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(
        /(?:api[_-]?key|token|password|secret_value)\s*[:=]\s*["'][^"']{8,}/i
      );
      expect(text).not.toMatch(/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/);
      expect(text).not.toMatch(/"value"\s*:/i);
      expect(text).not.toMatch(/"rawSecret"\s*:/i);
    }

    const secrets = await (
      await request.get("/api/founder/secrets/readiness")
    ).json();
    expect(secrets.snapshot).toMatchObject({
      mode: "secrets_authority_readiness",
      status: "ready",
      supportedStates: [
        "not_configured",
        "configured",
        "missing",
        "invalid_format",
        "expired",
        "rotation_required",
        "blocked",
        "production_forbidden",
      ],
      environments: ["local", "staging_future", "production_future", "blocked"],
      categories: [
        "email",
        "social",
        "market_data",
        "broker_future",
        "billing_future",
        "monitoring_future",
        "founder_command",
        "github_vercel_domain_readiness",
      ],
      summary: {
        totalCategories: 8,
        rawValuesVisible: false,
        envFilesCommitted: false,
      },
      exposurePolicy: {
        rawValuesDisplayed: false,
        valuesLogged: false,
        valuesSentToAssistant: false,
        valuesSentToCodex: false,
        valuesStoredInProductMemory: false,
        valuesAllowedInScreenshots: false,
        envFilesAllowedInGit: false,
        presenceOnlyReporting: true,
      },
      truth: {
        rawSecretsExposed: false,
        apiKeysExposed: false,
        tokensExposed: false,
        passwordsExposed: false,
        secretsStoredInMemorySystems: false,
        secretsSentToAssistant: false,
        secretsSentToCodex: false,
        secretsLogged: false,
        envFilesCommitted: false,
        productionActivated: false,
        billingActivated: false,
        brokerFeedActivated: false,
        liveExecutionActivated: false,
        realMoneyRoutingActivated: false,
        socialPublishingActive: false,
        authWeakened: false,
      },
    });
    expect(secrets.snapshot.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "broker_future",
          state: "production_forbidden",
          valueVisible: false,
        }),
        expect.objectContaining({
          category: "billing_future",
          state: "production_forbidden",
          valueVisible: false,
        }),
        expect.objectContaining({
          category: "founder_command",
          state: "rotation_required",
          valueVisible: false,
        }),
      ])
    );
    for (const item of secrets.snapshot.items) {
      expect(item).toMatchObject({
        valueVisible: false,
        valueHashVisible: false,
        valueSourceVisible: false,
        founderCommandVisible: true,
      });
    }

    const founderSecurity = await (
      await request.get("/api/founder/security/readiness")
    ).json();
    expect(founderSecurity.snapshot).toMatchObject({
      mode: "founder_security_readiness",
      status: "ready",
      commandProtection: {
        ownerOnly: true,
        localOnly: true,
        passkeyWebAuthn: "planned",
        biometricDevice: "planned",
        pin: "planned",
        trustedDevice: "planned",
        stepUpConfirmation: "planned",
        auditReadiness: "readiness_only",
        noPublicRoute: true,
        publicNavigationVisible: false,
        userPlanAccess: false,
        rawSecretsVisible: false,
        approvalExecutionActive: false,
      },
      truth: {
        rawSecretsExposed: false,
        secretsSentToAssistant: false,
        secretsSentToCodex: false,
        productionActivated: false,
        billingActivated: false,
        brokerFeedActivated: false,
        liveExecutionActivated: false,
        realMoneyRoutingActivated: false,
        socialPublishingActive: false,
        founderCommandPublic: false,
        ownerOnly: true,
      },
    });

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(
      founderCommand.snapshot.engineeringOpsQuality.secretsAuthority
    ).toMatchObject({
      status: "ready",
      categories: 8,
      rawValuesVisible: false,
      envFilesCommitted: false,
      founderProtection: {
        ownerOnly: true,
        rawSecretsVisible: false,
        approvalExecutionActive: false,
      },
      truth: {
        rawSecretsExposed: false,
        secretsSentToAssistant: false,
        secretsSentToCodex: false,
        productionActivated: false,
        billingActivated: false,
      },
    });

    const companion = await (await request.get("/api/companion/context")).json();
    expect(companion.snapshot.safety).toMatchObject({
      secretsIncluded: false,
      brokerCredentialsIncluded: false,
      paymentDataIncluded: false,
      socialTokensIncluded: false,
      rawTokensIncluded: false,
    });
    expect(JSON.stringify(companion)).not.toMatch(/secrets_authority|"value"\s*:/i);

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/founder/secrets/readiness" }),
        expect.objectContaining({ path: "/api/founder/security/readiness" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "secrets_authority",
          label: "Secrets readiness",
          status: "ready",
        }),
      ])
    );

    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    await expect(page.locator("body")).not.toContainText(
      /Founder Command|Secrets Authority|raw secrets|passkey|WebAuthn/i
    );
  });

  test("reports world interface readiness without external connections or publishing", async ({
    page,
    request,
  }) => {
    const requiredWorldInterfaceDocs = [
      "docs/product/world-interface-layer.md",
      "docs/product/global-nervous-system.md",
      "docs/product/email-command-center.md",
      "docs/product/social-channel-readiness.md",
      "docs/product/world-interface-borders.md",
      "docs/product/quarantine-and-evidence-locker.md",
      "docs/product/diplomatic-response-system.md",
    ];

    for (const docPath of requiredWorldInterfaceDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const endpoints = [
      "/api/world-interface/readiness",
      "/api/world-interface/channels",
      "/api/world-interface/quarantine/readiness",
      "/api/founder/world-interface/readiness",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(
        /(?:api[_-]?key|password|secret_value)\s*[:=]\s*["'][^"']{8,}/i
      );
      expect(text).not.toMatch(/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/);
      expect(text).not.toMatch(/"connected"\s*:\s*true/);
      expect(text).not.toMatch(/"tokenStored"\s*:\s*true/);
      expect(text).not.toMatch(/"sendingEnabled"\s*:\s*true/);
      expect(text).not.toMatch(/"publishingEnabled"\s*:\s*true/);
      expect(text).not.toMatch(/"fakeMetricsIncluded"\s*:\s*true/);
    }

    const readiness = await (
      await request.get("/api/world-interface/readiness")
    ).json();
    expect(readiness.snapshot).toMatchObject({
      mode: "world_interface_readiness",
      status: "ready",
      channelStates: [
        "not_configured",
        "planned",
        "read_only_future",
        "draft_only",
        "approval_required",
        "publishing_enabled_later",
        "disabled",
        "blocked",
        "compromised",
        "rotation_required",
      ],
      classifierOutcomes: [
        "classify",
        "draft_reply",
        "review_required",
        "founder_approval_required",
        "quarantine",
        "blocked",
        "archive",
      ],
      channelSummary: {
        total: 18,
        connected: 0,
        tokenStored: 0,
        sendingEnabled: 0,
        publishingEnabled: 0,
      },
      quarantine: {
        status: "ready",
        evidenceLocker: "safe_metadata_only_no_tokens",
        secretRequestsQuarantined: true,
        suspiciousLinksQuarantined: true,
        fakePartnershipsQuarantined: true,
      },
      diplomaticResponse: {
        status: "draft_only",
        sendActive: false,
        publishActive: false,
        externalAutomationActive: false,
        founderApprovalRequiredForExternalSend: true,
      },
      founderCommandReadiness: {
        unifiedInboxReadiness: "readiness_only",
        channelHealth: "status_only",
        quarantineReadiness: "ready",
        draftReplies: "draft_only",
        legalGuardianQueues: "review_required",
        vipInstitutionalInterest: "classification_only",
        partnershipOpportunities: "founder_approval_required",
        brandProtectionAlerts: "quarantine_ready",
      },
      sampleClassifications: {
        supportRequest: { outcome: "draft_reply", externalActionAllowed: false },
        partnerRequest: {
          outcome: "founder_approval_required",
          founderApprovalRequired: true,
          externalActionAllowed: false,
        },
        mediaRequest: {
          outcome: "review_required",
          founderApprovalRequired: true,
          externalActionAllowed: false,
        },
        brandImpersonation: {
          outcome: "quarantine",
          externalActionAllowed: false,
        },
        scamAttempt: {
          outcome: "quarantine",
          externalActionAllowed: false,
        },
        secretRequest: {
          outcome: "quarantine",
          externalActionAllowed: false,
        },
      },
      truth: {
        realEmailConnected: false,
        supportInboxConnected: false,
        socialAccountsConnected: false,
        socialTokensStored: false,
        emailsSent: false,
        dmsSent: false,
        publishingActive: false,
        externalAutomationActive: false,
        spamAutomationActive: false,
        fakeFollowersIncluded: false,
        fakeViewsIncluded: false,
        fakeMetricsIncluded: false,
        secretsExposed: false,
        tokensExposed: false,
        privateDataStored: false,
        productionActivated: false,
        billingActivated: false,
        brokerFeedActivated: false,
        liveExecutionActivated: false,
      },
    });
    expect(readiness.snapshot.quarantine.reasons).toEqual(
      expect.arrayContaining([
        "scam",
        "phishing",
        "suspicious_links",
        "impersonation",
        "fake_partnership",
        "threats",
        "secret_requests",
      ])
    );
    expect(readiness.snapshot.channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: "email", label: "Email" }),
        expect.objectContaining({ category: "support", label: "Support" }),
        expect.objectContaining({ category: "partners", label: "Partners" }),
        expect.objectContaining({ category: "media", label: "Media" }),
        expect.objectContaining({ category: "legal", label: "Legal" }),
        expect.objectContaining({ category: "security", label: "Security" }),
        expect.objectContaining({ category: "vip", label: "VIP" }),
        expect.objectContaining({
          category: "institutional",
          label: "Institutional",
        }),
        expect.objectContaining({ category: "x_twitter", label: "X/Twitter" }),
        expect.objectContaining({ category: "instagram", label: "Instagram" }),
        expect.objectContaining({ category: "tiktok", label: "TikTok" }),
        expect.objectContaining({ category: "youtube", label: "YouTube" }),
        expect.objectContaining({ category: "linkedin", label: "LinkedIn" }),
        expect.objectContaining({ category: "facebook", label: "Facebook" }),
        expect.objectContaining({ category: "telegram", label: "Telegram" }),
        expect.objectContaining({ category: "discord", label: "Discord" }),
        expect.objectContaining({ category: "reddit", label: "Reddit" }),
        expect.objectContaining({
          category: "blog_newsroom",
          label: "Blog/Newsroom",
        }),
      ])
    );

    const channels = await (
      await request.get("/api/world-interface/channels")
    ).json();
    expect(channels.snapshot.summary).toMatchObject({
      total: 18,
      connected: 0,
      tokenStored: 0,
      sendingEnabled: 0,
      publishingEnabled: 0,
    });
    for (const channel of channels.snapshot.channels) {
      expect(channel).toMatchObject({
        connected: false,
        tokenStored: false,
        sendingEnabled: false,
        publishingEnabled: false,
      });
    }

    const quarantine = await (
      await request.get("/api/world-interface/quarantine/readiness")
    ).json();
    expect(quarantine.snapshot.samples).toMatchObject({
      brandImpersonation: {
        outcome: "quarantine",
        quarantineReasons: expect.arrayContaining(["impersonation"]),
      },
      scamAttempt: {
        outcome: "quarantine",
        quarantineReasons: expect.arrayContaining([
          "scam",
          "phishing",
          "suspicious_links",
        ]),
      },
      secretRequest: {
        outcome: "quarantine",
        quarantineReasons: expect.arrayContaining(["secret_requests"]),
      },
    });

    const founderWorldInterface = await (
      await request.get("/api/founder/world-interface/readiness")
    ).json();
    expect(founderWorldInterface.snapshot).toMatchObject({
      mode: "founder_world_interface_readiness",
      status: "ready",
      sampleOutcomes: {
        supportRequest: "draft_reply",
        partnerRequest: "founder_approval_required",
        mediaRequest: "review_required",
        brandImpersonation: "quarantine",
        scamAttempt: "quarantine",
        secretRequest: "quarantine",
      },
      truth: {
        socialAccountsConnected: false,
        socialTokensStored: false,
        emailsSent: false,
        dmsSent: false,
        publishingActive: false,
        externalAutomationActive: false,
        fakeMetricsIncluded: false,
        secretsExposed: false,
        founderCommandPublic: false,
      },
    });

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.worldInterfaceCommand).toMatchObject({
      readiness: "readiness_only",
      unifiedInbox: "readiness_only",
      channelHealth: "status_only",
      draftReplies: "draft_only",
      legalGuardianQueues: "review_required",
      partnershipOpportunities: "founder_approval_required",
      brandProtectionAlerts: "quarantine_ready",
      sampleOutcomes: {
        partnerRequest: "founder_approval_required",
        scamAttempt: "quarantine",
        secretRequest: "quarantine",
      },
      truth: {
        realEmailConnected: false,
        socialAccountsConnected: false,
        socialTokensStored: false,
        publishingActive: false,
        externalAutomationActive: false,
        fakeMetricsIncluded: false,
      },
    });

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/world-interface/readiness" }),
        expect.objectContaining({ path: "/api/world-interface/channels" }),
        expect.objectContaining({
          path: "/api/world-interface/quarantine/readiness",
        }),
        expect.objectContaining({
          path: "/api/founder/world-interface/readiness",
        }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "world_interface",
          label: "World interface readiness",
          status: "ready",
        }),
      ])
    );

    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    await expect(page.locator("body")).not.toContainText(
      /World Interface|Global Nervous System|unified inbox|quarantine|Founder Command/i
    );
  });

  test("reports Academy, Community, and VIP Rooms readiness without fake rooms or signals", async ({
    page,
    request,
  }) => {
    const requiredDocs = [
      "docs/product/academy-system.md",
      "docs/product/community-system.md",
      "docs/product/vip-rooms-system.md",
      "docs/product/academy-learning-paths.md",
      "docs/product/community-safety-policy.md",
      "docs/product/vip-room-rules.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const endpoints = [
      "/api/academy/readiness",
      "/api/community/readiness",
      "/api/vip-rooms/readiness",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(
        /(?:api[_-]?key|password|secret_value)\s*[:=]\s*["'][^"']{8,}/i
      );
      expect(text).not.toMatch(/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/);
      expect(text).not.toMatch(/"activeRooms"\s*:\s*true/);
      expect(text).not.toMatch(/"fakeMembers"\s*:\s*true/);
      expect(text).not.toMatch(/"fakeVipAccess"\s*:\s*true/);
      expect(text).not.toMatch(/"signalRooms"\s*:\s*true/);
      expect(text).not.toMatch(/"copyTrading"\s*:\s*true/);
      expect(text).not.toMatch(/"billingActive"\s*:\s*true/);
    }

    const academy = await (await request.get("/api/academy/readiness")).json();
    expect(academy.snapshot).toMatchObject({
      mode: "academy_readiness",
      status: "ready",
      planAccess: {
        free: "foundation_visible",
        pro: "planned_not_active",
        vip: "planned_not_active",
        institutional: "future",
      },
      safety: {
        educationalOnly: true,
        financialAdvice: false,
        tradingSignals: false,
        guaranteedProfitClaims: false,
        fakePlanActivation: false,
        guardianReviewRequired: true,
        legalClaimReviewRequired: true,
      },
      truth: {
        fakeUsers: false,
        fakeProgressMetrics: false,
        billingActive: false,
        liveExecutionActive: false,
        realMoneyActive: false,
        copyTradingActive: false,
        socialAccountsConnected: false,
        founderCommandPublic: false,
      },
    });
    expect(academy.snapshot.learningPaths).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ planLayer: "free", state: "active_foundation" }),
        expect.objectContaining({ planLayer: "pro", state: "planned" }),
        expect.objectContaining({ planLayer: "vip", state: "planned" }),
        expect.objectContaining({ planLayer: "institutional", state: "future" }),
      ])
    );
    expect(academy.snapshot.lessons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "platform_basics" }),
        expect.objectContaining({ key: "paper_trading_basics" }),
        expect.objectContaining({ key: "chart_basics" }),
        expect.objectContaining({ key: "why_blocked" }),
        expect.objectContaining({ key: "tpm_assistant_guide" }),
        expect.objectContaining({ key: "journal_coach_guide" }),
        expect.objectContaining({ key: "risk_safety_lessons" }),
      ])
    );

    const community = await (
      await request.get("/api/community/readiness")
    ).json();
    expect(community.snapshot).toMatchObject({
      mode: "community_readiness",
      status: "planned_only",
      safetyPolicy: {
        moderation: "guardian_required",
        legalReview: "claim_review_required",
        fakeProfitScreenshots: "blocked",
        signalRooms: "blocked",
        copyTrading: "blocked",
      },
      planAccess: {
        free: "learning_space_planned",
        pro: "room_planned",
        vip: "room_planned",
        institutional: "future",
      },
      truth: {
        activeRooms: false,
        fakeRooms: false,
        fakeMembers: false,
        liveChatActive: false,
        socialNetworkActive: false,
        socialAccountsConnected: false,
        billingActive: false,
        fakeProAccess: false,
        fakeVipAccess: false,
        founderCommandPublic: false,
      },
    });
    expect(community.snapshot.rooms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "free_learning_space", state: "planned" }),
        expect.objectContaining({ id: "pro_room", state: "planned" }),
        expect.objectContaining({ id: "vip_room", state: "planned" }),
        expect.objectContaining({ id: "feedback_room", state: "planned" }),
        expect.objectContaining({ id: "support_room", state: "planned" }),
      ])
    );
    expect(community.snapshot.safetyPolicy.rules).toEqual(
      expect.arrayContaining([
        "anti_scam",
        "no_fake_profit_screenshots",
        "no_signal_rooms",
        "no_copy_trading",
        "guardian_moderation",
        "legal_claim_review",
        "no_fake_members",
      ])
    );

    const vipRooms = await (
      await request.get("/api/vip-rooms/readiness")
    ).json();
    expect(vipRooms.snapshot).toMatchObject({
      mode: "vip_rooms_readiness",
      status: "planned_not_active",
      planAccess: {
        vip: "planned_not_active",
        pro: "not_vip_access",
        free: "not_vip_access",
        institutional: "future",
      },
      roomRules: {
        signalGuarantees: "blocked",
        copyTrading: "blocked",
        profitPromises: "blocked",
        fakeAccess: "blocked",
        fakeMembers: "blocked",
        guardianModerationRequired: true,
        legalClaimReviewRequired: true,
        founderApprovalRequiredBeforeActivation: true,
      },
      truth: {
        vipActive: false,
        privateRoomsActive: false,
        advancedCoachingActive: false,
        strategyReviewActive: false,
        premiumReportsActive: false,
        fakeVipAccess: false,
        fakeMembers: false,
        signalRooms: false,
        copyTrading: false,
        guaranteedProfitClaims: false,
        billingActive: false,
        founderCommandPublic: false,
      },
    });
    expect(vipRooms.snapshot.capabilities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "advanced_coaching", state: "planned_not_active" }),
        expect.objectContaining({ id: "strategy_review", state: "planned_not_active" }),
        expect.objectContaining({ id: "premium_reports", state: "planned_not_active" }),
        expect.objectContaining({ id: "private_rooms", state: "planned_not_active" }),
      ])
    );

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.academyCommunityVipReadiness).toMatchObject({
      readiness: "readiness_only",
      academy: {
        status: "ready",
        free: "foundation_visible",
        pro: "planned_not_active",
        vip: "planned_not_active",
        institutional: "future",
      },
      community: {
        status: "planned_only",
        guardianModeration: "guardian_required",
        legalReview: "claim_review_required",
      },
      vipRooms: {
        status: "planned_not_active",
        vipAccess: "planned_not_active",
        signalGuarantees: "blocked",
        copyTrading: "blocked",
        profitPromises: "blocked",
      },
      truth: {
        academyFakeUsers: false,
        communityActiveRooms: false,
        communityFakeMembers: false,
        vipActive: false,
        vipPrivateRoomsActive: false,
        copyTradingActive: false,
        billingActive: false,
        founderCommandPublic: false,
      },
    });

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/academy/readiness" }),
        expect.objectContaining({ path: "/api/community/readiness" }),
        expect.objectContaining({ path: "/api/vip-rooms/readiness" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "learning_community_vip",
          label: "Learning and community readiness",
          status: "ready",
        }),
      ])
    );

    await page.goto("/settings");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Academy");
    await expect(page.locator("body")).toContainText("Community");
    await expect(page.locator("body")).toContainText("VIP Rooms");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    await expect(page.locator("body")).not.toContainText(
      /Enterprise|Founder Command|active VIP room|active members|copy trading enabled|guaranteed profit/i
    );
  });

  test("reports Media Office and AI Video workflow readiness without publishing or unsafe claims", async ({
    page,
    request,
  }) => {
    const requiredDocs = [
      "docs/product/media-office-workflow.md",
      "docs/product/ai-video-studio-workflow.md",
      "docs/product/content-review-lifecycle.md",
      "docs/product/media-risk-classification.md",
      "docs/legal/media-claims-policy.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const endpoints = [
      "/api/media-office/readiness",
      "/api/ai-video-studio/readiness",
      "/api/content-review/readiness",
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(
        /(?:api[_-]?key|password|secret_value)\s*[:=]\s*["'][^"']{8,}/i
      );
      expect(text).not.toMatch(/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/);
      expect(text).not.toMatch(/"socialAccountsConnected"\s*:\s*true/);
      expect(text).not.toMatch(/"socialTokensPresent"\s*:\s*true/);
      expect(text).not.toMatch(/"externalPublishingActive"\s*:\s*true/);
      expect(text).not.toMatch(/"publishingActive"\s*:\s*true/);
      expect(text).not.toMatch(/"uploadActive"\s*:\s*true/);
      expect(text).not.toMatch(/"fakeFollowersIncluded"\s*:\s*true/);
      expect(text).not.toMatch(/"fakeViewsIncluded"\s*:\s*true/);
      expect(text).not.toMatch(/"fakeMetricsIncluded"\s*:\s*true/);
      expect(text).not.toMatch(/"billingActive"\s*:\s*true/);
      expect(text).not.toMatch(/"publicLaunchActive"\s*:\s*true/);
    }

    const mediaOffice = await (
      await request.get("/api/media-office/readiness")
    ).json();
    expect(mediaOffice.snapshot).toMatchObject({
      mode: "media_office_workflow_readiness",
      status: "draft_review_only",
      riskLevels: [
        "safe_draft",
        "review_required",
        "founder_approval_required",
        "blocked",
      ],
      noPublishingActive: true,
      truth: {
        socialAccountsConnected: false,
        socialTokensPresent: false,
        uploadActive: false,
        externalPublishingActive: false,
        publishingActive: false,
        fakeFollowersIncluded: false,
        fakeViewsIncluded: false,
        fakeMetricsIncluded: false,
        billingActive: false,
        publicLaunchActive: false,
        founderCommandPublic: false,
        brandNamesAllowedWithoutContract: false,
      },
    });
    expect(mediaOffice.snapshot.contentTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "education_post" }),
        expect.objectContaining({ type: "product_update" }),
        expect.objectContaining({ type: "trust_safety_post" }),
        expect.objectContaining({ type: "pro_educational_teaser" }),
        expect.objectContaining({ type: "vip_educational_teaser" }),
        expect.objectContaining({ type: "changelog" }),
        expect.objectContaining({ type: "community_announcement" }),
        expect.objectContaining({ type: "partnership_draft" }),
      ])
    );
    expect(mediaOffice.snapshot.lifecycle).toEqual([
      "idea",
      "draft",
      "brand_review",
      "guardian_review",
      "legal_review",
      "founder_approval",
      "scheduled_later",
      "blocked",
      "archived",
    ]);
    expect(mediaOffice.snapshot.lifecycle).not.toContain("published");
    expect(mediaOffice.snapshot.blockedClaims).toEqual(
      expect.arrayContaining([
        "guaranteed_profit",
        "win_rate",
        "fake_live_trading",
        "fake_billing",
        "fake_vip",
        "fake_sharia",
        "fake_partnership",
        "uncontracted_brand_use",
        "misleading_urgency",
      ])
    );
    expect(mediaOffice.snapshot.sampleReviews).toMatchObject({
      proTeaser: {
        riskLevel: "founder_approval_required",
        founderApprovalRequired: true,
        externalPublishingAllowed: false,
      },
      vipTeaser: {
        riskLevel: "founder_approval_required",
        founderApprovalRequired: true,
        externalPublishingAllowed: false,
      },
      partnershipDraft: {
        riskLevel: "founder_approval_required",
        founderApprovalRequired: true,
        externalPublishingAllowed: false,
      },
      guaranteedProfit: {
        riskLevel: "blocked",
        detectedBlockedClaims: expect.arrayContaining([
          "guaranteed_profit",
          "win_rate",
        ]),
        externalPublishingAllowed: false,
      },
    });

    const aiVideo = await (
      await request.get("/api/ai-video-studio/readiness")
    ).json();
    expect(aiVideo.snapshot).toMatchObject({
      mode: "ai_video_studio_workflow_readiness",
      status: "script_readiness_only",
      reviewWorkflow: {
        brandReview: true,
        guardianReview: true,
        legalReview: true,
        founderApprovalForSensitive: true,
        externalPublishingEnabled: false,
      },
      truth: {
        generationApiConnected: false,
        uploadActive: false,
        publishingActive: false,
        socialAccountsConnected: false,
        socialTokensPresent: false,
        fakeViewsIncluded: false,
        fakeFollowersIncluded: false,
        fakeMetricsIncluded: false,
        brandNamesAllowedWithoutContract: false,
        profitClaimsAllowed: false,
        publicLaunchActive: false,
      },
    });
    expect(aiVideo.snapshot.artifactTypes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "idea" }),
        expect.objectContaining({ type: "short_script" }),
        expect.objectContaining({ type: "long_script" }),
        expect.objectContaining({ type: "captions" }),
        expect.objectContaining({ type: "hashtags" }),
        expect.objectContaining({ type: "thumbnail_brief" }),
        expect.objectContaining({ type: "voiceover_brief" }),
        expect.objectContaining({ type: "scene_outline" }),
        expect.objectContaining({ type: "compliance_risk_score" }),
      ])
    );

    const contentReview = await (
      await request.get("/api/content-review/readiness")
    ).json();
    expect(contentReview.snapshot).toMatchObject({
      mode: "content_review_readiness",
      status: "review_gate_ready",
      lifecyclePolicy: {
        scheduledLaterIsFutureOnly: true,
        publishedStateIncluded: false,
        founderApprovalBeforeExternalUse: true,
        guardianLegalBeforeSensitiveClaims: true,
      },
      samples: {
        proTeaser: {
          riskLevel: "founder_approval_required",
          founderApprovalRequired: true,
        },
        vipTeaser: {
          riskLevel: "founder_approval_required",
          founderApprovalRequired: true,
        },
        partnershipDraft: {
          riskLevel: "founder_approval_required",
          founderApprovalRequired: true,
        },
        fakePartnership: {
          riskLevel: "blocked",
          detectedBlockedClaims: expect.arrayContaining(["fake_partnership"]),
        },
        guaranteedProfit: {
          riskLevel: "blocked",
          detectedBlockedClaims: expect.arrayContaining([
            "guaranteed_profit",
            "win_rate",
          ]),
        },
      },
    });
    expect(contentReview.snapshot.lifecycle).not.toContain("published");

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.mediaAiVideoWorkflowReadiness).toMatchObject({
      readiness: "draft_review_only",
      mediaOffice: {
        mode: "media_office_workflow_readiness",
        status: "draft_review_only",
      },
      aiVideoStudio: {
        mode: "ai_video_studio_workflow_readiness",
        status: "script_readiness_only",
      },
      reviewLifecycle: {
        mode: "content_review_readiness",
        publishedStateIncluded: false,
        samples: {
          partnershipDraft: "founder_approval_required",
          fakePartnership: "blocked",
          guaranteedProfit: "blocked",
        },
      },
      founderCommandQueue: {
        noPublishingActive: true,
      },
    });
    expect(founderCommand.snapshot.mediaAiVideoWorkflowReadiness.truth).toMatchObject({
      media: {
        socialAccountsConnected: false,
        socialTokensPresent: false,
        publishingActive: false,
        fakeMetricsIncluded: false,
      },
      aiVideo: {
        generationApiConnected: false,
        uploadActive: false,
        publishingActive: false,
        fakeMetricsIncluded: false,
      },
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/media-office/readiness",
        "/api/ai-video-studio/readiness",
        "/api/content-review/readiness",
      ])
    );

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/media-office/readiness" }),
        expect.objectContaining({ path: "/api/ai-video-studio/readiness" }),
        expect.objectContaining({ path: "/api/content-review/readiness" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "media_ai_video_workflow",
          label: "Media and video workflow readiness",
          status: "ready",
        }),
      ])
    );

    await page.goto("/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Updates");
    await expect(page.locator("body")).toContainText("Video scripts");
    await expect(page.locator("body")).toContainText("scheduled later");
    await expect(page.locator("body")).not.toContainText(
      /publish now|published|views active|secret token value|guaranteed profit|win-rate|Founder Command/i
    );
  });

  test("reports essential integrations and tooling readiness without activation", async ({
    page,
    request,
  }) => {
    const requiredDocs = [
      "docs/product/essential-integrations-hub.md",
      "docs/product/tooling-command-center.md",
      "docs/product/codex-operating-model.md",
      "docs/product/local-runtime-tooling.md",
      "docs/product/integration-priority-law.md",
      "docs/product/local-runtime-command-center.md",
      "docs/product/essential-account-provisioning.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const integrationEndpoints = [
      "/api/integrations/readiness",
      "/api/integrations/registry",
      "/api/integrations/account-provisioning",
      "/api/founder/tooling/readiness",
    ];

    for (const endpoint of integrationEndpoints) {
      const response = await request.get(endpoint);
      expect(response.status(), endpoint).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(
        /(?:api[_-]?key|token|password|secret_value)\s*[:=]\s*["'][^"']{8,}/i
      );
      expect(text).not.toMatch(/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/);
      expect(text).not.toMatch(/"value"\s*:/i);
      expect(text).not.toMatch(/"createsAccountAutomatically"\s*:\s*true/);
      expect(text).not.toMatch(/"connectsExternally"\s*:\s*true/);
      expect(text).not.toMatch(/"productCanExecuteCodex"\s*:\s*true/);
      expect(text).not.toMatch(/"productCanSendPromptsAutomatically"\s*:\s*true/);
    }

    const integrationsReadiness = await (
      await request.get("/api/integrations/readiness")
    ).json();
    expect(integrationsReadiness.snapshot.essentialHub).toMatchObject({
      mode: "essential_integrations_tooling_hub",
      status: "ready",
      founderCommandReadiness: {
        publicNavigationVisible: false,
        approvalExecutionActive: false,
        automaticExternalExecution: false,
      },
      diagnosticsReadiness: {
        publicSafeSection: true,
        exposesSecrets: false,
        exposesInternalCommandDetails: false,
      },
      truth: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        productionSecretsUntouched: true,
        socialPublishingInactive: true,
        noAutomaticExternalExecution: true,
        noAccountCreationAutomation: true,
        noSecretsExposed: true,
        fakeMetricsIncluded: false,
      },
    });
    expect(Object.keys(integrationsReadiness.snapshot.essentialHub.prioritySummary)).toEqual(
      expect.arrayContaining([
        "p0_local_required",
        "p1_soon",
        "p2_pre_launch",
        "p3_post_launch",
        "blocked_now",
      ])
    );

    const registry = await (
      await request.get("/api/integrations/registry")
    ).json();
    expect(registry.snapshot.registry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "billing-activation",
          priority: "blocked_now",
          currentStatus: "forbidden_now",
        }),
        expect.objectContaining({
          id: "broker-live",
          priority: "blocked_now",
          currentStatus: "forbidden_now",
        }),
        expect.objectContaining({
          id: "real-money-routing",
          priority: "blocked_now",
          currentStatus: "forbidden_now",
        }),
        expect.objectContaining({
          id: "production-secrets",
          priority: "blocked_now",
          currentStatus: "forbidden_now",
        }),
        expect.objectContaining({
          id: "automatic-social-publishing",
          priority: "blocked_now",
          currentStatus: "forbidden_now",
        }),
        expect.objectContaining({
          id: "external-autopilot",
          priority: "blocked_now",
          currentStatus: "forbidden_now",
        }),
      ])
    );

    const accountProvisioning = await (
      await request.get("/api/integrations/account-provisioning")
    ).json();
    expect(accountProvisioning.snapshot).toMatchObject({
      mode: "essential_account_provisioning_planner",
      status: "ready",
      noAccountCreationAutomation: true,
      noExternalConnection: true,
      noSecretsStored: true,
    });
    expect(accountProvisioning.snapshot.summary).toMatchObject({
      p0: expect.any(Number),
      p1: expect.any(Number),
      p2: expect.any(Number),
      p3: expect.any(Number),
      blocked: expect.any(Number),
    });

    const founderTooling = await (
      await request.get("/api/founder/tooling/readiness")
    ).json();
    expect(founderTooling.snapshot).toMatchObject({
      mode: "founder_tooling_readiness",
      status: "ready",
      codexReadiness: {
        productCanDraftPrompts: true,
        productCanSendPromptsAutomatically: false,
        productCanExecuteCodex: false,
        productCanExposeSecretsToCodex: false,
        productCanRequestBlockedActivation: false,
      },
      localRuntime: {
        webAppShellExecution: false,
        remoteCommandExecution: false,
        unsafeAutomation: false,
      },
      truth: {
        noAutomaticExternalExecution: true,
        noAccountCreationAutomation: true,
        noSecretsExposed: true,
      },
    });
    for (const command of founderTooling.snapshot.localRuntime.commands) {
      expect(command.executableFromWebApp).toBe(false);
      expect(command.allowedSurface).toBe("docs_readiness_only");
    }
    expect(founderTooling.snapshot.whatNotToConnectNow).toEqual(
      expect.arrayContaining([
        "billing activation",
        "broker/live execution",
        "real-money routing",
        "production secrets",
        "automatic social publishing",
        "external autopilot",
      ])
    );

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(
      founderCommand.snapshot.engineeringOpsQuality.essentialIntegrationsTooling
    ).toMatchObject({
      status: "ready",
      codex: {
        productCanDraftPrompts: true,
        productCanSendPromptsAutomatically: false,
        productCanExecuteCodex: false,
        productCanExposeSecretsToCodex: false,
      },
      truth: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        socialPublishingInactive: true,
        noAutomaticExternalExecution: true,
      },
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/integrations/readiness",
        "/api/integrations/registry",
        "/api/integrations/account-provisioning",
        "/api/founder/tooling/readiness",
      ])
    );

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "/api/integrations/readiness" }),
        expect.objectContaining({ path: "/api/integrations/registry" }),
        expect.objectContaining({ path: "/api/integrations/account-provisioning" }),
        expect.objectContaining({ path: "/api/founder/tooling/readiness" }),
      ])
    );
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "essential_integrations_tooling",
          label: "Tooling readiness",
          status: "ready",
        }),
      ])
    );

    await page.goto("/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Essential tooling readiness");
    await expect(page.locator("body")).toContainText("Terminal only");
    await expect(page.locator("body")).toContainText("External setup");
    await expect(page.locator("body")).not.toContainText(
      /Founder Command|Codex|GitHub|production secrets|automatic social publishing|external autopilot/i
    );

    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    await expect(page.locator("body")).not.toContainText(
      /Founder Command|Codex task|GitHub readiness|tooling command center|external autopilot/i
    );
  });

  test("keeps real-money execution blocked without exposing a live mode switch", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();

    await expect(page.getByRole("button", { name: "Real" })).toHaveCount(0);
    await expect(page.locator("body")).toContainText("Real money blocked");
    await expect(page.locator("body")).toContainText(
      "Live execution and real-money routing are blocked by product truth"
    );
    await expect(page.getByRole("button", { name: "Open paper buy" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Open paper sell" }).first()).toBeVisible();
  });
});
