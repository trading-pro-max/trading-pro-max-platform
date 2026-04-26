import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { createAlkonEntityBirthCandidate } from "../../lib/server/alkon-continuity/birth";
import { reviewAlkonEntityDeprecation } from "../../lib/server/alkon-continuity/deprecation";
import { runAlkonContinuity } from "../../lib/server/alkon-continuity/engine";
import { createAlkonEntityEvolutionRule } from "../../lib/server/alkon-continuity/evolution";
import { assignAlkonEntityFunction } from "../../lib/server/alkon-continuity/function";
import { identifyAlkonEntity } from "../../lib/server/alkon-continuity/identity";
import { reviewAlkonEntityIntegration } from "../../lib/server/alkon-continuity/integration";
import { reviewAlkonContinuityLaw } from "../../lib/server/alkon-continuity/law-gate";
import { monitorAlkonEntityLife } from "../../lib/server/alkon-continuity/life";
import { proveAlkonEntityContinuity } from "../../lib/server/alkon-continuity/proof";
import { reviewAlkonEntityRemoval } from "../../lib/server/alkon-continuity/removal";
import type {
  AlkonEntityBirthRequest,
  AlkonEntityIdentity,
} from "../../lib/server/alkon-continuity/types";

const ARTIFACT_DIR = path.join("test-results", "alkon-continuity");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|Founder Command|Sovereign Creation|Continuity System|Entity Birth|Entity Death|Lifecycle Governance|Codex tasks|Task Passport|Result Tribunal|Product Memory internals|Risk Belt|Black Hole Zone|Birth law|deprecation law|internal lifecycle/i;

