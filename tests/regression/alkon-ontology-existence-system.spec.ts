import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  buildEntityRelationshipGraph,
  checkOntologyCompleteness,
  evaluateEntityDeprecation,
  evaluateEntityMemory,
  evaluateEntityValidation,
  evaluateLifecycleTransition,
  findAlkonEntity,
  getAlkonEntityRegistry,
  getAlkonOntologySnapshot,
  isProtectedCoreEntity,
  resolveEntityMeaning,
  type AlkonEntity,
} from "../../lib/server/alkon-ontology";

const ARTIFACT_DIR = path.join("test-results", "alkon-ontology");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key|secret token value|password value/i;
const PUBLIC_ONTOLOGY_FORBIDDEN_TERMS =
  /Alkon|الكون|Ontology|Existence System|Entity Graph|Meaning Registry|Value Map|Risk Map|Memory Law|Report Targets|Deprecation|Removal Rules|Founder Command|Product Memory|Codex Government|Result Tribunal|Cosmic Operating Physics/i;

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_ONTOLOGY_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

function cloneEntity(entityId: string): AlkonEntity {
  const entity = findAlkonEntity(entityId);
  expect(entity, entityId).toBeTruthy();
  return JSON.parse(JSON.stringify(entity)) as AlkonEntity;
}

