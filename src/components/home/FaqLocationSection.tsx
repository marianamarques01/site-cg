"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import RevealPass from "@/components/ui/RevealPass";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionRule from "@/components/ui/SectionRule";
import ActionLink from "@/components/ui/ActionLink";
import { DUR, EASE_MECH } from "@/lib/motion";
import type { FaqItem } from "@/lib/mock/faq";

const FUMEC_MAP_EMBED =
  "https://maps.google.com/maps?q=Universidade+FUMEC,+Rua+Cobre,+200,+Cruzeiro,+Belo+Horizonte,+MG&hl=pt-BR&z=15&output=embed";

const FUMEC_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Universidade+FUMEC,+Rua+Cobre,+200,+Cruzeiro,+Belo+Horizonte,+MG";

const DEFAULT_ADDRESS = [
  "Universidade FUMEC",
  "Rua Cobre, 200 — Cruzeiro",
  "Belo Horizonte, MG — CEP 30310-190",
];

type FaqLocationSectionProps = {
  items: FaqItem[];
  addressLines?: string[];
  contactEmail?: string;
  instagram?: string;
  compact?: boolean;
};

export default function FaqLocationSection({
  items: faq,
  addressLines,
  contactEmail = "criativa@fumec.br",
  instagram = "@fumeccriativa",
  compact,
}: FaqLocationSectionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const lines = addressLines?.filter(Boolean).length
    ? addressLines!.filter(Boolean)
    : DEFAULT_ADDRESS;

  return (
    <section id="faq" className={compact ? "py-6 md:py-8" : "py-[var(--section-y)]"}>
      <Container className={`flex flex-col ${compact ? "gap-6 md:gap-8" : "gap-10 md:gap-12"}`}>
        <SectionHeading
          kicker="Contato & dúvidas"
          titleLines={["Perguntas", "e campus."]}
          description="Respostas rápidas sobre os cursos e como chegar na FUMEC. Se ainda faltar algo, o formulário de contato está a um clique."
          href="/contato"
          linkLabel="Falar com a gente"
        />

        <SectionRule />

        <div
          className={
            compact
              ? "grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-12"
              : "grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20 xl:gap-24"
          }
        >
          <div className="flex flex-col">
            {faq.map((item, i) => {
              const isOpen = open === i;
              const dimmed = open !== null && !isOpen;

              return (
                <RevealPass key={item.question} index={i} from="left">
                  <div className="border-b border-border">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      data-cursor-label={isOpen ? "fechar" : "abrir"}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-start justify-between gap-6 py-5 text-left sm:py-6"
                    >
                      <span
                        className={`font-display text-2xl leading-[1.05] tracking-tight transition-colors duration-300 sm:text-3xl md:text-[1.65rem] lg:text-3xl ${
                          isOpen
                            ? "text-brand"
                            : dimmed
                              ? "text-faint"
                              : "text-foreground group-hover:text-brand group-focus-visible:text-brand"
                        }`}
                      >
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`relative mt-2 block h-4 w-4 shrink-0 transition-colors duration-300 ${
                          isOpen
                            ? "text-brand"
                            : dimmed
                              ? "text-faint"
                              : "text-foreground group-hover:text-brand group-focus-visible:text-brand"
                        }`}
                      >
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                        <span
                          className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0.05,0,1)] ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${i}`}
                          initial={
                            reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
                          }
                          animate={
                            reduceMotion
                              ? { opacity: 1 }
                              : { height: "auto", opacity: 1 }
                          }
                          exit={
                            reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: DUR.mechSlow, ease: EASE_MECH }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-xl pb-6 text-sm leading-relaxed text-muted sm:text-base">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </RevealPass>
              );
            })}
          </div>

          <div
            id="onde-estamos"
            className={compact ? "flex flex-col gap-6 lg:gap-8" : "flex flex-col gap-10 lg:gap-12"}
          >
            <RevealPass from="left" className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
                  Endereço
                </span>
                <p className="font-display text-2xl leading-[1.1] tracking-tight text-foreground sm:text-3xl">
                  {lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
                    E-mail
                  </span>
                  <a
                    href={`mailto:${contactEmail}`}
                    data-cursor="copy"
                    className="w-fit text-base text-foreground transition-colors hover:text-brand sm:text-lg"
                  >
                    {contactEmail}
                  </a>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
                    Redes
                  </span>
                  <p data-cursor="copy" className="w-fit text-base text-foreground sm:text-lg">
                    {instagram}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <ActionLink href={FUMEC_DIRECTIONS}>Abrir no Google Maps</ActionLink>
                <ActionLink href="/contato">Formulário de contato</ActionLink>
              </div>
            </RevealPass>

            <RevealPass from="bottom" delay={0.08}>
              <div className="relative overflow-hidden border border-border bg-surface">
                <iframe
                  title="Mapa — Universidade FUMEC, Rua Cobre 200, Cruzeiro, Belo Horizonte"
                  src={FUMEC_MAP_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="aspect-[4/3] w-full bg-surface-raised lg:aspect-[16/11]"
                />
              </div>
            </RevealPass>
          </div>
        </div>
      </Container>
    </section>
  );
}
