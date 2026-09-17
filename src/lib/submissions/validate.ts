import { PROJECT_CATEGORIES, STUDENT_COURSES } from "@/lib/admin/constants";
import { validateExternalUrl } from "@/lib/submissions/external-url";

/** Checagem básica de formato (usuário@dominio.tld) — sem restrição de domínio. */
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubmissionType = "producao" | "jogo";

type BaseSubmissionInput = {
  submission_type: SubmissionType;
  student: string;
  student_email: string;
  student_course: string;
  title: string;
  year: number;
  description: string;
  external_url: string;
  authorization: boolean;
};

export type ProjectSubmissionInput = BaseSubmissionInput & {
  submission_type: "producao";
  category: string;
};

export type GameSubmissionInput = BaseSubmissionInput & {
  submission_type: "jogo";
  team: string;
  genre: string;
  platform: string;
};

export type SubmissionInput = ProjectSubmissionInput | GameSubmissionInput;

export function isValidEmail(email: string): boolean {
  return EMAIL_FORMAT.test(email.trim());
}

function validateBase(input: BaseSubmissionInput): string | null {
  if (!input.student.trim()) return "Informe seu nome.";
  if (!input.student_email.trim()) return "Informe seu e-mail.";
  if (!isValidEmail(input.student_email)) {
    return "Informe um e-mail válido.";
  }
  if (!STUDENT_COURSES.includes(input.student_course as (typeof STUDENT_COURSES)[number])) {
    return "Selecione seu curso.";
  }
  if (!input.title.trim()) return "Informe o título.";
  if (!Number.isFinite(input.year) || input.year < 2000 || input.year > 2100) {
    return "Informe um ano válido.";
  }
  if (!input.description.trim()) return "Descreva o trabalho.";
  if (input.description.trim().length < 10) {
    return "A descrição precisa ter pelo menos 10 caracteres.";
  }
  const linkError = validateExternalUrl(input.external_url);
  if (linkError) return linkError;
  if (!input.authorization) {
    return "Confirme a autorização de publicação.";
  }
  return null;
}

export function validateSubmissionInput(input: SubmissionInput): string | null {
  const baseError = validateBase(input);
  if (baseError) return baseError;

  if (input.submission_type === "producao") {
    if (!PROJECT_CATEGORIES.includes(input.category as (typeof PROJECT_CATEGORIES)[number])) {
      return "Selecione uma categoria válida.";
    }
    return null;
  }

  if (!input.genre.trim()) return "Informe o gênero do jogo.";
  if (!input.platform.trim()) return "Informe a plataforma do jogo.";
  return null;
}
