import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import type {
  DbCourse,
  DbFaqItem,
  DbGame,
  DbHeroCategory,
  DbPost,
  DbProject,
} from "@/lib/supabase/database.types";
import type { HeroCategory } from "@/lib/mock/categories";
import type { BlogPost, Course, Game, Project } from "@/lib/mock/types";
import type { FaqItem } from "@/lib/mock/faq";

function asTone(value: string): PlaceholderTone {
  if (value === "blue" || value === "violet" || value === "electric" || value === "mix") {
    return value;
  }
  return "mix";
}

export function mapPost(row: DbPost, coverUrl?: string): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.published_at ?? new Date().toISOString().slice(0, 10),
    excerpt: row.excerpt,
    tone: asTone(row.tone),
    body: row.body ?? [],
    coverUrl,
  };
}

export function mapProject(row: DbProject, coverUrl?: string, galleryUrls?: string[]): Project {
  return {
    slug: row.slug,
    title: row.title,
    student: row.student,
    category: row.category as Project["category"],
    year: row.year,
    tone: asTone(row.tone),
    aspect: row.aspect as Project["aspect"],
    description: row.description,
    coverUrl,
    galleryUrls,
    externalUrl: row.external_url ?? undefined,
  };
}

export function mapGame(row: DbGame, coverUrl?: string): Game {
  return {
    slug: row.slug,
    title: row.title,
    team: row.team,
    genre: row.genre,
    platform: row.platform,
    year: row.year,
    tone: asTone(row.tone),
    description: row.description,
    coverUrl,
    externalUrl: row.external_url ?? undefined,
  };
}

export function mapCourse(row: DbCourse): Course {
  return {
    slug: row.slug as Course["slug"],
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    modules: row.modules ?? [],
    faq: row.faq ?? [],
  };
}

export function mapFaqItem(row: DbFaqItem): FaqItem {
  return {
    question: row.question,
    answer: row.answer,
  };
}

export function mapHeroCategory(row: DbHeroCategory): HeroCategory {
  const layout = row.layout ?? {};

  return {
    id: row.id,
    label: row.label,
    href: row.href,
    tone: asTone(row.tone),
    aspect: row.aspect,
    top: String(layout.top ?? "0%"),
    left: layout.left ? String(layout.left) : undefined,
    right: layout.right ? String(layout.right) : undefined,
    width: String(layout.width ?? "10%"),
    rotate: Number(layout.rotate ?? 0),
    depth: Number(layout.depth ?? 0.5),
    fromX: String(layout.fromX ?? "0vw"),
    fromY: String(layout.fromY ?? "0vw"),
    driftX: Number(layout.driftX ?? 0),
    driftY: Number(layout.driftY ?? 0),
    order: Number(layout.order ?? row.sort_order),
    front: Boolean(layout.front),
    src: row.image_url ?? undefined,
    legacyMotion: true,
  };
}
