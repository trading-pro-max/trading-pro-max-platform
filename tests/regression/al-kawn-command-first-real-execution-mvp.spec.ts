import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /Local Day One started|public الكون active|public ALKON active|public launch active|billing active|payments active|receiving money active|withdrawals active|bank transfer active|real money enabled|broker execution active|legal approval active|FINMA approved|external accounts connected|secrets stored in Git|secrets stored in desktop bundle|Product Truth disabled|physical universe controlled|uncontrolled infinite loop active|background daemon active/i;

const QUICK_COMMANDS = [
  "ماذا تستطيع أن تفعل؟",
  "اشرح لي ما أراه",
  "افحص الكون",
  "رتب يومي",
  "نفذ دورة داخلية آمنة",
  "اعرض الخطوة التالية",
  "اعرض Product Truth",
  "اعرض حالة Local Day One",
];

test.describe("Al-Kawn Command-First Real Execution MVP", () => {
  test("/desktop/kawn renders live command execution flow", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    const commandMvp = page.getByTestId("al-kawn-command-execution-mvp");

    await expect(commandMvp).toBeVisible();
    await expect(body).toContainText("اكتب أمرك للكون الآن");
    await expect(body).toContainText("الكون فهم الطلب");
    await expect(body).toContainText("حكم التنفيذ");
    await expect(body).toContainText("تنفيذ داخلي مباشر");
    await expect(body).toContainText("يتطلب قرار أحمد");
    await expect(body).toContainText("محجوب بسبب Product Truth");
    await expect(body).toContainText("الدليل");
    await expect(body).toContainText("التقرير");
    await expect(body).toContainText("الخطوة التالية الوحيدة");
    await expect(body).toContainText("Product Truth يحكم كل تنفيذ");
    await expect(body).toContainText("المال الحقيقي بيد أحمد فقط");
    await expect(body).toContainText("Local Day One لم يبدأ بعد");

    for (const quickCommand of QUICK_COMMANDS) {
      await expect(body).toContainText(quickCommand);
    }

    await page.getByRole("button", { name: "اعرض Product Truth" }).click();
    await expect(body).toContainText("لا إطلاق عام");
    await expect(body).toContainText("لا مال حقيقي");
    await expect(body).toContainText("لا بروكر");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders compact command-first execution summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-command-first-execution-summary")).toBeVisible();
    await expect(body).toContainText("/desktop/kawn أصبح يدعم أوامر داخلية آمنة للكون");
    await expect(body).toContainText("Supported commands: 8");
    await expect(body).toContainText("Product Truth يحكم كل تنفيذ");
    await expect(body).toContainText("Local Day One لم يبدأ بعد");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("command execution model, docs, and reports are present", () => {
    const source = readFileSync(
      "lib/server/universe/command-execution/index.ts",
      "utf8",
    );
    const classifier = readFileSync(
      "lib/server/universe/command-execution/command-classifier.ts",
      "utf8",
    );
    const uiSource = readFileSync(
      "app/desktop/kawn/_components/command-execution/AlKawnCommandExecutionMVP.tsx",
      "utf8",
    );

    expect(source).toContain("getAlKawnCommandExecutionState");
    expect(source).toContain("getCommandIntentExamples");
    expect(source).toContain("classifyAlKawnCommand");
    expect(source).toContain("getCommandExecutionVerdict");
    expect(source).toContain("executeSafeInternalCommand");
    expect(source).toContain("getCommandEvidence");
    expect(source).toContain("getCommandExecutionReport");
    expect(source).toContain("getCommandExecutionNextAction");
    expect(classifier).toContain("requires_ahmad_money_decision");
    expect(classifier).toContain("requires_ahmad_external_decision");
    expect(classifier).toContain("requires_ahmad_legal_decision");
    expect(classifier).toContain("blocked_product_truth");
    expect(classifier).toContain("blocked_secret_exposure");
    expect(uiSource).toContain("AlKawnCommandExecutionMVP");
    expect(existsSync("docs/product/al-kawn-command-first-real-execution-mvp.md")).toBe(true);
    expect(existsSync("reports/al-kawn-command-first-real-execution-mvp.md")).toBe(true);
    expect(existsSync("reports/command-execution/al-kawn-command-execution-latest.md")).toBe(true);
  });
});
