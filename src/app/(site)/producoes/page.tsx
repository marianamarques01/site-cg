import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import RevealPass from "@/components/ui/RevealPass";
import TiltCard from "@/components/ui/TiltCard";
import MediaMorph from "@/components/ui/MediaMorph";
import PageTransition from "@/components/ui/PageTransition";
import MaskedLines from "@/components/ui/MaskedLines";
import ActionLink from "@/components/ui/ActionLink";
import SectionRule from "@/components/ui/SectionRule";
import ProjectsTrackOverview from "@/components/producoes/ProjectsTrackOverview";
import ProjectsCourseBadge from "@/components/producoes/ProjectsCourseBadge";
import ProjectsIntroFigure from "@/components/producoes/ProjectsIntroFigure";
import { getProjects } from "@/lib/data/projects";
import { getGames } from "@/lib/data/games";
import { COURSE_TONE } from "@/lib/mock/courses";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Galeria de trabalhos e showcase de jogos dos alunos de Computação Gráfica e Design de Games.",
};

const ASPECT_CLASS: Record<string, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

export default async function ProducoesPage() {
  const [projects, games] = await Promise.all([getProjects(), getGames()]);

  return (
    <PageTransition>
      <div className="relative isolate">
        <ProjectsIntroFigure />
        <PageIntro
          kicker="Galeria"
          titleLines={["Projetos"]}
          description="Dois cursos, uma vitrine: produções visuais de Computação Gráfica e jogos de Design de Games."
        />
      </div>

      <Container className="flex flex-col gap-10 pb-12 md:gap-12">
        <ProjectsTrackOverview projectCount={projects.length} gameCount={games.length} />
      </Container>

      <section id="computacao-grafica" className="scroll-mt-[calc(var(--header-offset)+1rem)] pb-[var(--section-y)]">
        <Container className="flex flex-col gap-10 md:gap-12">
          <SectionRule />
          <div className="grid gap-6 md:grid-cols-[1fr_min(28rem,38%)] md:items-end md:gap-x-12 lg:gap-x-16">
            <div className="flex flex-col gap-6">
              <RevealPass from="left">
                <span
                  className="text-xs font-medium uppercase tracking-[0.2em]"
                  style={{ color: COURSE_TONE["computacao-grafica"] }}
                >
                  Computação Gráfica
                </span>
              </RevealPass>
              <MaskedLines
                as="h2"
                lines={["Imagem, animação e concept."]}
                className="font-display text-[13vw] leading-[0.88] text-foreground sm:text-[8vw] md:text-[5.5vw] lg:text-[4.5vw]"
              />
            </div>
            <RevealPass delay={0.08}>
              <p className="max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base md:max-w-none">
                Modelagem 3D, concept art, animação, ilustração e peças gráficas produzidas ao longo
                do curso.
              </p>
            </RevealPass>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
            {projects.map((project, i) => (
              <RevealPass key={project.slug} index={i % 3} from="bottom">
                <Link
                  href={`/producoes/${project.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="group block"
                  data-cursor-label="ver"
                >
                  <TiltCard className={`${ASPECT_CLASS[project.aspect]} w-full`} max={5}>
                    <MediaMorph name={`work-${project.slug}`}>
                      <PlaceholderMedia
                        label={project.category}
                        index={String(i + 1).padStart(2, "0")}
                        tone={project.tone}
                        src={project.coverUrl}
                        alt={project.title}
                        className="h-full w-full"
                      />
                    </MediaMorph>
                  </TiltCard>
                  <div className="mt-3 flex flex-col gap-2">
                    <ProjectsCourseBadge course="computacao-grafica" />
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="font-display text-xl leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-2xl">
                        {project.title}
                      </h2>
                      <span className="shrink-0 text-xs text-faint">{project.year}</span>
                    </div>
                    <p className="text-sm text-muted">{project.student}</p>
                  </div>
                </Link>
              </RevealPass>
            ))}
          </div>
        </Container>
      </section>

      <section id="jogos" className="scroll-mt-[calc(var(--header-offset)+1rem)] pb-[var(--section-y)]">
        <Container className="flex flex-col gap-16 sm:gap-20">
          <SectionRule />
          <div className="grid gap-6 md:grid-cols-[1fr_min(28rem,38%)] md:items-end md:gap-x-12 lg:gap-x-16">
            <div className="flex flex-col gap-6">
              <RevealPass from="left">
                <span
                  className="text-xs font-medium uppercase tracking-[0.2em]"
                  style={{ color: COURSE_TONE["design-de-games"] }}
                >
                  Design de Games
                </span>
              </RevealPass>
              <MaskedLines
                as="h2"
                lines={["Jogável, jogado e julgado."]}
                className="font-display text-[13vw] leading-[0.88] text-foreground sm:text-[8vw] md:text-[5.5vw] lg:text-[4.5vw]"
              />
            </div>
            <RevealPass delay={0.08}>
              <p className="max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base md:max-w-none">
                Protótipos e jogos completos produzidos por equipes de alunos.
              </p>
            </RevealPass>
          </div>

          {games.map((game, i) => (
            <Link
              key={game.slug}
              href={`/producoes/${game.slug}`}
              transitionTypes={["nav-forward"]}
              data-cursor-label="jogar"
              className={`group grid items-center gap-6 md:grid-cols-2 md:gap-14 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <RevealPass from={i % 2 === 1 ? "left" : "bottom"}>
                <MediaMorph name={`game-${game.slug}`}>
                  <PlaceholderMedia
                    label={game.genre}
                    index={game.platform}
                    tone={game.tone}
                    kind="tilemap"
                    src={game.coverUrl}
                    alt={game.title}
                    className="aspect-[4/3] w-full"
                  />
                </MediaMorph>
              </RevealPass>
              <div className="flex flex-col gap-4">
                <ProjectsCourseBadge course="design-de-games" />
                <MaskedLines
                  as="h3"
                  lines={[game.title]}
                  className="font-display text-[11vw] leading-[0.9] tracking-tight text-foreground sm:text-5xl md:text-6xl"
                />
                <RevealPass delay={0.06} className="flex flex-col gap-4">
                  <p className="text-sm text-muted sm:text-base">{game.team}</p>
                  <p className="max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
                    {game.description}
                  </p>
                  <span className="mt-2 block">
                    <ActionLink>Ver jogo</ActionLink>
                  </span>
                </RevealPass>
              </div>
            </Link>
          ))}
        </Container>
      </section>
    </PageTransition>
  );
}
