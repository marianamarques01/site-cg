"use server";

import { redirect } from "next/navigation";
import { revalidateGames } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { slugify } from "@/lib/admin/slug";
import { resolveCoverImageId } from "@/lib/admin/media";
import {
  deleteGameById,
  getAdminGameById,
  insertGame,
  isGameSlugTaken,
  updateGame,
  type GameInput,
} from "@/lib/admin/games";
import { CONTENT_STATUS_OPTIONS, TONE_OPTIONS } from "@/lib/admin/constants";
import { notifyGameSubmissionApproved } from "@/lib/email/submission-notifications";
import { normalizeExternalUrl, validateExternalUrl } from "@/lib/submissions/external-url";
import type { ActionState } from "@/lib/admin/types";
import type { ContentStatus } from "@/lib/supabase/database.types";

function parseGameForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const team = String(formData.get("team") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim();
  const platform = String(formData.get("platform") ?? "").trim();
  const year = Number(formData.get("year"));
  const tone = String(formData.get("tone") ?? "blue");
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as ContentStatus;
  const external_url_raw = String(formData.get("external_url") ?? "");
  return { title, slug, team, genre, platform, year, tone, description, status, external_url_raw };
}

function validate(input: ReturnType<typeof parseGameForm>): string | null {
  if (!input.title) return "Título é obrigatório.";
  if (!input.slug) return "Slug é obrigatório.";
  if (!input.team) return "Equipe é obrigatória.";
  if (!input.genre) return "Gênero é obrigatório.";
  if (!input.platform) return "Plataforma é obrigatória.";
  if (!Number.isFinite(input.year)) return "Ano inválido.";
  if (!input.description) return "Descrição é obrigatória.";
  if (!TONE_OPTIONS.some((t) => t.value === input.tone)) return "Tom inválido.";
  if (!CONTENT_STATUS_OPTIONS.some((s) => s.value === input.status)) return "Status inválido.";
  const linkError = validateExternalUrl(input.external_url_raw);
  if (linkError) return linkError;
  return null;
}

async function buildInput(formData: FormData, currentCoverId: string | null): Promise<GameInput> {
  const parsed = parseGameForm(formData);
  const cover_image_id = await resolveCoverImageId(formData, currentCoverId);
  const { external_url_raw, ...rest } = parsed;
  return { ...rest, cover_image_id, external_url: normalizeExternalUrl(external_url_raw) };
}

export async function createGameAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const parsed = parseGameForm(formData);
  const err = validate(parsed);
  if (err) return { error: err };
  if (await isGameSlugTaken(parsed.slug)) return { error: "Slug já em uso." };

  try {
    const input = await buildInput(formData, null);
    const game = await insertGame(input);
    revalidateGames(game.slug);
    redirect(`/admin/jogos/${game.id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar." };
  }
}

export async function updateGameAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const id = String(formData.get("id") ?? "");
  const existing = id ? await getAdminGameById(id) : null;
  if (!existing) return { error: "Jogo não encontrado." };

  const parsed = parseGameForm(formData);
  const err = validate(parsed);
  if (err) return { error: err };
  if (await isGameSlugTaken(parsed.slug, id)) return { error: "Slug já em uso." };

  try {
    const input = await buildInput(formData, existing.cover_image_id);
    const game = await updateGame(id, input);

    if (
      existing.status !== "published" &&
      game.status === "published" &&
      existing.student_email
    ) {
      await notifyGameSubmissionApproved(game);
    }

    revalidateGames(game.slug);
    if (existing.slug !== game.slug) revalidateGames(existing.slug);
    redirect(`/admin/jogos/${game.id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao salvar." };
  }
}

export async function deleteGameAction(formData: FormData) {
  if (!(await requireEditorProfile())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const game = id ? await getAdminGameById(id) : null;
  if (game) {
    await deleteGameById(id);
    revalidateGames(game.slug);
  }
  redirect("/admin/jogos");
}
