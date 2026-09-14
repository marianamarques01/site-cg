import { revalidatePath, updateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "@/lib/cache/tags";

export { CACHE_TAGS };

function invalidate(cacheTag: CacheTag) {
  updateTag(cacheTag);
}

export function revalidatePosts(slug?: string) {
  invalidate(CACHE_TAGS.posts);
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
}

export function revalidateProjects(slug?: string) {
  invalidate(CACHE_TAGS.projects);
  revalidatePath("/");
  revalidatePath("/producoes");
  if (slug) revalidatePath(`/producoes/${slug}`);
  revalidatePath("/admin/producoes");
  revalidatePath("/admin/producoes/destaques");
  revalidatePath("/cursos/computacao-grafica");
  revalidatePath("/cursos/design-de-games");
}

export function revalidateGames(slug?: string) {
  invalidate(CACHE_TAGS.games);
  revalidatePath("/");
  revalidatePath("/producoes");
  if (slug) revalidatePath(`/producoes/${slug}`);
  revalidatePath("/admin/jogos");
}

export function revalidateFaq() {
  invalidate(CACHE_TAGS.faq);
  revalidatePath("/sobre");
  revalidatePath("/admin/faq");
}

export function revalidateCourses() {
  invalidate(CACHE_TAGS.courses);
  revalidatePath("/sobre");
  revalidatePath("/cursos/computacao-grafica");
  revalidatePath("/cursos/design-de-games");
  revalidatePath("/admin/cursos");
}

export function revalidateHero() {
  invalidate(CACHE_TAGS.hero);
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export function revalidateSettings() {
  invalidate(CACHE_TAGS.settings);
  revalidatePath("/sobre");
  revalidatePath("/contato");
  revalidatePath("/admin/configuracoes");
}
