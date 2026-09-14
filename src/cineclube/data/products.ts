import type { Product } from "@/cineclube/types";

/** LOJINHA — catálogo (sem pagamento por enquanto). */
export const products: Product[] = [
  {
    id: "camiseta-lua",
    name: "Camiseta Lua de Cartola",
    description:
      "Algodão orgânico, serigrafia artesanal da nossa lua mascote no peito. Roxo profundo, veste como filme de sessão da meia-noite.",
    price: 65,
    kind: "camiseta",
    color: "#614582",
  },
  {
    id: "ecobag-pelicula",
    name: "Ecobag Película",
    description:
      "Lona crua com estampa de rolo de filme desenrolando. Cabe caderno, marmita e três VHS que você jurou que ia devolver.",
    price: 45,
    kind: "ecobag",
    color: "#E0BE92",
  },
  {
    id: "adesivos-truque",
    name: "Kit Adesivos \"Truque de Méliès\"",
    description:
      "Cartela com 6 adesivos vinílicos: lua, cartola, claquete, pipoca, projetor e o carimbo oficial do clube.",
    price: 18,
    kind: "adesivo",
    color: "#089BAF",
  },
  {
    id: "poster-cineteca",
    name: "Pôster Cineteca (A2)",
    description:
      "Impressão risográfica em papel pólen 120g. A arte da nossa primeira mostra, numerada à mão. Tiragem de 50.",
    price: 55,
    kind: "poster",
    color: "#FFC585",
  },
  {
    id: "caneca-projetor",
    name: "Caneca do Projecionista",
    description:
      "Cerâmica esmaltada, 300ml. \"Silêncio, vai começar\" escrito no fundo — só aparece quando o café acaba.",
    price: 42,
    kind: "caneca",
    color: "#333268",
  },
];
