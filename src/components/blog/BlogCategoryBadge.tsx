import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import { TONE_ACCENT, TONE_GLOW } from "@/components/blog/blog-tones";

type BlogCategoryBadgeProps = {
  category: string;
  tone: PlaceholderTone;
  large?: boolean;
};

export default function BlogCategoryBadge({ category, tone, large }: BlogCategoryBadgeProps) {
  const accent = TONE_ACCENT[tone];
  const glow = TONE_GLOW[tone];

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border font-medium tracking-wide transition-colors duration-300 ${
        large ? "px-4 py-1.5 text-xs" : "px-3 py-1 text-[0.65rem]"
      }`}
      style={{
        borderColor: `color-mix(in srgb, ${accent} 50%, transparent)`,
        color: accent,
        background: glow,
      }}
    >
      {category}
    </span>
  );
}
