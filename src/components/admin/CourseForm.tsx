"use client";

import { useActionState, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, { adminInputClassName, adminTextareaClassName } from "@/components/admin/AdminField";
import type { ActionState } from "@/lib/admin/types";
import type { AdminCourse } from "@/lib/admin/courses";

type CourseFormProps = {
  course: AdminCourse;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

type FaqEntry = { question: string; answer: string };

export default function CourseForm({ course, action }: CourseFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [faqItems, setFaqItems] = useState<FaqEntry[]>(course.faq?.length ? course.faq : [{ question: "", answer: "" }]);

  function addFaq() {
    setFaqItems((items) => [...items, { question: "", answer: "" }]);
  }

  function updateFaq(index: number, field: keyof FaqEntry, value: string) {
    setFaqItems((items) => items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function removeFaq(index: number) {
    setFaqItems((items) => items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-10">
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="slug" value={course.slug} />
        <input type="hidden" name="faq" value={JSON.stringify(faqItems)} />

        <AdminField label="Nome" htmlFor="name">
          <input id="name" name="name" required defaultValue={course.name} className={adminInputClassName} />
        </AdminField>

        <AdminField label="Tagline" htmlFor="tagline">
          <input id="tagline" name="tagline" required defaultValue={course.tagline} className={adminInputClassName} />
        </AdminField>

        <AdminField label="Descrição" htmlFor="description">
          <textarea id="description" name="description" required rows={5} defaultValue={course.description} className={adminTextareaClassName} />
        </AdminField>

        <AdminField label="Módulos" htmlFor="modules" hint="Um módulo por linha.">
          <textarea id="modules" name="modules" required rows={8} defaultValue={course.modules.join("\n")} className={adminTextareaClassName} />
        </AdminField>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">FAQ do curso</p>
            <button type="button" onClick={addFaq} className="text-sm text-brand hover:underline">+ Pergunta</button>
          </div>
          {faqItems.map((item, index) => (
            <div key={index} className="grid gap-4 border border-border p-4 md:grid-cols-2">
              <AdminField label={`Pergunta ${index + 1}`} htmlFor={`faq-q-${index}`}>
                <input id={`faq-q-${index}`} value={item.question} onChange={(e) => updateFaq(index, "question", e.target.value)} className={adminInputClassName} />
              </AdminField>
              <AdminField label={`Resposta ${index + 1}`} htmlFor={`faq-a-${index}`}>
                <textarea id={`faq-a-${index}`} value={item.answer} onChange={(e) => updateFaq(index, "answer", e.target.value)} rows={3} className={adminTextareaClassName} />
              </AdminField>
              <button type="button" onClick={() => removeFaq(index)} className="text-xs text-red-400 md:col-span-2">Remover</button>
            </div>
          ))}
        </div>

        <PrimaryButton type="submit" disabled={pending}>{pending ? "Salvando…" : "Salvar curso"}</PrimaryButton>
      </form>
    </div>
  );
}
