import { createClient } from "@/lib/supabase/server";
import type { DbHeroCategory } from "@/lib/supabase/database.types";

export type AdminHeroCategory = DbHeroCategory;

export type HeroInput = {
  label: string;
  href: string;
  tone: string;
  aspect: string;
  image_url: string | null;
  sort_order: number;
  layout: Record<string, unknown>;
};

export async function listAdminHeroCategories(): Promise<AdminHeroCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminHeroCategory[];
}

export async function getAdminHeroById(id: string): Promise<AdminHeroCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminHeroCategory | null) ?? null;
}

export async function updateHeroCategory(id: string, input: HeroInput): Promise<AdminHeroCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_categories")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as AdminHeroCategory;
}
