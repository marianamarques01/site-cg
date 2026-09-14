import {
  courses as mockCourses,
  getCourseBySlug as mockGetCourseBySlug,
} from "@/lib/mock/courses";
import { getSupabaseOrNull } from "@/lib/data/client";
import { mapCourse } from "@/lib/data/mappers";
import type { DbCourse } from "@/lib/supabase/database.types";
import type { Course, CourseSlug } from "@/lib/mock/types";

export async function getCourses(): Promise<Course[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockCourses;

  const { data, error } = await supabase.from("courses").select("*").order("slug");

  if (error || !data?.length) return mockCourses;
  return (data as DbCourse[]).map(mapCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockGetCourseBySlug(slug);

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return mockGetCourseBySlug(slug);
  return mapCourse(data as DbCourse);
}

export type { CourseSlug };
