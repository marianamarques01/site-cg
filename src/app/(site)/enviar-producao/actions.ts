"use server";

import { revalidateGames, revalidateProjects } from "@/lib/cache/revalidate";
import { PROJECT_CATEGORIES, STUDENT_COURSES } from "@/lib/admin/constants";
import { submitStudentGame } from "@/lib/submissions/submit-game";
import { submitStudentProject } from "@/lib/submissions/submit-project";
import {
  validateSubmissionInput,
  type GameSubmissionInput,
  type ProjectSubmissionInput,
  type SubmissionInput,
  type SubmissionType,
} from "@/lib/submissions/validate";

import type { SubmissionActionState } from "@/lib/submissions/action-state";

export type { SubmissionActionState };

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_GALLERY = 4;

function parseSubmissionType(raw: FormDataEntryValue | null): SubmissionType {
  return raw === "jogo" ? "jogo" : "producao";
}

function parseSubmissionForm(formData: FormData): {
  input: SubmissionInput;
  coverFile: File | null;
  galleryFiles: File[];
} {
  const submission_type = parseSubmissionType(formData.get("submission_type"));

  const base = {
    submission_type,
    student: String(formData.get("student") ?? ""),
    student_email: String(formData.get("student_email") ?? ""),
    student_course: String(formData.get("student_course") ?? ""),
    title: String(formData.get("title") ?? ""),
    year: Number(formData.get("year")),
    description: String(formData.get("description") ?? ""),
    external_url: String(formData.get("external_url") ?? ""),
    authorization: formData.get("authorization") === "on",
  };

  const input: SubmissionInput =
    submission_type === "jogo"
      ? {
          ...base,
          submission_type: "jogo",
          team: String(formData.get("team") ?? ""),
          genre: String(formData.get("genre") ?? ""),
          platform: String(formData.get("platform") ?? ""),
        }
      : {
          ...base,
          submission_type: "producao",
          category: String(formData.get("category") ?? ""),
        };

  const coverRaw = formData.get("cover_file");
  const coverFile = coverRaw instanceof File && coverRaw.size > 0 ? coverRaw : null;

  const galleryFiles = formData
    .getAll("gallery_files")
    .filter((item): item is File => item instanceof File && item.size > 0)
    .slice(0, MAX_GALLERY);

  return { input, coverFile, galleryFiles };
}

function validateFiles(
  submissionType: SubmissionType,
  coverFile: File | null,
  galleryFiles: File[],
): string | null {
  if (!coverFile) return "Envie uma imagem de capa.";
  if (!coverFile.type.startsWith("image/")) return "A capa precisa ser uma imagem.";
  if (coverFile.size > MAX_FILE_BYTES) return "A capa excede 10 MB.";

  if (submissionType === "producao") {
    for (const file of galleryFiles) {
      if (!file.type.startsWith("image/")) return "Todas as imagens extras precisam ser arquivos de imagem.";
      if (file.size > MAX_FILE_BYTES) return "Uma das imagens extras excede 10 MB.";
    }
  }

  return null;
}

export async function submitWorkAction(
  _prev: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "Envios temporariamente indisponíveis. Tente mais tarde." };
  }

  const { input, coverFile, galleryFiles } = parseSubmissionForm(formData);

  const validationError = validateSubmissionInput(input);
  if (validationError) return { error: validationError };

  const fileError = validateFiles(input.submission_type, coverFile, galleryFiles);
  if (fileError) return { error: fileError };

  if (!STUDENT_COURSES.includes(input.student_course as (typeof STUDENT_COURSES)[number])) {
    return { error: "Curso inválido." };
  }

  try {
    if (input.submission_type === "jogo") {
      await submitStudentGame(input as GameSubmissionInput, coverFile!);
      revalidateGames();
      return {
        success:
          "Jogo enviado! A equipe vai revisar e, se aprovado, ele aparecerá no showcase do site.",
      };
    }

    if (!PROJECT_CATEGORIES.includes((input as ProjectSubmissionInput).category as (typeof PROJECT_CATEGORIES)[number])) {
      return { error: "Categoria inválida." };
    }

    await submitStudentProject(input as ProjectSubmissionInput, coverFile!, galleryFiles);
    revalidateProjects();
    return {
      success:
        "Produção enviada! A equipe vai revisar e, se aprovada, ela aparecerá na galeria do site.",
    };
  } catch (error) {
    const label = input.submission_type === "jogo" ? "jogo" : "produção";
    return { error: error instanceof Error ? error.message : `Erro ao enviar ${label}.` };
  }
}

/** @deprecated Use submitWorkAction */
export const submitProjectAction = submitWorkAction;
