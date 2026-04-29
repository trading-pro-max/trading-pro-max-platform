import type { SoundscapeProfile } from "./types";

export type ActiveSoundscape = {
  stop: () => void;
  setMuted: (muted: boolean) => void;
};

type OscillatorSet = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

function createTone(
  context: AudioContext,
  frequency: number,
  volume: number,
  type: OscillatorType
): OscillatorSet {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();

  return { oscillator, gain };
}

export async function startGeneratedUniverseSoundscape(
  profile: SoundscapeProfile
): Promise<ActiveSoundscape | null> {
  if (typeof window === "undefined") return null;

  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) return null;

  const context = new AudioContextConstructor();
  await context.resume();

  const base = createTone(context, profile.baseFrequency, profile.volume, "sine");
  const pulse = createTone(context, profile.pulseFrequency, profile.volume * 0.34, "triangle");
  const air = createTone(context, profile.atmosphereFrequency, profile.volume * 0.18, "sine");

  const pulseTimer = window.setInterval(() => {
    const now = context.currentTime;
    pulse.gain.gain.cancelScheduledValues(now);
    pulse.gain.gain.setValueAtTime(profile.volume * 0.08, now);
    pulse.gain.gain.linearRampToValueAtTime(profile.volume * 0.36, now + 0.8);
    pulse.gain.gain.linearRampToValueAtTime(profile.volume * 0.1, now + 2.4);
  }, 3200);

  return {
    stop: () => {
      window.clearInterval(pulseTimer);
      [base, pulse, air].forEach(({ oscillator, gain }) => {
        gain.gain.setValueAtTime(0, context.currentTime);
        oscillator.stop(context.currentTime + 0.02);
        oscillator.disconnect();
        gain.disconnect();
      });
      void context.close();
    },
    setMuted: (muted: boolean) => {
      const level = muted ? 0 : profile.volume;
      base.gain.gain.value = level;
      pulse.gain.gain.value = muted ? 0 : profile.volume * 0.18;
      air.gain.gain.value = muted ? 0 : profile.volume * 0.12;
    },
  };
}
