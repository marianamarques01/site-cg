"use server";

import { reorderFeaturedProjects } from "@/lib/admin/projects";
import { requireEditorProfile } from "@/lib/data/auth";
import { revalidateProjects } from "@/lib/cache/revalidate";

export async function reorderFeaturedAction(ids: string[]) {
  if (!(await requireEditorProfile())) return;
  await reorderFeaturedProjects(ids);
  revalidateProjects();
}
