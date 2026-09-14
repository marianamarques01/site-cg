"use client";

import { motion } from "framer-motion";
import { gallery } from "@/cineclube/data/misc";
import type { GalleryPhoto } from "@/cineclube/types";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";

/**
 * Placeholder de foto: cena abstrata duotone "revelada" em SVG.
 * Substitua por <Image> reais mantendo a moldura polaroid.
 */
function PhotoArt({ photo }: { photo: GalleryPhoto }) {
  const dark = `hsl(${photo.hue} 35% 24%)`;
  const light = `hsl(${photo.hue} 30% 62%)`;
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full" aria-hidden>
      <rect width="200" height="150" fill={light} />
      {/* plateia abstrata */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={16 + i * 25} cy={128 - (i % 3) * 7} r="12" fill={dark} />
      ))}
      {/* tela de projeção */}
      <rect x="35" y="18" width="130" height="70" fill={dark} />
      <rect x="42" y="25" width="116" height="56" fill={light} opacity="0.35" />
      {/* facho do projetor */}
      <path d="M100 110 L60 30 L140 30 Z" fill="white" opacity="0.18" />
    </svg>
  );
}

/**
 * GALERIA — mural de polaroides tortas presas com fita.
 * As fotos "revelam" (de escuro para claro) quando entram na tela,
 * como papel fotográfico no banho químico.
 */
export function Galeria() {
  return (
    <section id="galeria" className="torn-edge relative overflow-hidden bg-melies-teal py-24 md:py-32">
      <div className="texture-paper absolute inset-0 opacity-30 mix-blend-multiply" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionTitle kicker="registro dos encontros" title="Mural" tilt={2} tone="ink" />
        <p className="mt-4 max-w-md font-melies-typewriter text-sm uppercase tracking-wider text-melies-ink/70">
          fotos reveladas no improviso — cada sessão deixa uma lembrança presa aqui
        </p>

        {/* mural em colunas (masonry simples) */}
        <div className="mt-14 columns-2 gap-6 md:columns-3 lg:columns-4">
          {gallery.map((photo, i) => (
            <motion.figure
              key={photo.id}
              initial={{ opacity: 0, y: 40, filter: "brightness(0.1) sepia(1)" }}
              whileInView={{ opacity: 1, y: 0, filter: "brightness(1) sepia(0)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, delay: (i % 4) * 0.12, ease: "easeOut" }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 5 }}
              style={{ rotate: photo.rotation }}
              className="relative mb-6 break-inside-avoid bg-melies-cream p-2.5 pb-10 shadow-poster"
            >
              <span
                className="tape -top-2.5 left-1/2 -translate-x-1/2"
                style={{ rotate: `${photo.rotation * -1.5}deg` }}
                aria-hidden
              />
              <div className={i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}>
                <PhotoArt photo={photo} />
              </div>
              <figcaption className="absolute bottom-2.5 left-0 w-full px-3 text-center font-melies-typewriter text-[10px] leading-tight text-melies-ink/70">
                {photo.caption} · {photo.date}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
