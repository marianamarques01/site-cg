import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";
import MediaUploadForm from "@/components/admin/MediaUploadForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { listApprovedMedia } from "@/lib/admin/media";
import { deleteMediaAction } from "@/app/admin/midia/actions";

export default async function AdminMediaPage() {
  await requireEditorPage();
  const items = await listApprovedMedia();

  return (
    <AdminShell
      title="Mídia"
      description="Biblioteca de imagens — use nos posts, produções e jogos."
    >
      <MediaUploadForm />

      {items.length === 0 ? (
        <p className="text-muted">Nenhum arquivo enviado ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="border border-border">
              <div className="relative aspect-video bg-void">
                <Image src={item.url} alt={item.alt ?? item.filename} fill className="object-cover" sizes="320px" />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <p className="truncate text-sm font-medium text-foreground">{item.filename}</p>
                <p className="truncate text-xs text-faint">{item.url}</p>
                <form action={deleteMediaAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-xs text-red-400 hover:underline">
                    Excluir
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
