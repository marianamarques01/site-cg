import type { Film } from "@/cineclube/types";

/**
 * SESSÕES DO MÊS — troque os filmes aqui a cada ciclo.
 * `trailerUrl` abre em nova aba (troque pelos links reais dos trailers).
 * `palette` + `motif` controlam o pôster serigrafado gerado em SVG.
 */
export const films: Film[] = [
  {
    id: "viagem-a-lua",
    title: "Viagem à Lua",
    originalTitle: "Le Voyage dans la Lune",
    director: "Georges Méliès",
    year: 1902,
    duration: "14min",
    genres: ["Fantasia", "Ficção científica", "Mudo"],
    rating: "L",
    synopsis:
      "Seis astrônomos embarcam em uma cápsula disparada por um canhão gigante rumo à Lua. O filme que inventou o cinema de efeitos — e que dá nome (e alma) ao nosso cineclube. Exibição com trilha ao vivo.",
    trivia: [
      "A cópia colorida foi pintada à mão, quadro a quadro, por um ateliê de 200 mulheres.",
      "Méliès era mágico antes de ser cineasta — o cinema era, para ele, um truque a mais.",
      "O plano da cápsula no olho da Lua é uma das imagens mais reproduzidas da história do cinema.",
    ],
    trailerUrl: "https://www.youtube.com/results?search_query=le+voyage+dans+la+lune+1902",
    date: "05 AGO",
    time: "19h30",
    room: "Sala Google — FACE",
    palette: { bg: "#333268", fg: "#FBF4E8", accent: "#FFC585" },
    motif: 0,
  },
  {
    id: "limite",
    title: "Limite",
    director: "Mário Peixoto",
    year: 1931,
    duration: "2h",
    genres: ["Experimental", "Drama", "Mudo"],
    rating: "12",
    synopsis:
      "Dois homens e uma mulher à deriva num barco, sem passado e sem destino. A obra-prima experimental do cinema brasileiro, feita por um diretor de 22 anos que nunca completou outro filme.",
    trivia: [
      "Eleito diversas vezes o melhor filme brasileiro de todos os tempos.",
      "Orson Welles teria tentado (e falhado) assistir a uma cópia nos anos 1940.",
      "Restaurado pela Cinemateca Brasileira e pela World Cinema Foundation de Scorsese.",
    ],
    trailerUrl: "https://www.youtube.com/results?search_query=limite+1931+mario+peixoto",
    date: "12 AGO",
    time: "19h30",
    room: "Sala Google — FACE",
    palette: { bg: "#089BAF", fg: "#211735", accent: "#FBF4E8" },
    motif: 1,
  },
  {
    id: "bandido-luz-vermelha",
    title: "O Bandido da Luz Vermelha",
    director: "Rogério Sganzerla",
    year: 1968,
    duration: "1h 32min",
    genres: ["Marginal", "Policial", "Sátira"],
    rating: "16",
    synopsis:
      "\"Quando a gente não pode nada, a gente avacalha.\" Um faroeste sobre o Terceiro Mundo: rádio, crime, chanchada e colagem anárquica no marco zero do cinema marginal brasileiro.",
    trivia: [
      "Sganzerla tinha 21 anos quando dirigiu o filme.",
      "A narração imita programas de rádio policial sensacionalistas da época.",
      "Inspirado num criminoso real que aterrorizou São Paulo nos anos 1950.",
    ],
    trailerUrl:
      "https://www.youtube.com/results?search_query=o+bandido+da+luz+vermelha+trailer",
    date: "19 AGO",
    time: "19h30",
    room: "Sala Google — FACE",
    palette: { bg: "#8C2B2B", fg: "#FBF4E8", accent: "#FFC585" },
    motif: 2,
  },
  {
    id: "paris-texas",
    title: "Paris, Texas",
    director: "Wim Wenders",
    year: 1984,
    duration: "2h 25min",
    genres: ["Drama", "Road movie"],
    rating: "14",
    synopsis:
      "Travis surge do deserto, mudo e sem memória, e tenta reconstruir os laços com o filho e com a mulher que desapareceu. Palma de Ouro em Cannes, fotografia de Robby Müller, trilha de Ry Cooder.",
    trivia: [
      "A cena do espelho falso levou um dia inteiro para ser iluminada.",
      "Harry Dean Stanton só fala aos 26 minutos de filme.",
      "O roteiro de Sam Shepard foi terminado durante as filmagens, por telefone.",
    ],
    trailerUrl: "https://www.youtube.com/results?search_query=paris+texas+1984+trailer",
    date: "26 AGO",
    time: "19h30",
    room: "Sala Google — FACE",
    palette: { bg: "#FFC585", fg: "#211735", accent: "#089BAF" },
    motif: 3,
  },
  {
    id: "asas-do-desejo",
    title: "Asas do Desejo",
    originalTitle: "Der Himmel über Berlin",
    director: "Wim Wenders",
    year: 1987,
    duration: "2h 8min",
    genres: ["Fantasia", "Drama", "Poético"],
    rating: "12",
    synopsis:
      "Anjos sobrevoam Berlim escutando os pensamentos dos mortais — até que um deles decide cair. Sessão dupla de encerramento do ciclo Wenders, com debate após a exibição.",
    trivia: [
      "Grande parte dos diálogos foi escrita pelo poeta Peter Handke.",
      "Os anjos veem o mundo em preto e branco; os humanos, em cores.",
      "Nick Cave & The Bad Seeds aparecem tocando ao vivo no filme.",
    ],
    trailerUrl:
      "https://www.youtube.com/results?search_query=wings+of+desire+1987+trailer",
    date: "02 SET",
    time: "19h30",
    room: "Sala Google — FACE",
    palette: { bg: "#614582", fg: "#FBF4E8", accent: "#C3CEDF" },
    motif: 4,
  },
];