function birthRequest(
  overrides: Partial<AlkonEntityBirthRequest> = {}
): AlkonEntityBirthRequest {
  return {
    source: "founder_idea",
    text: "Create a calmer chart-first workspace improvement.",
    requestedBy: "founder",
    surface: "Trading Workspace",
    currentStage: "laptop_planet",
    ...overrides,
  };
}

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Sovereign Creation & Continuity System", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents private continuity doctrine and exposes founder-only read-only APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-sovereign-creation-continuity-system.md",
      "docs/product/alkon-entity-birth-law.md",
      "docs/product/alkon-entity-identity-law.md",
      "docs/product/alkon-entity-function-law.md",
      "docs/product/alkon-entity-integration-law.md",
      "docs/product/alkon-entity-proof-law.md",
      "docs/product/alkon-entity-life-monitoring.md",
      "docs/product/alkon-entity-evolution-law.md",
      "docs/product/alkon-entity-death-removal-law.md",
      "docs/product/alkon-continuity-memory-law.md",
      "docs/product/alkon-creation-continuity-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    expect((await request.get("/api/alkon-continuity/readiness")).status()).toBe(404);
    expect((await request.get("/api/continuity/readiness")).status()).toBe(404);

    const readiness = await request.get("/api/founder/alkon-continuity/readiness");
    expect(readiness.status()).toBe(200);
    const payload = await readiness.json();

    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      previewOnly: true,
      noExecution: true,
      noDeletion: true,
      noSecrets: true,
      noExternalCalls: true,
      snapshot: {
        snapshotId: "alkon_sovereign_creation_continuity_system",
        visibility: "private_founder_only",
        publicExposure: false,
        readiness: "ready",
        productTruthStatus: {
          liveExecutionBlocked: true,
          realMoneyBlocked: true,
          brokerFeedActivationBlocked: true,
          billingActivationBlocked: true,
          publicLaunchInactive: true,
          noDeletionExecution: true,
          noShellExecutionFromWebApp: true,
          noDirectCodexExecutionFromWebApp: true,
          noSecretsExposed: true,
          noImagesOrRasterAssets: true,
          noFakeClaims: true,
        },
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);

    for (const route of [
      "/api/founder/alkon-continuity/snapshot",
      "/api/founder/alkon-continuity/sample-birth",
      "/api/founder/alkon-continuity/cleanup-candidates",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(await response.text()).toMatch(/readOnly|previewOnly|noExecution|noDeletion|founderOnly/);
    }
  });

  test("birth, identity, and law gate classify safe and forbidden entity births", () => {
    const chartCandidate = createAlkonEntityBirthCandidate(
      birthRequest({
        source: "visual_rejection",
        text: "The chart is annoying and needs a calmer chart-first workspace improvement.",
      })
    );
    expect(chartCandidate.category).toBe("market_surface");
    expect(chartCandidate.world).toBe("public_earth");
    expect(chartCandidate.memoryApplied.join(" ")).toMatch(/No generated images/);

    const identity = identifyAlkonEntity(chartCandidate, birthRequest());
    expect(identity.status).toBe("identified");
    expect(identity.owner).toBe("Public Earth World");
    expect(identity.publicVisible).toBe(true);

    const liveCandidate = createAlkonEntityBirthCandidate(
      birthRequest({ text: "Activate live execution with raw secret access now." })
    );
    const liveIdentity = identifyAlkonEntity(liveCandidate, birthRequest());
    const liveLaw = reviewAlkonContinuityLaw(liveCandidate, liveIdentity, birthRequest({
      text: "Activate live execution with raw secret access now.",
      requiresSecrets: true,
    }));
    expect(liveLaw.outcome).toBe("black_holed");
    expect(liveLaw.safeAlternative).toMatch(/safe readiness|private report/i);

    const imageCandidate = createAlkonEntityBirthCandidate(
      birthRequest({
        text: "Generate image and png assets for the continuity surface.",
        requestsImageGeneration: true,
      })
    );
    const imageLaw = reviewAlkonContinuityLaw(
      imageCandidate,
      identifyAlkonEntity(imageCandidate, birthRequest()),
      birthRequest({
        text: "Generate image and png assets for the continuity surface.",
        requestsImageGeneration: true,
      })
    );
    expect(imageLaw.outcome).toBe("blocked");

    const privateCandidate = createAlkonEntityBirthCandidate(
      birthRequest({
        text: "Create private Alkon continuity panel.",
        worldHint: "private_alkon",
        categoryHint: "alkon_subsystem",
        publicVisible: true,
      })
    );
    const privateLaw = reviewAlkonContinuityLaw(
      privateCandidate,
      identifyAlkonEntity(privateCandidate, birthRequest({ publicVisible: true })),
      birthRequest({ publicVisible: true })
    );
    expect(privateLaw.outcome).toBe("blocked");
  });

  test("function, integration, proof, and life monitoring require purpose and validation", () => {
    const unclear = createAlkonEntityBirthCandidate(
      birthRequest({ text: "Create random vanity hype feature." })
    );
    const identity = identifyAlkonEntity(unclear, birthRequest());
    const entityFunction = assignAlkonEntityFunction(unclear, identity);
    expect(entityFunction.functionStatus).toBe("review_required");

    const integration = reviewAlkonEntityIntegration(identity, entityFunction, birthRequest());
    expect(integration.completeness).toBe("partial");
    expect(integration.orphanedRisk).toBe(true);

    const proof = proveAlkonEntityContinuity(
      identity,
      reviewAlkonContinuityLaw(unclear, identity, birthRequest()),
      integration
    );
    expect(proof.status).toBe("missing_validation");
    expect(proof.cannotBeAccepted).toBe(true);

    const life = monitorAlkonEntityLife(identity, entityFunction, integration, proof);
    expect(["risky", "cleanup_candidate", "needs_improvement"]).toContain(life.health);
  });

  test("evolution, deprecation, and removal protect core systems and require migration proof", () => {
    const imageReport = runAlkonContinuity(
      birthRequest({
        text: "No images should be generated unless explicitly requested.",
        categoryHint: "memory_lesson",
        worldHint: "invisible_operating_layer",
      })
    );
    expect(imageReport.evolution.futureGuard).toMatch(/Block image creation/);

    const cleanupReport = runAlkonContinuity(
      birthRequest({
        source: "cleanup_candidate",
        text: "Remove duplicated shell control after dependency review.",
        categoryHint: "cleanup_candidate",
        worldHint: "private_alkon",
        requestsDeletion: true,
      })
    );
    expect(cleanupReport.deprecation.shouldDeprecate).toBe(true);
    expect(cleanupReport.removal.decision).toBe("dependency_migration_required");
    expect(cleanupReport.removal.canRemove).toBe(false);

    const coreIdentity: AlkonEntityIdentity = {
      entityId: "core_product_truth",
      name: "Product Truth",
      category: "feature",
      world: "invisible_operating_layer",
      owner: "Product Truth",
      surface: "Invisible Operating Layer",
      status: "identified",
      visibility: "internal_readiness",
      risk: "founder_approval_required",
      lifecycleState: "accepted",
      reportTarget: "Founder Command",
      publicVisible: false,
      founderVisible: true,
    };
    const coreDeprecation = reviewAlkonEntityDeprecation(
      coreIdentity,
      {
        entityId: coreIdentity.entityId,
        completeness: "complete",
        ownerSystem: "Product Truth",
        connectedSystems: ["Product Truth"],
        dependencies: ["Product Truth"],
        dependentSystems: ["all public surfaces"],
        tests: ["regression"],
        docsRequired: true,
        missingDependencies: [],
        orphanedRisk: false,
        circularRisk: false,
        publicPrivateRisk: false,
      },
      {
        entityId: coreIdentity.entityId,
        health: "cleanup_candidate",
        reasons: ["test"],
        monitoredSignals: ["test"],
        nextReview: "now",
      }
    );
    expect(coreDeprecation.protectedCore).toBe(true);
    expect(
      reviewAlkonEntityRemoval(coreIdentity, coreDeprecation, birthRequest({ requestsDeletion: true })).decision
    ).toBe("founder_approval_required");

    expect(createAlkonEntityEvolutionRule(imageReport.candidate, imageReport.identity).requiredTest).toMatch(/source scan/);
  });

  test("continuity snapshot bridges Alkon and Founder Command without public exposure", async ({
    request,
  }) => {
    const readiness = await (
      await request.get("/api/founder/alkon-continuity/readiness")
    ).json();
    const snapshot = readiness.snapshot;
    expect(snapshot.publicExposure).toBe(false);
    expect(snapshot.sampleReports.length).toBeGreaterThanOrEqual(5);
    expect(snapshot.blackHoled).toContain("public_earth_live_execution_activation_request");
    expect(snapshot.relatedSystems.join(" ")).toMatch(/Ontology|Legitimacy|Final Convergence|Treasury Life|Media/);

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.sovereignContinuity.readiness).toBe("ready");
    expect(alkon.snapshot.apiExposure.founderContinuityReadinessRoute).toBe(
      "/api/founder/alkon-continuity/readiness"
    );

    const founderApp = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderApp.snapshot.alkonContinuity.readiness).toBe("ready");
    expect(founderApp.snapshot.apiReadiness).toContain(
      "/api/founder/alkon-continuity/readiness"
    );
  });

  test("public UI does not expose continuity or internal lifecycle terms", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
      fullPage: true,
    });

    await page.goto("/diagnostics");
    await expect(page.getByText("Diagnostics").first()).toBeVisible();
    await expectPublicSafe(page);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
      fullPage: true,
    });
  });

  test("implementation remains code-only, secret-free, non-executing, and non-deleting", () => {
    const files = [
      "lib/server/alkon-continuity/types.ts",
      "lib/server/alkon-continuity/birth.ts",
      "lib/server/alkon-continuity/identity.ts",
      "lib/server/alkon-continuity/law-gate.ts",
      "lib/server/alkon-continuity/function.ts",
      "lib/server/alkon-continuity/integration.ts",
      "lib/server/alkon-continuity/proof.ts",
      "lib/server/alkon-continuity/life.ts",
      "lib/server/alkon-continuity/evolution.ts",
      "lib/server/alkon-continuity/deprecation.ts",
      "lib/server/alkon-continuity/removal.ts",
      "lib/server/alkon-continuity/engine.ts",
      "lib/server/alkon-continuity/state.ts",
      "app/api/founder/alkon-continuity/readiness/route.ts",
      "app/api/founder/alkon-continuity/snapshot/route.ts",
      "app/api/founder/alkon-continuity/sample-birth/route.ts",
      "app/api/founder/alkon-continuity/cleanup-candidates/route.ts",
      "modules/founder-command/components/AlkonContinuityPanel.tsx",
      "modules/founder-command/components/AlkonEntityBirthPanel.tsx",
      "modules/founder-command/components/AlkonLifecyclePanel.tsx",
      "modules/founder-command/components/AlkonEvolutionPanel.tsx",
      "modules/founder-command/components/AlkonDeprecationPanel.tsx",
      "modules/founder-command/components/AlkonCleanupContinuityPanel.tsx",
    ];
    const source = files
      .map((file) => fs.readFileSync(path.join(process.cwd(), file), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/child_process|execSync|spawn\(|eval\(|new Function|fetch\(/);
    expect(source).not.toMatch(/Remove-Item|unlinkSync|rmSync|rmdirSync|DELETE\s*\(/);
    expect(source).not.toMatch(/<img|\.(png|jpg|jpeg|webp|gif|mp4|mov)/i);
  });
});
