import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public الكون active|public ALKON active|public users active|customer access active|public launch active|app store release active|billing active|payments active|receiving money active|withdrawals active|bank transfer active|real money enabled|broker execution active|legal approval active|FINMA approved|ALKON is root|Pro Max owns الكون|Pro Max is root|Trading is root|active repo moved|files deleted|sensitive files touched|secrets stored in Git|Product Truth disabled|physical universe controlled|Local Day One started/i;

const REQUIRED_WORDING = [
  "الكون يبقى داخل أجهزة أحمد الشخصية فقط",
  "الاستخدام شخصي لأحمد فقط",
  "الكون لا يبدأ من مجلد؛ الكون يبدأ من جهاز أحمد الشخصي",
  "لابتوب أحمد هو نطاق الكون المحلي",
  "AL-KAWN هو مركز قيادة داخل نطاق الجهاز",
  "كل مشروع داخل الكون له مجلد كامل مستقل",
  "كل المشاريع تعمل معًا عبر Al-Kawn Core",
  "لا نقل للريبو النشط قبل تقرير migration",
  "لا حذف قبل الجرد والتصنيف",
];

test.describe("Al-Kawn Project Root Order Foundation", () => {
  test("/desktop/kawn renders compact root-order foundation", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-project-root-order")).toBeVisible();
    for (const phrase of REQUIRED_WORDING) {
      await expect(body).toContainText(phrase);
    }
    await expect(body).toContainText("الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات");
    await expect(body).toContainText("Product Truth يحكم كل شيء");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe renders Project Root Order section", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-project-root-order-section")).toBeVisible();
    for (const phrase of REQUIRED_WORDING) {
      await expect(body).toContainText(phrase);
    }
    await expect(body).toContainText("الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات");
    await expect(body).toContainText("Product Truth يحكم كل شيء");
    await expect(body).toContainText("Product Truth");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/trading remains available as a protected layer", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(body).toContainText("Product Truth");
    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("root-order models, docs, reports, and safe workspace script exist", () => {
    const deviceFabric = readFileSync(
      "lib/server/universe/device-fabric/index.ts",
      "utf8",
    );
    const modularWorlds = readFileSync(
      "lib/server/universe/modular-worlds/index.ts",
      "utf8",
    );
    const script = readFileSync(
      "scripts/setup-al-kawn-professional-workspace.ps1",
      "utf8",
    );

    expect(deviceFabric).toContain("getAlKawnDeviceUniverseFabric");
    expect(deviceFabric).toContain("getAhmadPersonalDeviceDomain");
    expect(deviceFabric).toContain("getAlKawnCommandWorkspaceDomain");
    expect(deviceFabric).toContain("getActiveRepoDomain");
    expect(deviceFabric).toContain("getDeviceIntakeGate");
    expect(deviceFabric).toContain("getDeviceClassificationGate");
    expect(deviceFabric).toContain("getDeviceProtectionGate");
    expect(deviceFabric).toContain("getDeviceFabricNextAction");
    expect(modularWorlds).toContain("getAlKawnModularWorlds");
    expect(modularWorlds).toContain("getWorldRegistry");
    expect(modularWorlds).toContain("getWorldById");
    expect(modularWorlds).toContain("getWorldContracts");
    expect(modularWorlds).toContain("getWorldBoundaries");
    expect(modularWorlds).toContain("getWorldIntegrationMap");
    expect(modularWorlds).toContain("getWorldNextAction");
    expect(script).toContain("Al-Kawn professional workspace setup preview");
    expect(script).not.toMatch(/Move-Item|Remove-Item|Copy-Item|robocopy|xcopy|Get-ChildItem/i);

    expect(existsSync("docs/product/al-kawn-personal-only-operating-scope.md")).toBe(true);
    expect(existsSync("docs/product/al-kawn-personal-device-universe-fabric.md")).toBe(true);
    expect(existsSync("docs/product/al-kawn-professional-workspace-architecture.md")).toBe(true);
    expect(existsSync("docs/product/al-kawn-modular-worlds-architecture.md")).toBe(true);
    expect(existsSync("reports/al-kawn-personal-only-project-reorganization.md")).toBe(true);
    expect(existsSync("reports/al-kawn-personal-device-universe-fabric.md")).toBe(true);
    expect(existsSync("reports/al-kawn-professional-workspace-architecture.md")).toBe(true);
    expect(existsSync("reports/al-kawn-active-repo-migration-readiness.md")).toBe(true);
    expect(existsSync("reports/al-kawn-modular-worlds-architecture.md")).toBe(true);
    expect(existsSync("reports/al-kawn-modular-worlds-current-mapping.md")).toBe(true);
    expect(existsSync("reports/al-kawn-project-root-order-audit.md")).toBe(true);
  });
});
