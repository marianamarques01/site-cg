import { faq as mockFaq } from "@/lib/mock/faq";
import { getSupabaseOrNull } from "@/lib/data/client";
import { mapFaqItem } from "@/lib/data/mappers";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { DbFaqItem } from "@/lib/supabase/database.types";
import type { FaqItem } from "@/lib/mock/faq";
import { unstable_cache } from "next/cache";

async function fetchFaqFromDb(): Promise<FaqItem[] | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return null;
  return (data as DbFaqItem[]).map(mapFaqItem);
}

const getCachedFaq = unstable_cache(fetchFaqFromDb, ["faq-list"], {
  tags: [CACHE_TAGS.faq],
});

export async function getFaqItems(): Promise<FaqItem[]> {
  const data = await getCachedFaq();
  return data ?? mockFaq;
}
