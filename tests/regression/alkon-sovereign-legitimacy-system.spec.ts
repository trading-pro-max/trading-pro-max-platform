import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  evaluateAlkonLegitimacy,
  getAlkonLegitimacyDecisionSample,
  getAlkonLegitimacySnapshot,
  reviewFinancialLegitimacy,
  reviewFounderResponsibility,
  reviewLegalGuardianLegitimacy,
  reviewPurposeLegitimacy,
  reviewReputationLegitimacy,
  reviewReversibilityLegitimacy,
  reviewSecurityLegitimacy,
  reviewTimingLegitimacy,
  reviewTruthLegitimacy,
  type AlkonLegitimacyRequest,
} from "../../lib/server/alkon-legitimacy";
import { getMediaIntelligenceSnapshot } from "../../lib/server/media-intelligence";
import { getTreasuryLifeSnapshot } from "../../lib/server/treasury-life";

const ARTIFACT_DIR = path.join("test-results", "alkon-legitimacy");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Sovereign Legitimacy|Authority Fabric|Presence Gate|Camera Liveness|Treasury Autopay|Tax Reserve internals|Codex Government|Task Passport|Result Tribunal|Cosmic Physics|Sovereign Consciousness|\bministries\b|\bcouncils\b|\bgovernance\b|secrets authority|treasury controls|Product Memory internals|Black Hole Zone|VAT Threshold Watch|Payment approvals/i;

function baseRequest(
  overrides: Partial<AlkonLegitimacyRequest> = {}
): AlkonLegitimacyRequest {
  return {
    actionCategory: "public_ui_change",
    title: "Improve public clarity",
    description: "Improve clarity for real public Earth users while preserving Product Truth.",
    requestedBy: "founder",
    affectedWorld: "public_earth",
    affectedSurface: "Home",
    currentStage: "laptop_planet",
    fundingMode: "founder_funded",
    hasInvoice: false,
    hasRollback: true,
    requiresSecrets: false,
    publicVisible: true,
    planImpact: "none",
    productTruthImpact: "copy_only",
    ...overrides,
  };
}

