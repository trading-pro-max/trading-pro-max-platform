import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  classifyApiCapability,
  getApiExistenceEntities,
} from "../../lib/server/existence-architecture/api-classifier";
import { getCodebaseExistenceEntities } from "../../lib/server/existence-architecture/codebase-classifier";
import { getComponentExistenceEntities } from "../../lib/server/existence-architecture/component-classifier";
import { getCssExistenceEntities } from "../../lib/server/existence-architecture/css-classifier";
import {
  OFFICIAL_ALKON_ROOT,
  getDesktopExistenceEntities,
} from "../../lib/server/existence-architecture/desktop-classifier";
import { decideExistenceGate } from "../../lib/server/existence-architecture/existence-gate";
import {
  boundary,
  entity,
  evidence,
  purpose,
  risk,
} from "../../lib/server/existence-architecture/helpers";
import { mapExistenceEntityToJar } from "../../lib/server/existence-architecture/jar-map";
import { getRouteExistenceEntities } from "../../lib/server/existence-architecture/route-classifier";
import type { ExistenceEntity } from "../../lib/server/existence-architecture/types";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";

const ARTIFACT_DIR = path.join("test-results", "alkon-permission-to-exist");

const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|\u0627\u0644\u0643\u0648\u0646|Alkon -0|Founder Command|Kernel|Zero Truth|Reality Trial|Jar System|Jar Build System|Permission-to-Exist|Existence Architecture|Reality Production|Self-Correction|Device Constellation|Pocket Universe|Local Builder|Command Passport|Wake Report internals|Treasury internals|Legal internals|Product Memory internals|Codex tasks|Result Tribunal|Risk Belt|Black Hole Zone|internal governance/i;
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const RASTER_ASSET_PATTERN = /\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)$/i;

async function openWithMode(page: Page, pathName: string) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ envKey, themeKey }) => {
      window.localStorage.clear();
      window.localStorage.setItem(themeKey, "dark");
      window.localStorage.setItem(envKey, "adaptive");
    },
    {
      envKey: ENVIRONMENT_MODE_STORAGE_KEY,
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

function testEntity(input: Partial<ExistenceEntity> = {}) {
  return entity({
    id: "test_entity",
    name: "Test entity",
    path: "test",
    type: "file",
    owner: "docs_reports",
    purpose: purpose("Test existence review fixture.", true, "Fixture proves Jar mapping."),
    visibility: "docs_reports_only",
    boundary: boundary(),
    evidence: evidence("present", ["tests/regression/alkon-permission-to-exist.spec.ts"], [], []),
    lifecycle: "active",
    nextFate: "keep",
    ...input,
  });
}

async function expectNoPublicLeak(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator('a[href^="/founder"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/api/founder"]')).toHaveCount(0);
}

