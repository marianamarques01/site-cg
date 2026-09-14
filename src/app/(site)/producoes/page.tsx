import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import RevealPass from "@/components/ui/RevealPass";
import TiltCard from "@/components/ui/TiltCard";
import MediaMorph from "@/components/ui/MediaMorph";
import PageTransition from "@/components/ui/PageTransition";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { getProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Produções",
  description: "Galeria de trabalhos dos alunos de Computação Gráfica e Design de Games.",
};

const ASPECT_CLASS: Record<string, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

export default async function ProducoesPage() {
  const projects = await getProjects();

  return (
    <PageTransition>
      <PageIntro
        kicker="Galeria"
        titleLines={["Produções"]}
        description="Toda a produção autoral publicada pelos alunos: modelagem 3D, concept art, animação, ilustração e peças gráficas."
      />
      <Container className="flex flex-col gap-10 pb-[var(--section-y)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border border-border px-6 py-5">
          <p className="max-w-xl text-sm text-muted">
            É aluno dos cursos? Envie sua produção ou jogo para revisão — pode entrar na galeria ou no showcase.
          </p>
          <PrimaryButton href="/enviar-producao" cursorLabel="enviar">
            Enviar trabalho
          </PrimaryButton>
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
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-xl leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-2xl">
                    {project.title}
                  </h2>
                  <span className="shrink-0 text-xs text-faint">{project.year}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{project.student}</p>
              </Link>
            </RevealPass>
          ))}
        </div>
      </Container>
    </PageTransition>
  );
}
