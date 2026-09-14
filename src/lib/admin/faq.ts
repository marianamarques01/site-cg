import { createClient } from "@/lib/supabase/server";
import type { DbFaqItem } from "@/lib/supabase/database.types";

export type AdminFaqItem = DbFaqItem;

export type FaqInput = {
  question: string;
  answer: string;
  sort_order: number;
};

export async function listAdminFaqItems(): Promise<AdminFaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminFaqItem[];
}

export async function getAdminFaqById(id: string): Promise<AdminFaqItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faq_items").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminFaqItem | null) ?? null;
}

export async function getNextFaqSortOrder(): Promise<number> {
  const items = await listAdminFaqItems();
  if (items.length === 0) return 0;
  return Math.max(...items.map((item) => item.sort_order)) + 1;
}

export async function insertFaqItem(input: FaqInput): Promise<AdminFaqItem> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faq_items").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data as AdminFaqItem;
}

export async function updateFaqItem(id: string, input: FaqInput): Promise<AdminFaqItem> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("faq_items").update(input).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return data as AdminFaqItem;
}

export async function deleteFaqById(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderFaqItems(ids: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    ids.map((id, sort_order) =>
      supabase.from("faq_items").update({ sort_order }).eq("id", id),
    ),
  );
}
