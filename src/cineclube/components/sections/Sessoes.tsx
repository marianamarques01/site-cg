"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { films } from "@/cineclube/data/films";
import type { Film } from "@/cineclube/types";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";
import { PosterArt } from "@/cineclube/components/films/PosterArt";
import { FilmModal } from "@/cineclube/components/films/FilmModal";

/**
 * SESSÕES DO MÊS — a parte mais importante do site.
 * Um varal de pôsteres pendurados: carrossel horizontal arrastável,
 * cada pôster balança pendurado por um "prego" e abre a ficha completa
 * (modal estilo streaming) ao clique.
 */
export function Sessoes() {
  const [selected, setSelected] = useState<Film | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* o varal anda de leve com o scroll da página (parallax horizontal) */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section
      id="sessoes"
      ref={sectionRef}
      className="relative overflow-hidden bg-melies-ink py-24 md:py-32"
    >
      {/* holofote de projeção atrás do varal */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 55%, rgba(97,69,130,0.5), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle kicker="em cartaz" title="Sessões do mês" tilt={-1.5} />
          {/* setas do carrossel */}
          <div className="flex gap-3">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scrollBy(dir as 1 | -1)}
                aria-label={dir === -1 ? "Filmes anteriores" : "Próximos filmes"}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-melies-peach font-melies-display text-xl text-melies-peach transition-all hover:-rotate-12 hover:bg-melies-peach hover:text-melies-ink"
              >
                {dir === -1 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* fio do varal */}
      <div aria-hidden className="relative mt-16">
        <svg className="absolute -top-6 left-0 h-10 w-full text-melies-peach/50" preserveAspectRatio="none" viewBox="0 0 100 10">
          <path d="M0 2 Q 50 10 100 2" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* trilho de pôsteres */}
      <motion.div style={{ x: drift }}>
        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-10 overflow-x-auto px-[max(1.5rem,calc(50vw-36rem))] pb-10 pt-4"
          style={{ scrollbarWidth: "none" }}
        >
          {films.map((film, i) => (
            <motion.button
              key={film.id}
              onClick={() => setSelected(film)}
              initial={{ opacity: 0, y: 80, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 140, damping: 15 }}
              whileHover={{ rotate: 0, y: -10, scale: 1.03 }}
              className="group relative w-[240px] shrink-0 snap-center md:w-[270px]"
              style={{ transformOrigin: "top center" }}
              aria-label={`Ver detalhes de ${film.title}`}
            >
              {/* prego + pendurador */}
              <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-melies-peach shadow" />

              <div className="overflow-hidden shadow-poster transition-shadow group-hover:shadow-poster-peach">
                <PosterArt film={film} />
              </div>

              {/* etiqueta de data pendurada no pôster */}
              <span className="absolute -right-3 top-6 rotate-6 bg-melies-peach px-3 py-1.5 font-melies-typewriter text-xs font-bold uppercase tracking-wider text-melies-ink shadow-sticker">
                {film.date} · {film.time}
              </span>

              {/* legenda */}
              <span className="mt-4 block text-center">
                <span className="block font-melies-display text-xl uppercase leading-tight text-melies-cream">
                  {film.title}
                </span>
                <span className="font-melies-typewriter text-xs uppercase tracking-widest text-melies-cream/50">
                  clique para abrir a ficha ✦
                </span>
              </span>
            </motion.button>
          ))}

          {/* cartela final do varal */}
          <div className="flex w-[240px] shrink-0 snap-center items-center justify-center">
            <p className="rotate-3 border-2 border-dashed border-melies-peach/40 p-6 text-center font-melies-typewriter text-sm uppercase tracking-widest text-melies-peach/70">
              em breve:
              <br />
              ciclo novo,
              <br />
              votado pelos
              <br />
              membros ✦
            </p>
          </div>
        </div>
      </motion.div>

      <FilmModal film={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
