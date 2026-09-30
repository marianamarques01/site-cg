"use client";

import { useActionState } from "react";
import SaveStatus from "@/components/admin/SaveStatus";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, { adminInputClassName, adminTextareaClassName } from "@/components/admin/AdminField";
import type { ActionState } from "@/lib/admin/types";
import type { HomeSectionTexts, HomeTexts } from "@/lib/supabase/database.types";

type HomeTextsFormProps = {
  texts: HomeTexts;
  ctaTitle: string;
  ctaDescription: string;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

const SECTIONS: { key: "featured" | "games" | "blog"; label: string }[] = [
  { key: "featured", label: "Seção de CG (trabalhos em destaque)" },
  { key: "games", label: "Seção de Jogos" },
  { key: "blog", label: "Seção do Blog" },
];

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl text-foreground">{children}</h2>;
}

function SectionFields({ prefix, texts }: { prefix: string; texts: HomeSectionTexts }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AdminField label="Chamada (texto pequeno acima)" htmlFor={`${prefix}_kicker`}>
        <input id={`${prefix}_kicker`} name={`${prefix}_kicker`} defaultValue={texts.kicker} className={adminInputClassName} />
      </AdminField>
      <AdminField label="Texto do link" htmlFor={`${prefix}_linkLabel`}>
        <input id={`${prefix}_linkLabel`} name={`${prefix}_linkLabel`} defaultValue={texts.linkLabel} className={adminInputClassName} />
      </AdminField>
      <AdminField label="Título" htmlFor={`${prefix}_title`} hint="Use Enter para quebrar linhas.">
        <textarea id={`${prefix}_title`} name={`${prefix}_title`} rows={2} defaultValue={texts.title} className={adminTextareaClassName} />
      </AdminField>
      <AdminField label="Descrição" htmlFor={`${prefix}_description`}>
        <textarea id={`${prefix}_description`} name={`${prefix}_description`} rows={3} defaultValue={texts.description} className={adminTextareaClassName} />
      </AdminField>
    </div>
  );
}

export default function HomeTextsForm({ texts, ctaTitle, ctaDescription, action }: HomeTextsFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-12">
      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      {SECTIONS.map((section) => (
        <section key={section.key} className="flex flex-col gap-6 border-t border-border pt-10 first-of-type:border-t-0 first-of-type:pt-0">
          <GroupTitle>{section.label}</GroupTitle>
          <SectionFields prefix={section.key} texts={texts[section.key]} />
        </section>
      ))}

      <section className="flex flex-col gap-6 border-t border-border pt-10">
        <GroupTitle>Chamada final</GroupTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <AdminField label="Chamada (texto pequeno acima)" htmlFor="cta_kicker">
            <input id="cta_kicker" name="cta_kicker" defaultValue={texts.ctaKicker} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Texto do botão" htmlFor="cta_button">
            <input id="cta_button" name="cta_button" defaultValue={texts.ctaButton} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Título" htmlFor="cta_title" hint="Use Enter para quebrar linhas.">
            <textarea id="cta_title" name="cta_title" rows={2} defaultValue={ctaTitle} className={adminTextareaClassName} />
          </AdminField>
          <AdminField label="Descrição" htmlFor="cta_description">
            <textarea id="cta_description" name="cta_description" rows={3} defaultValue={ctaDescription} className={adminTextareaClassName} />
          </AdminField>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <PrimaryButton type="submit" disabled={pending}>{pending ? "Salvando…" : "Salvar textos"}</PrimaryButton>
        <SaveStatus message={state.success} pending={pending} />
      </div>
    </form>
  );
}
