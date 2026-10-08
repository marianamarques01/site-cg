import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionRule from "@/components/ui/SectionRule";
import MediaCarousel from "@/components/home/MediaCarousel";
import type { Game } from "@/lib/mock/types";
import type { HomeSectionTexts } from "@/lib/supabase/database.types";
import { splitLines } from "@/lib/data/text";

type GamesShowcaseProps = {
  games: Game[];
  texts: HomeSectionTexts;
};

export default function GamesShowcase({ games, texts }: GamesShowcaseProps) {
  return (
    <section id="jogos" className="pt-[var(--section-y)]">
      <SectionRule className="mb-[calc(var(--section-y)*0.75)]" />

      <div className="flex flex-col gap-4 md:gap-6">
        <Container>
          <SectionHeading
            kicker={texts.kicker}
            titleLines={splitLines(texts.title)}
            description={texts.description}
            href="/producoes/jogos"
            linkLabel={texts.linkLabel}
          />
        </Container>

        <MediaCarousel
          ariaLabel="Jogos em destaque"
          cursorLabel="jogar"
          items={games.map((game) => ({
            key: game.slug,
            href: `/producoes/${game.slug}`,
            title: game.title,
            label: game.genre,
            meta: game.team,
            year: game.year,
            tone: game.tone,
            kind: "tilemap",
            coverUrl: game.coverUrl,
            morphName: `game-${game.slug}`,
          }))}
        />
      </div>
    </section>
  );
}
