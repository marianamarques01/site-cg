"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import RevealPass from "@/components/ui/RevealPass";
import MaskedLines from "@/components/ui/MaskedLines";
import SectionRule from "@/components/ui/SectionRule";
import ActionLink from "@/components/ui/ActionLink";
import PrimaryButton from "@/components/ui/PrimaryButton";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import MediaMorph from "@/components/ui/MediaMorph";
import PageTransition from "@/components/ui/PageTransition";
import { COURSE_TONE } from "@/lib/mock/courses";
import type { Course, CourseSlug, Game, Project } from "@/lib/mock/types";
import { DUR, EASE_MECH } from "@/lib/motion";

const ASPECT_CLASS: Record<string, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

type CoursePageContentProps = {
  course: Course;
  showcaseProjects: Project[];
  showcaseGames: Game[];
};

export default function CoursePageContent({
  course,
  showcaseProjects,
  showcaseGames,
}: CoursePageContentProps) {
  const slug = course.slug;
  const accent = COURSE_TONE[slug];
  const isGames = slug === "design-de-games";
  const showcase = isGames ? showcaseGames.slice(0, 3) : showcaseProjects.slice(0, 3);
  const showcaseHref = isGames ? "/jogos" : "/producoes";
  const showcaseLabel = isGames ? "Ver todos os jogos" : "Ver todas as produções";

  return (
    <PageTransition>
      <PageIntro
        kicker="Curso"
        titleLines={course.name.split(" ")}
        description={course.tagline}
      />

      <Container className="flex flex-col gap-16 pb-[var(--section-y)] md:gap-20">
        <SectionRule />

        <RevealPass>
          <p className="max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            {course.description}
          </p>
        </RevealPass>

        {/* Grade — same grid-drift warmth as the home CoursesSection */}
        <div className="flex flex-col gap-10">
          <SectionRule />
          <RevealPass from="left">
            <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: accent }}>
              Grade
            </span>
          </RevealPass>
          <MaskedLines
            as="h2"
            lines={["O que você", "aprende"]}
            className="font-display text-[13vw] leading-[0.85] tracking-tight text-foreground sm:text-[7vw] md:text-[4.2vw]"
          />

          <div className="relative grid gap-px border border-border sm:grid-cols-2 lg:grid-cols-3">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, currentColor 0px, transparent 1px, transparent 40px, currentColor 41px), repeating-linear-gradient(90deg, currentColor 0px, transparent 1px, transparent 40px, currentColor 41px)",
                color: accent,
              }}
            />
            {course.modules.map((module, i) => (
              <RevealPass key={module} index={i % 3} from="bottom">
                <div className="group relative flex min-h-[5.5rem] flex-col justify-end border border-border bg-surface/40 p-5 transition-colors duration-300 hover:bg-surface-raised">
                  <span className="font-display text-lg uppercase leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand">
                    {module}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </RevealPass>
            ))}
          </div>
        </div>

        {/* Showcase — productions or games */}
        <div className="flex flex-col gap-10">
          <SectionRule />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <MaskedLines
              as="h2"
              lines={[isGames ? "Jogos da turma" : "Produções da turma"]}
              className="font-display text-[10vw] leading-[0.88] tracking-tight text-foreground sm:text-5xl md:text-6xl"
            />
            <ActionLink href={showcaseHref}>{showcaseLabel}</ActionLink>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {showcase.map((item, i) => {
              const href = isGames
                ? `/jogos/${(item as Game).slug}`
                : `/producoes/${(item as Project).slug}`;
              const label = isGames
                ? (item as Game).genre
                : (item as Project).category;
              const title = item.title;
              const tone = item.tone;
              const aspect = isGames
                ? "aspect-[4/3]"
                : ASPECT_CLASS[(item as Project).aspect];

              return (
                <RevealPass key={href} index={i} from="bottom">
                  <Link
                    href={href}
                    transitionTypes={["nav-forward"]}
                    className="group block"
                    data-cursor-label="ver"
                  >
                    <MediaMorph name={isGames ? `game-${(item as Game).slug}` : `work-${(item as Project).slug}`}>
                      <PlaceholderMedia
                        label={label}
                        index={String(i + 1).padStart(2, "0")}
                        tone={tone}
                        kind={isGames ? "tilemap" : undefined}
                        src={item.coverUrl}
                        alt={title}
                        className={`${aspect} w-full`}
                      />
                    </MediaMorph>
                    <h3 className="mt-3 font-display text-xl leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand">
                      {title}
                    </h3>
                  </Link>
                </RevealPass>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="flex flex-col gap-10">
          <SectionRule />
          <RevealPass from="left">
            <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: accent }}>
              Dúvidas
            </span>
          </RevealPass>
          <CourseFaq items={course.faq} accent={accent} />
        </div>

        {/* CTA */}
        <SectionRule />
        <RevealPass className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
            Quer saber sobre matrícula, grade completa ou visitar a sala? A gente responde.
          </p>
          <PrimaryButton href="/contato" cursorLabel="falar" fillColor={accent}>
            Falar com a gente
          </PrimaryButton>
        </RevealPass>
      </Container>
    </PageTransition>
  );
}

function CourseFaq({ items, accent }: { items: { question: string; answer: string }[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = open === i;
        const dimmed = open !== null && !isOpen;

        return (
          <RevealPass key={item.question} index={i} from="left">
            <div className="border-b border-border">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`course-faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-5 text-left sm:py-6"
              >
                <span
                  className={`font-display text-2xl leading-[1.05] tracking-tight transition-colors duration-300 sm:text-3xl ${
                    isOpen
                      ? "text-brand"
                      : dimmed
                        ? "text-faint"
                        : "text-foreground group-hover:text-brand group-focus-visible:text-brand"
                  }`}
                  style={isOpen ? { color: accent } : undefined}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`relative mt-2 block h-4 w-4 shrink-0 transition-colors duration-300 ${
                    isOpen ? "" : dimmed ? "text-faint" : "text-foreground group-hover:text-brand"
                  }`}
                  style={isOpen ? { color: accent } : undefined}
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
                    id={`course-faq-${i}`}
                    initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
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
  );
}
