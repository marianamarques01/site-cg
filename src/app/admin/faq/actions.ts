"use server";

import { redirect } from "next/navigation";
import { revalidateFaq } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import {
  deleteFaqById,
  getNextFaqSortOrder,
  insertFaqItem,
  updateFaqItem,
} from "@/lib/admin/faq";
import type { ActionState } from "@/lib/admin/types";

function parseFaqForm(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createFaqAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const input = parseFaqForm(formData);
  if (!input.question || !input.answer) return { error: "Pergunta e resposta são obrigatórias." };

  if (!Number.isFinite(input.sort_order)) {
    input.sort_order = await getNextFaqSortOrder();
  }

  try {
    const item = await insertFaqItem(input);
    revalidateFaq();
    redirect(`/admin/faq/${item.id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar." };
  }
}

export async function updateFaqAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Item não encontrado." };

  const input = parseFaqForm(formData);
  if (!input.question || !input.answer) return { error: "Pergunta e resposta são obrigatórias." };

  try {
    await updateFaqItem(id, input);
    revalidateFaq();
    redirect(`/admin/faq/${id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao salvar." };
  }
}

export async function deleteFaqAction(formData: FormData) {
  if (!(await requireEditorProfile())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteFaqById(id);
    revalidateFaq();
  }
  redirect("/admin/faq");
}
