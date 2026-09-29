"use server";

import { reorderProjects } from "@/lib/admin/projects";
import { requireEditorProfile } from "@/lib/data/auth";
import { revalidateProjects } from "@/lib/cache/revalidate";

export async function reorderProjectsAction(ids: string[]) {
  if (!(await requireEditorProfile())) return;
  await reorderProjects(ids);
  revalidateProjects();
}
