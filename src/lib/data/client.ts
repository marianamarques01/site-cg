import { getPublicClientOrNull } from "@/lib/supabase/public";

export function getSupabaseOrNull() {
  return getPublicClientOrNull();
}
