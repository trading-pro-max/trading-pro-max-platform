import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const PASSWORD_ALGORITHM = "scrypt";
const PASSWORD_VERSION = "v1";
const SALT_BYTES = 16;
const KEY_LENGTH = 64;

export type PasswordHashResult = {
  algorithm: typeof PASSWORD_ALGORITHM;
  version: typeof PASSWORD_VERSION;
  encoded: string;
};

export async function hashPassword(password: string): Promise<PasswordHashResult> {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const encoded = [
    PASSWORD_ALGORITHM,
    PASSWORD_VERSION,
    KEY_LENGTH,
    salt,
    derivedKey.toString("hex"),
  ].join(":");

  return {
    algorithm: PASSWORD_ALGORITHM,
    version: PASSWORD_VERSION,
    encoded,
  };
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [algorithm, version, keyLengthValue, salt, expectedHex] =
    storedHash.split(":");

  if (
    algorithm !== PASSWORD_ALGORITHM ||
    version !== PASSWORD_VERSION ||
    !salt ||
    !expectedHex
  ) {
    return false;
  }

  const keyLength = Number(keyLengthValue);
  if (!Number.isInteger(keyLength) || keyLength <= 0) return false;

  const expected = Buffer.from(expectedHex, "hex");
  if (expected.length !== keyLength) return false;

  const actual = (await scrypt(password, salt, keyLength)) as Buffer;
  if (actual.length !== expected.length) return false;

  return timingSafeEqual(actual, expected);
}
