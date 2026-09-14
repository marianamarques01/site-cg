import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import RevealPass from "@/components/ui/RevealPass";
import MaskedLines from "@/components/ui/MaskedLines";
import MediaMorph from "@/components/ui/MediaMorph";
import PageTransition from "@/components/ui/PageTransition";
import ActionLink from "@/components/ui/ActionLink";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { getGames } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Jogos",
  description: "Showcase de jogos desenvolvidos por alunos de Design de Games.",
};

export default async function JogosPage() {
  const games = await getGames();

  return (
    <PageTransition>
      <PageIntro
        kicker="Showcase"
        titleLines={["Jogos"]}
        description="Protótipos e jogos completos produzidos por equipes de alunos."
      />
      <Container className="flex flex-col gap-16 pb-[var(--section-y)] sm:gap-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border border-border px-6 py-5">
          <p className="max-w-xl text-sm text-muted">
            É aluno de Design de Games? Envie seu jogo para revisão — pode entrar neste showcase.
          </p>
          <PrimaryButton href="/enviar-producao" cursorLabel="enviar">
            Enviar trabalho
          </PrimaryButton>
        </div>

        {games.map((game, i) => (
          <Link
            key={game.slug}
            href={`/jogos/${game.slug}`}
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
              <MaskedLines
                as="h2"
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
    </PageTransition>
  );
}
