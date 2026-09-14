"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

type HeroSidebarProps = {
  active: boolean;
  peek?: boolean;
};

const HERO_HEADLINE = ["DA PRIMEIRA LINHA", "AO ÚLTIMO PIXEL."];

const HERO_COPY =
  "Curtas, jogos, modelagem, animação, artes e experimentos produzidos pelos alunos da FUMEC.";

const HERO_CTA = "Ver produções";

export default function HeroSidebar({ active, peek }: HeroSidebarProps) {
  return (
    <aside className="hero-copy absolute bottom-[clamp(5rem,12vh,8rem)] left-[var(--gutter)] z-20 hidden max-w-[min(22rem,42vw)] lg:block">
      <motion.div
        data-reveal=""
        initial={{ opacity: 0, y: 16, clipPath: "inset(0% 0% 100% 0%)" }}
        animate={
          active
            ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
            : peek
              ? { opacity: 0.18, y: 8, clipPath: "inset(0% 0% 60% 0%)" }
              : { opacity: 0, y: 16, clipPath: "inset(0% 0% 100% 0%)" }
        }
        transition={{ duration: DUR.editorial, delay: STAGGER * 6, ease: EASE_EDITORIAL }}
        className="text-left"
      >
        <HeroHeadline className="font-display text-[clamp(1.35rem,2.4vw,2rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground" />

        <p className="-translate-y-0.5 mt-4 max-w-[18rem] text-pretty text-[0.78rem] leading-relaxed text-muted sm:text-[0.82rem]">
          {HERO_COPY}
        </p>

        <HeroCta active={active} className="mt-3 -translate-y-2" />
      </motion.div>
    </aside>
  );
}

export function HeroCta({
  active,
  className = "mt-6",
}: {
  active: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: DUR.editorial, delay: STAGGER * 7, ease: EASE_EDITORIAL }}
    >
      <Link
        href="/producoes"
        transitionTypes={["nav-forward"]}
        data-cursor-label="ver"
        className="hero-cta group inline-flex items-center gap-2.5 focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className="font-sans text-[0.58rem] tabular-nums tracking-[0.08em] text-magenta/75 transition-colors duration-300 group-hover:text-magenta"
        >
          →
        </span>
        <span className="relative pb-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground">
          {HERO_CTA}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-px w-0 bg-magenta transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full group-focus-visible:w-full"
          />
        </span>
      </Link>
    </motion.div>
  );
}

export function HeroHeadline({ className }: { className?: string }) {
  return (
    <h2 className={className}>
      <span className="block">{HERO_HEADLINE[0]}</span>
      <span className="block text-brand">{HERO_HEADLINE[1]}</span>
    </h2>
  );
}

export { HERO_COPY, HERO_CTA, HERO_HEADLINE };