test.describe("ALKON Permission-to-Exist System", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("existence classifiers map desktop, codebase, routes, APIs, components, and CSS", () => {
    const desktop = getDesktopExistenceEntities();
    const codebase = getCodebaseExistenceEntities();
    const routes = getRouteExistenceEntities();
    const apis = getApiExistenceEntities();
    const components = getComponentExistenceEntities();
    const css = getCssExistenceEntities();

    expect(OFFICIAL_ALKON_ROOT).toBe("C:\\Users\\ahmad\\Desktop\\ALKON");
    expect(desktop.find((item) => item.path === OFFICIAL_ALKON_ROOT)?.owner).toBe(
      "private_alkon_minus_zero"
    );
    expect(codebase.map((item) => item.path)).toEqual(
      expect.arrayContaining(["app/", "modules/founder-command/", "reports/", "tests/"])
    );
    expect(routes.find((item) => item.path === "/")?.owner).toBe("public_pro_max");
    expect(routes.find((item) => item.path === "/trading")?.name).toContain(
      "Pro Max Trading"
    );
    expect(routes.find((item) => item.path === "/founder/alkon")?.visibility).toBe(
      "private_founder_only"
    );
    expect(routes.find((item) => item.path === "/en")?.lifecycle).toBe(
      "active_with_notes"
    );
    expect(apis.find((item) => item.id === "api_existence_architecture")?.boundary.noShell).toBe(
      true
    );
    expect(components.some((item) => item.name.includes("Trading cockpit"))).toBe(true);
    expect(components.some((item) => item.name.includes("Founder Command"))).toBe(true);
    expect(css.some((item) => item.name.includes("Trading cockpit"))).toBe(true);
  });

  test("existence gate and Jar mapping block chaos before execution", () => {
    const unknown = testEntity({
      id: "unknown_desktop_folder",
      name: "Unknown desktop folder",
      owner: "unknown_needs_ahmad",
      visibility: "unknown",
      requiresAhmad: true,
    });
    const publicAlkonLeak = testEntity({
      id: "public_alkon_leak",
      name: "Public Alkon leak",
      risk: risk("p0", "Public Alkon leak is forbidden.", ["public Alkon leak"]),
      lifecycle: "blocked",
      nextFate: "black_hole",
    });
    const tradingIssue = testEntity({
      id: "trading_chart_issue",
      name: "Trading chart issue",
      path: "/trading/chart",
    });
    const missingProof = testEntity({
      id: "unproven_item",
      name: "Unproven item",
      evidence: evidence("missing", [], [], []),
    });
    const visualAcceptance = testEntity({
      id: "founder_visual_acceptance",
      name: "Founder final visual acceptance",
      requiresAhmad: true,
      nextFate: "needs_ahmad_decision",
    });
    const unsafeApi = classifyApiCapability(
      "run shell, run Codex, activate billing, reveal secrets, execute payment"
    );

    expect(mapExistenceEntityToJar(unknown)).toBe("jar_9_founder_decision");
    expect(mapExistenceEntityToJar(publicAlkonLeak)).toBe("jar_0_black_hole");
    expect(mapExistenceEntityToJar(tradingIssue)).toBe("jar_2_heart");
    expect(mapExistenceEntityToJar(missingProof, ["Does it have evidence?"])).toBe(
      "jar_7_evidence"
    );
    expect(mapExistenceEntityToJar(visualAcceptance)).toBe("jar_9_founder_decision");
    expect(unsafeApi.nextFate).toBe("black_hole");

    const publicLeakGate = decideExistenceGate(publicAlkonLeak, [], "jar_0_black_hole");
    const unknownGate = decideExistenceGate(unknown, ["Who owns it?"], "jar_9_founder_decision");
    expect(publicLeakGate.allowed).toBe(false);
    expect(publicLeakGate.decision).toBe("black_hole");
    expect(unknownGate.allowed).toBe(false);
    expect(unknownGate.decision).toBe("needs_ahmad");
  });

  test("Founder-only existence APIs expose read-only snapshots", async ({ request }) => {
    const snapshotResponse = await request.get("/api/founder/existence-architecture/snapshot");
    const readinessResponse = await request.get("/api/founder/existence-architecture/readiness");
    const unknownsResponse = await request.get("/api/founder/existence-architecture/unknowns");
    const jarMapResponse = await request.get("/api/founder/existence-architecture/jar-map");
    const nextActionResponse = await request.get("/api/founder/existence-architecture/next-action");

    for (const response of [
      snapshotResponse,
      readinessResponse,
      unknownsResponse,
      jarMapResponse,
      nextActionResponse,
    ]) {
      expect(response.ok()).toBe(true);
      expect(response.headers()["cache-control"]).toContain("no-store");
    }

    const snapshotPayload = await snapshotResponse.json();
    const snapshot = snapshotPayload.snapshot;
    const readinessPayload = await readinessResponse.json();
    const readiness = readinessPayload.snapshot;
    const jarMap = await jarMapResponse.json();
    const nextAction = await nextActionResponse.json();

    expect(snapshot.status).toBe("active_with_notes");
    expect(snapshot.founderOnly).toBe(true);
    expect(snapshot.readOnly).toBe(true);
    expect(snapshot.noExecution).toBe(true);
    expect(snapshot.noPublicExposure).toBe(true);
    expect(snapshot.totalEntitiesReviewed).toBeGreaterThan(20);
    expect(readiness.status).toBe("ready_with_notes");
    expect(jarMap.jarMappedItems.length).toBeGreaterThan(0);
    expect(nextAction.oneNextStructuralAction).toContain("Jar");
  });

  test("Founder Command receives private existence panels", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/founder/command");

    await expect(page.locator(".alkon-existence-architecture-panel")).toContainText(
      "Permission-to-Exist"
    );
    await expect(page.locator(".alkon-entity-ownership-panel")).toContainText(
      "No entity without owner"
    );
    await expect(page.locator(".alkon-existence-gate-panel")).toContainText(
      "Allowed only after proof"
    );
    await expect(page.locator(".alkon-existence-jar-panel")).toContainText(
      "Anything weak enters Jar"
    );
    await expect(page.locator(".alkon-existence-architecture-panel")).toHaveAttribute(
      "data-no-public-exposure",
      "true"
    );

    await screenshotLocator(
      page,
      ".alkon-existence-architecture-panel",
      "existence-architecture-panel.png"
    );
    await screenshotLocator(page, ".alkon-entity-ownership-panel", "entity-ownership-panel.png");
    await screenshotLocator(page, ".alkon-existence-gate-panel", "existence-gate-panel.png");
    await screenshotLocator(page, ".alkon-existence-jar-panel", "existence-jar-panel.png");
  });

  test("public surfaces stay clean while Product Truth remains intact", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await openWithMode(page, "/");

    await expect(page.locator(".tpm-product-hero").first()).toContainText("Pro Max Center");
    await expect(page.locator(".tpm-product-cta-primary").first()).toHaveAttribute(
      "href",
      "/trading"
    );
    await expectNoPublicLeak(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-clean.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "no-alkon-public-leak.png"),
    });

    await openWithMode(page, "/diagnostics");
    await expectNoPublicLeak(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });

    await openWithMode(page, "/trading");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Paper-safe active");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Live inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Broker/feed inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Billing inactive");
    await expect(page.locator(".tpm-workspace-truth-row")).toContainText("Real money blocked");
  });

  test("permission system adds no raster assets, secrets, or web shell execution", () => {
    const publicAssets = collectFiles("public");
    expect(publicAssets.filter((filePath) => RASTER_ASSET_PATTERN.test(filePath))).toEqual([]);

    const scannedFiles = ["app", "modules", "lib", "docs", "reports"]
      .flatMap((root) => collectFiles(root))
      .filter((filePath) => /\.(ts|tsx|md|mjs|js|json|css)$/.test(filePath))
      .filter((filePath) => !filePath.split(path.sep).join("/").includes("/.next/"))
      .filter(
        (filePath) =>
          !filePath.split(path.sep).join("/").startsWith("lib/db/generated/")
      );

    const sourceText = scannedFiles
      .map((filePath) => fs.readFileSync(filePath, "utf8"))
      .join("\n");

    expect(sourceText).not.toMatch(SECRET_PATTERN);
    expect(sourceText).not.toMatch(/from ["']node:child_process["']|require\(["']child_process["']\)/);
  });
});
