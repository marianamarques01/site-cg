"use client";

import { useActionState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminFileInput from "@/components/admin/AdminFileInput";
import AdminField, { adminInputClassName } from "@/components/admin/AdminField";
import { uploadMediaAction } from "@/app/admin/midia/actions";

export default function MediaUploadForm() {
  const [state, formAction, pending] = useActionState(uploadMediaAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-6 border border-border p-6">
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-brand">{state.success}</p> : null}

      <AdminField label="Arquivo" htmlFor="file">
        <AdminFileInput id="file" name="file" required />
      </AdminField>

      <AdminField label="Texto alternativo" htmlFor="alt">
        <input id="alt" name="alt" type="text" className={adminInputClassName} />
      </AdminField>

      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Fazer upload"}
      </PrimaryButton>
    </form>
  );
}
