import type { FaqItem, GalleryPhoto, Partner } from "@/cineclube/types";

/** GALERIA — mural de fotos dos encontros (placeholders duotone). */
export const gallery: GalleryPhoto[] = [
  { id: "g1", caption: "Estreia da Cineteca — casa cheia", date: "mar 2026", rotation: -3, hue: 265 },
  { id: "g2", caption: "Debate pós-sessão que virou madrugada", date: "mar 2026", rotation: 2, hue: 190 },
  { id: "g3", caption: "Oficina de roteiro no gramado", date: "abr 2026", rotation: -1.5, hue: 25 },
  { id: "g4", caption: "Fila da pipoca (recorde histórico)", date: "abr 2026", rotation: 3, hue: 340 },
  { id: "g5", caption: "Projeção em 16mm emprestada do acervo", date: "mai 2026", rotation: -2.5, hue: 145 },
  { id: "g6", caption: "Mostra de curtas dos membros", date: "mai 2026", rotation: 1.5, hue: 45 },
  { id: "g7", caption: "Cartazes da mostra colados no corredor", date: "jun 2026", rotation: -3.5, hue: 210 },
  { id: "g8", caption: "Sessão ao ar livre no pátio da FACE", date: "jun 2026", rotation: 2.5, hue: 300 },
];

/** PARCEIROS — instituições que apoiam o cineclube. */
export const partners: Partner[] = [
  {
    name: "Universidade FUMEC",
    description: "Nossa casa. Cede a Sala Google, equipamentos e o cafezinho.",
    url: "https://www.fumec.br",
  },
  {
    name: "FACE",
    description: "Faculdade que abriga as sessões e empresta as paredes para os lambes.",
  },
  {
    name: "Cinemateca Brasileira",
    description: "Fonte de cópias restauradas e inspiração de acervo.",
    url: "https://cinemateca.org.br",
  },
  {
    name: "Coletivo Riso BH",
    description: "Estúdio de risografia que imprime nossos cartazes e zines.",
  },
];

/** FAQ — perguntas frequentes. */
export const faq: FaqItem[] = [
  {
    question: "Preciso ser aluno da FUMEC para participar?",
    answer:
      "Não! As sessões são abertas a qualquer pessoa. A carteirinha de membro dá prioridade nos lugares, desconto na lojinha e voto na escolha dos ciclos — e pode ser feita por qualquer cinéfilo, de dentro ou de fora da universidade.",
  },
  {
    question: "As sessões são pagas?",
    answer:
      "Nunca. Cineclube é, por definição, exibição sem fins lucrativos. Aceitamos contribuições voluntárias para a pipoca e para a impressão dos zines.",
  },
  {
    question: "Como os filmes são escolhidos?",
    answer:
      "A curadoria propõe ciclos temáticos (um diretor, um movimento, um país) e os membros votam. Uma vez por semestre abrimos a 'tela livre', em que qualquer membro defende um filme para a programação.",
  },
  {
    question: "Posso exibir um curta que eu fiz?",
    answer:
      "Pode e deve. A Mostra de Curtas dos Membros acontece todo fim de ciclo. Inscreva qualquer coisa: terminada, inacabada, torta. A regra é ter sido feita com vontade.",
  },
  {
    question: "Tem debate depois do filme?",
    answer:
      "Quase sempre. Ninguém é obrigado a falar — mas avisamos que o debate costuma ser a melhor parte da noite.",
  },
  {
    question: "Por que 'Méliès'?",
    answer:
      "Georges Méliès era um mágico que descobriu no cinema o maior truque de todos. Achamos justo batizar o clube com o nome de quem provou que filme é, antes de tudo, encantamento.",
  },
];
