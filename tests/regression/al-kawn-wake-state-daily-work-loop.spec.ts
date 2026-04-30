import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Infinity Mode active|Operator Mode active|public launch active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|public الكون active|public ALKON active|secrets stored in daily report|guaranteed profit|risk free|physical universe controlled/i;

test.describe("Al-Kawn Wake State + Daily Work Loop", () => {
  test("/desktop/kawn renders wake state and human interface", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-wake-state-panel")).toBeVisible();
    await expect(body).toContainText("Al-Kawn Wake State");
    await expect(body).toContainText("الكون استيقظ للعمل الداخلي اليومي");
    await expect(body).toContainText("الكون يتكلم مع أحمد بلغة بشرية واضحة");
    await expect(body).toContainText("Human Spoken Interface is active");
    await expect(body).toContainText("Daily Work Loop is active");
    await expect(body).toContainText("Product Truth loaded");
    await expect(body).toContainText("Universe Operating Kernel checked");
    await expect(body).toContainText("Inside الكون: direct internal execution");
    await expect(body).toContainText("Legal and Money gates stop execution for Ahmad");
    await expect(body).toContainText("Daily WAKE REPORT prepared");
    await expect(body).toContainText("One next action selected");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows compact wake state", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-wake-state-summary")).toBeVisible();
    await expect(body).toContainText("Al-Kawn Wake State");
    await expect(body).toContainText("الكون يستيقظ من /desktop/kawn");
    await expect(body).toContainText("الكون يتكلم مع أحمد فقط");
    await expect(body).toContainText("Daily Work Loop prepares one next action");
    await expect(body).toContainText("Legal and Money remain Ahmad gates");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("wake models, docs, daily reports, and closure report exist", () => {
    const wakeStateSource = readFileSync(
      "lib/server/universe/wake-state/wake-state.ts",
      "utf8",
    );
    const dailyLoopSource = readFileSync(
      "lib/server/universe/daily-work-loop/daily-loop.ts",
      "utf8",
    );
    const spokenSource = readFileSync(
      "lib/server/universe/human-spoken-interface/spoken-state.ts",
      "utf8",
    );

    expect(existsSync("lib/server/universe/wake-state/index.ts")).toBe(true);
    expect(existsSync("lib/server/universe/daily-work-loop/index.ts")).toBe(true);
    expect(existsSync("lib/server/universe/human-spoken-interface/index.ts")).toBe(true);
    expect(existsSync("reports/daily/al-kawn-daily-wake-report.md")).toBe(true);
    expect(existsSync("reports/daily/al-kawn-daily-work-loop.md")).toBe(true);
    expect(existsSync("reports/daily/al-kawn-daily-spoken-briefing.md")).toBe(true);
    expect(existsSync("reports/daily/al-kawn-daily-next-action.md")).toBe(true);
    expect(existsSync("docs/product/al-kawn-wake-state-daily-work-loop.md")).toBe(true);
    expect(existsSync("docs/product/al-kawn-human-spoken-interface.md")).toBe(true);
    expect(existsSync("reports/al-kawn-wake-state-daily-work-loop-closure.md")).toBe(true);
    expect(wakeStateSource).toContain("getAlKawnWakeState");
    expect(wakeStateSource).toContain("Product Truth loaded.");
    expect(dailyLoopSource).toContain("getAlKawnDailyWorkLoop");
    expect(dailyLoopSource).toContain("Daily Work Loop enhancement");
    expect(spokenSource).toContain("getAlKawnHumanSpokenInterfaceState");
    expect(spokenSource).toContain("الكون يتكلم مع أحمد بلغة بشرية واضحة");
    expect(wakeStateSource + dailyLoopSource + spokenSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
