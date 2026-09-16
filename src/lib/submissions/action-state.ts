import type { SubmissionInput, SubmissionType } from "@/lib/submissions/validate";

export type SubmissionFormValues = {
  submission_type: SubmissionType;
  student: string;
  student_email: string;
  student_course: string;
  title: string;
  year: number;
  description: string;
  external_url: string;
  authorization: boolean;
  category: string;
  team: string;
  genre: string;
  platform: string;
};

export type SubmissionActionState = {
  error?: string;
  success?: string;
  values?: SubmissionFormValues;
  /** Bumps when the server returns field values so the form remounts with them. */
  restoreKey?: number;
};

export function submissionInputToFormValues(input: SubmissionInput): SubmissionFormValues {
  return {
    submission_type: input.submission_type,
    student: input.student,
    student_email: input.student_email,
    student_course: input.student_course,
    title: input.title,
    year: input.year,
    description: input.description,
    external_url: input.external_url,
    authorization: input.authorization,
    category: input.submission_type === "producao" ? input.category : "",
    team: input.submission_type === "jogo" ? input.team : "",
    genre: input.submission_type === "jogo" ? input.genre : "",
    platform: input.submission_type === "jogo" ? input.platform : "",
  };
}

export function submissionActionError(
  error: string,
  input: SubmissionInput,
): SubmissionActionState {
  return {
    error,
    values: submissionInputToFormValues(input),
    restoreKey: Date.now(),
  };
}
