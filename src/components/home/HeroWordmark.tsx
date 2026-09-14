"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

type HeroWordmarkProps = {
  active?: boolean;
  delay?: number;
  /** Splash morph keeps the markup stable without mask reveal. */
  splashMode?: boolean;
  className?: string;
};

function CriativaLayers() {
  return (
    <span className="hero-wordmark-criativa">
      <span className="hero-wordmark-criativa-stroke">CRIATIVA</span>
      <span className="hero-wordmark-criativa-fill" aria-hidden="true">
        CRIATIVA
      </span>
    </span>
  );
}

export default function HeroWordmark({
  active = true,
  delay = 0.28,
  splashMode = false,
  className = "",
}: HeroWordmarkProps) {
  const reduceMotion = useReducedMotion();

  const baseClass =
    "hero-wordmark-text block whitespace-nowrap font-display font-black uppercase";

  if (splashMode) {
    return (
      <span className={`${baseClass} ${className}`.trim()}>
        <span className="hero-wordmark-fumec">FUMEC</span>
        {"\u00A0"}
        <CriativaLayers />
      </span>
    );
  }

  const orchestration = reduceMotion
    ? { animate: "visible" as const }
    : { animate: active ? ("visible" as const) : ("hidden" as const) };

  return (
    <motion.span
      className={`${baseClass} ${className}`.trim()}
      initial={reduceMotion ? "visible" : "hidden"}
      {...orchestration}
    >
      <span className="hero-wordmark-reveal block overflow-hidden">
        <motion.span
          data-reveal=""
          className="inline-block"
          variants={{
            hidden: { y: reduceMotion ? "0%" : "112%" },
            visible: {
              y: "0%",
              transition: reduceMotion
                ? { duration: 0 }
                : { duration: DUR.editorialSlow, delay, ease: EASE_EDITORIAL },
            },
          }}
        >
          <span className="hero-wordmark-fumec">FUMEC</span>
        </motion.span>
        <motion.span
          data-reveal=""
          className="inline-block"
          variants={{
            hidden: { y: reduceMotion ? "0%" : "112%" },
            visible: {
              y: "0%",
              transition: reduceMotion
                ? { duration: 0 }
                : {
                    duration: DUR.editorialSlow,
                    delay: delay + STAGGER,
                    ease: EASE_EDITORIAL,
                  },
            },
          }}
        >
          {"\u00A0"}
          <CriativaLayers />
        </motion.span>
      </span>
    </motion.span>
  );
}
