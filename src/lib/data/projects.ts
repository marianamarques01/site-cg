import {
  projects as mockProjects,
  getFeaturedProjects as mockGetFeaturedProjects,
  getProjectBySlug as mockGetProjectBySlug,
} from "@/lib/mock/projects";
import { getSupabaseOrNull } from "@/lib/data/client";
import { getProjectGalleryUrls } from "@/lib/data/gallery";
import { buildMediaUrlMap, pickCoverUrl } from "@/lib/data/media-map";
import { mapProject } from "@/lib/data/mappers";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { DbProject } from "@/lib/supabase/database.types";
import type { Project } from "@/lib/mock/types";
import { unstable_cache } from "next/cache";

async function mapProjectsWithCovers(rows: DbProject[]): Promise<Project[]> {
  const mediaMap = await buildMediaUrlMap(rows.map((row) => row.cover_image_id));
  return Promise.all(
    rows.map(async (row) => {
      const galleryUrls = await getProjectGalleryUrls(row.id);
      return mapProject(row, pickCoverUrl(mediaMap, row.cover_image_id), galleryUrls);
    }),
  );
}

async function fetchProjectsFromDb(): Promise<Project[] | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("year", { ascending: false });

  if (error || !data?.length) return null;
  return mapProjectsWithCovers(data as DbProject[]);
}

const getCachedProjects = unstable_cache(fetchProjectsFromDb, ["projects-list"], {
  tags: [CACHE_TAGS.projects],
});

export async function getProjects(): Promise<Project[]> {
  const data = await getCachedProjects();
  return data ?? mockProjects;
}

export async function getFeaturedProjects(count = 6): Promise<Project[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockGetFeaturedProjects(count);

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("featured_order", { ascending: true })
    .limit(count);

  if (error || !data?.length) return mockGetFeaturedProjects(count);
  return mapProjectsWithCovers(data as DbProject[]);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockGetProjectBySlug(slug);

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return mockGetProjectBySlug(slug);

  const row = data as DbProject;
  const [mediaMap, galleryUrls] = await Promise.all([
    buildMediaUrlMap([row.cover_image_id]),
    getProjectGalleryUrls(row.id),
  ]);

  return mapProject(row, pickCoverUrl(mediaMap, row.cover_image_id), galleryUrls);
}
