import AdminShell from "@/components/admin/AdminShell";
import SortableList from "@/components/admin/SortableList";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminHeroCategories } from "@/lib/admin/hero";
import { deleteHeroAction, reorderHeroAction } from "@/app/admin/hero/reorder-actions";

export default async function AdminHeroPage() {
  await requireEditorPage();
  const categories = await listAdminHeroCategories();

  return (
    <AdminShell
      title="Página principal"
      description="Categorias flutuantes do topo da home. Arraste para reordenar."
    >
      <SortableList
        items={categories.map((cat) => ({
          id: cat.id,
          label: cat.label,
          hint: cat.href,
          editHref: `/admin/hero/${cat.id}`,
          thumbUrl: cat.image_url,
        }))}
        onReorder={reorderHeroAction}
        onDelete={deleteHeroAction}
        emptyMessage="Nenhuma categoria cadastrada."
      />
    </AdminShell>
  );
}
