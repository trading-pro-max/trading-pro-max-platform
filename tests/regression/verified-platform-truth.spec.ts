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
  "global-trading-platform-ui-redesign"
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
  await page.goto(pathName);
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
  expect(runtime.navDisplay).toBe("flex");

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
    expect(runtime.workstationDisplay).toBe("grid");
    expect(runtime.workstationColumns).not.toBe("none");
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
        text: /Trading workspace|Plans at a glance|Readiness stays honest/,
      },
      {
        path: "/en",
        expectedUrl: /\/en$/,
        text: /Trading Pro Max|Execution Panel|Decision/,
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
        "Trading Pro Max"
      );
      await expect(page.locator(".tpm-brand-mark svg").first()).toBeVisible();
      await expect(page.locator(".tpm-brand-mark img")).toHaveCount(0);
      await expect(page.locator(".tpm-foundation-nav-brand .tpm-earth-mark-compact").first()).toBeVisible();
      await expect(page.locator(".tpm-precision-clock").first()).toBeVisible();
      await expect(page.locator(".tpm-platform-pulse").first()).toBeVisible();
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
        /Founder Command|Founder King|Kingdom|\bministries\b|\bcouncils\b|Presidency|government model|Planet OS|Planet governance|\bPlanet\b|\bEnterprise\b|Owner command|Owner-only|owner-only|private command|internal governance|ruler|TPM Companion|Demo \/ Paper/i
      );

      if (route.path === "/") {
        await expect(page.locator(".tpm-product-entry").first()).toBeVisible();
        await expect(page.locator(".tpm-product-hero").first()).toBeVisible();
        await expect(page.locator(".tpm-product-workstation-shell").first()).toBeVisible();
        const heroMark = page.locator(".tpm-product-hero-logo .tpm-earth-mark-public").first();
        await expect(heroMark).toBeVisible();
        const heroMarkBox = await heroMark.boundingBox();
        expect(heroMarkBox?.width ?? 0).toBeGreaterThan(48);
        expect(heroMarkBox?.width ?? 0).toBeLessThanOrEqual(120);
        expect(heroMarkBox?.height ?? 0).toBeLessThanOrEqual(120);
        const heroMarkDetailCount = await heroMark.locator("circle, ellipse, path").count();
        expect(heroMarkDetailCount).toBeGreaterThanOrEqual(10);
        const heroMarkBackground = await heroMark.evaluate((element) =>
          window.getComputedStyle(element).backgroundColor
        );
        expect(heroMarkBackground).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
        await expect(page.locator("body")).toContainText(
          /Free paper-safe access|Swiss precision identity|Live execution blocked/
        );
        await expect(page.locator("body")).toContainText(
          /Plans at a glance|Free|Pro|VIP|Institutional|Familiar paper trading/
        );
        await expect(page.locator("body")).toContainText(
          /TPM Assistant|Basic guidance|Chart first|Paper-safe/
        );
        await expect(page.locator("body")).toContainText(
          /real-money|broker\/feed activation|billing/
        );
      }

      if (route.path === "/" || route.path === "/en") {
        await expect(page.locator(".tpmv2-command-center").first()).toBeVisible();
        await expect(page.locator(".tpmv2-brain-deck").first()).toBeHidden();
        await expect(page.locator(".tpmv2-workspace-depth-bar").first()).toBeVisible();
        await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
        const depthPanelOpacity = await page.locator(".tpmv2-chart-depth-panel").first().evaluate(
          (element) => Number.parseFloat(window.getComputedStyle(element).opacity)
        );
        expect(depthPanelOpacity).toBeLessThan(0.2);
        await expect(page.locator(".tpmv2-execution").first()).toBeVisible();
        await expect(page.locator(".tpmv2-ticket-preflight").first()).toBeVisible();
        await expect(page.locator(".tpmv2-ticket-activity").first()).toBeHidden();
        await expect(page.locator(".tpmv2-execution .tpm-why-blocked-hint").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /TPM Assistant|Market context|Paper-safe controls|Market depth/
        );
        await expect(page.locator("body")).toContainText(
          /Workspace focus|Watchlist|Layout-only|Market depth/
        );
        await expect(page.locator("body")).toContainText(
          /Paper access|Fallback-bound|Interpretive only|Live blocked/
        );
        await expect(page.locator("body")).toContainText("Fallback-bound");
        await expect(page.locator("body")).toContainText("Interpretive only");
        await expect(page.locator("body")).toContainText("Live blocked");
        if (route.path === "/en") {
          await page.locator(".tpm-companion-launcher").first().click();
          await expect(page.locator(".tpm-companion-panel").first()).toBeVisible();
          await expect(page.locator(".tpm-companion-panel").first()).toContainText(
            /Free Assistant|paper-safe guidance|Real money blocked/
          );
          await expect(page.locator(".tpm-companion-panel").first()).toContainText(
            /Ask safely|execute trade|enable live/
          );
          await page.getByLabel("Ask TPM Assistant").fill("enable live and real money");
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
          expect(companionLayout.chartWidth).toBeGreaterThan(620);
          expect(companionLayout.chartHeight).toBeGreaterThan(420);
          await page.getByRole("button", { name: "Close TPM Assistant" }).click();
        }
        const emptyStateNotice = page.locator(".tpm-state-notice[data-state='empty']").first();
        if (!(await emptyStateNotice.isVisible().catch(() => false))) {
          await page.locator(".tpmv2-blotter-toggle").first().click();
        }
        await expect(emptyStateNotice).toBeVisible();

        const chartBox = await page
          .locator(".tpmv2-chart-surface")
          .first()
          .boundingBox();
        const executionBox = await page
          .locator(".tpmv2-execution")
          .first()
          .boundingBox();

        expect(chartBox?.width ?? 0).toBeGreaterThan(620);
        expect(chartBox?.height ?? 0).toBeGreaterThan(420);
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
          /TPM Assistant|Free Assistant|Pro, VIP, and Institutional assistants remain locked/
        );
        await expect(page.locator("body")).toContainText(
          /Plan capability truth|Paper-session guidance|No financial advice/
        );
        await expect(page.locator("body")).toContainText(
          /Current plan|Plan capability truth|Familiar paper trading layer|Restricted controls stay separate/
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
        }
      }
    }
  });

  test("renders global theme modes, language fallback, and RTL/LTR surfaces", async ({
    page,
  }) => {
    fs.mkdirSync(THEME_ARTIFACT_DIR, { recursive: true });

    await openWithTheme(page, "/", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".tpm-theme-switcher").first()).toBeVisible();
    await expect(page.locator(".tpm-locale-select").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Trading workspace");
    await expectRuntimeCssApplied(page, "entry");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "dark-public-entry.png"),
    });

    await openWithTheme(page, "/", "light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectRuntimeCssApplied(page, "entry");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "light-public-entry.png"),
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
    expect(darkChartVisual.candleWidth).toBeGreaterThanOrEqual(8);
    expect(darkChartVisual.plotDirection).toBe("ltr");
    expect(darkChartVisual.priceScaleDirection).toBe("ltr");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "dark-workstation.png"),
    });
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "5", shiftKey: true }));
    });
    await expect(page.locator(".tpmv2-desktop-master").first()).toHaveClass(/focus-chart/);
    await darkChartSurface.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "chart-focus-dark.png"),
    });
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "4", shiftKey: true }));
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "english-ltr-workstation.png"),
    });

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
      path: path.join(THEME_ARTIFACT_DIR, "light-workstation.png"),
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
    await expectRuntimeCssApplied(page, "utility");
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "settings.png"),
    });
    await page.locator(".tpm-auth-panel-inline").first().screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "login-session-ui.png"),
    });

    await openWithTheme(page, "/de/settings", "light");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("lang", "de");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("body")).toContainText(
      "English fallback until German pack is reviewed"
    );
    await page.screenshot({
      fullPage: true,
      path: path.join(THEME_ARTIFACT_DIR, "language-fallback-coverage.png"),
    });

    await openWithTheme(page, "/ar/settings", "dark");
    await expect(page.locator(".tpm-foundation-frame")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("main").first()).toBeVisible();

    await openWithTheme(page, "/en/diagnostics", "dark");
    await expect(page.locator("body")).toContainText("Language coverage");
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
      await page.locator(".tpmv2-blotter-toggle").first().click();
    }
    await emptyStateNotice.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "empty-state.png"),
    });
    await page.locator(".tpmv2-workspace-depth-status").first().screenshot({
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

    const authPanel = page.locator(".tpm-auth-panel-inline").first();
    await authPanel.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "login-state.png"),
    });
    await authPanel.locator('input[name="email"]').fill(DEMO_EMAIL);
    await authPanel.locator('input[name="password"]').fill(DEMO_PASSWORD);
    await authPanel.getByRole("button", { name: "Sign in" }).click();

    await expect(authPanel).toContainText("Signed in");
    await expect(authPanel).toContainText(DEMO_EMAIL);
    await authPanel.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "session-state.png"),
    });

    const protectedAfterLogin = await page.request.get("/api/launch/operations");
    expect(protectedAfterLogin.status()).toBe(200);

    await authPanel.getByRole("button", { name: "Sign out" }).click();
    await expect(authPanel).toContainText("Sign in");
    await authPanel.screenshot({
      path: path.join(THEME_ARTIFACT_DIR, "logout-state.png"),
    });

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
    await expect(page.locator("body")).toContainText("Live blocked");
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
      assistantName: "TPM Assistant",
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
      expect.arrayContaining(["Chart", "Paper ticket", "TPM Assistant"])
    );
    expect(companionContextPayload.snapshot.planetAccess.lockedFeatures).toEqual(
      expect.arrayContaining(["advanced Assistant"])
    );
    expect(companionContextPayload.snapshot.planetAccess.hiddenFeatures).toEqual(
      expect.arrayContaining(["restricted controls", "revenue research"])
    );
    expect(companionContextPayload.snapshot.planAccess.visibleSurfaces).toEqual(
      expect.arrayContaining(["Chart", "Paper ticket", "TPM Assistant"])
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
    });
    expect(companionContextPayload.snapshot.blockedIntents).toEqual(
      expect.arrayContaining([
        "execute_trade",
        "enable_live",
        "enable_real_money",
        "activate_broker",
        "fake_billing",
        "fake_launch",
      ])
    );
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
      ])
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

  test("keeps real-money execution blocked when real mode is selected", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();

    await page.getByRole("button", { name: "Real" }).first().click();

    await expect(page.locator("body")).toContainText("Real");
    await expect(page.locator("body")).toContainText(
      "Order entry stays visible, but execution remains disabled"
    );
    await expect(page.getByRole("button", { name: "Open paper buy" }).first())
      .toBeDisabled();
    await expect(page.getByRole("button", { name: "Open paper sell" }).first())
      .toBeDisabled();
  });
});
