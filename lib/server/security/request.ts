import "server-only";
import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_JSON_BODY_LIMIT_BYTES = 16 * 1024;
const TRUST_PROXY_HEADERS = "true";

export type RequestContext = {
  userAgent: string | null;
  ipAddress: string | null;
};

type ReadTextResult =
  | {
      ok: true;
      text: string;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export type JsonBodyResult<TBody> =
  | {
      ok: true;
      body: TBody;
    }
  | {
      ok: false;
      response: NextResponse;
    };

function withNoStoreHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set("Cache-Control", "no-store");

  return nextHeaders;
}

export function noStoreJson(
  body: object,
  status = 200,
  headers?: HeadersInit
) {
  return NextResponse.json(body, {
    status,
    headers: withNoStoreHeaders(headers),
  });
}

export function normalizeClientText(
  value: unknown,
  maxLength = 256
): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.replace(/[\r\n\t]/g, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function shouldTrustProxyHeaders() {
  return process.env.TPM_TRUST_PROXY_HEADERS === TRUST_PROXY_HEADERS;
}

function getFirstHeaderValue(value: string | null) {
  return normalizeClientText(value?.split(",")[0], 512);
}

export function getRequestIp(request: NextRequest) {
  if (!shouldTrustProxyHeaders()) return null;

  return (
    getFirstHeaderValue(request.headers.get("x-forwarded-for")) ??
    normalizeClientText(request.headers.get("x-real-ip"), 128)
  );
}

export function getRequestContext(request: NextRequest): RequestContext {
  return {
    userAgent: normalizeClientText(request.headers.get("user-agent"), 512),
    ipAddress: getRequestIp(request),
  };
}

export function getRequestRateLimitIdentity(
  request: NextRequest,
  fallback = "anonymous"
) {
  return getRequestIp(request) ?? fallback;
}

function getRequestHost(request: NextRequest) {
  if (shouldTrustProxyHeaders()) {
    const forwardedHost = getFirstHeaderValue(
      request.headers.get("x-forwarded-host")
    );
    if (forwardedHost) return forwardedHost.toLowerCase();
  }

  return normalizeClientText(request.headers.get("host"), 256)?.toLowerCase() ?? null;
}

export function rejectCrossOriginMutation(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const host = getRequestHost(request);
  if (!host) {
    return noStoreJson({ ok: false, error: "Request host is required." }, 400);
  }

  try {
    const originHost = new URL(origin).host.toLowerCase();
    if (originHost === host) return null;
  } catch {
    return noStoreJson({ ok: false, error: "Invalid request origin." }, 400);
  }

  return noStoreJson({ ok: false, error: "Cross-origin mutation blocked." }, 403);
}

function parseContentLength(request: NextRequest) {
  const rawContentLength = request.headers.get("content-length");
  if (!rawContentLength) return null;

  const contentLength = Number(rawContentLength);
  if (
    !Number.isSafeInteger(contentLength) ||
    contentLength < 0
  ) {
    return Number.NaN;
  }

  return contentLength;
}

function isJsonContentType(contentType: string | null) {
  if (!contentType) return false;

  const mediaType = contentType.split(";")[0]?.trim().toLowerCase();
  return mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"));
}

async function readRequestTextWithLimit(
  request: NextRequest,
  maxBytes: number
): Promise<ReadTextResult> {
  const contentLength = parseContentLength(request);
  if (Number.isNaN(contentLength)) {
    return {
      ok: false,
      status: 400,
      error: "Invalid content length.",
    };
  }

  if (contentLength !== null && contentLength > maxBytes) {
    return {
      ok: false,
      status: 413,
      error: "Request body is too large.",
    };
  }

  if (!request.body) {
    return {
      ok: true,
      text: "",
    };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return {
        ok: false,
        status: 413,
        error: "Request body is too large.",
      };
    }

    chunks.push(value);
  }

  const buffer = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    ok: true,
    text: new TextDecoder().decode(buffer),
  };
}

export async function readJsonBody<TBody>(
  request: NextRequest,
  options: {
    maxBytes?: number;
    requireObject?: boolean;
  } = {}
): Promise<JsonBodyResult<TBody>> {
  const maxBytes = options.maxBytes ?? DEFAULT_JSON_BODY_LIMIT_BYTES;
  const requireObject = options.requireObject ?? true;

  if (!isJsonContentType(request.headers.get("content-type"))) {
    return {
      ok: false,
      response: noStoreJson(
        { ok: false, error: "Content-Type must be application/json." },
        415
      ),
    };
  }

  const textResult = await readRequestTextWithLimit(request, maxBytes);
  if (!textResult.ok) {
    return {
      ok: false,
      response: noStoreJson(
        { ok: false, error: textResult.error },
        textResult.status
      ),
    };
  }

  if (!textResult.text.trim()) {
    return {
      ok: false,
      response: noStoreJson(
        { ok: false, error: "Request body is required." },
        400
      ),
    };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(textResult.text);
  } catch {
    return {
      ok: false,
      response: noStoreJson(
        { ok: false, error: "Request body must be valid JSON." },
        400
      ),
    };
  }

  if (
    requireObject &&
    (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
  ) {
    return {
      ok: false,
      response: noStoreJson(
        { ok: false, error: "Request body must be a JSON object." },
        400
      ),
    };
  }

  return {
    ok: true,
    body: parsed as TBody,
  };
}

export function trustedProxyHeadersEnabled() {
  return shouldTrustProxyHeaders();
}
