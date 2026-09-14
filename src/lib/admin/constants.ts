import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import type { ProjectAspect, ProjectCategory } from "@/lib/mock/types";

export const TONE_OPTIONS: { value: PlaceholderTone; label: string }[] = [
  { value: "blue", label: "Azul" },
  { value: "violet", label: "Violeta" },
  { value: "electric", label: "Elétrico" },
  { value: "mix", label: "Mix" },
];

export const STUDENT_COURSES = [
  "Computação Gráfica",
  "Design de Games",
] as const;

export type StudentCourse = (typeof STUDENT_COURSES)[number];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Modelagem 3D",
  "Concept Art",
  "Animação",
  "Posters",
  "Ilustração",
];

export const PROJECT_ASPECTS: { value: ProjectAspect; label: string }[] = [
  { value: "portrait", label: "Retrato (3:4)" },
  { value: "square", label: "Quadrado" },
  { value: "landscape", label: "Paisagem (4:3)" },
  { value: "wide", label: "Wide (16:9)" },
];

export const STATUS_OPTIONS = [
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
] as const;

export const PROJECT_STATUS_OPTIONS = [
  { value: "pending", label: "Aguardando revisão" },
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
  { value: "rejected", label: "Rejeitado" },
] as const;

export const CONTENT_STATUS_OPTIONS = PROJECT_STATUS_OPTIONS;
