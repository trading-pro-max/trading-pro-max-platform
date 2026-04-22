import "server-only";
import type {
  AccountLifecycleState,
  AccountMode,
} from "../../modules/shell/types/platform-state";
import { prisma } from "../db/client";
import {
  hashAuditIdentifier,
  recordAuthAuditEvent,
  type AuthAuditMetadata,
} from "./audit";
import { verifyPassword } from "./password";
import {
  createSessionExpiry,
  createSessionToken,
  hashSessionToken,
  isSessionTokenShape,
} from "./session-token";

const DEMO_ACCOUNT_MODE = "demo" satisfies AccountMode;
const DEFAULT_ACCOUNT_LIFECYCLE_STATE =
  "onboarding" satisfies AccountLifecycleState;
const DEFAULT_ACCOUNT_REGION = "Global";
const SESSION_TTL_HOURS = 24;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 512;

const ACCOUNT_LIFECYCLE_STATES: readonly AccountLifecycleState[] = [
  "visitor",
  "onboarding",
  "disclosures_pending",
  "kyc_pending",
  "review_pending",
  "paper_active",
  "restricted",
  "blocked",
];

type AuthContext = {
  userAgent?: string | null;
  ipAddress?: string | null;
};

export type LoginInput = AuthContext & {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  role: AuthUserRole;
};

export type AuthUserRole = "owner" | "operator";

export type AuthAccount = {
  id: string;
  userId: string;
  mode: typeof DEMO_ACCOUNT_MODE;
  lifecycleState: AccountLifecycleState;
  region: string;
};

export type AuthSession = {
  id: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

export type AuthenticatedSession = {
  user: AuthUser;
  account: AuthAccount;
  session: AuthSession;
};

export type LoginResult =
  | (AuthenticatedSession & {
      ok: true;
      sessionToken: string;
    })
  | {
      ok: false;
      reason: "invalid_credentials";
    };

export type LogoutResult = {
  ok: true;
  invalidated: boolean;
};

type DbUser = {
  id: string;
  email: string;
  displayName: string;
  role: string;
};

type DbAccount = {
  id: string;
  userId: string;
  mode: string;
  lifecycleState: string;
  region: string;
};

type DbSession = {
  id: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isLoginInputAllowed(email: string, password: string) {
  return (
    email.length > 0 &&
    email.length <= MAX_EMAIL_LENGTH &&
    email.includes("@") &&
    password.length > 0 &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}

function normalizeOptionalHeader(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 512) : null;
}

function isAccountLifecycleState(value: string): value is AccountLifecycleState {
  return ACCOUNT_LIFECYCLE_STATES.includes(value as AccountLifecycleState);
}

function isAuthUserRole(value: string): value is AuthUserRole {
  return value === "owner" || value === "operator";
}

function toAuthUser(user: DbUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: isAuthUserRole(user.role) ? user.role : "owner",
  };
}

function toAuthAccount(account: DbAccount): AuthAccount {
  return {
    id: account.id,
    userId: account.userId,
    mode: DEMO_ACCOUNT_MODE,
    lifecycleState: isAccountLifecycleState(account.lifecycleState)
      ? account.lifecycleState
      : DEFAULT_ACCOUNT_LIFECYCLE_STATE,
    region: account.region,
  };
}

function toAuthSession(session: DbSession): AuthSession {
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    revokedAt: session.revokedAt,
  };
}

async function ensureDemoAccount(userId: string) {
  const account = await findDemoAccount(userId);
  if (account) return account;

  try {
    return await prisma.account.create({
      data: {
        userId,
        mode: DEMO_ACCOUNT_MODE,
        lifecycleState: DEFAULT_ACCOUNT_LIFECYCLE_STATE,
        region: DEFAULT_ACCOUNT_REGION,
      },
    });
  } catch (error) {
    const accountCreatedConcurrently = await findDemoAccount(userId);
    if (accountCreatedConcurrently) return accountCreatedConcurrently;

    throw error;
  }
}

async function findDemoAccount(userId: string) {
  return prisma.account.findUnique({
    where: {
      userId_mode: {
        userId,
        mode: DEMO_ACCOUNT_MODE,
      },
    },
  });
}

async function createInitialSession(userId: string, input: AuthContext) {
  const sessionToken = createSessionToken();
  const tokenHash = hashSessionToken(sessionToken);
  const expiresAt = createSessionExpiry(new Date(), SESSION_TTL_HOURS);
  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      userAgent: normalizeOptionalHeader(input.userAgent),
      ipAddress: normalizeOptionalHeader(input.ipAddress),
      expiresAt,
    },
  });

  return {
    sessionToken,
    session,
    expiresAt,
  };
}

