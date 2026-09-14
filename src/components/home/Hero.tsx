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
import { withBasePath } from "@/lib/base-path";
import {
  DUR,
  EASE_EDITORIAL,
  HERO_HOME_ENTRANCE_DELAY,
  HERO_ROBOT_REVEAL_DUR,
  HERO_ROBOT_SPLASH_DELAY,
  SPRING_POINTER,
  STAGGER,
} from "@/lib/motion";

const ROBOT_STAGE = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 56,
    rotateX: 16,
    rotateY: -8,
    filter: "blur(14px)",
  },
  peek: {
    opacity: 0.2,
    scale: 0.9,
    y: 28,
    rotateX: 9,
    rotateY: -4,
    filter: "blur(5px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    filter: "blur(0px)",
  },
} as const;

type HeroProps = {
  categories?: HeroCategory[];
};

export default function Hero({ categories = HERO_CATEGORIES }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { stage, homePeek, homeReady, handoffDone, splashEnabled, introPending } =
    useIntro();
  const settled = !introPending && (handoffDone || !splashEnabled);
  const robotPeek = !splashEnabled && homePeek && !settled;
  const robotSnap = !!reduceMotion;
  const fromSplash = splashEnabled && settled;
  /** Robot entrance fires once splash is done — not during overlay. */
  const robotEntrance = !splashEnabled || handoffDone;
  const robotFull = robotEntrance && (settled || !splashEnabled);
  const entrance = (offset: number) =>
    reduceMotion ? 0 : fromSplash ? HERO_HOME_ENTRANCE_DELAY + offset : offset;
  const { isMinimal } = useVisualMode();
  const wordmarkAnchor = useIntroAnchor("wordmark");
  const eyebrowAnchor = useIntroAnchor("eyebrow");
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
      {!(introPending || (splashEnabled && stage === "splash")) && (
        <HeroBackground
          pointerX={px}
          pointerY={py}
          ready={settled || homePeek}
          minimal={isMinimal}
        />
      )}

      <HeroMetadata active={settled} peek={homePeek && !settled} />

      <div className="hero-composition relative z-10 flex min-h-[100dvh] flex-col px-[var(--gutter)] pb-8 sm:pb-12 md:pb-20 lg:pb-16">
        {/* Eyebrow */}
        <motion.p
          ref={eyebrowAnchor}
          data-reveal=""
          initial={{ opacity: 0, y: 8, letterSpacing: "0.08em" }}
          animate={
            settled
              ? { opacity: 1, y: 0, letterSpacing: "0.24em" }
              : !splashEnabled && homePeek
                ? { opacity: 0.22, y: 4, letterSpacing: "0.16em" }
                : { opacity: 0, y: 8, letterSpacing: "0.08em" }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            delay: entrance(0.1),
            ease: EASE_EDITORIAL,
          }}
          className="mb-2 text-center text-[0.65rem] font-medium uppercase tracking-[0.18em] text-foreground/55 sm:mb-5 sm:text-sm sm:tracking-[0.2em]"
        >
          Computação Gráfica · Design de Games
        </motion.p>

        {/* Wordmark — single line, dominant */}
        <motion.div
          className="flex flex-col items-center overflow-visible text-center sm:-translate-y-4 md:-translate-y-6"
          style={{ y: titleY, x: titlePointerX }}
        >
          <motion.h1
            ref={wordmarkAnchor}
            className="hero-wordmark relative z-[5] select-none"
            style={{ y: titlePointerY }}
          >
            <HeroWordmark
              active={settled}
              delay={fromSplash ? 0.18 : 0.28}
              splashMode={splashEnabled && !handoffDone}
              className={splashEnabled && !handoffDone ? "!opacity-0" : undefined}
            />
          </motion.h1>
        </motion.div>

        {/* Stage: robot + scattered tiles — layout original */}
        <div
          className="relative mx-auto -mt-2 flex w-full max-w-[1400px] items-center justify-center sm:-mt-[7vw] lg:-mt-[8vw] lg:flex-1"
          style={{ minHeight: "clamp(200px, 38vw, 620px)" }}
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
            className="hero-robot-stage relative z-20 mx-auto shrink-0"
            style={{
              y: robotScrollY,
              x: robotPointerX,
              transformPerspective: 900,
            }}
          >
            <motion.div
              className="origin-[50%_88%]"
              variants={ROBOT_STAGE}
              initial="hidden"
              animate={
                !robotEntrance
                  ? "hidden"
                  : robotFull
                    ? "visible"
                    : robotPeek
                      ? "peek"
                      : "hidden"
              }
              transition={
                robotSnap
                  ? { duration: 0 }
                  : {
                      duration: HERO_ROBOT_REVEAL_DUR,
                      delay: fromSplash
                        ? HERO_ROBOT_SPLASH_DELAY
                        : entrance(homePeek ? 0 : STAGGER * 3),
                      ease: EASE_EDITORIAL,
                    }
              }
            >
              <motion.div style={{ rotateY: robotRotateY, rotateX: robotRotateX, y: robotPointerY }}>
                <div className="hero-robot-wrap relative">
                  <motion.div
                    className="hero-robot-glow"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.55 }}
                    animate={{
                      opacity: robotFull ? 1 : 0,
                      scale: robotFull ? 1 : 0.75,
                    }}
                    transition={
                      robotSnap
                        ? { duration: 0 }
                        : {
                            duration: HERO_ROBOT_REVEAL_DUR,
                            delay: fromSplash
                              ? HERO_ROBOT_SPLASH_DELAY + 0.14
                              : entrance(homePeek ? 0.14 : STAGGER * 3 + 0.18),
                            ease: EASE_EDITORIAL,
                          }
                    }
                  />
                  <Image
                    src={withBasePath("/1.png")}
                    alt="Obra em destaque — personagem 3D produzido por aluno"
                    width={500}
                    height={500}
                    className="hero-robot relative z-10 w-full"
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile copy + carousel — stacked below robot */}
        <div className="relative z-20 mt-4 flex flex-col gap-5 sm:mt-6 lg:hidden">
          <motion.div
            data-reveal=""
            initial={{ opacity: 0, y: 12 }}
            animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: reduceMotion ? 0 : DUR.editorial,
              delay: entrance(STAGGER * 6),
              ease: EASE_EDITORIAL,
            }}
            className="mx-auto max-w-md text-center"
          >
            <HeroHeadline className="flex flex-col gap-1.5 font-display text-[clamp(1.35rem,5.5vw,1.75rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground sm:gap-2" />
            <p className="mt-2.5 text-pretty text-[0.8125rem] leading-relaxed text-muted">{HERO_COPY}</p>
            <HeroCta active={settled} delay={entrance(STAGGER * 7)} className="mt-4 flex justify-center" />
          </motion.div>

          <HeroCategoryCarousel
            categories={categories}
            active={settled}
            peek={homePeek && !settled}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            entranceDelay={entrance(STAGGER * 5)}
            embedded
          />
        </div>
      </div>

      <HeroSidebar active={settled} peek={homePeek && !settled} entranceDelay={entrance(STAGGER * 6)} />
    </section>
  );
}
