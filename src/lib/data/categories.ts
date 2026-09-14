import { HERO_CATEGORIES as mockHeroCategories } from "@/lib/mock/categories";
import { getSupabaseOrNull } from "@/lib/data/client";
import { mapHeroCategory } from "@/lib/data/mappers";
import type { DbHeroCategory } from "@/lib/supabase/database.types";
import type { HeroCategory } from "@/lib/mock/categories";

export async function getHeroCategories(): Promise<HeroCategory[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return mockHeroCategories;

  const { data, error } = await supabase
    .from("hero_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return mockHeroCategories;

  const mapped = (data as DbHeroCategory[]).map(mapHeroCategory);
  const byId = new Map(mapped.map((item) => [item.id, item]));

  // A composição do hero depende das 5 peças — evita duplicatas ou dados parciais no admin.
  if (byId.size < mockHeroCategories.length) return mockHeroCategories;

  return mockHeroCategories.map(
    (fallback) => byId.get(fallback.id) ?? fallback,
  );
}

export type { HeroCategory };
