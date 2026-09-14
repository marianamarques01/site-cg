import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import StatusBadge from "@/components/admin/StatusBadge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminPosts } from "@/lib/admin/posts";

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
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-void/50 text-xs uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">{post.title}</p>
                    <p className="mt-1 text-xs text-faint">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">{post.category}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-4 text-muted">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-brand underline-offset-4 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
