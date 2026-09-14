"use client";

import { motion } from "framer-motion";
import { cn } from "@/cineclube/lib/utils";

interface SectionTitleProps {
  /** rótulo pequeno tipo carimbo acima do título */
  kicker?: string;
  title: string;
  className?: string;
  /** inclinação do título em graus (torto de propósito) */
  tilt?: number;
  tone?: "cream" | "ink";
}

/**
 * Título de seção padrão do site: carimbo + display gigante inclinado,
 * que entra "colado" na parede quando a seção aparece.
 */
export function SectionTitle({
  kicker,
  title,
  className,
  tilt = -2,
  tone = "cream",
}: SectionTitleProps) {
  return (
    <div className={cn("relative", className)}>
      {kicker && (
        <motion.span
          initial={{ opacity: 0, scale: 1.6, rotate: -12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={cn(
            "stamp mb-4 text-xs md:text-sm",
            tone === "cream" ? "text-melies-peach" : "text-melies-purple"
          )}
        >
          {kicker}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 60, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className={cn(
          "font-melies-display text-5xl uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl",
          tone === "cream" ? "text-melies-cream" : "text-melies-ink"
        )}
      >
        {title}
      </motion.h2>
    </div>
  );
}
