"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

// Declared once, at module scope: building a motion component inside render
// hands React a new component type every pass and remounts the headline.
const MOTION_TAGS = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const;

export type MaskedTag = keyof typeof MOTION_TAGS;

type MaskedLinesProps = {
  /** One string per visual line — you choose the breaks, not the browser. */
  lines: string[];
  /** `word` splits each line further, for the largest display sizes. */
  by?: "line" | "word";
  as?: MaskedTag;
  className?: string;
  /** Applied to each revealed text segment (must carry the glyphs for background-clip). */
  partClassName?: string;
  delay?: number;
  /** Drive it externally (the Hero does this). Omit to reveal on scroll. */
  active?: boolean;
  once?: boolean;
};

/**
 * Type is never faded in — it's uncovered.
 *
 * Each line rides up out of its own clipped box. Fade on a headline reads as a
 * template; a mask reads as something someone directed. The Hero already did
 * this to its h1 and it was the best gesture on the site; this makes it the
 * rule rather than the exception.
 *
 * Reduced motion drops the movement but keeps the markup identical. Returning
 * a different tree would be a hydration mismatch — `useReducedMotion` is null
 * on the server and the real value on the client's first render — and this
 * component renders the headline of every page.
 */
export default function MaskedLines({
  lines,
  by = "line",
  as = "span",
  className,
  partClassName,
  delay = 0,
  active,
  once = true,
}: MaskedLinesProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = MOTION_TAGS[as];

  const controlled = typeof active === "boolean";
  const groups = lines.map((line) => (by === "word" ? line.split(" ") : [line]));
  // Stagger runs across the whole headline, not per line, so a two-line
  // heading reads as one gesture rather than two.
  const offsets = groups.reduce<number[]>(
    (acc, parts, i) => [...acc, (acc[i] ?? 0) + parts.length],
    [0],
  );

  const orchestration = reduceMotion
    ? { animate: "visible" as const }
    : controlled
      ? { animate: active ? ("visible" as const) : ("hidden" as const) }
      : {
          whileInView: "visible" as const,
          viewport: { once, amount: 0.35, margin: "-60px" },
        };

  return (
    <MotionTag className={className} initial={reduceMotion ? "visible" : "hidden"} {...orchestration}>
      {groups.map((parts, lineIndex) => (
        <span
          key={lineIndex}
          className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"
        >
          {parts.map((part, partIndex) => (
            <motion.span
              key={partIndex}
              data-reveal=""
              className={partClassName ? `inline-block ${partClassName}` : "inline-block"}
              variants={{
                hidden: { y: reduceMotion ? "0%" : "112%" },
                visible: {
                  y: "0%",
                  transition: reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: DUR.editorialSlow,
                        delay: delay + (offsets[lineIndex] + partIndex) * STAGGER,
                        ease: EASE_EDITORIAL,
                      },
                },
              }}
            >
              {part}
              {/* A non-breaking space, not a plain one: a trailing regular
                  space at the edge of an inline-block gets trimmed, which
                  ran the words of a split headline together. */}
              {by === "word" && partIndex < parts.length - 1 ? "\u00A0" : null}
            </motion.span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}
