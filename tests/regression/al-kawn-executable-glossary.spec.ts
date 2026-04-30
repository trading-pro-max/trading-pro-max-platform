import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|unknown-source asset public approved|global ownership confirmed|trademark approved|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Executable Glossary", () => {
  test("/desktop/kawn renders executable glossary", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Executable Glossary");
    await expect(body).toContainText("كل مصطلح داخل الكون يجب أن يكون قابلًا للتنفيذ");
    await expect(body).toContainText("داخل الكون: المصطلح يتحول إلى قدرة");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders executable glossary count", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Executable Glossary");
    await expect(body).toContainText("terms");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("executable glossary exports required functions and docs", () => {
    const source = readFileSync("lib/server/universe/executable-glossary/index.ts", "utf8");

    expect(source).toContain("getAlKawnExecutableGlossary");
    expect(source).toContain("getExecutableGlossaryTerm");
    expect(source).toContain("getTermsByLayer");
    expect(source).toContain("getTermsByExecutionStatus");
    expect(source).toContain("getTermCapabilityMap");
    expect(source).toContain("getTermNextAction");
    expect(source).toContain("Digital Miracles");
    expect(existsSync("docs/product/al-kawn-executable-glossary.md")).toBe(true);
    expect(existsSync("reports/al-kawn-executable-glossary.md")).toBe(true);
    expect(source).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
