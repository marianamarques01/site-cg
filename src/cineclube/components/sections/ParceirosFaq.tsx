"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faq, partners } from "@/cineclube/data/misc";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";

/**
 * PARCEIROS + FAQ — dividem a mesma "página de zine" roxa.
 * Parceiros como selos postais; FAQ como fichas de perguntas que abrem
 * com uma dobradinha de papel.
 */
export function ParceirosFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-melies-purple py-24 md:py-32">
      <div className="texture-paper absolute inset-0 opacity-30 mix-blend-multiply" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl gap-20 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* parceiros */}
        <div id="parceiros">
          <SectionTitle kicker="quem segura a ponta" title="Parceiros" tilt={-2} />
          <div className="mt-12 space-y-5">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, x: -60, rotate: 0 }}
                whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 1.5 : -1.5 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 130, damping: 15 }}
                whileHover={{ rotate: 0, x: 6 }}
                className="border-4 border-double border-melies-cream/50 bg-melies-grape/60 p-5"
              >
                <h3 className="font-melies-display text-xl uppercase text-melies-peach">
                  {partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dashed underline-offset-4 hover:text-melies-cream"
                    >
                      {partner.name} ↗
                    </a>
                  ) : (
                    partner.name
                  )}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-melies-cream/75">
                  {partner.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* faq */}
        <div>
          <SectionTitle kicker="antes que você pergunte" title="FAQ" tilt={1.5} />
          <div className="mt-12 space-y-4">
            {faq.map((item, i) => {
              const open = openIndex === i;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-melies-paper text-melies-ink shadow-sticker"
                  style={{ rotate: `${((i % 3) - 1) * 0.6}deg` }}
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-melies-display text-lg uppercase leading-tight md:text-xl">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: open ? 45 : 0 }}
                      className="shrink-0 font-melies-display text-2xl text-melies-purple"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-dashed border-melies-ink/25 p-5 pt-4 text-sm leading-relaxed text-melies-ink/80">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
