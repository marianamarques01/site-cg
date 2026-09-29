import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetail from "@/components/work/WorkDetail";
import { getProjectBySlug, getProjects } from "@/lib/data/projects";
import { getGameBySlug, getGames } from "@/lib/data/games";

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
      <WorkDetail
        title={project.title}
        year={project.year}
        facts={[
          { label: "Autoria", value: project.student },
          { label: "Categoria", value: project.category },
        ]}
        description={project.description}
        cover={{
          morphName: `work-${project.slug}`,
          label: project.category,
          tone: project.tone,
          src: project.coverUrl,
        }}
        videoUrl={project.videoUrl}
        galleryUrls={project.galleryUrls}
        externalUrl={project.externalUrl}
        back={{ href: "/producoes", label: "Todos os projetos" }}
      />
    );
  }

  const game = await getGameBySlug(slug);
  if (!game) notFound();

  return (
    <WorkDetail
      title={game.title}
      year={game.year}
      facts={[
        { label: "Equipe", value: game.team },
        { label: "Gênero", value: game.genre },
      ]}
      description={game.description}
      cover={{
        morphName: `game-${game.slug}`,
        label: game.genre,
        tone: game.tone,
        kind: "tilemap",
        src: game.coverUrl,
      }}
      videoUrl={game.videoUrl}
      playEmbedUrl={game.playEmbedUrl}
      externalUrl={game.externalUrl}
      back={{ href: "/producoes#jogos", label: "Todos os jogos" }}
    />
  );
}
