import type { TeamMember } from "@/cineclube/types";

/**
 * QUEM SOMOS — a equipe do cineclube. Edite livremente.
 *
 * FOTOS: salve em public/team/<id>.jpg (ex: public/team/aurora.jpg).
 * CAPAS DO TOP 4: adicione `poster: "/cineclube/team/posters/arquivo.jpg"` em cada filme
 * (ou uma URL completa). Sem poster, aparece uma mini-capa tipográfica.
 */

const topFourPlaceholder = (): TeamMember["topFour"] => [
  { title: "Filme (Ano)" },
  { title: "Filme (Ano)" },
  { title: "Filme (Ano)" },
  { title: "Filme (Ano)" },
];

export const team: TeamMember[] = [
  {
    id: "aurora",
    name: "Nome",
    role: "Cargo",
    bio: "Vê três filmes por dia e jura que não é vício. Monta os ciclos temáticos e defende sessão de cinema mudo com trilha ao vivo.",
    topFour: topFourPlaceholder(),
    letterboxd: "auroravê",
    hue: 265,
  },
  {
    id: "bento",
    name: "Nome",
    role: "Cargo",
    bio: "O homem que conversa com projetores. Se a sessão começou na hora e o som está redondo, agradeça a ele.",
    topFour: topFourPlaceholder(),
    letterboxd: "bentoprojeta",
    hue: 190,
  },
  {
    id: "cecilia",
    name: "Nome",
    role: "Cargo",
    bio: "Transforma cada sessão em cartaz, zine e post. Acredita que design de cineclube tem que parecer lambe-lambe, não anúncio.",
    topFour: topFourPlaceholder(),
    letterboxd: "ceciprado",
    hue: 25,
  },
  {
    id: "dante",
    name: "Nome",
    role: "Cargo",
    bio: "Abre a roda de conversa depois do filme e não deixa ninguém sair sem opinião. Especialista em perguntas incômodas.",
    topFour: topFourPlaceholder(),
    letterboxd: "dantedebate",
    hue: 340,
  },
  {
    id: "estela",
    name: "Nome",
    role: "Cargo",
    bio: "Faz a máquina girar: reserva salas, negocia com a universidade e garante a pipoca. Coleciona ingressos de cinema desde 2012.",
    topFour: topFourPlaceholder(),
    letterboxd: "estelamar",
    hue: 145,
  },
  {
    id: "felix",
    name: "Nome",
    role: "Cargo",
    bio: "Guardião da cineteca. Sabe de cabeça o ano, o diretor e a bitola de qualquer filme que você citar. Duvide por sua conta e risco.",
    topFour: topFourPlaceholder(),
    letterboxd: "felixdoacervo",
    hue: 45,
  },
  {
    id: "gabi",
    name: "Nome",
    role: "Cargo",
    bio: "Cuida da cara do cineclube: tipografia torta, cartazes e tudo que parece impresso na gráfica da esquina.",
    topFour: topFourPlaceholder(),
    letterboxd: "gabinunes",
    hue: 310,
  },
];
