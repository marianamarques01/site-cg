"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_VISUAL_MODE,
  readStoredVisualMode,
  VISUAL_MODE_STORAGE_KEY,
  type VisualMode,
} from "@/lib/visual-mode";

type VisualModeContextValue = {
  visualMode: VisualMode;
  setVisualMode: (mode: VisualMode) => void;
  toggleVisualMode: () => void;
  isMinimal: boolean;
};

const VisualModeContext = createContext<VisualModeContextValue | null>(null);

function applyVisualMode(mode: VisualMode) {
  document.documentElement.setAttribute("data-visual", mode);
}

export function VisualModeProvider({ children }: { children: ReactNode }) {
  const [visualMode, setVisualModeState] = useState<VisualMode>(DEFAULT_VISUAL_MODE);

  useEffect(() => {
    const stored = readStoredVisualMode();
    const resolved = stored ?? DEFAULT_VISUAL_MODE;
    setVisualModeState(resolved);
    applyVisualMode(resolved);
  }, []);

  const setVisualMode = useCallback((next: VisualMode) => {
    setVisualModeState(next);
    applyVisualMode(next);
    try {
      localStorage.setItem(VISUAL_MODE_STORAGE_KEY, next);
    } catch {
      /* storage blocked */
    }
  }, []);

  const toggleVisualMode = useCallback(() => {
    setVisualModeState((current) => {
      const next: VisualMode = current === "minimal" ? "maximal" : "minimal";
      applyVisualMode(next);
      try {
        localStorage.setItem(VISUAL_MODE_STORAGE_KEY, next);
      } catch {
        /* storage blocked */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      visualMode,
      setVisualMode,
      toggleVisualMode,
      isMinimal: visualMode === "minimal",
    }),
    [visualMode, setVisualMode, toggleVisualMode],
  );

  return <VisualModeContext.Provider value={value}>{children}</VisualModeContext.Provider>;
}

export function useVisualMode() {
  const ctx = useContext(VisualModeContext);
  if (!ctx) {
    throw new Error("useVisualMode must be used within VisualModeProvider");
  }
  return ctx;
}
