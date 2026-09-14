import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import MediaMorph from "@/components/ui/MediaMorph";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import PageTransition from "@/components/ui/PageTransition";
import PreviewBanner from "@/components/admin/PreviewBanner";
import { requireEditorPage } from "@/lib/admin/guard";
import { findMediaUrl } from "@/lib/admin/helpers";
import { listMedia } from "@/lib/admin/media";
import { getAdminGameById } from "@/lib/admin/games";

type PageProps = { params: Promise<{ id: string }> };

export default async function PreviewGamePage({ params }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const [game, mediaItems] = await Promise.all([getAdminGameById(id), listMedia()]);
  if (!game) notFound();

  const coverUrl = findMediaUrl(mediaItems, game.cover_image_id);

  return (
    <PageTransition>
      <PreviewBanner
        status={game.status}
        editHref={`/admin/jogos/${game.id}`}
        label={game.title}
      />
      <Container className="flex flex-col gap-10 pb-[var(--section-y)] pt-24 sm:pt-28 md:gap-14">
        <RevealPass from="left">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
            {game.genre} · {game.platform} · {game.year}
          </span>
        </RevealPass>

        <MaskedLines
          as="h1"
          lines={[game.title]}
          className="max-w-4xl font-display text-[15vw] leading-[0.88] text-foreground sm:text-[9vw] md:text-[6vw]"
        />

        <RevealPass delay={0.06}>
          <p className="text-sm text-muted sm:text-base">{game.team}</p>
        </RevealPass>

        <RevealPass delay={0.08}>
          <MediaMorph name={`game-${game.slug}`}>
            <PlaceholderMedia
              label={game.genre}
              tone={game.tone as "blue"}
              kind="tilemap"
              src={coverUrl ?? undefined}
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
      </Container>
    </PageTransition>
  );
}
