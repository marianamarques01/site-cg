import type { Game } from "./types";

export const games: Game[] = [
  {
    slug: "sinal-perdido",
    title: "Nome do Projeto",
    team: "Nome do Aluno",
    genre: "Aventura narrativa · Sci-fi",
    platform: "PC · Web",
    year: 2025,
    tone: "electric",
    description:
      "Uma operadora de rádio isolada tenta reconectar postos de escuta abandonados antes que a tempestade solar apague o sinal.",
  },
  {
    slug: "raiz-profunda",
    title: "Nome do Projeto",
    team: "Nome do Aluno",
    genre: "Puzzle · Exploração",
    platform: "PC",
    year: 2025,
    tone: "violet",
    description:
      "Puzzle de manipulação de crescimento vegetal em uma floresta vertical que reage ao ritmo do jogador.",
  },
  {
    slug: "ultimo-turno",
    title: "Nome do Projeto",
    team: "Nome do Aluno",
    genre: "Estratégia tática",
    platform: "PC",
    year: 2024,
    tone: "blue",
    description:
      "Tática por turnos ambientada em uma fábrica ocupada, onde cada ação consome energia compartilhada pela equipe.",
  },
  {
    slug: "maré-de-vidro",
    title: "Nome do Projeto",
    team: "Nome do Aluno",
    genre: "Plataforma · Atmosférico",
    platform: "PC · Console",
    year: 2024,
    tone: "mix",
    description:
      "Plataforma 2.5D sobre uma cidade litorânea congelada no tempo, com física de vidro quebradiço como mecânica central.",
  },
];

export function getGameBySlug(slug: string) {
  return games.find((game) => game.slug === slug);
}
