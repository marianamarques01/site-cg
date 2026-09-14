"use client";

import { useActionState, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, { adminInputClassName, adminTextareaClassName } from "@/components/admin/AdminField";
import type { ActionState } from "@/lib/admin/types";
import type { DbSiteSettings } from "@/lib/supabase/database.types";

type MarqueeItem = { label: string; href: string };

type SettingsFormProps = {
  settings: DbSiteSettings;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function SettingsForm({ settings, action }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [marquee, setMarquee] = useState<MarqueeItem[]>(
    settings.marquee_items?.length ? settings.marquee_items : [{ label: "", href: "" }],
  );

  function addMarquee() {
    setMarquee((items) => [...items, { label: "", href: "" }]);
  }

  function updateMarquee(index: number, field: keyof MarqueeItem, value: string) {
    setMarquee((items) => items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function removeMarquee(index: number) {
    setMarquee((items) => items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-10">
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="marquee_items" value={JSON.stringify(marquee)} />

        <AdminField label="E-mail de contato" htmlFor="contact_email">
          <input id="contact_email" name="contact_email" defaultValue={settings.contact_email ?? ""} className={adminInputClassName} />
        </AdminField>

        <AdminField label="Endereço" htmlFor="contact_address">
          <textarea id="contact_address" name="contact_address" rows={3} defaultValue={settings.contact_address ?? ""} className={adminTextareaClassName} />
        </AdminField>

        <AdminField label="Instagram" htmlFor="instagram">
          <input id="instagram" name="instagram" defaultValue={settings.social_links?.instagram ?? ""} className={adminInputClassName} />
        </AdminField>

        <AdminField
          label="Título do CTA (home)"
          htmlFor="cta_title"
          hint="Use Enter para quebrar linhas no headline."
        >
          <textarea
            id="cta_title"
            name="cta_title"
            rows={2}
            defaultValue={settings.cta_title ?? ""}
            className={adminTextareaClassName}
          />
        </AdminField>

        <AdminField label="Descrição do CTA" htmlFor="cta_description">
          <textarea id="cta_description" name="cta_description" rows={3} defaultValue={settings.cta_description ?? ""} className={adminTextareaClassName} />
        </AdminField>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Marquee da home</p>
            <button type="button" onClick={addMarquee} className="text-sm text-brand hover:underline">+ Item</button>
          </div>
          {marquee.map((item, index) => (
            <div key={index} className="grid gap-4 border border-border p-4 md:grid-cols-2">
              <AdminField label="Texto" htmlFor={`mq-label-${index}`}>
                <input id={`mq-label-${index}`} value={item.label} onChange={(e) => updateMarquee(index, "label", e.target.value)} className={adminInputClassName} />
              </AdminField>
              <AdminField label="Link" htmlFor={`mq-href-${index}`}>
                <input id={`mq-href-${index}`} value={item.href} onChange={(e) => updateMarquee(index, "href", e.target.value)} className={adminInputClassName} />
              </AdminField>
              <button type="button" onClick={() => removeMarquee(index)} className="text-xs text-red-400 md:col-span-2">Remover</button>
            </div>
          ))}
        </div>

        <PrimaryButton type="submit" disabled={pending}>{pending ? "Salvando…" : "Salvar configurações"}</PrimaryButton>
      </form>
    </div>
  );
}
