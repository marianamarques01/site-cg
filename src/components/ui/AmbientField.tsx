"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * The colour the whole page sits in, tied to how far down it is.
 *
 * Violet holds the top and returns at the close; electric swells through the
 * middle, where the games are. Nothing appears and nothing leaves — the page
 * simply changes temperature as you descend, which is the cheapest effect here
 * to maintain and the hardest to point at when it's working.
 *
 * Only opacity is animated. The masses are 120px-blurred and 70vw wide;
 * moving or scaling them would re-rasterize that blur on every frame.
 */
export default function AmbientField() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 30,
    restDelta: 0.001,
  });

  const violet = useTransform(progress, [0, 0.45, 0.62, 1], [0.52, 0.38, 0.34, 0.48]);
  const electric = useTransform(
    progress,
    [0, 0.3, 0.55, 0.8, 1],
    [0.32, 0.42, 0.52, 0.38, 0.28],
  );

  return (
    <div className="ambient-field" aria-hidden="true">
      <motion.div
        className="ambient-mass ambient-mass-violet"
        style={{ opacity: reduceMotion ? 0.55 : violet }}
      />
      <motion.div
        className="ambient-mass ambient-mass-electric"
        style={{ opacity: reduceMotion ? 0.4 : electric }}
      />
    </div>
  );
}
