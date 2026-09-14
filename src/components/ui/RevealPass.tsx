"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

type RevealPassProps = {
  children: ReactNode;
  className?: string;
  /** Which edge the content arrives from. */
  from?: "bottom" | "left" | "top";
  index?: number;
  delay?: number;
  once?: boolean;
  /** Drive it externally instead of on scroll. */
  active?: boolean;
};

/** Travel distance in px — short, so it reads as arrival rather than flight. */
const OFFSET: Record<NonNullable<RevealPassProps["from"]>, { x?: number; y?: number }> = {
  bottom: { y: 26 },
  top: { y: -26 },
  left: { x: -32 },
};

/**
 * The quiet register: editorial blocks, grid columns, section rules.
 *
 * This was built as a `clip-path` wipe, which would have been the more
 * distinctive gesture — but animated `clip-path` proved unreliable here twice
 * over. The browser normalises `inset(100% 0% 0% 0%)` down to three
 * components, so interpolation against a four-component target never ran: the
 * wipe sat closed while the variant-driven headline beside it revealed
 * perfectly. The same property had already failed on the splash's SVG paths.
 * Transform and opacity are the parts of this stack that demonstrably work.
 *
 * The direction still carries meaning, and what keeps the page from reading as
 * fade-up-on-everything is the rest of the system: type is always uncovered by
 * a mask, grids arrive by column, the hero scatter flies out from its centre.
 */
export default function RevealPass({
  children,
  className,
  from = "bottom",
  index = 0,
  delay = 0,
  once = true,
  active,
}: RevealPassProps) {
  const reduceMotion = useReducedMotion();
  const controlled = typeof active === "boolean";
  const offset = OFFSET[from];

  const variants: Variants = {
    hidden: reduceMotion ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            duration: DUR.editorialSlow,
            delay: delay + index * STAGGER,
            ease: EASE_EDITORIAL,
          },
    },
  };

  const orchestration = reduceMotion
    ? { animate: "visible" as const }
    : controlled
      ? { animate: active ? ("visible" as const) : ("hidden" as const) }
      : {
          whileInView: "visible" as const,
          viewport: { once, amount: 0.2, margin: "-60px" },
        };

  return (
    <motion.div
      data-reveal=""
      className={className}
      variants={variants}
      initial={reduceMotion ? "visible" : "hidden"}
      {...orchestration}
    >
      {children}
    </motion.div>
  );
}
