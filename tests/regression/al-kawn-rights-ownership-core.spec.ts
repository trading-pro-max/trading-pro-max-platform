import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|unknown-source asset public approved|global ownership confirmed|trademark approved|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Rights & Ownership Core", () => {
  test("/desktop/kawn renders rights and ownership core", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Rights & Ownership");
    await expect(body).toContainText("Every entity inside الكون must have ownership and source evidence");
    await expect(body).toContainText("Unknown-source items are blocked from public use");
    await expect(body).toContainText("No global ownership claim is allowed");
    await expect(body).toContainText("Trademark/legal review is required before public brand adoption");
    await expect(body).toContainText("Product Truth overrides ownership claims");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact rights summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Rights & Ownership");
    await expect(body).toContainText("Unknown-source items are blocked from public use");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("rights source, ledger, snapshot, docs, and report exist", () => {
    const source = readFileSync("lib/server/universe/rights-ownership/index.ts", "utf8");

    expect(source).toContain("getAlKawnOwnershipRegistry");
    expect(source).toContain("getAlKawnRightsLedger");
    expect(source).toContain("getAlKawnIPEvidence");
    expect(source).toContain("getAssetRightsRegistry");
    expect(source).toContain("getCodeProvenanceRegistry");
    expect(source).toContain("getDocumentRightsRegistry");
    expect(source).toContain("getBrandRightsStatus");
    expect(source).toContain("getLicensingPolicy");
    expect(source).toContain("getPublicUseGate");
    expect(source).toContain("getRightsNextAction");
    expect(existsSync("ledger/rights/al-kawn-rights-ledger.md")).toBe(true);
    expect(existsSync("snapshots/rights/current-rights-state.json")).toBe(true);
    expect(existsSync("docs/product/al-kawn-rights-ownership-core.md")).toBe(true);
    expect(existsSync("reports/al-kawn-rights-ownership-core.md")).toBe(true);
    expect(source).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
