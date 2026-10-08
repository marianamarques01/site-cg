import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import BlogPostArticle from "@/components/blog/BlogPostArticle";
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
      <BlogPostArticle
        title={post.title}
        category={post.category}
        formattedDate={formattedDate}
        tone={post.tone as "blue"}
        coverUrl={coverUrl ?? undefined}
        excerpt={post.excerpt}
        body={post.body}
        showBackLink={false}
      />
    </PageTransition>
  );
}
