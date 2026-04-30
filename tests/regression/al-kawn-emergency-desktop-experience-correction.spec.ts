import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Local Day One started|public الكون active|public ALKON active|public launch active|billing active|payments active|receiving money active|withdrawals active|real money enabled|broker execution active|legal approval active|FINMA approved|physical universe controlled|Product Truth disabled|uncontrolled infinite loop active|background daemon active/i;

test.describe("Emergency Al-Kawn Desktop Experience Correction", () => {
  test("/desktop/kawn renders a living entry without duplicate key warnings", async ({
    page,
  }) => {
    const consoleMessages: string[] = [];
    page.on("console", (message) => {
      consoleMessages.push(message.text());
    });

    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-living-entry-hero")).toBeVisible();
    await expect(body).toContainText("Welcome to الكون");
    await expect(body).toContainText("الكون حي داخل لابتوب أحمد");
    await expect(body).toContainText("هذا ليس Dashboard؛ هذا بيت الكون الخاص");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Universe Operating Kernel هو القاضي التنفيذي");
    await expect(body).toContainText("داخل أجهزة أحمد الشخصية: الكون يعمل");
    await expect(body).toContainText("أحمد وحده يتحكم بحركة المال الحقيقي");
    await expect(body).toContainText("One next action selected");
    await expect(body).toContainText("The pulse reflects state, not decoration");
    await expect(body).toContainText("Local Day One is ready but not started");

    const consoleOutput = consoleMessages.join("\n");
    expect(consoleOutput).not.toMatch(/Encountered two children with the same key/i);
    expect(consoleOutput).not.toMatch(/Daily Work Loop enhancement/i);
    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe records the emergency desktop correction", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-experiential-desktop-summary")).toBeVisible();
    await expect(body).toContainText("/desktop/kawn هو بيت الكون الحي، وليس لوحة تقنية");
    await expect(body).toContainText("Duplicate key error fixed");
    await expect(body).toContainText("Local Day One remains ready_not_started");
    await expect(body).toContainText("Ahmad review required before Local Day One");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("duplicate-key fix, docs, and report are present", () => {
    const infinityPanel = readFileSync(
      "app/desktop/kawn/_components/AlKawnInfinityPreparationPanel.tsx",
      "utf8",
    );
    const wakePanel = readFileSync(
      "app/desktop/kawn/_components/AlKawnWakeStatePanel.tsx",
      "utf8",
    );
    const heroPanel = readFileSync(
      "app/desktop/kawn/_components/AlKawnLivingEntryHero.tsx",
      "utf8",
    );

    expect(infinityPanel).toContain("infinity-required-");
    expect(wakePanel).toContain("daily-loop-required-");
    expect(heroPanel).toContain("Welcome to الكون");
    expect(heroPanel).toContain("هذا ليس Dashboard؛ هذا بيت الكون الخاص");
    expect(existsSync("docs/product/al-kawn-desktop-experience-correction.md")).toBe(true);
    expect(existsSync("reports/al-kawn-emergency-desktop-experience-correction.md")).toBe(true);
    expect(infinityPanel + wakePanel + heroPanel).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
