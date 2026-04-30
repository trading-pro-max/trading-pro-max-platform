import type { AlKawnLocalAuthAvailability } from "./types";

export const AL_KAWN_LOCAL_AUTH_ITERATIONS = 210_000;
export const AL_KAWN_LOCAL_AUTH_SALT_BYTES = 16;
export const AL_KAWN_LOCAL_AUTH_KEY_BITS = 256;

function getCrypto(): Crypto | undefined {
  return globalThis.crypto;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export function getWebCryptoAvailability(): AlKawnLocalAuthAvailability {
  const crypto = getCrypto();
  if (!crypto?.subtle || !crypto.getRandomValues) {
    return {
      available: false,
      reason: "Web Crypto is unavailable in this browser context.",
    };
  }

  return {
    available: true,
    reason: "Web Crypto is available for local PBKDF2 verification.",
  };
}

export function createLocalAuthSalt(): string {
  const crypto = getCrypto();
  if (!crypto?.getRandomValues) {
    throw new Error("Web Crypto random values are unavailable.");
  }

  const salt = new Uint8Array(AL_KAWN_LOCAL_AUTH_SALT_BYTES);
  crypto.getRandomValues(salt);
  return bytesToBase64(salt);
}

export async function deriveLocalAuthVerifier(secret: string, saltBase64: string): Promise<string> {
  const crypto = getCrypto();
  if (!crypto?.subtle) {
    throw new Error("Web Crypto PBKDF2 is unavailable.");
  }

  const encoder = new TextEncoder();
  const secretBytes = encoder.encode(secret);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(secretBytes),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: toArrayBuffer(base64ToBytes(saltBase64)),
      iterations: AL_KAWN_LOCAL_AUTH_ITERATIONS,
    },
    keyMaterial,
    AL_KAWN_LOCAL_AUTH_KEY_BITS,
  );

  return bytesToBase64(new Uint8Array(derivedBits));
}

export function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let diff = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);

  for (let index = 0; index < length; index += 1) {
    diff |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return diff === 0;
}
