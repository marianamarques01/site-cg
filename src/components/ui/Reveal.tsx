"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index — multiplied into the base delay. */
  index?: number;
  delay?: number;
  y?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  y = 28,
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.8,
        delay: reduceMotion ? 0 : delay + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
