import Image from "next/image";
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
import { getProjectGalleryMediaIds } from "@/lib/admin/gallery";
import { findMediaUrl } from "@/lib/admin/helpers";
import { listMedia } from "@/lib/admin/media";
import { getAdminProjectById } from "@/lib/admin/projects";
import { externalLinkLabel } from "@/lib/submissions/external-url";

type PageProps = { params: Promise<{ id: string }> };

export default async function PreviewProjectPage({ params }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const [project, mediaItems, galleryIds] = await Promise.all([
    getAdminProjectById(id),
    listMedia(),
    getProjectGalleryMediaIds(id),
  ]);
  if (!project) notFound();

  const coverUrl = findMediaUrl(mediaItems, project.cover_image_id);
  const galleryUrls = galleryIds
    .map((mediaId) => findMediaUrl(mediaItems, mediaId))
    .filter((url): url is string => Boolean(url));

  return (
    <PageTransition>
      <PreviewBanner
        status={project.status}
        editHref={`/admin/producoes/${project.id}`}
        label={project.title}
      />
      <Container className="flex flex-col gap-10 pb-[var(--section-y)] pt-24 sm:pt-28 md:gap-14">
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
              tone={project.tone as "blue"}
              src={coverUrl ?? undefined}
              alt={project.title}
              className="aspect-[16/9] w-full"
              showCaption={false}
              interactive={false}
            />
          </MediaMorph>
        </RevealPass>

        {galleryUrls.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {galleryUrls.map((url, index) => (
              <div key={url} className="relative aspect-[4/3] overflow-hidden border border-border">
                <Image src={url} alt={`${project.title} ${index + 1}`} fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
        ) : null}

        <SectionRule />

        <RevealPass>
          <p className="max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            {project.description}
          </p>
        </RevealPass>

        {project.external_url ? (
          <RevealPass>
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              {externalLinkLabel(project.external_url)}
              <span aria-hidden>↗</span>
            </a>
          </RevealPass>
        ) : null}
      </Container>
    </PageTransition>
  );
}
