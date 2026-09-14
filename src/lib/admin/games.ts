import { createClient } from "@/lib/supabase/server";
import type { ContentStatus, DbGame } from "@/lib/supabase/database.types";

export type AdminGame = DbGame;
export type GameListTab = "pending" | "published" | "draft" | "rejected" | "all";

export type GameInput = {
  slug: string;
  title: string;
  team: string;
  genre: string;
  platform: string;
  year: number;
  tone: string;
  description: string;
  cover_image_id: string | null;
  status: ContentStatus;
  external_url: string | null;
};

export async function listAdminGames(tab: GameListTab = "all"): Promise<AdminGame[]> {
  const supabase = await createClient();
  let query = supabase.from("games").select("*");

  if (tab === "pending") {
    query = query.eq("status", "pending").order("submitted_at", { ascending: false });
  } else if (tab !== "all") {
    query = query.eq("status", tab).order("updated_at", { ascending: false });
  } else {
    query = query.order("updated_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminGame[];
}

export async function countGamesByStatus(status: ContentStatus): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true })
    .eq("status", status);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getAdminGameById(id: string): Promise<AdminGame | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("games").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminGame | null) ?? null;
}

export async function isGameSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("games").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function insertGame(input: GameInput): Promise<AdminGame> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("games").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data as AdminGame;
}

export async function updateGame(id: string, input: GameInput): Promise<AdminGame> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("games").update(input).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as AdminGame;
}

export async function deleteGameById(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
