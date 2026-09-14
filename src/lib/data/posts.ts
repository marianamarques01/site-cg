import { posts as mockPosts, getPostBySlug as mockGetPostBySlug } from "@/lib/mock/posts";
import { getSupabaseOrNull } from "@/lib/data/client";
import { buildMediaUrlMap, pickCoverUrl } from "@/lib/data/media-map";
import { mapPost } from "@/lib/data/mappers";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { DbPost } from "@/lib/supabase/database.types";
import type { BlogPost } from "@/lib/mock/types";
import { unstable_cache } from "next/cache";

async function mapPostsWithCovers(rows: DbPost[]): Promise<BlogPost[]> {
  const mediaMap = await buildMediaUrlMap(rows.map((row) => row.cover_image_id));
  return rows.map((row) => mapPost(row, pickCoverUrl(mediaMap, row.cover_image_id)));
}

async function fetchPostsFromDb(): Promise<BlogPost[] | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data?.length) return null;
  return mapPostsWithCovers(data as DbPost[]);
}

const getCachedPosts = unstable_cache(fetchPostsFromDb, ["posts-list"], {
  tags: [CACHE_TAGS.posts],
});

export async function getPosts(): Promise<BlogPost[]> {
  const data = await getCachedPosts();
  return data ?? mockPosts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockGetPostBySlug(slug);

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return mockGetPostBySlug(slug);

  const mediaMap = await buildMediaUrlMap([(data as DbPost).cover_image_id]);
  return mapPost(data as DbPost, pickCoverUrl(mediaMap, (data as DbPost).cover_image_id));
}
