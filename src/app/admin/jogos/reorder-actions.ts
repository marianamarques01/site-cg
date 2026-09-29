"use server";

import { reorderGames } from "@/lib/admin/games";
import { requireEditorProfile } from "@/lib/data/auth";
import { revalidateGames } from "@/lib/cache/revalidate";

export async function reorderGamesAction(ids: string[]) {
  if (!(await requireEditorProfile())) return;
  await reorderGames(ids);
  revalidateGames();
}
