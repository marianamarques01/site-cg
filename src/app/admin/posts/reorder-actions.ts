"use server";

import { reorderPosts } from "@/lib/admin/posts";
import { requireEditorProfile } from "@/lib/data/auth";
import { revalidatePosts } from "@/lib/cache/revalidate";

export async function reorderPostsAction(ids: string[]) {
  if (!(await requireEditorProfile())) return;
  await reorderPosts(ids);
  revalidatePosts();
}
