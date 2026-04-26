import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import type { AlkonUniverseSnapshot } from "../../lib/server/alkon/types";

const ARTIFACT_DIR = path.join(
  "test-results",
  "alkon-private-command-universe"
);
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Universal Command|Earth Command|Moon Command|Orbit Command|Solar Command|Planetary Systems|Defense Universe|Construction Universe|Memory Universe|World Interface|Result Tribunal|Codex Government|Security Sovereignty|Secrets Authority|Founder Command|Founder King|Owner controls|Founder Idea Inbox|Local Operations|\bministries\b|\bcouncils\b|\bgovernance\b|construction queue|Codex tasks|treasury controls|product memory internals|local operations internals/i;
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key|secret token value|password value/i;
const PUBLIC_COSMIC_FORBIDDEN_TERMS =
  /Cosmic Operating Physics|Gravity Priority|Orbit Path|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Task Passport|Codex License/i;

async function openDark(page: Page, route: string) {
  await page.goto(route);
  await page.evaluate(
    ({ key }) => window.localStorage.setItem(key, "dark"),
    { key: THEME_STORAGE_KEY }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

test.describe("Alkon private command universe", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("defines Alkon as private Founder-only command universe", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-private-command-universe.md",
      "docs/product/alkon-command-doctrine.md",
      "docs/product/alkon-earth-public-world.md",
      "docs/product/alkon-moon-cycle.md",
      "docs/product/alkon-orbit-command.md",
      "docs/product/alkon-solar-command.md",
      "docs/product/alkon-planetary-systems.md",
      "docs/product/alkon-defense-universe.md",
      "docs/product/alkon-construction-universe.md",
      "docs/product/alkon-memory-universe.md",
      "docs/product/alkon-world-interface.md",
      "docs/product/alkon-public-private-boundaries.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const response = await request.get("/api/founder/alkon/readiness");
    expect(response.status()).toBe(200);
    const payload = (await response.json()) as { snapshot: AlkonUniverseSnapshot };
    const snapshot = payload.snapshot;

    expect(snapshot).toMatchObject({
      universeId: "alkon_private_command_universe",
      name: "Alkon",
      arabicName: "الكون",
      visibility: "private_founder_only",
      publicExposure: false,
      apiExposure: {
        publicAlkonRoutesExposed: false,
        founderReadinessRoute: "/api/founder/alkon/readiness",
        routeMode: "read_only_status_only",
        secretsExposed: false,
        privateSensitiveDataExposed: false,
        executionEndpointsExposed: false,
      },
      productTruthStatus: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        publicLaunchInactive: true,
        socialPublishingInactive: true,
        productionSecretsUntouched: true,
        noFakeUsersRevenueMetrics: true,
        noShellExecutionFromWebApp: true,
        noDirectCodexExecutionFromWebApp: true,
        noPublicAlkonExposure: true,
      },
    });
    expect(snapshot.universeMap.map((system) => system.id)).toEqual([
      "earth_command",
      "moon_cycle",
      "orbit_command",
      "solar_command",
      "planetary_systems",
      "defense_universe",
      "construction_universe",
      "memory_universe",
      "world_interface",
      "invisible_operating_layer",
    ]);
    expect(snapshot.universeMap.every((system) => !system.publicVisible)).toBe(true);
    expect(snapshot.universeMap.every((system) => system.founderVisible)).toBe(true);
    expect(snapshot.blockedActions.join(" ")).toMatch(
      /shell commands|billing|broker\/feed|live execution|real money|social publishing/i
    );
    expect(JSON.stringify(snapshot)).not.toMatch(SECRET_PATTERN);
    expect(JSON.stringify(snapshot)).not.toMatch(/"fakeMetricsIncluded"\s*:\s*true/);
  });

  test("keeps Alkon API founder-only, read-only, and status-only", async ({
    request,
  }) => {
    for (const publicRoute of [
      "/api/alkon/status",
      "/api/alkon/universe-map",
      "/api/alkon/next-actions",
    ]) {
      const response = await request.get(publicRoute);
      expect(response.status(), publicRoute).toBe(404);
    }

    const response = await request.get("/api/founder/alkon/readiness");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).not.toMatch(SECRET_PATTERN);
    expect(text).not.toMatch(/"executionEndpointsExposed"\s*:\s*true/);
    expect(text).not.toMatch(/"publicExposure"\s*:\s*true/);
    expect(text).not.toMatch(/"publicAlkonRoutesExposed"\s*:\s*true/);

    const payload = JSON.parse(text);
    expect(payload.snapshot).toMatchObject({
      visibility: "private_founder_only",
      publicExposure: false,
      apiExposure: {
        publicAlkonRoutesExposed: false,
        executionEndpointsExposed: false,
      },
    });

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.alkonUniverse).toMatchObject({
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining(["/api/founder/alkon/readiness"])
    );
    expect(
      founderCommand.snapshot.insideOutsidePlanet.privateWorld.alkonUniverse
    ).toMatchObject({
      realmId: "alkon_universe",
      publicPlanAccess: false,
      publicExposure: false,
      publicRouteExposed: false,
    });
  });

  test("keeps public UI clean and captures required public proof", async ({
    page,
  }) => {
    await openDark(page, "/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Trading Pro Max");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_FORBIDDEN_TERMS
    );
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_COSMIC_FORBIDDEN_TERMS
    );
    expect(await page.locator(".tpm-foundation-nav-shell").innerText()).not.toMatch(
      PUBLIC_FORBIDDEN_TERMS
    );
    expect(await page.locator(".tpm-foundation-nav-shell").innerText()).not.toMatch(
      PUBLIC_COSMIC_FORBIDDEN_TERMS
    );
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
      fullPage: true,
    });
    await page.locator(".tpm-foundation-nav-shell").screenshot({
      path: path.join(ARTIFACT_DIR, "public-navigation.png"),
    });
    await page.locator("#plans").screenshot({
      path: path.join(ARTIFACT_DIR, "plan-surfaces.png"),
    });

    await openDark(page, "/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Diagnostics");
    await expect(page.locator("body")).toContainText(
      "Public/private surface readiness"
    );
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_FORBIDDEN_TERMS
    );
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_COSMIC_FORBIDDEN_TERMS
    );
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
      fullPage: true,
    });
  });

  test("keeps Alkon implementation code-only and non-executing", () => {
    const sources = [
      "modules/founder-command/components/AlkonCommandUniverse.tsx",
      "modules/founder-command/components/AlkonCosmicPhysicsPanel.tsx",
      "modules/founder-command/components/AlkonCosmicTaskGraphPanel.tsx",
      "modules/founder-command/components/AlkonGravityOrbitPanel.tsx",
      "modules/founder-command/components/AlkonWorkersStationsPanel.tsx",
      "modules/founder-command/components/AlkonRiskBeltPanel.tsx",
      "modules/founder-command/components/AlkonUniverseMap.tsx",
      "modules/founder-command/components/AlkonEarthCommandPanel.tsx",
      "modules/founder-command/components/AlkonConstructionUniversePanel.tsx",
      "modules/founder-command/components/AlkonDefenseUniversePanel.tsx",
      "app/founder-command.css",
      "lib/server/alkon/state.ts",
      "lib/server/alkon/universe-map.ts",
      "lib/server/alkon-physics/state.ts",
      "lib/server/alkon-physics/task-graph.ts",
      "lib/server/alkon-physics/risk-zones.ts",
    ]
      .map((filePath) =>
        fs.readFileSync(path.join(process.cwd(), filePath), "utf8")
      )
      .join("\n");

    expect(sources).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    expect(sources).not.toMatch(/child_process|execSync|spawnSync|shellCommand/i);
    expect(sources).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(sources).not.toMatch(/billingActivationActive:\s*true/);
    expect(sources).not.toMatch(/liveExecutionActive:\s*true/);
  });
});
