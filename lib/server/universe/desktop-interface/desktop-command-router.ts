import "server-only";

import { explainAlKawnDesktopBoundary } from "./desktop-boundary-explainer";
import { getAlKawnDesktopResponseForIntent } from "./desktop-chat-responses";

export function getAlKawnDesktopCommandResult(intent: string) {
  return {
    intent,
    response: getAlKawnDesktopResponseForIntent(intent),
    boundary: explainAlKawnDesktopBoundary(intent),
    executed: !/(legal|money|payment|broker|public|secret|real_trading|brand|domain)/.test(intent),
  };
}
