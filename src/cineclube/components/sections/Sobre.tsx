"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { films } from "@/cineclube/data/films";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";

/**
 * SOBRE — página de zine sobre papel kraft.
 * Texto editorial + colagem com a lua, fita adesiva e anotações à margem.
 * O rolo de filme decorativo gira conforme o scroll.
 */
export function Sobre() {
  const nextFilm = films[0];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const reelRotate = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const collageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="sobre"
      ref={ref}
      className="torn-edge relative overflow-hidden bg-melies-kraft py-24 text-melies-ink md:py-32"
    >
      <div className="texture-paper absolute inset-0 opacity-50 mix-blend-multiply" aria-hidden />

      {/* rolo de filme que gira com o scroll, vazando da borda */}
      <motion.svg
        aria-hidden
        style={{ rotate: reelRotate }}
        viewBox="0 0 100 100"
        className="absolute -right-16 top-10 h-56 w-56 text-melies-ink/15 md:-right-10 md:h-80 md:w-80"
      >
        <circle cx="50" cy="50" r="46" fill="currentColor" />
        <circle cx="50" cy="50" r="8" fill="#E0BE92" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <circle
            key={angle}
            cx={50 + 26 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 26 * Math.sin((angle * Math.PI) / 180)}
            r="10"
            fill="#E0BE92"
          />
        ))}
      </motion.svg>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <SectionTitle kicker="ato um" title="Sobre nós" tone="ink" tilt={-2} />

          <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </motion.p>
          </div>

          {/* números do clube em etiquetas tortas */}
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              { n: "N", label: "sessões realizadas" },
              { n: "N", label: "reais o ingresso" },
              { n: "N", label: "oficinas realizadas" },
            ].map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
                whileInView={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, type: "spring", stiffness: 250, damping: 14 }}
                whileHover={{ rotate: i % 2 ? -3 : 3, scale: 1.06 }}
                className="bg-melies-ink px-5 py-3 text-melies-cream shadow-sticker"
              >
                <span className="block font-melies-display text-3xl text-melies-peach">{fact.n}</span>
                <span className="font-melies-typewriter text-[11px] uppercase tracking-widest">
                  {fact.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ingresso da próxima sessão */}
          {/* <motion.a
            href="#sessoes"
            initial={{ opacity: 0, y: 40, rotate: 8 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 160, damping: 14 }}
            whileHover={{ rotate: 2, scale: 1.04 }}
            className="group mt-10 flex w-full max-w-md items-stretch overflow-hidden rounded-lg bg-melies-peach text-melies-ink shadow-poster"
          >
            <span className="flex items-center border-r-2 border-dashed border-melies-ink/40 px-3 py-2.5 font-melies-display text-xl md:px-4 md:py-3 md:text-2xl">
              {nextFilm.date.split(" ")[0]}
              <span className="ml-1 text-xs md:text-sm">{nextFilm.date.split(" ")[1]}</span>
            </span>
            <span className="px-3 py-2.5 text-left md:px-4 md:py-3">
              <span className="block font-melies-typewriter text-[9px] uppercase tracking-widest opacity-70 md:text-[10px]">
                próxima sessão · {nextFilm.time}
              </span>
              <span className="block font-melies-display text-sm uppercase leading-tight md:text-lg">
                {nextFilm.title}
              </span>
            </span>
            <span className="flex items-center pr-3 text-lg transition-transform group-hover:translate-x-1 md:pr-4 md:text-xl">
              →
            </span>
          </motion.a> */}
        </div>

        {/* colagem: foto "revelada" da lua com fitas adesivas */}
        <motion.div style={{ y: collageY }} className="relative mx-auto w-fit">
          <motion.div
            initial={{ filter: "brightness(0) contrast(1.4)", opacity: 0.4 }}
            whileInView={{ filter: "brightness(1) contrast(1)", opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative rotate-3 bg-melies-cream p-4 pb-14 shadow-poster"
          >
            <span className="tape -left-8 -top-3 rotate-[-30deg]" aria-hidden />
            <span className="tape -right-8 -top-3 rotate-[28deg]" aria-hidden />
            <div className="bg-melies-purple p-6">
              <Image
                src="/cineclube/brand/mascot.png"
                alt="A lua de cartola do Cineclube Méliès"
                width={230}
                height={250}
              />
            </div>
            <p className="absolute bottom-4 left-0 w-full text-center font-melies-typewriter text-sm text-melies-ink/70">
              luário, 1902
            </p>
          </motion.div>

          {/* bilhete rabiscado por cima */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: -6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 13 }}
            className="absolute -bottom-8 -left-10 bg-melies-peach px-4 py-3 font-melies-typewriter text-xs uppercase tracking-wider text-melies-ink shadow-sticker md:-left-16"
          >
            toda quarta,
            <br />
            19h30 ✦
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
