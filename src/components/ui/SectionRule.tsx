"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { DUR, EASE_EDITORIAL } from "@/lib/motion";

/**
 * A hairline that draws itself from its origin when the section arrives.
 *
 * Costs almost nothing and gives the page the sense of being built rather than
 * displayed — which is the same idea the rest of the motion runs on.
 */
export default function SectionRule({
  className,
  origin = "left",
  delay = 0,
}: {
  className?: string;
  origin?: "left" | "right" | "center";
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={clsx("h-px w-full bg-border", className)}
      style={{
        transformOrigin:
          origin === "center" ? "50% 50%" : origin === "right" ? "100% 50%" : "0% 50%",
      }}
      initial={{ scaleX: reduceMotion ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: DUR.editorial, delay, ease: EASE_EDITORIAL }}
    />
  );
}
