"use client";

import { motion } from "framer-motion";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

type HeroMetadataProps = {
  active: boolean;
  peek?: boolean;
};

function LocationPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="1.75" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function HeroMetadata({ active, peek }: HeroMetadataProps) {
  const fade = active ? 1 : peek ? 0.16 : 0;

  return (
    <>
      <motion.aside
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(var(--hero-floor)+0.5rem)] right-[var(--gutter)] z-20 hidden lg:block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: fade, y: active ? 0 : 10 }}
        transition={{ duration: DUR.editorial, delay: STAGGER * 8, ease: EASE_EDITORIAL }}
      >
        <p className="flex h-5 items-center justify-end gap-2 text-right text-[0.6rem] font-medium uppercase tracking-[0.22em] text-foreground/45">
          <LocationPin className="h-3 w-3 text-magenta/70" />
          Belo Horizonte
          <span className="text-foreground/25">·</span>
          MG, Brasil
        </p>
      </motion.aside>

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

      <motion.footer
        className="pointer-events-none absolute bottom-[var(--hero-floor-meta)] left-0 right-0 z-20 hidden flex-col items-center gap-1 lg:flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: fade, y: active ? 0 : 10 }}
        transition={{ duration: DUR.editorial, delay: STAGGER * 10, ease: EASE_EDITORIAL }}
      >
        <span className="text-[0.75rem] font-medium uppercase tracking-[0.28em] text-foreground/35">
          [ FUMEC ]
        </span>
        <p className="font-display text-[1rem] uppercase tracking-[0.14em] text-foreground/50">
          Criatividade também é futuro
        </p>
      </motion.footer>
    </>
  );
}
