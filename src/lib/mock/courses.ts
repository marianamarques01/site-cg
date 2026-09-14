import type { Course, CourseSlug } from "./types";

export const COURSE_TONE: Record<CourseSlug, string> = {
  "computacao-grafica": "var(--color-brand)",
  "design-de-games": "var(--color-magenta)",
};

export const COURSE_OFFICIAL_URL: Record<CourseSlug, string> = {
  "computacao-grafica": "https://processoseletivo.fumec.br/cursos/computacao-grafica/",
  "design-de-games": "https://processoseletivo.fumec.br/cursos/design-de-games/",
};

export const courses: Course[] = [
  {
    slug: "computacao-grafica",
    name: "Computação Gráfica",
    tagline: "Da malha ao render, do dado à imagem.",
    description:
      "Modelagem 3D, pipelines de renderização, simulação visual e produção de imagem técnica e artística — a base de tudo que vira mundo, produto ou tela.",
    modules: [
      "Modelagem orgânica e hard-surface",
      "Texturização e materiais PBR",
      "Iluminação e renderização",
      "Concept art e design visual",
      "Animação 3D e rigging",
      "Composição e pós-produção",
    ],
    faq: [
      {
        question: "Preciso saber desenhar?",
        answer:
          "Ajuda, mas não é pré-requisito. O curso parte do fundamento visual e evolui para ferramentas digitais — muitos alunos chegam pelo interesse em 3D e games.",
      },
      {
        question: "Quais softwares são usados?",
        answer:
          "Blender, Substance, engines de render e ferramentas de concept variam por disciplina. O foco é pipeline e princípios, não um único programa.",
      },
      {
        question: "O que sai da sala?",
        answer:
          "Modelos, renders, concept sheets, animações e peças gráficas — tudo publicável no portfólio e na mostra anual.",
      },
    ],
  },
  {
    slug: "design-de-games",
    name: "Design de Games",
    tagline: "Sistemas que viram experiência jogável.",
    description:
      "Game design, prototipagem, narrativa interativa e produção de jogos autorais do primeiro protótipo ao playtest público.",
    modules: [
      "Fundamentos de game design",
      "Prototipagem rápida",
      "Narrativa interativa",
      "Level design e pacing",
      "Arte e UI para jogos",
      "Playtest e iteração",
    ],
    faq: [
      {
        question: "Preciso programar?",
        answer:
          "Conhecimento básico ajuda, mas o curso trabalha com engines acessíveis e equipes multidisciplinares — designer, artista e programador dividem o trabalho.",
      },
      {
        question: "Os jogos são solo ou em grupo?",
        answer:
          "Ambos. Protótipos individuais nas primeiras disciplinas; projetos finais em estúdios estudantis de 3 a 5 pessoas.",
      },
      {
        question: "Para onde os jogos vão depois?",
        answer:
          "Playtests abertos, mostra anual, itch.io e este site — o objetivo é ter algo jogável e publicável, não só um documento de design.",
      },
    ],
  },
];

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}
