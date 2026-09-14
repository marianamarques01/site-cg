import { createClient } from "@/lib/supabase/server";
import type { ContentStatus, DbPost } from "@/lib/supabase/database.types";

export type AdminPost = DbPost;

export async function listAdminPosts(): Promise<AdminPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminPost[];
}

export async function getAdminPostById(id: string): Promise<AdminPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);
  return (data as AdminPost | null) ?? null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("posts").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export type PostInput = {
  title: string;
  slug: string;
  category: string;
  published_at: string | null;
  excerpt: string;
  tone: string;
  body: string[];
  cover_image_id: string | null;
  status: ContentStatus;
};

export async function insertPost(input: PostInput): Promise<AdminPost> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").insert(input).select("*").single();

  if (error) throw new Error(error.message);
  return data as AdminPost;
}

export async function updatePost(id: string, input: PostInput): Promise<AdminPost> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").update(input).eq("id", id).select("*").single();

  if (error) throw new Error(error.message);
  return data as AdminPost;
}

export async function deletePostById(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
