import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Local Day One started|Pro Max is root|public الكون active|public ALKON active|public launch active|billing active|payments active|receiving money active|withdrawals active|real money enabled|broker execution active|legal approval active|FINMA approved|physical universe controlled|Product Truth disabled|uncontrolled infinite loop active|background daemon active/i;

test.describe("Al-Kawn Deep Experience Cleanup", () => {
  test("/desktop/kawn renders the cleaned living universe experience", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-living-entry-hero")).toBeVisible();
    await expect(body).toContainText("الكون حي داخل لابتوب أحمد");
    await expect(body).toContainText("هذا ليس Dashboard؛ هذا بيت الكون الحي");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("أحمد وحده يتحكم بحركة المال الحقيقي");
    await expect(body).toContainText("Local Day One لم يبدأ بعد");
    await expect(body).toContainText("/desktop/kawn هو بيت الكون الحي");
    await expect(body).toContainText("الكون هو الأصل");
    await expect(body).toContainText("Pro Max Galaxy طبقة مستقبلية داخل الكون");
    await expect(body).toContainText("Queues are secondary to the one next action");

    const text = await body.innerText();
    expect(text).not.toMatch(FORBIDDEN_CLAIMS);
    expect(text).not.toMatch(/Pro Max (?:is|as) (?:the )?root/i);
  });

  test("/founder/universe shows cleanup status and Local Day One gate", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-experiential-desktop-summary")).toBeVisible();
    await expect(body).toContainText("تجربة الكون تحتاج قبول أحمد قبل Start Local Day One");
    await expect(body).toContainText("/desktop/kawn هو بيت الكون الحي، وليس لوحة تقنية");
    await expect(body).toContainText("Local Day One remains ready_not_started");
    await expect(body).toContainText("Pro Max is demoted inside الكون");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("cleanup reports, inventory, docs, and source exist", () => {
    const shellSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnDesktopShell.tsx",
      "utf8",
    );
    const heroSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnLivingEntryHero.tsx",
      "utf8",
    );
    const galaxySource = readFileSync(
      "app/desktop/kawn/_components/AlKawnGalaxyMap.tsx",
      "utf8",
    );

    expect(shellSource).toContain("AlKawnDetailGroup");
    expect(shellSource).toContain("Queues are secondary to the one next action");
    expect(heroSource).toContain("Local Day One لم يبدأ بعد");
    expect(galaxySource).toContain("Pro Max Galaxy طبقة مستقبلية داخل الكون");
    expect(existsSync("docs/product/al-kawn-deep-experience-cleanup.md")).toBe(true);
    expect(existsSync("reports/al-kawn-deep-experience-cleanup-audit.md")).toBe(true);
    expect(existsSync("reports/al-kawn-route-surface-cleanup-inventory.md")).toBe(true);
    expect(existsSync("reports/al-kawn-deep-experience-cleanup.md")).toBe(true);
    expect(shellSource + heroSource + galaxySource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
