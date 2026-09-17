"use server";

import { revalidateGames, revalidateProjects } from "@/lib/cache/revalidate";
import { PROJECT_CATEGORIES, STUDENT_COURSES } from "@/lib/admin/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { submitStudentGame } from "@/lib/submissions/submit-game";
import { submitStudentProject } from "@/lib/submissions/submit-project";
import {
  parseSubmissionFormData,
  validateSubmissionFiles,
  type GameSubmissionInput,
  type ProjectSubmissionInput,
} from "@/lib/submissions/parse-form";
import {
  validateSubmissionInput,
} from "@/lib/submissions/validate";

import {
  submissionActionError,
  type SubmissionActionState,
} from "@/lib/submissions/action-state";

export type { SubmissionActionState };

export async function submitWorkAction(
  _prev: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !isSupabaseConfigured()) {
    return { error: "Envios temporariamente indisponíveis. Tente novamente mais tarde." };
  }

  const { input, coverFile, galleryFiles } = parseSubmissionFormData(formData);

  const validationError = validateSubmissionInput(input);
  if (validationError) return submissionActionError(validationError, input);

  const fileError = validateSubmissionFiles(input.submission_type, coverFile, galleryFiles);
  if (fileError) return submissionActionError(fileError, input);

  if (!STUDENT_COURSES.includes(input.student_course as (typeof STUDENT_COURSES)[number])) {
    return submissionActionError("Curso inválido.", input);
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
      return submissionActionError("Categoria inválida.", input);
    }

    await submitStudentProject(input as ProjectSubmissionInput, coverFile!, galleryFiles);
    revalidateProjects();
    return {
      success:
        "Produção enviada! A equipe vai revisar e, se aprovada, ela aparecerá na galeria do site.",
    };
  } catch (error) {
    const label = input.submission_type === "jogo" ? "jogo" : "produção";
    const fallback = `Erro ao enviar ${label}. Tente novamente em alguns minutos.`;
    const message = error instanceof Error && error.message.trim() ? error.message : fallback;
    console.error(`[submitWorkAction] ${label} submission failed:`, error);
    return submissionActionError(message, input);
  }
}

/** @deprecated Use submitWorkAction */
export const submitProjectAction = submitWorkAction;
