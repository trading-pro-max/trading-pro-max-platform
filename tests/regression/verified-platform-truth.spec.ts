import { expect, test } from "@playwright/test";

const STORAGE_KEY = "tpm-platform-state-v1";
const DEMO_EMAIL = process.env.TPM_DEMO_EMAIL ?? "demo@tradingpromax.local";
const DEMO_PASSWORD =
  process.env.TPM_DEMO_PASSWORD ?? "TradingProMaxDemo!2026";

test.describe("verified platform truth", () => {
  test("visibly renders the verified workstation and utility routes", async ({
    page,
  }) => {
    const routes = [
      {
        path: "/",
        expectedUrl: /\/$/,
        text: /Public Commercial Entry|Platform truth|First-use path|Route flow/,
      },
      {
        path: "/en",
        expectedUrl: /\/en$/,
        text: /Trading Pro Max|Execution Panel|Decision/,
      },
      {
        path: "/en/settings",
        expectedUrl: /\/en\/settings$/,
        text: /Settings|Mode and persistence|Paper ticket defaults|Account and commercial readiness/,
      },
      {
        path: "/diagnostics",
        expectedUrl: /\/diagnostics$/,
        text:
          /Diagnostics|System readiness|Connector safety state|Commercial trust and public product state/,
      },
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page).toHaveURL(route.expectedUrl);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(page.locator("body")).toContainText(route.text);

      if (route.path === "/") {
        await expect(page.locator(".tpm-product-entry").first()).toBeVisible();
        await expect(page.locator(".tpm-product-hero").first()).toBeVisible();
        await expect(page.locator(".tpm-product-workstation-shell").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /Paper-only evaluation|Fallback-first market data|Live execution blocked/
        );
        await expect(page.locator("body")).toContainText(
          /TPM IQ \/ Brain|Interpretive, bounded guidance|Chart \+ execution stay primary/
        );
        await expect(page.locator("body")).toContainText(
          /Broker unconfigured|no fake activation|not a live brokerage terminal/
        );
      }

      if (route.path === "/" || route.path === "/en") {
        await expect(page.locator(".tpmv2-command-center").first()).toBeVisible();
        await expect(page.locator(".tpmv2-brain-deck").first()).toBeVisible();
        await expect(page.locator(".tpmv2-workspace-depth-bar").first()).toBeVisible();
        await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
        await expect(page.locator(".tpmv2-chart-depth-panel").first()).toBeVisible();
        await expect(page.locator(".tpmv2-execution").first()).toBeVisible();
        await expect(page.locator(".tpmv2-ticket-preflight").first()).toBeVisible();
        await expect(page.locator(".tpmv2-ticket-activity").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /TPM IQ \/ Brain|Market context|Operator guidance|Truth layer/
        );
        await expect(page.locator("body")).toContainText(
          /Workspace depth|Shortcut layer|Layout-only|Recent desk activity|Market depth/
        );
        await expect(page.locator("body")).toContainText(
          /Paper access|Fallback-bound|Interpretive only|Live blocked/
        );
        await expect(page.locator("body")).toContainText("Fallback-bound");
        await expect(page.locator("body")).toContainText("Interpretive only");
        await expect(page.locator("body")).toContainText("Live blocked");

        const chartBox = await page
          .locator(".tpmv2-chart-surface")
          .first()
          .boundingBox();
        const executionBox = await page
          .locator(".tpmv2-execution")
          .first()
          .boundingBox();

        expect(chartBox?.width ?? 0).toBeGreaterThan(620);
        expect(chartBox?.height ?? 0).toBeGreaterThan(420);
        expect(executionBox?.width ?? 0).toBeGreaterThan(240);
      }

      if (route.path === "/en/settings" || route.path === "/diagnostics") {
        await expect(page.locator(".tpm-utility-page").first()).toBeVisible();
        await expect(page.locator(".tpm-foundation-card").first()).toBeVisible();
        await expect(page.locator("body")).toContainText(
          /Workspace depth and interaction layer|Workstation depth and shortcut truth/
        );
        await expect(page.locator("body")).toContainText(
          /Commercial trust and public product state|Account and commercial readiness|First-use platform guidance/
        );
        await expect(page.locator("body")).toContainText(
          /Product trust ledger|Commercial packaging readiness|No billing system active|Broker integration/
        );
      }
    }
  });

  test("keeps unauthenticated preferences on local fallback storage", async ({
    page,
    request,
  }) => {
    const unauthenticatedPreferences = await request.get(
      "/api/account/preferences"
    );
    expect(unauthenticatedPreferences.status()).toBe(401);

    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();
    await page.waitForFunction(
      (key) => Boolean(window.localStorage.getItem(key)),
      STORAGE_KEY
    );

    const storedState = await page.evaluate((key) => {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }, STORAGE_KEY);

    expect(storedState?.accountMode).toBe("demo");
    expect(storedState?.workspacePreferences?.ticketVisible).toBe(true);
    expect(storedState?.workspacePreferences?.chartType).toBe("candlestick");
  });

  test("persists authenticated workspace preferences through the backend", async ({
    request,
  }) => {
    const login = await request.post("/api/auth/login", {
      data: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });
    expect(login.status()).toBe(200);

    const preferences = {
      chartType: "bars",
      activeIndicators: ["EMA 20", "RSI", "VOL"],
      activeDrawingTool: "Level",
      chartZoom: 120,
      watchlistVisible: true,
      ticketVisible: true,
      blotterExpanded: true,
      timeframe: "5m",
      duration: "30s",
      selectedAssetSymbol: "BTC/USD",
    };

    const update = await request.post("/api/account/preferences", {
      data: { preferences },
    });
    expect(update.status()).toBe(200);
    const updatePayload = await update.json();
    expect(updatePayload.authenticated).toBe(true);
    expect(updatePayload.preferences).toMatchObject(preferences);

    const readBack = await request.get("/api/account/preferences");
    expect(readBack.status()).toBe(200);
    const readBackPayload = await readBack.json();
    expect(readBackPayload.preferences).toMatchObject(preferences);
  });

  test("keeps market feed fallback-first, normalized, and honestly labeled", async ({
    request,
  }) => {
    const valid = await request.get("/api/market?symbol=EUR/USD&timeframe=1m");
    expect(valid.status()).toBe(200);
    const validPayload = await valid.json();

    expect(validPayload.snapshot.feed).toMatchObject({
      adapter: "fallback_simulated",
      state: "fallback_ready",
      sourceLabel: "Fallback market adapter",
      externalFeedActive: false,
    });
    expect(typeof validPayload.snapshot.feed.readinessScore).toBe("number");
    expect(validPayload.snapshot.feed.readinessScore).toBeGreaterThanOrEqual(0);
    expect(validPayload.snapshot.feed.freshness).toMatchObject({
      chart: expect.stringMatching(/Fresh|Warm|Session Closed|Delayed|Stale|Pending/),
      health: expect.stringMatching(/Healthy|Stable|Delayed|Degraded|Session Closed/),
    });
    expect(validPayload.snapshot.assets[0].freshness).toMatch(
      /Fresh|Warm|Session Closed|Delayed|Stale|Pending/
    );
    expect(validPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "EUR/USD",
      normalizedTimeframe: "1m",
      symbolFallbackApplied: false,
      timeframeFallbackApplied: false,
    });

    const invalid = await request.get(
      "/api/market?symbol=not-a-market&timeframe=2h"
    );
    expect(invalid.status()).toBe(200);
    const invalidPayload = await invalid.json();
    const noticeCodes = invalidPayload.snapshot.feed.notices.map(
      (notice: { code: string }) => notice.code
    );

    expect(invalidPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "EUR/USD",
      normalizedTimeframe: "1m",
      symbolFallbackApplied: true,
      timeframeFallbackApplied: true,
    });
    expect(noticeCodes).toEqual(
      expect.arrayContaining([
        "fallback_adapter_active",
        "symbol_fallback_applied",
        "timeframe_fallback_applied",
      ])
    );

    const compact = await request.get("/api/market?symbol=btcusd&timeframe=5M");
    expect(compact.status()).toBe(200);
    const compactPayload = await compact.json();
    expect(compactPayload.snapshot.request).toMatchObject({
      normalizedSymbol: "BTC/USD",
      normalizedTimeframe: "5m",
    });
  });

  test("shows truthful degraded intelligence when the market route falls back locally", async ({
    page,
  }) => {
    await page.route("**/api/market**", async (route) => {
      await route.abort();
    });

    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator(".tpmv2-brain-deck").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Degraded");
    await expect(page.locator("body")).toContainText(
      "Context engine operating in degraded mode"
    );
    await expect(page.locator("body")).toContainText(
      "fallback-safe structure cues"
    );
    await expect(page.locator("body")).toContainText("Interpretive only");
    await expect(page.locator("body")).toContainText("Live blocked");
  });

  test("reports diagnostics, readiness, auth-required routes, and connector truth", async ({
    request,
  }) => {
    const health = await request.get("/api/health");
    expect(health.status()).toBe(200);
    const healthPayload = await health.json();
    expect(healthPayload).toMatchObject({
      ok: true,
      status: "ready",
      paperSafe: true,
      liveExecution: "blocked",
    });
    expect(healthPayload.policyTruth).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      marketData: "fallback_first",
      brokerRouting: "blocked",
      externalFeed: "fallback_active",
    });
    expect(healthPayload.launchReadinessGate).toMatchObject({
      mode: "verification_gate",
      status: expect.stringMatching(/pass|fail/),
      score: expect.any(Number),
      failedChecklist: expect.any(Number),
      warnedDomains: expect.any(Number),
    });
    expect(healthPayload.marketParity).toMatchObject({
      mode: "final_market_parity_closure",
      status: expect.stringMatching(/closed|partially_closed/),
      score: expect.any(Number),
      guardedCapabilities: expect.any(Number),
      launchReadiness: expect.stringMatching(/pass|fail/),
    });
    expect(healthPayload.launchOperations).toMatchObject({
      mode: expect.stringMatching(
        /closed_beta_preparation|soft_launch_preparation|public_launch_preparation|closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
      ),
      status: expect.stringMatching(/in_progress|blocked/),
      supportRoute: "/api/launch/feedback",
      feedbackLoop: expect.stringMatching(
        /operational_guarded|triage_backlog_guarded/
      ),
      pendingTriage: expect.any(Number),
      highSeverityOpen: expect.any(Number),
      hardeningFollowUps: expect.any(Number),
      recoveryLinked: expect.any(Number),
      supportReadiness: expect.stringMatching(/operator_ready|operator_guarded/),
      rollbackReadiness: expect.stringMatching(/recoverable_guarded|guarded/),
      escalationState: expect.stringMatching(/normal|elevated/),
      productionHardening: expect.stringMatching(/ready|guarded/),
      softLaunch: expect.stringMatching(/ready|guarded/),
      publicLaunch: expect.stringMatching(/ready|guarded/),
    });
    expect(healthPayload.truthSemantics).toMatchObject({
      blocked: expect.arrayContaining([
        "live_execution",
        "real_money_routing",
        "auto_trading",
      ]),
      fallback: expect.arrayContaining(["market_data_fallback_first"]),
      unconfigured: expect.arrayContaining([
        "notification_delivery_unconfigured",
        "billing_checkout_inactive",
      ]),
    });
    expect(Array.isArray(healthPayload.truthSemantics.degraded)).toBe(true);
    expect(healthPayload.architecture.marketFeed.policyMode).toBe("fallback_first");
    expect(typeof healthPayload.architecture.marketFeed.readinessScore).toBe("number");
    expect(typeof healthPayload.architecture.marketFeed.readinessStage).toBe("string");
    expect(typeof healthPayload.architecture.broker.readinessScore).toBe("number");
    expect(typeof healthPayload.architecture.broker.readinessStage).toBe("string");
    expect(healthPayload.architecture.activationPilot).toMatchObject({
      mode: "sandbox_guarded",
    });
    expect(
      ["inactive_unconfigured", "inactive_guarded", "pilot_requested_blocked", "pilot_guarded_ready"]
    ).toContain(healthPayload.architecture.activationPilot.state);
    expect(healthPayload.clientExpansion).toMatchObject({
      shared: {
        apiContract: "http_json_v1",
        executionSafety: "paper_only_live_blocked",
      },
      desktop: {
        state: "future_ready",
        foundation: {
          runtimeBridge: "ipc_json_v1",
          packaging: "contract_ready",
          sessionStrategy: "http_session_bridge",
        },
        productization: {
          releaseClaims: "no_public_store_release_claim",
        },
      },
      mobile: {
        state: "future_ready",
        foundation: {
          runtimeBridge: "bridge_json_v1",
          pushDelivery: "unconfigured",
          sessionStrategy: "session_or_token_bridge",
        },
        productization: {
          releaseClaims: "no_store_release_claim",
        },
      },
    });
    expect(healthPayload.clientExpansion.shared).toMatchObject({
      workspaceContinuity: "backend_workspace_depth_contract",
      preferenceContinuity: "hybrid_preference_contract",
      sessionContinuity: "guarded_cross_client",
      notificationTruth: "readiness_state_shared",
    });
    expect(healthPayload.clientExpansion.desktop.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(healthPayload.clientExpansion.mobile.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(healthPayload.clientExpansion.desktop.foundation.targets).toEqual(
      expect.arrayContaining(["windows", "macos", "linux"])
    );
    expect(healthPayload.clientExpansion.mobile.foundation.targets).toEqual(
      expect.arrayContaining(["android", "ios"])
    );
    expect(healthPayload.ops).toMatchObject({
      status: "ready",
    });
    expect(Array.isArray(healthPayload.subsystems)).toBe(true);
    expect(healthPayload.subsystems.length).toBeGreaterThanOrEqual(8);
    expect(healthPayload.connectors[0]).toMatchObject({
      paperCapability: "local_paper_only",
      realCapability: "blocked",
      liveExecution: "blocked",
    });
    expect(["unconfigured", "configured_blocked"]).toContain(
      healthPayload.connectors[0].state
    );

    const diagnostics = await request.get("/api/diagnostics/probes");
    expect(diagnostics.status()).toBe(200);
    const diagnosticsPayload = await diagnostics.json();
    expect(diagnosticsPayload.ok).toBe(true);

    const probes = new Map<string, { key: string; status: string }>(
      diagnosticsPayload.health.probes.map((probe: { key: string; status: string }) => [
        probe.key,
        probe,
      ])
    );
    expect(probes.get("server_readiness")).toMatchObject({ status: "ready" });
    expect(probes.get("preferences_persistence")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("workspace_persistence")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("runtime_ops")).toMatchObject({
      status: "ready",
    });
    expect(probes.get("product_backend_state")).toMatchObject({
      status: "ready",
    });
    expect(["unconfigured", "ready"]).toContain(
      probes.get("desktop_productization")?.status
    );
    expect(["unconfigured", "ready"]).toContain(
      probes.get("mobile_productization")?.status
    );
    expect(probes.get("enterprise_ops_foundation")).toMatchObject({
      status: "ready",
    });
    expect(["ready", "degraded"]).toContain(
      probes.get("production_ops_activation")?.status
    );
    expect(probes.get("commercial_scaling_foundation")).toMatchObject({
      status: "ready",
    });
    expect(["ready", "degraded"]).toContain(
      probes.get("commercial_activation")?.status
    );
    expect(probes.get("market_data")).toMatchObject({ status: "fallback" });
    expect(["unconfigured", "blocked"]).toContain(
      probes.get("broker_connector")?.status
    );
    expect(["unconfigured", "blocked"]).toContain(
      probes.get("real_integrations_foundation")?.status
    );
    expect(["unconfigured", "blocked", "ready"]).toContain(
      probes.get("real_activation_pilot")?.status
    );
    expect(probes.get("alerts_automation")).toMatchObject({
      status: "unconfigured",
    });
    expect(["unconfigured", "ready"]).toContain(
      probes.get("alerts_delivery_activation")?.status
    );
    expect(probes.get("alerts_workflow")).toMatchObject({
      status: "unconfigured",
    });
    expect(probes.get("intelligence_backend")).toMatchObject({
      status: "ready",
    });
    expect(["ready", "degraded"]).toContain(
      probes.get("ai_iq_brain_foundation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("ai_iq_brain_deepening")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("launch_readiness_gate")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("production_hardening")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("ops_recovery")?.status
    );
    expect(["ready", "unconfigured", "degraded"]).toContain(
      probes.get("closed_beta_preparation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("soft_launch_preparation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("public_launch_preparation")?.status
    );
    expect(["ready", "degraded"]).toContain(
      probes.get("market_parity_closure")?.status
    );

    const routes = new Map<string, { path: string; status: string }>(
      diagnosticsPayload.health.routes.map((route: { path: string; status: string }) => [
        route.path,
        route,
      ])
    );
    expect(routes.get("/api/account/preferences")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/commercial/catalog")).toMatchObject({
      status: "ready",
    });
    expect(routes.get("/api/account/commercial-state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/commercial-activation")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/workspace")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/account/product-state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/telemetry")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/runbook")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/hardening")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/ops/recovery")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/alerts/workflows")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/alerts/automation/state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/alerts/delivery/state")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/market/feed-state")).toMatchObject({
      status: "fallback",
    });
    expect(["unconfigured", "blocked"]).toContain(
      routes.get("/api/broker/state")?.status
    );
    expect(routes.get("/api/platform/desktop/state")).toMatchObject({
      status: "ready",
    });
    expect(["unconfigured", "ready"]).toContain(
      routes.get("/api/platform/desktop/productization")?.status
    );
    expect(routes.get("/api/platform/mobile/state")).toMatchObject({
      status: "ready",
    });
    expect(["unconfigured", "ready"]).toContain(
      routes.get("/api/platform/mobile/productization")?.status
    );
    expect(["unconfigured", "blocked"]).toContain(
      routes.get("/api/integrations/readiness")?.status
    );
    expect(["unconfigured", "blocked", "ready"]).toContain(
      routes.get("/api/integrations/pilot")?.status
    );
    expect(routes.get("/api/account/compliance")).toMatchObject({
      status: "auth_required",
    });
    expect(["unconfigured", "auth_required"]).toContain(
      routes.get("/api/operator/compliance/review")?.status
    );
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/intelligence/insights")?.status
    );
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/intelligence/operator-assist")?.status
    );
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/launch/readiness")?.status
    );
    expect(routes.get("/api/launch/operations")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/beta-readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/feedback")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/soft-readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/soft-access")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/public-readiness")).toMatchObject({
      status: "auth_required",
    });
    expect(routes.get("/api/launch/public-go-live")).toMatchObject({
      status: "auth_required",
    });
    expect(["ready", "degraded"]).toContain(
      routes.get("/api/parity/final")?.status
    );

    const launchReadiness = await request.get("/api/launch/readiness");
    expect(launchReadiness.status()).toBe(200);
    const launchReadinessPayload = await launchReadiness.json();
    expect(launchReadinessPayload.gate).toMatchObject({
      gateVersion: "tpm.launch.readiness.v2",
      mode: "verification_gate",
      contracts: {
        minimumScore: expect.any(Number),
        requiredDomains: expect.arrayContaining([
          "platform",
          "integrations",
          "ops",
          "trust",
          "commercial",
          "intelligence",
        ]),
        requiredChecklistPassRate: 1,
      },
      overall: {
        status: expect.stringMatching(/pass|fail/),
      },
      decision: {
        canEnterControlledLaunchOperations: expect.any(Boolean),
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
      },
    });
    expect(launchReadinessPayload.gate.domains).toHaveLength(9);
    expect(launchReadinessPayload.gate.checklist.items.length).toBeGreaterThan(4);
    expect(Array.isArray(launchReadinessPayload.gate.decision.blockers)).toBe(true);

    const marketParity = await request.get("/api/parity/final");
    expect(marketParity.status()).toBe(200);
    const marketParityPayload = await marketParity.json();
    expect(marketParityPayload.snapshot).toMatchObject({
      mode: "final_market_parity_closure",
      status: expect.stringMatching(/closed|partially_closed/),
      score: expect.any(Number),
      evidence: {
        diagnosticsReadiness: expect.stringMatching(
          /ready|fallback|blocked|auth_required|degraded|unconfigured|unavailable/
        ),
        launchReadinessGate: {
          status: expect.stringMatching(/pass|fail/),
          score: expect.any(Number),
        },
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
        billing: "inactive",
        predictiveGuarantee: "none",
      },
    });
    expect(Array.isArray(marketParityPayload.snapshot.objectives)).toBe(true);
    expect(marketParityPayload.snapshot.objectives.length).toBeGreaterThanOrEqual(7);
    expect(Array.isArray(marketParityPayload.snapshot.guards)).toBe(true);
    expect(marketParityPayload.snapshot.guards.length).toBeGreaterThan(3);

    const compliance = await request.get("/api/account/compliance");
    expect(compliance.status()).toBe(401);
    const opsTelemetryUnauth = await request.get("/api/ops/telemetry");
    expect(opsTelemetryUnauth.status()).toBe(401);
    const opsRunbookUnauth = await request.get("/api/ops/runbook");
    expect(opsRunbookUnauth.status()).toBe(401);
    const opsReadinessUnauth = await request.get("/api/ops/readiness");
    expect(opsReadinessUnauth.status()).toBe(401);
    const opsHardeningUnauth = await request.get("/api/ops/hardening");
    expect(opsHardeningUnauth.status()).toBe(401);
    const opsRecoveryUnauth = await request.get("/api/ops/recovery");
    expect(opsRecoveryUnauth.status()).toBe(401);
    const automationStateUnauth = await request.get("/api/alerts/automation/state");
    expect(automationStateUnauth.status()).toBe(401);
    const deliveryStateUnauth = await request.get("/api/alerts/delivery/state");
    expect(deliveryStateUnauth.status()).toBe(401);
    const launchOperationsUnauth = await request.get("/api/launch/operations");
    expect(launchOperationsUnauth.status()).toBe(401);
    const betaReadinessUnauth = await request.get("/api/launch/beta-readiness");
    expect(betaReadinessUnauth.status()).toBe(401);
    const launchFeedbackUnauth = await request.get("/api/launch/feedback");
    expect(launchFeedbackUnauth.status()).toBe(401);
    const softLaunchUnauth = await request.get("/api/launch/soft-readiness");
    expect(softLaunchUnauth.status()).toBe(401);
    const softLaunchAccessUnauth = await request.get("/api/launch/soft-access");
    expect(softLaunchAccessUnauth.status()).toBe(401);
    const publicLaunchUnauth = await request.get("/api/launch/public-readiness");
    expect(publicLaunchUnauth.status()).toBe(401);
    const publicGoLiveUnauth = await request.get("/api/launch/public-go-live");
    expect(publicGoLiveUnauth.status()).toBe(401);
    const commercialStateUnauth = await request.get("/api/account/commercial-state");
    expect(commercialStateUnauth.status()).toBe(401);
    const commercialActivationUnauth = await request.get(
      "/api/account/commercial-activation"
    );
    expect(commercialActivationUnauth.status()).toBe(401);
    const operatorReview = await request.get(
      "/api/operator/compliance/review?accountId=missing"
    );
    expect(operatorReview.status()).toBe(401);

    const broker = await request.get("/api/broker/state");
    expect(broker.status()).toBe(200);
    const brokerPayload = await broker.json();
    expect(brokerPayload.integration.integration).toMatchObject({
      paperRouting: "local_paper_only",
      realRouting: "blocked",
    });
    expect(brokerPayload.safety.liveExecution).toBe("blocked");
    expect(["unconfigured", "configured_blocked"]).toContain(
      brokerPayload.safety.state
    );

    const feedState = await request.get("/api/market/feed-state");
    expect(feedState.status()).toBe(200);
    const feedStatePayload = await feedState.json();
    expect(feedStatePayload.snapshot).toMatchObject({
      policyMode: "fallback_first",
    });
    expect(typeof feedStatePayload.snapshot.readiness.score).toBe("number");
    expect(typeof feedStatePayload.snapshot.readiness.stage).toBe("string");
    expect([
      "unconfigured",
      "configured_inactive",
      "configured_blocked",
    ]).toContain(feedStatePayload.snapshot.externalDriver.state);

    const desktopState = await request.get("/api/platform/desktop/state");
    expect(desktopState.status()).toBe(200);
    const desktopStatePayload = await desktopState.json();
    expect(desktopStatePayload.snapshot.truth).toMatchObject({
      foundationState: "contract_ready",
      hostRuntime: "desktop_shell_reserved",
      nativeClaims: "none",
    });
    expect(desktopStatePayload.snapshot.bridge).toMatchObject({
      protocol: "ipc_json_v1",
      transport: "local_host_bridge",
    });
    expect(desktopStatePayload.snapshot.targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ os: "windows" }),
        expect.objectContaining({ os: "macos" }),
        expect.objectContaining({ os: "linux" }),
      ])
    );
    expect(desktopStatePayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const desktopProductization = await request.get(
      "/api/platform/desktop/productization"
    );
    expect(desktopProductization.status()).toBe(200);
    const desktopProductizationPayload = await desktopProductization.json();
    expect(desktopProductizationPayload.snapshot.truth).toMatchObject({
      hostRuntime: "desktop_shell_reserved",
      releaseClaims: "no_public_store_release_claim",
    });
    expect(desktopProductizationPayload.snapshot.shell).toMatchObject({
      usability: "operator_pilot_usable",
      windowLayouts: "restorable",
    });
    expect(desktopProductizationPayload.snapshot.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      preferenceState: "hybrid_preference_sync",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(desktopProductizationPayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const mobileState = await request.get("/api/platform/mobile/state");
    expect(mobileState.status()).toBe(200);
    const mobileStatePayload = await mobileState.json();
    expect(mobileStatePayload.snapshot.truth).toMatchObject({
      foundationState: "contract_ready",
      runtime: "mobile_shell_reserved",
      pushClaims: "none",
    });
    expect(mobileStatePayload.snapshot.bridge).toMatchObject({
      protocol: "bridge_json_v1",
      transport: "native_web_runtime_bridge",
    });
    expect(mobileStatePayload.snapshot.targets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ platform: "android" }),
        expect.objectContaining({ platform: "ios" }),
      ])
    );
    expect(mobileStatePayload.snapshot.workflow).toMatchObject({
      pushDelivery: "unconfigured",
    });
    expect(mobileStatePayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const mobileProductization = await request.get(
      "/api/platform/mobile/productization"
    );
    expect(mobileProductization.status()).toBe(200);
    const mobileProductizationPayload = await mobileProductization.json();
    expect(mobileProductizationPayload.snapshot.truth).toMatchObject({
      runtime: "mobile_shell_reserved",
      pushClaims: "none",
      releaseClaims: "no_store_release_claim",
    });
    expect(mobileProductizationPayload.snapshot.clientFlow).toMatchObject({
      navigationModel: "workstation_compact_tabs",
      routeScope: "operator_assist",
    });
    expect(mobileProductizationPayload.snapshot.continuity).toMatchObject({
      workspaceState: "backend_workspace_depth_linked",
      preferenceState: "hybrid_preference_sync",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    });
    expect(mobileProductizationPayload.snapshot.safety).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      autoTrading: "blocked",
    });

    const integrationReadiness = await request.get("/api/integrations/readiness");
    expect(integrationReadiness.status()).toBe(200);
    const integrationPayload = await integrationReadiness.json();
    expect(integrationPayload.snapshot.policy).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked_until_policy_release",
      externalFeedActivation: "blocked_until_policy_release",
      operatorApproval: "required",
    });
    expect(integrationPayload.snapshot.activation).toMatchObject({
      mode: "operator_review_and_policy_guard",
      canActivateNow: false,
      sandboxState: "inactive_guarded",
      auditReference: "local_audit_contract",
    });
    expect(integrationPayload.snapshot.activation.checklist).toEqual(
      expect.arrayContaining([
        "broker_endpoint",
        "broker_credentials",
        "feed_endpoint",
        "feed_credentials",
        "operator_review",
        "policy_release",
      ])
    );
    expect(Array.isArray(integrationPayload.snapshot.activation.blockedReasons)).toBe(
      true
    );
    expect(integrationPayload.snapshot.activation.blockedReasons.length).toBeGreaterThan(
      0
    );
    expect(["unconfigured", "configured_blocked"]).toContain(
      integrationPayload.snapshot.broker.state
    );
    expect(integrationPayload.snapshot.broker.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      validation: "guarded_local_probe",
      auditTrail: "local_audit",
    });
    expect(["unconfigured", "configured_inactive", "configured_blocked"]).toContain(
      integrationPayload.snapshot.marketFeed.state
    );
    expect(integrationPayload.snapshot.marketFeed.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      validation: "guarded_local_probe",
      auditTrail: "local_audit",
    });
    expect(integrationPayload.snapshot.pilotPath).toMatchObject({
      mode: "sandbox_only",
      scope: "single_broker_single_feed",
      state: "inactive_guarded",
      canEnterPilot: false,
    });
    expect(integrationPayload.snapshot.pilotPath.nextMilestones).toEqual(
      expect.arrayContaining([
        "configure broker endpoint and credentials",
        "configure external feed endpoint and credentials",
      ])
    );

    const integrationPilot = await request.get("/api/integrations/pilot");
    expect(integrationPilot.status()).toBe(200);
    const integrationPilotPayload = await integrationPilot.json();
    expect(integrationPilotPayload.snapshot.truth).toMatchObject({
      environment: "sandbox_pilot_only",
      scope: "single_broker_single_feed",
      claims: "no_live_ready_claims",
    });
    expect(integrationPilotPayload.snapshot.safety).toMatchObject({
      paperOnlyDefault: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      externalMoneyMovement: "blocked",
    });
    expect(integrationPilotPayload.snapshot.brokerPath.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      verification: "guarded_probe_only",
      auditTrail: "local_audit",
    });
    expect(integrationPilotPayload.snapshot.feedPath.credentialLifecycle).toMatchObject({
      rotationMode: "manual_operator_rotation",
      verification: "guarded_probe_only",
      auditTrail: "local_audit",
    });
    expect(integrationPilotPayload.snapshot.activation.checklist).toEqual(
      expect.arrayContaining([
        "broker_endpoint",
        "broker_credentials",
        "feed_endpoint",
        "feed_credentials",
        "policy_release",
        "paper_only_guard",
      ])
    );
    expect(integrationPilotPayload.snapshot.controls).toMatchObject({
      credentialScope: "sandbox_namespace_only",
      dataPlaneIsolation: "sandbox_only",
      releaseMode: "operator_guarded_manual",
      auditReference: "local_audit_contract",
    });
    expect(typeof integrationPilotPayload.snapshot.readiness.score).toBe("number");
    expect(typeof integrationPilotPayload.snapshot.readiness.stage).toBe("string");

    const commercialCatalog = await request.get("/api/commercial/catalog");
    expect(commercialCatalog.status()).toBe(200);
    const commercialCatalogPayload = await commercialCatalog.json();
    expect(commercialCatalogPayload.snapshot.truth).toMatchObject({
      billingEngine: "inactive",
      subscriptionEngine: "unconfigured",
      checkoutSurface: "not_enabled",
      paidPlanActivation: "not_enabled",
    });
    expect(commercialCatalogPayload.snapshot.productTruth).toMatchObject({
      goToMarketState: "evaluation_only",
      billingClaims: "none",
      checkoutClaims: "none",
      nativeClaims: "contract_only",
    });
    expect(commercialCatalogPayload.snapshot.plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "evaluation", billing: "inactive" }),
        expect.objectContaining({ key: "team_review", billing: "inactive" }),
      ])
    );
    expect(commercialCatalogPayload.snapshot.plans).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "evaluation",
          capabilities: expect.objectContaining({
            supportLane: "manual_operator_review",
            notificationDelivery: "unconfigured",
          }),
        }),
      ])
    );

    const workspace = await request.get("/api/account/workspace");
    expect(workspace.status()).toBe(401);
    const productState = await request.get("/api/account/product-state");
    expect(productState.status()).toBe(401);
    const workflows = await request.get("/api/alerts/workflows");
    expect(workflows.status()).toBe(401);

    const intelligence = await request.get(
      "/api/intelligence/context?symbol=EURUSD&timeframe=1m"
    );
    expect(intelligence.status()).toBe(200);
    const intelligencePayload = await intelligence.json();
    expect(intelligencePayload.snapshot).toMatchObject({
      authenticated: false,
      availability: "bounded",
    });
    expect(intelligencePayload.snapshot.truth).toMatchObject({
      modelScope: "deterministic_context",
      predictiveScope: "interpretive_only",
      liveExecution: "blocked",
      predictiveGuarantee: "none",
      winRateClaim: "none",
      degradedModeExplicit: true,
    });
    expect(intelligencePayload.snapshot.multiTimeframe.windows).toHaveLength(3);
    expect(intelligencePayload.snapshot.multiTimeframe.structureBias).toMatch(
      /trend_following|range_balanced|mixed_structure/
    );
    expect(["aligned", "mixed", "unclear"]).toContain(
      intelligencePayload.snapshot.multiTimeframe.alignment
    );
    expect(intelligencePayload.snapshot.executionContext).toMatchObject({
      route: "paper_only",
      operatorControl: "required",
      riskBudgetBand: expect.stringMatching(/low|medium/),
      sessionCadence: expect.stringMatching(/slow|moderate/),
    });
    expect(intelligencePayload.snapshot.journal.coverage).toBe(
      "local_audit_limited"
    );
    expect(intelligencePayload.snapshot.journal.qualitySignal).toMatch(
      /limited|emerging|structured/
    );
    expect(intelligencePayload.snapshot.coaching.mode).toBe("bounded_guidance");
    expect(intelligencePayload.snapshot.coaching.reviewWindowMinutes).toBeGreaterThan(0);
    expect(Array.isArray(intelligencePayload.snapshot.coaching.degradedBoundaries)).toBe(
      true
    );

    const intelligenceInsights = await request.get(
      "/api/intelligence/insights?symbol=EUR/USD&timeframe=5m"
    );
    expect(intelligenceInsights.status()).toBe(200);
    const intelligenceInsightsPayload = await intelligenceInsights.json();
    expect(intelligenceInsightsPayload.view).toBe("expanded_intelligence_context");
    expect(intelligenceInsightsPayload.snapshot.truth).toMatchObject({
      modelScope: "deterministic_context",
      predictiveGuarantee: "none",
      winRateClaim: "none",
      liveExecution: "blocked",
    });

    const intelligenceOperatorAssist = await request.get(
      "/api/intelligence/operator-assist?symbol=EUR/USD&timeframe=15m"
    );
    expect(intelligenceOperatorAssist.status()).toBe(200);
    const intelligenceOperatorAssistPayload = await intelligenceOperatorAssist.json();
    expect(intelligenceOperatorAssistPayload.view).toBe("operator_assist_pack");
    expect(intelligenceOperatorAssistPayload.snapshot.assist).toMatchObject({
      depth: "expanded_operator_assist",
      dataBoundaries: "bounded_local_context",
      executionAuthority: "operator_manual",
    });
    expect(Array.isArray(intelligenceOperatorAssistPayload.snapshot.assist.workspaceActions)).toBe(
      true
    );
    expect(
      intelligenceOperatorAssistPayload.snapshot.assist.workspaceActions.length
    ).toBeGreaterThan(0);
    expect(typeof intelligenceOperatorAssistPayload.snapshot.multiTimeframe.consensusScore).toBe(
      "number"
    );
  });

  test("persists backend workspace depth and workflow state for authenticated sessions", async ({
    request,
  }) => {
    const login = await request.post("/api/auth/login", {
      data: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });
    expect(login.status()).toBe(200);

    const product = await request.get("/api/account/product-state");
    expect(product.status()).toBe(200);
    const productPayload = await product.json();
    expect(productPayload.snapshot.capabilities).toMatchObject({
      liveExecution: "blocked",
      marketData: "fallback_first",
      alertsWorkflow: "configured_local",
    });
    expect(productPayload.snapshot.trust).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      degradedDisclosure: "explicit",
      liveExecutionControls: "hard_blocked",
    });
    expect(productPayload.snapshot.availabilitySemantics).toMatchObject({
      paperExecution: expect.stringMatching(/available|guarded|blocked/),
      liveExecution: "blocked",
      marketData: "fallback_first",
      brokerRouting: "blocked",
      workflowDelivery: expect.stringMatching(/unconfigured|configured_guarded/),
    });
    expect(productPayload.snapshot.guardrails).toMatchObject({
      executionConfirmation: "required",
      disclosureAcknowledgement: "required_before_paper_enablement",
      degradedStateLabeling: "explicit",
      auditTrace: "active",
    });
    expect(productPayload.snapshot.commercial).toMatchObject({
      billing: "inactive",
      subscriptions: "unconfigured",
      plan: "evaluation",
    });

    const launchOperations = await request.get("/api/launch/operations");
    expect(launchOperations.status()).toBe(200);
    const launchOperationsPayload = await launchOperations.json();
    expect(launchOperationsPayload.snapshot).toMatchObject({
      mode: expect.stringMatching(
        /closed_beta_preparation|soft_launch_preparation|public_launch_preparation|closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
      ),
      program: {
        releaseTrack: "controlled_launch_operations",
        currentStage: expect.stringMatching(
          /launch_readiness_verification_gate|closed_beta_preparation|soft_launch_preparation|public_launch_preparation|closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
        ),
        previousStage: expect.stringMatching(
          /launch_readiness_verification_gate|closed_beta_preparation|soft_launch_preparation|closed_beta_activation|soft_launch_activation/
        ),
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        publicAccess: "not_open",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
      },
    });
    expect(launchOperationsPayload.snapshot.stages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "launch_readiness_verification_gate",
          required: true,
          state: expect.stringMatching(/ready|blocked/),
        }),
        expect.objectContaining({
          key: "closed_beta_preparation",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
        expect.objectContaining({
          key: "production_hardening",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
        expect.objectContaining({
          key: "soft_launch_preparation",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
        expect.objectContaining({
          key: "public_launch_preparation",
          required: true,
          state: expect.stringMatching(/ready|in_progress|blocked/),
        }),
      ])
    );

    const closedBetaActivation = await request.post("/api/launch/operations", {
      data: {
        action: "activate_closed_beta",
        note: "Activate guarded closed beta operations mode.",
      },
    });
    expect(closedBetaActivation.status()).toBe(200);
    const closedBetaActivationPayload = await closedBetaActivation.json();
    expect(closedBetaActivationPayload).toMatchObject({
      ok: true,
      authenticated: true,
      action: "activate_closed_beta",
      reason: "closed_beta_activated",
    });
    expect(closedBetaActivationPayload.lifecycle).toMatchObject({
      mode: "closed_beta_activation",
      stage: "closed_beta_active",
    });
    expect(closedBetaActivationPayload.snapshot.mode).toMatch(
      /closed_beta_activation|soft_launch_activation|public_launch_activation_gate/
    );
    const softLaunchActivation = await request.post("/api/launch/operations", {
      data: {
        action: "activate_soft_launch",
        note: "Activate guarded soft launch limited rollout mode.",
      },
    });
    expect(softLaunchActivation.status()).toBe(200);
    const softLaunchActivationPayload = await softLaunchActivation.json();
    expect(softLaunchActivationPayload).toMatchObject({
      ok: true,
      authenticated: true,
      action: "activate_soft_launch",
      reason: "soft_launch_activated",
    });
    expect(softLaunchActivationPayload.lifecycle).toMatchObject({
      mode: "soft_launch_activation",
      stage: "soft_launch_active",
    });
    expect(softLaunchActivationPayload.snapshot.mode).toMatch(
      /soft_launch_activation|public_launch_activation_gate/
    );
    expect(softLaunchActivationPayload.snapshot.softLaunch.activation).toMatchObject({
      state: "active_guarded",
      activationRoute: "/api/launch/operations",
    });
    expect(typeof softLaunchActivationPayload.snapshot.softLaunch.activation.activatedAt).toBe(
      "string"
    );
    expect(launchOperationsPayload.snapshot.closedBeta).toMatchObject({
      mode: "controlled_closed_beta",
      programMode: expect.stringMatching(
        /closed_beta|soft_launch|public_launch_preparation/
      ),
      access: "allowlist_only",
      accessDecision: expect.stringMatching(
        /granted|review_required|blocked_unconfigured/
      ),
      evaluatorEligibility: expect.stringMatching(
        /eligible|review_required|allowlist_unconfigured/
      ),
      matchSource: expect.stringMatching(/email|account|none/),
      capacity: {
        maxEvaluators: expect.any(Number),
        activeEvaluators: expect.any(Number),
        remainingSlots: expect.any(Number),
        state: expect.stringMatching(/within_limit|at_limit/),
      },
      cohort: {
        userEmail: expect.any(String),
        accountId: expect.any(String),
        supportLane: "operator_review",
        feedbackRoute: "/api/launch/feedback",
      },
      activation: {
        state: expect.stringMatching(/active_guarded|inactive_guarded/),
        activationRoute: "/api/launch/operations",
      },
      feedbackLoop: {
        state: expect.stringMatching(
          /operational_guarded|triage_backlog_guarded/
        ),
        pendingTriage: expect.any(Number),
        hardeningInProgress: expect.any(Number),
        highSeverityOpen: expect.any(Number),
        hardeningFollowUps: expect.any(Number),
        recoveryLinked: expect.any(Number),
        lifecycleRoute: "/api/launch/feedback",
        hardeningRoute: "/api/ops/hardening",
        recoveryRoute: "/api/ops/recovery",
      },
      safety: {
        paperOnly: true,
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        billing: "inactive",
      },
    });
    expect(Array.isArray(launchOperationsPayload.snapshot.closedBeta.limitations)).toBe(
      true
    );
    expect(launchOperationsPayload.snapshot.softLaunch).toMatchObject({
      mode: "limited_rollout_guarded",
      programMode: expect.stringMatching(/limited_rollout_guarded|disabled_guarded/),
      state: expect.stringMatching(/prepared_guarded|active_guarded|blocked_guarded/),
      access: "cohort_and_capacity_guard",
      admission: {
        decision: expect.stringMatching(/admitted|queue_review|blocked/),
        reason: expect.stringMatching(
          /capacity_available|requires_operator_review|soft_launch_disabled_or_blocked/
        ),
        supportLane: "operator_review",
        queueRoute: "/api/launch/feedback",
      },
      activation: {
        state: expect.stringMatching(/active_guarded|inactive_guarded/),
        activationRoute: "/api/launch/operations",
      },
      channels: {
        publicEntry: "limited_rollout_visibility",
        inviteFlow: "operator_issue_only",
        supportPath: "operator_review",
      },
      support: {
        feedbackRoute: "/api/launch/feedback",
        responseSlaHours: expect.any(Number),
        rolloutStatus: "limited_guarded",
      },
      guardrails: {
        capacityProtection: {
          state: expect.stringMatching(
            /stable_guarded|pressure_guarded|at_limit_guarded/
          ),
          utilizationPct: expect.any(Number),
          thresholdPct: expect.any(Number),
          protectionMode: "queue_then_operator_review",
        },
        supportReadiness: {
          state: expect.stringMatching(/operator_ready|operator_guarded/),
          pendingTriage: expect.any(Number),
          highSeverityOpen: expect.any(Number),
          supportLane: "operator_review",
          incidentLane: "operator_incident_review",
          responseSlaHours: expect.any(Number),
        },
        rollback: {
          state: expect.stringMatching(/recoverable_guarded|guarded/),
          strategy: "manual_checkpoint_restore",
          rollbackWindowMinutes: expect.any(Number),
          requiresOperatorConfirmation: true,
          recoveryRoute: "/api/ops/recovery",
          runbookRoute: "/api/ops/runbook",
        },
        commercial: {
          billing: "inactive",
          checkout: "not_enabled",
          subscriptionActivation: "inactive_guarded",
          rolloutClaim: "limited_rollout_only",
        },
        escalation: {
          policy: "manual_threshold_escalation",
          triggerState: expect.stringMatching(/normal|elevated/),
          triggers: expect.any(Array),
          feedbackRoute: "/api/launch/feedback",
          recoveryRoute: "/api/ops/recovery",
        },
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        scaleClaims: "none",
        liveExecution: "blocked",
        billing: "inactive",
      },
    });
    expect(launchOperationsPayload.snapshot.softLaunch.capacity).toMatchObject({
      maxAccounts: expect.any(Number),
      activeAccounts: expect.any(Number),
      remainingSlots: expect.any(Number),
      state: expect.stringMatching(/within_limit|at_limit/),
    });
    expect(launchOperationsPayload.snapshot.publicLaunch).toMatchObject({
      mode: "go_live_checklist_guarded",
      state: expect.stringMatching(
        /prepared_guarded|in_progress_guarded|blocked_guarded/
      ),
      contracts: {
        checklistAuthority: "operator_manual",
        legalDisclosures: "required_prelaunch",
        customerComms: "prepared_guarded",
        statusPage: "manual_guarded",
      },
      decision: {
        goLiveState: expect.stringMatching(/ready_guarded|not_ready/),
        reason: expect.stringMatching(
          /checklist_passed_manual_release_required|checklist_incomplete_or_gate_blocked/
        ),
        releaseRoute: "/api/launch/public-go-live",
      },
      visibility: {
        launchModeLabel: "public_launch_preparation",
        customerStateLabel: "not_launched",
        claimsPolicy: "no_false_public_launch_claims",
      },
      goLive: {
        releaseAuthority: "operator_manual",
        rolloutWindow: expect.stringMatching(/guarded_unset|guarded_planned/),
        rollbackPlan: "required",
        customerComms: "prepared_guarded",
        supportScale: "operator_limited",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        billing: "inactive",
        liveExecution: "blocked",
        scaleClaims: "none",
      },
    });
    expect(launchOperationsPayload.snapshot.publicLaunch.checklist).toMatchObject({
      requiredCount: expect.any(Number),
      passedCount: expect.any(Number),
      failedCount: expect.any(Number),
    });
    expect(Array.isArray(launchOperationsPayload.snapshot.publicLaunch.checklist.items)).toBe(
      true
    );
    expect(
      launchOperationsPayload.snapshot.publicLaunch.checklist.items.length
    ).toBeGreaterThan(3);
    expect(launchOperationsPayload.snapshot.support).toMatchObject({
      mode: "closed_beta_operator_review",
      feedbackSubmissions30d: expect.any(Number),
      feedbackLifecycleUpdates30d: expect.any(Number),
      pendingTriage: expect.any(Number),
      hardeningInProgress: expect.any(Number),
      highSeverityOpen: expect.any(Number),
      hardeningFollowUps: expect.any(Number),
      recoveryLinked: expect.any(Number),
      supportReadiness: expect.stringMatching(/operator_ready|operator_guarded/),
      escalationState: expect.stringMatching(/normal|elevated/),
      feedbackRoute: "/api/launch/feedback",
      hardeningRoute: "/api/ops/hardening",
      recoveryRoute: "/api/ops/recovery",
    });

    const launchBetaReadiness = await request.get("/api/launch/beta-readiness");
    expect(launchBetaReadiness.status()).toBe(200);
    const launchBetaReadinessPayload = await launchBetaReadiness.json();
    expect(launchBetaReadinessPayload.snapshot).toMatchObject({
      mode: "closed_beta_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      closedBeta: {
        mode: "controlled_closed_beta",
        access: "allowlist_only",
      },
      support: {
        mode: "closed_beta_operator_review",
        feedbackRoute: "/api/launch/feedback",
      },
    });

    const softLaunchReadiness = await request.get("/api/launch/soft-readiness");
    expect(softLaunchReadiness.status()).toBe(200);
    const softLaunchReadinessPayload = await softLaunchReadiness.json();
    expect(softLaunchReadinessPayload.snapshot).toMatchObject({
      mode: "soft_launch_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      softLaunch: {
        mode: "limited_rollout_guarded",
        programMode: expect.stringMatching(/limited_rollout_guarded|disabled_guarded/),
        state: expect.stringMatching(/prepared_guarded|active_guarded|blocked_guarded/),
        access: "cohort_and_capacity_guard",
        guardrails: {
          capacityProtection: {
            state: expect.stringMatching(
              /stable_guarded|pressure_guarded|at_limit_guarded/
            ),
          },
          supportReadiness: {
            state: expect.stringMatching(/operator_ready|operator_guarded/),
          },
          rollback: {
            state: expect.stringMatching(/recoverable_guarded|guarded/),
          },
        },
      },
    });

    const softLaunchAccess = await request.get("/api/launch/soft-access");
    expect(softLaunchAccess.status()).toBe(200);
    const softLaunchAccessPayload = await softLaunchAccess.json();
    expect(softLaunchAccessPayload.snapshot).toMatchObject({
      mode: "soft_launch_access",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      softLaunch: {
        programMode: expect.stringMatching(/limited_rollout_guarded|disabled_guarded/),
        state: expect.stringMatching(/prepared_guarded|active_guarded|blocked_guarded/),
        admission: {
          decision: expect.stringMatching(/admitted|queue_review|blocked/),
          reason: expect.stringMatching(
            /capacity_available|requires_operator_review|soft_launch_disabled_or_blocked/
          ),
        },
        activation: {
          state: expect.stringMatching(/active_guarded|inactive_guarded/),
          activationRoute: "/api/launch/operations",
        },
        guardrails: {
          capacityProtection: {
            state: expect.stringMatching(
              /stable_guarded|pressure_guarded|at_limit_guarded/
            ),
          },
          supportReadiness: {
            state: expect.stringMatching(/operator_ready|operator_guarded/),
          },
          rollback: {
            state: expect.stringMatching(/recoverable_guarded|guarded/),
          },
        },
      },
    });

    const publicLaunchReadiness = await request.get(
      "/api/launch/public-readiness"
    );
    expect(publicLaunchReadiness.status()).toBe(200);
    const publicLaunchReadinessPayload = await publicLaunchReadiness.json();
    expect(publicLaunchReadinessPayload.snapshot).toMatchObject({
      mode: "public_launch_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      publicLaunch: {
        mode: "go_live_checklist_guarded",
        state: expect.stringMatching(
          /prepared_guarded|in_progress_guarded|blocked_guarded/
        ),
      },
    });

    const publicGoLive = await request.get("/api/launch/public-go-live");
    expect(publicGoLive.status()).toBe(200);
    const publicGoLivePayload = await publicGoLive.json();
    expect(publicGoLivePayload.snapshot).toMatchObject({
      mode: "public_go_live_preparation",
      stage: expect.stringMatching(/ready|in_progress|blocked|not_started/),
      publicLaunch: {
        state: expect.stringMatching(
          /prepared_guarded|in_progress_guarded|blocked_guarded/
        ),
        decision: {
          goLiveState: expect.stringMatching(/ready_guarded|not_ready/),
          releaseRoute: "/api/launch/public-go-live",
        },
        visibility: {
          launchModeLabel: "public_launch_preparation",
          customerStateLabel: "not_launched",
        },
      },
    });

    const launchFeedback = await request.get("/api/launch/feedback");
    expect(launchFeedback.status()).toBe(200);
    const launchFeedbackPayload = await launchFeedback.json();
    expect(launchFeedbackPayload.snapshot).toMatchObject({
      mode: "closed_beta_feedback",
      intake: {
        route: "/api/launch/feedback",
        auth: "required",
        queue: "operator_review",
      },
      summary: {
        submissions30d: expect.any(Number),
        lifecycleUpdates30d: expect.any(Number),
        openItems: expect.any(Number),
        pendingTriage: expect.any(Number),
        hardeningInProgress: expect.any(Number),
        highSeverityOpen: expect.any(Number),
      },
      triage: {
        contract: "beta_feedback_hardening_loop",
        queue: {
          submitted: expect.any(Number),
          triaged: expect.any(Number),
          hardeningInProgress: expect.any(Number),
          resolved: expect.any(Number),
          deferred: expect.any(Number),
        },
        hardeningFollowUps: expect.any(Number),
        recoveryLinked: expect.any(Number),
        hardeningRoute: "/api/ops/hardening",
        recoveryRoute: "/api/ops/recovery",
      },
      support: {
        mode: "closed_beta_support_guarded",
        lane: "operator_review",
        incidentLane: "operator_incident_review",
        feedbackRoute: "/api/launch/feedback",
        escalationRoute: "/api/ops/recovery",
      },
      truth: {
        launchClaim: "not_launched",
        publicLaunchClaim: "not_claimed",
        liveExecution: "blocked",
        billing: "inactive",
      },
    });
    const baselineFeedbackCount =
      launchFeedbackPayload.snapshot.summary.submissions30d;
    const baselineLifecycleCount =
      launchFeedbackPayload.snapshot.summary.lifecycleUpdates30d;
    expect(typeof baselineFeedbackCount).toBe("number");
    expect(Array.isArray(launchFeedbackPayload.snapshot.recent)).toBe(true);

    const launchFeedbackUpdate = await request.post("/api/launch/feedback", {
      data: {
        category: "usability",
        severity: "medium",
        summary: "Ticket defaults are clear in closed beta mode.",
        detail:
          "Operator feedback capture should stay account-scoped and auditable while access is limited.",
      },
    });
    expect(launchFeedbackUpdate.status()).toBe(200);
    const launchFeedbackUpdatePayload = await launchFeedbackUpdate.json();
    expect(launchFeedbackUpdatePayload.action).toBe("submit_feedback");
    expect(launchFeedbackUpdatePayload.reason).toBe("feedback_submitted");
    expect(launchFeedbackUpdatePayload.snapshot.summary.submissions30d).toBeGreaterThanOrEqual(
      baselineFeedbackCount
    );
    expect(launchFeedbackUpdatePayload.snapshot.recent).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          feedbackId: expect.any(String),
          category: "usability",
          severity: "medium",
          lifecycleState: expect.stringMatching(
            /submitted|triaged|hardening_in_progress|resolved|deferred/
          ),
        }),
      ])
    );

    const lifecycleFeedbackId =
      launchFeedbackUpdatePayload.snapshot.recent[0]?.feedbackId;
    expect(typeof lifecycleFeedbackId).toBe("string");

    const lifecycleUpdate = await request.post("/api/launch/feedback", {
      data: {
        action: "update_feedback_lifecycle",
        feedbackId: lifecycleFeedbackId,
        lifecycleState: "triaged",
        reviewNote: "Triaged for hardening follow-up in closed beta support queue.",
      },
    });
    expect(lifecycleUpdate.status()).toBe(200);
    const lifecycleUpdatePayload = await lifecycleUpdate.json();
    expect(lifecycleUpdatePayload).toMatchObject({
      ok: true,
      authenticated: true,
      action: "update_feedback_lifecycle",
      reason: "feedback_lifecycle_updated",
    });
    expect(lifecycleUpdatePayload.snapshot.summary.lifecycleUpdates30d).toBeGreaterThanOrEqual(
      baselineLifecycleCount
    );
    expect(lifecycleUpdatePayload.snapshot.recent).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          feedbackId: lifecycleFeedbackId,
          lifecycleState: "triaged",
        }),
      ])
    );

    const opsTelemetry = await request.get("/api/ops/telemetry");
    expect(opsTelemetry.status()).toBe(200);
    const opsTelemetryPayload = await opsTelemetry.json();
    expect(opsTelemetryPayload.snapshot.observability).toMatchObject({
      mode: "local_observability",
      logging: "structured_local",
      metrics: "runtime_process",
      tracing: "inactive",
      alerting: "unconfigured",
    });
    expect(opsTelemetryPayload.snapshot.opsTruth).toMatchObject({
      adminSurface: "operator_guarded_api",
      remoteControl: "not_enabled",
      externalMonitoring: "unconfigured",
      incidentAutomation: "inactive",
    });
    expect(opsTelemetryPayload.snapshot.degradation).toMatchObject({
      status: expect.stringMatching(/stable|guarded/),
      memoryPressure: expect.stringMatching(/normal|elevated/),
      sessionBacklog: expect.stringMatching(/normal|elevated/),
      auditVolume: expect.stringMatching(/stable|elevated/),
    });
    expect(Array.isArray(opsTelemetryPayload.snapshot.degradation.indicators)).toBe(
      true
    );
    expect(opsTelemetryPayload.snapshot.runbookPointers).toEqual(
      expect.arrayContaining([
        "/api/ops/runbook",
        "/api/ops/readiness",
        "/api/ops/hardening",
        "/api/diagnostics/probes",
      ])
    );

    const opsHardening = await request.get("/api/ops/hardening");
    expect(opsHardening.status()).toBe(200);
    const opsHardeningPayload = await opsHardening.json();
    expect(opsHardeningPayload.snapshot).toMatchObject({
      runtime: {
        state: expect.stringMatching(/stable|guarded/),
      },
      database: {
        state: expect.stringMatching(/reachable|guarded/),
        timeoutMs: expect.any(Number),
      },
      durability: {
        state: expect.stringMatching(/stable|guarded/),
      },
      degraded: {
        status: expect.stringMatching(/stable|guarded/),
        failureMode: "truthful_degraded_disclosure",
        recoveryMode: "operator_guided_manual",
      },
      safeguards: {
        responseTimeouts: "bounded",
        retryPolicy: "single_retry_with_truthful_failure",
        fallbackPolicy: "fallback_first",
        executionSafety: "paper_only_live_blocked",
      },
      recovery: {
        runbookRoute: "/api/ops/runbook",
        readinessRoute: "/api/ops/readiness",
        diagnosticsRoute: "/api/diagnostics/probes",
        hardeningRoute: "/api/ops/hardening",
      },
    });
    expect(Array.isArray(opsHardeningPayload.snapshot.recovery.recommendedActions)).toBe(
      true
    );
    expect(opsHardeningPayload.snapshot.recovery.recommendedActions.length).toBeGreaterThan(
      1
    );

    const opsRecovery = await request.get("/api/ops/recovery");
    expect(opsRecovery.status()).toBe(200);
    const opsRecoveryPayload = await opsRecovery.json();
    expect(opsRecoveryPayload.snapshot).toMatchObject({
      mode: "operator_recovery_guarded",
      stage: expect.stringMatching(/recoverable|guarded/),
      rollback: {
        strategy: "manual_checkpoint_restore",
        rollbackWindowMinutes: expect.any(Number),
        readiness: expect.stringMatching(/recoverable|guarded/),
        requiresOperatorConfirmation: true,
      },
      failurePaths: {
        databasePath: "manual_operator_restore",
        runtimePath: "manual_process_recycle",
        sessionPath: "manual_session_hygiene",
        workflowPath: "manual_queue_review",
      },
      truth: {
        automation: "inactive",
        liveExecution: "blocked",
        realMoneyRouting: "blocked",
        launchClaim: "not_launched",
      },
      references: {
        runbookRoute: "/api/ops/runbook",
        readinessRoute: "/api/ops/readiness",
        hardeningRoute: "/api/ops/hardening",
        diagnosticsRoute: "/api/diagnostics/probes",
      },
    });
    expect(Array.isArray(opsRecoveryPayload.snapshot.rollback.checkpoints)).toBe(true);
    expect(opsRecoveryPayload.snapshot.rollback.checkpoints.length).toBeGreaterThan(2);
    expect(Array.isArray(opsRecoveryPayload.snapshot.recommendedActions)).toBe(true);

    const opsRunbook = await request.get("/api/ops/runbook");
    expect(opsRunbook.status()).toBe(200);
    const opsRunbookPayload = await opsRunbook.json();
    expect(opsRunbookPayload.snapshot.mode).toBe("operator_manual");
    expect(opsRunbookPayload.snapshot.runbooks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "runtime_readiness", state: "ready" }),
        expect.objectContaining({ key: "execution_safety", state: "ready" }),
      ])
    );
    expect(opsRunbookPayload.snapshot.runbooks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "ops_incident_review",
          severity: "elevated",
          probeKey: "production_ops_activation",
        }),
      ])
    );
    expect(typeof opsRunbookPayload.snapshot.lastReviewedAt).toBe("string");

    const opsReadiness = await request.get("/api/ops/readiness");
    expect(opsReadiness.status()).toBe(200);
    const opsReadinessPayload = await opsReadiness.json();
    expect(opsReadinessPayload.snapshot.adminGuard).toMatchObject({
      operatorApi: "guarded",
      remoteAdmin: "not_enabled",
      commandExecution: "manual_review_required",
      maintenanceMode: "manual_only",
    });
    expect(opsReadinessPayload.snapshot.runbookFlow).toMatchObject({
      readinessReview: "manual_operator",
      incidentReview: "manual_operator",
      escalation: "manual_operator",
      automation: "inactive",
    });
    expect(opsReadinessPayload.snapshot.degradationSurface).toMatchObject({
      status: expect.stringMatching(/stable|guarded/),
    });
    expect(Array.isArray(opsReadinessPayload.snapshot.degradationSurface.signals)).toBe(
      true
    );
    expect(opsReadinessPayload.snapshot.healthExposure).toMatchObject({
      telemetryRoute: "authenticated",
      runbookRoute: "authenticated",
      diagnosticsRoute: "public_truthful",
    });

    const commercialState = await request.get("/api/account/commercial-state");
    expect(commercialState.status()).toBe(200);
    const commercialStatePayload = await commercialState.json();
    expect(commercialStatePayload.snapshot.plan).toMatchObject({
      key: "evaluation",
      state: "active_evaluation",
      activationLane: "operator_review_queue",
    });
    expect(commercialStatePayload.snapshot.billing).toMatchObject({
      engine: "inactive",
      subscriptions: "unconfigured",
      checkout: "not_enabled",
      statementDelivery: "inactive",
    });
    expect(commercialStatePayload.snapshot.account).toMatchObject({
      tenancy: "single_account_guarded",
    });
    expect(commercialStatePayload.snapshot.customerLifecycle).toMatchObject({
      stateExposure: "explicit",
    });
    expect(commercialStatePayload.snapshot.customerLifecycle.checkpoints).toEqual(
      expect.arrayContaining(["disclosures", "verification", "paper_ready"])
    );
    expect(commercialStatePayload.snapshot.trust).toMatchObject({
      paperOnly: true,
      liveExecution: "blocked",
      paidPlanActivation: "not_enabled",
      billingClaims: "none",
    });
    expect(commercialStatePayload.snapshot.commercialTruth).toMatchObject({
      evaluationMode: "active",
      contractMaturity: "operator_review_ready",
      checkoutClaims: "none",
      paidActivationClaims: "none",
    });

    const commercialActivation = await request.get(
      "/api/account/commercial-activation"
    );
    expect(commercialActivation.status()).toBe(200);
    const commercialActivationPayload = await commercialActivation.json();
    expect(commercialActivationPayload.snapshot.plan).toMatchObject({
      current: "evaluation",
    });
    expect(commercialActivationPayload.snapshot.commercialTruth).toMatchObject({
      billingEngine: "inactive",
      checkout: "not_enabled",
      paidActivation: "not_enabled",
      subscriptionState: "unconfigured",
    });
    expect(commercialActivationPayload.snapshot.activation).toMatchObject({
      queueState: expect.stringMatching(/idle|operator_review_queue/),
    });
    expect(commercialActivationPayload.snapshot.requestLedger).toMatchObject({
      source: "local_audit",
      policyMode: "manual_operator_review",
      activationClaims: "no_paid_auto_activation",
    });
    expect(commercialActivationPayload.snapshot.customerFacingSemantics).toMatchObject({
      evaluationState: "active",
      checkoutClaims: "none",
      billingClaims: "none",
      requestPath: "operator_review",
    });

    const commercialActivationUpdate = await request.post(
      "/api/account/commercial-activation",
      {
        data: {
          requestedPlan: "team_review",
          note: "Need multi-operator review lane",
        },
      }
    );
    expect(commercialActivationUpdate.status()).toBe(200);
    const commercialActivationUpdatePayload = await commercialActivationUpdate.json();
    expect(commercialActivationUpdatePayload.snapshot.activation).toMatchObject({
      state: "requested",
      operatorActionRequired: true,
      queueState: "operator_review_queue",
    });
    expect(commercialActivationUpdatePayload.snapshot.plan).toMatchObject({
      current: "evaluation",
      requested: "team_review",
    });

    const workspaceUpdate = await request.post("/api/account/workspace", {
      data: {
        workspaceDepth: {
          focusMode: "execution_focus",
          watchlistDensity: "dense",
          shortcutLayer: "layout_only",
        },
      },
    });
    expect(workspaceUpdate.status()).toBe(200);
    const workspaceUpdatePayload = await workspaceUpdate.json();
    expect(workspaceUpdatePayload.workspaceDepth).toMatchObject({
      focusMode: "execution_focus",
      watchlistDensity: "dense",
      shortcutLayer: "layout_only",
    });

    const workspaceRead = await request.get("/api/account/workspace");
    expect(workspaceRead.status()).toBe(200);
    const workspaceReadPayload = await workspaceRead.json();
    expect(workspaceReadPayload.workspaceDepth).toMatchObject({
      focusMode: "execution_focus",
      watchlistDensity: "dense",
      shortcutLayer: "layout_only",
    });
    expect(workspaceReadPayload.source).toBe("backend_audit");

    const workflowsRead = await request.get("/api/alerts/workflows");
    expect(workflowsRead.status()).toBe(200);
    const workflowsReadPayload = await workflowsRead.json();
    expect(workflowsReadPayload.snapshot.runtime).toMatchObject({
      delivery: "unconfigured",
      automation: "inactive",
      queue: "local_buffer_ready",
      scheduler: "inactive",
      liveExecution: "blocked",
      autoTrading: "blocked",
    });
    expect(workflowsReadPayload.snapshot.runtime.notificationChannels).toMatchObject({
      inApp: "local_unconfigured",
      push: "unconfigured",
      email: "unconfigured",
      webhook: "unconfigured",
    });

    const nextRules = [
      {
        id: "volatility-watch",
        label: "Volatility watch",
        state: "enabled",
        severity: "warning",
        metric: "volatility",
        operator: "gt",
        threshold: 1.2,
        action: "desk_note",
        deliveryMode: "record_only",
        schedule: "market_hours",
        triggerWindowSeconds: 120,
        cooldownSeconds: 90,
        requiresOperatorAck: false,
      },
      {
        id: "drawdown-guard",
        label: "Drawdown guard",
        state: "enabled",
        severity: "critical",
        metric: "session_drawdown",
        operator: "lt",
        threshold: -110,
        action: "review_flag",
        deliveryMode: "operator_queue",
        schedule: "always",
        triggerWindowSeconds: 60,
        cooldownSeconds: 180,
        requiresOperatorAck: true,
      },
    ];

    const workflowsUpdate = await request.post("/api/alerts/workflows", {
      data: {
        rules: nextRules,
      },
    });
    expect(workflowsUpdate.status()).toBe(200);
    const workflowsUpdatePayload = await workflowsUpdate.json();
    expect(workflowsUpdatePayload.snapshot.source).toBe("backend_audit");
    expect(workflowsUpdatePayload.snapshot.rules).toHaveLength(2);
    expect(workflowsUpdatePayload.snapshot.rules[0]).toMatchObject({
      severity: "warning",
      deliveryMode: "record_only",
      schedule: "market_hours",
      triggerWindowSeconds: 120,
      requiresOperatorAck: false,
    });
    expect(workflowsUpdatePayload.snapshot.rules[1]).toMatchObject({
      severity: "critical",
      deliveryMode: "operator_queue",
      schedule: "always",
      triggerWindowSeconds: 60,
      requiresOperatorAck: true,
    });

    const automationState = await request.get("/api/alerts/automation/state");
    expect(automationState.status()).toBe(200);
    const automationStatePayload = await automationState.json();
    expect(automationStatePayload.snapshot.runtime).toMatchObject({
      triggerEngine: "deterministic_local_rules",
      scheduler: "inactive",
      queue: "local_buffer_ready",
      delivery: "unconfigured",
      autoTrading: "blocked",
    });
    expect(automationStatePayload.snapshot.queue).toMatchObject({
      pending: 0,
      processing: 0,
      failed: 0,
    });
    expect(automationStatePayload.snapshot.triggers).toMatchObject({
      enabledRuleCount: 2,
      criticalRuleCount: 1,
      operatorAckRequiredCount: 1,
      scheduleMode: "deterministic_local",
    });

    const deliveryState = await request.get("/api/alerts/delivery/state");
    expect(deliveryState.status()).toBe(200);
    const deliveryStatePayload = await deliveryState.json();
    expect(deliveryStatePayload.snapshot.runtime).toMatchObject({
      activationMode: "operator_guarded",
      executionAuthority: "manual_operator",
      autoTrading: "blocked",
      liveExecution: "blocked",
    });
    expect(deliveryStatePayload.snapshot.triggerAction).toMatchObject({
      enabledRuleCount: 2,
      operatorAckRequiredCount: 1,
    });
    expect(Array.isArray(deliveryStatePayload.snapshot.deliveryState.blockedReasons)).toBe(
      true
    );

    const intelligence = await request.get(
      "/api/intelligence/context?symbol=EUR/USD&timeframe=5m"
    );
    expect(intelligence.status()).toBe(200);
    const intelligencePayload = await intelligence.json();
    expect(intelligencePayload.snapshot).toMatchObject({
      authenticated: true,
      availability: "bounded",
    });
    expect(intelligencePayload.snapshot.workflow.state).toBe("configured_local");
    expect(intelligencePayload.snapshot.execution.liveExecution).toBe("blocked");
    expect(intelligencePayload.snapshot.multiTimeframe.windows).toHaveLength(3);
    expect(intelligencePayload.snapshot.multiTimeframe.structureBias).toMatch(
      /trend_following|range_balanced|mixed_structure/
    );
    expect(intelligencePayload.snapshot.performance.disciplineScore).toBeGreaterThanOrEqual(
      0
    );
    expect(intelligencePayload.snapshot.performance.disciplineScore).toBeLessThanOrEqual(
      100
    );
    expect(intelligencePayload.snapshot.performance.stabilityScore).toBeGreaterThanOrEqual(
      0
    );
    expect(intelligencePayload.snapshot.performance.stabilityScore).toBeLessThanOrEqual(
      100
    );
    expect(intelligencePayload.snapshot.journal.qualitySignal).toMatch(
      /limited|emerging|structured/
    );
    expect(intelligencePayload.snapshot.coaching.mode).toBe("bounded_guidance");
    expect(intelligencePayload.snapshot.coaching.reviewWindowMinutes).toBeGreaterThan(0);
    expect(Array.isArray(intelligencePayload.snapshot.coaching.actions)).toBe(true);
    expect(Array.isArray(intelligencePayload.snapshot.coaching.degradedBoundaries)).toBe(
      true
    );
    expect(Array.isArray(intelligencePayload.snapshot.assist.workspaceActions)).toBe(true);
    expect(intelligencePayload.snapshot.truth.executionAuthority).toBe(
      "operator_manual"
    );
    expect(intelligencePayload.snapshot.truth).toMatchObject({
      modelScope: "deterministic_context",
      predictiveGuarantee: "none",
      winRateClaim: "none",
      liveExecution: "blocked",
    });
  });

  test("keeps real-money execution blocked when real mode is selected", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator("main").first()).toBeVisible();

    await page.getByRole("button", { name: "Real" }).first().click();

    await expect(page.locator("body")).toContainText("Real");
    await expect(page.locator("body")).toContainText(
      "Order entry stays visible, but execution remains disabled"
    );
    await expect(page.getByRole("button", { name: "Open paper buy" }).first())
      .toBeDisabled();
    await expect(page.getByRole("button", { name: "Open paper sell" }).first())
      .toBeDisabled();
  });
});
