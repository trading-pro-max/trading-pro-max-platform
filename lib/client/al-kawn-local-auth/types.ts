export type AlKawnLocalAuthMode = "pin" | "passphrase";

export type AlKawnLocalAuthRecord = {
  version: 1;
  mode: AlKawnLocalAuthMode;
  algorithm: "PBKDF2-SHA-256";
  iterations: number;
  salt: string;
  verifier: string;
  createdAt: string;
  updatedAt: string;
  sessionTimeoutMs: number;
};

export type AlKawnLocalAuthSession = {
  version: 1;
  unlockedAt: number;
  expiresAt: number;
};

export type AlKawnLocalAuthAvailability = {
  available: boolean;
  reason: string;
};
