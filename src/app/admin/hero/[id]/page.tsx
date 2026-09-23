import AdminShell from "@/components/admin/AdminShell";
import SavedNotice from "@/components/admin/SavedNotice";
import HeroForm from "@/components/admin/HeroForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { getAdminHeroById } from "@/lib/admin/hero";
import { updateHeroAction } from "@/app/admin/hero/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditHeroPage({ params, searchParams }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const { saved } = await searchParams;
  const [category, mediaItems] = await Promise.all([getAdminHeroById(id), listMedia()]);
  if (!category) notFound();

  return (
    <AdminShell title={`Página principal · ${category.label}`}>
      <SavedNotice show={Boolean(saved)} />
      <HeroForm category={category} mediaItems={mediaItems} action={updateHeroAction} />
    </AdminShell>
  );
}
