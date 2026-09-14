import { approveGameAction, rejectGameAction } from "@/app/admin/jogos/moderation-actions";
import type { AdminGame } from "@/lib/admin/games";

type GameSubmissionReviewBannerProps = {
  game: AdminGame;
};

export default function GameSubmissionReviewBanner({ game }: GameSubmissionReviewBannerProps) {
  if (game.status !== "pending") return null;

  const submittedAt = game.submitted_at
    ? new Date(game.submitted_at).toLocaleString("pt-BR")
    : null;

  return (
    <div className="flex flex-col gap-6 border border-amber-500/40 bg-amber-500/10 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-amber-300">Submissão de aluno</p>
        <p className="mt-2 text-sm text-foreground">
          {game.team}
          {game.student_course ? ` · ${game.student_course}` : ""}
          {game.student_email ? ` · ${game.student_email}` : ""}
        </p>
        {submittedAt ? <p className="mt-1 text-xs text-muted">Enviado em {submittedAt}</p> : null}
        {game.external_url ? (
          <p className="mt-2 text-xs">
            <a
              href={game.external_url}
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
        <form action={approveGameAction}>
          <input type="hidden" name="id" value={game.id} />
          <button
            type="submit"
            className="border border-brand bg-brand px-4 py-2 text-sm text-void transition-opacity hover:opacity-90"
          >
            Publicar
          </button>
        </form>

        <form action={rejectGameAction} className="flex flex-1 flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={game.id} />
          <label className="flex min-w-[240px] flex-1 flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.12em] text-faint">Motivo da rejeição</span>
            <input
              type="text"
              name="rejection_reason"
              required
              placeholder="Ex.: build não roda ou falta documentação"
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
