"use client";

import { motion } from "framer-motion";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

type HeroMetadataProps = {
  active: boolean;
  peek?: boolean;
};

export default function HeroMetadata({ active, peek }: HeroMetadataProps) {
  const fade = active ? 1 : peek ? 0.16 : 0;

  return (
    <>
      <motion.aside
        aria-hidden="true"
        className="pointer-events-none absolute right-[var(--gutter)] top-1/2 z-20 hidden -translate-y-1/2 lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: fade * 0.55 }}
        transition={{ duration: DUR.editorial, delay: STAGGER * 9, ease: EASE_EDITORIAL }}
      >
        <p
          className="text-[0.55rem] font-medium uppercase tracking-[0.32em] text-foreground/30 [writing-mode:vertical-rl]"
          style={{ transform: "rotate(180deg)" }}
        >
          Scroll
        </p>
      </motion.aside>
    </>
  );
}
