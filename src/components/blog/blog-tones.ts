import type { PlaceholderKind, PlaceholderTone } from "@/components/ui/PlaceholderMedia";

export const TONE_ACCENT: Record<PlaceholderTone, string> = {
  blue: "var(--color-brand)",
  violet: "var(--color-violet)",
  electric: "var(--color-electric)",
  mix: "var(--color-magenta)",
};

export const TONE_GLOW: Record<PlaceholderTone, string> = {
  blue: "color-mix(in srgb, var(--color-brand) 35%, transparent)",
  violet: "color-mix(in srgb, var(--color-violet) 35%, transparent)",
  electric: "color-mix(in srgb, var(--color-electric) 35%, transparent)",
  mix: "color-mix(in srgb, var(--color-violet) 22%, var(--color-brand) 22%, transparent)",
};

export const CATEGORY_KIND: Record<string, PlaceholderKind> = {
  Eventos: "timeline",
  Bastidores: "grid",
  "Design de Games": "tilemap",
};
