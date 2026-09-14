import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import { withBasePath } from "@/lib/base-path";

export type HeroCategory = {
  id: string;
  label: string;
  href: string;
  tone: PlaceholderTone;
  aspect: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width: string;
  rotate: number;
  depth: number;
  fromX: string;
  fromY: string;
  driftX: number;
  driftY: number;
  order: number;
  front?: boolean;
  src?: string;
  /** Original tile entrance / scroll motion */
  legacyMotion?: boolean;
};

export const HERO_CATEGORIES: HeroCategory[] = [
  {
    id: "01",
    label: "Modelagem 3D",
    href: "/producoes",
    tone: "blue",
    aspect: "aspect-square",
    top: "32%",
    left: "4%",
    width: "14%",
    rotate: 2,
    depth: 0.65,
    fromX: "28vw",
    fromY: "4vw",
    driftX: -140,
    driftY: 40,
    order: 1,
    src: withBasePath("/categories/modelagem-3d.png"),
    legacyMotion: true,
  },
  {
    id: "02",
    label: "Concept Art",
    href: "/producoes",
    tone: "violet",
    aspect: "aspect-[4/5]",
    top: "36%",
    left: "22%",
    width: "12%",
    rotate: -3,
    depth: 0.5,
    fromX: "18vw",
    fromY: "-6vw",
    driftX: -65,
    driftY: 60,
    order: 0,
    src: withBasePath("/categories/concept-art.png"),
    legacyMotion: true,
  },
  {
    id: "03",
    label: "Posters",
    href: "/producoes",
    tone: "electric",
    aspect: "aspect-[3/4]",
    top: "30%",
    right: "22%",
    width: "13%",
    rotate: 4,
    depth: 0.72,
    fromX: "-20vw",
    fromY: "-8vw",
    driftX: 70,
    driftY: 55,
    order: 0,
    src: withBasePath("/categories/posters.png"),
    legacyMotion: true,
  },
  {
    id: "04",
    label: "Animação",
    href: "/producoes",
    tone: "electric",
    aspect: "aspect-video",
    top: "26%",
    right: "2%",
    width: "16%",
    rotate: 3,
    depth: 0.55,
    fromX: "-30vw",
    fromY: "10vw",
    driftX: 120,
    driftY: -40,
    order: 2,
    front: true,
    src: withBasePath("/categories/animacao.png"),
    legacyMotion: true,
  },
  {
    id: "05",
    label: "Jogos",
    href: "/producoes#jogos",
    tone: "mix",
    aspect: "aspect-video",
    top: "72%",
    right: "5%",
    width: "15%",
    rotate: -2,
    depth: 0.6,
    fromX: "-28vw",
    fromY: "-2vw",
    driftX: 145,
    driftY: 35,
    order: 1,
    front: true,
    src: withBasePath("/categories/jogos.png"),
    legacyMotion: true,
  },
];
