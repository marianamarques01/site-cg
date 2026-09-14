"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import Magnetic from "@/components/ui/Magnetic";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { EASE_EDITORIAL } from "@/lib/motion";

/** The three brand paths, same geometry as Logo.tsx. */
const PATHS = [
  "M225.703 0.744127C227.106 0.558245 228.675 0.470957 230.093 0.401985C307.421 -3.35938 364.013 19.2362 420.832 69.8463C226.599 126.506 167.769 272.496 168.167 458.298C168.085 465.922 168.509 474.392 168.739 482.075C143.394 474.519 112.942 456.876 92.4968 440.415C41.3957 399.427 8.67282 339.792 1.53624 274.646C-5.82123 208.907 13.4492 142.959 55.0398 91.5434C98.4176 37.7344 157.569 7.99951 225.703 0.744127Z",
  "M380.155 301.233C417.593 299.055 450.079 305.71 485.08 318.2C480.261 334.31 473.829 349.892 465.881 364.71C433.287 425.41 380.86 465.979 315.404 485.708C282.484 495.062 251.172 496.733 217.327 493.155C231.625 395.528 270.04 309.11 380.155 301.233Z",
  "M459.535 142.025C460.723 141.76 469.575 141.431 471.346 141.342C485.716 167.152 493.74 207.512 495.011 236.821C463.564 228.182 410.688 227.568 378.368 233.667C313.97 245.817 265.726 278.503 228.612 331.795C222.364 341.165 217.084 351.009 212.147 361.117C238.584 229.47 325.378 152.738 459.535 142.025Z",
];

type CtaSectionProps = {
  titleLines?: string[];
  description?: string;
};

const DEFAULT_TITLE = ["Pronto para", "entrar em cena?"];

export default function CtaSection({ titleLines, description }: CtaSectionProps) {
  const lines = titleLines?.length ? titleLines : DEFAULT_TITLE;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-[var(--section-y)]">
      <SectionRule className="absolute inset-x-0 top-0" />

      {/* The mark that opened the site comes back and settles.
          It used to be a decorative logo spinning at 5% opacity for no
          reason; now it closes the loop — the page opens with the mark being
          composed and ends with it arriving at rest, at the same angle it
          found in the splash. That's what turns a set of effects into a
          narrative. */}
      <motion.svg
        viewBox="0 0 496 495"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] sm:-right-16 sm:-top-16"
        initial={{ opacity: 0.04, scale: 0.78, rotate: -22 }}
        whileInView={{ opacity: 0.12, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: reduceMotion ? 0.01 : 1.1,
          ease: EASE_EDITORIAL,
        }}
      >
        {PATHS.map((d, i) => (
          <path key={i} d={d} fill="var(--color-brand)" />
        ))}
      </motion.svg>

      <Container className="relative flex flex-col gap-10">
        <RevealPass from="left">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
            Computação Gráfica · Design de Games
          </span>
        </RevealPass>

        {/* At 7vw, a block fade is a waste of a headline. */}
        <MaskedLines
          as="h2"
          lines={lines}
          className="max-w-4xl font-display text-[15vw] leading-[0.85] text-foreground sm:text-[9vw] md:text-[7vw]"
        />

        <RevealPass
          delay={0.1}
          className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
            {description ??
              "Imagem ou jogo: duas formações na FUMEC, um estúdio compartilhado. Escolhe a tua e vê de perto como a turma produz."}
          </p>
          <Magnetic className="shrink-0" strength={0.4}>
            <PrimaryButton href="#cursos" cursorLabel="explorar">
              Conhecer os cursos
            </PrimaryButton>
          </Magnetic>
        </RevealPass>
      </Container>
    </section>
  );
}
