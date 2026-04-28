import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  evaluateBrandAdoptionGate,
  generateBrandCandidates,
  generateDomainSearchTasks,
  generateTrademarkSearchTasks,
  getBrandClearanceSnapshot,
  getBrandSearchPlan,
  getCurrentNameAssessmentSummary,
  getProMaxRiskStatus,
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
    const proMaxRisk = getProMaxRiskStatus();

    expect(summary.proMax).toMatchObject({
      name: "Pro Max",
      useStatus: "working_name_only",
      decision: "working_name_only",
      riskLevel: "high",
      globalLaunchAllowed: false,
    });
    expect(summary.proMax.reasons.join(" ")).toMatch(/Dell Pro Max/);
    expect(summary.proMax.reasons.join(" ")).toMatch(/Apple iPhone Pro Max/);
    expect(proMaxRisk).toMatchObject({
      name: "Pro Max",
      status: "working_name_only",
      riskLevel: "high",
      finalBrandApproved: false,
      publicLaunchAllowed: false,
    });

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
    expect(snapshot.currentWorkingName).toBe("Pro Max");
    expect(snapshot.finalBrandApproved).toBe(false);
    expect(snapshot.launchBlockedByBrandGate).toBe(true);
    expect(snapshot.candidateShortlist).toHaveLength(20);
    expect(
      snapshot.candidateShortlist.every(
        (candidate) => candidate.clearanceStatus === "unchecked"
      )
    ).toBe(true);
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
    const searchPlan = getBrandSearchPlan("Avaren");

    expect(trademarkTasks.map((task) => task.registry)).toEqual(
      expect.arrayContaining(["WIPO", "USPTO", "EUIPO_TMVIEW", "SWISS_IPI", "LEGAL_REVIEW"])
    );
    expect(trademarkTasks.every((task) => task.externalCallMade === false)).toBe(true);
    expect(domainTasks.map((task) => task.domainOrHandle)).toEqual(
      expect.arrayContaining(["avaren.com", "avaren.ai", "avaren.app", "avaren.ch"])
    );
    expect(domainTasks.every((task) => task.externalCallMade === false)).toBe(true);
    expect(domainTasks.every((task) => task.purchaseAttempted === false)).toBe(true);
    expect(searchPlan.sources).toEqual(
      expect.arrayContaining([
        "WIPO Global Brand Database",
        "USPTO Trademark Search",
        "EUIPO / TMview",
        "Domain availability",
      ])
    );
    expect(searchPlan.automaticLegalClaim).toBe(false);
    expect(searchPlan.finalApprovalWithoutLegalReview).toBe(false);
  });

  test("generates private unchecked candidate names without adopting any brand", () => {
    const candidates = generateBrandCandidates();

    expect(candidates).toHaveLength(20);
    expect(candidates.map((candidate) => candidate.name)).toEqual(
      expect.arrayContaining(["Aurenza", "Veyronis", "Noveris", "Axisora"])
    );
    expect(candidates.every((candidate) => candidate.useStatus === "candidate_only")).toBe(true);
    expect(candidates.every((candidate) => candidate.decision === "needs_deeper_search")).toBe(true);
    expect(candidates.every((candidate) => candidate.publicUseAllowed === false)).toBe(true);
    expect(candidates.every((candidate) => candidate.globalLaunchAllowed === false)).toBe(true);
    expect(candidates.every((candidate) => candidate.ahmadApprovalRequired === true)).toBe(true);
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

    const candidates = await expectFounderApiSafe(
      request,
      "/api/founder/brand-clearance/candidates"
    );
    expect(candidates.candidates).toHaveLength(20);
    expect(candidates.candidates[0]).toMatchObject({
      useStatus: "candidate_only",
      decision: "needs_deeper_search",
      clearanceStatus: "unchecked",
      publicUseAllowed: false,
      globalLaunchAllowed: false,
    });

    const proMaxRisk = await expectFounderApiSafe(
      request,
      "/api/founder/brand-clearance/pro-max-risk"
    );
    expect(proMaxRisk.proMaxRisk).toMatchObject({
      status: "working_name_only",
      riskLevel: "high",
      finalBrandApproved: false,
      publicLaunchAllowed: false,
    });
  });

  test("renders Founder Command brand gate privately and keeps public UI clean", async ({
    page,
  }) => {
    await page.goto("/founder/command", { waitUntil: "domcontentloaded" });
    const panel = page.locator(".alkon-global-brand-gate-panel").first();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("Pro Max remains a working name");
    await expect(panel).toContainText("Alkon remains private");
    await expect(panel).toHaveAttribute("data-final-brand-approved", "false");
    await expect(panel).toHaveAttribute("data-launch-blocked-by-brand-gate", "true");
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
      "reports/pro-max-name-risk-report.md",
      "reports/global-brand-candidates.md",
      "reports/brand-clearance-next-action.md",
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
