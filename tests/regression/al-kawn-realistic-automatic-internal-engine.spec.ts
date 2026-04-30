import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|unknown-source asset public approved|global ownership confirmed|trademark approved|uncontrolled infinite loop active|background daemon active|Local Day One started without Ahmad|guaranteed profit|risk free|physical universe controlled|Product Truth disabled/i;

test.describe("Al-Kawn Realistic Automatic Internal Engine", () => {
  test("/desktop/kawn renders automatic internal engine", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Automatic Internal Engine");
    await expect(body).toContainText("الكون يعمل تلقائيًا داخل نطاقه الخاص");
    await expect(body).toContainText("No uncontrolled infinite loop");
    await expect(body).toContainText("Safe trigger required for every cycle");
    await expect(body).toContainText("One automatic work item per cycle");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders automatic engine summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Automatic Engine");
    await expect(body).toContainText("Safe trigger required for every cycle");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("automatic engine exports required functions and docs", () => {
    const source = readFileSync("lib/server/universe/automatic-engine/index.ts", "utf8");

    expect(source).toContain("getAlKawnAutomaticEngineState");
    expect(source).toContain("getAutomaticCyclePlan");
    expect(source).toContain("getAutomaticTriggerRules");
    expect(source).toContain("getAutomaticScanResult");
    expect(source).toContain("getAutomaticGapDetection");
    expect(source).toContain("getAutomaticSelectedWork");
    expect(source).toContain("getAutomaticValidationPlan");
    expect(source).toContain("getAutomaticReport");
    expect(source).toContain("getAutomaticMemoryUpdate");
    expect(source).toContain("getAutomaticNextAction");
    expect(existsSync("docs/product/al-kawn-realistic-automatic-internal-engine.md")).toBe(true);
    expect(existsSync("reports/al-kawn-realistic-automatic-internal-engine.md")).toBe(true);
    expect(source).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
