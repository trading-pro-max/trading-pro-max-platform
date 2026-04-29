import { expect, test } from "@playwright/test";
import {
  getRealitySourceLabel,
  getRealitySources,
  getRealityTruthWarnings,
} from "../../lib/client/living-universe";

const FORBIDDEN_CLAIMS =
  /global number one already|legal 100% approved|real weather active|exact weather|exact sun position|user location active|FINMA approved|licensed trading platform|regulated broker|Swiss government approved|Swiss certified|NASA|official NASA|NASA partnership|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

test.describe("Literal Realism Standard Closure", () => {
  test("reality sources identify real inputs, simulations, and blocked claims", () => {
    const sources = getRealitySources();
    expect(sources.deviceTime.source).toBe("user_device_clock");
    expect(sources.deviceDate.source).toBe("user_device_date");
    expect(sources.weather.status).toBe("not_connected");
    expect(sources.location.status).toBe("not_requested");
    expect(sources.legal.status).toBe("review_pending");
    expect(getRealitySourceLabel("trading")).toBe("Trading: demo-safe/read-only");
    expect(getRealityTruthWarnings()).toEqual([
      "Weather is not connected.",
      "Legal review is pending.",
    ]);
  });

  test("/founder/universe and /trading expose literal realism labels", async ({ page }) => {
    for (const route of ["/founder/universe", "/trading"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const body = page.locator("body");
      await expect(body).toContainText("Real when sourced. Simulated when labeled.");
      await expect(body).toContainText("Device-time simulation");
      await expect(body).toContainText("device-date simulation");
      await expect(body).toContainText("Weather is not connected");
      await expect(body).toContainText("Legal review");
      await expect(body).toContainText("Trading: demo-safe/read-only");
      await expect(body).toContainText("Real money: disabled");
      await expect(body).toContainText("Broker execution: disabled/not connected");
      await expect(body).toContainText("Product Truth");

      const bodyText = await body.innerText();
      expect(bodyText).not.toMatch(FORBIDDEN_CLAIMS);
    }
  });
});