async function expectPublicSafe(page: Page) {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("Alkon Sovereign Legitimacy System", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents private legitimacy doctrine and founder-only APIs", async ({
    request,
  }) => {
    const requiredDocs = [
      "docs/product/alkon-sovereign-legitimacy-system.md",
      "docs/product/alkon-authority-vs-legitimacy.md",
      "docs/product/alkon-purpose-legitimacy.md",
      "docs/product/alkon-truth-legitimacy.md",
      "docs/product/alkon-user-legitimacy.md",
      "docs/product/alkon-financial-legitimacy.md",
      "docs/product/alkon-security-legitimacy.md",
      "docs/product/alkon-timing-legitimacy.md",
      "docs/product/alkon-reversibility-legitimacy.md",
      "docs/product/alkon-reputation-legitimacy.md",
      "docs/product/alkon-decision-permit-law.md",
      "docs/product/alkon-legitimacy-index.md",
      "docs/product/alkon-treasury-life-system.md",
      "docs/product/treasury-founder-funded-to-revenue-funded.md",
      "docs/product/treasury-autopay-governance.md",
      "docs/product/tax-reserve-readiness.md",
      "docs/product/vat-threshold-watch.md",
      "docs/product/invoice-evidence-law.md",
      "docs/product/treasury-life-index.md",
      "docs/product/alkon-reality-communication-system.md",
      "docs/product/media-claims-firewall.md",
      "docs/product/media-reputation-defense.md",
      "docs/product/media-intelligence-index.md",
      "docs/security/alkon-sovereign-authority-fabric.md",
      "docs/security/alkon-presence-authority-system.md",
      "docs/security/alkon-owner-shield.md",
      "docs/security/alkon-emergency-lockdown.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    expect((await request.get("/api/alkon-legitimacy/readiness")).status()).toBe(404);
    expect((await request.get("/api/treasury-life/readiness")).status()).toBe(404);

    const response = await request.get("/api/founder/alkon-legitimacy/readiness");
    expect(response.status()).toBe(200);
    const payload = await response.json();

    expect(payload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      noExecution: true,
      noPayments: true,
      noBankCardData: true,
      noSecrets: true,
      noExternalCalls: true,
      snapshot: {
        snapshotId: "alkon_sovereign_legitimacy_system",
        visibility: "private_founder_only",
        publicExposure: false,
        readiness: "ready",
        financialReadiness: {
          paymentExecutionStatus: "disabled",
          bankCardSecretStatus: "forbidden",
        },
        productTruthStatus: {
          liveExecutionBlocked: true,
          realMoneyBlocked: true,
          brokerFeedActivationBlocked: true,
          billingActivationBlocked: true,
          publicLaunchInactive: true,
          productionActivationBlocked: true,
          noPaymentExecution: true,
          noBankCardData: true,
          noTaxLegalFinancialFinalAdvice: true,
          noSecretsExposed: true,
          noShellExecutionFromWebApp: true,
          noImagesOrRasterAssets: true,
        },
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(SECRET_PATTERN);
  });

  test("evaluates legitimacy dimensions deterministically", () => {
    expect(
      reviewPurposeLegitimacy(
        baseRequest({
          title: "Vanity button",
          description: "vanity hype",
        })
      ).outcome
    ).toBe("review_required");

    expect(
      reviewTruthLegitimacy(
        baseRequest({
          title: "Fake launch claim",
          description: "Claim mobile App Store downloads and guaranteed profit.",
          claimText: "Guaranteed profit and App Store download now.",
        })
      ).outcome
    ).toBe("blocked");

    expect(
      reviewFinancialLegitimacy(
        baseRequest({
          actionCategory: "treasury_payment",
          title: "Pay vendor without invoice",
          description: "Review founder-funded vendor payment.",
          affectedWorld: "private_alkon",
          publicVisible: false,
          hasInvoice: false,
        })
      ).outcome
    ).toBe("review_required");

    expect(
      reviewFinancialLegitimacy(
        baseRequest({
          actionCategory: "treasury_payment",
          title: "Pay with card number",
          description: "Use card number and CVV to execute payment now.",
          affectedWorld: "private_alkon",
          publicVisible: false,
          hasInvoice: true,
        })
      ).outcome
    ).toBe("black_holed");

    expect(
      reviewSecurityLegitimacy(
        baseRequest({
          actionCategory: "secrets_access",
          title: "Show raw secret",
          description: "Show raw production API key.",
          requiresSecrets: true,
          affectedWorld: "private_alkon",
          publicVisible: false,
        })
      ).outcome
    ).toBe("black_holed");

    expect(
      reviewTimingLegitimacy(
        baseRequest({
          actionCategory: "billing_activation",
          productTruthImpact: "billing",
          hasRollback: false,
          requiresSecrets: true,
        })
      ).outcome
    ).toBe("blocked");

    expect(
      reviewReversibilityLegitimacy(
        baseRequest({
          actionCategory: "production_activation",
          riskHint: "critical",
          hasRollback: false,
        })
      ).outcome
    ).toBe("blocked");

    expect(
      reviewReputationLegitimacy(
        baseRequest({
          actionCategory: "media_content",
          claimText: "Guaranteed win-rate signal platform.",
        })
      ).outcome
    ).toBe("blocked");

    expect(
      reviewLegalGuardianLegitimacy(
        baseRequest({
          actionCategory: "legal_claim",
          claimText: "Official Swiss company and Sharia certified.",
        })
      ).outcome
    ).toBe("blocked");

    expect(
      reviewFounderResponsibility(
        baseRequest({
          actionCategory: "security_setting_change",
          affectedWorld: "private_alkon",
          publicVisible: false,
        })
      ).founderDecisionRequired
    ).toBe(true);
  });

  test("aggregates decision permits and preserves black-hole categories", () => {
    const allowed = evaluateAlkonLegitimacy(
      baseRequest({
        actionCategory: "public_ui_change",
        title: "Improve support clarity",
        description: "Improve support clarity for real public users and reduce confusion.",
        hasRollback: true,
      })
    );
    expect(allowed.permit.outcome).toMatch(/permit_/);
    expect(allowed.permit.mayExecuteFromWebApp).toBe(false);
    expect(allowed.permit.paymentExecutionEnabled).toBe(false);
    expect(allowed.permit.secretsAllowed).toBe(false);

    const blocked = evaluateAlkonLegitimacy(
      baseRequest({
        actionCategory: "billing_activation",
        title: "Activate billing now",
        description: "Enable paid checkout and payment provider now.",
        productTruthImpact: "billing",
        hasRollback: false,
        requiresSecrets: true,
      })
    );
    expect(blocked.outcome).toBe("black_holed");
    expect(blocked.permit.outcome).toBe("permit_black_holed");
    expect(blocked.permit.failedDimensions).toEqual(
      expect.arrayContaining([
        "truth_legitimacy",
        "financial_legitimacy",
        "security_legitimacy",
        "timing_legitimacy",
      ])
    );

    const sample = getAlkonLegitimacyDecisionSample();
    expect(sample).toMatchObject({
      founderOnly: true,
      readOnly: true,
      previewOnly: true,
      noExecution: true,
      noPayments: true,
      noSecrets: true,
    });
  });

  test("models treasury life and media intelligence without execution", async ({
    request,
  }) => {
    const treasury = getTreasuryLifeSnapshot();
    expect(treasury).toMatchObject({
      fundingMode: "founder_funded",
      paymentExecutionStatus: "disabled",
      bankCardSecretStatus: "forbidden",
      noBankCardDataStored: true,
      noPaymentExecution: true,
      noTaxFilingAutomation: true,
      publicExposure: false,
    });

    const media = getMediaIntelligenceSnapshot();
    expect(media).toMatchObject({
      publishingGate: "inactive",
      publicExposure: false,
      noExternalCalls: true,
      channelReality: {
        socialAccountsConnected: false,
        tokensPresent: false,
        publishingEnabled: false,
        adSpendEnabled: false,
      },
      claimsFirewall: {
        ready: true,
        blocksProfitClaims: true,
        blocksFakeLaunchClaims: true,
        blocksFakeDownloads: true,
        blocksFakePartnerships: true,
      },
    });

    for (const route of [
      "/api/founder/treasury-life/readiness",
      "/api/founder/media-intelligence/readiness",
      "/api/founder/alkon-legitimacy/decision-sample",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text, route).not.toMatch(SECRET_PATTERN);
      expect(text, route).toMatch(/readOnly|noExecution|noSecrets|noPayments|noPublishing|previewOnly/);
    }
  });

  test("integrates with Alkon and Founder Command without public exposure", async ({
    request,
  }) => {
    const snapshot = getAlkonLegitimacySnapshot("2026-04-26T10:00:00.000Z");
    expect(snapshot.blockedCategories).toEqual(
      expect.arrayContaining([
        "production_activation",
        "billing_activation",
        "broker_feed_activation",
        "live_execution_activation",
        "real_money_activation",
        "social_publishing",
        "secrets_access",
      ])
    );
    expect(snapshot.blackHoleCategories).toEqual(
      expect.arrayContaining([
        "billing_activation",
        "broker_feed_activation",
        "live_execution_activation",
        "real_money_activation",
        "production_activation",
        "secrets_access",
      ])
    );

    const founderCommand = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founderCommand.snapshot.alkonLegitimacy).toMatchObject({
      snapshotId: "alkon_sovereign_legitimacy_system",
      visibility: "private_founder_only",
      publicExposure: false,
    });
    expect(founderCommand.snapshot.treasuryLife).toMatchObject({
      paymentExecutionStatus: "disabled",
      bankCardSecretStatus: "forbidden",
    });
    expect(founderCommand.snapshot.mediaIntelligence).toMatchObject({
      publishingGate: "inactive",
    });
    expect(founderCommand.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/alkon-legitimacy/readiness",
        "/api/founder/alkon-legitimacy/decision-sample",
        "/api/founder/treasury-life/readiness",
        "/api/founder/media-intelligence/readiness",
      ])
    );
    expect(
      founderCommand.snapshot.insideOutsidePlanet.privateWorld.alkonUniverse
    ).toMatchObject({
      legitimacyReady: true,
      legitimacyPublicExposure: false,
    });
  });

  test("keeps legitimacy, treasury, and authority language absent from public UI", async ({
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

  test("keeps implementation code-only, secret-free, payment-free, and non-executing", () => {
    const sourceFiles = [
      "app/api/founder/alkon-legitimacy/readiness/route.ts",
      "app/api/founder/alkon-legitimacy/decision-sample/route.ts",
      "app/api/founder/treasury-life/readiness/route.ts",
      "app/api/founder/media-intelligence/readiness/route.ts",
      "lib/server/alkon-legitimacy/types.ts",
      "lib/server/alkon-legitimacy/dimensions.ts",
      "lib/server/alkon-legitimacy/purpose-legitimacy.ts",
      "lib/server/alkon-legitimacy/truth-legitimacy.ts",
      "lib/server/alkon-legitimacy/user-legitimacy.ts",
      "lib/server/alkon-legitimacy/financial-legitimacy.ts",
      "lib/server/alkon-legitimacy/security-legitimacy.ts",
      "lib/server/alkon-legitimacy/timing-legitimacy.ts",
      "lib/server/alkon-legitimacy/reversibility-legitimacy.ts",
      "lib/server/alkon-legitimacy/reputation-legitimacy.ts",
      "lib/server/alkon-legitimacy/legal-guardian-legitimacy.ts",
      "lib/server/alkon-legitimacy/founder-responsibility.ts",
      "lib/server/alkon-legitimacy/decision-permit.ts",
      "lib/server/alkon-legitimacy/engine.ts",
      "lib/server/alkon-legitimacy/state.ts",
      "lib/server/treasury-life/types.ts",
      "lib/server/treasury-life/state.ts",
      "lib/server/media-intelligence/types.ts",
      "lib/server/media-intelligence/state.ts",
      "modules/founder-command/components/AlkonLegitimacyPanel.tsx",
      "modules/founder-command/components/AlkonDecisionPermitPanel.tsx",
      "modules/founder-command/components/AlkonTreasuryLifePanel.tsx",
      "modules/founder-command/components/AlkonAuthorityFabricPanel.tsx",
      "modules/founder-command/components/AlkonMediaRealityPanel.tsx",
    ];
    const sources = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(sources).not.toMatch(SECRET_PATTERN);
    expect(sources).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(sources).not.toMatch(/child_process|execSync|spawnSync|shellCommand/i);
    expect(sources).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(sources).not.toMatch(/paymentExecutionStatus:\s*["']enabled["']/);
    expect(sources).not.toMatch(/publishingGate:\s*["']active["']/);
    expect(sources).not.toMatch(/liveExecutionActive:\s*true/);
    expect(sources).not.toMatch(/billingActivationActive:\s*true/);
  });
});
