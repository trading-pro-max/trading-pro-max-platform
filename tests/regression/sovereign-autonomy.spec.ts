import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const ARTIFACT_DIR = path.join("test-results", "sovereign-autonomy");

async function openDark(page: Page, route: string) {
  await page.goto(route);
  await page.evaluate(
    ({ key }) => window.localStorage.setItem(key, "dark"),
    { key: THEME_STORAGE_KEY }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

test.describe("sovereign autonomy operating civilization", () => {
  test("classifies founder ideas, blocks real-world activation, and drafts safely", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/tpm-sovereign-autonomy-constitution.md",
      "docs/product/sovereign-autonomy-operating-civilization.md",
      "docs/product/founder-idea-operating-loop.md",
      "docs/product/autonomy-levels-law.md",
      "docs/security/sovereign-autonomy-safety-boundaries.md",
      "docs/product/founder-idea-intake.md",
      "docs/product/sovereign-event-state-engine.md",
      "docs/product/sovereign-owner-routing.md",
      "docs/product/sovereign-policy-gates.md",
      "docs/product/sovereign-task-passport.md",
      "docs/product/codex-worker-license.md",
      "docs/product/sovereign-codex-task-drafting.md",
      "docs/product/sovereign-result-tribunal.md",
      "docs/product/sovereign-memory-law.md",
      "docs/product/founder-sovereign-autonomy-room.md",
      "docs/product/sovereign-autonomy-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(
        true
      );
    }

    const statusResponse = await request.get("/api/sovereign-autonomy/status");
    expect(statusResponse.status()).toBe(200);
    const statusText = await statusResponse.text();
    expect(statusText).not.toMatch(/"executableFromWebApp"\s*:\s*true/);
    expect(statusText).not.toMatch(/"webAppShellExecution"\s*:\s*true/);
    expect(statusText).not.toMatch(/"callsCodexDirectly"\s*:\s*true/);
    expect(statusText).not.toMatch(/"sendsSecretsToCodex"\s*:\s*true/);
    expect(statusText).not.toMatch(/sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}/);

    const status = JSON.parse(statusText);
    expect(status.snapshot).toMatchObject({
      mode: "sovereign_autonomy_operating_civilization",
      operatingMode: "local_readiness_only",
      ideaIntakeReady: true,
      eventSystemReady: true,
      codexDraftingReady: true,
      founderCommandReady: true,
      truth: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        publicLaunchInactive: true,
        socialPublishingInactive: true,
        productionSecretsUntouched: true,
        noShellExecutionFromWebApp: true,
        noSecretsSentToCodex: true,
      },
    });
    expect(status.snapshot.autonomyLevelsAllowedNow).toEqual(
      expect.arrayContaining([
        "level_1_detect",
        "level_2_draft",
        "level_3_0_codex_ready_task_draft_only",
        "level_3_1_approved_low_risk_codex_submission_readiness_only",
      ])
    );
    expect(status.snapshot.blockedSystems).toEqual(
      expect.arrayContaining([
        "live execution",
        "real money",
        "billing activation",
        "broker/feed activation",
        "production secrets",
        "social publishing",
        "public launch",
        "web app shell execution",
      ])
    );
    expect(status.snapshot.sampleEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "logo_rejection_detected",
          affectedSurface: "brand_identity",
        }),
        expect.objectContaining({
          type: "chart_quality_low",
          affectedSurface: "workstation",
        }),
        expect.objectContaining({
          type: "apps_platforms_gap",
          affectedSurface: "apps_platforms",
        }),
        expect.objectContaining({
          type: "codex_task_needed",
          affectedSurface: "codex_governance",
        }),
        expect.objectContaining({
          type: "billing_requested",
          status: "blocked",
          riskLevel: "critical",
        }),
      ])
    );

    const founderIdeaResponse = await request.get(
      "/api/sovereign-autonomy/founder-ideas"
    );
    expect(founderIdeaResponse.status()).toBe(200);
    const founderIdea = await founderIdeaResponse.json();
    expect(founderIdea).toMatchObject({
      mode: "founder_idea_intake_readiness",
      truth: {
        storesSecrets: false,
        persistsPrivateSensitiveData: false,
        executesCommands: false,
        externalCalls: false,
        mutationsEnabled: false,
      },
    });
    expect(founderIdea.samples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: expect.objectContaining({
            type: "billing_requested",
            status: "blocked",
            riskLevel: "critical",
          }),
        }),
      ])
    );

    const events = await (await request.get("/api/sovereign-autonomy/events")).json();
    expect(events.policyEvaluations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          overallDecision: "blocked",
          autonomyLevel: "level_0_blocked",
        }),
      ])
    );
    expect(events.ownerRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ownerArea: "Product Truth",
          recommendedQueue: "blocked_activation_log",
          escalationTarget: "founder_command",
        }),
        expect.objectContaining({
          ownerArea: "Design Ministry",
          recommendedQueue: "design_quality_review",
        }),
      ])
    );

    const drafts = await (
      await request.get("/api/sovereign-autonomy/codex-drafts")
    ).json();
    expect(drafts.taskPassports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valid: false,
          invalidReasons: expect.arrayContaining([
            "validation commands are required",
          ]),
        }),
        expect.objectContaining({
          valid: false,
          invalidReasons: expect.arrayContaining([
            "passport appears to contain secret material",
          ]),
        }),
      ])
    );
    expect(drafts.licenses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workerLevel: "restricted",
          permitted: false,
        }),
        expect.objectContaining({
          workerLevel: "drafter",
          permitted: true,
        }),
      ])
    );
    expect(drafts.submitReadiness).toMatchObject({
      defaultMode: "manual_only",
      truth: {
        webAppShellExecution: false,
        callsCodexDirectly: false,
        sendsSecretsToCodex: false,
        externalRunnerApproved: false,
      },
    });
    expect(drafts.submitReadiness.drafts[0]).toMatchObject({
      executableFromWebApp: false,
      externalSubmissionActive: false,
      secretsIncluded: false,
      includesForbiddenScope: true,
      includesValidation: true,
    });
    expect(drafts.tribunalReports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ decision: "security_violation" }),
      ])
    );

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(
      founderCommand.snapshot.engineeringOpsQuality.sovereignAutonomy
    ).toMatchObject({
      operatingMode: "local_readiness_only",
      ideaIntakeReady: true,
      eventSystemReady: true,
      policyGatesReady: true,
      truth: {
        liveExecutionBlocked: true,
        noShellExecutionFromWebApp: true,
        noSecretsSentToCodex: true,
      },
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/sovereign-autonomy/status",
        "/api/sovereign-autonomy/founder-ideas",
        "/api/sovereign-autonomy/events",
        "/api/sovereign-autonomy/codex-drafts",
        "/api/founder/sovereign-autonomy/readiness",
      ])
    );

    const founderRoom = await (
      await request.get("/api/founder/sovereign-autonomy/readiness")
    ).json();
    expect(founderRoom.snapshot).toMatchObject({
      mode: "founder_sovereign_autonomy_room",
      access: {
        ownerOnly: true,
        publicNavigationVisible: false,
        userPlanExposure: false,
        readOnly: true,
        approvalExecutionActive: false,
        secretsVisible: false,
      },
      status: {
        operatingMode: "local_readiness_only",
        publicPrivateBoundary: "protected",
        productTruth: "preserved",
      },
    });
  });

  test("keeps public UI clean while capturing visual proof", async ({ page }) => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

    const forbiddenPublicTerms =
      /Sovereign Autonomy|Founder Command|Founder King|Owner controls|Planet governance|Kingdom|\bministries\b|\bcouncils\b|Presidency|construction queue|Codex task drafts|Secrets Authority|treasury controls|Product Memory internals|local operations internals/i;

    await openDark(page, "/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Trading Pro Max");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    expect(await page.locator("body").innerText()).not.toMatch(forbiddenPublicTerms);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
      fullPage: true,
    });

    await openDark(page, "/en");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator(".tpmv2-desktop-master").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(/Trading Workspace|Execution Panel|Decision/);
    expect(await page.locator("body").innerText()).not.toMatch(forbiddenPublicTerms);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "workstation-dark.png"),
      fullPage: true,
    });

    await openDark(page, "/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Diagnostics");
    await expect(page.locator("body")).toContainText("System readiness");
    expect(await page.locator("body").innerText()).not.toMatch(forbiddenPublicTerms);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "diagnostics.png"),
      fullPage: true,
    });
  });
});
