export type CommunityRoomReadiness = {
  id: string;
  label: string;
  planLayer: "Free" | "Pro" | "VIP" | "Institutional";
  state: "planned" | "blocked" | "future";
  safetyRule: string;
};
