import { games as mockGames, getGameBySlug as mockGetGameBySlug } from "@/lib/mock/games";
import { getSupabaseOrNull } from "@/lib/data/client";
import { buildMediaUrlMap, pickCoverUrl } from "@/lib/data/media-map";
import { mapGame } from "@/lib/data/mappers";
import type { DbGame } from "@/lib/supabase/database.types";
import type { Game } from "@/lib/mock/types";

async function mapGamesWithCovers(rows: DbGame[]): Promise<Game[]> {
  const mediaMap = await buildMediaUrlMap(rows.map((row) => row.cover_image_id));
  return rows.map((row) => mapGame(row, pickCoverUrl(mediaMap, row.cover_image_id)));
}

export async function getGames(): Promise<Game[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockGames;

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "published")
    .order("year", { ascending: false });

  if (error || !data?.length) return mockGames;
  return mapGamesWithCovers(data as DbGame[]);
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockGetGameBySlug(slug);

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return mockGetGameBySlug(slug);

  const mediaMap = await buildMediaUrlMap([(data as DbGame).cover_image_id]);
  return mapGame(data as DbGame, pickCoverUrl(mediaMap, (data as DbGame).cover_image_id));
}
