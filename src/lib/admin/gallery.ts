import { createClient } from "@/lib/supabase/server";
import type { DbMedia } from "@/lib/supabase/database.types";

export type ProjectGalleryItem = {
  id: string;
  media_id: string;
  sort_order: number;
};

export async function getProjectGalleryMediaIds(projectId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_gallery")
    .select("media_id, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.media_id as string);
}

export async function syncProjectGallery(projectId: string, mediaIds: string[]): Promise<void> {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("project_gallery")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) throw new Error(deleteError.message);

  if (mediaIds.length === 0) return;

  const rows = mediaIds.map((media_id, sort_order) => ({
    project_id: projectId,
    media_id,
    sort_order,
  }));

  const { error: insertError } = await supabase.from("project_gallery").insert(rows);
  if (insertError) throw new Error(insertError.message);
}

export async function getGalleryUrlsForProject(projectId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_gallery")
    .select("sort_order, media:media_id (url)")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data
    .map((row) => {
      const media = row.media as { url: string } | { url: string }[] | null;
      if (Array.isArray(media)) return media[0]?.url;
      return media?.url;
    })
    .filter((url): url is string => Boolean(url));
}

export async function listGalleryMediaForAdmin(
  projectId: string,
  allMedia: DbMedia[],
): Promise<DbMedia[]> {
  const ids = await getProjectGalleryMediaIds(projectId);
  return ids
    .map((id) => allMedia.find((item) => item.id === id))
    .filter((item): item is DbMedia => Boolean(item));
}
