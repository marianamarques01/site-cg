"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsTouchDevice } from "@/cineclube/hooks/useIsTouchDevice";

/**
 * Cursor customizado: um "foco de projetor" que segue o mouse.
 * Cresce sobre links/botões e vira um aro de mira.
 * Desativado em telas de toque e para quem prefere menos movimento.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    if (isTouch) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const root = document.querySelector(".cineclube-root");
    root?.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [role='button'], input, textarea, select, label"));
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      root?.classList.remove("has-custom-cursor");
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border-2 border-melies-peach"
        animate={{
          width: hovering ? 52 : 20,
          height: hovering ? 52 : 20,
          backgroundColor: hovering ? "rgba(255,197,133,0.12)" : "rgba(255,197,133,0.5)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {/* estrelinha central quando em hover, como a do chapéu da lua */}
        <motion.span
          animate={{ scale: hovering ? 1 : 0, rotate: hovering ? 180 : 0 }}
          className="text-melies-peach text-xs"
        >
          ✦
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
