import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { getAlkonTodayOperationSnapshot } from "../../lib/server/alkon-daily-operation";
import { prioritizeJarItems } from "../../lib/server/jar-build/prioritizer";
import { getJarInboxItems } from "../../lib/server/jar-build/state";

const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|Alkon -0|Founder Command|Jar System|Permission-to-Exist internals|Kernel|Zero Truth|Reality Trial|internal governance/i;
const UNSAFE_TERMS =
  /Live trade now|Pay now|Deposit|Withdraw|Connect broker|Activate billing|Run shell|Run Codex/i;

async function expectPublicSafe(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main").first()).toBeVisible();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  expect(bodyText).not.toMatch(UNSAFE_TERMS);
  await expect(page.locator('a[href^="/founder"], a[href^="/api/founder"]')).toHaveCount(0);
}

test.describe("ALKON Real Daily Operating Activation", () => {
  test("returns a daily operating truth snapshot with one next action", () => {
    const snapshot = getAlkonTodayOperationSnapshot("2026-04-28T00:00:00.000Z");

    expect(snapshot).toMatchObject({
      founderOnly: true,
      readOnly: true,
      previewOnly: true,
      noExecution: true,
      noShell: true,
      noCodex: true,
      noPayments: true,
      noExternalCalls: true,
      noPublicExposure: true,
      status: "operating_with_notes",
    });
    expect(snapshot.currentHeart).toContain("/trading");
    expect(snapshot.oneNextAction.action).toMatch(/Ahmad reviews.*\/trading/i);
    expect(snapshot.oneNextAction.requiresAhmad).toBe(true);
    expect(snapshot.localDayOne.status).toBe("not_started");
    expect(snapshot.productTruth).toMatchObject({
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      brokerFeed: "inactive",
      publicLaunch: "inactive",
      noSecretsExposed: true,
      noPublicAlkonExposure: true,
    });
    expect(snapshot.whatNotToDo).toEqual(
      expect.arrayContaining([
        "Do not work on brand naming now.",
        "Do not start Local Day One automatically.",
      ])
    );
  });

  test("delays Global Exclusive Brand Gate in Jar instead of making it active priority", () => {
    const inbox = getJarInboxItems();
    const priorities = prioritizeJarItems(inbox);
    const brandGate = inbox.find((item) => item.id === "jar_item_global_brand_gate_delayed");

    expect(brandGate).toMatchObject({
      title: "Global Exclusive Brand Gate",
      jarId: "jar_8_future_worlds",
      decision: "delay",
      lifecycle: "delayed",
      commandPassportRequired: false,
    });
    expect(brandGate?.reason).toMatch(/ALKON operation comes first/i);
    expect(priorities[0].id).not.toBe("jar_item_global_brand_gate_delayed");
  });

  test("/founder/alkon displays today status, one next action, Jar priority, and Product Truth", async ({
    page,
  }) => {
    await page.goto("/founder/alkon", { waitUntil: "domcontentloaded" });

    const panel = page.locator(".alkon-today-operating-panel").first();
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("data-brand-gate-delayed", "true");
    await expect(panel).toHaveAttribute("data-local-day-one", "not_started");
    await expect(panel).toHaveAttribute("data-no-execution", "true");
    await expect(panel).toContainText("Today Status");
    await expect(panel).toContainText("One Next Action");
    await expect(panel).toContainText("Jar Priority");
    await expect(panel).toContainText("Heart before brand");
    await expect(panel).toContainText("Product Truth");
    await expect(panel).toContainText("Live execution");
    await expect(panel).toContainText("Blocked");
    await expect(panel).toContainText("Local Day One Gate");
    await expect(panel).toContainText("Not started");
    await expect(panel).toContainText("Do not work on brand naming now");
  });

  test("keeps public pages clean and reports daily operation", async ({ page }) => {
    await expectPublicSafe(page, "/");
    await expectPublicSafe(page, "/diagnostics");

    const requiredReports = [
      "reports/alkon-today-status.md",
      "reports/alkon-operating-truth-snapshot.md",
      "reports/alkon-daily-operating-loop.md",
      "reports/alkon-one-next-action.md",
    ];

    for (const report of requiredReports) {
      const fullPath = path.join(process.cwd(), report);
      expect(fs.existsSync(fullPath), report).toBe(true);
      expect(fs.readFileSync(fullPath, "utf8")).toMatch(/Daily|One Next Action|ALKON|truth/i);
    }
  });
});
