"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_THEME_MODE,
  THEME_MODE_LABELS,
  THEME_MODES,
  isThemeMode,
  type ResolvedTheme,
  type ThemeMode,
} from "../../../lib/constants/theme";
import { THEME_STORAGE_KEY } from "../../../lib/constants/storage";

const THEME_QUERY = "(prefers-color-scheme: light)";

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "light" || mode === "dark") return mode;

  if (typeof window === "undefined") return "dark";
  return window.matchMedia(THEME_QUERY).matches ? "light" : "dark";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;

  const resolved = resolveTheme(mode);
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeSwitcher({ label = "Theme" }: { label?: string }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    let storedMode: ThemeMode = DEFAULT_THEME_MODE;

    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      storedMode = isThemeMode(stored) ? stored : DEFAULT_THEME_MODE;
    } catch {}

    applyTheme(storedMode);
    const hydrationTimer = window.setTimeout(() => setThemeMode(storedMode), 0);

    const media = window.matchMedia(THEME_QUERY);
    const syncSystemTheme = () => {
      setThemeMode((currentMode) => {
        if (currentMode === "system") applyTheme("system");
        return currentMode;
      });
    };

    media.addEventListener("change", syncSystemTheme);
    return () => {
      window.clearTimeout(hydrationTimer);
      media.removeEventListener("change", syncSystemTheme);
    };
  }, []);

  function selectTheme(nextMode: ThemeMode) {
    setThemeMode(nextMode);
    applyTheme(nextMode);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {}
  }

  return (
    <div className="tpm-theme-switcher" aria-label={label}>
      <span className="tpm-theme-switcher-label">{label}</span>
      <div className="tpm-theme-segments" role="group" aria-label={label}>
        {THEME_MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            className={themeMode === mode ? "active" : undefined}
            aria-pressed={themeMode === mode}
            onClick={() => selectTheme(mode)}
          >
            {THEME_MODE_LABELS[mode]}
          </button>
        ))}
      </div>
    </div>
  );
}
