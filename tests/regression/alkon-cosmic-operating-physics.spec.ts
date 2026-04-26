import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import type {
  AlkonCosmicPhysicsSnapshot,
  CosmicEvent,
  CosmicTask,
} from "../../lib/server/alkon-physics/types";

const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key|secret token value|password value/i;
const PUBLIC_COSMIC_FORBIDDEN_TERMS =
  /Alkon|ط§ظ„ظƒظˆظ†|Cosmic Operating Physics|Solar Command|Risk Belt|Black Hole Zone|Satellites|Stations|Workers|Task Graph|Gravity Priority|Orbit Path|Task Passport|Codex License/i;

async function getPhysicsSnapshot(request: {
  get: (url: string) => Promise<{ status: () => number; json: () => Promise<unknown> }>;
}) {
  const response = await request.get("/api/founder/alkon-physics/readiness");
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    snapshot: AlkonCosmicPhysicsSnapshot;
  };

  return payload.snapshot;
}

function byTitle(events: CosmicEvent[], title: string): CosmicEvent {
  const event = events.find((item) => item.title.toLowerCase() === title);
  expect(event, title).toBeTruthy();
  return event as CosmicEvent;
}

function expectFullTaskChain(task: CosmicTask) {
  expect(task.event.source).toBeTruthy();
  expect(task.event.energy).toBeTruthy();
  expect(task.gravity.priority).toBeTruthy();
  expect(task.orbit.orbitPath).toBeTruthy();
  expect(task.planetOwner.id).toBeTruthy();
  expect(task.satelliteMonitors.length).toBeGreaterThan(0);
  expect(task.station.id).toBeTruthy();
  expect(task.worker.id).toBeTruthy();
  expect(task.taskPassport.passportId).toBeTruthy();
  expect(task.codexLicense.noWebAppExecution).toBe(true);
  expect(task.validation.productTruthCheckRequired).toBe(true);
  expect(task.tribunal.tribunalId).toBeTruthy();
  expect(task.memoryUpdate.containsSecrets).toBe(false);
  expect(task.memoryUpdate.containsPrivateSensitiveData).toBe(false);
  expect(task.founderReport.publicExposure).toBe(false);
}

