import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|unknown-source asset public approved|global ownership confirmed|trademark approved|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Living Ontology Core", () => {
  test("/desktop/kawn renders living ontology core", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Living Ontology Core");
    await expect(body).toContainText("الكون هو كيان إلكتروني حي داخل لابتوب أحمد");
    await expect(body).toContainText("كل طبقة داخل الكون لها وجود ومعنى وحالة وقدرة");
    await expect(body).toContainText("كل شيء داخل الكون يمكن تفسيره من ∞ إلى 0");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact living ontology summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Living Ontology");
    await expect(body).toContainText("الكون هو كيان إلكتروني حي داخل لابتوب أحمد");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("living ontology exports required functions and docs", () => {
    const source = readFileSync("lib/server/universe/living-ontology/index.ts", "utf8");

    expect(source).toContain("getAlKawnLivingOntology");
    expect(source).toContain("getLivingEntities");
    expect(source).toContain("getLivingEntityById");
    expect(source).toContain("getLivingCapabilities");
    expect(source).toContain("getLivingDetails");
    expect(source).toContain("getLivingActions");
    expect(source).toContain("getLivingMemory");
    expect(source).toContain("getLivingTruth");
    expect(source).toContain("getLivingProtection");
    expect(source).toContain("getLivingVerdict");
    expect(source).toContain("explainEntityFromInfinityToZero");
    expect(source).toContain("getLivingOntologyNextAction");
    expect(existsSync("docs/product/al-kawn-living-ontology-core.md")).toBe(true);
    expect(existsSync("reports/al-kawn-living-ontology-core.md")).toBe(true);
    expect(source).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
