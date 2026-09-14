import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import SortableList from "@/components/admin/SortableList";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminFaqItems } from "@/lib/admin/faq";
import { reorderFaqAction } from "@/app/admin/faq/reorder-actions";

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
        }))}
        onReorder={reorderFaqAction}
        emptyMessage="Nenhuma pergunta cadastrada."
      />

      <div className="flex flex-col gap-3 border-t border-border pt-8">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/admin/faq/${item.id}`}
            className="text-sm text-brand hover:underline"
          >
            Editar: {item.question}
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
