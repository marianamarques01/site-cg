import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import MediaMorph from "@/components/ui/MediaMorph";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import PageTransition from "@/components/ui/PageTransition";
import ActionLink from "@/components/ui/ActionLink";
import { getProjectBySlug, getProjects } from "@/lib/data/projects";
import { getGameBySlug, getGames } from "@/lib/data/games";
import { externalLinkLabel } from "@/lib/submissions/external-url";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const [projects, games] = await Promise.all([getProjects(), getGames()]);
  return [
    ...projects.map((project) => ({ slug: project.slug })),
    ...games.map((game) => ({ slug: game.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (project) return { title: project.title };

  const game = await getGameBySlug(slug);
  return { title: game?.title ?? "Projeto" };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (project) {
    return (
      <PageTransition>
        <Container className="flex flex-col gap-10 pb-[var(--section-y)] pt-40 sm:pt-48 md:gap-14">
          <RevealPass from="left">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
              {project.category} · {project.year}
            </span>
          </RevealPass>

          <MaskedLines
            as="h1"
            lines={[project.title]}
            className="max-w-4xl font-display text-[15vw] leading-[0.88] text-foreground sm:text-[9vw] md:text-[6vw]"
          />

          <RevealPass delay={0.06}>
            <p className="text-sm text-muted sm:text-base">{project.student}</p>
          </RevealPass>

          <RevealPass delay={0.08}>
            <MediaMorph name={`work-${project.slug}`}>
              <PlaceholderMedia
                label={project.category}
                tone={project.tone}
                src={project.coverUrl}
                alt={project.title}
                className="aspect-[16/9] w-full"
                showCaption={false}
                interactive={false}
              />
            </MediaMorph>
          </RevealPass>

          <SectionRule />

          {project.galleryUrls && project.galleryUrls.length > 0 ? (
            <RevealPass delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {project.galleryUrls.map((url, index) => (
                  <div key={url} className="relative aspect-[4/3] overflow-hidden border border-border">
                    <Image
                      src={url}
                      alt={`${project.title} — imagem ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </RevealPass>
          ) : null}

          <RevealPass>
            <p className="max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              {project.description}
            </p>
          </RevealPass>

          {project.externalUrl ? (
            <RevealPass>
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-3 border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {externalLinkLabel(project.externalUrl)}
                <span aria-hidden>↗</span>
              </a>
            </RevealPass>
          ) : null}

          <RevealPass>
            <ActionLink href="/producoes" transitionType="nav-back">
              Voltar para os projetos
            </ActionLink>
          </RevealPass>
        </Container>
      </PageTransition>
    );
  }

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
          <ActionLink href="/producoes#jogos" transitionType="nav-back">
            Voltar para os jogos
          </ActionLink>
        </RevealPass>
      </Container>
    </PageTransition>
  );
}
