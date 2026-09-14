import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { createPostAction } from "@/app/admin/posts/actions";

export default async function AdminNewPostPage() {
  await requireEditorPage();
  const mediaItems = await listMedia();

  return (
    <AdminShell title="Novo post" description="Crie um artigo para o blog.">
      <PostForm action={createPostAction} mediaItems={mediaItems} />
    </AdminShell>
  );
}
