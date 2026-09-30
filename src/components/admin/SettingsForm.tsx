"use client";

import { useActionState } from "react";
import SaveStatus from "@/components/admin/SaveStatus";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, { adminInputClassName, adminTextareaClassName } from "@/components/admin/AdminField";
import type { ActionState } from "@/lib/admin/types";
import type { DbSiteSettings } from "@/lib/supabase/database.types";

type SettingsFormProps = {
  settings: DbSiteSettings;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function SettingsForm({ settings, action }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="flex flex-col gap-10">
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      <form action={formAction} className="flex flex-col gap-8">
        <AdminField label="E-mail de contato" htmlFor="contact_email">
          <input id="contact_email" name="contact_email" defaultValue={settings.contact_email ?? ""} className={adminInputClassName} />
        </AdminField>

        <AdminField label="Endereço" htmlFor="contact_address">
          <textarea id="contact_address" name="contact_address" rows={3} defaultValue={settings.contact_address ?? ""} className={adminTextareaClassName} />
        </AdminField>

        <AdminField label="Instagram" htmlFor="instagram" hint="@usuario ou link completo.">
          <input id="instagram" name="instagram" defaultValue={settings.social_links?.instagram ?? ""} className={adminInputClassName} />
        </AdminField>

        <AdminField label="YouTube" htmlFor="youtube" hint="Link do canal, ex.: https://www.youtube.com/@canal">
          <input id="youtube" name="youtube" defaultValue={settings.social_links?.youtube ?? ""} className={adminInputClassName} />
        </AdminField>

        <PrimaryButton type="submit" disabled={pending}>{pending ? "Salvando…" : "Salvar configurações"}</PrimaryButton>
        <SaveStatus message={state.success} pending={pending} />
      </form>
    </div>
  );
}
