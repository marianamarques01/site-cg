import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import WorkGrid from "@/components/home/WorkGrid";
import type { Project } from "@/lib/mock/types";
import type { HomeSectionTexts } from "@/lib/supabase/database.types";
import { splitLines } from "@/lib/data/text";

type FeaturedWorkProps = {
  projects: Project[];
  texts: HomeSectionTexts;
};

export default function FeaturedWork({ projects, texts }: FeaturedWorkProps) {

  return (
    <section id="trabalhos" className="py-[var(--section-y)]">
      <Container className="flex flex-col gap-10 md:gap-12">
        <SectionHeading
          kicker={texts.kicker}
          titleLines={splitLines(texts.title)}
          description={texts.description}
          href="/producoes/computacao-grafica"
          linkLabel={texts.linkLabel}
        />

        <WorkGrid projects={projects} />
      </Container>
    </section>
  );
}
