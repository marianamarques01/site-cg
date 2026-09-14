"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Film } from "@/cineclube/types";
import { PosterArt } from "./PosterArt";

interface FilmModalProps {
  film: Film | null;
  onClose: () => void;
}

/**
 * MODAL DO FILME — experiência tipo streaming, mas com alma de cineclube:
 * pôster gigante, ficha técnica carimbada, sinopse, curiosidades e trailer.
 * Abre como uma cortina que sobe; fecha com Esc, clique fora ou botão.
 */
export function FilmModal({ film, onClose }: FilmModalProps) {
  /* trava o scroll do body e escuta Esc enquanto aberto */
  useEffect(() => {
    if (!film) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [film, onClose]);

  return (
    <AnimatePresence>
      {film && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-melies-ink/80 backdrop-blur-sm md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalhes do filme ${film.title}`}
        >
          <motion.div
            initial={{ y: "100%", rotate: 1 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{ y: "100%", rotate: -1 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="texture-paper relative max-h-[92svh] w-full max-w-4xl overflow-y-auto bg-melies-paper text-melies-ink shadow-poster md:rounded-t-xl lg:rounded-xl"
          >
            {/* botão fechar como selo */}
            <button
              onClick={onClose}
              aria-label="Fechar detalhes do filme"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 rotate-3 items-center justify-center rounded-full bg-melies-ink font-melies-display text-lg text-melies-peach transition-transform hover:rotate-90"
            >
              ✕
            </button>

            <div className="grid gap-0 md:grid-cols-[minmax(0,320px)_1fr]">
              {/* pôster com fita adesiva */}
              <div className="relative bg-melies-purple/15 p-8 md:p-10">
                <div className="relative mx-auto max-w-[260px] -rotate-2 shadow-poster">
                  <span className="tape -top-3 left-1/2 z-10 -translate-x-1/2 rotate-2" aria-hidden />
                  <PosterArt film={film} />
                </div>
                {/* ingresso da sessão */}
                <div className="mx-auto mt-6 w-fit rotate-1 border-2 border-dashed border-melies-ink/40 bg-melies-peach px-5 py-3 text-center font-melies-typewriter text-sm uppercase tracking-wider">
                  <span className="block text-lg font-bold">{film.date} · {film.time}</span>
                  {film.room} · entrada franca
                </div>
              </div>

              {/* ficha do filme */}
              <div className="p-8 md:p-10">
                <p className="stamp mb-3 text-[10px] text-melies-purple">
                  classificação {film.rating} · {film.duration}
                </p>
                <h3 className="font-melies-display text-4xl uppercase leading-none md:text-5xl">
                  {film.title}
                </h3>
                {film.originalTitle && (
                  <p className="mt-1 font-melies-typewriter text-sm italic text-melies-ink/60">
                    ({film.originalTitle})
                  </p>
                )}
                <p className="mt-2 font-melies-typewriter text-sm uppercase tracking-wider text-melies-purple">
                  dir. {film.director} · {film.year}
                </p>

                {/* gêneros como etiquetas */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {film.genres.map((genre, i) => (
                    <span
                      key={genre}
                      className="bg-melies-navy px-3 py-1 font-melies-typewriter text-[11px] uppercase tracking-widest text-melies-cream"
                      style={{ rotate: `${(i % 3) - 1}deg` }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="mt-6 leading-relaxed">{film.synopsis}</p>

                {/* curiosidades como anotações de caderno */}
                <div className="mt-6 border-l-4 border-melies-peach bg-melies-cream/70 p-4">
                  <p className="mb-2 font-melies-display text-xl uppercase">Você sabia?</p>
                  <ul className="space-y-2">
                    {film.trivia.map((fact) => (
                      <li key={fact} className="flex gap-2 text-sm leading-relaxed">
                        <span className="text-melies-purple">✦</span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={film.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rotate-1 items-center gap-2 bg-melies-ink px-6 py-3 font-melies-typewriter text-sm uppercase tracking-widest text-melies-peach transition-transform hover:-rotate-1 hover:scale-105"
                >
                  ▶ assistir trailer
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
