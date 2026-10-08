import Image from "next/image";
import Container from "@/components/ui/Container";
import PlaceholderMedia, { type PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import MediaMorph from "@/components/ui/MediaMorph";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";
import PageTransition from "@/components/ui/PageTransition";
import ActionLink from "@/components/ui/ActionLink";
import { getItchEmbedUrl, getVideoEmbedUrl } from "@/lib/video";
import { externalLinkLabel } from "@/lib/submissions/external-url";

type Fact = { label: string; value: string };

type WorkDetailProps = {
  title: string;
  year: number;
  facts: Fact[];
  description: string;
  cover: {
    morphName: string;
    label: string;
    tone: PlaceholderTone;
    src?: string;
    kind?: "tilemap";
  };
  videoUrl?: string;
  playEmbedUrl?: string;
  galleryUrls?: string[];
  externalUrl?: string;
  back: { href: string; label: string };
};

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; picture-in-picture";

function EmbedFrame({
  heading,
  note,
  src,
  title,
}: {
  heading: string;
  note?: string;
  src: string;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-medium text-foreground">{heading}</h2>
        {note ? <p className="text-xs text-faint">{note}</p> : null}
      </div>
      <div className="aspect-video w-full overflow-hidden border border-border bg-black">
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          loading="lazy"
          allow={IFRAME_ALLOW}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}

export default function WorkDetail({
  title,
  year,
  facts,
  description,
  cover,
  videoUrl,
  playEmbedUrl,
  galleryUrls = [],
  externalUrl,
  back,
}: WorkDetailProps) {
  const video = getVideoEmbedUrl(videoUrl);
  const play = getItchEmbedUrl(playEmbedUrl);

  return (
    <PageTransition>
      <Container className="flex flex-col gap-5 pb-[var(--section-y)] pt-24 sm:pt-28 md:gap-6">
        <div className="flex flex-col gap-6 md:gap-8">
          <ActionLink href={back.href} transitionType="nav-back" arrow={false} className="text-muted">
            <span aria-hidden className="mr-2">
              ←
            </span>
            {back.label}
          </ActionLink>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <MaskedLines
              as="h1"
              lines={[title]}
              className="max-w-[16ch] font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.86] text-foreground"
            />

            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-fit shrink-0 items-center gap-4 border border-border-strong px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:bg-brand hover:text-white focus-visible:border-brand focus-visible:outline-none"
              >
                {externalLinkLabel(externalUrl)}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="grid gap-10 border-t border-border pt-5 lg:grid-cols-12 lg:gap-x-14 lg:pt-6">
          {/* Mídia — na frente no celular, à direita no desktop */}
          <div className="flex flex-col gap-10 lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <MediaMorph name={cover.morphName}>
              <PlaceholderMedia
                label={cover.label}
                tone={cover.tone}
                kind={cover.kind}
                src={cover.src}
                alt={title}
                className="aspect-[297/420] w-full max-w-[34rem]"
                showCaption={false}
                interactive={false}
              />
            </MediaMorph>

            {play ? (
              <EmbedFrame
                heading="Jogue aqui"
                note="Roda no navegador. Use o botão de tela cheia para jogar melhor."
                src={play}
                title={`Jogar ${title}`}
              />
            ) : null}

            {video ? <EmbedFrame heading="Vídeo" src={video} title={`Vídeo de ${title}`} /> : null}

            {galleryUrls.length > 0 ? (
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-foreground">Galeria</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {galleryUrls.map((url, index) => (
                    <div
                      key={url}
                      className={
                        "relative aspect-[16/10] overflow-hidden border border-border" +
                        (galleryUrls.length % 2 === 1 && index === 0 ? " sm:col-span-2 sm:aspect-[16/8]" : "")
                      }
                    >
                      <Image
                        src={url}
                        alt={`${title} — imagem ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Ficha — fixa ao lado da mídia enquanto se rola */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
            <RevealPass>
              <p className="font-display text-5xl leading-none text-brand md:text-6xl">{year}</p>
            </RevealPass>

            <dl className="flex flex-col border-t border-border">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 lg:flex-col lg:items-start lg:gap-1 xl:flex-row xl:items-baseline xl:justify-between xl:gap-6"
                >
                  <dt className="text-sm text-faint">{fact.label}</dt>
                  <dd className="text-base text-foreground xl:text-right">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <p className="max-w-[60ch] text-base leading-relaxed text-muted sm:text-lg">{description}</p>
          </aside>
        </div>
      </Container>
    </PageTransition>
  );
}
