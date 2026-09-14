export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "fumec-theme";
export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "dark" || value === "light";
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}
