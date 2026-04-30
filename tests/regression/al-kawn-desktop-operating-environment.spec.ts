import { expect, test } from "@playwright/test";
import { seedUnlockedAlKawnLocalAuth } from "./helpers/al-kawn-local-auth";

const FORBIDDEN_CLAIMS =
  /public desktop distribution active|billing active|payments active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|secrets stored in app bundle|secrets stored in Git|external accounts connected without approval|Universe public active|الكون public active|ALKON public active|guaranteed profit|risk free|absolute 100% security guaranteed/i;

test.describe("Al-Kawn Desktop Operating Environment", () => {
  test("/desktop/kawn renders the private desktop command client", async ({ page }) => {
    await seedUnlockedAlKawnLocalAuth(page);
    await page.goto("/desktop/kawn", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-operating-environment")).toBeVisible();
    await expect(body).toContainText("الكون هو نسخة أحمد الإلكترونية الخاصة");
    await expect(body).toContainText("Al-Kawn Desktop is Ahmad's private operating environment");
    await expect(body).toContainText("Desktop is the main private command client for الكون");
    await expect(body).toContainText("Boot sequence");
    await expect(body).toContainText("Booting الكون private operating environment");
    await expect(body).toContainText("Product Truth loaded");
    await expect(body).toContainText("Kernel status checked");
    await expect(body).toContainText("Protection Core checked");
    await expect(body).toContainText("Universe One reality synced");
    await expect(body).toContainText("Private until legally ready");
    await expect(body).toContainText("Human chat command area");
    await expect(body).toContainText("Quick actions");
    await expect(body).toContainText("Decision center");
    await expect(body).toContainText("Task center");
    await expect(body).toContainText("Appointment placeholder");
    await expect(body).toContainText("Report center");
    await expect(body).toContainText("Bottom Reality Dock");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("عند القانون: يتوقف لأحمد");
    await expect(body).toContainText("عند المال: يتوقف لأحمد");
    await expect(body).toContainText("Public launch blocked.");
    await expect(body).toContainText("Weather is not connected.");
    await expect(body).toContainText("Location is not requested.");
    await expect(body).toContainText("No secrets inside desktop app bundle.");
    await expect(body).toContainText("Desktop shell finalization");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/founder/universe shows the desktop operating environment card", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");

    await expect(page.getByTestId("al-kawn-desktop-card")).toBeVisible();
    await expect(body).toContainText("Al-Kawn Desktop Operating Environment");
    await expect(body).toContainText("Desktop is the main private command client for الكون");
    await expect(body).toContainText("Mobile clients come later as lightweight private access");
    await expect(body).toContainText("Public distribution is blocked");
    await expect(body).toContainText("Product Truth enforced");
    await expect(body).toContainText("/desktop/kawn");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
