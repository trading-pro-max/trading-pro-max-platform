export type DeviceTimePhase =
  | "dawn"
  | "morning"
  | "day"
  | "sunset"
  | "night"
  | "deep_night";

export type SeasonPhase = "spring" | "summer" | "autumn" | "winter";

export type UniverseAssetMode = "local_procedural";

export type MotionPreference = "normal" | "reduced_safe";

export type DeviceTimeReality = {
  hour: number;
  minute: number;
  phase: DeviceTimePhase;
  label: string;
  simulationNotice: "Device-time simulation only";
  weatherNotice: "Weather not connected";
};

export type SeasonReality = {
  month: number;
  season: SeasonPhase;
  label: string;
  simulationNotice: "Device-date simulation only";
};

export type UniverseMood = {
  time: DeviceTimeReality;
  season: SeasonReality;
  visualIntensity: number;
  starVisibility: number;
  atmosphereStrength: number;
  earthLightAngle: number;
  cloudOpacity: number;
  nightLightsOpacity: number;
  orbitSpeedSeconds: number;
  particleDensity: number;
  backgroundDepth: number;
  horizonGlow: number;
  motionIntensity: number;
  productTruthOverlayPriority: "always_visible";
  soundscapeMood: "quiet_dawn" | "clear_day" | "amber_sunset" | "deep_cosmic";
  sourceLabels: {
    deviceTime: "Local device time controls the living Universe";
    season: "Season is based on device date";
    soundscape: "Soundscape is user controlled and off by default";
    weather: "Weather not connected";
  };
};

export type UniverseAssetSet = {
  mode: UniverseAssetMode;
  earthBase: string;
  cloudLayer: string;
  nightLights: string;
  atmosphereGlow: string;
  starField: string;
  swissPrecisionGrid: string;
  orbitalRing: string;
  dataNode: string;
  phaseOverlay: string;
  seasonOverlay: string;
};

export type SoundscapeProfile = {
  mood: UniverseMood["soundscapeMood"];
  baseFrequency: number;
  pulseFrequency: number;
  atmosphereFrequency: number;
  volume: number;
  label: string;
  activation: "user_controlled_only";
  source: "web_audio_generated_locally";
};
