"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { DUR, EASE_MECH, SPRING_CURSOR } from "@/lib/motion";

type Variant =
  | "default"
  | "hover"
  | "label"
  | "drag"
  | "external"
  | "copy"
  | "native";

const FIELD_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const TARGET_SELECTOR = "[data-cursor], a, button";

/**
 * Replaces the system cursor on fine-pointer devices: a dot with a lagging
 * ring that reads what it's over.
 *
 * Two things it deliberately does not do. It never covers a form field — the
 * native I-beam carries information this can't, and taking it away cost real
 * usability on the contact page. And it no longer uses `mix-blend-difference`,
 * which over the brand blue produced an orange that isn't in the palette.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, SPRING_CURSOR);
  const ringY = useSpring(y, SPRING_CURSOR);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // Feature detection only resolves client-side post-mount; flipping this
    // flag here (rather than a lazy initial state) avoids an SSR/client
    // hydration mismatch, at the cost of one intentional extra render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const resolve = (el: HTMLElement | null): [Variant, string] => {
      if (!el) return ["default", ""];
      if (el.closest(FIELD_SELECTOR)) return ["native", ""];

      const target = el.closest<HTMLElement>(TARGET_SELECTOR);
      if (target) {
        const explicit = target.getAttribute("data-cursor-label");
        if (explicit) return ["label", explicit];
        const kind = target.getAttribute("data-cursor");
        if (kind === "drag") return ["drag", ""];
        if (kind === "copy") return ["copy", ""];
        const href = target.getAttribute("href");
        if (href && /^https?:\/\//.test(href)) return ["external", ""];
        return ["hover", ""];
      }

      return ["default", ""];
    };

    const onOver = (e: MouseEvent) => {
      const [next, nextLabel] = resolve(e.target as HTMLElement);
      setVariant(next);
      setLabel(nextLabel);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  const native = variant === "native";
  const size =
    variant === "label"
      ? 84
      : variant === "hover" || variant === "external" || variant === "copy"
        ? 56
        : variant === "drag"
          ? 72
          : 28;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] h-1.5 w-1.5 rounded-full bg-foreground"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: native ? 0 : 1 }}
        transition={{ duration: DUR.mech }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[999] flex items-center justify-center whitespace-nowrap border border-foreground/45"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: native ? 0 : 1,
          borderRadius: 999,
          backgroundColor: "rgba(0,0,0,0)",
        }}
        transition={{ duration: DUR.mech, ease: EASE_MECH }}
      >
        <AnimatePresence>
          {variant === "label" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[0.65rem] font-medium uppercase tracking-[0.1em] text-foreground"
            >
              {label}
            </motion.span>
          )}
          {variant === "external" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-foreground"
            >
              ↗
            </motion.span>
          )}
          {variant === "copy" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-foreground"
            >
              copiar
            </motion.span>
          )}
          {variant === "drag" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[0.65rem] font-medium tracking-[0.2em] text-foreground"
            >
              ←→
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
