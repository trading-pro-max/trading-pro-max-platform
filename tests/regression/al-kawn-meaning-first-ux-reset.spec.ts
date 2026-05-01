import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Local Day One started|public الكون active|public ALKON active|public launch active|billing active|payments active|receiving money active|withdrawals active|real money enabled|broker execution active|legal approval active|FINMA approved|physical universe controlled|Product Truth disabled|uncontrolled infinite loop active|background daemon active/i;

test.describe("Al-Kawn Meaning-First UX Reset", () => {
  test("/desktop/kawn explains what الكون is before technical panels", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    const hero = page.getByTestId("al-kawn-living-entry-hero");

    await expect(hero).toBeVisible();
    await expect(body).toContainText("أحمد، هذا هو الكون");
    await expect(body).toContainText("الكون هو عالمك الإلكتروني الخاص داخل لابتوبك");
    await expect(body).toContainText("ماذا يستطيع الكون أن يفعل الآن؟");
    await expect(body).toContainText("اكتب ما تريد من الكون الآن");
    await expect(body).toContainText("اشرح لي ما أراه");
    await expect(body).toContainText("المال الحقيقي بيد أحمد فقط");
    await expect(body).toContainText("الخروج للعالم بقرار أحمد فقط");
    await expect(body).toContainText("الأسرار لا تخرج من أجهزة أحمد");
    await expect(body).toContainText("الخطوة التالية الوحيدة");
    await expect(body).toContainText(
      "Product Truth: لا إطلاق عام، لا مال حقيقي، لا بروكر، لا ادعاءات قانونية، لا خروج للأسرار",
    );
    await expect(body).toContainText("Local Day One لم يبدأ بعد");

    const heroText = await hero.innerText();
    expect(heroText).not.toMatch(/Pro Max|Trading|review queue|technical task/i);
    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe records the meaning-first reset", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-experiential-desktop-summary")).toBeVisible();
    await expect(body).toContainText("/desktop/kawn يشرح معنى الكون أولًا، ثم يعرض التفاصيل التقنية");
    await expect(body).toContainText("First screen is for الكون only");
    await expect(body).toContainText("Local Day One remains ready_not_started");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("meaning-first component, docs, and report are present", () => {
    const shellSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnDesktopShell.tsx",
      "utf8",
    );
    const heroSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnLivingEntryHero.tsx",
      "utf8",
    );
    const commandSource = readFileSync(
      "app/desktop/kawn/_components/AlKawnMeaningFirstCommandCenter.tsx",
      "utf8",
    );

    expect(shellSource).toContain("مراجعات مؤجلة");
    expect(heroSource).toContain("أحمد، هذا هو الكون.");
    expect(commandSource).toContain("اشرح لي ما أراه");
    expect(existsSync("docs/product/al-kawn-meaning-first-ux-reset.md")).toBe(true);
    expect(existsSync("reports/al-kawn-meaning-first-ux-reset.md")).toBe(true);
    expect(shellSource + heroSource + commandSource).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
