"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import clsx from "clsx";
import type { HeroCategory } from "@/lib/mock/categories";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

const PARALLAX_NEAR = -220;
const PARALLAX_FAR = -120;

type HeroProjectTileProps = {
  category: HeroCategory;
  active: boolean;
  peek?: boolean;
  reduceMotion: boolean;
  scrollYProgress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
};

export default function HeroProjectTile({
  category,
  active,
  peek,
  reduceMotion,
  scrollYProgress,
  pointerX,
  pointerY,
  hoveredId,
  onHover,
}: HeroProjectTileProps) {
  if (category.legacyMotion) {
    return (
      <LegacyProjectTile
        category={category}
        active={active}
        peek={peek}
        reduceMotion={reduceMotion}
        scrollYProgress={scrollYProgress}
        pointerX={pointerX}
        pointerY={pointerY}
        hoveredId={hoveredId}
        onHover={onHover}
      />
    );
  }

  return (
    <EditorialProjectTile
      category={category}
      active={active}
      peek={peek}
      reduceMotion={reduceMotion}
      scrollYProgress={scrollYProgress}
      pointerX={pointerX}
      pointerY={pointerY}
      hoveredId={hoveredId}
      onHover={onHover}
    />
  );
}

function LegacyProjectTile({
  category,
  active,
  peek,
  reduceMotion,
  scrollYProgress,
  pointerX,
  pointerY,
  hoveredId,
  onHover,
}: HeroProjectTileProps) {
  const isHovered = hoveredId === category.id;
  const isDimmed = hoveredId !== null && hoveredId !== category.id;

  const reach =
    PARALLAX_FAR + ((category.depth - 0.5) / 0.22) * (PARALLAX_NEAR - PARALLAX_FAR);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : reach]);
  const driftX = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : category.driftX]);
  const driftY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : category.driftY]);
  const disperse = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.86]);
  const fade = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, reduceMotion ? 1 : 0.35]);

  const reachPointer = 6 + (category.depth - 0.5) * 18;
  const pX = useTransform(pointerX, (v) => v * reachPointer);
  const pY = useTransform(pointerY, (v) => v * reachPointer);

  const zClass = category.front ? "z-30" : "z-[15]";

  return (
    <motion.div
      className={clsx("absolute", zClass)}
      style={{
        top: category.top,
        left: category.left,
        right: category.right,
        bottom: category.bottom,
        width: category.width,
        rotate: category.rotate,
        y: scrollY,
        x: driftX,
      }}
    >
      <motion.div style={{ y: driftY, scale: disperse, opacity: fade }}>
        <motion.div style={{ x: pX, y: pY }}>
          <motion.div
            data-reveal=""
            initial={{ opacity: 0, scale: 0.6, x: category.fromX, y: category.fromY }}
            animate={
              active
                ? {
                    opacity: isDimmed ? 0.68 : 1,
                    scale: 1,
                    x: "0vw",
                    y: "0vw",
                  }
                : peek
                  ? { opacity: 0.18, scale: 0.82, x: category.fromX, y: category.fromY }
                  : { opacity: 0, scale: 0.6, x: category.fromX, y: category.fromY }
            }
            transition={{
              duration: 0.62,
              delay: category.order * STAGGER,
              ease: EASE_EDITORIAL,
            }}
          >
            <Link
              href={category.href}
              transitionTypes={["nav-forward"]}
              data-cursor-label="ver"
              className="hero-project group pointer-events-auto block w-full transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-none"
              onPointerEnter={() => onHover(category.id)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(category.id)}
              onBlur={() => onHover(null)}
            >
              <motion.div
                className={clsx("hero-project-frame relative overflow-hidden", category.aspect)}
                animate={{ scale: isHovered ? 1.035 : 1 }}
                transition={{ duration: DUR.mech, ease: EASE_EDITORIAL }}
              >
                {category.src ? (
                  <Image
                    src={category.src}
                    alt={category.label}
                    fill
                    className={clsx(
                      "object-cover transition-[filter] duration-500",
                      isHovered ? "brightness-[1.08] contrast-[1.04]" : "brightness-[0.97]",
                    )}
                    sizes="(min-width: 1024px) 18vw, 40vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface" aria-hidden="true" />
                )}

                <TechProjectFrame expanded={isHovered} />
                <span className="hero-project-index">{category.id}</span>
                <div className="hero-project-label">
                  <span className="hero-project-bracket" aria-hidden="true">
                    └
                  </span>
                  <span
                    className={clsx(
                      "hero-project-name transition-opacity duration-300",
                      isHovered ? "opacity-100" : "opacity-72",
                    )}
                  >
                    {category.label}
                  </span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function EditorialProjectTile({
  category,
  active,
  peek,
  reduceMotion,
  scrollYProgress,
  pointerX,
  pointerY,
  hoveredId,
  onHover,
}: HeroProjectTileProps) {
  const isHovered = hoveredId === category.id;
  const isDimmed = hoveredId !== null && hoveredId !== category.id;

  const reach = 80 + ((category.depth - 0.5) / 0.22) * (220 - 80);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : reach]);
  const driftX = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : category.driftX]);
  const driftY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : category.driftY]);

  const reachPointer = 12 + (category.depth - 0.5) * 12;
  const pX = useTransform(pointerX, (v) => v * reachPointer);
  const pY = useTransform(pointerY, (v) => v * reachPointer);

  const floatDuration = 7 + category.order * 1.4;
  const floatDelay = category.order * 0.35;

  return (
    <motion.div
      className={clsx("absolute", category.front ? "z-30" : "z-[15]")}
      style={{
        top: category.top,
        left: category.left,
        right: category.right,
        bottom: category.bottom,
        width: category.width,
        y: scrollY,
        x: driftX,
      }}
    >
      <motion.div style={{ y: driftY }}>
        <motion.div style={{ x: pX, y: pY }}>
          <motion.div
            data-reveal=""
            initial={{
              opacity: 0,
              scale: 0.88,
              clipPath: "inset(100% 0% 0% 0%)",
              filter: "blur(4px)",
            }}
            animate={
              active
                ? {
                    opacity: isDimmed ? 0.68 : 1,
                    scale: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    filter: "blur(0px)",
                  }
                : peek
                  ? {
                      opacity: 0.14,
                      scale: 0.92,
                      clipPath: "inset(20% 0% 0% 0%)",
                      filter: "blur(2px)",
                    }
                  : {
                      opacity: 0,
                      scale: 0.88,
                      clipPath: "inset(100% 0% 0% 0%)",
                      filter: "blur(4px)",
                    }
            }
            transition={{
              duration: 0.72,
              delay: active ? category.order * STAGGER + 0.55 : category.order * STAGGER,
              ease: EASE_EDITORIAL,
            }}
          >
            <motion.div
              animate={
                reduceMotion || !active ? { y: 0 } : { y: [0, -3, 0, 4, 0] }
              }
              transition={
                reduceMotion || !active
                  ? { duration: 0 }
                  : {
                      duration: floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: floatDelay,
                    }
              }
            >
              <Link
                href={category.href}
                transitionTypes={["nav-forward"]}
                data-cursor-label="ver"
                className="hero-project group pointer-events-auto block w-full focus-visible:outline-none"
                onPointerEnter={() => onHover(category.id)}
                onPointerLeave={() => onHover(null)}
                onFocus={() => onHover(category.id)}
                onBlur={() => onHover(null)}
              >
                <motion.div
                  className={clsx("hero-project-frame relative overflow-hidden", category.aspect)}
                  animate={{
                    scale: isHovered ? 1.035 : 1,
                    rotate: isHovered ? 0 : category.rotate,
                  }}
                  transition={{ duration: DUR.mech, ease: EASE_EDITORIAL }}
                >
                  {category.src ? (
                    <Image
                      src={category.src}
                      alt={category.label}
                      fill
                      className={clsx(
                        "object-cover transition-[filter] duration-500",
                        isHovered ? "brightness-[1.08] contrast-[1.04]" : "brightness-[0.97]",
                      )}
                      sizes="(min-width: 1024px) 18vw, 40vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-surface" aria-hidden="true" />
                  )}

                  <TechProjectFrame expanded={isHovered} />
                  <span className="hero-project-index">{category.id}</span>
                  <div className="hero-project-label">
                    <span className="hero-project-bracket" aria-hidden="true">
                      └
                    </span>
                    <span
                      className={clsx(
                        "hero-project-name transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-72",
                      )}
                    >
                      {category.label}
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function TechProjectFrame({ expanded }: { expanded: boolean }) {
  return (
    <div
      className={clsx("hero-tech-frame pointer-events-none", expanded && "is-expanded")}
      aria-hidden="true"
    >
      <svg className="hero-tech-frame-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect className="hero-tech-inner" x="5.5" y="5.5" width="89" height="89" vectorEffect="non-scaling-stroke" />

        <path className="hero-tech-corner hero-tech-corner--magenta" d="M5.5 18 L5.5 5.5 L18 5.5" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-corner hero-tech-corner--cyan" d="M5.5 5.5 L11 5.5 M5.5 5.5 L5.5 11" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-node" d="M5.5 5.5 L7.5 5.5 L5.5 7.5 Z" vectorEffect="non-scaling-stroke" />

        <path className="hero-tech-corner hero-tech-corner--magenta" d="M82 5.5 L94.5 5.5 L94.5 18" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-corner hero-tech-corner--cyan" d="M94.5 5.5 L89 5.5 M94.5 5.5 L94.5 11" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-node" d="M94.5 5.5 L92.5 5.5 L94.5 7.5 Z" vectorEffect="non-scaling-stroke" />

        <path className="hero-tech-corner hero-tech-corner--magenta" d="M5.5 82 L5.5 94.5 L18 94.5" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-corner hero-tech-corner--cyan" d="M5.5 94.5 L11 94.5 M5.5 94.5 L5.5 89" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-node" d="M5.5 94.5 L7.5 94.5 L5.5 92.5 Z" vectorEffect="non-scaling-stroke" />

        <path className="hero-tech-corner hero-tech-corner--magenta" d="M82 94.5 L94.5 94.5 L94.5 82" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-corner hero-tech-corner--cyan" d="M94.5 94.5 L89 94.5 M94.5 94.5 L94.5 89" vectorEffect="non-scaling-stroke" />
        <path className="hero-tech-node" d="M94.5 94.5 L92.5 94.5 L94.5 92.5 Z" vectorEffect="non-scaling-stroke" />

        <line className="hero-tech-tick" x1="47" y1="5.5" x2="53" y2="5.5" vectorEffect="non-scaling-stroke" />
        <line className="hero-tech-tick" x1="47" y1="94.5" x2="53" y2="94.5" vectorEffect="non-scaling-stroke" />
        <line className="hero-tech-tick" x1="5.5" y1="47" x2="5.5" y2="53" vectorEffect="non-scaling-stroke" />
        <line className="hero-tech-tick" x1="94.5" y1="47" x2="94.5" y2="53" vectorEffect="non-scaling-stroke" />

        <line className="hero-tech-cross" x1="5.5" y1="50" x2="12" y2="50" vectorEffect="non-scaling-stroke" />
        <line className="hero-tech-cross" x1="88" y1="50" x2="94.5" y2="50" vectorEffect="non-scaling-stroke" />
        <line className="hero-tech-cross" x1="50" y1="5.5" x2="50" y2="12" vectorEffect="non-scaling-stroke" />
        <line className="hero-tech-cross" x1="50" y1="88" x2="50" y2="94.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <span className="hero-tech-scan" />
      <span className="hero-tech-glow" />
    </div>
  );
}
