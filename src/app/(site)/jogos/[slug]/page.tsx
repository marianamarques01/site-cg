import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import MediaMorph from "@/components/ui/MediaMorph";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import PageTransition from "@/components/ui/PageTransition";
import ActionLink from "@/components/ui/ActionLink";
import { getGameBySlug, getGames } from "@/lib/data/games";
import { externalLinkLabel } from "@/lib/submissions/external-url";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const games = await getGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  return { title: game?.title ?? "Jogo" };
}

export default async function GamePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) notFound();

  return (
    <PageTransition>
      <Container className="flex flex-col gap-10 pb-[var(--section-y)] pt-40 sm:pt-48 md:gap-14">
        <RevealPass from="left">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
            {game.genre} · {game.year}
          </span>
        </RevealPass>

        <MaskedLines
          as="h1"
          lines={[game.title]}
          className="max-w-4xl font-display text-[15vw] leading-[0.88] text-foreground sm:text-[9vw] md:text-[6vw]"
        />

        <RevealPass delay={0.06}>
          <p className="text-sm text-muted sm:text-base">
            {game.team} — {game.platform}
          </p>
        </RevealPass>

        <RevealPass delay={0.08}>
          <MediaMorph name={`game-${game.slug}`}>
            <PlaceholderMedia
              label={game.genre}
              tone={game.tone}
              kind="tilemap"
              src={game.coverUrl}
              alt={game.title}
              className="aspect-[16/9] w-full"
              showCaption={false}
              interactive={false}
            />
          </MediaMorph>
        </RevealPass>

        <SectionRule />

        <RevealPass>
          <p className="max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            {game.description}
          </p>
        </RevealPass>

        {game.externalUrl ? (
          <RevealPass>
            <a
              href={game.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand underline-offset-4 hover:underline"
            >
              {externalLinkLabel(game.externalUrl)} ↗
            </a>
          </RevealPass>
        ) : null}

        <RevealPass>
          <ActionLink href="/jogos" transitionType="nav-back">
            Voltar para os jogos
          </ActionLink>
        </RevealPass>
      </Container>
    </PageTransition>
  );
}
