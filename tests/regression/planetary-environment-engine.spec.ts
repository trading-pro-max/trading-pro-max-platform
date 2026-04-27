import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  ENVIRONMENT_PREVIEW_TIMESTAMP_STORAGE_KEY,
  ENVIRONMENT_WEATHER_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";
import {
  getPlanetaryEnvironmentSnapshot,
  getWeatherProviderReadiness,
  resolveMarketSession,
  resolveRealmAtmosphere,
  resolveSolarPhaseFromMinutes,
  resolveSurfaceIntensity,
  resolveSystemWeather,
} from "../../lib/server/environment";

const ARTIFACT_DIR = path.join("test-results", "planetary-environment-engine");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Solar Command|Moon Command|Orbit Command|\bministries\b|\bcouncils\b|\bgovernance\b|construction queue|Codex tasks|secrets authority|treasury controls|internal memory/i;

async function openWithEnvironment(
  page: Page,
  pathName: string,
  options: {
    environmentMode?: string;
    themeMode?: "dark" | "light" | "system";
    timestamp?: string;
    weather?: string;
  } = {}
) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ themeKey, envKey, timestampKey, weatherKey, themeMode, environmentMode, timestamp, weather }) => {
      window.localStorage.setItem(themeKey, themeMode);
      window.localStorage.setItem(envKey, environmentMode);
      if (timestamp) window.localStorage.setItem(timestampKey, timestamp);
      if (weather) window.localStorage.setItem(weatherKey, weather);
    },
    {
      themeKey: THEME_STORAGE_KEY,
      envKey: ENVIRONMENT_MODE_STORAGE_KEY,
      timestampKey: ENVIRONMENT_PREVIEW_TIMESTAMP_STORAGE_KEY,
      weatherKey: ENVIRONMENT_WEATHER_STORAGE_KEY,
      themeMode: options.themeMode ?? "dark",
      environmentMode: options.environmentMode ?? "adaptive",
      timestamp: options.timestamp,
      weather: options.weather,
    }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-tpm-environment-mode",
    options.environmentMode ?? "adaptive"
  );
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  await expect(page.locator(selector).first()).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const target = page.locator(selector).first();

    try {
      await target.scrollIntoViewIfNeeded({ timeout: 5000 });
      await expect(target).toBeVisible();
      await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(250);
    }
  }
}

