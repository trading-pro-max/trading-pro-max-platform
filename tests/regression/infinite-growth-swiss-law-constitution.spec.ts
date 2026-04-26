import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  INFINITE_GROWTH_DOMAIN_REGISTRY,
  INFINITE_GROWTH_MEMORY_LESSONS,
  claimsGate,
  evaluateInfiniteGrowth,
  evaluateSwissLawGravity,
  financialServicesGate,
  founderFinalAuthorityGate,
  getInfiniteGrowthSampleDecision,
  getInfiniteGrowthSnapshot,
  privacyGate,
  productTruthGate,
  treasuryGate,
  type InfiniteGrowthIdea,
} from "../../lib/server/infinite-growth";

const ARTIFACT_DIR = path.join("test-results", "infinite-growth");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|ط§ظ„ظƒظˆظ†|Founder Command|Infinite Sovereign Growth|Swiss-Law Gravity|Sovereign Growth Constitution|Regulatory Gravity|FINMA Gate|Tax Gate internals|TreasuryGate internals|Growth Permit|Product Memory internals|Risk Belt|Black Hole Zone|Codex Government|Task Passport|Result Tribunal|treasury controls|governance/i;

function idea(overrides: Partial<InfiniteGrowthIdea> = {}): InfiniteGrowthIdea {
  return {
    title: "Create safe local product readiness",
    description:
      "Grow docs, tests, audits, memory, and local build without public claims or activation.",
    domain: "docs",
    requestedBy: "founder",
    currentStage: "local_laptop",
    ...overrides,
  };
}

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Swiss-Law Infinite Sovereign Growth Constitution", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents doctrine and exposes founder-only read-only APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-swiss-law-infinite-sovereign-growth-constitution.md",
      "docs/product/infinite-growth-under-swiss-law-gravity.md",
      "docs/product/safe-creation-infinity.md",
      "docs/product/reality-gated-growth.md",
      "docs/product/money-governed-growth.md",
      "docs/product/data-protected-growth.md",
      "docs/product/claims-reviewed-growth.md",
      "docs/product/regulated-financial-activity-gate.md",
      "docs/product/founder-authority-final-gate.md",
      "docs/product/infinite-growth-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    expect((await request.get("/api/infinite-growth/readiness")).status()).toBe(404);
    expect((await request.get("/api/alkon/infinite-growth")).status()).toBe(404);

    const readiness = await request.get("/api/founder/infinite-growth/readiness");
    expect(readiness.status()).toBe(200);
    const payload = await readiness.json();

    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noPayments: true,
      noBankCardData: true,
      noSecrets: true,
      noExternalCalls: true,
      noRegulatedActivityActivation: true,
      snapshot: {
        snapshotId: "alkon_swiss_law_infinite_sovereign_growth_constitution",
        visibility: "private_founder_only",
        publicExposure: false,
        readiness: "ready",
        productTruthStatus: {
          liveExecutionBlocked: true,
          realMoneyBlocked: true,
          brokerFeedActivationBlocked: true,
          billingActivationBlocked: true,
          publicLaunchInactive: true,
          productionActivationBlocked: true,
          socialPublishingInactive: true,
          productionSecretsUntouched: true,
          noPaymentExecution: true,
          noBankCardData: true,
          noRegulatedActivityActivation: true,
          noSecretsExposed: true,
          noShellExecutionFromWebApp: true,
          noImagesOrRasterAssets: true,
          noFakeClaims: true,
        },
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);

    for (const route of [
      "/api/founder/infinite-growth/snapshot",
      "/api/founder/infinite-growth/sample-decision",
      "/api/founder/infinite-growth/gates",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(await response.text()).toMatch(/founderOnly|readOnly|noExecution/);
    }
  });

  test("domain registry includes safe creation and unsafe reality domains", () => {
    const domains = INFINITE_GROWTH_DOMAIN_REGISTRY.map((rule) => rule.domain);

    expect(domains).toEqual(
      expect.arrayContaining([
        "idea",
        "design",
        "docs",
        "tests",
        "audit",
        "memory",
        "safe_local_build",
        "public_ui",
        "assistant",
        "workspace",
        "media",
        "data",
        "billing",
        "payments",
        "treasury",
        "tax",
        "accounting",
        "launch",
        "production",
        "social",
        "broker_feed",
        "live_execution",
        "real_money",
        "financial_services",
        "regulated_activity",
      ])
    );

    const safeDocs = INFINITE_GROWTH_DOMAIN_REGISTRY.find(
      (rule) => rule.domain === "docs"
    );
    const live = INFINITE_GROWTH_DOMAIN_REGISTRY.find(
      (rule) => rule.domain === "live_execution"
    );
    expect(safeDocs?.legalGravity).toBe("local_private_low");
    expect(live?.regulatoryGravity).toBe("regulated_activity_critical");
    expect(live?.forbiddenActions).toContain("live order routing");
  });

  test("Swiss-law gravity classifies local, data, money, media, launch, and regulated growth", () => {
    expect(evaluateSwissLawGravity(idea()).gravity).toBe("local_private_low");
    expect(
      evaluateSwissLawGravity(
        idea({ domain: "data", collectsUserData: true })
      ).gravity
    ).toBe("user_data_high");
    expect(
      evaluateSwissLawGravity(
        idea({ domain: "payments", involvesMoney: true })
      ).gravity
    ).toBe("money_high");
    expect(
      evaluateSwissLawGravity(
        idea({ domain: "media", involvesMediaClaims: true })
      ).gravity
    ).toBe("media_claim_high");
    expect(
      evaluateSwissLawGravity(idea({ domain: "launch", involvesLaunch: true }))
        .gravity
    ).toBe("launch_high");
    expect(
      evaluateSwissLawGravity(
        idea({ domain: "financial_services", involvesFinancialAdvice: true })
      ).gravity
    ).toBe("regulated_activity_critical");
    expect(
      evaluateSwissLawGravity(
        idea({
          domain: "live_execution",
          involvesBrokerFeed: true,
          involvesLiveExecution: true,
          involvesCustomerFunds: true,
        })
      ).gravity
    ).toBe("black_hole");
  });

  test("gates block fake claims, tracking, payment execution, secrets, and regulated activity", () => {
    expect(
      productTruthGate(
        idea({
          title: "Claim guaranteed profit",
          description: "Guaranteed profit and App Store download now.",
          involvesFakeClaim: true,
        })
      ).status
    ).toBe("blocked");

    expect(privacyGate(idea({ domain: "data", involvesPreciseTracking: true })).status).toBe(
      "blocked"
    );
    expect(treasuryGate(idea({ domain: "payments", involvesPayments: true })).status).toBe(
      "black_hole"
    );
    expect(
      treasuryGate(
        idea({
          domain: "payments",
          description: "Store card number and bank credential.",
          involvesBankCardData: true,
        })
      ).status
    ).toBe("black_hole");
    expect(
      claimsGate(idea({ claimText: "Win-rate and profit promise." })).status
    ).toBe("blocked");
    expect(
      financialServicesGate(
        idea({ domain: "financial_services", involvesFinancialAdvice: true })
      ).status
    ).toBe("blocked");
    expect(founderFinalAuthorityGate(idea({ domain: "launch" })).status).toBe(
      "founder_approval_required"
    );
  });

  test("decision engine and permits allow safe creation while blocking unsafe activation", () => {
    const safe = evaluateInfiniteGrowth(idea({ domain: "docs" }));
    expect(safe.decision).toBe("allow_safe_creation");
    expect(safe.permit.outcome).toBe("permit_safe_creation");

    const publicSafe = evaluateInfiniteGrowth(
      idea({
        domain: "public_ui",
        description: "Clarify paper-safe and planned states.",
      })
    );
    expect(publicSafe.decision).toBe("allow_public_safe");
    expect(publicSafe.permit.outcome).toBe("permit_public_safe");

    const data = evaluateInfiniteGrowth(
      idea({ domain: "data", collectsUserData: true })
    );
    expect(data.decision).toBe("privacy_review_required");
    expect(data.permit.outcome).toBe("permit_review_required");

    const billing = evaluateInfiniteGrowth(
      idea({
        title: "Activate billing checkout now",
        description: "Activate checkout and bill users from local code.",
        domain: "billing",
        involvesMoney: true,
        involvesPayments: true,
      })
    );
    expect(["black_hole_forbidden_now", "blocked_until_cleared"]).toContain(
      billing.decision
    );
    expect(["permit_black_hole", "permit_blocked_until_cleared"]).toContain(
      billing.permit.outcome
    );

    const live = evaluateInfiniteGrowth(
      idea({
        domain: "live_execution",
        involvesLiveExecution: true,
        involvesBrokerFeed: true,
        involvesCustomerFunds: true,
      })
    );
    expect(live.decision).toBe("black_hole_forbidden_now");
    expect(live.permit.outcome).toBe("permit_black_hole");
  });

  test("snapshot and Founder Command receive infinite growth readiness", async ({
    request,
  }) => {
    const snapshot = getInfiniteGrowthSnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.safeCreationDomains).toEqual(
      expect.arrayContaining(["idea", "design", "docs", "tests", "audit", "memory"])
    );
    expect(snapshot.blackHoleDomains).toEqual(
      expect.arrayContaining(["broker_feed", "live_execution", "real_money"])
    );
    expect(INFINITE_GROWTH_MEMORY_LESSONS.map((lesson) => lesson.lesson)).toEqual(
      expect.arrayContaining([
        "Infinity is safe creation only.",
        "Money is governed and never executed from code.",
        "Alkon, Infinite Growth, Swiss-law gravity, and internal governance stay private.",
      ])
    );

    const sample = getInfiniteGrowthSampleDecision();
    expect(sample).toMatchObject({
      founderOnly: true,
      readOnly: true,
      sampleOnly: true,
      noExecution: true,
      noPayments: true,
      noBankCardData: true,
      noSecrets: true,
    });

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.infiniteGrowthConstitution.readiness).toBe("ready");
    expect(alkon.snapshot.apiExposure.founderInfiniteGrowthReadinessRoute).toBe(
      "/api/founder/infinite-growth/readiness"
    );

    const founder = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founder.snapshot.infiniteGrowth).toMatchObject({
      snapshotId: "alkon_swiss_law_infinite_sovereign_growth_constitution",
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founder.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/infinite-growth/readiness",
        "/api/founder/infinite-growth/snapshot",
        "/api/founder/infinite-growth/sample-decision",
        "/api/founder/infinite-growth/gates",
      ])
    );
  });

  test("public UI does not expose infinite growth or Alkon terms", async ({
    page,
  }) => {
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

  test("implementation remains code-only, secret-free, payment-free, and non-executing", () => {
    const sourceFiles = [
      "lib/server/infinite-growth/types.ts",
      "lib/server/infinite-growth/domain-registry.ts",
      "lib/server/infinite-growth/swiss-law-gravity.ts",
      "lib/server/infinite-growth/gates.ts",
      "lib/server/infinite-growth/decision-engine.ts",
      "lib/server/infinite-growth/growth-permit.ts",
      "lib/server/infinite-growth/memory.ts",
      "lib/server/infinite-growth/state.ts",
      "lib/server/infinite-growth/index.ts",
      "app/api/founder/infinite-growth/readiness/route.ts",
      "app/api/founder/infinite-growth/snapshot/route.ts",
      "app/api/founder/infinite-growth/sample-decision/route.ts",
      "app/api/founder/infinite-growth/gates/route.ts",
      "modules/founder-command/components/AlkonInfiniteGrowthPanel.tsx",
      "modules/founder-command/components/AlkonSwissLawGravityPanel.tsx",
      "modules/founder-command/components/AlkonGrowthGatesPanel.tsx",
      "modules/founder-command/components/AlkonGrowthPermitPanel.tsx",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/paymentExecutionStatus:\s*["']enabled["']/);
    expect(source).not.toMatch(/bankCardDataStatus:\s*["']allowed["']/);
    expect(source).not.toMatch(/regulatedActivityActivation:\s*true/);
  });
});
