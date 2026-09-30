import { createClient } from "@/lib/supabase/server";
import type { DbSiteSettings, HomeTexts } from "@/lib/supabase/database.types";

/** Só as colunas enviadas são gravadas; as demais ficam como estão. */
export type SiteSettingsInput = {
  contact_email?: string | null;
  contact_address?: string | null;
  social_links?: Record<string, string>;
  marquee_items?: { label: string; href: string }[];
  cta_title?: string | null;
  cta_description?: string | null;
  home_texts?: HomeTexts;
};

export async function getSiteSettings(): Promise<DbSiteSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DbSiteSettings | null) ?? null;
}

export async function upsertSiteSettings(input: SiteSettingsInput): Promise<DbSiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...input })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as DbSiteSettings;
}
