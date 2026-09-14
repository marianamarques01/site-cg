"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/cineclube/lib/utils";

interface RevealTextProps {
  text: string;
  className?: string;
  /** atraso inicial em segundos */
  delay?: number;
  /** intervalo entre letras */
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Texto que aparece letra por letra, como créditos de abertura.
 * Cada letra sobe de baixo com uma leve rotação, em cascata.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.035,
  as: Tag = "span",
}: RevealTextProps) {
  const reduced = useReducedMotion();
  const letters = Array.from(text);

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          aria-hidden
          className="inline-block will-change-transform"
          initial={{ y: "0.9em", opacity: 0, rotate: 8 }}
          whileInView={{ y: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: delay + i * stagger,
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
        >
          {letter === " " ? " " : letter}
        </motion.span>
      ))}
    </Tag>
  );
}