test.describe("Alkon Ontology & Existence System", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("defines private ontology doctrine and founder-only readiness API", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-ontology-existence-system.md",
      "docs/product/alkon-entity-doctrine.md",
      "docs/product/entity-meaning-registry.md",
      "docs/product/entity-lifecycle-system.md",
      "docs/product/entity-relationship-graph.md",
      "docs/product/entity-value-map.md",
      "docs/product/entity-risk-map.md",
      "docs/product/entity-validation-law.md",
      "docs/product/entity-memory-law.md",
      "docs/product/entity-deprecation-removal-law.md",
      "docs/product/alkon-ontology-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const publicResponse = await request.get("/api/alkon-ontology/status");
    expect(publicResponse.status()).toBe(404);

    const response = await request.get("/api/founder/alkon-ontology/readiness");
    expect(response.status()).toBe(200);
    const payload = await response.json();

    expect(payload.snapshot).toMatchObject({
      snapshotId: "alkon_ontology_existence_system",
      visibility: "private_founder_only",
      publicExposure: false,
      ontologyStatus: "ready",
      publicExposureStatus: {
        publicUiVisible: false,
        publicApiRoutesExposed: false,
        publicNavigationVisible: false,
        diagnosticsLeak: false,
      },
      productTruthStatus: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        publicLaunchInactive: true,
        socialPublishingInactive: true,
        productionSecretsUntouched: true,
        noShellExecutionFromWebApp: true,
        noImagesOrRasterAssets: true,
        noSecretsExposed: true,
        noFakeClaims: true,
      },
    });
    expect(payload.readiness).toMatchObject({
      noExecution: true,
      noDeletion: true,
      noSecrets: true,
      noExternalCalls: true,
    });
    expect(payload.snapshot.entityCount).toBeGreaterThanOrEqual(60);
    expect(payload.snapshot.publicEntityCount).toBeGreaterThanOrEqual(20);
    expect(payload.snapshot.privateEntityCount).toBeGreaterThanOrEqual(18);
    expect(payload.snapshot.invisibleEntityCount).toBeGreaterThanOrEqual(10);
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);
  });

  test("registry gives every required entity meaning, owner, lifecycle, validation, and memory", () => {
    const registry = getAlkonEntityRegistry();
    const requiredEntities = [
      "home",
      "trading_workspace",
      "markets",
      "plans",
      "apps_platforms",
      "academy",
      "community",
      "support",
      "settings",
      "diagnostics",
      "free_earth_realm",
      "pro_orbit_realm",
      "vip_lunar_realm",
      "institutional_station_realm",
      "tpm_assistant",
      "journal",
      "coach",
      "product_truth_public_summary",
      "adaptive_atmosphere_solar_theme",
      "living_earth_identity",
      "market_chart_workspace",
      "alkon_command_universe",
      "founder_command",
      "founder_idea_inbox",
      "sovereign_autonomy",
      "codex_sovereign_construction_state",
      "alkon_cosmic_operating_physics",
      "alkon_work_distribution",
      "alkon_ontology_existence_system",
      "product_memory",
      "result_tribunal",
      "secrets_authority",
      "security_sovereignty",
      "world_interface",
      "launch_readiness_gate",
      "local_day_cycle",
      "product_truth",
      "plan_entitlements",
      "surface_boundaries",
      "guardian",
      "legal",
      "trust_governor",
      "brand_intelligence",
      "planetary_environment_engine",
      "assistant_context",
      "why_blocked",
      "diagnostics_health",
      "public_private_output_mapper",
    ];

    expect(registry.map((entity) => entity.entityId)).toEqual(
      expect.arrayContaining(requiredEntities)
    );

    for (const entity of registry) {
      expect(entity.purpose, entity.entityId).toBeTruthy();
      expect(entity.ownerArea, entity.entityId).toBeTruthy();
      expect(entity.ownerWorker, entity.entityId).toBeTruthy();
      expect(entity.visibility, entity.entityId).toBeTruthy();
      expect(entity.lifecycle, entity.entityId).toBeTruthy();
      expect(entity.reportTarget, entity.entityId).toBeTruthy();
      expect(entity.memoryRule, entity.entityId).toBeTruthy();
      expect(entity.deprecationRule, entity.entityId).toBeTruthy();
      expect(entity.removalRule, entity.entityId).toBeTruthy();
      expect(entity.validation.methods.length, entity.entityId).toBeGreaterThan(0);
      expect(resolveEntityMeaning(entity).reasonToExist, entity.entityId).toBeTruthy();
    }
  });

  test("relationship graph and completeness checker detect ownership, validation, and cleanup state", () => {
    const registry = getAlkonEntityRegistry();
    const graph = buildEntityRelationshipGraph(registry);
    const completeness = checkOntologyCompleteness(registry);
    const snapshot = getAlkonOntologySnapshot("2026-04-26T10:00:00.000Z");

    expect(graph.missingDependencies).toEqual([]);
    expect(graph.ownerlessEntities).toEqual([]);
    expect(graph.memorylessEntities).toEqual([]);
    expect(graph.publicPrivateBoundaryRisks).toEqual([]);
    expect(graph.nodes.find((node) => node.entityId === "trading_workspace")).toMatchObject({
      dependencies: expect.arrayContaining([
        "product_truth",
        "plan_entitlements",
        "market_chart_workspace",
        "tpm_assistant",
        "journal",
        "coach",
      ]),
    });
    expect(graph.nodes.find((node) => node.entityId === "tpm_assistant")).toMatchObject({
      dependencies: expect.arrayContaining([
        "product_truth",
        "plan_entitlements",
        "surface_boundaries",
        "why_blocked",
      ]),
    });

    expect(completeness.publicCompletenessScore).toBeGreaterThanOrEqual(75);
    expect(completeness.privateAlkonCompletenessScore).toBeGreaterThanOrEqual(75);
    expect(completeness.invisibleLayerCompletenessScore).toBeGreaterThanOrEqual(75);
    expect(snapshot.cleanupPriorities.P0.length).toBeGreaterThanOrEqual(0);
    expect(snapshot.nextSafeActions.join(" ")).toMatch(/ontology registry/i);
    expect(snapshot.publicExposure).toBe(false);
  });

  test("lifecycle, validation, memory, and deprecation laws protect entities", () => {
    const home = cloneEntity("home");
    expect(evaluateLifecycleTransition(home, "built")).toMatchObject({
      allowed: false,
    });

    const unvalidated = cloneEntity("home");
    unvalidated.lifecycle = "tested";
    unvalidated.validation = {
      methods: [],
      evidence: [],
      productTruthCheck: false,
      publicPrivateLeakCheck: false,
    };
    expect(evaluateLifecycleTransition(unvalidated, "accepted")).toMatchObject({
      allowed: false,
    });
    expect(evaluateEntityValidation(unvalidated)).toMatchObject({
      status: "missing_validation",
    });

    const assistantMemory = evaluateEntityMemory(cloneEntity("tpm_assistant"));
    expect(assistantMemory.appliedRules.join(" ")).toMatch(
      /no generated images/i
    );
    expect(assistantMemory.appliedRules.join(" ")).toMatch(/no raster assets/i);
    expect(assistantMemory.appliedRules.join(" ")).toMatch(
      /Assistant must not expose internals/i
    );

    expect(isProtectedCoreEntity("product_truth")).toBe(true);
    expect(evaluateEntityDeprecation(cloneEntity("product_truth"))).toMatchObject({
      protectedCore: true,
      canRemove: false,
    });

    const duplicate = cloneEntity("home");
    duplicate.entityId = "duplicate_public_home";
    duplicate.deprecationRule = "Duplicate entity should be deprecated.";
    expect(evaluateEntityDeprecation(duplicate)).toMatchObject({
      shouldDeprecate: true,
      canRemove: true,
    });
  });

  test("integrates with Founder Command and read-only ontology APIs", async ({
    request,
  }) => {
    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.alkonOntology).toMatchObject({
      snapshotId: "alkon_ontology_existence_system",
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/alkon-ontology/readiness",
        "/api/founder/alkon-ontology/entities",
        "/api/founder/alkon-ontology/completeness",
        "/api/founder/alkon-ontology/cleanup-candidates",
      ])
    );
    expect(
      founderCommand.snapshot.insideOutsidePlanet.privateWorld.alkonUniverse
    ).toMatchObject({
      ontologyReady: true,
      ontologyPublicExposure: false,
    });

    for (const route of [
      "/api/founder/alkon-ontology/entities",
      "/api/founder/alkon-ontology/completeness",
      "/api/founder/alkon-ontology/cleanup-candidates",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text, route).not.toMatch(SECRET_PATTERN);
      expect(text, route).toMatch(/readOnly|noDeletion|noSecrets|cleanupPriorities/);
    }
  });

  test("keeps ontology private and absent from public UI", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
    });

    await page.goto("/diagnostics", { waitUntil: "domcontentloaded" });
    await expectPublicSafe(page);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });
  });

  test("keeps implementation code-only, secret-free, and non-executing", () => {
    const sourceFiles = [
      "app/api/founder/alkon-ontology/readiness/route.ts",
      "app/api/founder/alkon-ontology/entities/route.ts",
      "app/api/founder/alkon-ontology/completeness/route.ts",
      "app/api/founder/alkon-ontology/cleanup-candidates/route.ts",
      "lib/server/alkon-ontology/types.ts",
      "lib/server/alkon-ontology/entity-registry.ts",
      "lib/server/alkon-ontology/meaning-resolver.ts",
      "lib/server/alkon-ontology/relationship-graph.ts",
      "lib/server/alkon-ontology/lifecycle-manager.ts",
      "lib/server/alkon-ontology/value-risk.ts",
      "lib/server/alkon-ontology/validation-law.ts",
      "lib/server/alkon-ontology/memory-law.ts",
      "lib/server/alkon-ontology/deprecation.ts",
      "lib/server/alkon-ontology/completeness-checker.ts",
      "lib/server/alkon-ontology/state.ts",
      "lib/server/alkon-ontology/index.ts",
      "modules/founder-command/components/AlkonOntologyPanel.tsx",
      "modules/founder-command/components/AlkonEntityGraphPanel.tsx",
      "modules/founder-command/components/AlkonCompletenessPanel.tsx",
      "modules/founder-command/components/AlkonCleanupCandidatesPanel.tsx",
    ];

    const sources = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(sources).not.toMatch(SECRET_PATTERN);
    expect(sources).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(sources).not.toMatch(/child_process|execSync|spawnSync|shellCommand/i);
    expect(sources).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(sources).not.toMatch(/liveExecutionActive:\s*true/);
    expect(sources).not.toMatch(/billingActivationActive:\s*true/);

    const snapshot = getAlkonOntologySnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.productTruthStatus).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      socialPublishingInactive: true,
      noShellExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
      noSecretsExposed: true,
      noFakeClaims: true,
    });
  });
});
