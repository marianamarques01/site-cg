"use client";

import Link from "next/link";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import RevealPass from "@/components/ui/RevealPass";
import TiltCard from "@/components/ui/TiltCard";
import MediaMorph from "@/components/ui/MediaMorph";
import type { Project } from "@/lib/mock/types";

/**
 * Grade de projetos em destaque — todas as capas no mesmo formato (A3 retrato, 297×420),
 * alinhadas em colunas regulares para a seção ler como uma vitrine única.
 */
export default function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {projects.map((project, i) => (
        <li key={project.slug}>
          <Card project={project} index={i} />
        </li>
      ))}
    </ul>
  );
}

function Card({ project, index }: { project: Project; index: number }) {
  return (
    <RevealPass from="bottom" index={index % 4} delay={0.04}>
      <Link
        href={`/producoes/${project.slug}`}
        transitionTypes={["nav-forward"]}
        className="group flex flex-col gap-3 focus-visible:outline-none"
        data-cursor-label="ver"
      >
        <TiltCard className="aspect-[297/420] w-full overflow-hidden" max={4}>
          <MediaMorph name={`work-${project.slug}`}>
            <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]">
              <PlaceholderMedia
                label={project.category}
                index={String(index + 1).padStart(2, "0")}
                indexPosition="corner"
                showCaption={false}
                tone={project.tone}
                src={project.coverUrl}
                alt={project.title}
                className="h-full w-full"
              />
            </div>
          </MediaMorph>
        </TiltCard>

        <div className="flex flex-col gap-1.5 border-t border-border pt-3 transition-colors duration-300 group-hover:border-brand/60 group-focus-visible:border-brand/60">
          <div className="flex items-center justify-between gap-3 text-[0.65rem] font-medium uppercase tracking-[0.16em]">
            <span className="truncate text-brand">{project.category}</span>
            <span className="shrink-0 tabular-nums text-faint">{project.year}</span>
          </div>
          <h3 className="line-clamp-2 font-display text-lg leading-[1.05] tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-xl">
            {project.title}
          </h3>
          <p className="line-clamp-1 text-xs text-muted sm:text-sm">{project.student}</p>
        </div>
      </Link>
    </RevealPass>
  );
}
