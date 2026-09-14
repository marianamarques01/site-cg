"use client";

import { useActionState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, { adminInputClassName, adminTextareaClassName } from "@/components/admin/AdminField";
import type { ActionState } from "@/lib/admin/types";
import type { AdminFaqItem } from "@/lib/admin/faq";

type FaqFormProps = {
  item?: AdminFaqItem;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

export default function FaqForm({ item, action, deleteAction }: FaqFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="flex flex-col gap-10">
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      <form action={formAction} className="flex flex-col gap-8">
        {item ? <input type="hidden" name="id" value={item.id} /> : null}

        <AdminField label="Ordem" htmlFor="sort_order">
          <input id="sort_order" name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={adminInputClassName} />
        </AdminField>

        <AdminField label="Pergunta" htmlFor="question">
          <input id="question" name="question" required defaultValue={item?.question ?? ""} className={adminInputClassName} />
        </AdminField>

        <AdminField label="Resposta" htmlFor="answer">
          <textarea id="answer" name="answer" required rows={5} defaultValue={item?.answer ?? ""} className={adminTextareaClassName} />
        </AdminField>

        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Salvando…" : item ? "Salvar" : "Criar pergunta"}
        </PrimaryButton>
      </form>

      {item && deleteAction ? (
        <form action={deleteAction} onSubmit={(e) => { if (!confirm("Excluir esta pergunta?")) e.preventDefault(); }}>
          <input type="hidden" name="id" value={item.id} />
          <button type="submit" className="text-sm text-red-400 hover:underline">Excluir</button>
        </form>
      ) : null}
    </div>
  );
}
