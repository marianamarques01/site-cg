import Link from "next/link";
import Image from "next/image";
import AdminShell from "@/components/admin/AdminShell";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminHeroCategories } from "@/lib/admin/hero";

export default async function AdminHeroPage() {
  await requireEditorPage();
  const categories = await listAdminHeroCategories();

  return (
    <AdminShell title="Hero" description="Categorias flutuantes do hero da home.">
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/admin/hero/${cat.id}`} className="flex gap-4 border border-border p-4 transition-colors hover:border-brand">
            {cat.image_url ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                <Image src={cat.image_url} alt="" fill className="object-cover" sizes="64px" />
              </div>
            ) : null}
            <div>
              <p className="font-medium">{cat.label}</p>
              <p className="text-sm text-muted">{cat.href}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
