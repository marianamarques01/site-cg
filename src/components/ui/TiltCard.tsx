"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { SPRING_TILT } from "@/lib/motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  max?: number;
};

/**
 * 3D perspective tilt following the cursor, with a soft light sweep pinned
 * to the pointer — the "viewport into a 3D scene" feel, fitting for a CG
 * program's work. Falls back to a static block under reduced motion.
 */
export default function TiltCard({ children, className, max = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springRotateX = useSpring(rotateX, SPRING_TILT);
  const springRotateY = useSpring(rotateY, SPRING_TILT);
  const glareBackground = useMotionTemplate`radial-gradient(220px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.14), transparent 65%)`;

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
      }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rotateY.set((px - 0.5) * max * 2);
        rotateX.set((0.5 - py) * max * 2);
        glareX.set(px * 100);
        glareY.set(py * 100);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <div className="group/tilt relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: glareBackground }}
        />
      </div>
    </motion.div>
  );
}
