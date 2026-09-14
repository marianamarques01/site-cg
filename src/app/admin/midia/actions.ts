"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditorProfile } from "@/lib/data/auth";
import { deleteMediaById, uploadMediaFile, uploadMediaFiles } from "@/lib/admin/media";
import type { ActionState, MediaUploadState } from "@/lib/admin/types";

export async function uploadMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireEditorProfile();
  if (!profile) return { error: "Sessão expirada." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione um arquivo." };
  }

  try {
    const alt = String(formData.get("alt") ?? "");
    await uploadMediaFile(file, alt);
    revalidatePath("/admin/midia");
    return { success: "Upload concluído." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro no upload." };
  }
}

export async function uploadGalleryMediaAction(
  _prev: MediaUploadState,
  formData: FormData,
): Promise<MediaUploadState> {
  const profile = await requireEditorProfile();
  if (!profile) return { error: "Sessão expirada." };

  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) return { error: "Selecione ao menos uma imagem." };

  try {
    const items = await uploadMediaFiles(files);
    revalidatePath("/admin/midia");
    revalidatePath("/admin/producoes");
    return {
      success: `${items.length} ${items.length === 1 ? "imagem enviada" : "imagens enviadas"}.`,
      items,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro no upload." };
  }
}

export async function deleteMediaAction(formData: FormData) {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteMediaById(id);
    revalidatePath("/admin/midia");
  }

  redirect("/admin/midia");
}
