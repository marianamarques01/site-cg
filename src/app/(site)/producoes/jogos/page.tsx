import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import RevealPass from "@/components/ui/RevealPass";
import MediaMorph from "@/components/ui/MediaMorph";
import PageTransition from "@/components/ui/PageTransition";
import MaskedLines from "@/components/ui/MaskedLines";
import ActionLink from "@/components/ui/ActionLink";
import ProjectsCourseBadge from "@/components/producoes/ProjectsCourseBadge";
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
        <Container className="flex flex-col gap-16 sm:gap-20">
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
