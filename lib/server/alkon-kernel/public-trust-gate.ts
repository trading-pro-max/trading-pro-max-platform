import type { PublicTrustGate } from "./types";

type PublicTrustInput = {
  publicAlkonLeak?: boolean;
  fakeClaims?: boolean;
  fakeDownloads?: boolean;
  tradingSignals?: boolean;
  profitPromise?: boolean;
};

export function getPublicTrustGate(input: PublicTrustInput = {}): PublicTrustGate {
  const trustIssues = [
    input.publicAlkonLeak ? "public Alkon or Founder Command leak" : "",
    input.fakeClaims ? "fake #1, global, regulated, certified, user, revenue, or partnership claim" : "",
    input.fakeDownloads ? "fake app availability or download claim" : "",
    input.tradingSignals ? "trading signals presented to users" : "",
    input.profitPromise ? "profit, win-rate, or guaranteed outcome promise" : "",
  ].filter(Boolean);

  return {
    publicTrustStatus: trustIssues.length > 0 ? "blocked" : "pass_with_notes",
    trustIssues,
    safeFix:
      trustIssues.length > 0
        ? "Remove the public trust issue and replace it with public-safe readiness language."
        : "Keep public surfaces clear, truthful, paper-safe, and free of internal doctrine.",
    publicAlkonLeakBlocked: true,
  };
}
