"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MemberCardData, MemberFormData } from "@/cineclube/types";
import { generateMemberNumber } from "@/cineclube/lib/utils";
import { SectionTitle } from "@/cineclube/components/ui/SectionTitle";
import { MemberCard } from "@/cineclube/components/membership/MemberCard";

/** Campos do formulário — declarativos para evitar repetição de JSX. */
const fields: Array<{
  name: keyof MemberFormData;
  label: string;
  type: string;
  required?: boolean;
  placeholder: string;
  half?: boolean;
}> = [
  { name: "name", label: "nome completo", type: "text", required: true, placeholder: "Georges Méliès" },
  { name: "email", label: "email", type: "email", required: true, placeholder: "voce@email.com", half: true },
  { name: "phone", label: "telefone", type: "tel", required: true, placeholder: "(31) 9 9999-9999", half: true },
  { name: "course", label: "curso", type: "text", required: true, placeholder: "Cinema e Audiovisual", half: true },
  { name: "semester", label: "período", type: "text", required: true, placeholder: "3º", half: true },
  { name: "studentId", label: "matrícula (opcional)", type: "text", placeholder: "12345678", half: true },
  { name: "instagram", label: "instagram (opcional)", type: "text", placeholder: "@seuuser", half: true },
  { name: "letterboxd", label: "letterboxd (opcional)", type: "text", placeholder: "@seuuser" },
];

/**
 * SEJA MEMBRO — formulário como ficha de inscrição datilografada.
 * Ao enviar, a carteirinha é gerada na hora (100% no navegador) com
 * nome, número de membro, QR code e foto opcional.
 *
 * Futuro backend: basta enviar `form` para uma API route antes de
 * chamar setCard — nada mais precisa mudar.
 */
export function SejaMembro() {
  const [form, setForm] = useState<Partial<MemberFormData>>({});
  const [card, setCard] = useState<MemberCardData | null>(null);

  const update = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  /** Converte a foto enviada em dataURL para desenhar no canvas. */
  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("photoDataUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = form as MemberFormData;
    setCard({
      ...data,
      memberNumber: generateMemberNumber(),
      issuedAt: new Date().toLocaleDateString("pt-BR"),
    });
  };

  return (
    <section id="membro" className="torn-edge relative overflow-hidden bg-melies-navy py-24 md:py-32">
      <div className="texture-halftone absolute inset-0 text-melies-ink/40" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-6">
        <SectionTitle kicker="junte-se ao truque" title="Seja membro" tilt={1.5} />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-melies-cream/85">
          Membro tem <span className="scribble-underline text-melies-ink">carteirinha com QR code</span>,
          voto na programação, prioridade nas sessões lotadas e desconto na
          lojinha. Custa nada — literalmente.
        </p>

        <AnimatePresence mode="wait">
          {!card ? (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -40, rotate: -2 }}
              onSubmit={handleSubmit}
              className="relative mt-12 -rotate-1 bg-melies-paper p-7 text-melies-ink shadow-poster md:p-10"
            >
              <span className="tape -top-3 left-10 rotate-[-8deg]" aria-hidden />
              <span className="tape -top-3 right-10 rotate-[10deg]" aria-hidden />

              <p className="stamp mb-8 text-[10px] text-melies-purple">
                ficha de inscrição nº ∞ · preencha à máquina ou à mão
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <label
                    key={field.name}
                    className={field.half ? "" : "md:col-span-2"}
                  >
                    <span className="mb-1 block font-melies-typewriter text-[11px] uppercase tracking-[0.2em] text-melies-ink/60">
                      {field.label} {field.required && <span className="text-melies-purple">*</span>}
                    </span>
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={(form[field.name] as string) || ""}
                      onChange={(e) => update(field.name, e.target.value)}
                      className="w-full border-b-2 border-dashed border-melies-ink/40 bg-transparent py-2 font-melies-typewriter text-base outline-none transition-colors placeholder:text-melies-ink/30 focus:border-melies-purple"
                    />
                  </label>
                ))}

                {/* foto opcional para a carteirinha */}
                <label className="md:col-span-2">
                  <span className="mb-1 block font-melies-typewriter text-[11px] uppercase tracking-[0.2em] text-melies-ink/60">
                    foto para a carteirinha (opcional)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhoto(e.target.files?.[0])}
                    className="w-full cursor-pointer border-2 border-dashed border-melies-ink/40 p-4 font-melies-typewriter text-sm file:mr-4 file:border-0 file:bg-melies-purple file:px-4 file:py-2 file:font-melies-typewriter file:text-xs file:uppercase file:tracking-widest file:text-melies-cream"
                  />
                </label>
              </div>

              <motion.button
                type="submit"
                whileHover={{ rotate: 1.5, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-9 w-full bg-melies-ink py-5 font-melies-display text-2xl uppercase tracking-wide text-melies-peach shadow-sticker transition-colors hover:text-melies-cream md:w-auto md:px-14"
              >
                Imprimir minha carteirinha ✦
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12"
            >
              {/* saudação carimbada */}
              <motion.p
                initial={{ scale: 2.4, opacity: 0, rotate: 8 }}
                animate={{ scale: 1, opacity: 1, rotate: -2 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="stamp mx-auto mb-8 block w-fit text-sm text-melies-peach"
              >
                bem-vinde ao clube, {card.name.split(" ")[0]}!
              </motion.p>

              <MemberCard data={card} />

              <button
                onClick={() => setCard(null)}
                className="mx-auto mt-8 block font-melies-typewriter text-xs uppercase tracking-widest text-melies-cream/50 underline decoration-dashed underline-offset-4 transition-colors hover:text-melies-peach"
              >
                ← corrigir dados / nova inscrição
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
