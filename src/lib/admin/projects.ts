import { createClient } from "@/lib/supabase/server";
import type { ContentStatus, DbProject } from "@/lib/supabase/database.types";

export type AdminProject = DbProject;
export type ProjectListTab = "pending" | "published" | "draft" | "rejected" | "all";

export type ProjectInput = {
  slug: string;
  title: string;
  student: string;
  category: string;
  year: number;
  tone: string;
  aspect: string;
  description: string;
  cover_image_id: string | null;
  featured: boolean;
  featured_order: number | null;
  status: ContentStatus;
  external_url: string | null;
};

export async function listAdminProjects(tab: ProjectListTab = "all"): Promise<AdminProject[]> {
  const supabase = await createClient();
  let query = supabase.from("projects").select("*");

  if (tab === "pending") {
    query = query.eq("status", "pending").order("submitted_at", { ascending: false });
  } else if (tab !== "all") {
    query = query.eq("status", tab).order("updated_at", { ascending: false });
  } else {
    query = query.order("updated_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProject[];
}

export async function countProjectsByStatus(status: ContentStatus): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", status);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getAdminProjectById(id: string): Promise<AdminProject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminProject | null) ?? null;
}

export async function isProjectSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("projects").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function insertProject(input: ProjectInput): Promise<AdminProject> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data as AdminProject;
}

export async function updateProject(id: string, input: ProjectInput): Promise<AdminProject> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").update(input).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as AdminProject;
}

export async function deleteProjectById(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listFeaturedAdminProjects(): Promise<AdminProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("featured_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProject[];
}

export async function reorderFeaturedProjects(ids: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    ids.map((id, featured_order) =>
      supabase.from("projects").update({ featured: true, featured_order }).eq("id", id),
    ),
  );
}
