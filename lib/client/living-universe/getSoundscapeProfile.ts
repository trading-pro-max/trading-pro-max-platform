import type { SoundscapeProfile, UniverseMood } from "./types";

export function getSoundscapeProfile(mood: UniverseMood): SoundscapeProfile {
  const profiles: Record<UniverseMood["soundscapeMood"], SoundscapeProfile> = {
    quiet_dawn: {
      mood: "quiet_dawn",
      baseFrequency: 72,
      pulseFrequency: 108,
      atmosphereFrequency: 220,
      volume: 0.035,
      label: "Quiet dawn hum",
      activation: "user_controlled_only",
      source: "web_audio_generated_locally",
    },
    clear_day: {
      mood: "clear_day",
      baseFrequency: 86,
      pulseFrequency: 132,
      atmosphereFrequency: 260,
      volume: 0.03,
      label: "Clear day atmosphere",
      activation: "user_controlled_only",
      source: "web_audio_generated_locally",
    },
    amber_sunset: {
      mood: "amber_sunset",
      baseFrequency: 64,
      pulseFrequency: 96,
      atmosphereFrequency: 196,
      volume: 0.034,
      label: "Amber sunset pulse",
      activation: "user_controlled_only",
      source: "web_audio_generated_locally",
    },
    deep_cosmic: {
      mood: "deep_cosmic",
      baseFrequency: 52,
      pulseFrequency: 78,
      atmosphereFrequency: 144,
      volume: 0.028,
      label: "Deep cosmic low hum",
      activation: "user_controlled_only",
      source: "web_audio_generated_locally",
    },
  };

  return profiles[mood.soundscapeMood];
}
