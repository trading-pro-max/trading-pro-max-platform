import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "alkon-internal-universe");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_PRIVATE_FORBIDDEN_TERMS =
  /Alkon|ط§ظ„ظƒظˆظ†|Founder Command|Earth Command|Moon Cycle|Orbit Command|Solar Command|Planetary Systems|Defense Universe|Construction Universe|Memory Universe|World Interface|Cosmic Operating Physics|Work Distribution|Task Graph|Codex Government|Result Tribunal|Product Memory|Secrets Authority|Security Sovereignty|Risk Belt|Black Hole Zone|Task Passport|Codex License|construction queue|Codex tasks|\bministries\b|\bcouncils\b|\bgovernance\b/i;
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key|secret token value|password value/i;

async function openDark(page: Page, route: string) {
  await page.goto(route);
  await page.evaluate(
    ({ key }) => window.localStorage.setItem(key, "dark"),
    { key: THEME_STORAGE_KEY }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

test.describe("Alkon internal universe closure", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("closes private command universe from existing systems without public Alkon APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-internal-universe-closure-audit.md",
      "docs/product/alkon-private-command-universe.md",
      "docs/product/alkon-command-doctrine.md",
      "docs/product/alkon-public-private-boundaries.md",
      "docs/product/alkon-work-distribution-system.md",
      "docs/product/alkon-cosmic-operating-physics.md",
      "docs/product/cosmic-task-distribution.md",
      "docs/product/gravity-priority-system.md",
      "docs/product/orbit-path-system.md",
      "docs/product/planetary-system-ownership.md",
      "docs/product/satellite-monitoring-system.md",
      "docs/product/station-worker-operating-model.md",
      "docs/product/risk-belt-and-black-hole-zone.md",
      "docs/product/founder-idea-inbox.md",
      "docs/product/local-living-day-loop.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    for (const publicRoute of [
      "/api/alkon/status",
      "/api/alkon/universe-map",
      "/api/alkon/physics/status",
      "/api/alkon/physics/task-graph/sample",
      "/api/alkon/physics/workers",
      "/api/alkon/physics/risk-zones",
    ]) {
      const response = await request.get(publicRoute);
      expect(response.status(), publicRoute).toBe(404);
    }

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot).toMatchObject({
      universeId: "alkon_private_command_universe",
      visibility: "private_founder_only",
      publicExposure: false,
      apiExposure: {
        publicAlkonRoutesExposed: false,
        founderReadinessRoute: "/api/founder/alkon/readiness",
        founderPhysicsReadinessRoute: "/api/founder/alkon-physics/readiness",
        secretsExposed: false,
        executionEndpointsExposed: false,
      },
    });
    expect(alkon.snapshot.universeMap.map((system: { id: string }) => system.id)).toEqual([
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
    expect(JSON.stringify(alkon.snapshot)).not.toMatch(SECRET_PATTERN);
    expect(alkon.snapshot.productTruthStatus).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      socialPublishingInactive: true,
      productionSecretsUntouched: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noPublicAlkonExposure: true,
    });
  });

  test("keeps cosmic work distribution and Founder Idea Inbox governed", async ({
    request,
  }) => {
    const physics = await (
      await request.get("/api/founder/alkon-physics/readiness")
    ).json();
    expect(physics.snapshot).toMatchObject({
      snapshotId: "alkon_cosmic_operating_physics",
      visibility: "private_founder_only",
      publicExposure: false,
      taskGraphStatus: "ready",
      lifecycleStatus: "ready",
      blackHoleZoneStatus: "ready",
    });
    expect(physics.snapshot.requiredCoreLaw).toEqual(
      expect.arrayContaining([
        "source",
        "gravity priority",
        "orbit path",
        "planet/system owner",
        "worker assignment",
        "task passport",
        "validation",
        "Result Tribunal",
        "Memory Universe",
        "Founder Command report",
      ])
    );
    expect(physics.snapshot.sampleTaskGraphs[0]).toMatchObject({
      taskPassport: {
        publicLanguageRule:
          "Public users only see Trading Pro Max public product language; Alkon and cosmic terms remain Founder-only.",
      },
      codexLicense: {
        noWebAppExecution: true,
        noSecretsAllowed: true,
      },
      memoryUpdate: {
        containsSecrets: false,
        containsPrivateSensitiveData: false,
      },
      founderReport: {
        publicExposure: false,
      },
    });
    expect(physics.snapshot.sampleTaskGraphs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "black_holed",
          codexLicense: expect.objectContaining({ permitted: false }),
          tribunal: expect.objectContaining({ decision: "black_holed" }),
        }),
      ])
    );

    const ideaReadiness = await (
      await request.get("/api/founder/ideas/readiness")
    ).json();
    expect(ideaReadiness.snapshot).toMatchObject({
      status: "ready",
      access: {
        ownerOnly: true,
        publicNavigationVisible: false,
        userPlanExposure: false,
        readOnly: true,
        previewPostOnly: true,
        persistenceActive: false,
        approvalExecutionActive: false,
        secretsVisible: false,
      },
      truth: {
        previewOnly: true,
        persisted: false,
        storesSecrets: false,
        externalCalls: false,
        codexCalled: false,
        shellExecution: false,
        autoSubmit: false,
      },
    });

    const ideaPreview = await (
      await request.post("/api/founder/ideas/preview", {
        data: {
          title: "Close internal task graph",
          rawIdea: "Route a cleanup task through Alkon work distribution.",
          affectedWorld: "private_founder_world",
          affectedSurface: "construction",
          urgency: "high",
          founderIntent: "Preview only; do not execute.",
          desiredTiming: "next",
        },
      })
    ).json();
    expect(ideaPreview.preview).toMatchObject({
      mode: "founder_idea_inbox_preview",
      truth: {
        previewOnly: true,
        persisted: false,
        externalCalls: false,
        codexCalled: false,
        shellExecution: false,
        autoSubmit: false,
      },
      constructionQueueReadiness: {
        externalExecutionActive: false,
        autoSubmitActive: false,
        shellExecutionActive: false,
      },
    });
    expect(JSON.stringify(ideaPreview)).not.toMatch(SECRET_PATTERN);
  });

  test("reports local living loop and codebase cleanup readiness without execution", async ({
    request,
  }) => {
    const localLoop = await (
      await request.get("/api/local-ops/living-day-loop")
    ).json();
    expect(localLoop.snapshot).toMatchObject({
      mode: "local_living_day_loop",
      codebaseRealityAudit: {
        status: "ready",
        auditNeeded: true,
        cleanupNeeded: true,
        cleanupExecutionActive: false,
        deletionAllowedWithoutProof: false,
      },
      truth: {
        publicLaunchActive: false,
        productionActive: false,
        billingActive: false,
        brokerFeedActive: false,
        liveExecutionActive: false,
        realMoneyActive: false,
        socialPublishingActive: false,
        shellExecutionFromWebApp: false,
        codexCalledFromWebApp: false,
        secretsStored: false,
      },
    });
    expect(localLoop.snapshot.loop).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ step: "Classify into events", status: "ready" }),
        expect.objectContaining({
          step: "Generate task passports",
          status: "ready",
        }),
        expect.objectContaining({ step: "Wait external execution" }),
        expect.objectContaining({ step: "Tribunal result" }),
        expect.objectContaining({ step: "Memory update" }),
      ])
    );
    expect(localLoop.snapshot.codebaseRealityAudit.p0CleanupRoute).toEqual(
      expect.arrayContaining([
        "build failure",
        "public/private terminology leak",
        "security or secrets risk",
        "Product Truth violation",
      ])
    );

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.insideOutsidePlanet.localLivingDayLoop).toMatchObject({
      codebaseRealityAudit: {
        status: "ready",
        cleanupExecutionActive: false,
        deletionAllowedWithoutProof: false,
      },
    });
  });

  test("captures public proof that Trading Pro Max stays clean", async ({ page }) => {
    await openDark(page, "/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Trading Pro Max");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_PRIVATE_FORBIDDEN_TERMS
    );
    expect(await page.locator(".tpm-foundation-nav-shell").innerText()).not.toMatch(
      PUBLIC_PRIVATE_FORBIDDEN_TERMS
    );
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
      fullPage: true,
    });
    await page.locator(".tpm-foundation-nav-shell").screenshot({
      path: path.join(ARTIFACT_DIR, "public-navigation.png"),
    });

    await openDark(page, "/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Diagnostics");
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_PRIVATE_FORBIDDEN_TERMS
    );
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
      fullPage: true,
    });
  });
});
