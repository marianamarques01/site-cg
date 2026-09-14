"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { team } from "@/cineclube/data/team";
import type { TeamMember } from "@/cineclube/types";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";
import { letterboxdProfileUrl } from "@/cineclube/lib/letterboxd";

/**
 * QUEM SOMOS — carrossel de polaroids que VIRAM.
 * Frente: foto, nome, função e top 4 do Letterboxd.
 * Clique: gira e mostra bio + Letterboxd + carimbo.
 *
 * FOTOS: public/team/<id>.jpg
 * CAPAS DO TOP 4: campo `poster` em data/team.ts
 */

type Film = TeamMember["topFour"][number];

const ROTS = [-3.5, 2, -1.5, 3, -2.5, 1.5, -2];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`h-5 w-5 ${dir === "left" ? "" : "rotate-180"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  );
}

function Foto({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2"
        style={{
          background: `linear-gradient(165deg, hsl(${member.hue} 25% 80%), hsl(${member.hue} 22% 62%))`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cineclube/brand/mascot.png" alt="" className="w-2/5 opacity-50" />
        <span className="font-melies-typewriter text-[9px] uppercase tracking-[0.3em] text-melies-ink/45">
          sua foto aqui
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/cineclube/team/${member.id}.jpg`}
      alt={member.name}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover grayscale contrast-[1.08] transition-all duration-500 group-hover:grayscale-0"
    />
  );
}

