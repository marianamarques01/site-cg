export type VisualMode = "minimal" | "maximal";

export const VISUAL_MODE_STORAGE_KEY = "fumec-visual-mode";
export const DEFAULT_VISUAL_MODE: VisualMode = "minimal";

export function isVisualMode(value: string | null | undefined): value is VisualMode {
  return value === "minimal" || value === "maximal";
}

export function readStoredVisualMode(): VisualMode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(VISUAL_MODE_STORAGE_KEY);
    return isVisualMode(stored) ? stored : null;
  } catch {
    return null;
  }
}
