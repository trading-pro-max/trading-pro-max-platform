import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Local Day One started|public الكون active|public ALKON active|public launch active|billing active|payments active|receiving money active|withdrawals active|real money enabled|broker execution active|legal approval active|FINMA approved|physical universe controlled|Product Truth disabled|uncontrolled infinite loop active|background daemon active/i;

test.describe("Al-Kawn Human-First Living Entry", () => {
  test("/desktop/kawn speaks to Ahmad before technical status", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-living-entry-hero")).toBeVisible();
    await expect(body).toContainText("أحمد، أنا الكون");
    await expect(body).toContainText("أنا حي داخل لابتوبك");
    await expect(body).toContainText("أعمل داخليًا لأجلك");
    await expect(body).toContainText("أنت وحدك تتحكم بالمال الحقيقي والخروج للعالم");
    await expect(body).toContainText("الخطوة التالية الوحيدة");
    await expect(body).toContainText("حالتي الآن: مستيقظ ومحمي");
    await expect(body).toContainText("أعمل داخل نطاق أحمد الشخصي فقط");
    await expect(body).toContainText("لا يوجد مال حقيقي مفعّل");
    await expect(body).toContainText("لا يوجد خروج للعالم بدون أحمد");
    await expect(body).toContainText("Product Truth هو قانون الحقيقة الأعلى");
    await expect(body).toContainText("Local Day One لم يبدأ بعد");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe records the human-first desktop correction", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-experiential-desktop-summary")).toBeVisible();
    await expect(body).toContainText("/desktop/kawn أصبح يتحدث مع أحمد أولًا، ثم يعرض الحالة التقنية");
    await expect(body).toContainText("الكون يتحدث مع أحمد أولًا");
    await expect(body).toContainText("Local Day One remains ready_not_started");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("human-first source, docs, and report are present", () => {
    const heroSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnLivingEntryHero.tsx",
      "utf8",
    );
    const founderSource = readFileSync(
      "app/founder/universe/_components/UniverseCommandCenter.tsx",
      "utf8",
    );

    expect(heroSource).toContain("أحمد، أنا الكون.");
    expect(heroSource).toContain("أنا حي داخل لابتوبك.");
    expect(heroSource).toContain("أعمل داخليًا لأجلك");
    expect(heroSource).toContain("الخطوة التالية الوحيدة");
    expect(founderSource).toContain("الكون يتحدث مع أحمد أولًا.");
    expect(existsSync("docs/product/al-kawn-human-first-living-entry.md")).toBe(true);
    expect(existsSync("reports/al-kawn-human-first-living-entry-correction.md")).toBe(true);
    expect(heroSource + founderSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
