import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";
import SavedNotice from "@/components/admin/SavedNotice";
import { requireEditorPage } from "@/lib/admin/guard";
import { findMediaUrl } from "@/lib/admin/helpers";
import { listMedia } from "@/lib/admin/media";
import { getAdminPostById } from "@/lib/admin/posts";
import { deletePostAction, updatePostAction } from "@/app/admin/posts/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditPostPage({ params, searchParams }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const { saved } = await searchParams;
  const [post, mediaItems] = await Promise.all([getAdminPostById(id), listMedia()]);

  if (!post) notFound();

  return (
    <AdminShell title="Editar post" description={post.title}>
      <SavedNotice show={Boolean(saved)} />
      <PostForm
        post={post}
        mediaItems={mediaItems}
        currentCoverUrl={findMediaUrl(mediaItems, post.cover_image_id)}
        action={updatePostAction}
        deleteAction={deletePostAction}
      />
    </AdminShell>
  );
}
