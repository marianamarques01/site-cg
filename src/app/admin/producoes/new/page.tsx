import AdminShell from "@/components/admin/AdminShell";
import ProjectForm from "@/components/admin/ProjectForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { createProjectAction } from "@/app/admin/producoes/actions";

export default async function AdminNewProjectPage() {
  await requireEditorPage();
  const mediaItems = await listMedia();

  return (
    <AdminShell title="Nova produção">
      <ProjectForm mediaItems={mediaItems} action={createProjectAction} />
    </AdminShell>
  );
}
