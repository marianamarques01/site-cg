"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Fireflies from "@/components/ui/Fireflies";
import HeroSceneLines from "@/components/home/HeroSceneLines";

type HeroBackgroundProps = {
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
  ready?: boolean;
  /** Splash-only: image + tint, no fireflies/lines/texture — halves compositor work. */
  minimal?: boolean;
};

export default function HeroBackground({
  pointerX,
  pointerY,
  ready = true,
  minimal = false,
}: HeroBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const px = pointerX ?? fallbackX;
  const py = pointerY ?? fallbackY;

  const bgX = useTransform(px, (v) => (reduceMotion ? 0 : v * 3));
  const bgY = useTransform(py, (v) => (reduceMotion ? 0 : v * 2));

  return (
    <div className="hero-scene" aria-hidden="true">
      <motion.div
        className="hero-scene-base absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: ready ? 1 : 0.4, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: bgX, y: bgY }}
      >
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="hero-scene-tint" />
      <div className="hero-scene-overlay" />
      <div className="hero-scene-vignette" />
      {!minimal && (
        <>
          <HeroSceneLines />
          <div className="hero-texture" />
          <Fireflies />
        </>
      )}
      <div className="hero-fade" />
    </div>
  );
}
