"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import RevealPass from "@/components/ui/RevealPass";
import MaskedLines from "@/components/ui/MaskedLines";
import ActionLink from "@/components/ui/ActionLink";
import SectionRule from "@/components/ui/SectionRule";
import { DUR, EASE_EDITORIAL } from "@/lib/motion";
import { COURSE_TONE } from "@/lib/mock/courses";
import type { Course } from "@/lib/mock/types";

/**
 * The quiet stretch of the page, on purpose.
 *
 * Two blocks, enormous type, and almost nothing in motion: only the rule
 * drawing itself and the names being uncovered a line at a time. No cascade,
 * no scale. This section is what makes Jogos and the closing CTA legible as
 * peaks — a peak only exists after a pause.
 */
type CoursesSectionProps = {
  courses: Course[];
};

export default function CoursesSection({ courses }: CoursesSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="cursos" className="py-[var(--section-y)]">
      <Container>
        <RevealPass from="left" className="mb-10 md:mb-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
            Conheça os cursos
          </span>
        </RevealPass>

        <SectionRule />

        <div className="relative grid md:grid-cols-2">
          {/* The divider yields a few pixels to whichever course you're
              looking at — the two of them quietly competing for the space. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-px bg-border md:block"
            animate={{ x: reduceMotion ? 0 : hovered === 0 ? 10 : hovered === 1 ? -10 : 0 }}
            transition={{ duration: DUR.editorial, ease: EASE_EDITORIAL }}
          />

          {courses.map((course, i) => (
            <Link
              key={course.slug}
              href={`/cursos/${course.slug}`}
              transitionTypes={["nav-forward"]}
              data-cursor-label="explorar"
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden border-b border-border px-1 py-12 md:px-10 md:py-16"
            >
              {/* Replaces the chromatic glitch that used to live here. The
                  grid drifts and the course's own colour bleeds in from the
                  outer edge: warmth rather than noise, and a far better fit
                  for an identity that is architectural, not cyberpunk. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-[0.09] group-focus-visible:opacity-[0.09] motion-safe:group-hover:[animation:course-grid-drift_9s_linear_infinite]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, currentColor 0px, transparent 1px, transparent 40px, currentColor 41px), repeating-linear-gradient(90deg, currentColor 0px, transparent 1px, transparent 40px, currentColor 41px)",
                  color: COURSE_TONE[course.slug],
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{
                  background: `linear-gradient(${i === 0 ? "90deg" : "270deg"}, color-mix(in srgb, ${COURSE_TONE[course.slug]} 22%, transparent) 0%, transparent 55%)`,
                }}
              />

              <div className="relative flex flex-col gap-6">
                <MaskedLines
                  as="h3"
                  lines={[course.name]}
                  className="font-display text-[13vw] leading-[0.85] tracking-tight text-foreground sm:text-[7vw] md:text-[4.2vw]"
                />
                <RevealPass from="left" delay={0.08} className="flex flex-col gap-6">
                  <p
                    className="text-lg font-medium sm:text-xl"
                    style={{ color: COURSE_TONE[course.slug] }}
                  >
                    {course.tagline}
                  </p>
                  <p className="max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
                    {course.description}
                  </p>
                </RevealPass>
              </div>

              <span className="relative">
                <ActionLink active={hovered === i}>Conhecer o curso</ActionLink>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
