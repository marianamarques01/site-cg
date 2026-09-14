"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import PlaceholderMedia, {
  KIND_BY_CATEGORY,
  Wireframe,
} from "@/components/ui/PlaceholderMedia";
import RevealPass from "@/components/ui/RevealPass";
import TiltCard from "@/components/ui/TiltCard";
import MediaMorph from "@/components/ui/MediaMorph";
import type { Project } from "@/lib/mock/types";

const ASPECT_CLASS: Record<string, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

// Slight vertical offsets per column keep the grid from reading as a uniform
// tile wall. The scroll speeds below make good on what these already imply.
const OFFSET_CLASS = ["", "md:mt-14", "", "md:mt-24", "md:mt-6", ""];

/** Column scroll speeds: 1.0x, 0.88x, 1.06x, expressed as drift in px. */
const COLUMN_DRIFT = [0, 46, -28];

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8"
    >
      {projects.map((project, i) => (
        <Card
          key={project.slug}
          project={project}
          index={i}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function Card({
  project,
  index,
  scrollYProgress,
}: {
  project: Project;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduceMotion = useReducedMotion();
  const column = index % 3;
  const drift = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : COLUMN_DRIFT[column]],
  );

  // The headline over this grid is "Do wireframe ao mundo pronto." The first
  // image does exactly that, once: it arrives as a wireframe and resolves as
  // you scroll it into place. Doing it to all six would kill it.
  const resolve = useTransform(scrollYProgress, [0.12, 0.34], [1, 0]);
  const literal = index === 0;

  return (
    <motion.div
      style={{ y: drift }}
      className={`${literal ? "col-span-2 md:col-span-1" : ""} ${OFFSET_CLASS[index] ?? ""}`}
    >
      {/* Columns arrive as blocks, wiped upward — not as a six-item diagonal
          cascade of fade-ups. */}
      <RevealPass from="bottom" index={column} delay={0.04}>
        <Link
          href={`/producoes/${project.slug}`}
          transitionTypes={["nav-forward"]}
          className="group block"
          data-cursor-label="ver"
        >
          <TiltCard className={`${ASPECT_CLASS[project.aspect]} w-full`}>
            <MediaMorph name={`work-${project.slug}`}>
              <div className="relative h-full w-full">
                <PlaceholderMedia
                  label={project.category}
                  index={String(index + 1).padStart(2, "0")}
                  tone={project.tone}
                  src={project.coverUrl}
                  alt={project.title}
                  className="h-full w-full"
                />

                {literal && !reduceMotion && !project.coverUrl && (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-surface"
                    style={{ opacity: resolve }}
                  >
                    <Wireframe
                      kind={KIND_BY_CATEGORY[project.category] ?? "grid"}
                      className="absolute inset-0 h-full w-full text-foreground opacity-50"
                    />
                  </motion.div>
                )}

              </div>
            </MediaMorph>
          </TiltCard>

          <div className="mt-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-2xl">
              {project.title}
            </h3>
            <span className="shrink-0 text-xs text-faint">{project.year}</span>
          </div>
          <p className="mt-1 text-sm text-muted">{project.student}</p>
        </Link>
      </RevealPass>
    </motion.div>
  );
}
