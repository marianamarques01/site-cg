"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { HeroCategory } from "@/lib/mock/categories";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

function isDimmed(hoveredId: string | null, categoryId: string) {
  return hoveredId !== null && hoveredId !== categoryId;
}

type HeroCategoryCarouselProps = {
  categories: HeroCategory[];
  active: boolean;
  peek?: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  /** When true, sits in the hero composition flow (no absolute offsets). */
  embedded?: boolean;
  entranceDelay?: number;
};

export default function HeroCategoryCarousel({
  categories,
  active,
  peek,
  hoveredId,
  onHover,
  embedded = false,
  entranceDelay = STAGGER * 5,
}: HeroCategoryCarouselProps) {
  return (
    <motion.div
      data-reveal=""
      initial={{ opacity: 0, y: 16 }}
      animate={
        active ? { opacity: 1, y: 0 } : peek ? { opacity: 0.16, y: 10 } : { opacity: 0, y: 16 }
      }
      transition={{ duration: DUR.editorial, delay: entranceDelay, ease: EASE_EDITORIAL }}
      className={clsx(
        "relative z-20 lg:hidden",
        embedded
          ? "-mx-[var(--gutter)] w-[calc(100%+2*var(--gutter))]"
          : "-mx-[var(--gutter)] mt-2 w-[calc(100%+2*var(--gutter))] -translate-y-[clamp(1rem,4vh,2.5rem)]",
      )}
    >
      <div
        className="flex gap-3 overflow-x-auto px-[var(--gutter)] pb-1 snap-x snap-mandatory scrollbar-none sm:gap-4"
        aria-label="Categorias de produção"
      >
        {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              transitionTypes={["nav-forward"]}
              data-cursor-label="ver"
              className={clsx(
                "hero-project w-[min(68vw,220px)] shrink-0 snap-center transition-transform duration-500 active:scale-[0.98] sm:w-[min(72vw,240px)]",
                isDimmed(hoveredId, category.id) && "hero-project--dimmed",
              )}
              onPointerEnter={() => onHover(category.id)}
              onPointerLeave={() => onHover(null)}
            >
              <div className="hero-project-frame relative aspect-[4/5] w-full overflow-hidden">
                {category.src && (
                  <Image
                    src={category.src}
                    alt={category.label}
                    fill
                    className="object-cover"
                    sizes="68vw"
                  />
                )}
                <span className="hero-project-index">{category.id}</span>
                <div className="hero-project-label">
                  <span className="hero-project-name">{category.label}</span>
                </div>
              </div>
            </Link>
        ))}
      </div>
      <p className="mt-2 px-[var(--gutter)] text-center text-[0.6rem] uppercase tracking-[0.16em] text-foreground/35 sm:mt-3 sm:text-[0.65rem] sm:tracking-[0.18em]">
        Deslize para explorar
      </p>
    </motion.div>
  );
}
