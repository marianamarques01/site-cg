/**
 * Tipos compartilhados do Cineclube Méliès.
 * Centralizados aqui para que dados (/data) e componentes falem a mesma língua.
 */

/** Filme exibido em uma sessão do cineclube */
export interface Film {
  id: string;
  title: string;
  originalTitle?: string;
  director: string;
  year: number;
  duration: string; // ex.: "1h 42min"
  genres: string[];
  rating: string; // classificação indicativa, ex.: "14"
  synopsis: string;
  trivia: string[]; // curiosidades
  trailerUrl: string; // URL do YouTube (embed)
  date: string; // ex.: "12 AGO"
  time: string; // ex.: "19h30"
  room: string; // ex.: "Sala Google — FACE"
  /** Paleta usada pelo pôster serigrafado gerado em SVG */
  palette: { bg: string; fg: string; accent: string };
  /** Índice do motivo gráfico do pôster (0-4) */
  motif: number;
}

/** Filme do top 4 (estilo Letterboxd) de um membro */
export interface FilmFave {
  title: string;
  /** capa do filme: caminho em /public (ex: "/cineclube/team/posters/limite.jpg") ou URL */
  poster?: string;
}

/** Membro da equipe do cineclube */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** os 4 favoritos do Letterboxd, na ordem */
  topFour: FilmFave[];
  letterboxd?: string;
  /** hue usado como cor da carta */
  hue: number;
}

/** Produto da lojinha */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  kind: "camiseta" | "ecobag" | "adesivo" | "poster" | "caneca";
  color: string;
}

/** Evento da agenda */
export interface AgendaEvent {
  id: string;
  day: string; // "23"
  month: string; // "AGO"
  title: string;
  description: string;
  time: string;
  tag: string; // ex.: "Sessão", "Debate", "Oficina"
}

/** Foto da galeria (mural) */
export interface GalleryPhoto {
  id: string;
  caption: string;
  date: string;
  rotation: number; // rotação do "polaroid" no mural
  hue: number; // usado no placeholder duotone
}

/** Pergunta do FAQ */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Parceiro / instituição */
export interface Partner {
  name: string;
  description: string;
  url?: string;
}

/** Dados do formulário "Seja membro" */
export interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  semester: string;
  studentId?: string;
  instagram?: string;
  letterboxd?: string;
  photoDataUrl?: string; // foto opcional (base64) para a carteirinha
}

/** Carteirinha gerada após o cadastro */
export interface MemberCardData extends MemberFormData {
  memberNumber: string; // ex.: "MÉL-2026-0042"
  issuedAt: string;
}
