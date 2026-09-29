import AdminShell from "@/components/admin/AdminShell";
import GameListTabs from "@/components/admin/GameListTabs";
import GameTable from "@/components/admin/GameTable";
import { deleteGameAction } from "@/app/admin/jogos/actions";
import { reorderGamesAction } from "@/app/admin/jogos/reorder-actions";
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
  return "published";
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
        <GameTable
          games={games}
          sortable={activeTab === "published"}
          onReorder={reorderGamesAction}
          onDelete={deleteGameAction}
        />
      )}
    </AdminShell>
  );
}
