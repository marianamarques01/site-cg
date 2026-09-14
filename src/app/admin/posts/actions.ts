"use server";

import { redirect } from "next/navigation";
import { revalidatePosts } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { slugify } from "@/lib/admin/slug";
import { resolveCoverImageId } from "@/lib/admin/media";
import {
  deletePostById,
  getAdminPostById,
  insertPost,
  isSlugTaken,
  updatePost,
  type PostInput,
} from "@/lib/admin/posts";
import type { ContentStatus } from "@/lib/supabase/database.types";
import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";

const TONES: PlaceholderTone[] = ["blue", "violet", "electric", "mix"];

function parseBody(raw: string): string[] {
  return raw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function parsePostForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugRaw || title);
  const category = String(formData.get("category") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const tone = String(formData.get("tone") ?? "mix") as PlaceholderTone;
  const status = String(formData.get("status") ?? "draft") as ContentStatus;
  const publishedAtRaw = String(formData.get("published_at") ?? "").trim();
  const body = parseBody(String(formData.get("body") ?? ""));

  let published_at: string | null = publishedAtRaw || null;
  if (status === "published" && !published_at) {
    published_at = new Date().toISOString().slice(0, 10);
  }
  if (status === "draft") {
    published_at = published_at || null;
  }

  return { title, slug, category, excerpt, tone, status, published_at, body };
}

function validatePostInput(input: ReturnType<typeof parsePostForm>): string | null {
  if (!input.title) return "Título é obrigatório.";
  if (!input.slug) return "Slug é obrigatório.";
  if (!input.category) return "Categoria é obrigatória.";
  if (!input.excerpt) return "Resumo é obrigatório.";
  if (!TONES.includes(input.tone as PlaceholderTone)) return "Tom inválido.";
  if (input.status !== "draft" && input.status !== "published") return "Status inválido.";
  if (input.body.length === 0) return "Adicione pelo menos um parágrafo no corpo.";
  return null;
}

export type PostActionState = {
  error?: string;
};

async function buildPostInput(
  formData: FormData,
  currentCoverId: string | null,
): Promise<PostInput> {
  const parsed = parsePostForm(formData);
  const cover_image_id = await resolveCoverImageId(formData, currentCoverId);
  return { ...parsed, cover_image_id };
}

export async function createPostAction(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const profile = await requireEditorProfile();
  if (!profile) return { error: "Sessão expirada. Faça login novamente." };

  const parsed = parsePostForm(formData);
  const validationError = validatePostInput(parsed);
  if (validationError) return { error: validationError };

  if (await isSlugTaken(parsed.slug)) {
    return { error: "Este slug já está em uso. Escolha outro." };
  }

  try {
    const post = await insertPost(await buildPostInput(formData, null));
    revalidatePosts(post.slug);
    redirect(`/admin/posts/${post.id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar post." };
  }
}

export async function updatePostAction(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const profile = await requireEditorProfile();
  if (!profile) return { error: "Sessão expirada. Faça login novamente." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Post não encontrado." };

  const existing = await getAdminPostById(id);
  if (!existing) return { error: "Post não encontrado." };

  const parsed = parsePostForm(formData);
  const validationError = validatePostInput(parsed);
  if (validationError) return { error: validationError };

  if (await isSlugTaken(parsed.slug, id)) {
    return { error: "Este slug já está em uso. Escolha outro." };
  }

  try {
    const post = await updatePost(id, await buildPostInput(formData, existing.cover_image_id));
    revalidatePosts(post.slug);
    if (existing.slug !== post.slug) revalidatePosts(existing.slug);
    redirect(`/admin/posts/${post.id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao salvar post." };
  }
}

export async function deletePostAction(formData: FormData) {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const post = id ? await getAdminPostById(id) : null;

  if (post) {
    await deletePostById(id);
    revalidatePosts(post.slug);
  }

  redirect("/admin/posts");
}
