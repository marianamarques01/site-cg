"use server";

import { redirect } from "next/navigation";
import { revalidateHero } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { uploadMediaFile } from "@/lib/admin/media";
import { getAdminHeroById, updateHeroCategory } from "@/lib/admin/hero";
import { TONE_OPTIONS } from "@/lib/admin/constants";
import type { ActionState } from "@/lib/admin/types";

async function resolveHeroImageUrl(formData: FormData, currentUrl: string | null): Promise<string | null> {
  const file = formData.get("image_file");
  if (file instanceof File && file.size > 0) {
    const media = await uploadMediaFile(file);
    return media.url;
  }

  const fromLibrary = String(formData.get("image_url_select") ?? "").trim();
  if (fromLibrary) return fromLibrary;

  const manual = String(formData.get("image_url") ?? "").trim();
  if (manual) return manual;

  if (formData.get("remove_image") === "on") return null;
  return currentUrl;
}

export async function updateHeroAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const id = String(formData.get("id") ?? "");
  const existing = id ? await getAdminHeroById(id) : null;
  if (!existing) return { error: "Categoria não encontrada." };

  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const tone = String(formData.get("tone") ?? "blue");
  const sort_order = Number(formData.get("sort_order") ?? existing.sort_order);

  if (!label || !href) return { error: "Label e link são obrigatórios." };
  if (!TONE_OPTIONS.some((t) => t.value === tone)) return { error: "Tom inválido." };

  try {
    const image_url = await resolveHeroImageUrl(formData, existing.image_url);
    await updateHeroCategory(id, {
      label,
      href,
      tone,
      aspect: existing.aspect,
      image_url,
      sort_order,
      layout: existing.layout,
    });
    revalidateHero();
    redirect(`/admin/hero/${id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao salvar." };
  }
}
