import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import SortableList from "@/components/admin/SortableList";
import { requireEditorPage } from "@/lib/admin/guard";
import { listFeaturedAdminProjects } from "@/lib/admin/projects";
import { reorderFeaturedAction } from "@/app/admin/producoes/reorder-actions";

export default async function AdminFeaturedProjectsPage() {
  await requireEditorPage();
  const projects = await listFeaturedAdminProjects();

  return (
    <AdminShell
      title="Destaques da home"
      description="Ordem dos trabalhos na seção Trabalhos em destaque."
      actions={
        <Link
          href="/admin/producoes"
          className="border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-brand hover:text-foreground"
        >
          Todas as produções
        </Link>
      }
    >
      <SortableList
        items={projects.map((project) => ({
          id: project.id,
          label: project.title,
          hint: `${project.student} · ${project.category}`,
        }))}
        onReorder={reorderFeaturedAction}
        emptyMessage="Nenhuma produção marcada como destaque. Edite uma produção e ative “Destaque na home”."
      />
    </AdminShell>
  );
}