async function expectPublicSafe(page: Page) {
  await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

test.describe("TPM Planetary Environment Engine", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("resolves deterministic environment layers without external calls", () => {
    expect(resolveSolarPhaseFromMinutes(4 * 60 + 45)).toBe("dawn");
    expect(resolveSolarPhaseFromMinutes(6 * 60 + 15)).toBe("sunrise");
    expect(resolveSolarPhaseFromMinutes(9 * 60)).toBe("morning");
    expect(resolveSolarPhaseFromMinutes(12 * 60)).toBe("day");
    expect(resolveSolarPhaseFromMinutes(17 * 60)).toBe("golden_hour");
    expect(resolveSolarPhaseFromMinutes(19 * 60)).toBe("sunset");
    expect(resolveSolarPhaseFromMinutes(21 * 60)).toBe("night");
    expect(resolveSolarPhaseFromMinutes(1 * 60)).toBe("deep_night");

    const day = getPlanetaryEnvironmentSnapshot({
      timestamp: "2026-04-24T12:00:00Z",
      timezone: "UTC",
      mode: "adaptive",
      weatherPreference: "clear",
      planRealm: "free_earth",
      surface: "public_entry",
    });
    expect(day).toMatchObject({
      solarPhase: "day",
      weatherState: "clear",
      marketSession: "europe",
      planRealm: "free_earth",
      surfaceIntensity: "expressive",
      motionAllowed: true,
    });
    expect(day.truth).toMatchObject({
      gpsUsed: false,
      preciseLocationTracking: false,
      externalWeatherCalls: false,
      externalMapAssets: false,
      weatherTradingAdvice: false,
      liveExecution: "blocked",
      realMoney: "blocked",
      brokerFeedBillingLaunch: "inactive",
      rasterAssets: false,
    });

    expect(getWeatherProviderReadiness()).toMatchObject({
      liveProviderConfigured: false,
      externalWeatherCalls: false,
      gpsUsed: false,
      tradingAdviceAllowed: false,
    });
    expect(resolveMarketSession({ timestamp: "2026-04-24T15:00:00Z" })).toBe("us");
    expect(resolveMarketSession({ timestamp: "2026-04-26T15:00:00Z" })).toBe("weekend");
    expect(resolveSystemWeather("fallback")).toBe("fallback_fog");
    expect(resolveSystemWeather("blocked")).toBe("blocked_red_signal");
    expect(resolveRealmAtmosphere("free_earth").cssClassName).not.toBe(
      resolveRealmAtmosphere("vip_lunar").cssClassName
    );
    expect(resolveSurfaceIntensity("workspace")).toBe("subtle");
    expect(resolveSurfaceIntensity("chart")).toBe("none");
  });

  test("exposes read-only APIs with public-safe truth", async ({ request }) => {
    const preview = await request.get(
      "/api/environment/preview?timestamp=2026-04-24T17:10:00Z&timezone=UTC&mode=solar_only&weather=rain&surface=workspace&planRealm=vip_lunar"
    );
    expect(preview.ok()).toBe(true);
    const previewPayload = await preview.json();
    expect(previewPayload.snapshot).toMatchObject({
      mode: "solar_only",
      solarPhase: "golden_hour",
      weatherState: "rain",
      surfaceIntensity: "subtle",
      planRealm: "vip_lunar",
    });
    expect(previewPayload.snapshot.truth.externalWeatherCalls).toBe(false);
    expect(previewPayload.snapshot.truth.weatherTradingAdvice).toBe(false);

    const privacy = await request.get("/api/environment/privacy");
    expect(privacy.ok()).toBe(true);
    expect(privacy.headers()["cache-control"]).toContain("no-store");
    const privacyPayload = await privacy.json();
    expect(privacyPayload.policy).toMatchObject({
      gpsUsed: false,
      preciseLocationTracking: false,
      hiddenTracking: false,
      externalWeatherCalls: false,
      weatherTradingAdvice: false,
    });

    const founder = await request.get("/api/founder/environment/readiness");
    expect(founder.ok()).toBe(true);
    const founderPayload = await founder.json();
    expect(founderPayload.snapshot.publicExposure.privateTermsPublic).toBe(false);
    expect(founderPayload.snapshot.privacy.externalWeatherCalls).toBe(false);
  });

  test("renders public entry atmosphere variants and keeps private terms hidden", async ({
    page,
  }) => {
    await openWithEnvironment(page, "/", {
      timestamp: "2026-04-24T12:00:00",
      weather: "clear",
    });
    await expect(page.locator("html")).toHaveAttribute("data-tpm-solar-phase", "day");
    await expect(
      page.locator(".tpm-living-earth-background[data-earth-surface='public_entry']")
    ).toHaveAttribute("data-environment-engine", "adaptive_atmosphere");
    await expect(page.locator("body")).toContainText(/Earth reference|Human scale/);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-product-hero", "public-entry-adaptive-day.png");

    await openWithEnvironment(page, "/", {
      timestamp: "2026-04-24T22:00:00",
      weather: "cloudy",
    });
    await expect(page.locator("html")).toHaveAttribute("data-tpm-solar-phase", "night");
    await screenshotLocator(page, ".tpm-product-hero", "public-entry-adaptive-night.png");

    await openWithEnvironment(page, "/", {
      timestamp: "2026-04-24T17:15:00",
      weather: "wind",
      environmentMode: "solar_only",
    });
    await expect(page.locator("html")).toHaveAttribute(
      "data-tpm-solar-phase",
      "golden_hour"
    );
    await screenshotLocator(page, ".tpm-product-hero", "public-entry-golden-hour.png");
  });

  test("keeps workspace chart-safe and exposes settings/diagnostics controls", async ({
    page,
  }) => {
    await openWithEnvironment(page, "/en", {
      timestamp: "2026-04-24T21:10:00",
      weather: "storm",
    });
    await expect(page.locator(".tpm-workspace-shell")).toHaveCount(1);
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expect(page.locator(".tpm-workspace-shell .tpm-living-earth-background")).toHaveCount(1);
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpmv2-primary", "workspace-chart-safe-environment.png");

    await openWithEnvironment(page, "/en/settings", {
      timestamp: "2026-04-24T12:30:00",
      environmentMode: "weather_only",
      weather: "rain",
    });
    await expect(page.locator("body")).toContainText(
      /Environment \/ Atmosphere|Adaptive Atmosphere|No precise location tracking/
    );
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-settings", "settings-environment-controls.png");

    await openWithEnvironment(page, "/en/diagnostics", {
      timestamp: "2026-04-24T12:30:00",
      weather: "fog",
    });
    await expect(page.locator("body")).toContainText(
      /Adaptive Atmosphere readiness|Environment mode|Solar phase|Weather state source|Market session awareness|System weather/
    );
    await expectPublicSafe(page);
    await screenshotLocator(page, ".tpm-utility-page-diagnostics", "diagnostics-environment-readiness.png");
  });

  test("shows realm/static/high-contrast differences without raster assets", async ({
    page,
  }) => {
    await openWithEnvironment(page, "/", {
      timestamp: "2026-04-24T12:00:00",
      environmentMode: "adaptive",
    });
    await screenshotLocator(page, '[data-plan-realm="free_earth"]', "free-earth-atmosphere.png");
    await screenshotLocator(page, '[data-plan-realm="vip_lunar"]', "vip-lunar-atmosphere.png");

    await openWithEnvironment(page, "/", {
      timestamp: "2026-04-24T12:00:00",
      environmentMode: "static",
    });
    await expect(page.locator("html")).toHaveAttribute("data-tpm-motion-allowed", "false");
    await screenshotLocator(page, ".tpm-product-hero", "reduced-motion-static.png");

    await openWithEnvironment(page, "/", {
      timestamp: "2026-04-24T12:00:00",
      environmentMode: "high_contrast",
    });
    await screenshotLocator(page, ".tpm-product-hero", "high-contrast-readable.png");
  });

  test("keeps implementation code-only with no raster asset references", () => {
    const sourceFiles = [
      "lib/server/environment/engine.ts",
      "lib/server/environment/weather.ts",
      "modules/shell/components/PlanetaryEnvironmentProvider.tsx",
      "modules/shell/components/EnvironmentModeControl.tsx",
      "modules/shell/components/EnvironmentStatusBadge.tsx",
      "modules/brand/components/LivingEarthBackground.tsx",
      "app/theme-localization.css",
    ];

    for (const sourceFile of sourceFiles) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), "utf8");
      expect(source, sourceFile).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    }
  });
});
