import { getSupabaseOrNull } from "@/lib/data/client";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { DbSiteSettings } from "@/lib/supabase/database.types";
import { unstable_cache } from "next/cache";

export const DEFAULT_MARQUEE_ITEMS: DbSiteSettings["marquee_items"] = [
  { label: "MODELAGEM 3D", href: "/producoes" },
  { label: "DESIGN DE GAMES", href: "/cursos/design-de-games" },
  { label: "CONCEPT ART", href: "/producoes" },
  { label: "JOGOS", href: "/producoes#jogos" },
  { label: "COMPUTAÇÃO GRÁFICA", href: "/cursos/computacao-grafica" },
  { label: "ANIMAÇÃO", href: "/producoes" },
  { label: "POSTERS", href: "/producoes" },
  { label: "PRODUÇÕES DOS ALUNOS", href: "/producoes" },
];

const DEFAULT_SETTINGS: DbSiteSettings = {
  id: 1,
  contact_email: "criativa@fumec.br",
  contact_address: "Universidade FUMEC\nRua Cobre, 200 — Cruzeiro\nBelo Horizonte, MG — CEP 30310-190",
  social_links: { instagram: "@computacaograficabh", youtube: "https://www.youtube.com/@producoescgdg" },
  marquee_items: DEFAULT_MARQUEE_ITEMS,
  cta_title: "Pronto para\nentrar em cena?",
  cta_description:
    "Imagem ou jogo: duas formações na FUMEC, um estúdio compartilhado. Escolhe a tua e vê de perto como a turma produz.",
};

async function fetchSettingsFromDb(): Promise<DbSiteSettings | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return data as DbSiteSettings;
}

const getCachedSettings = unstable_cache(fetchSettingsFromDb, ["site-settings-v3"], {
  tags: [CACHE_TAGS.settings],
});

function resolveMarqueeItems(items: DbSiteSettings["marquee_items"] | undefined) {
  const valid = items?.filter((item) => item.label?.trim() && item.href?.trim()) ?? [];
  return valid.length > 0 ? valid : DEFAULT_MARQUEE_ITEMS;
}

export async function getSiteSettings(): Promise<DbSiteSettings> {
  const data = await getCachedSettings();
  const settings = data ?? DEFAULT_SETTINGS;
  return { ...settings, marquee_items: resolveMarqueeItems(settings.marquee_items) };
}
