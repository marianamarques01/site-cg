"use server";

import { reorderFaqItems } from "@/lib/admin/faq";
import { requireEditorProfile } from "@/lib/data/auth";
import { revalidateFaq } from "@/lib/cache/revalidate";

export async function reorderFaqAction(ids: string[]) {
  if (!(await requireEditorProfile())) return;
  await reorderFaqItems(ids);
  revalidateFaq();
}
