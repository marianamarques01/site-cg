"use client";

import { motion } from "framer-motion";
import { events } from "@/cineclube/data/events";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";

/**
 * AGENDA — os próximos eventos como canhotos de ingresso grampeados
 * num quadro de avisos. Cada um entra deslizando de um lado.
 */
export function Agenda() {
  return (
    <section id="agenda" className="relative overflow-hidden bg-melies-ink py-24 md:py-32">
      {/* pontinhos de cortiça */}
      <div className="texture-halftone absolute inset-0 text-melies-purple/20" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-6">
        <SectionTitle kicker="marque na agenda" title="Próximos encontros" tilt={-1} />

        <ol className="mt-14 space-y-6">
          {events.map((event, i) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: i % 2 ? 120 : -120, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 1 : -1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 110, damping: 16 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="group relative flex items-stretch overflow-hidden bg-melies-paper text-melies-ink shadow-poster"
            >
              {/* data destacável (canhoto) */}
              <div className="flex w-24 shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-melies-ink/30 bg-melies-peach py-5 md:w-28">
                <span className="font-melies-display text-4xl leading-none md:text-5xl">{event.day}</span>
                <span className="font-melies-typewriter text-xs uppercase tracking-[0.25em]">{event.month}</span>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4 md:px-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-melies-purple px-2 py-0.5 font-melies-typewriter text-[10px] uppercase tracking-widest text-melies-cream">
                    {event.tag}
                  </span>
                  <span className="font-melies-typewriter text-xs text-melies-ink/60">{event.time}</span>
                </div>
                <h3 className="font-melies-display text-xl uppercase leading-tight md:text-2xl">
                  {event.title}
                </h3>
                <p className="text-sm text-melies-ink/70">{event.description}</p>
              </div>

              {/* furo do grampo */}
              <span
                aria-hidden
                className="absolute right-4 top-3 h-2.5 w-2.5 rounded-full border-2 border-melies-ink/30 bg-melies-ink/10"
              />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
