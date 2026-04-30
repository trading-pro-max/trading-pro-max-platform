import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /uncontrolled infinite loop active|hidden daemon active|public launch active|public الكون active|public ALKON active|billing active|payments active|receiving money active|withdrawals active|bank transfer active|real money enabled|broker execution active|legal approval active|FINMA approved|external accounts connected without approval|secrets stored in Git|secrets stored in desktop bundle|Product Truth disabled|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Living Autonomous Intelligence", () => {
  test("/desktop/kawn renders living autonomous intelligence", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-living-autonomous-intelligence-panel")).toBeVisible();
    await expect(body).toContainText("Al-Kawn Living Autonomous Intelligence");
    await expect(body).toContainText("الكون يعمل بذكاء حي داخل أجهزة أحمد");
    await expect(body).toContainText("الكون لا ينتظر فقط؛ الكون يراقب ويفهم ويختار وينفذ داخليًا");
    await expect(body).toContainText("الذكاء الحي داخل الكون يعمل عبر Trigger آمن، وليس loop فوضوي");
    await expect(body).toContainText("كل دورة تختار عملًا داخليًا واحدًا");
    await expect(body).toContainText("Product Truth يحكم كل قرار ذكي");
    await expect(body).toContainText("الكون يشرح ماذا فعل ولماذا فعل");
    await expect(body).toContainText("Run intelligent internal cycle");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact living autonomous intelligence summary", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-living-autonomous-intelligence-summary")).toBeVisible();
    await expect(body).toContainText("Living Autonomous Intelligence");
    await expect(body).toContainText("الكون يراقب ويختار عملًا داخليًا آمنًا");
    await expect(body).toContainText("المال الحقيقي بقرار أحمد فقط");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("living autonomous intelligence model, docs, and reports exist", () => {
    const indexSource = readFileSync(
      "lib/server/universe/living-autonomous-intelligence/index.ts",
      "utf8",
    );
    const stateSource = readFileSync(
      "lib/server/universe/living-autonomous-intelligence/intelligence-state.ts",
      "utf8",
    );

    expect(indexSource).toContain("getAlKawnLivingAutonomousIntelligence");
    expect(indexSource).toContain("getAlKawnAwarenessModel");
    expect(indexSource).toContain("getAlKawnContextReader");
    expect(indexSource).toContain("getAlKawnSelfObservation");
    expect(indexSource).toContain("getAlKawnDecisionEngine");
    expect(indexSource).toContain("getAlKawnActionSelector");
    expect(indexSource).toContain("getAlKawnAutonomousCycle");
    expect(indexSource).toContain("getAlKawnIntelligenceBoundaries");
    expect(indexSource).toContain("getAlKawnIntelligenceReport");
    expect(indexSource).toContain("getAlKawnIntelligenceNextAction");
    expect(stateSource).toContain("الكون يعمل بذكاء حي داخل أجهزة أحمد.");
    expect(existsSync("docs/product/al-kawn-living-autonomous-intelligence.md")).toBe(true);
    expect(existsSync("reports/intelligence/al-kawn-living-autonomous-intelligence.md")).toBe(true);
    expect(existsSync("reports/intelligence/al-kawn-intelligence-cycle-report.md")).toBe(true);
    expect(existsSync("reports/intelligence/al-kawn-intelligence-selected-action.md")).toBe(true);
    expect(existsSync("reports/intelligence/al-kawn-intelligence-next-action.md")).toBe(true);
    expect(indexSource + stateSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
