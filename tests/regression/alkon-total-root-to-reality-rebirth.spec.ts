import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  classifyJarInput,
} from "../../lib/server/jar-build/classifier";
import { buildJarCommandPassportPreview } from "../../lib/server/jar-build/command-passport-bridge";
import { createJarExitPermit } from "../../lib/server/jar-build/exit-permit";
import { getJarRegistry } from "../../lib/server/jar-build/jar-registry";
import {
  getJarOneNextAction,
  prioritizeJarItems,
} from "../../lib/server/jar-build/prioritizer";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";

const ARTIFACT_DIR = path.join(
  "test-results",
  "alkon-total-root-to-reality-rebirth"
);

const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Alkon -0|Founder Command|Kernel|Zero Truth|Reality Trial|Jar System|Jar Build System|Reality Production|Self-Correction|Device Constellation|Pocket Universe|Local Builder|Command Passport|Wake Report internals|Treasury internals|Legal internals|Product Memory internals|Codex tasks|Result Tribunal|Risk Belt|Black Hole Zone|internal governance/i;
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const RASTER_ASSET_PATTERN = /\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)$/i;

async function openWithMode(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" = "dark",
  environmentMode = "adaptive"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ envKey, environment, theme, themeKey }) => {
      window.localStorage.clear();
      window.localStorage.setItem(themeKey, theme);
      window.localStorage.setItem(envKey, environment);
    },
    {
      envKey: ENVIRONMENT_MODE_STORAGE_KEY,
      environment: environmentMode,
      theme: themeMode,
      themeKey: THEME_STORAGE_KEY,
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

function collectFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) return collectFiles(fullPath);
    return [fullPath];
  });
}

async function expectNoPublicLeak(page: Page) {
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator('a[href^="/founder"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/api/founder"]')).toHaveCount(0);
}

