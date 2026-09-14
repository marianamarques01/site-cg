import type { BlogPost } from "./types";

export const posts: BlogPost[] = [
  {
    slug: "mostra-anual-2025",
    title: "O que rolou na Mostra Anual 2025",
    category: "Eventos",
    date: "2025-11-14",
    excerpt: "Bastidores da mostra que reuniu jogos, curtas e instalações produzidos pelas turmas do ano.",
    tone: "mix",
    body: [
      "A Mostra Anual 2025 reuniu mais de quarenta trabalhos entre jogos jogáveis, curtas de animação e instalações interativas. O evento ocupou o auditório e os corredores do bloco de artes da FUMEC durante uma semana aberta ao público.",
      "Destaque para os playtests simultâneos de três estúdios estudantis de Design de Games — filas de quinze minutos e cadernos de feedback preenchidos página a página. Em Computação Gráfica, a parede de renders em formato A0 virou ponto de encontro entre ex-alunos e empresas parceiras.",
      "A curadoria do site começa a partir do que foi exibido na mostra. Se você viu algo lá e quer ver publicado aqui, manda pelo contato.",
    ],
  },
  {
    slug: "pipeline-render-tempo-real",
    title: "Como a turma estruturou um pipeline de render em tempo real",
    category: "Bastidores",
    date: "2025-09-02",
    excerpt: "Um raio-x do fluxo de trabalho usado no projeto final de Computação Gráfica.",
    tone: "blue",
    body: [
      "O projeto final de Computação Gráfica deste semestre exigia entrega em tempo real — não mais turntables offline. A turma montou um pipeline em três etapas: blockout no Blender, bake de materiais no Substance e composição final na engine escolhida pelo grupo.",
      "O gargalo apareceu cedo: texturas em 4K demais para o budget de VRAM. A solução foi atlas compartilhado entre props secundários e resolução adaptativa por distância de câmera. Documentamos o fluxo para as turmas seguintes.",
      "Este post é o primeiro de uma série de bastidores técnicos — o tipo de conteúdo que complementa o portfólio visual com o processo por trás da imagem.",
    ],
  },
  {
    slug: "playtest-publico",
    title: "O que aprendemos testando jogos com público real",
    category: "Design de Games",
    date: "2025-06-20",
    excerpt: "Notas de campo dos playtests abertos realizados pelos estúdios estudantis.",
    tone: "violet",
    body: [
      "Três estúdios estudantis abriram playtests públicos em junho. Regra: nenhum membro da equipe podia explicar o jogo antes de cinco minutos de sessão — o tutorial tinha que funcionar sozinho.",
      "O padrão que se repetiu: jogadores ignoravam HUD textual e respondiam imediatamente a affordances visuais. Jogos com ícones grandes e feedback sonoro claro retiveram sessões três vezes mais longas.",
      "As notas de campo viraram checklist para o próximo ciclo de protótipos. Publicamos aqui para quem está montando playtest pela primeira vez.",
    ],
  },
  {
    slug: "workshop-concept-art-personagens",
    title: "Workshop de concept art: do sketch ao turnaround",
    category: "Bastidores",
    date: "2025-04-08",
    excerpt: "Como a turma de Computação Gráfica montou personagens completos em um dia de oficina intensiva.",
    tone: "electric",
    body: [
      "A oficina começou com referências coladas na parede — fotos de tecido, anatomia e paletas de cor tiradas de filmes de animação. Cada dupla tinha quatro horas para sair de um thumbnail A6 até um turnaround legível em três ângulos.",
      "O truque que mais funcionou foi bloquear silhueta antes de detalhar: grupos que pulavam direto para render perdiam tempo refazendo proporções. Quem passava pelo sketch rápido em cinza chegava ao final com personagem consistente e pronto para modelagem.",
      "Alguns turnarounds viraram base para projetos da galeria. Se quiser ver o resultado visual, confere a seção de produções.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
