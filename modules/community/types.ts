export type CommunityRoomReadiness = {
  id: string;
  label: string;
  planLayer: "free_demo" | "pro" | "vip" | "enterprise";
  state: "planned" | "blocked" | "future";
  safetyRule: string;
};
