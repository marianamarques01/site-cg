"use server";

import { redirect } from "next/navigation";
import { deleteHeroCategoryById, reorderHeroCategories } from "@/lib/admin/hero";
import { requireEditorProfile } from "@/lib/data/auth";
import { revalidateHero } from "@/lib/cache/revalidate";

export async function reorderHeroAction(ids: string[]) {
  if (!(await requireEditorProfile())) return;
  await reorderHeroCategories(ids);
  revalidateHero();
}

export async function deleteHeroAction(formData: FormData) {
  if (!(await requireEditorProfile())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteHeroCategoryById(id);
    revalidateHero();
  }
  redirect("/admin/hero");
}