test.describe("ALKON Total Root-to-Reality Rebirth", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("source-to-reality docs, root reports, and Jar logic exist", () => {
    const requiredPaths = [
      "docs/product/alkon-source-to-reality-operating-architecture.md",
      "docs/product/ahmad-source-law.md",
      "docs/product/alkon-root-law.md",
      "docs/product/alkon-minus-zero-private-origin-law.md",
      "docs/product/reality-trial-gate-law.md",
      "docs/product/pro-max-public-world-law.md",
      "docs/product/pro-max-trading-first-living-product-law.md",
      "docs/product/user-reality-feedback-loop.md",
      "docs/product/alkon-jar-build-system.md",
      "docs/product/alkon-jar-exit-permit-law.md",
      "reports/alkon-current-worktree-review.md",
      "reports/alkon-root-structure-status.md",
      "reports/source-to-reality-ownership-map.md",
      "reports/alkon-jar-status.md",
      "reports/alkon-jar-exit-permits.md",
    ];

    for (const requiredPath of requiredPaths) {
      expect(fs.existsSync(path.join(process.cwd(), requiredPath)), requiredPath).toBe(true);
    }

    const registry = getJarRegistry();
    expect(registry).toHaveLength(10);
    expect(registry.map((jar) => jar.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const unsafe = classifyJarInput({
      title: "Run shell and activate billing",
      source: "founder_instruction",
    });
    const heart = classifyJarInput({
      title: "Pro Max Trading chart cockpit rebuild",
      source: "rejection",
    });
    const founderDecision = classifyJarInput({
      title: "Ahmad visual acceptance decision",
      source: "founder_instruction",
    });
    const oneNextAction = getJarOneNextAction([heart, founderDecision]);
    expect(Array.isArray(oneNextAction)).toBe(false);
    expect(oneNextAction.title).toBe("Ahmad visual acceptance decision");
    expect(prioritizeJarItems([heart, unsafe])[0].jarId).toBe("jar_0_black_hole");

    const heartPermit = createJarExitPermit(heart);
    const heartPassport = buildJarCommandPassportPreview(heart, heartPermit);
    expect(heartPermit.exitPermitRequired).toBe(true);
    expect(heartPassport.status).toBe("preview_ready");

    const decisionPermit = createJarExitPermit(founderDecision);
    const decisionPassport = buildJarCommandPassportPreview(founderDecision, decisionPermit);
    expect(decisionPermit.requiresAhmadDecision).toBe(true);
    expect(decisionPassport.status).toBe("blocked_until_exit_permit");
  });

  test("public world routes Pro Max Center to Pro Max Trading without public leaks", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/", "dark");

    await expect(page.locator(".tpm-public-shell")).toHaveCount(1);
    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Center");
    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Trading");
    await expect(page.locator(".tpm-product-cta-primary").first()).toHaveAttribute(
      "href",
      "/trading"
    );
    await expect(
      page
        .locator(".tpm-foundation-nav-shell")
        .getByRole("link", { exact: true, name: "Trading Workspace" })
    ).toHaveAttribute("href", "/trading");
    await expect(page.locator(".tpm-public-shell .tpm-auth-panel-nav summary")).toHaveCount(1);
    await expect(page.locator('a[href="/en"]')).toHaveCount(0);
    await expectNoPublicLeak(page);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-pro-max-center.png"),
    });
    await screenshotLocator(page, ".tpm-foundation-nav-shell", "public-no-alkon-leak.png");

    await page.getByRole("link", { exact: true, name: "Enter workspace" }).click();
    await expect(page).toHaveURL(/\/trading$/);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "route-home-to-trading-proof.png"),
    });
  });

  test("Pro Max Trading living core is canonical, dominant, and paper-safe", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/trading", "dark");

    await expect(page).toHaveURL(/\/trading$/);
    await expect(page.locator('[data-shell-mode="workspace"]')).toHaveCount(1);
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await expect(page.locator(".tpm-terminal-topbar")).toHaveCount(1);
    await expect(page.locator(".tpm-terminal-topbar .tpm-brand-lockup")).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-shell .tpm-auth-panel-topbar summary")).toHaveCount(1);
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Paper-safe active");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Live inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Broker/feed inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Billing inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Real money blocked");

    const chart = page.locator(".tpm-living-chart-surface .tpmv2-chart-surface").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    await expect(chart).toBeVisible();
    await expect(execution).toBeVisible();
    const chartBox = await chart.boundingBox();
    const executionBox = await execution.boundingBox();
    expect(chartBox).not.toBeNull();
    expect(executionBox).not.toBeNull();
    expect(chartBox!.width).toBeGreaterThan(executionBox!.width * 2);
    expect(chartBox!.height).toBeGreaterThan(560);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-route-pro-max-trading.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-living-core-dark.png"),
    });
    await screenshotLocator(page, ".tpm-living-market-core-grid", "trading-chart-owns-page.png");
    await screenshotLocator(page, ".tpm-living-execution-rail", "trading-execution-arm-attached.png");

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload({ waitUntil: "domcontentloaded" });
    const ultraChartBox = await page
      .locator(".tpm-living-chart-surface .tpmv2-chart-surface")
      .first()
      .boundingBox();
    const ultraExecutionBox = await page.locator(".tpm-living-execution-rail").first().boundingBox();
    expect(ultraChartBox).not.toBeNull();
    expect(ultraExecutionBox).not.toBeNull();
    expect(ultraChartBox!.width).toBeGreaterThan(900);
    expect(ultraChartBox!.width).toBeGreaterThan(ultraExecutionBox!.width * 2);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "trading-ultrawide-no-empty-right.png"),
    });

    const assistantDetails = page.locator(".tpm-workspace-assistant-details").first();
    await expect(assistantDetails).not.toHaveAttribute("open", "");
    await page.evaluate(() => {
      const details = document.querySelector(".tpm-workspace-assistant-details");
      if (details instanceof HTMLDetailsElement) details.open = true;
    });
    const overlapState = await page.evaluate(() => {
      const assistantBox = document
        .querySelector(".tpm-workspace-assistant-dock")
        ?.getBoundingClientRect();
      const chartBox = document.querySelector(".tpmv2-chart-surface")?.getBoundingClientRect();
      const executionBox = document.querySelector(".tpmv2-execution")?.getBoundingClientRect();
      const overlaps = (a?: DOMRect, b?: DOMRect) =>
        Boolean(
          a &&
            b &&
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
        );

      return {
        chart: overlaps(assistantBox, chartBox),
        execution: overlaps(assistantBox, executionBox),
      };
    });
    expect(overlapState).toEqual({ chart: false, execution: false });
    await screenshotLocator(page, ".tpm-workspace-assistant-dock", "trading-assistant-open-no-cover.png");
  });

  test("Alkon -0 and Jar remain private Founder surfaces", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/founder/alkon", "dark");

    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Alkon -0");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Ask Alkon");
    await expect(page.locator(".alkon-sovereign-command-interface")).toContainText("Jar Build System");
    await expect(page.locator(".alkon-jar-build-panel")).toBeVisible();
    await expect(page.locator(".alkon-jar-command-passport-panel")).toBeVisible();
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-alkon-minus-zero.png"),
    });
    await screenshotLocator(page, ".alkon-jar-build-panel", "jar-build-panel.png");
    await screenshotLocator(page, ".alkon-jar-command-passport-panel", "jar-command-passport-panel.png");

    await openWithMode(page, "/founder/pocket", "dark");
    await expect(page.locator(".alkon-pocket-page")).toContainText("Alkon Pocket");
    await expect(page.locator(".alkon-pocket-page")).toContainText("Wake Report");
    await expect(page.locator(".alkon-pocket-page")).toContainText("One Next Action");
    await expect(page.locator(".alkon-pocket-page")).toContainText("Local Day One Gate");
    await expect(page.locator(".tpm-public-nav")).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-pocket-private.png"),
    });
  });

  test("Diagnostics, source, assets, and Product Truth remain safe", async ({
    page,
    request,
  }) => {
    await openWithMode(page, "/diagnostics", "dark");
    await expectNoPublicLeak(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });

    const truth = await request.get("/api/product/truth");
    expect(truth.status()).toBe(200);
    const payload = await truth.json();
    expect(payload.snapshot.summary).toMatchObject({
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      publicLaunch: "inactive",
      secrets: "not_exposed",
    });

    const sourceFiles = [
      "app/page.tsx",
      "app/trading/page.tsx",
      "modules/shell/components/PublicAppShell.tsx",
      "modules/founder-command/components/AlkonJarBuildPanel.tsx",
      "lib/server/jar-build/engine.ts",
      "lib/server/jar-build/classifier.ts",
      "app/theme-localization.css",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");
    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/new Function|eval\(/);
    expect(source).not.toMatch(/liveExecutionActive:\s*true/);
    expect(source).not.toMatch(/billingActivationActive:\s*true/);
    expect(source).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(source).not.toMatch(/realMoneyRoutingActive:\s*true/);

    const publicRasterAssets = collectFiles(path.join(process.cwd(), "public")).filter(
      (filePath) => RASTER_ASSET_PATTERN.test(filePath)
    );
    expect(publicRasterAssets).toEqual([]);
  });
});
