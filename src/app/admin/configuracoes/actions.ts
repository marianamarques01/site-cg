"use server";

import { revalidateSettings } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { DEFAULT_MARQUEE_ITEMS } from "@/lib/data/settings";
import { getSiteSettings, upsertSiteSettings } from "@/lib/admin/settings";
import type { ActionState } from "@/lib/admin/types";

export async function updateSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const contact_email = String(formData.get("contact_email") ?? "").trim() || null;
  const contact_address = String(formData.get("contact_address") ?? "").trim() || null;
  const instagram = String(formData.get("instagram") ?? "").trim();
  const youtube = String(formData.get("youtube") ?? "").trim();

  try {
    await upsertSiteSettings({
      contact_email,
      contact_address,
      social_links: {
        ...(instagram ? { instagram } : {}),
        ...(youtube ? { youtube } : {}),
      },
    });

    revalidateSettings();
    return { success: "Alterações salvas com sucesso." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao salvar." };
  }
}

export async function ensureSettingsExist() {
  const settings = await getSiteSettings();
  if (settings) return settings;

  return upsertSiteSettings({
    contact_email: "criativa@fumec.br",
    contact_address: "Universidade FUMEC\nRua Cobre, 200 — Cruzeiro\nBelo Horizonte, MG — CEP 30310-190",
    social_links: { instagram: "@computacaograficabh", youtube: "https://www.youtube.com/@producoescgdg" },
    marquee_items: DEFAULT_MARQUEE_ITEMS,
    cta_title: null,
    cta_description: null,
  });
}
