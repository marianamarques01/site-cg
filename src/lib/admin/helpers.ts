import type { DbMedia } from "@/lib/supabase/database.types";

export function findMediaUrl(mediaItems: DbMedia[], id: string | null | undefined) {
  if (!id) return null;
  return mediaItems.find((item) => item.id === id)?.url ?? null;
}
