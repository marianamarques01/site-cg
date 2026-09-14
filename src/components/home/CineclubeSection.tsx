"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Container from "@/components/ui/Container";
import RevealPass from "@/components/ui/RevealPass";
import MaskedLines from "@/components/ui/MaskedLines";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ActionLink from "@/components/ui/ActionLink";
import Magnetic from "@/components/ui/Magnetic";
import { site as cineclubeSite } from "@/cineclube/data/site";

/** Paleta do Cineclube Méliès — acento dentro do site FUMEC Criativa. */
const M = {
  purple: "#614582",
  peach: "#ffc585",
  teal: "#089baf",
  ink: "#211735",
  cream: "#fbf4e8",
  navy: "#333268",
} as const;

/**
 * Destaque para o Cineclube Méliès — interlúdio roxo entre cursos e FAQ.
 */
export default function CineclubeSection() {
  const reduceMotion = useReducedMotion();
  const mascotRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const moonX = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 70, damping: 20 });
  const moonY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), { stiffness: 70, damping: 20 });

  const handleMascotMove = (e: React.PointerEvent) => {
    const rect = mascotRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMascotLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="cineclube"
      className="relative overflow-hidden bg-melies-purple"
    >
      <FilmStrip tone={M.ink} />

      {/* Furos na borda superior da área roxa */}
      <FilmEdge side="top" className="absolute inset-x-0 top-9 z-[1] h-3.5" />

      <div
        aria-hidden="true"
        className="texture-grain pointer-events-none absolute -inset-[50%] h-[200%] w-[200%] animate-grain opacity-[0.09] mix-blend-overlay"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 translate-x-1/4 rounded-full blur-[90px]"
        style={{
          background: `radial-gradient(circle, ${M.peach}33 0%, ${M.teal}18 45%, transparent 70%)`,
        }}
      />

      <Container className="relative z-10 py-[var(--section-y)]">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_min(28rem,38vw)] lg:gap-12">
          {/* —— Texto —— */}
          <div className="flex min-w-0 flex-col gap-6 sm:gap-7">
            <div className="flex flex-col">
              <RevealPass from="left">
                <span
                  className="text-xs font-medium uppercase tracking-[0.22em]"
                  style={{ color: M.peach }}
                >
                  Iniciativa dos alunos
                </span>
              </RevealPass>

              <MaskedLines
                as="h2"
                lines={["Cineclube", "Méliès."]}
                className="mt-2 font-display text-[14vw] leading-[0.84] text-[#fbf4e8] sm:text-[9vw] lg:text-[5.8vw]"
              />

              <RevealPass delay={0.06} className="mt-3">
                <p
                  className="font-display text-xl uppercase tracking-wide sm:text-2xl"
                  style={{ color: M.peach }}
                >
                  {cineclubeSite.tagline}
                </p>
              </RevealPass>
            </div>

            <RevealPass delay={0.1}>
              <p className="max-w-lg text-balance text-sm leading-relaxed sm:text-base" style={{ color: `${M.cream}bb` }}>
                Sessões de cinema de autor na FUMEC — debates, oficinas e uma comunidade
                apaixonada por filme. Projeto criado e mantido pelos alunos, toda semana na
                Sala Google.
              </p>
            </RevealPass>

            <RevealPass delay={0.14} className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <Magnetic className="w-fit shrink-0" strength={0.35}>
                <PrimaryButton
                  href={cineclubeSite.instagramUrl}
                  cursorLabel="explorar"
                  fillColor={M.peach}
                  className="!text-[#211735]"
                >
                  Saiba mais
                </PrimaryButton>
              </Magnetic>
              <ActionLink
                href={cineclubeSite.instagramUrl}
                className="!text-[#fbf4e8cc] hover:!text-[#ffc585]"
                cursorLabel="instagram"
              >
                {cineclubeSite.instagram}
              </ActionLink>
            </RevealPass>
          </div>

          {/* —— Mascote —— */}
          <RevealPass
            from="bottom"
            delay={0.08}
            className="relative mx-auto shrink-0 w-[min(70vw,16rem)] sm:w-[18rem] lg:mx-0 lg:w-[min(28rem,38vw)]"
          >
            <div
              ref={mascotRef}
              className="relative w-full px-4"
              onPointerMove={reduceMotion ? undefined : handleMascotMove}
              onPointerLeave={reduceMotion ? undefined : handleMascotLeave}
            >
              <div
                className="relative overflow-hidden border-2 px-3 pb-6 pt-8 sm:px-4 sm:pb-8 sm:pt-10"
                style={{
                  borderColor: M.peach,
                  background: `linear-gradient(165deg, ${M.ink}88 0%, ${M.purple}44 50%, transparent 100%)`,
                }}
              >
                <FilmEdge side="top" className="inset-x-0 h-3.5" />
                <FilmEdge side="bottom" className="inset-x-0 h-3.5" />

                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -18, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mx-auto aspect-[579/630] w-full max-w-[22rem]"
                >
                  <motion.div
                    className="relative h-full w-full"
                    style={reduceMotion ? undefined : { x: moonX, y: moonY }}
                  >
                    <Image
                      src="/cineclube/brand/mascot.png"
                      alt="Mascote do Cineclube Méliès — lua de cartola"
                      fill
                      className="object-contain drop-shadow-[0_20px_50px_rgba(33,23,53,0.55)]"
                      sizes="(max-width: 1024px) 70vw, 420px"
                      priority={false}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </RevealPass>
        </div>
      </Container>

      <FilmStrip tone={M.ink} flip />
    </section>
  );
}

/** Furos de película nas bordas — laterais ou superiores/inferiores. */
function FilmEdge({
  side,
  className = "",
}: {
  side: "left" | "right" | "top" | "bottom";
  className?: string;
}) {
  const position = {
    left: "left-0",
    right: "right-0",
    top: "top-0",
    bottom: "bottom-0",
  }[side];

  return (
    <div
      aria-hidden="true"
      className={`absolute ${position} ${className}`}
      style={{
        backgroundImage: `radial-gradient(${M.ink} 38%, transparent 44%)`,
        backgroundSize: "10px 10px",
        backgroundPosition: "center",
        opacity: 0.5,
      }}
    />
  );
}

/** Faixa de película horizontal — divisor entre seções. */
function FilmStrip({ tone, flip }: { tone: string; flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-9 w-full ${flip ? "rotate-180" : ""}`}
      style={{ background: tone }}
    >
      <div
        className="absolute inset-x-0 top-0 h-2.5"
        style={{
          backgroundImage: `radial-gradient(${M.ink} 42%, transparent 46%)`,
          backgroundSize: "18px 18px",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2.5"
        style={{
          backgroundImage: `radial-gradient(${M.ink} 42%, transparent 46%)`,
          backgroundSize: "18px 18px",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-around px-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="h-3.5 w-8 opacity-30" style={{ background: M.ink }} />
        ))}
      </div>
    </div>
  );
}
