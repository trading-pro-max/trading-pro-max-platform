import "server-only";

import type {
  WorldInterfaceChannel,
  WorldInterfaceChannelCategory,
  WorldInterfaceChannelState,
} from "./types";

export const worldInterfaceChannelStates: WorldInterfaceChannelState[] = [
  "not_configured",
  "planned",
  "read_only_future",
  "draft_only",
  "approval_required",
  "publishing_enabled_later",
  "disabled",
  "blocked",
  "compromised",
  "rotation_required",
];

const universalBlocks = [
  "connect account",
  "store token",
  "send externally",
  "publish externally",
  "automate outreach",
  "fake metrics",
  "request secrets",
];

function channel(
  category: WorldInterfaceChannelCategory,
  label: string,
  state: WorldInterfaceChannelState,
  owner: string,
  requiredReviews: string[],
  safeNextAction: string
): WorldInterfaceChannel {
  return {
    id: `world-channel-${category}`,
    category,
    label,
    state,
    connected: false,
    tokenStored: false,
    sendingEnabled: false,
    publishingEnabled: false,
    readOnlyFuture: state === "read_only_future",
    draftOnly: state === "draft_only" || state === "approval_required",
    owner,
    requiredReviews,
    blockedActions: universalBlocks,
    safeNextAction,
  };
}

export const worldInterfaceChannels: WorldInterfaceChannel[] = [
  channel("email", "Email", "draft_only", "Support/Ops", ["Guardian", "Legal"], "Draft acknowledgements only; do not connect real inboxes."),
  channel("support", "Support", "draft_only", "Support/Ops", ["Guardian", "Quality"], "Classify support requests and draft safe replies."),
  channel("partners", "Partners", "approval_required", "Partnerships", ["Legal", "Guardian", "Founder"], "Classify opportunities and require Founder approval."),
  channel("media", "Media", "approval_required", "Media", ["Legal", "Guardian", "Founder"], "Draft media responses for review only."),
  channel("legal", "Legal", "approval_required", "Legal", ["Legal", "Founder"], "Route legal notices to review; no automated reply."),
  channel("security", "Security", "approval_required", "Security", ["Security", "Guardian", "Founder"], "Route security alerts to quarantine or incident readiness."),
  channel("vip", "VIP", "draft_only", "Growth", ["Guardian", "Founder"], "Classify VIP interest without claiming activation."),
  channel("institutional", "Institutional", "draft_only", "Institutional", ["Legal", "Founder"], "Classify institutional interest as future readiness."),
  channel("x_twitter", "X/Twitter", "disabled", "Media", ["Legal", "Guardian", "Founder"], "Keep account unconnected and publishing disabled."),
  channel("instagram", "Instagram", "disabled", "Media", ["Legal", "Guardian", "Founder"], "Keep account unconnected and publishing disabled."),
  channel("tiktok", "TikTok", "disabled", "Media", ["Legal", "Guardian", "Founder"], "Keep account unconnected and publishing disabled."),
  channel("youtube", "YouTube", "disabled", "Media", ["Legal", "Guardian", "Founder"], "Keep account unconnected and publishing disabled."),
  channel("linkedin", "LinkedIn", "disabled", "Media", ["Legal", "Guardian", "Founder"], "Keep account unconnected and publishing disabled."),
  channel("facebook", "Facebook", "disabled", "Media", ["Legal", "Guardian", "Founder"], "Keep account unconnected and publishing disabled."),
  channel("telegram", "Telegram", "disabled", "Community", ["Guardian", "Security"], "Keep channel unconnected until community moderation exists."),
  channel("discord", "Discord", "disabled", "Community", ["Guardian", "Security"], "Keep channel unconnected until community moderation exists."),
  channel("reddit", "Reddit", "disabled", "Community", ["Guardian", "Legal"], "Keep channel unconnected and monitor only by future policy."),
  channel("blog_newsroom", "Blog/Newsroom", "planned", "Media", ["Legal", "Quality"], "Prepare reviewed draft content only."),
];

export function getWorldInterfaceChannels() {
  return worldInterfaceChannels;
}
