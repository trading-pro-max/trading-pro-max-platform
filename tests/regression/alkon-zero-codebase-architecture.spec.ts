import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "alkon-zero-codebase-architecture");
const OFFICIAL_PATH =
  "C:\\Users\\ahmad\\Desktop\\ALKON\\Pro Max\\Pro Max Trading\\pro-max-trading-platform";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|Founder Command|Kernel|Zero Truth|Reality Trial|Reality Production|Self-Correction|Device Constellation|Pocket Universe|Local Builder|Command Passport|Wake Report|internal governance/i;
const UNSAFE_PUBLIC_LINKS = [
  "/founder/alkon",
  "/founder/pocket",
  "/founder/command",
  "/api/founder",
];
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const RASTER_ASSET_PATTERN = /\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)$/i;

function readProjectFile(filePath: string) {
  return fs.readFileSync(path.join(process.cwd(), filePath), "utf8");
}

function listFilesRecursively(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  const entries = fs.readdirSync(root, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      return listFilesRecursively(fullPath);
    }

    return [fullPath];
  });
}

async function expectPublicSurfaceClean(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main").first()).toBeVisible();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);

  for (const href of UNSAFE_PUBLIC_LINKS) {
    await expect(page.locator(`a[href^="${href}"]`), href).toHaveCount(0);
  }
}

test.describe("Alkon Zero Codebase Architecture Recomposition", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("architecture doctrine and reports classify all seven ownership layers", () => {
    const requiredFiles = [
      "docs/product/alkon-zero-codebase-architecture.md",
      "docs/product/pro-max-public-private-folder-law.md",
      "docs/product/invisible-operating-layer-architecture.md",
      "docs/product/codebase-ownership-classification.md",
      "reports/alkon-codebase-architecture-map.md",
      "reports/alkon-cleanup-candidates.md",
    ];

    for (const filePath of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), filePath)), filePath).toBe(true);
    }

    const combined = requiredFiles.map(readProjectFile).join("\n");
    expect(combined).toContain(OFFICIAL_PATH);

    for (const layer of [
      "Public Pro Max Reality",
      "Private Alkon Universe",
      "Invisible Operating Layer",
      "Tools / Builder",
      "Tests / Evidence",
      "Docs / Reports",
      "Public Assets",
    ]) {
      expect(combined).toContain(layer);
    }

    expect(combined).toContain("cleanup_candidate");
    expect(combined).toContain("move_candidate");
    expect(combined).toContain("merge_candidate");
    expect(combined).toContain("protected_candidate");
    expect(combined).toContain("boundary_candidate");
    expect(combined).toContain("No broad core `app/`, `modules/`, or `lib/` moves");
    expect(combined).not.toMatch(SECRET_PATTERN);
  });

  test("local builder scaffold remains terminal-only and safe by default", () => {
    const requiredFiles = [
      "tools/alkon-local-builder/README.md",
      "tools/alkon-local-builder/config.json",
      "tools/alkon-local-builder/status.mjs",
      "tools/alkon-local-builder/wake.mjs",
      "tools/alkon-local-builder/next.mjs",
      "tools/alkon-local-builder/passport.mjs",
      "tools/alkon-local-builder/audit.mjs",
    ];

    for (const filePath of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), filePath)), filePath).toBe(true);
    }

    const packageJson = JSON.parse(readProjectFile("package.json")) as {
      scripts: Record<string, string>;
    };
    expect(packageJson.scripts["alkon:status"]).toBe("node tools/alkon-local-builder/status.mjs");
    expect(packageJson.scripts["alkon:wake"]).toBe("node tools/alkon-local-builder/wake.mjs");
    expect(packageJson.scripts["alkon:next"]).toBe("node tools/alkon-local-builder/next.mjs");
    expect(packageJson.scripts["alkon:passport"]).toBe("node tools/alkon-local-builder/passport.mjs");
    expect(packageJson.scripts["alkon:audit"]).toBe("node tools/alkon-local-builder/audit.mjs");

    const builderSource = requiredFiles.map(readProjectFile).join("\n");
    expect(builderSource).not.toMatch(/rm\s+-rf|Remove-Item|execSync|spawnSync|child_process/i);
    expect(builderSource).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(builderSource).not.toMatch(SECRET_PATTERN);
  });

  test("public Home and Diagnostics stay clean after architecture recomposition", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await expectPublicSurfaceClean(page, "/");
    await expect(page.locator("body")).toContainText("Pro Max Center");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-clean-after-architecture.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-no-alkon-leak.png"),
    });

    await expectPublicSurfaceClean(page, "/diagnostics");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });
  });

  test("Founder routes remain private identity routes", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto("/founder/alkon", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Alkon /");
    await expect(page.locator("body")).toContainText("Ask Alkon");
    await expect(page.locator("body")).toContainText("One Next Action");
    await expect(page.locator("body")).toContainText("Command Passport Preview");
    await expect(page.locator("body")).toContainText("Not started");
    await expect(page.locator("button")).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-alkon-after-architecture.png"),
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Alkon Pocket");
    await expect(page.locator("body")).toContainText("Open Ask Alkon");
    await expect(page.locator(`a[href="/founder/alkon"]`)).toHaveCount(1);
    await expect(page.locator("button")).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-pocket-after-architecture.png"),
    });
  });

  test("workspace route still works after architecture recomposition", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(/Trading Workspace|Execution Panel|Paper-safe/i);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "workspace-after-architecture.png"),
    });
  });

  test("Founder APIs are private-prefixed read-only previews", async ({ request }) => {
    const status = await request.get("/api/founder/alkon-chat/status");
    expect(status.status()).toBe(200);
    const payload = await status.json();
    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      previewOnly: true,
      noExecution: true,
      noShell: true,
      noPayments: true,
    });

    expect((await request.get("/api/alkon-chat/status")).status()).toBe(404);
    expect((await request.get("/api/founder/alkon-chat/message")).status()).toBe(405);
  });

  test("Product Truth, source boundaries, and public assets remain safe", async ({
    request,
  }) => {
    const truthResponse = await request.get("/api/product/truth");
    expect(truthResponse.status()).toBe(200);
    const truthPayload = await truthResponse.json();
    expect(truthPayload.snapshot.summary).toMatchObject({
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      publicLaunch: "inactive",
      founderCommand: "owner_only_private",
      secrets: "not_exposed",
    });

    const webSource = listFilesRecursively(path.join(process.cwd(), "app"))
      .concat(listFilesRecursively(path.join(process.cwd(), "modules")))
      .filter((filePath) => /\.(ts|tsx)$/.test(filePath))
      .map((filePath) => fs.readFileSync(filePath, "utf8"))
      .join("\n");

    expect(webSource).not.toMatch(/child_process|execSync|spawnSync|new Function|eval\(/);
    expect(webSource).not.toMatch(/liveExecutionActive:\s*true/);
    expect(webSource).not.toMatch(/billingActivationActive:\s*true/);
    expect(webSource).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(webSource).not.toMatch(/realMoneyRoutingActive:\s*true/);
    expect(webSource).not.toMatch(SECRET_PATTERN);

    const rasterAssets = listFilesRecursively(path.join(process.cwd(), "public")).filter((filePath) =>
      RASTER_ASSET_PATTERN.test(filePath)
    );
    expect(rasterAssets).toEqual([]);
  });
});
