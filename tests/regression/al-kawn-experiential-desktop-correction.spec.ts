import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public الكون active|public ALKON active|public launch active|billing active|payments active|receiving money active|withdrawals active|bank transfer active|real money enabled|broker execution active|legal approval active|FINMA approved|physical universe controlled|Product Truth disabled|Local Day One started without Ahmad|uncontrolled infinite loop active|background daemon active/i;

test.describe("Al-Kawn Experiential Desktop Correction", () => {
  test("/desktop/kawn renders the living universe entry", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-living-entry-hero")).toBeVisible();
    await expect(page.getByTestId("al-kawn-living-universe-experience")).toBeVisible();
    await expect(body).toContainText("Welcome to الكون");
    await expect(body).toContainText("الكون حي داخل لابتوب أحمد");
    await expect(body).toContainText("هذا ليس Dashboard؛ هذا بيت الكون الخاص");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Universe Operating Kernel هو القاضي التنفيذي");
    await expect(body).toContainText("داخل أجهزة أحمد الشخصية: الكون يعمل");
    await expect(body).toContainText("أحمد وحده يتحكم بحركة المال الحقيقي");
    await expect(body).toContainText("One next action selected");
    await expect(body).toContainText("The pulse reflects state, not decoration");
    await expect(body).toContainText("Swiss-inspired precision, not official Swiss endorsement");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders the experiential desktop summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-experiential-desktop-summary")).toBeVisible();
    await expect(body).toContainText(
      "/desktop/kawn now opens as a living universe experience, not a technical dashboard",
    );
    await expect(body).toContainText("/desktop/kawn هو بيت الكون الحي");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("experiential correction docs and source exist", () => {
    const desktopSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnLivingEntryHero.tsx",
      "utf8",
    );
    const experienceSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnLivingUniverseExperiencePanel.tsx",
      "utf8",
    );

    expect(desktopSource).toContain("Welcome to الكون.");
    expect(desktopSource).toContain("هذا ليس Dashboard؛ هذا بيت الكون الخاص.");
    expect(experienceSource).toContain("The pulse reflects state, not decoration.");
    expect(existsSync("docs/product/al-kawn-experiential-desktop-correction.md")).toBe(true);
    expect(existsSync("reports/al-kawn-experiential-desktop-correction.md")).toBe(true);
    expect(desktopSource + experienceSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
