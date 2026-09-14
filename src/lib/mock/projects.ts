import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "deriva-modelagem-organica",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Modelagem 3D",
    year: 2025,
    tone: "blue",
    aspect: "portrait",
    description:
      "Estudo de modelagem orgânica e sculpting em criatura submersa, do blockout ao retopo para animação.",
  },
  {
    slug: "nucleo-concept-urbano",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Concept Art",
    year: 2025,
    tone: "violet",
    aspect: "landscape",
    description:
      "Série de concept art para um distrito vertical fictício, explorando luz artificial e densidade urbana.",
  },
  {
    slug: "residuo-poster-serie",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Posters",
    year: 2024,
    tone: "electric",
    aspect: "square",
    description: "Série de pôsteres gerados a partir de simulações de fluido em tempo real.",
  },
  {
    slug: "espectro-animacao-personagem",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Animação",
    year: 2025,
    tone: "mix",
    aspect: "wide",
    description:
      "Ciclo de animação facial e corporal para personagem principal de curta autoral em produção.",
  },
  {
    slug: "silhueta-ilustracao-editorial",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Ilustração",
    year: 2024,
    tone: "violet",
    aspect: "portrait",
    description: "Ilustração editorial digital para revista acadêmica sobre cultura gamer.",
  },
  {
    slug: "orbita-modelagem-hard-surface",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Modelagem 3D",
    year: 2024,
    tone: "electric",
    aspect: "square",
    description:
      "Módulo hard-surface para estação orbital, com bake de texturas PBR e apresentação em turntable.",
  },
  {
    slug: "fragmento-concept-personagem",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Concept Art",
    year: 2023,
    tone: "blue",
    aspect: "portrait",
    description: "Exploração de silhueta e paleta para elenco de personagens de RPG tático.",
  },
  {
    slug: "eco-poster-tipografico",
    title: "Nome do Projeto",
    student: "Nome do Aluno",
    category: "Posters",
    year: 2023,
    tone: "mix",
    aspect: "landscape",
    description: "Pôster tipográfico para a mostra anual de jogos autorais da turma.",
  },
];

export function getFeaturedProjects(count = 6) {
  return projects.slice(0, count);
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
