import { approveProjectAction, rejectProjectAction } from "@/app/admin/producoes/moderation-actions";
import type { AdminProject } from "@/lib/admin/projects";

type SubmissionReviewBannerProps = {
  project: AdminProject;
};

export default function SubmissionReviewBanner({ project }: SubmissionReviewBannerProps) {
  if (project.status !== "pending") return null;

  const submittedAt = project.submitted_at
    ? new Date(project.submitted_at).toLocaleString("pt-BR")
    : null;

  return (
    <div className="flex flex-col gap-6 border border-amber-500/40 bg-amber-500/10 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-300">Submissão de aluno</p>
        <p className="mt-2 text-sm text-foreground">
          {project.student}
          {project.student_course ? ` · ${project.student_course}` : ""}
          {project.student_email ? ` · ${project.student_email}` : ""}
        </p>
        {submittedAt ? <p className="mt-1 text-xs text-muted">Enviado em {submittedAt}</p> : null}
        {project.external_url ? (
          <p className="mt-2 text-xs">
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              Ver link externo ↗
            </a>
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <form action={approveProjectAction}>
          <input type="hidden" name="id" value={project.id} />
          <button
            type="submit"
            className="border border-brand bg-brand px-4 py-2 text-sm text-void transition-opacity hover:opacity-90"
          >
            Publicar
          </button>
        </form>

        <form action={rejectProjectAction} className="flex flex-1 flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={project.id} />
          <label className="flex min-w-[240px] flex-1 flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.12em] text-faint">Motivo da rejeição</span>
            <input
              type="text"
              name="rejection_reason"
              required
              placeholder="Ex.: imagem fora do tema do curso"
              className="border-b border-border bg-transparent py-2 text-sm text-foreground outline-none focus:border-brand"
            />
          </label>
          <button
            type="submit"
            className="border border-red-500/40 px-4 py-2 text-sm text-red-300 transition-colors hover:border-red-400"
          >
            Rejeitar
          </button>
        </form>
      </div>
    </div>
  );
}
