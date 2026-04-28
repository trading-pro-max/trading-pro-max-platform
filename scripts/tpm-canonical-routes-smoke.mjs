import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const HOST = process.env.TPM_CANONICAL_HOST || "127.0.0.1";
const REQUEST_TIMEOUT_MS = Number(process.env.TPM_CANONICAL_TIMEOUT_MS || 90_000);
const READY_TIMEOUT_MS = Number(
  process.env.TPM_CANONICAL_READY_TIMEOUT_MS || 120_000
);
const START_PORT = Number(process.env.TPM_CANONICAL_PORT || 3410);
const MAX_PORT_SCAN = Number(process.env.TPM_CANONICAL_PORT_SCAN || 20);
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");

export const CANONICAL_UI_ROUTES = [
  "/",
  "/trading",
  "/en",
  "/en/settings",
  "/diagnostics",
];

export const CANONICAL_API_ROUTES = [
  "/api/health",
  "/api/market?symbol=EUR/USD&timeframe=1m",
  "/api/market/feed-state",
  "/api/broker/state",
];

function assertLocalRuntime() {
  if (!fs.existsSync(NEXT_BIN)) {
    console.error(
      "Next runtime was not found. Run `npm install` before running the canonical smoke harness."
    );
    process.exit(1);
  }
}

function rememberLog(buffer, chunk) {
  const lines = String(chunk)
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  buffer.push(...lines);
  if (buffer.length > 180) {
    buffer.splice(0, buffer.length - 180);
  }
}

function buildLogTail(logs, count = 24) {
  return logs.length ? `\n\nLast server lines:\n${logs.slice(-count).join("\n")}` : "";
}

function parseExistingServerUrl(logs) {
  const joined = logs.join("\n");
  const markerMatch = joined.match(/Another\s+(?:Next\.js|next)\s+dev\s+server\s+is\s+already\s+running/i);
  if (!markerMatch || markerMatch.index === undefined) return null;

  const existingServerSection = joined.slice(markerMatch.index);
  const match = existingServerSection.match(/https?:\/\/(?:localhost|127\.0\.0\.1):\d+/i);
  return match ? match[0].replace("localhost", HOST) : null;
}

function stopProcessTree(pid) {
  if (!pid) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }

  try {
    process.kill(pid, "SIGTERM");
  } catch {}
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen(port, HOST, () => {
      server.close(() => resolve(true));
    });
  });
}

async function pickPort() {
  for (let offset = 0; offset < MAX_PORT_SCAN; offset += 1) {
    const port = START_PORT + offset;
    if (await isPortAvailable(port)) return port;
  }

  throw new Error(
    `No open local port was found in the scan range starting at ${START_PORT}.`
  );
}

async function fetchStatus(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
    await response.arrayBuffer();
    return response.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForServer(baseUrl, child, logs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < READY_TIMEOUT_MS) {
    if (child.exitCode !== null && child.exitCode !== 0) {
      await delay(250);

      const existingServerUrl = parseExistingServerUrl(logs);
      if (existingServerUrl) {
        const status = await fetchStatus(`${existingServerUrl}/`, 5000);
        if (status > 0) {
          return {
            baseUrl: existingServerUrl,
            reusedExistingServer: true,
          };
        }
      }

      throw new Error(
        `Canonical smoke harness could not start the local Next dev server.${buildLogTail(logs)}`
      );
    }

    const status = await fetchStatus(`${baseUrl}/`, 2500);
    if (status > 0) {
      return {
        baseUrl,
        reusedExistingServer: false,
      };
    }
    await delay(1000);
  }

  throw new Error(
    `Canonical smoke harness timed out waiting for ${baseUrl}.${buildLogTail(logs)}`
  );
}

function buildRoutes(includeApiRoutes) {
  return includeApiRoutes
    ? [...CANONICAL_UI_ROUTES, ...CANONICAL_API_ROUTES]
    : [...CANONICAL_UI_ROUTES];
}

export async function runCanonicalRouteSmoke({
  includeApiRoutes = false,
  summaryOnly = false,
} = {}) {
  assertLocalRuntime();

  const port = await pickPort();
  const baseUrl = `http://${HOST}:${port}`;
  const serverLogs = [];
  const nextProcess = spawn(
    process.execPath,
    [NEXT_BIN, "dev", "--hostname", HOST, "--port", String(port)],
    {
      cwd: ROOT,
      env: {
        ...process.env,
        PORT: String(port),
        HOSTNAME: HOST,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  let ownsServer = true;

  if (nextProcess.stdout) {
    nextProcess.stdout.on("data", (chunk) => rememberLog(serverLogs, chunk));
  }
  if (nextProcess.stderr) {
    nextProcess.stderr.on("data", (chunk) => rememberLog(serverLogs, chunk));
  }

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    if (ownsServer) {
      stopProcessTree(nextProcess.pid);
    }
  };

  process.on("SIGINT", () => {
    shutdown();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    shutdown();
    process.exit(143);
  });

  try {
    if (!summaryOnly) {
      console.log(`Starting canonical smoke harness at ${baseUrl}`);
    }

    const server = await waitForServer(baseUrl, nextProcess, serverLogs);
    const activeBaseUrl = server.baseUrl;
    ownsServer = !server.reusedExistingServer;

    if (!summaryOnly && server.reusedExistingServer) {
      console.log(`Reusing existing local Trading Pro Max dev server at ${activeBaseUrl}`);
    }

    const routes = buildRoutes(includeApiRoutes);
    const results = [];
    for (const route of routes) {
      const status = await fetchStatus(
        `${activeBaseUrl}${route}`,
        REQUEST_TIMEOUT_MS
      );
      const ok = status === 200;
      results.push({ route, status, ok });
      if (!summaryOnly) {
        console.log(`${ok ? "PASS" : "FAIL"} ${route} ${status || "no-response"}`);
      }
    }

    const failures = results.filter((result) => !result.ok);
    if (failures.length) {
      if (!summaryOnly) {
        console.error("\nCanonical route smoke failed.");
        failures.forEach((failure) => {
          console.error(`- ${failure.route}: ${failure.status || "no-response"}`);
        });
        if (serverLogs.length) {
          console.error("\nLast server lines:");
          serverLogs.slice(-30).forEach((line) => console.error(line));
        }
      }

      return {
        ok: false,
        baseUrl: activeBaseUrl,
        checkedRouteCount: results.length,
        failures,
      };
    }

    if (!summaryOnly) {
      console.log(
        `\nCanonical route smoke passed (${results.length}/${results.length}) against ${activeBaseUrl}`
      );
    }

    return {
      ok: true,
      baseUrl: activeBaseUrl,
      checkedRouteCount: results.length,
      failures: [],
    };
  } finally {
    shutdown();
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
const isDirectRun = invokedPath
  ? import.meta.url === pathToFileURL(invokedPath).href
  : false;

if (isDirectRun) {
  const args = new Set(process.argv.slice(2));
  const result = await runCanonicalRouteSmoke({
    includeApiRoutes: args.has("--with-api"),
    summaryOnly: args.has("--summary-only"),
  });

  if (args.has("--summary-only")) {
    console.log(
      `canonical smoke: ${result.ok ? "PASS" : "FAIL"} | routes=${result.checkedRouteCount}`
    );
  }

  if (!result.ok) {
    process.exitCode = 1;
  }
}
