import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Infinity Mode active|Operator Mode active|public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|secrets stored in daily report|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Daily Work Loop Enhancement", () => {
  test("/desktop/kawn renders enhanced daily work loop", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-wake-state-panel")).toBeVisible();
    await expect(body).toContainText("Daily Work Loop enhancement");
    await expect(body).toContainText("الكون ينظم يومه الداخلي");
    await expect(body).toContainText("Today’s internal work is selected");
    await expect(body).toContainText("Safe internal work can continue");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("Daily blockers are visible");
    await expect(body).toContainText("Daily WAKE REPORT updated");
    await expect(body).toContainText("One next action selected");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact enhanced daily loop summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-wake-state-summary")).toBeVisible();
    await expect(body).toContainText("Daily Work Loop enhancement");
    await expect(body).toContainText("الكون ينظم يومه الداخلي");
    await expect(body).toContainText("One next action selected");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("enhanced daily loop model, reports, and docs exist", () => {
    const indexSource = readFileSync("lib/server/universe/daily-work-loop/index.ts", "utf8");
    const loopSource = readFileSync("lib/server/universe/daily-work-loop/daily-loop.ts", "utf8");
    const selectionSource = readFileSync(
      "lib/server/universe/daily-work-loop/daily-work-selection.ts",
      "utf8",
    );
    const spokenSource = readFileSync(
      "lib/server/universe/human-spoken-interface/spoken-briefing.ts",
      "utf8",
    );

    expect(indexSource).toContain("getDailySelectedWorkItem");
    expect(indexSource).toContain("getDailyProgressState");
    expect(indexSource).toContain("getDailyMemorySnapshot");
    expect(indexSource).toContain("getDailyNextAction");
    expect(loopSource).toContain("Daily Work Loop enhancement");
    expect(loopSource).toContain("الكون ينظم يومه الداخلي");
    expect(selectionSource).toContain("Product Truth verification");
    expect(spokenSource).toContain("أحمد، الكون مستيقظ ويعمل داخليًا");
    expect(existsSync("reports/daily/al-kawn-daily-blockers.md")).toBe(true);
    expect(existsSync("reports/daily/al-kawn-daily-memory-snapshot.md")).toBe(true);
    expect(existsSync("docs/product/al-kawn-daily-work-loop-enhancement.md")).toBe(true);
    expect(existsSync("reports/al-kawn-daily-work-loop-enhancement.md")).toBe(true);
    expect(loopSource + selectionSource + spokenSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
