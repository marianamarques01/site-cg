"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/**
 * A hairline of progress, present only while you're moving.
 *
 * At 2px in full brand blue it competed with the header for the top edge of
 * the screen at all times. Now it's 1px and its opacity follows scroll
 * velocity: information while it's useful, silence the rest of the time.
 */
export default function ScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  const velocity = useVelocity(scrollY);
  const presence = useTransform(velocity, [-600, -40, 0, 40, 600], [1, 0.15, 0, 0.15, 1]);
  const opacity = useSpring(presence, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-px origin-left bg-brand"
      style={{ scaleX, opacity }}
    />
  );
}
