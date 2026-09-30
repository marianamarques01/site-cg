import { getSupabaseOrNull } from "@/lib/data/client";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { DbSiteSettings, HomeSectionTexts, HomeTexts } from "@/lib/supabase/database.types";
import { unstable_cache } from "next/cache";

export const DEFAULT_MARQUEE_ITEMS: DbSiteSettings["marquee_items"] = [
  { label: "MODELAGEM 3D", href: "/producoes/computacao-grafica" },
  { label: "DESIGN DE GAMES", href: "/cursos/design-de-games" },
  { label: "CONCEPT ART", href: "/producoes/computacao-grafica" },
  { label: "JOGOS", href: "/producoes/jogos" },
  { label: "COMPUTAÇÃO GRÁFICA", href: "/cursos/computacao-grafica" },
  { label: "ANIMAÇÃO", href: "/producoes/computacao-grafica" },
  { label: "POSTERS", href: "/producoes/computacao-grafica" },
  { label: "PRODUÇÕES DOS ALUNOS", href: "/producoes/computacao-grafica" },
];

export const DEFAULT_HOME_TEXTS: HomeTexts = {
  featured: {
    kicker: "Trabalhos em destaque",
    title: "Projetos\nselecionados",
    description:
      "Uma seleção de trabalhos de Computação Gráfica: modelagem, concept art, animação e peças gráficas produzidas ao longo do curso.",
    linkLabel: "Ver todos os projetos de CG",
  },
  games: {
    kicker: "Jogos dos alunos",
    title: "Jogável, jogado,\njulgado em sala.",
    description: "Protótipos e jogos completos produzidos pelos alunos de Design de Games.",
    linkLabel: "Ver todos os jogos",
  },
  blog: {
    kicker: "Blog",
    title: "Bastidores\ndos cursos.",
    description: "Conteúdo, eventos, notícias e bastidores de Computação Gráfica e Design de Games.",
    linkLabel: "Ver todos os posts",
  },
  ctaKicker: "Computação Gráfica · Design de Games",
  ctaButton: "Conhecer os cursos",
};

const DEFAULT_SETTINGS: DbSiteSettings = {
  id: 1,
  contact_email: "criativa@fumec.br",
  contact_address: "Universidade FUMEC\nRua Cobre, 200 — Cruzeiro\nBelo Horizonte, MG — CEP 30310-190",
  social_links: { instagram: "@computacaograficabh", youtube: "https://www.youtube.com/@producoescgdg" },
  marquee_items: DEFAULT_MARQUEE_ITEMS,
  cta_title: "Pronto para\nentrar em cena?",
  cta_description:
    "Imagem ou jogo: duas formações na FUMEC, um estúdio compartilhado. Escolhe a tua e vê de perto como a turma produz.",
  home_texts: DEFAULT_HOME_TEXTS,
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

function pick(value: string | undefined, fallback: string) {
  return value?.trim() ? value : fallback;
}

function resolveSection(section: Partial<HomeSectionTexts> | undefined, fallback: HomeSectionTexts): HomeSectionTexts {
  return {
    kicker: pick(section?.kicker, fallback.kicker),
    title: pick(section?.title, fallback.title),
    description: pick(section?.description, fallback.description),
    linkLabel: pick(section?.linkLabel, fallback.linkLabel),
  };
}

/** Campos vazios caem no texto padrão, para a home nunca ficar sem título. */
export function resolveHomeTexts(texts: Partial<HomeTexts> | null | undefined): HomeTexts {
  return {
    featured: resolveSection(texts?.featured, DEFAULT_HOME_TEXTS.featured),
    games: resolveSection(texts?.games, DEFAULT_HOME_TEXTS.games),
    blog: resolveSection(texts?.blog, DEFAULT_HOME_TEXTS.blog),
    ctaKicker: pick(texts?.ctaKicker, DEFAULT_HOME_TEXTS.ctaKicker),
    ctaButton: pick(texts?.ctaButton, DEFAULT_HOME_TEXTS.ctaButton),
  };
}

export async function getSiteSettings(): Promise<DbSiteSettings & { home_texts: HomeTexts }> {
  const data = await getCachedSettings();
  const settings = data ?? DEFAULT_SETTINGS;
  return {
    ...settings,
    marquee_items: resolveMarqueeItems(settings.marquee_items),
    home_texts: resolveHomeTexts(settings.home_texts),
  };
}
