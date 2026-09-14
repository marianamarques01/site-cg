import { createClient } from "@/lib/supabase/server";

export type AdminStats = {
  posts: number;
  drafts: number;
  projects: number;
  pendingSubmissions: number;
  pendingProjectSubmissions: number;
  pendingGameSubmissions: number;
  games: number;
  media: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [posts, drafts, projects, pendingProjectSubmissions, pendingGameSubmissions, games, media] =
    await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("games").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("games").select("*", { count: "exact", head: true }),
      supabase.from("media").select("*", { count: "exact", head: true }),
    ]);

  const pendingProjects = pendingProjectSubmissions.count ?? 0;
  const pendingGames = pendingGameSubmissions.count ?? 0;

  return {
    posts: posts.count ?? 0,
    drafts: drafts.count ?? 0,
    projects: projects.count ?? 0,
    pendingSubmissions: pendingProjects + pendingGames,
    pendingProjectSubmissions: pendingProjects,
    pendingGameSubmissions: pendingGames,
    games: games.count ?? 0,
    media: media.count ?? 0,
  };
}
