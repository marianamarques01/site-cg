import AdminShell from "@/components/admin/AdminShell";
import SortableList from "@/components/admin/SortableList";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminHeroCategories } from "@/lib/admin/hero";
import { deleteHeroAction, reorderHeroAction } from "@/app/admin/hero/reorder-actions";
import { updateHomeTextsAction } from "@/app/admin/hero/texts-actions";
import HomeTextsForm from "@/components/admin/HomeTextsForm";
import { getSiteSettings } from "@/lib/admin/settings";
import { resolveHomeTexts } from "@/lib/data/settings";

export default async function AdminHeroPage() {
  await requireEditorPage();
  const [categories, settings] = await Promise.all([listAdminHeroCategories(), getSiteSettings()]);

  return (
    <AdminShell
      title="Página principal"
      description="Categorias flutuantes do topo e textos das seções da home."
    >
      <h2 className="font-display text-2xl text-foreground">Categorias do topo</h2>
      <p className="-mt-6 text-sm text-muted">Arraste para reordenar.</p>
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

      <div className="border-t border-border pt-10">
        <HomeTextsForm
          texts={resolveHomeTexts(settings?.home_texts)}
          ctaTitle={settings?.cta_title ?? ""}
          ctaDescription={settings?.cta_description ?? ""}
          action={updateHomeTextsAction}
        />
      </div>
    </AdminShell>
  );
}
