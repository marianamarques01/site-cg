import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import PageTransition from "@/components/ui/PageTransition";
import PreviewBanner from "@/components/admin/PreviewBanner";
import { requireEditorPage } from "@/lib/admin/guard";
import { findMediaUrl } from "@/lib/admin/helpers";
import { listMedia } from "@/lib/admin/media";
import { getAdminPostById } from "@/lib/admin/posts";

type PageProps = { params: Promise<{ id: string }> };

export default async function PreviewPostPage({ params }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const [post, mediaItems] = await Promise.all([getAdminPostById(id), listMedia()]);
  if (!post) notFound();

  const coverUrl = findMediaUrl(mediaItems, post.cover_image_id);
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Sem data";

  return (
    <PageTransition>
      <PreviewBanner
        status={post.status}
        editHref={`/admin/posts/${post.id}`}
        label={post.title}
      />
      <Container className="flex flex-col gap-10 pb-[var(--section-y)] pt-24 sm:pt-28 md:gap-14">
        <RevealPass from="left">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
            {post.category} · {formattedDate}
          </span>
        </RevealPass>

        <MaskedLines
          as="h1"
          lines={[post.title]}
          className="max-w-4xl font-display text-[12vw] leading-[0.88] text-foreground sm:text-[7vw] md:text-[5vw]"
        />

        <RevealPass delay={0.06}>
          <PlaceholderMedia
            label={post.category}
            tone={post.tone as "blue"}
            kind="layout"
            src={coverUrl ?? undefined}
            alt={post.title}
            className="aspect-[16/9] w-full"
            showCaption={false}
            interactive={false}
          />
        </RevealPass>

        <SectionRule />

        <div className="flex max-w-2xl flex-col gap-6">
          <p className="text-lg text-muted">{post.excerpt}</p>
          {post.body.map((paragraph, i) => (
            <RevealPass key={i} index={i} delay={0.04}>
              <p className="text-base leading-relaxed text-muted sm:text-lg">{paragraph}</p>
            </RevealPass>
          ))}
        </div>
      </Container>
    </PageTransition>
  );
}
