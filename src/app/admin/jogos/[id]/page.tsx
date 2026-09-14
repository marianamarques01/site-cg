import AdminShell from "@/components/admin/AdminShell";
import SavedNotice from "@/components/admin/SavedNotice";
import GameSubmissionReviewBanner from "@/components/admin/GameSubmissionReviewBanner";
import GameForm from "@/components/admin/GameForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { findMediaUrl } from "@/lib/admin/helpers";
import { listMedia } from "@/lib/admin/media";
import { getAdminGameById } from "@/lib/admin/games";
import { deleteGameAction, updateGameAction } from "@/app/admin/jogos/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminEditGamePage({ params, searchParams }: PageProps) {
  await requireEditorPage();
  const { id } = await params;
  const { saved, error } = await searchParams;
  const [game, mediaItems] = await Promise.all([getAdminGameById(id), listMedia()]);
  if (!game) notFound();

  return (
    <AdminShell title="Editar jogo" description={game.title}>
      <SavedNotice show={Boolean(saved)} />
      {error === "motivo" ? (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Informe o motivo da rejeição.
        </p>
      ) : null}
      <GameSubmissionReviewBanner game={game} />
      <GameForm
        game={game}
        mediaItems={mediaItems}
        currentCoverUrl={findMediaUrl(mediaItems, game.cover_image_id)}
        action={updateGameAction}
        deleteAction={deleteGameAction}
      />
    </AdminShell>
  );
}
