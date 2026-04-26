import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const forbiddenPublicIdeaTerms =
  /Founder Idea Inbox|Task Passport Preview|Codex Draft Preview|Founder idea terms|Founder Command Report|Sovereign Autonomy Idea Intake/i;

async function postIdea(
  request: APIRequestContext,
  input: {
    title: string;
    rawIdea: string;
    affectedWorld: string;
    affectedSurface: string;
    urgency: string;
    founderIntent: string;
    desiredTiming: string;
    notes?: string;
  }
) {
  const response = await request.post("/api/founder/ideas/preview", {
    data: input,
  });
  expect(response.status()).toBe(200);

  return response.json();
}

async function assertPublicClean(page: Page, route: string) {
  await page.goto(route);
  await expect(page.locator("main").first()).toBeVisible();
  expect(await page.locator("body").innerText()).not.toMatch(
    forbiddenPublicIdeaTerms
  );
}

test.describe("Founder Idea Inbox", () => {
  test("is private readiness only and not a public or plan feature", async ({
    page,
    request,
  }) => {
    expect(
      fs.existsSync(path.join(process.cwd(), "docs/product/founder-idea-inbox.md"))
    ).toBe(true);

    const readiness = await (
      await request.get("/api/founder/ideas/readiness")
    ).json();
    expect(readiness.snapshot).toMatchObject({
      mode: "founder_idea_inbox_readiness",
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
        productTruthPreserved: true,
      },
    });
    expect(readiness.snapshot.allowedAffectedWorlds).toEqual(
      expect.arrayContaining([
        "public_user_world",
        "private_founder_world",
        "invisible_operating_layer",
      ])
    );
    expect(readiness.snapshot.allowedSurfaces).toEqual(
      expect.arrayContaining([
        "public_entry",
        "trading_workspace",
        "chart",
        "support",
        "security",
        "secrets",
        "construction",
      ])
    );

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(
      founderCommand.snapshot.engineeringOpsQuality.sovereignAutonomy.ideaInbox
    ).toMatchObject({
      status: "ready",
      publicNavigationVisible: false,
      userPlanExposure: false,
      previewPostOnly: true,
      persistenceActive: false,
      truth: {
        persisted: false,
        codexCalled: false,
        shellExecution: false,
        autoSubmit: false,
      },
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/ideas/readiness",
        "/api/founder/ideas/preview",
      ])
    );

    await assertPublicClean(page, "/");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");

    await assertPublicClean(page, "/en");
    await assertPublicClean(page, "/diagnostics");
  });

  test("previews visual, logo, chart, support, and security ideas through gates", async ({
    request,
  }) => {
    const visual = await postIdea(request, {
      title: "Visual polish needed",
      rawIdea: "The public entry looks bad and needs visual improvement.",
      affectedWorld: "public_user_world",
      affectedSurface: "public_entry",
      urgency: "medium",
      founderIntent: "Route visual polish safely.",
      desiredTiming: "next",
    });
    expect(visual.preview).toMatchObject({
      mode: "founder_idea_inbox_preview",
      event: {
        type: "visual_gap_detected",
        riskLevel: "medium",
      },
      ownerRoute: {
        ownerArea: "Design Ministry",
      },
      constructionQueueReadiness: {
        externalExecutionActive: false,
        autoSubmitActive: false,
        shellExecutionActive: false,
      },
    });

    const logo = await postIdea(request, {
      title: "Logo does not feel right",
      rawIdea: "The logo mark needs review.",
      affectedWorld: "public_user_world",
      affectedSurface: "public_entry",
      urgency: "medium",
      founderIntent: "Route logo concern to identity.",
      desiredTiming: "next",
    });
    expect(logo.preview.event.type).toBe("logo_rejection_detected");
    expect(logo.preview.ownerRoute.ownerArea).toBe("Visual Identity");

    const chart = await postIdea(request, {
      title: "Chart is annoying",
      rawIdea: "The chart is annoying and the workstation needs better candles.",
      affectedWorld: "public_user_world",
      affectedSurface: "chart",
      urgency: "medium",
      founderIntent: "Protect chart-first quality.",
      desiredTiming: "now",
    });
    expect(chart.preview.event.type).toBe("chart_quality_low");
    expect(chart.preview.ownerRoute.ownerArea).toBe("Design Ministry");

    const support = await postIdea(request, {
      title: "Support needs clarity",
      rawIdea: "Support contact wording should be clearer.",
      affectedWorld: "public_user_world",
      affectedSurface: "support",
      urgency: "medium",
      founderIntent: "Improve support readiness.",
      desiredTiming: "next",
    });
    expect(support.preview.event.type).toBe("support_gap");
    expect(support.preview.ownerRoute.ownerArea).toBe("World Interface");

    const security = await postIdea(request, {
      title: "Security review needed",
      rawIdea: "Security and auth should be reviewed before sensitive controls expand.",
      affectedWorld: "invisible_operating_layer",
      affectedSurface: "security",
      urgency: "critical",
      founderIntent: "Route defensive security review.",
      desiredTiming: "now",
    });
    expect(security.preview.event.type).toBe("security_risk");
    expect(security.preview.constructionQueueReadiness.status).toBe("blocked");
    expect(security.preview.ownerRoute.requiredReviews).toEqual(
      expect.arrayContaining(["security", "founder"])
    );
  });

  test("blocks activation and secrets while preserving Codex draft boundaries", async ({
    request,
  }) => {
    const blockedInputs = [
      {
        title: "Billing request",
        rawIdea: "Activate billing and subscriptions.",
        affectedSurface: "plans",
        expectedType: "billing_requested",
      },
      {
        title: "Live trading request",
        rawIdea: "Enable live execution and real money trading.",
        affectedSurface: "execution",
        expectedType: "live_execution_requested",
      },
      {
        title: "Broker request",
        rawIdea: "Connect broker/feed activation.",
        affectedSurface: "execution",
        expectedType: "broker_feed_requested",
      },
      {
        title: "Social publishing request",
        rawIdea: "Publish this to social and post to Instagram.",
        affectedSurface: "media",
        expectedType: "social_publish_requested",
      },
      {
        title: "Secret request",
        rawIdea: "Use password=super-secret-value in the task.",
        affectedSurface: "secrets",
        expectedType: "secrets_risk",
      },
    ];

    for (const input of blockedInputs) {
      const result = await postIdea(request, {
        title: input.title,
        rawIdea: input.rawIdea,
        affectedWorld: "invisible_operating_layer",
        affectedSurface: input.affectedSurface,
        urgency: "critical",
        founderIntent: "Check blocked boundary.",
        desiredTiming: "blocked",
      });
      const serialized = JSON.stringify(result);

      expect(result.preview.event.type).toBe(input.expectedType);
      expect(result.preview.constructionQueueReadiness.status).toBe("blocked");
      expect(result.preview.codexDraftPreview).toBeNull();
      expect(result.preview.blockedReason).toBeTruthy();
      expect(serialized).not.toMatch(/super-secret-value|password=super/i);
      expect(serialized).not.toMatch(/"shellExecution"\s*:\s*true/);
      expect(serialized).not.toMatch(/"codexCalled"\s*:\s*true/);
    }

    const safeDraft = await postIdea(request, {
      title: "Docs cleanup",
      rawIdea: "Update docs for the Founder Idea Inbox.",
      affectedWorld: "invisible_operating_layer",
      affectedSurface: "construction",
      urgency: "low",
      founderIntent: "Draft docs cleanup only.",
      desiredTiming: "next",
    });

    expect(safeDraft.preview.codexDraftPreview).toMatchObject({
      executableFromWebApp: false,
      externalSubmissionActive: false,
      secretsIncluded: false,
      includesForbiddenScope: true,
      includesValidation: true,
    });
    expect(safeDraft.preview.codexDraftPreview.codexReadyPrompt).toContain(
      "FORBIDDEN SCOPE"
    );
    expect(safeDraft.preview.codexDraftPreview.codexReadyPrompt).toContain(
      "VALIDATION COMMANDS"
    );
    expect(safeDraft.preview.truth).toMatchObject({
      previewOnly: true,
      persisted: false,
      storesSecrets: false,
      privateSensitiveDataStored: false,
      externalCalls: false,
      codexCalled: false,
      shellExecution: false,
      autoSubmit: false,
      productTruthPreserved: true,
    });
  });
});
