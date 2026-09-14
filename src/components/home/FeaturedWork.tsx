import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WorkGrid from "@/components/home/WorkGrid";
import type { Project } from "@/lib/mock/types";

type FeaturedWorkProps = {
  projects: Project[];
};

export default function FeaturedWork({ projects }: FeaturedWorkProps) {

  return (
    <section id="trabalhos" className="py-[var(--section-y)]">
      <Container className="flex flex-col gap-10 md:gap-12">
        <SectionHeading
          kicker="Trabalhos em destaque"
          titleLines={["Projetos", "selecionados"]}
          description="Uma seleção de trabalhos de Computação Gráfica: modelagem, concept art, animação e peças gráficas produzidas ao longo do curso."
        />

        <WorkGrid projects={projects} />
      </Container>
    </section>
  );
}
