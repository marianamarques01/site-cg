import AdminShell from "@/components/admin/AdminShell";
import FaqForm from "@/components/admin/FaqForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { createFaqAction } from "@/app/admin/faq/actions";

export default async function AdminNewFaqPage() {
  await requireEditorPage();
  return (
    <AdminShell title="Nova pergunta">
      <FaqForm action={createFaqAction} />
    </AdminShell>
  );
}
