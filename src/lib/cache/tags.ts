export const CACHE_TAGS = {
  posts: "content-posts",
  projects: "content-projects",
  games: "content-games",
  faq: "content-faq",
  courses: "content-courses",
  hero: "content-hero",
  settings: "content-settings",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
