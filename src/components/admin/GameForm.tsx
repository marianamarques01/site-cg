"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, {
  adminInputClassName,
  adminSelectClassName,
  adminTextareaClassName,
} from "@/components/admin/AdminField";
import CoverImageField from "@/components/admin/CoverImageField";
import InlinePreviewPanel from "@/components/admin/InlinePreviewPanel";
import GameInlinePreview from "@/components/admin/GameInlinePreview";
import { slugify } from "@/lib/admin/slug";
import { CONTENT_STATUS_OPTIONS, TONE_OPTIONS } from "@/lib/admin/constants";
import type { ActionState } from "@/lib/admin/types";
import type { AdminGame } from "@/lib/admin/games";
import type { DbMedia } from "@/lib/supabase/database.types";
import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";

type GameFormProps = {
  game?: AdminGame;
  mediaItems: DbMedia[];
  currentCoverUrl?: string | null;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

export default function GameForm({ game, mediaItems, currentCoverUrl, action, deleteAction }: GameFormProps) {
  const isEditing = Boolean(game);
  const [state, formAction, pending] = useActionState(action, {});
  const [title, setTitle] = useState(game?.title ?? "");
  const [slug, setSlug] = useState(game?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [team, setTeam] = useState(game?.team ?? "");
  const [year, setYear] = useState(String(game?.year ?? new Date().getFullYear()));
  const [genre, setGenre] = useState(game?.genre ?? "");
  const [platform, setPlatform] = useState(game?.platform ?? "");
  const [tone, setTone] = useState<PlaceholderTone>((game?.tone as PlaceholderTone) ?? "blue");
  const [description, setDescription] = useState(game?.description ?? "");
  const [externalUrl, setExternalUrl] = useState(game?.external_url ?? "");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(currentCoverUrl ?? null);

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  const handleCoverPreviewChange = useCallback((url: string | null) => {
    setCoverPreviewUrl(url);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {state.error ? (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{state.error}</p>
      ) : null}

      <form action={formAction} className="flex flex-col gap-8">
        {game ? <input type="hidden" name="id" value={game.id} /> : null}

        <div className="grid gap-8 md:grid-cols-2">
          <AdminField label="Título" htmlFor="title">
            <input id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Slug" htmlFor="slug">
            <input id="slug" name="slug" required value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} className={adminInputClassName} />
          </AdminField>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <AdminField label="Equipe / Aluno" htmlFor="team">
            <input id="team" name="team" required value={team} onChange={(e) => setTeam(e.target.value)} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Ano" htmlFor="year">
            <input id="year" name="year" type="number" required value={year} onChange={(e) => setYear(e.target.value)} className={adminInputClassName} />
          </AdminField>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <AdminField label="Gênero" htmlFor="genre">
            <input id="genre" name="genre" required value={genre} onChange={(e) => setGenre(e.target.value)} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Plataforma" htmlFor="platform">
            <input id="platform" name="platform" required value={platform} onChange={(e) => setPlatform(e.target.value)} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Tom" htmlFor="tone">
            <select id="tone" name="tone" value={tone} onChange={(e) => setTone(e.target.value as PlaceholderTone)} className={adminSelectClassName}>
              {TONE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </AdminField>
        </div>

        <AdminField label="Descrição" htmlFor="description">
          <textarea id="description" name="description" required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={adminTextareaClassName} />
        </AdminField>

        <AdminField label="Link externo" htmlFor="external_url">
          <input
            id="external_url"
            name="external_url"
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://…"
            className={adminInputClassName}
          />
        </AdminField>

        <CoverImageField
          mediaItems={mediaItems}
          currentCoverId={game?.cover_image_id}
          currentCoverUrl={currentCoverUrl}
          onPreviewChange={handleCoverPreviewChange}
        />

        <AdminField label="Status" htmlFor="status">
          <select id="status" name="status" defaultValue={game?.status ?? "published"} className={adminSelectClassName}>
            {CONTENT_STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </AdminField>

        <InlinePreviewPanel>
          <GameInlinePreview
            title={title}
            genre={genre}
            platform={platform}
            year={year}
            team={team}
            tone={tone}
            description={description}
            coverUrl={coverPreviewUrl}
          />
        </InlinePreviewPanel>

        <div className="flex flex-wrap items-center gap-4">
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? "Salvando…" : isEditing ? "Salvar" : "Criar jogo"}
          </PrimaryButton>
          {game ? (
            <>
              <a
                href={`/admin/preview/jogos/${game.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted underline-offset-4 hover:text-brand hover:underline"
              >
                Preview ↗
              </a>
              {game.status === "published" ? (
                <a
                  href={`/jogos/${game.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted underline-offset-4 hover:text-brand hover:underline"
                >
                  Ver no site ↗
                </a>
              ) : null}
            </>
          ) : null}
        </div>
      </form>

      {game && deleteAction ? (
        <form action={deleteAction} onSubmit={(e) => { if (!confirm("Excluir este jogo?")) e.preventDefault(); }}>
          <input type="hidden" name="id" value={game.id} />
          <button type="submit" className="text-sm text-red-400 hover:underline">Excluir jogo</button>
        </form>
      ) : null}
    </div>
  );
}
