"use server";

import { redirect } from "next/navigation";
import { revalidateCourses } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { getAdminCourseBySlug, updateCourseBySlug } from "@/lib/admin/courses";
import type { ActionState } from "@/lib/admin/types";

function parseModules(raw: string): string[] {
  return raw.split("\n").map((m) => m.trim()).filter(Boolean);
}

function parseFaq(raw: string): { question: string; answer: string }[] {
  try {
    const parsed = JSON.parse(raw) as { question: string; answer: string }[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.question?.trim() && item.answer?.trim());
  } catch {
    return [];
  }
}

export async function updateCourseAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const modules = parseModules(String(formData.get("modules") ?? ""));
  const faq = parseFaq(String(formData.get("faq") ?? "[]"));

  if (!slug) return { error: "Curso inválido." };
  if (!name || !tagline || !description) return { error: "Preencha nome, tagline e descrição." };
  if (modules.length === 0) return { error: "Adicione pelo menos um módulo." };

  const existing = await getAdminCourseBySlug(slug);
  if (!existing) return { error: "Curso não encontrado." };

  try {
    await updateCourseBySlug(slug, { name, tagline, description, modules, faq });
    revalidateCourses();
    redirect(`/admin/cursos/${slug}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao salvar." };
  }
}
