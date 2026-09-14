import { getSupabaseOrNull } from "@/lib/data/client";
import { buildMediaUrlMap } from "@/lib/data/media-map";

export async function getProjectGalleryUrls(projectId: string): Promise<string[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("project_gallery")
    .select("media_id, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return [];

  const mediaMap = await buildMediaUrlMap(data.map((row) => row.media_id as string));
  return data
    .map((row) => mediaMap.get(row.media_id as string))
    .filter((url): url is string => Boolean(url));
}
