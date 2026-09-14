import AdminShell from "@/components/admin/AdminShell";
import SavedNotice from "@/components/admin/SavedNotice";
import FaqForm from "@/components/admin/FaqForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { getAdminFaqById } from "@/lib/admin/faq";
import { deleteFaqAction, updateFaqAction } from "@/app/admin/faq/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditFaqPage({ params, searchParams }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const { saved } = await searchParams;
  const item = await getAdminFaqById(id);
  if (!item) notFound();

  return (
    <AdminShell title="Editar pergunta">
      <SavedNotice show={Boolean(saved)} />
      <FaqForm item={item} action={updateFaqAction} deleteAction={deleteFaqAction} />
    </AdminShell>
  );
}
