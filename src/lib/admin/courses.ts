import { createClient } from "@/lib/supabase/server";
import type { DbCourse } from "@/lib/supabase/database.types";

export type AdminCourse = DbCourse;

export type CourseInput = {
  name: string;
  tagline: string;
  description: string;
  modules: string[];
  faq: { question: string; answer: string }[];
};

export async function listAdminCourses(): Promise<AdminCourse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("courses").select("*").order("slug");
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminCourse[];
}

export async function getAdminCourseBySlug(slug: string): Promise<AdminCourse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminCourse | null) ?? null;
}

export async function updateCourseBySlug(slug: string, input: CourseInput): Promise<AdminCourse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .update(input)
    .eq("slug", slug)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as AdminCourse;
}
