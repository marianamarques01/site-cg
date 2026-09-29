import AdminListTable from "@/components/admin/AdminListTable";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminPosts } from "@/lib/admin/posts";
import { deletePostAction } from "@/app/admin/posts/actions";
import { reorderPostsAction } from "@/app/admin/posts/reorder-actions";

export default async function AdminPostsPage() {
  await requireEditorPage();
  const posts = await listAdminPosts();

  return (
    <AdminShell
      title="Posts"
      description="Gerencie artigos do blog — rascunhos, publicações e edições."
      actions={
        <PrimaryButton href="/admin/posts/new" cursorLabel="novo">
          Novo post
        </PrimaryButton>
      }
    >
      {posts.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-muted">Nenhum post ainda.</p>
          <PrimaryButton href="/admin/posts/new" className="mt-6">
            Criar primeiro post
          </PrimaryButton>
        </div>
      ) : (
        <AdminListTable
          headers={["Título", "Categoria", "Status", "Data"]}
          sortable
          onReorder={reorderPostsAction}
          onDelete={deletePostAction}
          rows={posts.map((post) => ({
            id: post.id,
            title: post.title,
            editHref: `/admin/posts/${post.id}`,
            cells: [
              <div key="title">
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="mt-1 text-xs text-faint">/blog/{post.slug}</p>
              </div>,
              <span key="c1" className="text-muted">{post.category}</span>,
              <StatusBadge key="status" status={post.status} />,
              <span key="c2" className="text-muted">
                {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : "—"}
              </span>,
            ],
          }))}
        />
      )}
    </AdminShell>
  );
}
