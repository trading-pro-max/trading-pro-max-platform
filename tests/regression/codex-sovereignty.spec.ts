import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const forbiddenPublicTerms =
  /Codex Sovereign Construction State|Task Constitution|Task Parliament|Jurisdiction Office|Task Passport|Execution Permit|Result Tribunal|Memory & Lessons|Founder Command|Presidency|Construction Queue/i;

async function assertPublicNoLeak(page: Page, route: string) {
  await page.goto(route);
  await expect(page.locator("main").first()).toBeVisible();
  expect(await page.locator("body").innerText()).not.toMatch(forbiddenPublicTerms);
}

test.describe("Codex Sovereign Construction State", () => {
  test("establishes doctrine, constitution, parliament, jurisdiction, and passports", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/codex-sovereign-construction-state.md",
      "docs/product/codex-task-constitution.md",
      "docs/product/codex-task-parliament.md",
      "docs/product/codex-jurisdiction-office.md",
      "docs/product/codex-task-passport.md",
      "docs/product/codex-execution-permit.md",
      "docs/product/codex-prompt-compiler.md",
      "docs/product/codex-auto-submit-governance.md",
      "docs/product/codex-result-tribunal.md",
      "docs/product/codex-memory-lessons-office.md",
      "docs/security/codex-sovereign-safety-boundaries.md",
      "docs/product/codex-sovereign-construction-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const statusResponse = await request.get("/api/codex-sovereignty/status");
    expect(statusResponse.status()).toBe(200);
    const statusText = await statusResponse.text();
    expect(statusText).not.toMatch(/"webAppShellExecution"\s*:\s*true/);
    expect(statusText).not.toMatch(/"callsCodexDirectly"\s*:\s*true/);
    expect(statusText).not.toMatch(/"sendsSecretsToCodex"\s*:\s*true/);
    expect(statusText).not.toMatch(/sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}/);

    const status = JSON.parse(statusText);
    expect(status.snapshot).toMatchObject({
      mode: "codex_sovereign_construction_state",
      status: "ready",
      constitutionReady: true,
      parliamentReady: true,
      jurisdictionReady: true,
      passportReady: true,
      permitReady: true,
      promptCompilerReady: true,
      autoSubmitReady: true,
      tribunalReady: true,
      memoryLessonsReady: true,
      truth: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        publicLaunchInactive: true,
        socialPublishingInactive: true,
        productionSecretsUntouched: true,
        authSecurityPreserved: true,
        noUncontrolledAutomation: true,
        noShellExecutionFromWebApp: true,
        noSecretsSentToCodex: true,
      },
    });
    expect(status.snapshot.currentWorkerLevels).toEqual(
      expect.arrayContaining(["observer", "drafter", "builder_low"])
    );
    expect(status.snapshot.allowedCurrentAutomationLevels).toEqual([
      "level_3_0",
      "level_3_1_readiness_only",
    ]);
    expect(status.snapshot.blockedCategories).toEqual(
      expect.arrayContaining([
        "billing_blocked",
        "broker_feed_blocked",
        "live_execution_blocked",
        "launch_blocked",
        "secrets",
      ])
    );

    expect(status.snapshot.constitution.alwaysBlocked).toEqual(
      expect.arrayContaining([
        "billing activation",
        "broker/feed activation",
        "live execution activation",
        "public launch activation",
        "production secrets",
        "social publishing",
      ])
    );
    expect(status.snapshot.constitution.truth).toMatchObject({
      canTouchSecrets: false,
      canActivateRealWorldSystems: false,
      canBypassFounderApproval: false,
    });

    expect(status.snapshot.parliamentDecisions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          taskTitle: "Fix typo in docs",
          decision: "approve_for_draft",
        }),
        expect.objectContaining({
          taskTitle: "Redesign logo",
          decision: "founder_approval_required",
          founderReviewNeeded: true,
        }),
        expect.objectContaining({
          taskTitle: "Activate billing",
          decision: "block",
          priority: "blocked",
        }),
        expect.objectContaining({
          taskTitle: "Expose Founder Command to VIP users",
          decision: "block",
          securityReviewNeeded: true,
        }),
        expect.objectContaining({
          taskTitle: "Delete unused component tree",
          decision: "review_required",
        }),
      ])
    );

    const visualJurisdiction = status.snapshot.jurisdictions.find(
      (entry: { category: string }) => entry.category === "visual_polish"
    );
    expect(visualJurisdiction).toMatchObject({
      screenshotRequired: true,
      requiredReviews: expect.arrayContaining(["Design", "Product Truth", "Quality"]),
      forbiddenSurfaces: expect.arrayContaining(["auth", "billing", "broker", "secrets"]),
      forbiddenFiles: expect.arrayContaining([
        "lib/server/security/**",
        "lib/server/secrets-authority/**",
      ]),
    });

    expect(status.snapshot.taskPassports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "docs_update",
          valid: true,
          workerLevel: "builder_low",
          validationCommands: expect.arrayContaining(["npx tsc --noEmit"]),
          forbiddenScope: expect.arrayContaining([
            "No shell execution from the web app.",
          ]),
          productTruthRequirements: expect.arrayContaining([
            expect.stringContaining("Do not enable live execution"),
          ]),
        }),
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
        expect.objectContaining({
          category: "billing_blocked",
          valid: false,
          invalidReasons: expect.arrayContaining([
            "critical blocked category cannot receive a valid passport",
          ]),
        }),
      ])
    );
  });

  test("permits, prompt compiler, auto-submit, tribunal, and memory remain safe", async ({
    request,
  }) => {
    const permit = await (
      await request.get("/api/codex-sovereignty/permit/sample")
    ).json();
    expect(permit.executionPermits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: "permit_auto_submit_low_risk",
          autoSubmitAllowed: true,
          maxWorkerLevel: "builder_low",
        }),
        expect.objectContaining({
          decision: "permit_founder_review",
          autoSubmitAllowed: false,
        }),
        expect.objectContaining({
          decision: "permit_blocked",
          autoSubmitAllowed: false,
          maxWorkerLevel: "restricted",
        }),
      ])
    );
    expect(permit.autoSubmitGovernance).toMatchObject({
      defaultMode: "manual_only",
      allowedCurrentLevels: ["level_3_0", "level_3_1_readiness_only"],
      eligibleLowRiskCategories: ["docs_update", "test_update"],
      truth: {
        webAppShellExecution: false,
        callsCodexDirectly: false,
        externalSubmissionActive: false,
        externalRunnerApproved: false,
        sendsSecretsToCodex: false,
      },
    });
    expect(permit.autoSubmitGovernance.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "eligible_low_risk",
          readinessLevel: "level_3_1_readiness_only",
          externalRunnerRequired: true,
          webAppCanExecuteShell: false,
          webAppCanCallCodex: false,
        }),
        expect.objectContaining({
          status: "blocked",
        }),
      ])
    );

    const status = await (await request.get("/api/codex-sovereignty/status")).json();
    const prompt = status.snapshot.compiledPrompts[0];
    expect(prompt).toMatchObject({
      mode: "manual_only",
      includesForbiddenScope: true,
      includesValidationCommands: true,
      secretsIncluded: false,
      executableFromWebApp: false,
      externalSubmissionActive: false,
    });
    expect(prompt.prompt).toContain("NON-NEGOTIABLE FORBIDDEN SCOPE");
    expect(prompt.prompt).toContain("VALIDATION COMMANDS");
    expect(prompt.prompt).toContain("DO NOT EXPAND SCOPE");
    expect(prompt.prompt).not.toMatch(/sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|password\s*=\s*\S+|token\s*=\s*\S+/);

    const tribunal = await (
      await request.get("/api/codex-sovereignty/tribunal/sample")
    ).json();
    expect(tribunal.resultTribunal).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ decision: "accepted" }),
        expect.objectContaining({ decision: "scope_violation" }),
        expect.objectContaining({ decision: "security_violation" }),
        expect.objectContaining({ decision: "visual_review_required" }),
      ])
    );
    expect(tribunal.memoryLessons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lessonId: "codex_memory_no_generated_images",
          futureRule: expect.stringContaining("do not generate raster assets"),
          noSecrets: true,
          noPrivateSensitiveData: true,
        }),
        expect.objectContaining({
          lessonId: "codex_memory_public_logo_subtitle_rejected",
        }),
        expect.objectContaining({
          lessonId: "codex_memory_old_logo_not_accepted",
        }),
        expect.objectContaining({
          lessonId: "codex_memory_chart_annoyance_guard",
        }),
        expect.objectContaining({
          lessonId: "codex_memory_free_simplicity",
        }),
        expect.objectContaining({
          lessonId: "codex_memory_internal_terms_no_public_leak",
        }),
        expect.objectContaining({
          lessonId: "codex_memory_no_overbuilding_home",
        }),
      ])
    );
  });

  test("reports privately to Founder Command and keeps public UI unchanged", async ({
    page,
    request,
  }) => {
    const founder = await (
      await request.get("/api/founder/codex-sovereignty/readiness")
    ).json();
    expect(founder.snapshot).toMatchObject({
      mode: "founder_codex_sovereignty_readiness",
      access: {
        ownerOnly: true,
        publicNavigationVisible: false,
        userPlanExposure: false,
        readOnly: true,
        approvalExecutionActive: false,
        secretsVisible: false,
      },
      status: {
        constructionState: "ready",
        constitution: "active",
        level30DraftOnly: true,
        level31ReadinessOnly: true,
        publicPrivateBoundary: "protected",
        productTruth: "preserved",
      },
    });

    const command = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(command.snapshot.engineeringOpsQuality.codexSovereignty).toMatchObject({
      status: "ready",
      mode: "codex_sovereign_construction_state",
      constitutionStatus: "active",
      parliamentReady: true,
      jurisdictionReady: true,
      promptCompilerReady: true,
      autoSubmitReady: true,
      truth: {
        liveExecutionBlocked: true,
        realMoneyBlocked: true,
        brokerFeedActivationBlocked: true,
        billingActivationBlocked: true,
        noShellExecutionFromWebApp: true,
        noSecretsSentToCodex: true,
      },
    });
    expect(command.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/codex-sovereignty/readiness",
        "/api/codex-sovereignty/status",
        "/api/codex-sovereignty/constitution",
        "/api/codex-sovereignty/passport/sample",
        "/api/codex-sovereignty/permit/sample",
        "/api/codex-sovereignty/tribunal/sample",
      ])
    );

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.subsystems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "construction_governance",
          label: "Construction governance readiness",
          status: "ready",
        }),
      ])
    );

    await assertPublicNoLeak(page, "/");
    await expect(page.locator("body")).toContainText("Pro Max Trading");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");

    await assertPublicNoLeak(page, "/en");
    await expect(page.locator(".tpmv2-desktop-master").first()).toBeVisible();

    await assertPublicNoLeak(page, "/diagnostics");
    await expect(page.locator("body")).toContainText("Diagnostics");
    await expect(page.locator("body")).toContainText(/Construction build readiness|Construction governance readiness/);
  });
});
