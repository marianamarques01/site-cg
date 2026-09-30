import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PageTransition from "@/components/ui/PageTransition";
import ProjectsIntroFigure from "@/components/producoes/ProjectsIntroFigure";
import WorkGrid from "@/components/home/WorkGrid";
import { getProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Computação Gráfica",
  description: "Modelagem 3D, concept art, animação, ilustração e peças gráficas dos alunos de Computação Gráfica da FUMEC.",
};

export default async function ComputacaoGraficaPage() {
  const projects = await getProjects();

  return (
    <PageTransition>
      <div className="relative isolate">
        <ProjectsIntroFigure />
        <PageIntro
          kicker="Projetos"
          titleLines={["Computação", "Gráfica"]}
          description="Modelagem 3D, concept art, animação, ilustração e peças gráficas produzidas ao longo do curso."
        />
      </div>

      <section id="computacao-grafica" className="scroll-mt-[calc(var(--header-offset)+1rem)] pb-[var(--section-y)]">
        <Container className="flex flex-col gap-10 md:gap-12">
          <WorkGrid projects={projects} />
        </Container>
      </section>

    </PageTransition>
  );
}