test.describe("Alkon Cosmic Operating Physics", () => {
  test("defines private doctrine, readiness, and API boundary", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-cosmic-operating-physics.md",
      "docs/product/cosmic-task-distribution.md",
      "docs/product/gravity-priority-system.md",
      "docs/product/orbit-path-system.md",
      "docs/product/planetary-system-ownership.md",
      "docs/product/satellite-monitoring-system.md",
      "docs/product/station-worker-operating-model.md",
      "docs/product/risk-belt-and-black-hole-zone.md",
      "docs/product/memory-universe-feedback.md",
      "docs/product/alkon-cosmic-operating-physics-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    for (const publicRoute of [
      "/api/alkon/physics/status",
      "/api/alkon/physics/task-graph/sample",
      "/api/alkon/physics/workers",
      "/api/alkon/physics/risk-zones",
    ]) {
      const response = await request.get(publicRoute);
      expect(response.status(), publicRoute).toBe(404);
    }

    const snapshot = await getPhysicsSnapshot(request);
    expect(snapshot).toMatchObject({
      snapshotId: "alkon_cosmic_operating_physics",
      visibility: "private_founder_only",
      publicExposure: false,
      publicApiRoutesExposed: false,
      founderReadinessRoute: "/api/founder/alkon-physics/readiness",
      cosmicDoctrineStatus: "ready",
      gravitySystemStatus: "ready",
      orbitRouterStatus: "ready",
      taskGraphStatus: "ready",
      lifecycleStatus: "ready",
      memoryReportingStatus: "ready",
      productTruthStatus: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        publicLaunchInactive: true,
        productionSecretsUntouched: true,
        socialPublishingInactive: true,
        noShellExecutionFromWebApp: true,
        noDirectCodexExecutionFromWebApp: true,
        noPublicAlkonExposure: true,
        noImagesOrRasterAssets: true,
      },
    });
    expect(snapshot.requiredCoreLaw).toEqual(
      expect.arrayContaining([
        "source",
        "energy",
        "gravity priority",
        "orbit path",
        "planet/system owner",
        "satellite monitoring",
        "station assignment",
        "worker assignment",
        "task passport",
        "Codex License",
        "validation",
        "Result Tribunal",
        "Memory Universe",
        "Founder Command report",
      ])
    );
    expect(JSON.stringify(snapshot)).not.toMatch(SECRET_PATTERN);
  });

  test("classifies events into gravity, orbit, owner, monitor, station, and risk", async ({
    request,
  }) => {
    const snapshot = await getPhysicsSnapshot(request);

    expect(byTitle(snapshot.sampleEvents, "logo rejected")).toMatchObject({
      type: "logo_rejected",
      gravityPriority: "P1_high_gravity",
      orbitPath: "visual_identity_orbit",
      suggestedPlanetOwner: "visual_identity_planet",
      suggestedStation: "design_station",
    });
    expect(byTitle(snapshot.sampleEvents, "chart annoying")).toMatchObject({
      type: "chart_annoying",
      orbitPath: "chart_workspace_orbit",
      suggestedPlanetOwner: "trading_workspace_planet",
      suggestedStation: "chart_station",
    });
    expect(byTitle(snapshot.sampleEvents, "public ui crowded")).toMatchObject({
      type: "public_ui_crowded",
      gravityPriority: "P1_high_gravity",
      orbitPath: "public_ui_orbit",
    });
    expect(byTitle(snapshot.sampleEvents, "internal term leaked")).toMatchObject({
      type: "internal_term_leaked",
      gravityPriority: "P0_critical_gravity",
      orbitPath: "public_ui_orbit",
      secondaryOrbitPaths: ["security_orbit"],
    });
    expect(byTitle(snapshot.sampleEvents, "secret risk")).toMatchObject({
      type: "secret_risk",
      orbitPath: "secrets_orbit",
      gravityPriority: "P0_critical_gravity",
    });
    expect(byTitle(snapshot.sampleEvents, "billing requested")).toMatchObject({
      type: "billing_requested",
      orbitPath: "launch_forbidden_orbit",
      gravityPriority: "blocked_gravity",
    });
    expect(byTitle(snapshot.sampleEvents, "live execution requested")).toMatchObject({
      type: "live_execution_requested",
      gravityPriority: "black_hole_forbidden",
    });
    expect(byTitle(snapshot.sampleEvents, "codex task needed")).toMatchObject({
      type: "codex_task_needed",
      orbitPath: "codex_construction_orbit",
    });
    expect(byTitle(snapshot.sampleEvents, "local day report needed")).toMatchObject({
      type: "local_day_report_needed",
      orbitPath: "local_day_orbit",
    });
    expect(byTitle(snapshot.sampleEvents, "support missing")).toMatchObject({
      type: "support_missing",
      orbitPath: "apps_support_orbit",
    });
    expect(byTitle(snapshot.sampleEvents, "world interface request")).toMatchObject({
      type: "world_interface_request",
      orbitPath: "media_world_interface_orbit",
    });
  });

  test("builds a complete task graph and blocks black-hole categories", async ({
    request,
  }) => {
    const snapshot = await getPhysicsSnapshot(request);
    expect(snapshot.registrySummary).toMatchObject({
      orbitPaths: 14,
      planetOwners: 20,
      satellites: 14,
      stations: 14,
      workers: 20,
    });
    expect(snapshot.handoffChain.length).toBeGreaterThanOrEqual(10);
    expect(snapshot.lifecycleChain).toEqual(
      expect.arrayContaining([
        "detected",
        "energized",
        "gravity_assigned",
        "orbit_assigned",
        "passport_ready",
        "validation_required",
        "tribunal_pending",
        "memory_pending",
        "reported",
        "closed",
      ])
    );
    expect(snapshot.blockedLifecycleRules.join(" ")).toMatch(
      /codex_ready.*Task Passport|memory_pending.*Result Tribunal|public exposure.*boundary/i
    );

    for (const graph of snapshot.sampleTaskGraphs) {
      expectFullTaskChain(graph);
    }

    const blackHoleGraph = snapshot.sampleTaskGraphs.find(
      (graph) => graph.status === "black_holed"
    );
    expect(blackHoleGraph).toBeTruthy();
    expect(blackHoleGraph).toMatchObject({
      event: {
        type: "live_execution_requested",
        gravityPriority: "black_hole_forbidden",
      },
      codexLicense: {
        permitted: false,
        noWebAppExecution: true,
        noSecretsAllowed: true,
      },
      validation: {
        status: "blocked",
      },
      tribunal: {
        decision: "black_holed",
      },
    });
    expect(blackHoleGraph?.blockedReason).toMatch(
      /Live execution|real money|broker\/feed|production secrets|social publishing/i
    );
  });

  test("integrates with Founder Command without public exposure", async ({
    page,
    request,
  }) => {
    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.alkonCosmicPhysics).toMatchObject({
      snapshotId: "alkon_cosmic_operating_physics",
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining(["/api/founder/alkon-physics/readiness"])
    );
    expect(
      founderCommand.snapshot.insideOutsidePlanet.privateWorld.alkonUniverse
    ).toMatchObject({
      cosmicPhysicsReady: true,
      cosmicPhysicsPublicExposure: false,
    });

    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_COSMIC_FORBIDDEN_TERMS
    );
    await page.goto("/diagnostics");
    expect(await page.locator("body").innerText()).not.toMatch(
      PUBLIC_COSMIC_FORBIDDEN_TERMS
    );
  });

  test("keeps implementation code-only, non-executing, and secret-free", () => {
    const sources = [
      "app/api/founder/alkon-physics/readiness/route.ts",
      "app/founder-command.css",
      "lib/server/alkon-physics/types.ts",
      "lib/server/alkon-physics/cosmic-event-classifier.ts",
      "lib/server/alkon-physics/gravity.ts",
      "lib/server/alkon-physics/orbit-router.ts",
      "lib/server/alkon-physics/planet-systems.ts",
      "lib/server/alkon-physics/satellites.ts",
      "lib/server/alkon-physics/stations.ts",
      "lib/server/alkon-physics/workers.ts",
      "lib/server/alkon-physics/risk-zones.ts",
      "lib/server/alkon-physics/task-graph.ts",
      "lib/server/alkon-physics/lifecycle.ts",
      "lib/server/alkon-physics/reporting.ts",
      "lib/server/alkon-physics/memory.ts",
      "lib/server/alkon-physics/state.ts",
      "modules/founder-command/components/AlkonCosmicPhysicsPanel.tsx",
      "modules/founder-command/components/AlkonCosmicTaskGraphPanel.tsx",
      "modules/founder-command/components/AlkonGravityOrbitPanel.tsx",
      "modules/founder-command/components/AlkonWorkersStationsPanel.tsx",
      "modules/founder-command/components/AlkonRiskBeltPanel.tsx",
    ]
      .map((filePath) =>
        fs.readFileSync(path.join(process.cwd(), filePath), "utf8")
      )
      .join("\n");

    expect(sources).not.toMatch(SECRET_PATTERN);
    expect(sources).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    expect(sources).not.toMatch(/child_process|execSync|spawnSync|shellCommand/i);
    expect(sources).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(sources).not.toMatch(/liveExecutionActive:\s*true/);
    expect(sources).not.toMatch(/billingActivationActive:\s*true/);
  });
});
