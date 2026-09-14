"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { HeroCategory } from "@/lib/mock/categories";
import { DUR, EASE_EDITORIAL, STAGGER } from "@/lib/motion";

type HeroCategoryCarouselProps = {
  categories: HeroCategory[];
  active: boolean;
  peek?: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
};

export default function HeroCategoryCarousel({
  categories,
  active,
  peek,
  hoveredId,
  onHover,
}: HeroCategoryCarouselProps) {
  return (
    <motion.div
      data-reveal=""
      initial={{ opacity: 0, y: 16 }}
      animate={
        active ? { opacity: 1, y: 0 } : peek ? { opacity: 0.16, y: 10 } : { opacity: 0, y: 16 }
      }
      transition={{ duration: DUR.editorial, delay: STAGGER * 5, ease: EASE_EDITORIAL }}
      className="relative z-20 -mx-[var(--gutter)] mt-2 w-[calc(100%+2*var(--gutter))] -translate-y-[clamp(1rem,4vh,2.5rem)] lg:hidden"
    >
      <div
        className="flex gap-4 overflow-x-auto px-[var(--gutter)] pb-2 snap-x snap-mandatory scrollbar-none"
        aria-label="Categorias de produção"
      >
        {categories.map((category) => {
          const isHovered = hoveredId === category.id;

          return (
            <Link
              key={category.id}
              href={category.href}
              transitionTypes={["nav-forward"]}
              data-cursor-label="ver"
              className="hero-project w-[min(72vw,240px)] shrink-0 snap-center transition-transform duration-500 active:scale-[0.98]"
              onPointerEnter={() => onHover(category.id)}
              onPointerLeave={() => onHover(null)}
            >
              <motion.div
                className={clsx("hero-project-frame relative overflow-hidden aspect-[4/5] w-full")}
                animate={{ scale: isHovered ? 1.03 : 1 }}
                transition={{ duration: DUR.mech, ease: EASE_EDITORIAL }}
              >
                {category.src && (
                  <Image
                    src={category.src}
                    alt={category.label}
                    fill
                    className="object-cover"
                    sizes="72vw"
                  />
                )}
                <span className="hero-project-index">{category.id}</span>
                <div className="hero-project-label">
                  <span className="hero-project-name">{category.label}</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
      <p className="mt-3 px-[var(--gutter)] text-center text-[0.65rem] uppercase tracking-[0.18em] text-foreground/40">
        Deslize para explorar
      </p>
    </motion.div>
  );
}
