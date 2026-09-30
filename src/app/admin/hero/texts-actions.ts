"use server";

import { revalidateSettings } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { upsertSiteSettings } from "@/lib/admin/settings";
import type { ActionState } from "@/lib/admin/types";
import type { HomeSectionTexts } from "@/lib/supabase/database.types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function section(formData: FormData, prefix: string): HomeSectionTexts {
  return {
    kicker: text(formData, `${prefix}_kicker`),
    title: text(formData, `${prefix}_title`),
    description: text(formData, `${prefix}_description`),
    linkLabel: text(formData, `${prefix}_linkLabel`),
  };
}

export async function updateHomeTextsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  try {
    await upsertSiteSettings({
      cta_title: text(formData, "cta_title") || null,
      cta_description: text(formData, "cta_description") || null,
      home_texts: {
        featured: section(formData, "featured"),
        games: section(formData, "games"),
        blog: section(formData, "blog"),
        ctaKicker: text(formData, "cta_kicker"),
        ctaButton: text(formData, "cta_button"),
      },
    });

    revalidateSettings();
    return { success: "Textos da home salvos." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar.";
    if (message.includes("home_texts")) {
      return { error: "O banco ainda não tem a coluna de textos da home. Rode a migração 012_home_texts.sql no Supabase." };
    }
    return { error: message };
  }
}
