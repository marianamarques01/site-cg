import { getSupabaseOrNull } from "@/lib/data/client";

export async function buildMediaUrlMap(
  ids: (string | null | undefined)[],
): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter(Boolean))] as string[];
  const supabase = getSupabaseOrNull();

  if (!supabase || unique.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase.from("media").select("id, url").in("id", unique);
  if (error || !data) return new Map();

  return new Map(data.map((row) => [row.id, row.url]));
}

export function pickCoverUrl(
  map: Map<string, string>,
  coverImageId: string | null | undefined,
): string | undefined {
  if (!coverImageId) return undefined;
  return map.get(coverImageId);
}
