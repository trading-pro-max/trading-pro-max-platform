"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getSoundscapeProfile,
  getUniverseMood,
  startGeneratedUniverseSoundscape,
  type ActiveSoundscape,
} from "@/lib/client/living-universe";
import styles from "./ProMaxUniverseSoundscape.module.css";

const DEFAULT_DEVICE_DATE = new Date("2026-04-28T12:00:00.000");

export function ProMaxUniverseSoundscape() {
  const [isOn, setIsOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [deviceDate, setDeviceDate] = useState<Date | null>(null);
  const activeRef = useRef<ActiveSoundscape | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDeviceDate(new Date()), 1200);
    const interval = window.setInterval(() => setDeviceDate(new Date()), 60000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    return () => {
      activeRef.current?.stop();
      activeRef.current = null;
    };
  }, []);

  const mood = useMemo(() => getUniverseMood(deviceDate ?? DEFAULT_DEVICE_DATE), [deviceDate]);
  const profile = useMemo(() => getSoundscapeProfile(mood), [mood]);

  const toggleSoundscape = async () => {
    if (isOn) {
      activeRef.current?.stop();
      activeRef.current = null;
      setIsOn(false);
      return;
    }

    const active = await startGeneratedUniverseSoundscape(profile);
    activeRef.current = active;
    setIsOn(Boolean(active));
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    activeRef.current?.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <section
      className={styles.soundscape}
      data-testid="promax-universe-soundscape"
      data-soundscape-off-by-default={!isOn}
      aria-label="Pro Max universe soundscape"
    >
      <div>
        <span>{isOn ? "Soundscape On" : "Soundscape Off"}</span>
        <strong>{profile.label}</strong>
        <small>Generated locally. User activated. No autoplay.</small>
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={toggleSoundscape}>
          {isOn ? "Turn Off" : "Turn On"}
        </button>
        <button type="button" onClick={toggleMute} disabled={!isOn}>
          {isMuted ? "Muted" : "Mute"}
        </button>
      </div>
    </section>
  );
}
