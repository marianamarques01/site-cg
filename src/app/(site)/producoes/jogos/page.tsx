import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PageTransition from "@/components/ui/PageTransition";
import { MediaGrid } from "@/components/home/MediaCarousel";
import ProjectsIntroFigure from "@/components/producoes/ProjectsIntroFigure";
import { getGames } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Jogos",
  description: "Protótipos e jogos completos produzidos pelos alunos de Design de Games da FUMEC.",
};

export default async function JogosPage() {
  const games = await getGames();

  return (
    <PageTransition>
      <div className="relative isolate">
        <ProjectsIntroFigure />
        <PageIntro
          kicker="Projetos"
          titleLines={["Jogos"]}
          description="Protótipos e jogos completos produzidos por equipes de alunos de Design de Games."
        />
      </div>

      <section id="jogos" className="scroll-mt-[calc(var(--header-offset)+1rem)] pb-[var(--section-y)]">
        <Container>
          <MediaGrid
            ariaLabel="Jogos dos alunos"
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
        </Container>
      </section>
    </PageTransition>
  );
}
