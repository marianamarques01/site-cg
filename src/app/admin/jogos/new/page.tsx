import AdminShell from "@/components/admin/AdminShell";
import GameForm from "@/components/admin/GameForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { listMedia } from "@/lib/admin/media";
import { createGameAction } from "@/app/admin/jogos/actions";

export default async function AdminNewGamePage() {
  await requireEditorPage();
  const mediaItems = await listMedia();

  return (
    <AdminShell title="Novo jogo">
      <GameForm mediaItems={mediaItems} action={createGameAction} />
    </AdminShell>
  );
}
