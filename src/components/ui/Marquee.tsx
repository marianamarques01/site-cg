"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

export type MarqueeItem = { label: string; href: string };

type MarqueeProps = {
  items: MarqueeItem[];
};

/** Percent of the track travelled per second at rest. */
const BASE_SPEED = 50 / 30;

/** Minimum labels per copy so the loop fills wide viewports. */
const MIN_TRACK_ITEMS = 8;

function buildTrack(items: MarqueeItem[]): MarqueeItem[] {
  if (items.length === 0) return [];
  const repeats = Math.max(1, Math.ceil(MIN_TRACK_ITEMS / items.length));
  return Array.from({ length: repeats }, () => items).flat();
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * The ticker is the one mechanical element between two sections, so it's the
 * natural place to put a readout of the page's own energy: scrolling faster
 * drives it faster, scrolling up reverses it, and stopping returns it to its
 * base tempo.
 *
 * It's also navigation now rather than decoration — the categories link to
 * where that work actually lives.
 */
export default function Marquee({ items }: MarqueeProps) {
  const track = buildTrack(items);
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // Without this the frame loop below keeps running for the life of the page,
  // including the several thousand pixels of scroll where the ticker isn't on
  // screen at all.
  const inView = useInView(ref, { margin: "120px" });
  const [paused, setPaused] = useState(false);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 1200], [-4, 4], {
    clamp: false,
  });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (track.length === 0 || reduceMotion || paused || !inView) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    let moveBy = direction.current * BASE_SPEED * (delta / 1000);
    moveBy += moveBy * Math.abs(factor);
    baseX.set(wrap(-50, 0, baseX.get() + moveBy));
  });

  if (track.length === 0) return null;

  return (
    <nav
      ref={ref}
      aria-label="Categorias"
      className="overflow-hidden border-y border-border py-5 sm:py-7"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      // Held still while a keyboard user is on it — otherwise the thing they
      // just focused drifts off the screen underneath them.
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <motion.div
        className="flex w-max items-center gap-10 sm:gap-16"
        style={{ x: reduceMotion ? "0%" : x }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex items-center gap-10 sm:gap-16"
            // The second copy exists only so the loop has no seam.
            {...(copy === 1 ? { "aria-hidden": true as const } : {})}
          >
            {track.map((item, i) => (
              <span key={`${copy}-${i}-${item.label}`} className="flex items-center gap-10 sm:gap-16">
                <Link
                  href={item.href}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className={
                    i % 2 === 1
                      ? "marquee-outline whitespace-nowrap font-display text-3xl leading-none transition-colors duration-300 sm:text-5xl"
                      : "whitespace-nowrap font-display text-3xl leading-none text-foreground transition-colors duration-300 hover:text-brand focus-visible:text-brand sm:text-5xl"
                  }
                >
                  {item.label}
                </Link>
                <span aria-hidden="true" className="text-lg text-brand sm:text-2xl">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </nav>
  );
}
