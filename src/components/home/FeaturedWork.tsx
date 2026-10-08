import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import MediaCarousel from "@/components/home/MediaCarousel";
import type { Project } from "@/lib/mock/types";
import type { HomeSectionTexts } from "@/lib/supabase/database.types";
import { splitLines } from "@/lib/data/text";

type FeaturedWorkProps = {
  projects: Project[];
  texts: HomeSectionTexts;
};

export default function FeaturedWork({ projects, texts }: FeaturedWorkProps) {
  return (
    <section id="trabalhos" className="flex flex-col gap-4 py-[var(--section-y)] md:gap-6">
      <Container>
        <SectionHeading
          kicker={texts.kicker}
          titleLines={splitLines(texts.title)}
          description={texts.description}
          href="/producoes/computacao-grafica"
          linkLabel={texts.linkLabel}
        />
      </Container>

      <MediaCarousel
        ariaLabel="Produções em destaque"
        items={projects.map((project) => ({
          key: project.slug,
          href: `/producoes/${project.slug}`,
          title: project.title,
          label: project.category,
          meta: project.student,
          year: project.year,
          tone: project.tone,
          coverUrl: project.coverUrl,
          morphName: `work-${project.slug}`,
        }))}
      />
    </section>
  );
}
