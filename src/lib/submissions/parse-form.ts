import type {
  GameSubmissionInput,
  ProjectSubmissionInput,
  SubmissionInput,
  SubmissionType,
} from "@/lib/submissions/validate";

const MAX_GALLERY = 4;

function parseSubmissionType(raw: FormDataEntryValue | null): SubmissionType {
  return raw === "jogo" ? "jogo" : "producao";
}

export function parseSubmissionFormData(formData: FormData): {
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

export function validateSubmissionFiles(
  submissionType: SubmissionType,
  coverFile: File | null,
  galleryFiles: File[],
  maxFileBytes = 10 * 1024 * 1024,
): string | null {
  if (!coverFile) return "Envie uma imagem de capa.";
  if (!coverFile.type.startsWith("image/")) return "A capa precisa ser uma imagem.";
  if (coverFile.size > maxFileBytes) return "A capa excede 10 MB.";

  if (submissionType === "producao") {
    for (const file of galleryFiles) {
      if (!file.type.startsWith("image/")) {
        return "Todas as imagens extras precisam ser arquivos de imagem.";
      }
      if (file.size > maxFileBytes) return "Uma das imagens extras excede 10 MB.";
    }
  }

  return null;
}

export type { GameSubmissionInput, ProjectSubmissionInput };