function MiniPoster({ film, hue, index }: { film: Film; hue: number; index: number }) {
  const [failed, setFailed] = useState(false);
  const showImage = film.poster && !failed;
  const year = film.title.match(/\((\d{4})\)/)?.[1];

  return (
    <div
      title={film.title}
      className="relative aspect-[2/3] overflow-hidden rounded-[3px] border border-melies-ink/60 transition-transform duration-200 hover:z-10 hover:-rotate-3 hover:scale-125"
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={film.poster}
          alt={`Capa de ${film.title}`}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-0.5 p-1 text-center"
          style={{
            background: `linear-gradient(170deg, hsl(${hue + index * 35} 42% 36%), hsl(${
              hue + index * 35
            } 48% 19%))`,
          }}
        >
          <span className="font-melies-display text-[9px] uppercase leading-[1.1] text-melies-cream">
            {film.title.replace(/\s*\(\d{4}\)/, "")}
          </span>
          {year && (
            <span className="font-melies-typewriter text-[7px] tracking-widest text-melies-cream/55">
              {year}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Polaroid({
  member,
  index,
  active,
}: {
  member: TeamMember;
  index: number;
  active: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const rot = ROTS[index % ROTS.length];
  const accent = `hsl(${member.hue} 55% 38%)`;

  useEffect(() => {
    if (!active) setFlipped(false);
  }, [active]);

  return (
    <div
      className="relative w-[250px] shrink-0 snap-center [perspective:1200px] sm:w-[265px]"
      style={{ transform: `rotate(${active ? 0 : rot}deg)` }}
    >
      <span className="tape -top-3 left-1/2 z-30 -translate-x-1/2 rotate-[-5deg]" aria-hidden />

      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${member.name} — clique para virar a foto`}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="group relative h-[430px] w-full cursor-pointer [transform-style:preserve-3d]"
      >
        {/* FRENTE */}
        <div className="absolute inset-0 flex flex-col bg-melies-cream p-3 pb-4 text-melies-ink shadow-poster [backface-visibility:hidden]">
          <div className="relative aspect-square w-full overflow-hidden bg-melies-moon/40">
            <Foto member={member} />
            <span className="absolute bottom-1.5 right-1.5 rounded-full bg-melies-ink/70 px-2 py-0.5 font-melies-typewriter text-[8px] uppercase tracking-widest text-melies-cream/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              vira ✦
            </span>
          </div>

          <h3 className="mt-3 text-center font-melies-display text-2xl uppercase leading-none">
            {member.name}
          </h3>
          <p
            className="mt-1 text-center font-melies-typewriter text-[10px] uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            {member.role}
          </p>

          <div className="mt-auto pt-3">
            <div className="grid grid-cols-4 gap-1">
              {member.topFour.map((film, fi) => (
                <MiniPoster key={fi} film={film} hue={member.hue} index={fi} />
              ))}
            </div>
          </div>
        </div>

        {/* VERSO */}
        <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col bg-melies-cream p-5 text-melies-ink shadow-poster [backface-visibility:hidden]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, rgba(33,23,53,0.18) 28px)",
            }}
          />

          <p
            className="font-melies-typewriter text-[10px] uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            quem é {member.name.split(" ")[0]}?
          </p>

          <p className="relative mt-3 font-melies-typewriter text-[12.5px] leading-[28px] text-melies-ink/85">
            {member.bio}
          </p>

          <div className="relative mt-auto flex items-end justify-between gap-2">
            {member.letterboxd ? (
              <a
                href={letterboxdProfileUrl(member.letterboxd)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Letterboxd de ${member.name}`}
                className="rounded-full bg-melies-teal px-3 py-1.5 font-melies-typewriter text-[9px] uppercase tracking-widest text-melies-cream transition-transform hover:scale-110"
              >
                ●●● @{member.letterboxd}
              </a>
            ) : (
              <span />
            )}
            <span
              className="stamp rotate-[-6deg] text-[8px] opacity-60"
              style={{ color: accent }}
            >
              méliès nº {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const MIDDLE = Math.floor(team.length / 2);

export function QuemSomos() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(MIDDLE);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left, behavior });
    setActive(index);
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      const next = Math.max(0, Math.min(team.length - 1, active + dir));
      scrollToIndex(next);
    },
    [active, scrollToIndex],
  );

  // abre já no meio do carrossel (sem animação)
  useEffect(() => {
    const id = requestAnimationFrame(() => scrollToIndex(MIDDLE, "auto"));
    return () => cancelAnimationFrame(id);
  }, [scrollToIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="equipe" className="relative overflow-hidden bg-melies-grape py-24 md:py-32">
      <div className="texture-paper absolute inset-0 opacity-20 mix-blend-multiply" aria-hidden />

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute left-[5%] top-[20%] rotate-12 text-2xl text-melies-peach/40">★</span>
        <span className="absolute right-[7%] top-[14%] -rotate-6 text-lg text-melies-teal/50">★</span>
        <span className="absolute left-[10%] bottom-[12%] -rotate-12 text-xl text-melies-cream/25">★</span>
        <span className="absolute right-[4%] bottom-[24%] rotate-6 text-3xl text-melies-peach/25">★</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle kicker="a equipe" title="Quem somos" tilt={-1.5} />
          <p className="max-w-xs pb-2 text-right font-melies-typewriter text-xs uppercase tracking-wider text-melies-cream/60">
            um bando de estudante com opinião ✦<br />
            arrasta o carrossel · clique pra virar
          </p>
        </div>
      </div>

      <div className="relative mt-16 md:mt-20">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-[calc(50%-125px)] pb-6 pt-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-10 sm:px-[calc(50%-132px)]"
        >
          {team.map((member, i) => (
            <Polaroid key={member.id} member={member} index={i} active={i === active} />
          ))}
        </div>

        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-4 px-6">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={active === 0}
            aria-label="Polaroid anterior"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-melies-cream/40 bg-melies-ink/40 text-melies-cream transition-all hover:-rotate-6 hover:border-melies-peach hover:text-melies-peach disabled:opacity-30"
          >
            <Chevron dir="left" />
          </button>

          <div className="flex items-center gap-2">
            {team.map((member, i) => (
              <button
                key={member.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Ir para ${member.name}`}
                aria-current={i === active}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === active
                    ? "scale-125 bg-melies-peach"
                    : "bg-melies-cream/30 hover:bg-melies-cream/60"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            disabled={active === team.length - 1}
            aria-label="Próxima polaroid"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-melies-cream/40 bg-melies-ink/40 text-melies-cream transition-all hover:rotate-6 hover:border-melies-peach hover:text-melies-peach disabled:opacity-30"
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
