"use server";

import { redirect } from "next/navigation";
import { requireEditorProfile } from "@/lib/data/auth";
import { slugify } from "@/lib/admin/slug";
import { resolveCoverImageId } from "@/lib/admin/media";
import { syncProjectGallery } from "@/lib/admin/gallery";
import { revalidateProjects } from "@/lib/cache/revalidate";
import { notifySubmissionApproved } from "@/lib/email/submission-notifications";
import {
  deleteProjectById,
  getAdminProjectById,
  insertProject,
  isProjectSlugTaken,
  updateProject,
  type ProjectInput,
} from "@/lib/admin/projects";
import { PROJECT_STATUS_OPTIONS, TONE_OPTIONS } from "@/lib/admin/constants";
import { normalizeExternalUrl, validateExternalUrl } from "@/lib/submissions/external-url";
import type { ActionState } from "@/lib/admin/types";
import type { ContentStatus } from "@/lib/supabase/database.types";

function parseGalleryIds(formData: FormData): string[] {
  try {
    const raw = JSON.parse(String(formData.get("gallery_media_ids") ?? "[]"));
    return Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function parseProjectForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const student = String(formData.get("student") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const year = Number(formData.get("year"));
  const tone = String(formData.get("tone") ?? "blue");
  const aspect = String(formData.get("aspect") ?? "landscape");
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as ContentStatus;
  const featured = formData.get("featured") === "on";
  const featuredOrderRaw = String(formData.get("featured_order") ?? "").trim();
  const featured_order = featuredOrderRaw ? Number(featuredOrderRaw) : null;
  const external_url_raw = String(formData.get("external_url") ?? "");

  return {
    title,
    slug,
    student,
    category,
    year,
    tone,
    aspect,
    description,
    status,
    featured,
    featured_order,
    external_url_raw,
  };
}

function validate(input: ReturnType<typeof parseProjectForm>): string | null {
  if (!input.title) return "Título é obrigatório.";
  if (!input.slug) return "Slug é obrigatório.";
  if (!input.student) return "Nome do aluno é obrigatório.";
  if (!input.category) return "Categoria é obrigatória.";
  if (!Number.isFinite(input.year)) return "Ano inválido.";
  if (!input.description) return "Descrição é obrigatória.";
  if (!TONE_OPTIONS.some((t) => t.value === input.tone)) return "Tom inválido.";
  if (!PROJECT_STATUS_OPTIONS.some((option) => option.value === input.status)) return "Status inválido.";
  const linkError = validateExternalUrl(input.external_url_raw);
  if (linkError) return linkError;
  return null;
}

async function buildInput(formData: FormData, currentCoverId: string | null): Promise<ProjectInput> {
  const parsed = parseProjectForm(formData);
  const cover_image_id = await resolveCoverImageId(formData, currentCoverId);
  const { external_url_raw, ...rest } = parsed;
  return { ...rest, cover_image_id, external_url: normalizeExternalUrl(external_url_raw) };
}

export async function createProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const parsed = parseProjectForm(formData);
  const err = validate(parsed);
  if (err) return { error: err };
  if (await isProjectSlugTaken(parsed.slug)) return { error: "Slug já em uso." };

  try {
    const input = await buildInput(formData, null);
    const project = await insertProject(input);
    await syncProjectGallery(project.id, parseGalleryIds(formData));
    revalidateProjects(project.slug);
    redirect(`/admin/producoes/${project.id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar." };
  }
}

export async function updateProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireEditorProfile())) return { error: "Sessão expirada." };

  const id = String(formData.get("id") ?? "");
  const existing = id ? await getAdminProjectById(id) : null;
  if (!existing) return { error: "Produção não encontrada." };

  const parsed = parseProjectForm(formData);
  const err = validate(parsed);
  if (err) return { error: err };
  if (await isProjectSlugTaken(parsed.slug, id)) return { error: "Slug já em uso." };

  try {
    const input = await buildInput(formData, existing.cover_image_id);
    const project = await updateProject(id, input);
    await syncProjectGallery(id, parseGalleryIds(formData));

    if (
      existing.status !== "published" &&
      project.status === "published" &&
      existing.student_email
    ) {
      await notifySubmissionApproved(project);
    }

    revalidateProjects(project.slug);
    if (existing.slug !== project.slug) revalidateProjects(existing.slug);
    redirect(`/admin/producoes/${project.id}?saved=1`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao salvar." };
  }
}

export async function deleteProjectAction(formData: FormData) {
  if (!(await requireEditorProfile())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const project = id ? await getAdminProjectById(id) : null;
  if (project) {
    await deleteProjectById(id);
    revalidateProjects(project.slug);
  }
  redirect("/admin/producoes");
}
