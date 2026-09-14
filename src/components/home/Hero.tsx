"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import HeroBackground from "@/components/home/HeroBackground";
import HeroWordmark from "@/components/home/HeroWordmark";
import HeroSidebar, { HERO_COPY, HeroCta, HeroHeadline } from "@/components/home/HeroSidebar";
import HeroMetadata from "@/components/home/HeroMetadata";
import HeroProjectTile from "@/components/home/HeroProjectTile";
import HeroCategoryCarousel from "@/components/home/HeroCategoryCarousel";
import { HERO_CATEGORIES } from "@/lib/mock/categories";
import type { HeroCategory } from "@/lib/mock/categories";
import { useIntro, useIntroAnchor } from "@/components/ui/IntroProvider";
import { useVisualMode } from "@/components/ui/VisualModeProvider";
import { DUR, EASE_EDITORIAL, SPRING_POINTER, STAGGER } from "@/lib/motion";

type HeroProps = {
  categories?: HeroCategory[];
};

export default function Hero({ categories = HERO_CATEGORIES }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { stage, homePeek, homeReady, splashEnabled } = useIntro();
  const { isMinimal } = useVisualMode();
  const wordmarkAnchor = useIntroAnchor("wordmark");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, SPRING_POINTER);
  const py = useSpring(pointerY, SPRING_POINTER);

  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 28]);
  const titlePointerX = useTransform(px, (v) => (reduceMotion ? 0 : v * 4));
  const titlePointerY = useTransform(py, (v) => (reduceMotion ? 0 : v * 3));

  const robotScrollY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);
  const robotPointerX = useTransform(px, (v) => (reduceMotion ? 0 : v * 10));
  const robotPointerY = useTransform(py, (v) => (reduceMotion ? 0 : v * 10));
  const robotRotateY = useTransform(px, (v) => (reduceMotion ? 0 : v * 8));
  const robotRotateX = useTransform(py, (v) => (reduceMotion ? 0 : v * -5));

  const onPointerMove = (event: React.PointerEvent) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    pointerX.set(event.clientX / window.innerWidth - 0.5);
    pointerY.set(event.clientY / window.innerHeight - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="hero-editorial relative min-h-[100dvh] w-full overflow-x-clip"
    >
      {!(splashEnabled && stage === "splash") && (
        <HeroBackground
          pointerX={px}
          pointerY={py}
          ready={homeReady || homePeek}
          minimal={isMinimal}
        />
      )}

      <HeroMetadata active={homeReady} peek={homePeek && !homeReady} />

      <div className="hero-composition relative z-10 flex min-h-[100dvh] flex-col px-[var(--gutter)] pb-16 pt-20 sm:pt-24 md:pb-20 md:pt-28">
        {/* Eyebrow */}
        <motion.p
          data-reveal=""
          initial={{ opacity: 0, y: 8, letterSpacing: "0.08em" }}
          animate={
            homeReady
              ? { opacity: 1, y: 0, letterSpacing: "0.24em" }
              : homePeek
                ? { opacity: 0.22, y: 4, letterSpacing: "0.16em" }
                : { opacity: 0, y: 8, letterSpacing: "0.08em" }
          }
          transition={{ duration: 0.65, delay: 0.18, ease: EASE_EDITORIAL }}
          className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-foreground/60 sm:mb-5 sm:text-sm"
        >
          Computação Gráfica · Design de Games
        </motion.p>

        {/* Wordmark — single line, dominant */}
        <motion.div
          className="-translate-y-3 flex flex-col items-center overflow-visible text-center sm:-translate-y-4 md:-translate-y-6"
          style={{ y: titleY, x: titlePointerX }}
        >
          <motion.h1
            ref={wordmarkAnchor}
            className="hero-wordmark relative z-[5] select-none"
            style={{ y: titlePointerY }}
          >
            <HeroWordmark
              active={homeReady}
              splashMode={splashEnabled}
              className={splashEnabled && !homeReady ? "!opacity-0" : undefined}
            />
          </motion.h1>
        </motion.div>

        {/* Stage: robot + scattered tiles — layout original */}
        <div
          className="relative mx-auto -mt-[6vw] flex w-full max-w-[1400px] flex-1 items-center justify-center sm:-mt-[7vw] lg:-mt-[8vw]"
          style={{ minHeight: "clamp(320px, 42vw, 620px)" }}
        >
          <div className="pointer-events-none absolute inset-0 hidden -translate-y-[clamp(1.5rem,5vh,3.5rem)] lg:block" aria-hidden={false}>
            {categories.map((category) => (
              <HeroProjectTile
                key={category.id}
                category={category}
                reduceMotion={!!reduceMotion}
                scrollYProgress={scrollYProgress}
                pointerX={px}
                pointerY={py}
                active={homeReady}
                peek={homePeek && !homeReady}
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            ))}
          </div>

          {/* Robot — central hero piece */}
          <motion.div
            data-reveal=""
            className="relative z-20 shrink-0 -mt-[clamp(3rem,9vh,6rem)]"
            style={{
              width: "clamp(220px, 29vw, 500px)",
              y: robotScrollY,
              x: robotPointerX,
              transformPerspective: 900,
            }}
            initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            animate={
              homeReady
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : homePeek
                  ? { opacity: 0.22, scale: 0.97, filter: "blur(3px)" }
                  : { opacity: 0, scale: 0.94, filter: "blur(8px)" }
            }
            transition={{ duration: 0.52, delay: homePeek && !homeReady ? 0 : STAGGER * 3, ease: EASE_EDITORIAL }}
          >
            <motion.div style={{ rotateY: robotRotateY, rotateX: robotRotateX, y: robotPointerY }}>
              <div className="hero-robot-wrap relative">
                <Image
                  src="/1.png"
                  alt="Obra em destaque — personagem 3D produzido por aluno"
                  width={500}
                  height={500}
                  className="hero-robot relative z-10 w-full"
                  priority
                />
                <div className="hero-robot-glow" aria-hidden="true" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile copy */}
        <motion.div
          data-reveal=""
          initial={{ opacity: 0, y: 12 }}
          animate={homeReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: DUR.editorial, delay: STAGGER * 6, ease: EASE_EDITORIAL }}
          className="relative z-20 mx-auto mt-6 max-w-md text-center lg:hidden"
        >
          <HeroHeadline className="font-display text-xl font-black uppercase leading-[0.95] tracking-tight text-foreground" />
          <p className="-translate-y-0.5 mt-3 max-w-sm text-sm leading-relaxed text-muted">{HERO_COPY}</p>
          <HeroCta active={homeReady} className="mt-3 -translate-y-2 flex justify-center" />
        </motion.div>
      </div>

      <HeroSidebar active={homeReady} peek={homePeek && !homeReady} />

      <HeroCategoryCarousel
        categories={categories}
        active={homeReady}
        peek={homePeek && !homeReady}
        hoveredId={hoveredId}
        onHover={setHoveredId}
      />
    </section>
  );
}
