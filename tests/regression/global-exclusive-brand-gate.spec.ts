import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  evaluateBrandAdoptionGate,
  generateDomainSearchTasks,
  generateTrademarkSearchTasks,
  getBrandClearanceSnapshot,
  getCurrentNameAssessmentSummary,
} from "../../lib/server/brand-clearance";

const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|Alkon -0|Founder Command|Brand Tribunal|Global Exclusive Brand Gate|trademark risk internals|legal analysis internals|Kernel|Zero Truth|internal governance/i;
const UNSAFE_PUBLIC_CLAIMS =
  /globally owned|trademark-cleared|Swiss regulated|FINMA approved|licensed|#1|global best|win-rate|guaranteed profit/i;

async function expectPublicSafe(page: Page) {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  expect(bodyText).not.toMatch(UNSAFE_PUBLIC_CLAIMS);
  await expect(page.locator('a[href^="/founder"], a[href^="/api/founder"]')).toHaveCount(0);
}

async function expectFounderApiSafe(request: APIRequestContext, route: string) {
  const response = await request.get(route);
  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body).toMatchObject({
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noExternalCalls: true,
    noPayments: true,
    noLegalClaims: true,
  });
  return body;
}

test.describe("Global Exclusive Brand Gate", () => {
  test("classifies current names without pretending global ownership", () => {
    const summary = getCurrentNameAssessmentSummary();

    expect(summary.proMax).toMatchObject({
      name: "Pro Max",
      useStatus: "working_name_only",
      decision: "working_name_only",
      riskLevel: "high",
      globalLaunchAllowed: false,
    });
    expect(summary.proMax.reasons.join(" ")).toMatch(/Dell Pro Max/);
    expect(summary.proMax.reasons.join(" ")).toMatch(/Apple iPhone Pro Max/);

    expect(summary.alkon).toMatchObject({
      name: "Alkon",
      useStatus: "private_internal_name",
      publicUseAllowed: false,
      globalLaunchAllowed: false,
    });
    expect(summary.alkonMinusZero).toMatchObject({
      name: "Alkon -0",
      useStatus: "private_internal_only",
      publicUseAllowed: false,
      globalLaunchAllowed: false,
    });
  });

  test("blocks adoption without search, legal review, domains, and Ahmad approval", () => {
    const snapshot = getBrandClearanceSnapshot("2026-04-28T00:00:00.000Z");
    const gate = evaluateBrandAdoptionGate({
      trademarkTasks: generateTrademarkSearchTasks("candidate"),
      domainTasks: generateDomainSearchTasks("candidate"),
      legalReviewStatus: "required",
      ahmadApproval: {
        required: true,
        status: "not_requested",
        approvalScope: "candidate_review",
      },
    });

    expect(snapshot.publicExposure).toBe(false);
    expect(snapshot.noExternalCalls).toBe(true);
    expect(snapshot.noDomainPurchase).toBe(true);
    expect(snapshot.noPayments).toBe(true);
    expect(snapshot.noLegalClaims).toBe(true);
    expect(snapshot.adoptionGate.adoptionStatus).toBe("needs_legal_review");
    expect(gate.blockers).toEqual(
      expect.arrayContaining([
        "No final candidate selected.",
        "Trademark search tasks are not completed.",
        "Domain tasks are not completed or claimed by Ahmad.",
        "Legal review is not complete.",
        "Ahmad approval is required.",
      ])
    );
    expect(snapshot.blockedClaims).toEqual(
      expect.arrayContaining(["global exclusivity", "trademark ownership", "FINMA approved"])
    );
  });

  test("generates manual WIPO, USPTO, EUIPO/TMview, domain, and legal tasks only", () => {
    const trademarkTasks = generateTrademarkSearchTasks("Avaren");
    const domainTasks = generateDomainSearchTasks("Avaren");

    expect(trademarkTasks.map((task) => task.registry)).toEqual(
      expect.arrayContaining(["WIPO", "USPTO", "EUIPO_TMVIEW", "SWISS_IPI", "LEGAL_REVIEW"])
    );
    expect(trademarkTasks.every((task) => task.externalCallMade === false)).toBe(true);
    expect(domainTasks.map((task) => task.domainOrHandle)).toEqual(
      expect.arrayContaining(["avaren.com", "avaren.ai", "avaren.app", "avaren.ch"])
    );
    expect(domainTasks.every((task) => task.externalCallMade === false)).toBe(true);
    expect(domainTasks.every((task) => task.purchaseAttempted === false)).toBe(true);
  });

  test("exposes Founder-only read-only APIs without external calls or purchases", async ({
    request,
  }) => {
    const readiness = await expectFounderApiSafe(
      request,
      "/api/founder/brand-clearance/readiness"
    );
    expect(readiness.snapshot.adoptionStatus).toBe("needs_legal_review");

    const currentNames = await expectFounderApiSafe(
      request,
      "/api/founder/brand-clearance/current-names"
    );
    expect(currentNames.snapshot.proMax.useStatus).toBe("working_name_only");
    expect(currentNames.snapshot.alkon.useStatus).toBe("private_internal_name");

    const searchTasks = await expectFounderApiSafe(
      request,
      "/api/founder/brand-clearance/search-tasks"
    );
    expect(searchTasks.trademarkSearchTasks.length).toBeGreaterThanOrEqual(7);
    expect(searchTasks.domainSearchTasks.length).toBeGreaterThanOrEqual(5);
    expect(searchTasks.domainSearchTasks.every((task: { purchaseAttempted: boolean }) => !task.purchaseAttempted)).toBe(true);

    const adoptionGate = await expectFounderApiSafe(
      request,
      "/api/founder/brand-clearance/adoption-gate"
    );
    expect(adoptionGate.adoptionGate.adoptionStatus).toBe("needs_legal_review");
    expect(adoptionGate.migrationPlan.executeNow).toBe(false);
  });

  test("renders Founder Command brand gate privately and keeps public UI clean", async ({
    page,
  }) => {
    await page.goto("/founder/command", { waitUntil: "domcontentloaded" });
    const panel = page.locator(".alkon-global-brand-gate-panel").first();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("Pro Max remains a working name");
    await expect(panel).toContainText("Alkon remains private");
    await expect(panel).toHaveAttribute("data-no-external-calls", "true");
    await expect(panel).toHaveAttribute("data-no-domain-purchase", "true");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPublicSafe(page);
    await page.goto("/diagnostics", { waitUntil: "domcontentloaded" });
    await expectPublicSafe(page);
  });

  test("keeps reports and source free of purchase, payment, external-call, and fake-claim execution", () => {
    const requiredReports = [
      "reports/global-brand-clearance-status.md",
      "reports/pro-max-working-name-risk.md",
      "reports/alkon-private-name-risk.md",
      "reports/global-brand-search-tasks.md",
      "reports/global-brand-candidate-shortlist.md",
      "reports/global-brand-adoption-gate.md",
    ];

    for (const report of requiredReports) {
      expect(fs.existsSync(path.join(process.cwd(), report)), report).toBe(true);
    }

    const sourceFiles = fs
      .readdirSync(path.join(process.cwd(), "lib/server/brand-clearance"))
      .filter((fileName) => fileName.endsWith(".ts"))
      .map((fileName) =>
        fs.readFileSync(path.join(process.cwd(), "lib/server/brand-clearance", fileName), "utf8")
      )
      .join("\n");

    expect(sourceFiles).not.toMatch(/\bfetch\s*\(|axios|puppeteer|playwright\.chromium/i);
    expect(sourceFiles).not.toMatch(/stripe|checkout|purchaseDomain|buyDomain/i);
    expect(sourceFiles).not.toMatch(/trademarkOwned:\s*true|globalOwnershipClaim:\s*true|finmaApproved:\s*true/i);
  });
});
