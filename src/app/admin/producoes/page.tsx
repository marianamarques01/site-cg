import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProjectListTabs from "@/components/admin/ProjectListTabs";
import AdminListTable from "@/components/admin/AdminListTable";
import StatusBadge from "@/components/admin/StatusBadge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { deleteProjectAction } from "@/app/admin/producoes/actions";
import { reorderProjectsAction } from "@/app/admin/producoes/reorder-list-actions";
import { requireEditorPage } from "@/lib/admin/guard";
import { countProjectsByStatus, listAdminProjects, type ProjectListTab } from "@/lib/admin/projects";

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const VALID_TABS = new Set<ProjectListTab>(["pending", "published", "draft", "rejected", "all"]);

function resolveTab(raw: string | undefined, pendingCount: number): ProjectListTab {
  if (raw && VALID_TABS.has(raw as ProjectListTab)) return raw as ProjectListTab;
  if (pendingCount > 0) return "pending";
  return "published";
}

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  await requireEditorPage();
  const { tab: tabRaw } = await searchParams;

  const [pending, published, draft, rejected] = await Promise.all([
    countProjectsByStatus("pending"),
    countProjectsByStatus("published"),
    countProjectsByStatus("draft"),
    countProjectsByStatus("rejected"),
  ]);

  const counts = { pending, published, draft, rejected };
  const activeTab = resolveTab(tabRaw, pending);
  const projects = await listAdminProjects(activeTab);

  return (
    <AdminShell
      title="Produções"
      description="Portfólio de trabalhos dos alunos — inclui submissões aguardando revisão."
      actions={
        <>
          <Link
            href="/admin/producoes/destaques"
            className="border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-brand hover:text-foreground"
          >
            Ordenar destaques
          </Link>
          <PrimaryButton href="/admin/producoes/new">Nova produção</PrimaryButton>
        </>
      }
    >
      <ProjectListTabs active={activeTab} counts={counts} />

      {pending > 0 ? (
        <p className="border border-amber-500/30 px-4 py-3 text-sm text-amber-200">
          {pending} submiss{pending === 1 ? "ão" : "ões"} aguardando revisão.
        </p>
      ) : null}

      {projects.length === 0 ? (
        <p className="text-muted">Nenhuma produção nesta aba.</p>
      ) : (
        <AdminListTable
          headers={["Título", "Categoria", "Status", "Destaque"]}
          minWidth="min-w-[720px]"
          sortable={activeTab === "published"}
          onReorder={reorderProjectsAction}
          onDelete={deleteProjectAction}
          rows={projects.map((project) => ({
            id: project.id,
            title: project.title,
            editHref: `/admin/producoes/${project.id}`,
            editLabel: project.status === "pending" ? "Revisar" : "Editar",
            cells: [
              <div key="title">
                <p className="font-medium">{project.title}</p>
                <p className="text-xs text-faint">{project.student}</p>
                {project.student_course ? <p className="text-xs text-faint">{project.student_course}</p> : null}
                {project.student_email ? <p className="text-xs text-faint">{project.student_email}</p> : null}
              </div>,
              <span key="c1" className="text-muted">{project.category}</span>,
              <StatusBadge key="status" status={project.status} />,
              <span key="c2" className="text-muted">{project.featured ? "Sim" : "—"}</span>,
            ],
          }))}
        />
      )}
    </AdminShell>
  );
}
