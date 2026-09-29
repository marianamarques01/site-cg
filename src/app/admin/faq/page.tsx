import AdminShell from "@/components/admin/AdminShell";
import SortableList from "@/components/admin/SortableList";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminFaqItems } from "@/lib/admin/faq";
import { reorderFaqAction } from "@/app/admin/faq/reorder-actions";
import { deleteFaqAction } from "@/app/admin/faq/actions";

export default async function AdminFaqPage() {
  await requireEditorPage();
  const items = await listAdminFaqItems();

  return (
    <AdminShell
      title="FAQ"
      description="Perguntas frequentes exibidas na home. Arraste para reordenar."
      actions={<PrimaryButton href="/admin/faq/new">Nova pergunta</PrimaryButton>}
    >
      <SortableList
        items={items.map((item) => ({
          id: item.id,
          label: item.question,
          hint: item.answer,
          editHref: `/admin/faq/${item.id}`,
        }))}
        onReorder={reorderFaqAction}
        onDelete={deleteFaqAction}
        emptyMessage="Nenhuma pergunta cadastrada."
      />
    </AdminShell>
  );
}
