import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|unknown-source asset public approved|global ownership confirmed|trademark approved|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Complete Electronic Capabilities", () => {
  test("/desktop/kawn renders capability matrix", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Capability Matrix");
    await expect(body).toContainText("Inside الكون: direct internal execution");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders capability summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Capability Matrix");
    await expect(body).toContainText("capabilities");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("capability matrix exports required functions and docs", () => {
    const source = readFileSync("lib/server/universe/electronic-capabilities/index.ts", "utf8");

    expect(source).toContain("getAlKawnElectronicCapabilities");
    expect(source).toContain("getElectronicCapabilityById");
    expect(source).toContain("getElectronicCapabilitiesByCategory");
    expect(source).toContain("getElectronicCapabilitiesByLayer");
    expect(source).toContain("getElectronicCapabilityVerdict");
    expect(source).toContain("getElectronicCapabilitySummary");
    expect(source).toContain("getElectronicCapabilityNextAction");
    expect(source).toContain("Digital Miracles");
    expect(existsSync("docs/product/al-kawn-complete-electronic-capabilities.md")).toBe(true);
    expect(existsSync("reports/al-kawn-complete-electronic-capabilities.md")).toBe(true);
    expect(source).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
