"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import ScrollRail from "@/components/ui/ScrollRail";
import MediaMorph from "@/components/ui/MediaMorph";
import SectionRule from "@/components/ui/SectionRule";
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

      <ScrollRail
        itemClassName="shrink-0"
        pinnedAlign="start"
        header={
          <Container>
            <SectionHeading
              kicker={texts.kicker}
              titleLines={splitLines(texts.title)}
              description={texts.description}
              href="/producoes/jogos"
              linkLabel={texts.linkLabel}
            />
          </Container>
        }
      >
        {games.map((game) => (
          <Link
            key={game.slug}
            href={`/producoes/${game.slug}`}
            transitionTypes={["nav-forward"]}
            className="group block w-[78vw] sm:w-[52vw] md:w-[34vw] lg:w-[28vw]"
            data-cursor-label="jogar"
          >
            <TiltCard className="aspect-[4/3] w-full" max={6}>
              <MediaMorph name={`game-${game.slug}`}>
                <PlaceholderMedia
                  label={game.genre}
                  tone={game.tone}
                  kind="tilemap"
                  src={game.coverUrl}
                  alt={game.title}
                  className="h-full w-full"
                />
              </MediaMorph>
            </TiltCard>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-4xl">
                  {game.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{game.team}</p>
              </div>
              <span className="shrink-0 pt-1 text-xs text-faint">{game.year}</span>
            </div>
          </Link>
        ))}
      </ScrollRail>
    </section>
  );
}
