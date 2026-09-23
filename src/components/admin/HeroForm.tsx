"use client";

import Image from "next/image";
import { useActionState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, { adminInputClassName, adminSelectClassName } from "@/components/admin/AdminField";
import { TONE_OPTIONS } from "@/lib/admin/constants";
import type { ActionState } from "@/lib/admin/types";
import type { AdminHeroCategory } from "@/lib/admin/hero";
import type { DbMedia } from "@/lib/supabase/database.types";

type HeroFormProps = {
  category: AdminHeroCategory;
  mediaItems: DbMedia[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function HeroForm({ category, mediaItems, action }: HeroFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="flex flex-col gap-10">
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="id" value={category.id} />

        <div className="grid gap-8 md:grid-cols-2">
          <AdminField label="Texto" htmlFor="label">
            <input id="label" name="label" required defaultValue={category.label} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Link" htmlFor="href">
            <input id="href" name="href" required defaultValue={category.href} className={adminInputClassName} />
          </AdminField>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <AdminField label="Tom" htmlFor="tone">
            <select id="tone" name="tone" defaultValue={category.tone} className={adminSelectClassName}>
              {TONE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Ordem" htmlFor="sort_order">
            <input id="sort_order" name="sort_order" type="number" defaultValue={category.sort_order} className={adminInputClassName} />
          </AdminField>
        </div>

        <div className="flex flex-col gap-6 border border-border p-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Imagem</p>

          {category.image_url ? (
            <div className="relative h-32 w-32 overflow-hidden border border-border">
              <Image src={category.image_url} alt="" fill className="object-cover" sizes="128px" />
            </div>
          ) : null}

          <AdminField label="URL manual" htmlFor="image_url">
            <input id="image_url" name="image_url" defaultValue={category.image_url ?? ""} className={adminInputClassName} />
          </AdminField>

          <AdminField label="Biblioteca" htmlFor="image_url_select">
            <select id="image_url_select" name="image_url_select" defaultValue="" className={adminSelectClassName}>
              <option value="">—</option>
              {mediaItems.map((item) => (
                <option key={item.id} value={item.url}>{item.filename}</option>
              ))}
            </select>
          </AdminField>

          <AdminField label="Upload" htmlFor="image_file">
            <input id="image_file" name="image_file" type="file" accept="image/*" className={adminInputClassName} />
          </AdminField>

          {category.image_url ? (
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="remove_image" className="accent-brand" />
              Remover imagem
            </label>
          ) : null}
        </div>

        <PrimaryButton type="submit" disabled={pending}>{pending ? "Salvando…" : "Salvar"}</PrimaryButton>
      </form>
    </div>
  );
}
