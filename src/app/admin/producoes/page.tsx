import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProjectListTabs from "@/components/admin/ProjectListTabs";
import StatusBadge from "@/components/admin/StatusBadge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { requireEditorPage } from "@/lib/admin/guard";
import { countProjectsByStatus, listAdminProjects, type ProjectListTab } from "@/lib/admin/projects";

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const VALID_TABS = new Set<ProjectListTab>(["pending", "published", "draft", "rejected", "all"]);

function resolveTab(raw: string | undefined, pendingCount: number): ProjectListTab {
  if (raw && VALID_TABS.has(raw as ProjectListTab)) return raw as ProjectListTab;
  if (pendingCount > 0) return "pending";
  return "all";
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
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Destaque</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-4">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-faint">{project.student}</p>
                    {project.student_course ? (
                      <p className="text-xs text-faint">{project.student_course}</p>
                    ) : null}
                    {project.student_email ? (
                      <p className="text-xs text-faint">{project.student_email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-muted">{project.category}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-4 text-muted">{project.featured ? "Sim" : "—"}</td>
                  <td className="px-4 py-4">
                    <Link href={`/admin/producoes/${project.id}`} className="text-brand hover:underline">
                      {project.status === "pending" ? "Revisar" : "Editar"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