function sessionAuditMetadata(
  sessionId: string,
  metadata?: AuthAuditMetadata
): AuthAuditMetadata {
  return {
    sessionId,
    ...(metadata ?? {}),
  };
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const email = normalizeEmail(input.email);
  if (!isLoginInputAllowed(email, input.password)) {
    await recordAuthAuditEvent({
      action: "login_failure",
      message: "Login failed.",
      metadata: {
        reason: "invalid_credentials",
        emailHash: hashAuditIdentifier(email.slice(0, MAX_EMAIL_LENGTH)),
        ipAddressPresent: Boolean(input.ipAddress),
        userAgentPresent: Boolean(input.userAgent),
      },
    });

    return { ok: false, reason: "invalid_credentials" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    await recordAuthAuditEvent({
      action: "login_failure",
      message: "Login failed.",
      metadata: {
        reason: "invalid_credentials",
        emailHash: hashAuditIdentifier(email),
        ipAddressPresent: Boolean(input.ipAddress),
        userAgentPresent: Boolean(input.userAgent),
      },
    });

    return { ok: false, reason: "invalid_credentials" };
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    const account = await findDemoAccount(user.id);

    await recordAuthAuditEvent({
      action: "login_failure",
      userId: user.id,
      accountId: account?.id,
      message: "Login failed.",
      metadata: {
        reason: "invalid_credentials",
        emailHash: hashAuditIdentifier(email),
        ipAddressPresent: Boolean(input.ipAddress),
        userAgentPresent: Boolean(input.userAgent),
      },
    });

    return { ok: false, reason: "invalid_credentials" };
  }

  const account = await ensureDemoAccount(user.id);
  const { sessionToken, session, expiresAt } = await createInitialSession(
    user.id,
    input
  );

  await recordAuthAuditEvent({
    action: "login_success",
    userId: user.id,
    accountId: account.id,
    message: "Login succeeded.",
    metadata: sessionAuditMetadata(session.id, {
      expiresAt: expiresAt.toISOString(),
      ipAddressPresent: Boolean(input.ipAddress),
      userAgentPresent: Boolean(input.userAgent),
    }),
  });

  return {
    ok: true,
    sessionToken,
    user: toAuthUser(user),
    account: toAuthAccount(account),
    session: toAuthSession(session),
  };
}

export async function validateSession(
  sessionToken: string | null | undefined,
  context: AuthContext = {}
): Promise<AuthenticatedSession | null> {
  if (!sessionToken) return null;

  if (!isSessionTokenShape(sessionToken)) {
    await recordAuthAuditEvent({
      action: "session_invalid",
      message: "Session validation failed.",
      metadata: {
        reason: "malformed",
        ipAddressPresent: Boolean(context.ipAddress),
        userAgentPresent: Boolean(context.userAgent),
      },
    });

    return null;
  }

  const tokenHash = hashSessionToken(sessionToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          accounts: {
            where: { mode: DEMO_ACCOUNT_MODE },
            take: 1,
          },
        },
      },
    },
  });

  if (!session) {
    await recordAuthAuditEvent({
      action: "session_invalid",
      message: "Session validation failed.",
      metadata: {
        reason: "not_found",
        ipAddressPresent: Boolean(context.ipAddress),
        userAgentPresent: Boolean(context.userAgent),
      },
    });

    return null;
  }

  const auditAccount = session.user.accounts[0] ?? null;

  if (session.revokedAt) {
    await recordAuthAuditEvent({
      action: "session_invalid",
      userId: session.userId,
      accountId: auditAccount?.id,
      message: "Session validation failed.",
      metadata: sessionAuditMetadata(session.id, {
        reason: "revoked",
        revokedAt: session.revokedAt.toISOString(),
        ipAddressPresent: Boolean(context.ipAddress),
        userAgentPresent: Boolean(context.userAgent),
      }),
    });

    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    await recordAuthAuditEvent({
      action: "session_expired",
      userId: session.userId,
      accountId: auditAccount?.id,
      message: "Session expired.",
      metadata: sessionAuditMetadata(session.id, {
        expiredAt: session.expiresAt.toISOString(),
        ipAddressPresent: Boolean(context.ipAddress),
        userAgentPresent: Boolean(context.userAgent),
      }),
    });

    return null;
  }

  const account = auditAccount ?? (await ensureDemoAccount(session.userId));

  return {
    user: toAuthUser(session.user),
    account: toAuthAccount(account),
    session: toAuthSession(session),
  };
}

export async function logout(
  sessionToken: string | null | undefined,
  context: AuthContext = {}
): Promise<LogoutResult> {
  if (!sessionToken) return { ok: true, invalidated: false };

  if (!isSessionTokenShape(sessionToken)) {
    await recordAuthAuditEvent({
      action: "session_invalid",
      message: "Logout session lookup failed.",
      metadata: {
        reason: "malformed",
        ipAddressPresent: Boolean(context.ipAddress),
        userAgentPresent: Boolean(context.userAgent),
      },
    });

    return { ok: true, invalidated: false };
  }

  const tokenHash = hashSessionToken(sessionToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          accounts: {
            where: { mode: DEMO_ACCOUNT_MODE },
            take: 1,
          },
        },
      },
    },
  });

  if (!session) {
    await recordAuthAuditEvent({
      action: "session_invalid",
      message: "Logout session lookup failed.",
      metadata: {
        reason: "not_found",
        ipAddressPresent: Boolean(context.ipAddress),
        userAgentPresent: Boolean(context.userAgent),
      },
    });

    return { ok: true, invalidated: false };
  }

  if (!session.revokedAt) {
    await prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
  }

  const account = session.user.accounts[0] ?? null;

  await recordAuthAuditEvent({
    action: "logout",
    userId: session.userId,
    accountId: account?.id,
    message: "Logout completed.",
    metadata: sessionAuditMetadata(session.id, {
      alreadyRevoked: Boolean(session.revokedAt),
      ipAddressPresent: Boolean(context.ipAddress),
      userAgentPresent: Boolean(context.userAgent),
    }),
  });

  return { ok: true, invalidated: true };
}

export async function getCurrentUserSession(
  sessionToken: string | null | undefined,
  context: AuthContext = {}
): Promise<AuthenticatedSession | null> {
  const authenticatedSession = await validateSession(sessionToken, context);

  if (!authenticatedSession) return null;

  await recordAuthAuditEvent({
    action: "me_access",
    userId: authenticatedSession.user.id,
    accountId: authenticatedSession.account.id,
    message: "Authenticated session accessed.",
    metadata: sessionAuditMetadata(authenticatedSession.session.id, {
      complianceRelevant: true,
      ipAddressPresent: Boolean(context.ipAddress),
      userAgentPresent: Boolean(context.userAgent),
    }),
  });

  return authenticatedSession;
}
