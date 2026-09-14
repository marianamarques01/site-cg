import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import GameListTabs from "@/components/admin/GameListTabs";
import StatusBadge from "@/components/admin/StatusBadge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { requireEditorPage } from "@/lib/admin/guard";
import { countGamesByStatus, listAdminGames, type GameListTab } from "@/lib/admin/games";

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const VALID_TABS = new Set<GameListTab>(["pending", "published", "draft", "rejected", "all"]);

function resolveTab(raw: string | undefined, pendingCount: number): GameListTab {
  if (raw && VALID_TABS.has(raw as GameListTab)) return raw as GameListTab;
  if (pendingCount > 0) return "pending";
  return "all";
}

export default async function AdminGamesPage({ searchParams }: PageProps) {
  await requireEditorPage();
  const { tab: tabRaw } = await searchParams;

  const [pending, published, draft, rejected] = await Promise.all([
    countGamesByStatus("pending"),
    countGamesByStatus("published"),
    countGamesByStatus("draft"),
    countGamesByStatus("rejected"),
  ]);

  const counts = { pending, published, draft, rejected };
  const activeTab = resolveTab(tabRaw, pending);
  const games = await listAdminGames(activeTab);

  return (
    <AdminShell
      title="Jogos"
      description="Showcase de jogos estudantis — inclui submissões aguardando revisão."
      actions={<PrimaryButton href="/admin/jogos/new">Novo jogo</PrimaryButton>}
    >
      <GameListTabs active={activeTab} counts={counts} />

      {pending > 0 ? (
        <p className="border border-amber-500/30 px-4 py-3 text-sm text-amber-200">
          {pending} submiss{pending === 1 ? "ão" : "ões"} aguardando revisão.
        </p>
      ) : null}

      {games.length === 0 ? (
        <p className="text-muted">Nenhum jogo nesta aba.</p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Gênero</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-4">
                    <p className="font-medium">{game.title}</p>
                    <p className="text-xs text-faint">{game.team}</p>
                    {game.student_course ? (
                      <p className="text-xs text-faint">{game.student_course}</p>
                    ) : null}
                    {game.student_email ? (
                      <p className="text-xs text-faint">{game.student_email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-muted">{game.genre}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={game.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/admin/jogos/${game.id}`} className="text-brand hover:underline">
                      {game.status === "pending" ? "Revisar" : "Editar"}
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
