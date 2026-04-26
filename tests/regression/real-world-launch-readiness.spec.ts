import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "real-world-launch-readiness");
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|api[_-]?key\s*[:=]|password\s*[:=]|secret_value/i;
const FAKE_LAUNCH_PATTERN =
  /launched today|production active|checkout available|pay now|subscribe now|live trading enabled|real money enabled|broker connected|feed connected|published externally|fake users|fake revenue|fake metrics/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" | "system" = "dark"
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key, mode }) => window.localStorage.setItem(key, mode),
    { key: THEME_STORAGE_KEY, mode: themeMode }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const target = page.locator(selector).first();
      await expect(target).toBeVisible();
      await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(250);
    }
  }
}

test.describe("real-world launch readiness gate", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("defines doctrine, budget, legal, support, beta, and rollback readiness", () => {
    const requiredDocs = [
      "docs/launch/real-world-launch-readiness.md",
      "docs/launch/economic-launch-plan-250-chf.md",
      "docs/launch/staging-readiness-plan.md",
      "docs/launch/waitlist-readiness.md",
      "docs/launch/beta-readiness-plan.md",
      "docs/launch/launch-gate-checklist.md",
      "docs/launch/rollback-plan.md",
      "docs/launch/hosting-options.md",
      "docs/launch/database-readiness.md",
      "docs/launch/monitoring-backups-readiness.md",
      "docs/launch/support-readiness.md",
      "docs/launch/payment-readiness.md",
      "docs/legal/privacy-policy-readiness.md",
      "docs/legal/terms-readiness.md",
      "docs/legal/risk-disclaimer-readiness.md",
      "docs/legal/no-financial-advice-policy.md",
      "docs/legal/no-profit-guarantee-policy.md",
      "docs/legal/refund-policy-readiness.md",
      "docs/legal/trading-risk-disclosure.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

  });

  test("exposes read-only API readiness without activation or secrets", async ({
    request,
  }) => {
    const routes = [
      "/api/launch-readiness/status",
      "/api/launch-readiness/budget",
      "/api/launch-readiness/waitlist",
      "/api/launch-readiness/legal",
      "/api/launch-readiness/support",
      "/api/launch-readiness/billing",
      "/api/launch-readiness/beta",
      "/api/launch-readiness/gate",
      "/api/founder/launch-readiness",
    ];

    for (const route of routes) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text, route).not.toMatch(SECRET_PATTERN);
      expect(text, route).not.toMatch(/"checkoutActive"\s*:\s*true/);
      expect(text, route).not.toMatch(/"launchActive"\s*:\s*true/);
      expect(text, route).not.toMatch(/"productionActive"\s*:\s*true/);
      expect(text, route).not.toMatch(/"billingActive"\s*:\s*true/);
      expect(text, route).not.toMatch(/"liveExecutionActive"\s*:\s*true/);
      expect(text, route).not.toMatch(/"realMoneyActive"\s*:\s*true/);
      expect(text, route).not.toMatch(/"socialPublishingActive"\s*:\s*true/);
    }

    const blockedMutation = await request.post("/api/launch-readiness/status", {
      data: { launch: true },
    });
    expect(blockedMutation.status()).toBe(405);

    const status = await (await request.get("/api/launch-readiness/status")).json();
    expect(status.snapshot.mode).toBe("real_world_launch_readiness_gate");
    expect(status.snapshot.status).toBe("partial");
    expect(status.snapshot.stages).toEqual([
      "laptop_planet",
      "waitlist",
      "soft_launch_paper_only",
      "pro_paid_limited_later",
      "production_economic",
      "public_launch_after_gate",
    ]);
    expect(status.snapshot.budget).toMatchObject({
      currency: "CHF",
      monthlyCapChf: 250,
      initialOperatingTargetChf: 200,
      capRespected: true,
      noPurchase: true,
      noAccountCreation: true,
      noBillingActivation: true,
    });
    expect(status.snapshot.waitlist).toMatchObject({
      publicCopy: "Waitlist planned",
      fakeSignupCountAllowed: false,
      emailSendingActive: false,
      hiddenTrackingAllowed: false,
      backendActive: false,
    });
    expect(status.snapshot.legal).toMatchObject({
      noFinancialAdvicePolicy: true,
      noProfitGuaranteePolicy: true,
      swissCompanyStatusClaimAllowed: false,
      shariaCertificationClaimAllowed: false,
      legalReviewRequired: true,
    });
    expect(status.snapshot.support).toMatchObject({
      noEmailSending: true,
      fakeTicketBackendAllowed: false,
      escalationPolicyRequired: true,
    });
    expect(status.snapshot.billing).toMatchObject({
      status: "blocked",
      checkoutActive: false,
      subscriptionsActive: false,
      invoicesActive: false,
      paymentCredentialsStored: false,
      founderApprovalRequired: true,
      performanceFeePublicUi: false,
    });
    expect(status.snapshot.beta).toMatchObject({
      status: "not_ready",
      betaType: "future_private_paper_beta",
      noRealMoney: true,
      noLiveExecution: true,
      noPublicLaunch: true,
    });
    expect(status.snapshot.gate).toMatchObject({
      status: "not_ready",
      canLaunch: false,
      canEnterWaitlist: false,
      canEnterPrivateBeta: false,
      canEnterSoftLaunch: false,
      founderFinalDecisionRequired: true,
    });
    expect(status.snapshot.gate.blockers).toEqual(
      expect.arrayContaining(["staging", "waitlist", "legal", "support", "billing", "beta"])
    );
    expect(status.snapshot.truth).toMatchObject({
      launchActive: false,
      productionActive: false,
      billingActive: false,
      brokerFeedActive: false,
      liveExecutionActive: false,
      realMoneyActive: false,
      socialPublishingActive: false,
      productionSecretsTouched: false,
      fakeUsersRevenueMetrics: false,
    });
    expect(status.snapshot.founderCommand.budgetCapChf).toBe(250);

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.realWorldLaunchReadiness).toMatchObject({
      budgetCapChf: 250,
      monthlyTargetChf: 200,
      billing: "blocked",
      gate: "not_ready",
      founderFinalDecisionRequired: true,
      publicLaunchActive: false,
    });
    expect(diagnostics.health.probes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "real_world_launch_readiness",
          status: "blocked",
        }),
      ])
    );

    const founder = await (await request.get("/api/founder/command/snapshot")).json();
    expect(founder.snapshot.realWorldLaunchReadiness).toMatchObject({
      budgetCapChf: 250,
      monthlyTargetChf: 200,
      billingReadiness: "blocked",
      launchGateStatus: "not_ready",
      founderFinalDecisionRequired: true,
    });
    expect(founder.snapshot.safety).toMatchObject({
      billingActivationActive: false,
      brokerFeedActivationActive: false,
      liveExecutionActive: false,
      realMoneyRoutingActive: false,
      publicLaunchActive: false,
      socialPublishingActive: false,
    });
  });

  test("keeps public UI honest and captures launch readiness proof", async ({
    page,
  }) => {
    await openWithTheme(page, "/", "dark");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Pro Max Trading");
    expect(await page.locator("body").innerText()).not.toMatch(FAKE_LAUNCH_PATTERN);
    await screenshotLocator(page, ".tpm-product-hero", "public-entry.png");
    await screenshotLocator(page, "#apps-platforms", "apps-platforms.png");
    await screenshotLocator(page, "#support", "support.png");

    await openWithTheme(page, "/diagnostics", "dark");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Launch readiness gate");
    await expect(page.locator("body")).toContainText("Budget cap");
    await expect(page.locator("body")).toContainText("Billing");
    await expect(page.locator("body")).not.toContainText(/checkout available|production active|live trading enabled/i);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics.png"),
    });
    await screenshotLocator(
      page,
      '[data-utility-section="real-world-readiness"]',
      "launch-readiness-if-visible.png"
    );
  });

  test("keeps launch readiness code-only and non-provisioning", () => {
    const sources = [
      "lib/server/launch-readiness/budget.ts",
      "lib/server/launch-readiness/infrastructure.ts",
      "lib/server/launch-readiness/waitlist.ts",
      "lib/server/launch-readiness/legal.ts",
      "lib/server/launch-readiness/support.ts",
      "lib/server/launch-readiness/billing-readiness.ts",
      "lib/server/launch-readiness/beta.ts",
      "lib/server/launch-readiness/launch-gate.ts",
      "lib/server/launch-readiness/state.ts",
      "lib/server/launch-readiness/index.ts",
    ]
      .map((sourcePath) => fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8"))
      .join("\n");

    expect(sources).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif)/i);
    expect(sources).not.toMatch(/fetch\(|Stripe|checkout\.sessions|sendEmail|nodemailer|resend|child_process|execSync|spawnSync/i);
    expect(sources).not.toMatch(SECRET_PATTERN);
  });
});
