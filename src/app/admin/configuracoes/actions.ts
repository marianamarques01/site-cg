"use server";

import { redirect } from "next/navigation";
import { revalidateSettings } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { DEFAULT_MARQUEE_ITEMS } from "@/lib/data/settings";
import { getSiteSettings, upsertSiteSettings } from "@/lib/admin/settings";
import type { ActionState } from "@/lib/admin/types";

function parseMarquee(raw: string): { label: string; href: string }[] {
  try {
    const parsed = JSON.parse(raw) as { label: string; href: string }[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.label?.trim() && item.href?.trim());
  } catch {
    return [];
  }
}

export async function updateSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const contact_email = String(formData.get("contact_email") ?? "").trim() || null;
  const contact_address = String(formData.get("contact_address") ?? "").trim() || null;
  const instagram = String(formData.get("instagram") ?? "").trim();
  const cta_title = String(formData.get("cta_title") ?? "").trim() || null;
  const cta_description = String(formData.get("cta_description") ?? "").trim() || null;
  const marquee_items = parseMarquee(String(formData.get("marquee_items") ?? "[]"));

  try {
    await upsertSiteSettings({
      contact_email,
      contact_address,
      social_links: instagram ? { instagram } : {},
      marquee_items,
      cta_title,
      cta_description,
    });

    revalidateSettings();
    redirect("/admin/configuracoes?saved=1");
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
    social_links: { instagram: "@fumeccriativa" },
    marquee_items: DEFAULT_MARQUEE_ITEMS,
    cta_title: null,
    cta_description: null,
  });
}
