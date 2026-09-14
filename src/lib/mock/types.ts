import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";

export type ProjectAspect = "portrait" | "square" | "landscape" | "wide";

export type ProjectCategory =
  | "Modelagem 3D"
  | "Concept Art"
  | "Animação"
  | "Posters"
  | "Ilustração";

export type Project = {
  slug: string;
  title: string;
  student: string;
  category: ProjectCategory;
  year: number;
  tone: PlaceholderTone;
  aspect: ProjectAspect;
  description: string;
  coverUrl?: string;
  galleryUrls?: string[];
  externalUrl?: string;
};

export type Game = {
  slug: string;
  title: string;
  team: string;
  genre: string;
  platform: string;
  year: number;
  tone: PlaceholderTone;
  description: string;
  coverUrl?: string;
  externalUrl?: string;
};

export type CourseSlug = "computacao-grafica" | "design-de-games";

export type Course = {
  slug: CourseSlug;
  name: string;
  tagline: string;
  description: string;
  modules: string[];
  faq: { question: string; answer: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  tone: PlaceholderTone;
  body: string[];
  coverUrl?: string;
};
