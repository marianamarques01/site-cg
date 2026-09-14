import type { Easing } from "framer-motion";

/**
 * The site's motion language, in one place.
 *
 * Rule: no component under `home/` or `layout/` declares its own curve or
 * duration — they all read from here. The curve below used to be written out
 * by hand in eleven different files, which is how a motion language quietly
 * drifts apart.
 */

/** Long deceleration, soft arrival, zero overshoot. Text, section reveals, blocks. */
export const EASE_EDITORIAL: Easing = [0.16, 1, 0.3, 1];

/** Decisive in and out. Hover, focus, state changes, splash geometry. */
export const EASE_MECH: Easing = [0.65, 0.05, 0, 1];

/** Linear/ambient loops never ease — they have no perceptible start or end. */
export const EASE_AMBIENT: Easing = "linear";

export const DUR = {
  /** Contact-speed: hover, focus, toggles. */
  mech: 0.32,
  mechSlow: 0.42,
  /** Reading-speed: reveals, entrances. */
  editorial: 0.7,
  editorialSlow: 0.9,
  /** One object travelling between two states. */
  morph: 0.6,
} as const;

/** One stagger for the whole site. 60ms — never more. */
export const STAGGER = 0.06;

/** Springs live only where there's a pointer: there the overshoot is contact physics. */
export const SPRING_POINTER = { stiffness: 150, damping: 20, mass: 0.4 } as const;
export const SPRING_TILT = { stiffness: 220, damping: 20 } as const;
export const SPRING_MAGNETIC = { stiffness: 200, damping: 15, mass: 0.3 } as const;
export const SPRING_CURSOR = { stiffness: 300, damping: 30, mass: 0.5 } as const;

export const transition = {
  editorial: { duration: DUR.editorial, ease: EASE_EDITORIAL },
  editorialSlow: { duration: DUR.editorialSlow, ease: EASE_EDITORIAL },
  mech: { duration: DUR.mech, ease: EASE_MECH },
  mechSlow: { duration: DUR.mechSlow, ease: EASE_MECH },
  morph: { duration: DUR.morph, ease: EASE_EDITORIAL },
} as const;
