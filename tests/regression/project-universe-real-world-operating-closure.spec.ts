import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { getProjectUniverseTruthSnapshot } from "../../lib/server/project-universe-truth";

const FORBIDDEN_FAKE_CLAIMS =
  /Swiss government approved|Swiss certified|FINMA approved|licensed trading platform|regulated broker|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

test.describe("Project Universe Real-World Operating Closure", () => {
  test("returns deterministic universe truth with gated launch and legal review", () => {
    const truth = getProjectUniverseTruthSnapshot("2026-04-28T00:00:00.000Z");

    expect(truth.identityLine).toBe(
      "Earth-scale intelligence. Swiss-inspired precision. Private until legally ready."
    );
    expect(truth.alkonPrivateReadOnlyState).toBe("private_read_only");
    expect(truth.gates).toMatchObject({
      swissLegalReview: "pending",
      globalLegalReview: "pending",
      publicLaunch: "not_started",
      billing: "not_active",
      realMoney: "disabled",
      brokerFeed: "disabled_not_connected",
      localDayOne: "not_started",
      brandGate: "frozen_deferred",
    });
    expect(truth.complianceReadiness).toMatchObject({
      status: "legal_review_ready_only",
      notFinmaApproved: true,
      notLicensed: true,
      notRegulated: true,
      notPublic: true,
      notBillingActive: true,
      notRealMoneyActive: true,
      notBrokerActive: true,
      swissFinancialRegulationReviewNeeded: true,
      globalLegalReviewNeeded: true,
    });
  });

  test("/founder/universe renders private universe truth and blocked gates", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const center = page.locator("[data-founder-universe-command-center='true']");
    await expect(center).toBeVisible();
    await expect(center).toContainText("ALKON / Alkon -0 Project Universe");
    await expect(center).toContainText("Private / read-only");
    await expect(center).toContainText("Product Truth");
    await expect(center).toContainText("Swiss legal-review gate");
    await expect(center).toContainText("Global legal-review gate");
    await expect(center).toContainText("Swiss-inspired visual identity only");
    await expect(center).toContainText("Real money: disabled");
    await expect(center).toContainText("Broker execution: disabled/not connected");
    await expect(center).toContainText("Public launch: not started");
    await expect(center).toContainText("Billing: not active");
    await expect(center).toContainText("Brand Gate: frozen/deferred");
    await expect(center).toContainText("Local Day One: not_started");
    await expect(center).toContainText("ALKON public exposure: no");
    await expect(center).toContainText("One Next Action");
    await expect(center).toContainText("What Not To Do");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(FORBIDDEN_FAKE_CLAIMS);
  });

  test("required closure reports and professional standard exist", () => {
    const requiredFiles = [
      "docs/product/project-universe-professional-standard.md",
      "reports/project-universe-compliance-readiness-gate.md",
      "reports/project-universe-real-world-operating-closure.md",
      "reports/trading-premium-visual-realism-closure.md",
      "reports/promax-earth-identity-visual-closure.md",
    ];

    for (const filePath of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), filePath)), filePath).toBe(true);
    }
  });
});
