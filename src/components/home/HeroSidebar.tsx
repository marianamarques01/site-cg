"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

type HeroTrack = "cg" | "games";

type HeroSidebarProps = {
  track?: HeroTrack;
  active: boolean;
  peek?: boolean;
  entranceDelay?: number;
};

const HERO_TRACKS: Record<HeroTrack, { headline: [string, string]; copy: string; cta: string; href: string }> = {
  cg: {
    headline: ["DA PRIMEIRA LINHA", "AO ÚLTIMO PIXEL."],
    copy: "Curtas, modelagem, animação, concept art e experimentos dos alunos de Computação Gráfica da FUMEC.",
    cta: "Ver projetos de CG",
    href: "/producoes/computacao-grafica",
  },
  games: {
    headline: ["DO PRIMEIRO SPRITE", "AO ÚLTIMO LEVEL."],
    copy: "Protótipos e jogos completos criados por equipes de alunos de Design de Games da FUMEC.",
    cta: "Ver jogos",
    href: "/producoes/jogos",
  },
};

const HERO_HEADLINE = HERO_TRACKS.cg.headline;
const HERO_COPY = HERO_TRACKS.cg.copy;
const HERO_CTA = HERO_TRACKS.cg.cta;

export default function HeroSidebar({ track = "cg", active, peek, entranceDelay = STAGGER * 6 }: HeroSidebarProps) {
  const content = HERO_TRACKS[track];
  const isRight = track === "games";

  return (
    <aside
      className={`hero-copy absolute bottom-[var(--hero-floor)] z-20 hidden max-w-[min(22rem,42vw)] lg:block ${
        isRight ? "right-[var(--gutter)]" : "left-[var(--gutter)]"
      }`}
    >
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
        transition={{
          duration: DUR.editorial,
          delay: entranceDelay,
          ease: EASE_EDITORIAL,
        }}
        className={isRight ? "text-right" : "text-left"}
      >
        <Link
          href={content.href}
          transitionTypes={["nav-forward"]}
          data-cursor-label="ver"
          className="group/track block focus-visible:outline-none"
        >
          <HeroHeadline
            track={track}
            className="font-display text-[clamp(1.35rem,2.4vw,2rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground transition-opacity duration-300 group-hover/track:opacity-90"
          />

          <p
            className={`-translate-y-0.5 mt-4 max-w-[18rem] text-pretty text-[0.78rem] leading-relaxed text-muted transition-colors duration-300 group-hover/track:text-foreground/80 sm:text-[0.82rem] ${
              isRight ? "ml-auto" : ""
            }`}
          >
            {content.copy}
          </p>

          <HeroCta
            track={track}
            asLink={false}
            active={active}
            delay={entranceDelay + STAGGER}
            className="mt-3 -translate-y-2"
          />
        </Link>
      </motion.div>
    </aside>
  );
}

export function HeroCta({
  track = "cg",
  asLink = true,
  active,
  delay = STAGGER * 7,
  className = "mt-6",
}: {
  track?: HeroTrack;
  /** false quando o bloco inteiro já é o link. */
  asLink?: boolean;
  active: boolean;
  delay?: number;
  className?: string;
}) {
  const content = HERO_TRACKS[track];
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="font-sans text-[0.58rem] tabular-nums tracking-[0.08em] text-magenta/75 transition-colors duration-300 group-hover:text-magenta group-hover/track:text-magenta"
      >
        →
      </span>
      <span className="relative pb-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground group-hover/track:text-foreground">
        {content.cta}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-0 bg-magenta transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full group-focus-visible:w-full group-hover/track:w-full group-focus-visible/track:w-full"
        />
      </span>
    </>
  );

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{
        duration: DUR.editorial,
        delay,
        ease: EASE_EDITORIAL,
      }}
    >
      {asLink ? (
        <Link
          href={content.href}
          transitionTypes={["nav-forward"]}
          data-cursor-label="ver"
          className="hero-cta group inline-flex items-center gap-2.5 focus-visible:outline-none"
        >
          {inner}
        </Link>
      ) : (
        <span className="hero-cta inline-flex items-center gap-2.5">{inner}</span>
      )}
    </motion.div>
  );
}

export function HeroHeadline({ track = "cg", className }: { track?: HeroTrack; className?: string }) {
  const [first, second] = HERO_TRACKS[track].headline;
  return (
    <h2 className={className}>
      <span className="block">{first}</span>
      <span className="block text-brand">{second}</span>
    </h2>
  );
}

export { HERO_COPY, HERO_CTA, HERO_HEADLINE, HERO_TRACKS };
